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

// Serialize formats topic to JSON-format
func (t *Topic) Serialize() common.JSON {
	return common.JSON{}
}
