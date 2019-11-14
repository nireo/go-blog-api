package auth

import (
	"io/ioutil"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
	"golang.org/x/crypto/bcrypt"
)

// User alias for models
type User = models.User

func hash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func checkHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateToken(data common.JSON) (string, error) {

	//  token is valid for 7days
	date := time.Now().Add(time.Hour * 24 * 7)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": data,
		"exp":  date.Unix(),
	})

	// get path from root dir
	pwd, _ := os.Getwd()
	keyPath := pwd + "/jwtsecret.key.pub"

	key, readErr := ioutil.ReadFile(keyPath)
	if readErr != nil {
		return "", readErr
	}
	tokenString, err := token.SignedString(key)
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
		c.AbortWithStatus(400)
		return
	}

	var exists User
	if err := db.Where("username = ?", body.Username).First(&exists).Error; err == nil {
		c.AbortWithStatus(409)
		return
	}

	hash, hashErr := hash(body.Password)
	if hashErr != nil {
		c.AbortWithStatus(500)
		return
	}

	user := User{
		Username:     body.Username,
		PasswordHash: hash,
	}

	db.NewRecord(user)
	db.Create(&user)

	serialized := user.Serialize()
	token, _ := generateToken(serialized)
	c.SetCookie("token", token, 60*60*24*7, "/", "", false, true)

	c.JSON(200, common.JSON{
		"user":  user.Serialize(),
		"token": token,
	})
}

func login(c *gin.Context) {
	// get gin from context
	db := c.MustGet("db").(*gorm.DB)

	// define request body interface for validation
	type RequestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		// if the body is invalid
		c.AbortWithStatus(400)
		return
	}

	// check if the user even exists
	var user User
	if err := db.Where("username = ?", body.Username).First(&user).Error; err != nil {
		// no user found
		c.AbortWithStatus(404)
		return
	}

	if !checkHash(body.Password, user.PasswordHash) {
		// invalid credentials
		c.AbortWithStatus(401)
		return
	}

	serialized := user.Serialize()
	token, err := generateToken(serialized)

	if err != nil {
		// something went wrong with token creation
		// return a internal server error
		c.AbortWithStatus(500)
		return
	}

	c.SetCookie("token", token, 60*60*26*7, "/", "", false, true)
	c.JSON(200, common.JSON{
		"user":  user.Serialize(),
		"token": token,
	})
}

func check(c *gin.Context) {
	// get the user from request
	userRaw, ok := c.Get("user")

	if !ok {
		// user isn't logged in
		c.AbortWithStatus(401)
		return
	}

	user := userRaw.(User)
	tokenExpire := int64(c.MustGet("token_expire").(float64))
	now := time.Now().Unix()
	difference := tokenExpire - now
	// 60 * 60 * 24 * 2 = 2 days
	if difference < 60*60*24*2 {
		// make new token
		token, err := generateToken(user.Serialize())
		if err != nil {
			// failed generating token
			// return internal server error
			c.AbortWithStatus(500)
			return
		}
		c.SetCookie("token", token, 60*60*24*7, "/", "", false, true)
		c.JSON(200, common.JSON{
			"token": token,
			"user":  user.Serialize(),
		})
		return
	}

	// since the token is less than 2 days old
	// send a message informing the user
	c.JSON(200, common.JSON{
		"error": "Your current token is already less than 2 days old",
	})
}

func updateUser(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userRaw, ok := c.Get("user")

	if !ok {
		c.AbortWithStatus(401)
		return
	}

	type RequestBody struct {
		Username string `json:"username" binding:"required"`
	}

	var requestBody RequestBody

	if err := c.BindJSON(&requestBody); err != nil {
		c.AbortWithStatus(400)
		return
	}

	var checkUser User
	user := userRaw.(User)
	// check if the user even exists
	if err := db.Where("username = ?", requestBody.Username).First(&checkUser).Error; err != nil {
		user.Username = requestBody.Username
		db.Save(&user)
		c.JSON(200, user.Serialize())
	} else {
		// since someone with the username already exists
		c.AbortWithStatus(403)
		return
	}
}
