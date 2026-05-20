package routes

import (
	"github.com/aegisPhish/backend/internal/handlers"
	"github.com/aegisPhish/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
	campaignHandler *handlers.CampaignHandler,
	healthHandler *handlers.HealthHandler,
	secretKey string,
	corsOrigins []string,
) {
	// Public routes
	router.GET("/api/health", healthHandler.Health)

	// Auth routes
	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/logout", authHandler.Logout)
	}

	// Protected routes
	router.Use(middleware.AuthMiddleware(secretKey))

	// Campaign routes
	campaignGroup := router.Group("/api/campaigns")
	{
		campaignGroup.POST("", campaignHandler.CreateCampaign)
		campaignGroup.GET("", campaignHandler.ListCampaigns)
		campaignGroup.GET("/:id", campaignHandler.GetCampaign)
		campaignGroup.PUT("/:id", campaignHandler.UpdateCampaign)
		campaignGroup.DELETE("/:id", campaignHandler.DeleteCampaign)
		campaignGroup.GET("/:id/stats", campaignHandler.GetCampaignStats)
	}
}
