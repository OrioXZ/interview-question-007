package handlers

import (
	"errors"
	"net/http"
	"sync"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var queueMu sync.Mutex

func RegisterQueueRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/queue/current", h.GetCurrentQueue)
	r.POST("/queue/next", h.NextQueue)
	r.POST("/queue/clear", h.ClearQueue)
}

func (h *Handlers) GetCurrentQueue(c *gin.Context) {
	state, err := getQueueState(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"queue_number": state.CurrentNumber})
}

func (h *Handlers) NextQueue(c *gin.Context) {
	queueMu.Lock()
	defer queueMu.Unlock()

	tx := h.DB.Begin()

	state, err := getQueueState(tx)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	next, err := nextQueueNumber(state.CurrentNumber)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Model(&state).Update("current_number", next).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"queue_number": next})
}

func (h *Handlers) ClearQueue(c *gin.Context) {
	queueMu.Lock()
	defer queueMu.Unlock()

	tx := h.DB.Begin()

	state, err := getQueueState(tx)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Model(&state).Update("current_number", "00").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"queue_number": "00"})
}

func getQueueState(tx *gorm.DB) (appdb.QueueState, error) {
	var state appdb.QueueState
	err := tx.First(&state, "id = ?", 1).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		state = appdb.QueueState{ID: 1, CurrentNumber: "00"}
		err = tx.Create(&state).Error
	}
	return state, err
}

func nextQueueNumber(current string) (string, error) {
	if current == "" || current == "00" {
		return "A0", nil
	}
	if len(current) != 2 || current[0] < 'A' || current[0] > 'Z' || current[1] < '0' || current[1] > '9' {
		return "", errors.New("invalid current queue number")
	}
	if current == "Z9" {
		return "", errors.New("queue reached Z9")
	}
	if current[1] < '9' {
		return string([]byte{current[0], current[1] + 1}), nil
	}
	return string([]byte{current[0] + 1, '0'}), nil
}
