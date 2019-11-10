package database

import (
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" // mysql configuration
	"github.com/nireo/go-blog-api/database/models"
)

// Initialize the database
func Initialize() (*gorm.DB, error) {
	dbConfig := os.Getenv("DB_CONFIG")
	db, err := gorm.Open("mysql", dbConfig)
	db.LogMode(true)
	if err != nil {
		panic(err)
	}

	models.Migrate(db)
	return db, err
}
