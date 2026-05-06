package db

type Profile struct {
	ID                 int    `json:"id" gorm:"primaryKey"`
	FullName           string `json:"full_name"`
	Email              string `json:"email"`
	Phone              string `json:"phone"`
	BirthDay           string `json:"birth_day"`
	Occupation         string `json:"occupation"`
	ProfileImageBase64 string `json:"profile_image_base64"`
	CreatedAt          string `json:"created_at"`
}

func (Profile) TableName() string { return "profiles" }
