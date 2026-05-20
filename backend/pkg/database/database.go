package database

import (
	"fmt"

	"github.com/aegisPhish/backend/internal/config"
	"github.com/aegisPhish/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDatabase(cfg *config.Config) (*gorm.DB, error) {
	dsn := cfg.GetDSN()

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto-migrate models
	err = db.AutoMigrate(
		&models.Organization{},
		&models.User{},
		&models.Department{},
		&models.Campaign{},
		&models.EmailTemplate{},
		&models.CampaignTarget{},
		&models.TrackingEvent{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to auto-migrate models: %w", err)
	}

	return db, nil
}
