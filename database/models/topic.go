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
	User        User
}

// SerializeTopics serializes a list of topics
func SerializeTopics(topics []Topic) []common.JSON {
	serializedTopics := make([]common.JSON, len(topics), len(topics))
	for index := range topics {
		serializedTopics[index] = topics[index].Serialize()
	}

	return serializedTopics
}

// GetPostsRelatedToTopic finds all posts in the topic's category
func GetPostsRelatedToTopic(topic Topic) ([]Post, bool) {
	db := common.GetDatabase()
	var posts []Post
	if err := db.Model(&topic).Related(&posts).Error; err != nil {
		return posts, false
	}

	return posts, true
}

// Delete deletes the given topic's entry from the database
func (topic *Topic) Delete() {
	db := common.GetDatabase()

	db.Delete(&topic)
}

func (topic *Topic) Save() {
	db := common.GetDatabase()

	db.NewRecord(topic)
	db.Save(&topic)
}

// GetAllTopics gets all in the database
func GetAllTopics() ([]Topic, bool) {
	db := common.GetDatabase()
	var topics []Topic
	if err := db.Find(&topics).Error; err != nil {
		return topics, false
	}

	return topics, true
}

// FindOneTopic finds a single topic with the given condition
func FindOneTopic(condition interface{}) (Topic, error) {
	db := common.GetDatabase()

	var topic Topic
	if err := db.Where(condition).First(&topic).Error; err != nil {
		return topic, err
	}

	return topic, nil
}

// GetAllUsersTopics returns all the topics created by the given user
func GetAllUsersTopics(user User) ([]Topic, bool) {
	db := common.GetDatabase()
	var topics []Topic
	if err := db.Model(&user).Related(&topics).Error; err != nil {
		return topics, false
	}

	return topics, true
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
