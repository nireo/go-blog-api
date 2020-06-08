package topic

import (
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/lib/middlewares"
)

// ApplyRoutes adds topic routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	topics := r.Group("/topics")
	{
		topics.POST("/", middlewares.Authorized, createTopic)
		topics.GET("/", getTopics)
		topics.GET("/:id", getSingleTopic)
		topics.DELETE("/:id", middlewares.Authorized, getSingleTopic)
	}
}
