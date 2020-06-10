package topic

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
)

// Topic model alias
type Topic = models.Topic

// Post model alias
type Post = models.Post

// User model alias
type User = models.User

// JSON alias
type JSON = common.JSON

func createTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	type RequestBody struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if that topic already exists
	var topic Topic
	if err := db.Where("title", body.Title).First(&topic).Error; err == nil {
		c.AbortWithStatus(http.StatusConflict)
		return
	}

	newTopic := Topic{
		URL:         common.FormatString(body.Title),
		Description: body.Description,
		Title:       body.Title,
		UUID:        common.CreateUUID(),
		UserID:      user.ID,
	}

	db.NewRecord(newTopic)
	db.Save(&newTopic)

	c.JSON(http.StatusOK, newTopic.Serialize())
}

func deleteTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)
	topicID := c.Param("id")

	var topic Topic
	if err := db.Where("uuid = ?", topicID).First(&topic).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if user.ID != topic.UserID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	db.Delete(&topic)
	c.Status(http.StatusNoContent)
}

func getSingleTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	topicURL := c.Param("url")

	var topic Topic
	if err := db.Where("url = ?", topicURL).First(&topic).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	// get posts in the same category
	var posts []Post
	if err := db.Model(&topic).Related(&posts).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	serializedPosts := make([]JSON, len(posts), len(posts))
	for index := range posts {
		serializedPosts[index] = posts[index].Serialize()
	}

	c.JSON(http.StatusOK, gin.H{
		"topic": topic.Serialize(),
		"posts": serializedPosts,
	})
}

func getTopics(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	var topics []Topic
	if err := db.Find(&topics).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	serializedTopics := make([]JSON, len(topics), len(topics))
	for index := range topics {
		serializedTopics[index] = topics[index].Serialize()
	}

	c.JSON(http.StatusOK, serializedTopics)
}

func updateTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	// topicID is only visible to the owner, so we can use it instead of the URL
	topicID := c.Param("id")

	type RequestBody struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	var topic Topic
	if err := db.Where("uuid = ?", topicID).First(&topic).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if user.ID != topic.UserID {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	topic.URL = common.FormatString(body.Title)
	topic.Title = body.Title
	topic.Description = body.Description

	db.Save(&topic)
	c.JSON(http.StatusOK, topic.Serialize())
}

func getUserTopics(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	var topics []Topic
	if err := db.Model(&user).Related(&topics).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	serializedTopics := make([]JSON, len(topics), len(topics))
	for index := range topics {
		serializedTopics[index] = topics[index].Serialize()
	}

	c.JSON(http.StatusOK, serializedTopics)
}
