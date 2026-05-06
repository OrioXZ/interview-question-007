package db

type QRProduct struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	Code      string `json:"code"`
	CreatedAt string `json:"created_at"`
}

func (QRProduct) TableName() string { return "qr_products" }
