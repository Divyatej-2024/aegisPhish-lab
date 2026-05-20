package main

import (
	"fmt"
	"log"

	"github.com/aegisPhish/backend/internal/config"
	"github.com/aegisPhish/backend/internal/handlers"
	"github.com/aegisPhish/backend/internal/middleware"
	"github.com/aegisPhish/backend/internal/repositories"
	"github.com/aegisPhish/backend/internal/routes"
	"github.com/aegisPhish/backend/internal/services"
	"github.com/aegisPhish/backend/pkg/database"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.InitDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	campaignRepo := repositories.NewCampaignRepository(db)
	campaignTargetRepo := repositories.NewCampaignTargetRepository(db)
	trackingRepo := repositories.NewTrackingEventRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	campaignService := services.NewCampaignService(campaignRepo, campaignTargetRepo, trackingRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	campaignHandler := handlers.NewCampaignHandler(campaignService)
	healthHandler := handlers.NewHealthHandler()

	// Create Gin router
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORSMiddleware(cfg.CORSOrigins))

	// Setup routes
	routes.SetupRoutes(router, authHandler, campaignHandler, healthHandler, cfg.JWTSecret, cfg.CORSOrigins)

	// Start server
	address := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Starting server on %s in %s environment", address, cfg.ServerEnv)
	if err := router.Run(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
