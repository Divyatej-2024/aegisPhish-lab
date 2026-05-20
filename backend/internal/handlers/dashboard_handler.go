package handlers

import (
    "net/http"

    "github.com/aegisPhish/backend/internal/services"
    "github.com/aegisPhish/backend/pkg/utils"
    "github.com/gin-gonic/gin"
)

type DashboardHandler struct {
    dashboardService *services.DashboardService
}

func NewDashboardHandler(dashboardService *services.DashboardService) *DashboardHandler {
    return &DashboardHandler{dashboardService: dashboardService}
}

func (h *DashboardHandler) Overview(c *gin.Context) {
    orgID := c.GetString("organization_id")
    overview, err := h.dashboardService.Overview(orgID)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to load dashboard overview", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "Dashboard overview retrieved successfully", overview)
}
