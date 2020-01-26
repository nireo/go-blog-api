package user

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes add user routes to gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	user := r.Group("/user")
	{
		user.GET("/:username", userFromID)
	}
}
