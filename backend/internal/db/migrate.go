package db

import (
	"fmt"
	"os"
	"path/filepath"

	"gorm.io/gorm"
)

func execSQLFile(gdb *gorm.DB, path string) error {
	b, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	if err := gdb.Exec(string(b)).Error; err != nil {
		return fmt.Errorf("exec %s failed: %w", path, err)
	}
	return nil
}

func MigrateAndSeed(gdb *gorm.DB, migrationsDir string) error {
	files := []string{
		filepath.Join(migrationsDir, "001_init.sql"),
		filepath.Join(migrationsDir, "002_seed.sql"),
		filepath.Join(migrationsDir, "003_comments.sql"),
		filepath.Join(migrationsDir, "004_personal_infos.sql"),
		filepath.Join(migrationsDir, "005_profiles.sql"),
		filepath.Join(migrationsDir, "006_questions.sql"),
		filepath.Join(migrationsDir, "007_exam.sql"),
		filepath.Join(migrationsDir, "008_barcode_products.sql"),
		filepath.Join(migrationsDir, "009_qr_products.sql"),
		filepath.Join(migrationsDir, "010_queue.sql"),
		filepath.Join(migrationsDir, "011_auth_users.sql"),
	}
	for _, f := range files {
		if err := execSQLFile(gdb, f); err != nil {
			return err
		}
	}
	return nil
}
