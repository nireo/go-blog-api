package models

import (
	"errors"

	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/lib/common"
	"golang.org/x/crypto/bcrypt"
)

// User data model
type User struct {
	gorm.Model
	Username     string
	PasswordHash string
	UUID         string
	URL          string
}

// FollowedTopic bypasses using many2many and makes code cleaner
type FollowedTopic struct {
	gorm.Model
	User          User
	UserID        uint
	FollowedTopic Topic
	TopicID       uint
}

// Follow data model
type Follow struct {
	gorm.Model
	Following    User
	FollowingID  uint
	FollowedBy   User
	FollowedByID uint
}

// Serialize serializes the followed model to just show user
func (follow *Follow) Serialize() common.JSON {
	db := common.GetDatabase()
	var user User
	if err := db.Where("id = ?", follow.FollowingID).First(&user).Error; err != nil {
		return common.JSON{
			"user": user,
		}
	}

	return common.JSON{
		"user": user.Serialize(),
	}
}

// Serialize user data
func (u *User) Serialize() common.JSON {
	return common.JSON{
		"uuid":     u.UUID,
		"username": u.Username,
		"url":      u.URL,
		"created":  u.CreatedAt,
		"id":       u.ID,
	}
}

func (user *User) Save() {
	db := common.GetDatabase()

	db.NewRecord(user)
	db.Save(&user)
}

func (user *User) Delete() {
	db := common.GetDatabase()

	db.Delete(&user)
}

// SerializeUsers serializes a list of users
func SerializeUsers(users []User) []common.JSON {
	serializedUsers := make([]common.JSON, len(users), len(users))
	for index := range users {
		serializedUsers[index] = users[index].Serialize()
	}

	return serializedUsers
}

// FindOneUser finds a single topic with the given condition
func FindOneUser(condition interface{}) (User, error) {
	db := common.GetDatabase()

	var user User
	if err := db.Where(condition).First(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}

// SetPassword sets a new hashed password to the user
func (u *User) SetPassword(newPassword string) error {
	if len(newPassword) > 5 {
		return errors.New("Passwords should be longer than 5 characters")
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	u.PasswordHash = string(passwordHash)
	return nil
}

// CheckPassword checks if user's password is the given password
func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
}

// IsFollowing checks for a follow model between 2 users
func (u *User) IsFollowing(following User) bool {
	db := common.GetDatabase()
	var follow Follow
	db.Where(Follow{FollowedByID: u.ID, FollowingID: following.ID}).First(&follow)
	return follow.ID != 0
}

// UnFollow removes a follow model between 2 users
func (u *User) UnFollow(unFollowUser User) error {
	if !u.IsFollowing(unFollowUser) {
		return errors.New("User is not following this user")
	}

	db := common.GetDatabase()
	err := db.Where(Follow{FollowedByID: u.ID, FollowingID: unFollowUser.ID}).Delete(Follow{}).Error
	return err
}

// IsFollowingTopic checks if a user is following a certain topic
func (u *User) IsFollowingTopic(topic Topic) bool {
	db := common.GetDatabase()
	var isFollowing FollowedTopic
	db.Where(FollowedTopic{UserID: u.ID, TopicID: topic.ID})
	return isFollowing.ID != 0
}

// UnFollowTopic removes a user's following of a topic
func (u *User) UnFollowTopic(topic Topic) error {
	if !u.IsFollowingTopic(topic) {
		return errors.New("User is not following this topic")
	}

	db := common.GetDatabase()
	return db.Where(FollowedTopic{UserID: u.ID, TopicID: topic.ID}).Delete(FollowedTopic{}).Error
}

func (u *User) Read(m common.JSON) {
	u.ID = uint(m["id"].(float64))
	u.Username = m["username"].(string)
}
