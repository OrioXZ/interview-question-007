package handlers

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func RegisterAuthRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.POST("/auth/register", h.RegisterAuthUser)
	r.POST("/auth/login", h.LoginAuthUser)
	r.GET("/auth/me", h.GetAuthUser)
}

type AuthRegisterBody struct {
	Username        string `json:"username" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type AuthLoginBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handlers) RegisterAuthUser(c *gin.Context) {
	var body AuthRegisterBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	username := strings.TrimSpace(body.Username)
	if username == "" || body.Password == "" || body.ConfirmPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "all fields are required"})
		return
	}
	if body.Password != body.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password and confirm password must match"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "password hash failed"})
		return
	}

	user := appdb.AuthUser{Username: username, PasswordHash: string(hash)}
	if err := h.DB.Create(&user).Error; err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "unique") {
			c.JSON(http.StatusConflict, gin.H{"error": "username already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"username": user.Username})
}

func (h *Handlers) LoginAuthUser(c *gin.Context) {
	var body AuthLoginBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	username := strings.TrimSpace(body.Username)
	var user appdb.AuthUser
	if err := h.DB.First(&user, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	token, err := createAuthToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "username": user.Username})
}

func (h *Handlers) GetAuthUser(c *gin.Context) {
	username, err := usernameFromAuthHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var user appdb.AuthUser
	if err := h.DB.First(&user, "username = ?", username).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": user.Username})
}

func createAuthToken(username string) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   username,
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(authJWTSecret())
}

func usernameFromAuthHeader(header string) (string, error) {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return "", errors.New("missing bearer token")
	}

	tokenString := strings.TrimSpace(strings.TrimPrefix(header, prefix))
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return authJWTSecret(), nil
	})
	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok || claims.Subject == "" {
		return "", errors.New("invalid token")
	}
	return claims.Subject, nil
}

func authJWTSecret() []byte {
	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		return []byte(secret)
	}
	return []byte("it02-local-dev-secret")
}
