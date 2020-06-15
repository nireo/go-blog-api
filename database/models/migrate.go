package models

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

// Migrate models using ORM
func Migrate(db *gorm.DB) {
	db.AutoMigrate(&User{}, &Post{}, &Topic{}, &Paragraph{}, &Follow{}, &FollowedTopic{})
	fmt.Println("Auto migration has been completed")
}
