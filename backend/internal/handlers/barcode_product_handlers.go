package handlers

import (
	"net/http"
	"regexp"
	"strconv"
	"strings"

	appdb "it-approval-backend/internal/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var (
	barcodeCodePattern          = regexp.MustCompile(`^[A-Z0-9]{16}$`)
	formattedBarcodeCodePattern = regexp.MustCompile(`^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`)
)

func RegisterBarcodeProductRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/barcode-products", h.GetBarcodeProducts)
	r.POST("/barcode-products", h.CreateBarcodeProduct)
	r.DELETE("/barcode-products/:id", h.DeleteBarcodeProduct)
}

func (h *Handlers) GetBarcodeProducts(c *gin.Context) {
	var rows []appdb.BarcodeProduct
	if err := h.DB.Order("id ASC").Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": rows})
}

type CreateBarcodeProductBody struct {
	Code string `json:"code" binding:"required"`
}

func (h *Handlers) CreateBarcodeProduct(c *gin.Context) {
	var body CreateBarcodeProductBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	code, ok := normalizeBarcodeProductCode(body.Code)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code must be 16 uppercase letters/numbers formatted as xxxx-xxxx-xxxx-xxxx"})
		return
	}

	row := appdb.BarcodeProduct{Code: code}
	if err := h.DB.Create(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.BarcodeProduct
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}

func (h *Handlers) DeleteBarcodeProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	result := h.DB.Delete(&appdb.BarcodeProduct{}, id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "product code not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func normalizeBarcodeProductCode(value string) (string, bool) {
	code := strings.ToUpper(strings.TrimSpace(value))
	if strings.Contains(code, "-") && !formattedBarcodeCodePattern.MatchString(code) {
		return "", false
	}

	code = strings.ReplaceAll(code, "-", "")
	if !barcodeCodePattern.MatchString(code) {
		return "", false
	}

	return code, true
}
