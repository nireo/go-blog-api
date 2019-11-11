package auth

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes adds auth to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", register)
	}
}
