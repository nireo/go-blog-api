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
	URL          string
}

// Follow data model
type Follow struct {
	gorm.Model
	Following    User
	FollowingID  uint
	FollowedBy   User
	FollowedByID uint
}

// Serialize user data
func (u *User) Serialize() common.JSON {
	return common.JSON{
		"uuid":     u.UUID,
		"username": u.Username,
		"url":      u.URL,
		"created":  u.CreatedAt,
	}
}

// SerializeUsers serializes a list of users
func SerializeUsers(users []User) []common.JSON {
	serializedUsers := make([]common.JSON, len(users), len(users))
	for index := range users {
		serializedUsers[index] = users[index].Serialize()
	}

	return serializedUsers
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
func GetUserWithUsername(username string) (User, bool) {
	db := common.GetDatabase()
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
