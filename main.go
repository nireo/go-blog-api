package main

import (
	"os"

	"github.com/nireo/go-blog-api/api"
	"github.com/nireo/go-blog-api/lib/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/nireo/go-blog-api/database"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	port := os.Getenv("PORT")

	// if the env is not set
	if port == "" {
		port = "8080"
	}

	// start database
	db, _ := database.Initialize()

	app := gin.Default() // create gin app
	app.Use(database.Inject(db))
	app.Use(middlewares.JWTMiddleware())
	api.ApplyRoutes(app) // apply api router
	app.Run(":" + port)  // listen to given port
}
