package db

type QueueState struct {
	ID            int    `json:"id" gorm:"primaryKey"`
	CurrentNumber string `json:"current_number"`
	UpdatedAt     string `json:"updated_at"`
}

func (QueueState) TableName() string { return "queue_state" }
