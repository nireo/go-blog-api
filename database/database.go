package database

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite" // sqlite configuration
	"github.com/nireo/go-blog-api/database/models"
)

// Initialize the database
func Initialize() (*gorm.DB, error) {
	db, err := gorm.Open("sqlite3", "./database.db")
	if err != nil {
		panic(err)
	}

	models.Migrate(db)
	return db, err
}
