package handlers

import (
	"net/http"
	"strings"
	"time"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPersonalInfoRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/personal-infos", h.GetPersonalInfos)
	r.POST("/personal-infos", h.CreatePersonalInfo)
}

func (h *Handlers) GetPersonalInfos(c *gin.Context) {
	var rows []appdb.PersonalInfo
	if err := h.DB.Order("id ASC").Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": rows})
}

type CreatePersonalInfoBody struct {
	FullName  string `json:"full_name" binding:"required"`
	BirthDate string `json:"birth_date" binding:"required"`
	Address   string `json:"address" binding:"required"`
}

func (h *Handlers) CreatePersonalInfo(c *gin.Context) {
	var body CreatePersonalInfoBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	birthDate, err := time.Parse("2006-01-02", strings.TrimSpace(body.BirthDate))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "birth_date must use YYYY-MM-DD"})
		return
	}

	row := appdb.PersonalInfo{
		FullName:  strings.TrimSpace(body.FullName),
		BirthDate: birthDate.Format("2006-01-02"),
		Age:       time.Now().Year() - birthDate.Year(),
		Address:   strings.TrimSpace(body.Address),
	}

	if row.FullName == "" || row.Address == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "full_name and address are required"})
		return
	}

	if err := h.DB.Create(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.PersonalInfo
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}
