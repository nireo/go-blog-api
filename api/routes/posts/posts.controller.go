package posts

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
)

// Define topics, so we can check if the topic given in request is valid
var topics = [5]string{"programming", "ai", "fitness", "self-improvement", "technology"}

// Post type alias
type Post = models.Post

// User type alias
type User = models.User

// Paragraph type alias
type Paragraph = models.Paragraph

// Topic model alias
type Topic = models.Topic

// JSON type alias
type JSON = common.JSON

// function for checking if topic is valid
func checkIfValid(topic string) bool {
	valid := false
	for _, value := range topics {
		if value == topic {
			valid = true
		}
	}
	return valid
}

func create(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)

	type ParagraphJSON struct {
		Type    string `json:"type" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	type RequestBody struct {
		Title       string          `json:"title" binding:"required"`
		Description string          `json:"description" binding:"required"`
		ImageURL    string          `json:"imageURL" binding:"required"`
		Topic       string          `json:"topic" binding:"required"`
		Paragraphs  []ParagraphJSON `json:"paragraphs" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	topic, err := models.FindOneTopic(&Topic{URL: requestBody.Title})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	// take title, description and text from body, but set likes to 0
	post := Post{
		User:        user,
		Title:       requestBody.Title,
		Likes:       0,
		Description: requestBody.Description,
		ImageURL:    requestBody.ImageURL,
		UUID:        common.CreateUUID(),
		Topic:       topic,
		TopicID:     topic.ID,
	}

	db.NewRecord(post)
	db.Create(&post)

	// create database entries for paragraphs
	for index := range requestBody.Paragraphs {
		newParagraph := Paragraph{
			Type:    requestBody.Paragraphs[index].Type,
			Content: requestBody.Paragraphs[index].Content,
			PostID:  post.ID,
			UUID:    common.CreateUUID(),
		}

		db.NewRecord(newParagraph)
		db.Create(&newParagraph)
	}

	c.JSON(http.StatusOK, post.Serialize())
}

func list(c *gin.Context) {
	posts, ok := models.GetPosts(0, 10)
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, models.SerializePosts(posts))
}

func postFromID(c *gin.Context) {
	postID := c.Param("id")

	post, err := models.FindOnePost(&Post{UUID: postID})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	paragraphs, ok := models.GetParagraphsRelatedToPost(post)
	if !ok {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"post":       post.Serialize(),
		"paragraphs": models.SerializeParagraphs(paragraphs),
	})
}

func update(c *gin.Context) {
	db := common.GetDatabase()
	postID := c.Param("id")
	user := c.MustGet("user").(User)

	type ParagraphJSON struct {
		Type    string `json:"type" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	type RequestBody struct {
		Text        string          `json:"text" binding:"required"`
		Title       string          `json:"title" binding:"required"`
		Description string          `json:"description" binding:"required"`
		Paragraphs  []ParagraphJSON `json:"paragraphs" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	post, err := models.FindOnePost(&Post{UUID: postID})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if post.UserID != user.ID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	post.Text = requestBody.Text
	post.Title = requestBody.Title
	post.Description = requestBody.Description

	db.Save(&post)
	c.JSON(http.StatusOK, post.Serialize())
}

func handleLike(c *gin.Context) {
	db := common.GetDatabase()
	postID := c.Param("postId")

	post, err := models.FindOnePost(&Post{UUID: postID})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}

	post.Likes = post.Likes + 1
	db.Save(&post)
	c.JSON(http.StatusOK, post.Serialize())
}

func remove(c *gin.Context) {
	db := common.GetDatabase()
	postID := c.Param("id")
	user := c.MustGet("user").(User)

	post, err := models.FindOnePost(&Post{UUID: postID})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if post.UserID != user.ID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	db.Delete(&post)
	c.Status(http.StatusForbidden)
}

func yourBlogs(c *gin.Context) {
	user := c.MustGet("user").(User)

	posts, ok := models.GetPostsFromUser(user)
	if !ok {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, models.SerializePosts(posts))
}

// add new paragraph at the end of the content
func addNewParagraph(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)
	postID := c.Param("id")

	type RequestBody struct {
		Type    string `json:"type" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	post, err := models.FindOnePost(&Post{UUID: postID})
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if post.UserID != user.ID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	newParagraph := Paragraph{
		Type:    requestBody.Type,
		Content: requestBody.Content,
	}

	db.NewRecord(newParagraph)
	db.Save(&newParagraph)

	c.JSON(http.StatusOK, newParagraph.Serialize())
}

func deleteParagraph(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)
	paragraphID := c.Param("id")

	var paragraph Paragraph
	if err := db.Where("uuid = ?", paragraphID).First(&paragraph).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	// find the post paragraph is in, so that we can check for ownership
	var post Post
	if err := db.Where("id = ?", paragraph.PostID).First(&post).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if user.ID != post.UserID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	db.Delete(&paragraph)
	c.Status(http.StatusNoContent)
}

func searchForPost(c *gin.Context) {
	db := common.GetDatabase()
	search := c.Param("search")

	var posts []Post
	if err := db.Where("title LIKE ?", search).Find(&posts).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, models.SerializePosts(posts))
}
