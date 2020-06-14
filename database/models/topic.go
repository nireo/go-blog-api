package models

import (
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/lib/common"
)

// Topic data model
type Topic struct {
	gorm.Model
	Title       string
	Description string
	UUID        string
	URL         string
	UserID      uint
}

// SerializeTopics serializes a list of topics
func SerializeTopics(topics []Topic) []common.JSON {
	serializedTopics := make([]common.JSON, len(topics), len(topics))
	for index := range topics {
		serializedTopics[index] = topics[index].Serialize()
	}

	return serializedTopics
}

// Serialize formats topic to JSON-format
func (t *Topic) Serialize() common.JSON {
	return common.JSON{
		"title":       t.Title,
		"description": t.Description,
		"uuid":        t.UUID,
		"url":         t.URL,
	}
}
