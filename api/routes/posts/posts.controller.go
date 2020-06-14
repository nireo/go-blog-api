package posts

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
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

// JSON type alias
type JSON = common.JSON

// function for checking if topic is valid
func checkIfValid(topic string) bool {
	valid := false
	for _, v := range topics {
		if v == topic {
			valid = true
		}
	}
	return valid
}

func create(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	type ParagraphJSON struct {
		Type    string `json:"type" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	type RequestBody struct {
		Text        string          `json:"text" binding:"required"`
		Title       string          `json:"title" binding:"required"`
		Description string          `json:"description" binding:"required"`
		Topic       string          `json:"topic"`
		ImageURL    string          `json:"imageURL" binding:"required"`
		Paragraphs  []ParagraphJSON `json:"paragraphs" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// take title, description and text from body, but set likes to 0
	post := Post{
		Text:        requestBody.Text,
		User:        user,
		Title:       requestBody.Title,
		Likes:       0,
		Description: requestBody.Description,
		Topic:       requestBody.Topic,
		ImageURL:    requestBody.ImageURL,
		UUID:        common.CreateUUID(),
	}

	db.NewRecord(post)
	db.Create(&post)

	// create database entries for paragraphs
	for index := range requestBody.Paragraphs {
		newParagraph := Paragraph{
			Type:    requestBody.Paragraphs[index].Type,
			Content: requestBody.Paragraphs[index].Content,
		}

		db.NewRecord(newParagraph)
		db.Create(&newParagraph)
	}

	c.JSON(http.StatusOK, post.Serialize())
}

func list(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var posts []Post
	topic := c.DefaultQuery("topic", "none")
	if topic != "none" {
		if err := db.Preload("User").Where("topic = ?", topic).Limit(10).Find(&posts).Error; err != nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		serialized := make([]JSON, len(posts), len(posts))
		for index := range posts {
			serialized[index] = posts[index].Serialize()
		}

		c.JSON(http.StatusOK, serialized)
		return
	}

	if err := db.Preload("User").Find(&posts).Limit(10).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	serialized := make([]JSON, len(posts), len(posts))
	for index := range posts {
		serialized[index] = posts[index].Serialize()
	}

	c.JSON(http.StatusOK, serialized)
	return
}

func postFromID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	var post Post
	if err := db.Set("gorm:auto_preload", true).Where("id = ?", id).First(&post).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	var paragraphs []Paragraph
	if err := db.Model(&post).Related(&paragraphs).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"post":       post.Serialize(),
		"paragraphs": models.SerializeParagraphs(paragraphs),
	})
}

func update(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	user := c.MustGet("user").(User)

	if id == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

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

	var post Post
	if err := db.Preload("User").Where("uuid = ?", id).First(&post).Error; err != nil {
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
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("postId")

	var post Post
	if err := db.Preload("User").Where("uuid = ?", id).First(&post).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	post.Likes = post.Likes + 1
	db.Save(&post)
	c.JSON(http.StatusOK, post.Serialize())
}

func remove(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	user := c.MustGet("user").(User)

	var post Post
	if err := db.Where("uuid = ?", id).First(&post).Error; err != nil {
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
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	var posts []Post
	if err := db.Model(&user).Related(&posts).Error; err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	serialized := make([]JSON, len(posts), len(posts))
	for index := range posts {
		serialized[index] = posts[index].Serialize()
	}

	c.JSON(http.StatusOK, serialized)
}

// add new paragraph at the end of the content
func addNewParagraph(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
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

	var post Post
	if err := db.Where("uuid = ?", postID).First(&post).Error; err != nil {
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
	db := c.MustGet("db").(*gorm.DB)
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
	db := c.MustGet("db").(*gorm.DB)
	search := c.Param("search")

	var posts []Post
	if err := db.Where("title LIKE ?", search).Find(&posts).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	serializedPosts := make([]JSON, len(posts), len(posts))
	for index := range posts {
		serializedPosts[index] = posts[index].Serialize()
	}

	c.JSON(http.StatusOK, serializedPosts)
}
