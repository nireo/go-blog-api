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

		auth.GET("/followed", middlewares.Authorized, followedPage)
		auth.POST("/follow/user/:username", middlewares.Authorized, followUser)
		auth.DELETE("/follow/user/:username", middlewares.Authorized, unFollowUser)

		auth.POST("/follow/topic/:topicURL", middlewares.Authorized, followTopic)
		auth.DELETE("/follow/topic/:topicURL", middlewares.Authorized, unFollowTopic)

		auth.PATCH("/update", middlewares.Authorized, updateUser)
		auth.PATCH("/update/password", middlewares.Authorized, changePassword)

		auth.DELETE("/user/:id", middlewares.Authorized, remove)
	}
}
