package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/lib/middlewares"
)

// ApplyRoutes adds auth to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", register)
		auth.POST("/login", login)
		auth.GET("/check", check)
		auth.PATCH("/update", middlewares.Authorized, updateUser)
		auth.DELETE("/:id", middlewares.Authorized, remove)
	}
}
