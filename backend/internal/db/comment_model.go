package db

type Comment struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	Commenter string `json:"commenter"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
}

func (Comment) TableName() string { return "comments" }
