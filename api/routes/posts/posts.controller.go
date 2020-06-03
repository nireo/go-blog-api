package posts

import (
	"fmt"
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

	// interface fro request
	type RequestBody struct {
		Text        string `json:"text" binding:"required"`
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Topic       string `json:"topic" binding:"required"`
		ImageURL    string `json:"imageURL" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		fmt.Println(err)
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

	c.JSON(http.StatusOK, post.Serialize())
}

func update(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")
	user := c.MustGet("user").(User)

	if id == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	type RequestBody struct {
		Text        string `json:"text" binding:"required"`
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
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
