package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

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

func main() {
	r := gin.Default()
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
