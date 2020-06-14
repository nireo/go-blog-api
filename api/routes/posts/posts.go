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
		posts.GET("/single/:id", postFromID)
		posts.PATCH("/:id", middlewares.Authorized, update)
		posts.DELETE("/blog/:id", middlewares.Authorized, remove)
		posts.GET("/your-blogs", middlewares.Authorized, yourBlogs)
		posts.POST("/paragraph/:id", middlewares.Authorized, addNewParagraph)
		posts.DELETE("/paragraph/:id", middlewares.Authorized, deleteParagraph)
		posts.GET("/search/:search", searchForPost)
	}
}
