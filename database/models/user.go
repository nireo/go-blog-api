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
	Following    []string
}

// Serialize user data
func (u *User) Serialize() common.JSON {
	return common.JSON{
		"id":       u.ID,
		"username": u.Username,
	}
}

func (u *User) Read(m common.JSON) {
	u.ID = uint(m["id"].(float64))
	u.Username = m["username"].(string)
}
