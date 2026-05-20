package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aegisPhish/backend/internal/config"
	"github.com/aegisPhish/backend/pkg/cache"
	"github.com/aegisPhish/backend/internal/handlers"
	"github.com/aegisPhish/backend/internal/middleware"
	"github.com/aegisPhish/backend/internal/repositories"
	"github.com/aegisPhish/backend/internal/routes"
	"github.com/aegisPhish/backend/internal/services"
	"github.com/aegisPhish/backend/pkg/database"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.InitDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	redisClient, err := cache.NewRedisClient(cfg.RedisURL)
	if err != nil {
		log.Printf("Redis configuration error: %v", err)
	}
	if redisClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		if err := cache.Ping(ctx, redisClient); err != nil {
			log.Printf("Warning: Redis not available: %v", err)
		}
	}

	userRepo := repositories.NewUserRepository(db)
	organizationRepo := repositories.NewOrganizationRepository(db)
	departmentRepo := repositories.NewDepartmentRepository(db)
	campaignRepo := repositories.NewCampaignRepository(db)
	campaignTargetRepo := repositories.NewCampaignTargetRepository(db)
	trackingRepo := repositories.NewTrackingEventRepository(db)

	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	organizationService := services.NewOrganizationService(organizationRepo, departmentRepo)
	userService := services.NewUserService(userRepo)
	campaignService := services.NewCampaignService(campaignRepo, campaignTargetRepo, trackingRepo)
	trackingService := services.NewTrackingService(trackingRepo)
	dashboardService := services.NewDashboardService(campaignRepo, userRepo, trackingRepo)

	authHandler := handlers.NewAuthHandler(authService)
	organizationHandler := handlers.NewOrganizationHandler(organizationService)
	userHandler := handlers.NewUserHandler(userService)
	campaignHandler := handlers.NewCampaignHandler(campaignService)
	trackingHandler := handlers.NewTrackingHandler(trackingService)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)
	healthHandler := handlers.NewHealthHandler()

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware(cfg.CORSOrigins))
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.RateLimitMiddleware(10, 20))

	routes.SetupRoutes(router, authHandler, organizationHandler, userHandler, campaignHandler, trackingHandler, dashboardHandler, healthHandler, cfg.JWTSecret, cfg.CORSOrigins)

	address := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Starting server on %s in %s environment", address, cfg.ServerEnv)
	if err := router.Run(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
