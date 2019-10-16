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

	// routes
	r.GET("/blogs", GetBlogs)
	r.GET("/blogs/:id", GetBlogWithId)
	r.POST("/blogs", CreateBlog)
	r.PUT("/blogs/:id", UpdateBlog)
	r.DELETE("/blogs/:id", DeleteBlog)

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

func GetBlogWithId(c *gin.Context) {
	id := c.Params.ByName("id")
	var blog Blog
	if err := db.Where("id = ?", id).First(&blog).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, blog)
	}
}

func CreateBlog(c *gin.Context) {
	var blog Blog
	c.BindJSON(&blog)

	db.Create(&blog)
	c.JSON(200, blog)
}

func UpdateBlog(c *gin.Context) {
	var blog Blog
	id := c.Params.ByName("id")

	if err := db.Where("id = ?", id).First(&blog).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}

	c.BindJSON(&blog)
	db.Save(&blog)
	c.JSON(200, blog)
}

func DeleteBlog(c *gin.Context) {
	id := c.Params.ByName("id")
	var blog Blog

	d := db.Where("id = ?", id).Delete(&blog)
	fmt.Println(d)
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}
