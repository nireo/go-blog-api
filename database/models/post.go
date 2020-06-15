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

// GetPostWithID returns a post correspodding to given id
func GetPostWithID(id string) (Post, bool) {
	db := common.GetDatabase()
	var post Post
	if err := db.Where("uuid = ?", id).First(&post).Error; err != nil {
		return post, false
	}

	return post, true
}

// FindOnePost finds a post matching the given condition
func FindOnePost(condition interface{}) (Post, error) {
	db := common.GetDatabase()

	var post Post
	if err := db.Where(condition).First(&post).Error; err != nil {
		return post, err
	}

	return post, nil
}

// GetParagraphsRelatedToPost gets all the paragraphs in a post
func GetParagraphsRelatedToPost(post Post) ([]Paragraph, bool) {
	db := common.GetDatabase()
	var paragraphs []Paragraph
	if err := db.Model(&post).Related(&paragraphs).Error; err != nil {
		return paragraphs, false
	}

	return paragraphs, true
}

// GetPostsFromUser gets all the posts related to a given user
func GetPostsFromUser(user User) ([]Post, bool) {
	db := common.GetDatabase()
	var posts []Post
	if err := db.Model(&user).Related(&posts).Error; err != nil {
		return posts, false
	}

	return posts, true
}

// GetPosts returns a list of posts within a given offset and limit range
func GetPosts(offset, limit int) ([]Post, bool) {
	db := common.GetDatabase()
	var posts []Post
	if err := db.Find(&posts).Offset(offset).Limit(limit).Error; err != nil {
		return posts, false
	}

	return posts, true
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
		"uuid":        p.UUID,
	}
}
