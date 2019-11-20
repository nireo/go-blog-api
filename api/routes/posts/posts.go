package posts

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/lib/middlewares"
)

// ApplyRoutes adds post routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	posts := r.Group("/posts")
	{
		posts.POST("/", middlewares.Authorized, create)
		posts.GET("/", list)
		posts.GET("/:id", postFromID)
		posts.PATCH("/:id", middlewares.Authorized, update)
		posts.PATCH("/like/:id", middlewares.Authorized, handleLike)
		posts.DELETE("/:id", middlewares.Authorized, remove)
	}
}
