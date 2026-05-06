package handlers

import (
	"net/http"
	"net/mail"
	"regexp"
	"strings"
	"time"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var phonePattern = regexp.MustCompile(`^\+?[0-9][0-9\s\-()]{7,24}$`)

func RegisterProfileRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.POST("/profiles", h.CreateProfile)
}

type CreateProfileBody struct {
	FullName           string `json:"full_name" binding:"required"`
	Email              string `json:"email" binding:"required"`
	Phone              string `json:"phone" binding:"required"`
	BirthDay           string `json:"birth_day" binding:"required"`
	Occupation         string `json:"occupation" binding:"required"`
	ProfileImageBase64 string `json:"profile_image_base64" binding:"required"`
}

func (h *Handlers) CreateProfile(c *gin.Context) {
	var body CreateProfileBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	row := appdb.Profile{
		FullName:           strings.TrimSpace(body.FullName),
		Email:              strings.TrimSpace(body.Email),
		Phone:              strings.TrimSpace(body.Phone),
		BirthDay:           strings.TrimSpace(body.BirthDay),
		Occupation:         strings.TrimSpace(body.Occupation),
		ProfileImageBase64: strings.TrimSpace(body.ProfileImageBase64),
	}

	if row.FullName == "" || row.Email == "" || row.Phone == "" || row.BirthDay == "" || row.Occupation == "" || row.ProfileImageBase64 == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "all fields are required"})
		return
	}

	if _, err := mail.ParseAddress(row.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email format"})
		return
	}

	if !phonePattern.MatchString(row.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid phone format"})
		return
	}

	if _, err := time.Parse("2006-01-02", row.BirthDay); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "birth_day must use YYYY-MM-DD"})
		return
	}

	if err := h.DB.Create(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.Profile
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}
