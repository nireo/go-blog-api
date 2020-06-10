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

// JWTMiddleware parses jwt token from cookie/header
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			authorization := c.Request.Header.Get("Authorization")
			if authorization == "" || authorization == "[object Object]" {
				c.Next()
				return
			}

			var sp []string
			if strings.Contains(authorization, "bearer") {
				sp = strings.Split(authorization, "bearer ")
				if len(sp) < 1 {
					c.Next()
					return
				}
			} else if strings.Contains(authorization, "Bearer") {
				sp = strings.Split(authorization, "Bearer ")
				if len(sp) < 1 {
					c.Next()
					return
				}
			}

			tokenString = sp[1]
		}

		tokenData, err := validateToken(tokenString)
		if err != nil {
			c.Next()
			return
		}

		var user models.User
		user.Read(tokenData["user"].(common.JSON))
		c.Set("user", user)
		c.Set("token_expire", tokenData["exp"])
		c.Next()
	}
}
