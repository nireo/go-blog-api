package user

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/database/models"
)

// User model alias
type User = models.User

func userFromID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	username := c.Param("id")

	var user User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		return
	}

	c.JSON(200, user.Serialize())
}
