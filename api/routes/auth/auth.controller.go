package auth

import (
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
	"golang.org/x/crypto/bcrypt"
)

// User model alias
type User = models.User

// Post model alias
type Post = models.Post

// JSON type alias
type JSON = common.JSON

func hash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func checkHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateToken(data common.JSON) (string, error) {
	date := time.Now().Add(time.Hour * 24 * 7)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": data,
		"exp":  date.Unix(),
	})

	tokenString, err := token.SignedString([]byte("temp"))
	return tokenString, err
}

func register(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	type RequestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if user exists
	_, ok := models.GetUserWithUsername(body.Username, db)
	if ok {
		c.AbortWithStatus(http.StatusConflict)
		return
	}

	hash, hashErr := hash(body.Password)
	if hashErr != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	user := User{
		Username:     body.Username,
		PasswordHash: hash,
		UUID:         common.CreateUUID(),
		URL:          common.FormatString(body.Username),
	}

	db.NewRecord(user)
	db.Create(&user)

	serialized := user.Serialize()
	token, _ := generateToken(serialized)

	c.JSON(http.StatusOK, common.JSON{
		"user":  user.Serialize(),
		"token": token,
	})
}

func login(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	type RequestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	user, ok := models.GetUserWithUsername(body.Username, db)
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
	}

	// passwords don't match
	if !checkHash(body.Password, user.PasswordHash) {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	serialized := user.Serialize()
	token, err := generateToken(serialized)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, common.JSON{
		"user":  user.Serialize(),
		"token": token,
	})
}

func check(c *gin.Context) {
	user := c.MustGet("user").(User)
	tokenExpire := int64(c.MustGet("token_expire").(float64))
	now := time.Now().Unix()
	difference := tokenExpire - now
	// 60 * 60 * 24 * 2 = 2 days
	if difference < 60*60*24*2 {
		// make new token
		token, err := generateToken(user.Serialize())
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.JSON(http.StatusOK, common.JSON{
			"token": token,
			"user":  user.Serialize(),
		})
		return
	}
	// since the token is less than 2 days old
	// send a message informing the user
	c.JSON(http.StatusOK, common.JSON{
		"error": "Your current token is already less than 2 days old",
	})
}

func updateUser(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	type RequestBody struct {
		Username string `json:"username" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	_, ok := models.GetUserWithUsername(requestBody.Username, db)
	if !ok {
		user.Username = requestBody.Username

		db.Save(&user)
		c.JSON(http.StatusOK, user.Serialize())
		return
	}

	c.AbortWithStatus(http.StatusConflict)
	return
}

func remove(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	db.Delete(&user)
	c.Status(http.StatusOK)
}

func changePassword(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	type RequestBody struct {
		Password string `json:"password" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusOK)
		return
	}

	hash, hashErr := hash(body.Password)
	if hashErr != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	user.PasswordHash = hash

	db.Save(&user)
	c.JSON(http.StatusOK, common.JSON{
		"success": "Password has been updated",
	})
}

func getUserWithUsername(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	url := c.Param("url")

	var user User
	if err := db.Where("url = ?", url).First(&user).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	// get user's posts
	var posts []Post
	if err := db.Model(&user).Related(&posts).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	serializedPosts := make([]JSON, len(posts), len(posts))
	for index := range posts {
		serializedPosts[index] = posts[index].Serialize()
	}

	c.JSON(http.StatusOK, gin.H{
		"user":  user,
		"posts": serializedPosts,
	})
}

func followUser(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)
	toFollowUsername := c.Param("username")

	var userToFollow User
	if err := db.Where("url = ?", toFollowUsername).First(&userToFollow).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if err := db.Model(&user).Association("Follows").Append(&userToFollow).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, userToFollow.Serialize())
}

func getFollowed(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	user := c.MustGet("user").(User)

	var followedUsers []User
	if err := db.Preload("Followed").Find(&followedUsers).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
}
