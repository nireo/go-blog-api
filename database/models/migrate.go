package models

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

// Migrate models using ORM
func Migrate(db *gorm.DB) {
	db.AutoMigrate(&User{}, &Post{}, &Topic{}, &Paragraph{}, &Follow{})
	db.Model(&Post{}).AddForeignKey(
		"user_id",
		"users(id)",
		"CASCADE",
		"CASCADE",
	)
	fmt.Println("Auto migration has been completed")
}
