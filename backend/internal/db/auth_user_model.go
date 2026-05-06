package db

type AuthUser struct {
	ID           int    `json:"id" gorm:"primaryKey"`
	Username     string `json:"username"`
	PasswordHash string `json:"-" gorm:"column:password_hash"`
	CreatedAt    string `json:"created_at"`
}

func (AuthUser) TableName() string { return "auth_users" }
