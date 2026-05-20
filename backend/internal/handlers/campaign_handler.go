package handlers

import (
	"net/http"

	"github.com/aegisPhish/backend/internal/services"
	"github.com/aegisPhish/backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

type CampaignHandler struct {
	campaignService *services.CampaignService
}

func NewCampaignHandler(campaignService *services.CampaignService) *CampaignHandler {
	return &CampaignHandler{campaignService: campaignService}
}

func (h *CampaignHandler) CreateCampaign(c *gin.Context) {
	var req services.CreateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
		return
	}

	orgID := c.GetString("organization_id")
	userID := c.GetString("user_id")

	campaign, err := h.campaignService.CreateCampaign(orgID, userID, &req)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to create campaign", err.Error(), nil)
		return
	}

	utils.RespondSuccess(c, http.StatusCreated, "Campaign created successfully", campaign)
}

func (h *CampaignHandler) GetCampaign(c *gin.Context) {
	campaignID := c.Param("id")

	campaign, err := h.campaignService.GetCampaign(campaignID)
	if err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaign", err.Error(), nil)
		}
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Campaign retrieved successfully", campaign)
}

func (h *CampaignHandler) ListCampaigns(c *gin.Context) {
	orgID := c.GetString("organization_id")

	campaigns, err := h.campaignService.ListCampaigns(orgID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaigns", err.Error(), nil)
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Campaigns retrieved successfully", campaigns)
}

func (h *CampaignHandler) UpdateCampaign(c *gin.Context) {
	campaignID := c.Param("id")

	campaign, err := h.campaignService.GetCampaign(campaignID)
	if err != nil {
		utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		return
	}

	if err := c.ShouldBindJSON(&campaign); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
		return
	}

	campaign.ID = campaignID
	if err := h.campaignService.UpdateCampaign(campaign); err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to update campaign", err.Error(), nil)
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Campaign updated successfully", campaign)
}

func (h *CampaignHandler) DeleteCampaign(c *gin.Context) {
	campaignID := c.Param("id")

	if err := h.campaignService.DeleteCampaign(campaignID); err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to delete campaign", err.Error(), nil)
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Campaign deleted successfully", nil)
}

func (h *CampaignHandler) GetCampaignStats(c *gin.Context) {
	campaignID := c.Param("id")

	stats, err := h.campaignService.GetCampaignStats(campaignID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve stats", err.Error(), nil)
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Campaign stats retrieved successfully", stats)
}
