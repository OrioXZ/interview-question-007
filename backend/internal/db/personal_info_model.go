package db

type PersonalInfo struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	FullName  string `json:"full_name"`
	BirthDate string `json:"birth_date"`
	Age       int    `json:"age"`
	Address   string `json:"address"`
	CreatedAt string `json:"created_at"`
}

func (PersonalInfo) TableName() string { return "personal_infos" }
