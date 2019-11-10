package posts

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/lib/middlewares"
)

// ApplyRoutes adds post routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	posts := r.Group("/api/posts")
	{
		posts.POST("/", middlewares.Authorized, create)
		posts.GET("/", list)
	}
}
