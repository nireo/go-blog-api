package posts

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/lib/middlewares"
)

// ApplyRoutes adds post routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	posts := r.Group("/posts")
	{
		posts.GET("/", list)
		posts.GET("/single/:id", postFromID)
		posts.GET("/dashboard", middlewares.Authorized, dashboardController)
		posts.GET("/search/:search", searchForPost)

		posts.POST("/", middlewares.Authorized, create)
		posts.POST("/paragraph/:id", middlewares.Authorized, addNewParagraph)
		posts.POST("/like/:postID", middlewares.Authorized, handleLike)

		posts.PATCH("/:id", middlewares.Authorized, update)

		posts.DELETE("/blog/:id", middlewares.Authorized, remove)
		posts.DELETE("/paragraph/:id", middlewares.Authorized, deleteParagraph)
	}
}
