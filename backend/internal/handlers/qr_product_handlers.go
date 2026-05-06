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
	qrProductCodePattern          = regexp.MustCompile(`^[A-Z0-9]{30}$`)
	formattedQRProductCodePattern = regexp.MustCompile(`^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$`)
)

func RegisterQRProductRoutes(r *gin.Engine, db *gorm.DB) {
	h := &Handlers{DB: db}

	r.GET("/qr-products", h.GetQRProducts)
	r.POST("/qr-products", h.CreateQRProduct)
	r.DELETE("/qr-products/:id", h.DeleteQRProduct)
}

func (h *Handlers) GetQRProducts(c *gin.Context) {
	var rows []appdb.QRProduct
	if err := h.DB.Order("id ASC").Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": rows})
}

type CreateQRProductBody struct {
	Code string `json:"code" binding:"required"`
}

func (h *Handlers) CreateQRProduct(c *gin.Context) {
	var body CreateQRProductBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}

	code, ok := normalizeQRProductCode(body.Code)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code must be 30 uppercase letters/numbers formatted as xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx"})
		return
	}

	var count int64
	if err := h.DB.Model(&appdb.QRProduct{}).Where("code = ?", code).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "product code must be unique"})
		return
	}

	row := appdb.QRProduct{Code: code}
	if err := h.DB.Create(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var out appdb.QRProduct
	_ = h.DB.First(&out, "id = ?", row.ID).Error

	c.JSON(http.StatusCreated, out)
}

func (h *Handlers) DeleteQRProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	result := h.DB.Delete(&appdb.QRProduct{}, id)
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

func normalizeQRProductCode(value string) (string, bool) {
	code := strings.ToUpper(strings.TrimSpace(value))
	if strings.Contains(code, "-") && !formattedQRProductCodePattern.MatchString(code) {
		return "", false
	}

	code = strings.ReplaceAll(code, "-", "")
	if !qrProductCodePattern.MatchString(code) {
		return "", false
	}

	return code, true
}
