package models

import "github.com/jinzhu/gorm"

// Topic data model
type Topic struct {
	gorm.Model
	Title       string
	Description string
	UUID        string
	URL         string
}
