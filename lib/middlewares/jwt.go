package middlewares

import (
	"errors"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/nireo/go-blog-api/database/models"
	"github.com/nireo/go-blog-api/lib/common"
)

var secretKey []byte

// User model alias
type User = models.User

func init() {
	secretKey = []byte("temp")
}

func validateToken(tokenString string) (common.JSON, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		return common.JSON{}, err
	}
	if !token.Valid {
		return common.JSON{}, errors.New("invalid token")
	}
	return token.Claims.(jwt.MapClaims), nil
}

func extractTokenFromAuthorizationHeader(c *gin.Context) (string, error) {
	authorization := c.Request.Header.Get("Authorization")
	if authorization == "" || authorization == "[object Object]" {
		return "", errors.New("Invalid token")
	}

	var splittedAuthHeader []string
	if strings.Contains(authorization, "bearer") {
		splittedAuthHeader = strings.Split(authorization, "bearer ")
		return splittedAuthHeader[1], nil
	} else if strings.Contains(authorization, "Bearer") {
		splittedAuthHeader = strings.Split(authorization, "Bearer ")
		return splittedAuthHeader[1], nil
	} else {
		return "", errors.New("Token is not in bearer format")
	}
}

// JWTMiddleware parses jwt token from cookie/header
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			authTokenString, err := extractTokenFromAuthorizationHeader(c)
			if err != nil {
				c.Next()
				return
			}

			tokenString = authTokenString
		}

		tokenData, err := validateToken(tokenString)
		if err != nil {
			c.Next()
			return
		}

		var user User
		user.Read(tokenData["user"].(common.JSON))
		c.Set("user", user)
		c.Set("token_expire", tokenData["exp"])
		c.Next()
	}
}
