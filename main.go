package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var (
	DBHost     = "localhost"
	DBUser     = "postgres"
	DBName     = "go-blog-api"
	DBPassword = os.Getenv("DB_PASSWORD")
	Migration  = `CREATE TABLE IF NOT EXISTS blogs (
id serial PRIMARY KEY,
author text NOT NULL,
content text NOT NULL,
created_at timestamp with time zone DEFAULT current_timestamp)`
)

var db *sql.DB

type Blog struct {
	Author    string    `json:"author" binding:"required"`
	Content   string    `json:"content" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
	Id        string    `json:"id" binding:"required"`
}

func getBlogs() ([]Blog, error) {
	const q = `SELECT author, content, created_at, id FROM blogs ORDER BY created_at DESC LIMIT 100`
	rows, err := db.Query(q)
	if err != nil {
		return nil, err
	}
	results := make([]Blog, 0)
	for rows.Next() {
		var author string
		var content string
		var id string
		var createdAt time.Time
		err = rows.Scan(&author, &content, &id, &createdAt)
		if err != nil {
			return nil, err
		}
		results = append(results, Blog{author, content, createdAt, id})
	}
	return results, nil
}

func addBlog(blog Blog) error {
	const q = `INSERT INTO blogs(author, content, created_at) VALUES ($1 $2 $3)`
	_, err := db.Exec(q, blog.Author, blog.Content, blog.CreatedAt)
	return err
}

func main() {
	var err error
	r := gin.Default()

	r.GET("/blogs", func(context *gin.Context) {
		results, err := getBlogs()
		if err != nil {
			context.JSON(
				http.StatusInternalServerError,
				gin.H{"status": "internal error: " + err.Error()})
			return
		}
		context.JSON(http.StatusOK, results)
	})

	r.POST("/blogs", func(context *gin.Context) {
		var b Blog
		if context.Bind(&b) == nil {
			b.CreatedAt = time.Now()
			if err := addBlog(b); err != nil {
				context.JSON(
					http.StatusInternalServerError,
					gin.H{"status": "internal error: " + err.Error()})
				return
			}
			// since the binding failed, it doesn't meet the struct structure
			context.JSON(http.StatusUnprocessableEntity, gin.H{"status": "invalid body"})
		}
	})

	dbInfo := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		DBHost, DBUser, DBPassword, DBName)

	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	_, err = db.Query(Migration)
	if err != nil {
		log.Println("failed to run migrations...", err.Error())
		return
	}
	log.Println("running...")
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
