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

// RequestBody is the common request body needed in different functions
type RequestBody struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

func createTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	_, ok := models.GetTopicWithTitle(body.Title)
	if ok {
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

	topic, ok := models.GetTopicWithID(topicID)
	if !ok {
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
	topicURL := c.Param("url")

	topic, ok := models.GetTopicWithURL(topicURL)
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	posts, ok := models.GetPostsRelatedToTopic(topic)
	if !ok {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"topic": topic.Serialize(),
		"posts": models.SerializePosts(posts),
	})
}

func getTopics(c *gin.Context) {
	topics, ok := models.GetAllTopics()
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, models.SerializeTopics(topics))
}

func updateTopic(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)
	topicID := c.Param("id")

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	topic, ok := models.GetTopicWithID(topicID)
	if !ok {
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
	user := c.MustGet("user").(User)

	topics, ok := models.GetAllUsersTopics(user)
	if !ok {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, models.SerializeTopics(topics))
}
