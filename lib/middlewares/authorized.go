package middlewares

import "github.com/gin-gonic/gin"

// Authorized is used for blocking unauthorized requests
func Authorized(c *gin.Context) {
	_, exists := c.Get("user")
	if !exists {
		c.AbortWithStatus(401)
		return
	}
}
