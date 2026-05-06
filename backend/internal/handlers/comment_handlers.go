package handlers

import (
	"net/http"
	"strings"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterCommentRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/comments", h.GetComments)
	r.POST("/comments", h.CreateComment)
}

func (h *Handlers) GetComments(c *gin.Context) {
	var rows []appdb.Comment
	if err := h.DB.Order("created_at ASC, id ASC").Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": rows})
}

type CreateCommentBody struct {
	Commenter string `json:"commenter" binding:"required"`
	Message   string `json:"message" binding:"required"`
}

func (h *Handlers) CreateComment(c *gin.Context) {
	var body CreateCommentBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	row := appdb.Comment{
		Commenter: strings.TrimSpace(body.Commenter),
		Message:   strings.TrimSpace(body.Message),
	}

	if row.Commenter == "" || row.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "commenter and message are required"})
		return
	}

	if err := h.DB.Create(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.Comment
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}
