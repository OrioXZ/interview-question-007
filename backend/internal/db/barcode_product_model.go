package db

type BarcodeProduct struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	Code      string `json:"code"`
	CreatedAt string `json:"created_at"`
}

func (BarcodeProduct) TableName() string { return "barcode_products" }
