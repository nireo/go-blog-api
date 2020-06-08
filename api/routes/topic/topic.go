package topic

import "github.com/gin-gonic/gin"

// ApplyRoutes adds topic routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	topics := r.Group("/topics")
	{
		topics.POST("/")
		topics.GET("/")
	}
}
