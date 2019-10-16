package main

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

type Blog struct {
	ID      uint   `json:"id"`
	Author  string `json:"author"`
	Content string `json:"content"`
}

func main() {
	db, err = gorm.Open("sqlite3", "./blog.db")
	if err != nil {
		fmt.Println(err)
	}

	defer db.Close()

	db.AutoMigrate(&Blog{})
	r := gin.Default()

	r.GET("/blogs", GetBlogs)

	r.Run()
}

func GetBlogs(c *gin.Context) {
	var blogs []Blog
	if err := db.Find(&blogs).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, blogs)
	}
}
