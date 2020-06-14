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
	Paragraphs  []Paragraph
}

// Paragraph struct stores the post's content
type Paragraph struct {
	gorm.Model
	Type    string
	Content string
	PostID  uint
	UUID    string
}

// SerializeParagraphs serializes multiple paragraphs into JSON-format
func SerializeParagraphs(paragraphs []Paragraph) []common.JSON {
	serializedParagraphs := make([]common.JSON, len(paragraphs), len(paragraphs))
	for index := range paragraphs {
		serializedParagraphs[index] = paragraphs[index].Serialize()
	}

	return serializedParagraphs
}

// Serialize paragraph data
func (p *Paragraph) Serialize() common.JSON {
	return common.JSON{
		"type":    p.Type,
		"content": p.Content,
		"uuid":    p.UUID,
	}
}

// SerializePosts serializes a list posts
func SerializePosts(posts []Post) []common.JSON {
	serializedPosts := make([]common.JSON, len(posts), len(posts))
	for index := range posts {
		serializedPosts[index] = posts[index].Serialize()
	}

	return serializedPosts
}

// Serialize post data
func (p *Post) Serialize() common.JSON {
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
