package models

import (
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/lib/common"
)

// Post data model
type Post struct {
	gorm.Model
	Text        string
	Title       string
	Likes       int
	Description string
	Topic       string
	ImageURL    string
	User        User
	UserID      uint
	UUID        string
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
