package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterQuestionRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/questions", h.GetQuestions)
	r.POST("/questions", h.CreateQuestion)
	r.DELETE("/questions/:id", h.DeleteQuestion)
}

func (h *Handlers) GetQuestions(c *gin.Context) {
	var rows []appdb.Question
	if err := h.DB.Order("question_no ASC").Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": rows})
}

type CreateQuestionBody struct {
	Text string `json:"text" binding:"required"`
}

func (h *Handlers) CreateQuestion(c *gin.Context) {
	var body CreateQuestionBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	text := strings.TrimSpace(body.Text)
	if text == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "question text is required"})
		return
	}

	tx := h.DB.Begin()

	var maxNo int
	if err := tx.Model(&appdb.Question{}).Select("COALESCE(MAX(question_no), 0)").Scan(&maxNo).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	row := appdb.Question{
		QuestionNo: maxNo + 1,
		Text:       text,
	}

	if err := tx.Create(&row).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	var out appdb.Question
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}

func (h *Handlers) DeleteQuestion(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	tx := h.DB.Begin()

	var row appdb.Question
	err = tx.First(&row, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "question not found"})
		return
	}
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Delete(&row).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := renumberQuestions(tx); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func renumberQuestions(tx *gorm.DB) error {
	var rows []appdb.Question
	if err := tx.Order("question_no ASC, id ASC").Find(&rows).Error; err != nil {
		return err
	}

	for i, row := range rows {
		nextNo := i + 1
		if row.QuestionNo == nextNo {
			continue
		}
		if err := tx.Model(&appdb.Question{}).Where("id = ?", row.ID).Update("question_no", nextNo).Error; err != nil {
			return err
		}
	}

	return nil
}
