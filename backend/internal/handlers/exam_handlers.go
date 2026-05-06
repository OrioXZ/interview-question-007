package handlers

import (
	"net/http"
	"strings"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterExamRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/exam/questions", h.GetExamQuestions)
	r.POST("/exam/submissions", h.SubmitExam)
}

type ExamQuestionResponse struct {
	ID         int                  `json:"id"`
	QuestionNo int                  `json:"question_no"`
	Text       string               `json:"text"`
	Options    []ExamOptionResponse `json:"options"`
}

type ExamOptionResponse struct {
	ID    int    `json:"id"`
	Label string `json:"label"`
	Text  string `json:"text"`
}

func (h *Handlers) GetExamQuestions(c *gin.Context) {
	var questions []appdb.ExamQuestion
	if err := h.DB.Order("question_no ASC").Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var options []appdb.ExamOption
	if err := h.DB.Order("question_id ASC, label ASC").Find(&options).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	optionsByQuestion := map[int][]ExamOptionResponse{}
	for _, option := range options {
		optionsByQuestion[option.QuestionID] = append(optionsByQuestion[option.QuestionID], ExamOptionResponse{
			ID:    option.ID,
			Label: option.Label,
			Text:  option.Text,
		})
	}

	out := make([]ExamQuestionResponse, 0, len(questions))
	for _, question := range questions {
		out = append(out, ExamQuestionResponse{
			ID:         question.ID,
			QuestionNo: question.QuestionNo,
			Text:       question.Text,
			Options:    optionsByQuestion[question.ID],
		})
	}

	c.JSON(http.StatusOK, gin.H{"items": out})
}

type SubmitExamBody struct {
	TesterName string       `json:"tester_name" binding:"required"`
	Answers    []ExamAnswer `json:"answers" binding:"required"`
}

type ExamAnswer struct {
	QuestionID int `json:"question_id"`
	OptionID   int `json:"option_id"`
}

func (h *Handlers) SubmitExam(c *gin.Context) {
	var body SubmitExamBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	testerName := strings.TrimSpace(body.TesterName)
	if testerName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tester_name is required"})
		return
	}

	var questions []appdb.ExamQuestion
	if err := h.DB.Order("question_no ASC").Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(questions) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no exam questions found"})
		return
	}

	correctByQuestion := map[int]int{}
	for _, question := range questions {
		var option appdb.ExamOption
		if err := h.DB.Where("question_id = ? AND is_correct = 1", question.ID).First(&option).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "exam answer key is incomplete"})
			return
		}
		correctByQuestion[question.ID] = option.ID
	}

	selectedByQuestion := map[int]int{}
	for _, answer := range body.Answers {
		if _, ok := correctByQuestion[answer.QuestionID]; !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unknown question_id"})
			return
		}
		if _, exists := selectedByQuestion[answer.QuestionID]; exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "each question allows only one answer"})
			return
		}
		selectedByQuestion[answer.QuestionID] = answer.OptionID
	}

	if len(selectedByQuestion) != len(questions) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "please answer every question"})
		return
	}

	score := 0
	for questionID, correctOptionID := range correctByQuestion {
		if selectedByQuestion[questionID] == correctOptionID {
			score++
		}
	}

	result := appdb.ExamResult{
		TesterName: testerName,
		Score:      score,
		TotalScore: len(questions),
	}

	if err := h.DB.Create(&result).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.ExamResult
	_ = h.DB.First(&out, "id = ?", result.ID).Error

	c.JSON(http.StatusCreated, out)
}
