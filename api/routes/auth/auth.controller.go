package auth

import (
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
	"golang.org/x/crypto/bcrypt"
)

// User model alias
type User = models.User

// Post model alias
type Post = models.Post

// Follow model alias
type Follow = models.Follow

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
	db := common.GetDatabase()

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
	_, ok := models.GetUserWithUsername(body.Username)
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
	token, err := generateToken(serialized)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, common.JSON{
		"user":  serialized,
		"token": token,
	})
}

func login(c *gin.Context) {
	type RequestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	user, ok := models.GetUserWithUsername(body.Username)
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
		"user":  serialized,
		"token": token,
	})
}

func updateUser(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)

	type RequestBody struct {
		Username string `json:"username" binding:"required"`
	}

	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	_, ok := models.GetUserWithUsername(requestBody.Username)
	if ok {
		c.AbortWithStatus(http.StatusConflict)
		return
	}

	user.Username = requestBody.Username

	db.Save(&user)
	c.JSON(http.StatusOK, user.Serialize())
}

func remove(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)

	db.Delete(&user)
	c.Status(http.StatusOK)
}

func changePassword(c *gin.Context) {
	db := common.GetDatabase()
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
	c.Status(http.StatusOK)
}

func getUserWithUsername(c *gin.Context) {
	db := common.GetDatabase()
	url := c.Param("url")

	displayFollowing := true
	userRaw, ok := c.Get("user")
	if !ok {
		displayFollowing = false
	}

	var toCheckFollowing User
	if displayFollowing {
		toCheckFollowing = userRaw.(User)
	}

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

	if displayFollowing {
		c.JSON(http.StatusOK, gin.H{
			"user":      user,
			"posts":     models.SerializePosts(posts),
			"following": toCheckFollowing.IsFollowing(user),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"user":  user,
			"posts": models.SerializePosts(posts),
		})
	}
}

func followUser(c *gin.Context) {
	db := common.GetDatabase()
	user := c.MustGet("user").(User)
	toFollowUsername := c.Param("username")

	userToFollow, ok := models.GetUserWithUsername(toFollowUsername)
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	// check if the user is already following the toFollowUser this isn't really necessary,
	// but it prevents the database from storing multiple records of the same information
	if user.IsFollowing(userToFollow) {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	newFollow := Follow{
		Following:    userToFollow,
		FollowingID:  userToFollow.ID,
		FollowedBy:   user,
		FollowedByID: user.ID,
	}

	db.NewRecord(newFollow)
	db.Create(&newFollow)

	c.Status(http.StatusNoContent)
}

func unFollowUser(c *gin.Context) {
	user := c.MustGet("user").(User)
	toUnFollowUsername := c.Param("username")

	toUnFollowUser, ok := models.GetUserWithUsername(toUnFollowUsername)
	if !ok {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if err := user.UnFollow(toUnFollowUser); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	c.Status(http.StatusNoContent)
}
