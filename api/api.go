package api

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/api/routes/auth"
	"github.com/nireo/go-blog-api/api/routes/posts"
)

// ApplyRoutes adds router to gin engine
func ApplyRoutes(r *gin.Engine) {
	routes := r.Group("/api")
	{
		auth.ApplyRoutes(routes)
		posts.ApplyRoutes(routes)
	}
}
