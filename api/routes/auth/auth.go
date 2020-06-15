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

		auth.GET("/single/:url", getUserWithUsername)

		auth.POST("/follow/user/:username", middlewares.Authorized, followUser)
		auth.DELETE("/follow/user/:username", middlewares.Authorized, unFollowUser)

		auth.POST("/follow/topic/:topicURL", middlewares.Authorized)
		auth.DELETE("/follow/topic/:topicURL", middlewares.Authorized)

		auth.PATCH("/update", middlewares.Authorized, updateUser)
		auth.PATCH("/update/password", middlewares.Authorized, changePassword)

		auth.DELETE("/user/:id", middlewares.Authorized, remove)
	}
}
