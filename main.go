package main

import (
	"github.com/nireo/go-blog-api/api"
	"github.com/nireo/go-blog-api/lib/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/database"
)

func main() {
	// start database
	db, _ := database.Initialize()

	app := gin.Default() // create gin app
	app.Use(database.Inject(db))
	app.Use(middlewares.JWTMiddleware())
	api.ApplyRoutes(app) // apply api router
	app.Run(":8080")     // listen to given port
}
