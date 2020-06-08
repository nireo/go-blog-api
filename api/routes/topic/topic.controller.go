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
	topicID := c.Param("id")

	var topic Topic
	if err := db.Where("uuid = ?", topicID).First(&topic).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, topic.Serialize())
}
