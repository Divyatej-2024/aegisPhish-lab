package routes

import (
	"github.com/aegisPhish/backend/internal/handlers"
	"github.com/aegisPhish/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
	organizationHandler *handlers.OrganizationHandler,
	userHandler *handlers.UserHandler,
	campaignHandler *handlers.CampaignHandler,
	trackingHandler *handlers.TrackingHandler,
	dashboardHandler *handlers.DashboardHandler,
	healthHandler *handlers.HealthHandler,
	secretKey string,
	corsOrigins []string,
) {
	router.GET("/api/health", healthHandler.Health)

	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/logout", authHandler.Logout)
	}

	apiGroup := router.Group("/api")
	apiGroup.Use(middleware.AuthMiddleware(secretKey))

	apiGroup.GET("/dashboard/overview", dashboardHandler.Overview)

	orgGroup := apiGroup.Group("/organizations")
	{
		orgGroup.GET("", organizationHandler.ListOrganizations)
		orgGroup.GET("/:id", organizationHandler.GetOrganization)
		orgGroup.POST("", middleware.RoleMiddleware("super_admin", "organization_admin"), organizationHandler.CreateOrganization)
		orgGroup.GET("/:id/departments", organizationHandler.ListDepartments)
		orgGroup.POST("/:id/departments", middleware.RoleMiddleware("super_admin", "organization_admin"), organizationHandler.CreateDepartment)
	}

	userGroup := apiGroup.Group("/users")
	{
		userGroup.GET("", userHandler.ListUsers)
		userGroup.GET("/:id", userHandler.GetUser)
		userGroup.PUT("/:id", middleware.RoleMiddleware("super_admin", "organization_admin"), userHandler.UpdateUser)
		userGroup.DELETE("/:id", middleware.RoleMiddleware("super_admin", "organization_admin"), userHandler.DeleteUser)
	}

	campaignGroup := apiGroup.Group("/campaigns")
	{
		campaignGroup.POST("", campaignHandler.CreateCampaign)
		campaignGroup.GET("", campaignHandler.ListCampaigns)
		campaignGroup.GET("/:id", campaignHandler.GetCampaign)
		campaignGroup.PUT("/:id", campaignHandler.UpdateCampaign)
		campaignGroup.DELETE("/:id", campaignHandler.DeleteCampaign)
		campaignGroup.GET("/:id/stats", campaignHandler.GetCampaignStats)
	}

	trackingGroup := apiGroup.Group("/tracking")
	{
		trackingGroup.POST("", trackingHandler.TrackEvent)
	}
}
