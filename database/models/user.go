package models

import (
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/lib/common"
)

// User data model
type User struct {
	gorm.Model
	Username     string
	PasswordHash string
	UUID         string
}

// Serialize user data
func (u *User) Serialize() common.JSON {
	return common.JSON{
		"id":       u.ID,
		"username": u.Username,
	}
}

// GetUserWithID returns a user with given id
func GetUserWithID(id string, db *gorm.DB) (User, bool) {
	var user User
	if err := db.Where("uuid = ?", id).First(&user).Error; err != nil {
		return user, false
	}

	return user, true
}

// GetUserWithUsername returns a user with given username
func GetUserWithUsername(username string, db *gorm.DB) (User, bool) {
	var user User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		return user, false
	}

	return user, true
}

func (u *User) Read(m common.JSON) {
	u.ID = uint(m["id"].(float64))
	u.Username = m["username"].(string)
}
