package models

import (
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/lib/common"
)

// Post data model
type Post struct {
	gorm.Model
	Text        string `sql:"type:text;"`
	Title       string `sql:"type:text;"`
	Likes       int    `sql:"type:int;"`
	Description string `sql:"type:text;"`
	Topic       string `sql:"type:text;"`
	ImageURL    string `sql:"type:text;"`
	User        User   `gorm:"foreignkey:UserID"`
	UserID      uint
}

// Serialize post data
func (p Post) Serialize() common.JSON {
	return common.JSON{
		"id":          p.ID,
		"text":        p.Text,
		"title":       p.Title,
		"likes":       p.Likes,
		"description": p.Description,
		"user":        p.User.Serialize(),
		"created_at":  p.CreatedAt,
		"topic":       p.Topic,
		"image_url":   p.ImageURL,
	}
}
