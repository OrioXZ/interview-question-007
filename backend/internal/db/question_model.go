package db

type Question struct {
	ID         int    `json:"id" gorm:"primaryKey"`
	QuestionNo int    `json:"question_no"`
	Text       string `json:"text"`
	CreatedAt  string `json:"created_at"`
}

func (Question) TableName() string { return "questions" }
