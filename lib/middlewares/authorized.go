package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Authorized is used for blocking unauthorized requests
func Authorized(c *gin.Context) {
	_, exists := c.Get("user")
	if !exists {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}
}
