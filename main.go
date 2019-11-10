package main

import (
	"fmt"
	"os"

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
	if port == "" {
		port = "8080"
	}

	db, _ := database.Initialize()
	if db != nil {
		fmt.Println("testing: this works")
	}

	app := gin.Default()
	app.Run(":" + port)
}
