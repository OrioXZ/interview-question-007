package db

type ExamQuestion struct {
	ID         int    `json:"id" gorm:"primaryKey"`
	QuestionNo int    `json:"question_no"`
	Text       string `json:"text"`
	CreatedAt  string `json:"created_at"`
}

type ExamOption struct {
	ID         int    `json:"id" gorm:"primaryKey"`
	QuestionID int    `json:"question_id"`
	Label      string `json:"label"`
	Text       string `json:"text"`
	IsCorrect  int    `json:"is_correct"`
}

type ExamResult struct {
	ID         int    `json:"id" gorm:"primaryKey"`
	TesterName string `json:"tester_name"`
	Score      int    `json:"score"`
	TotalScore int    `json:"total_score"`
	CreatedAt  string `json:"created_at"`
}

func (ExamQuestion) TableName() string { return "exam_questions" }
func (ExamOption) TableName() string   { return "exam_options" }
func (ExamResult) TableName() string   { return "exam_results" }
