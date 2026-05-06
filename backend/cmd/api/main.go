package main

import (
	"log"
	"os"
	"time"

	appdb "it-approval-backend/internal/db"
	"it-approval-backend/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	_ = os.MkdirAll("db", 0755)

	gdb, err := appdb.NewDB()
	if err != nil {
		log.Fatal(err)
	}

	if err := appdb.MigrateAndSeed(gdb, "migrations"); err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	handlers.RegisterRoutes(r, gdb)
	handlers.RegisterCommentRoutes(r, gdb)
	handlers.RegisterPersonalInfoRoutes(r, gdb)
	handlers.RegisterProfileRoutes(r, gdb)
	handlers.RegisterQuestionRoutes(r, gdb)
	handlers.RegisterExamRoutes(r, gdb)
	handlers.RegisterBarcodeProductRoutes(r, gdb)
	handlers.RegisterQRProductRoutes(r, gdb)
	handlers.RegisterQueueRoutes(r, gdb)
	handlers.RegisterAuthRoutes(r, gdb)

	log.Println("listening on :8080")
	_ = r.Run(":8080")
}
