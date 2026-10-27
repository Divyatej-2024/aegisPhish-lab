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
	if orgID == "" || userID == "" {
		utils.RespondError(c, http.StatusUnauthorized, "Invalid authentication context", "", nil)
		return
	}
	campaign, err := h.campaignService.CreateCampaign(orgID, userID, &req)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to create campaign", "", nil)
		return
	}
	utils.RespondSuccess(c, http.StatusCreated, "Campaign created successfully", campaign)
}

func (h *CampaignHandler) GetCampaign(c *gin.Context) {
	campaign, err := h.campaignService.GetCampaignForOrganization(c.Param("id"), c.GetString("organization_id"))
	if err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaign", "", nil)
		}
		return
	}
	utils.RespondSuccess(c, http.StatusOK, "Campaign retrieved successfully", campaign)
}

func (h *CampaignHandler) ListCampaigns(c *gin.Context) {
	orgID := c.GetString("organization_id")
	if orgID == "" {
		utils.RespondError(c, http.StatusUnauthorized, "Invalid authentication context", "", nil)
		return
	}
	campaigns, err := h.campaignService.ListCampaigns(orgID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaigns", "", nil)
		return
	}
	utils.RespondSuccess(c, http.StatusOK, "Campaigns retrieved successfully", campaigns)
}

func (h *CampaignHandler) UpdateCampaign(c *gin.Context) {
	orgID := c.GetString("organization_id")
	if orgID == "" {
		utils.RespondError(c, http.StatusUnauthorized, "Invalid authentication context", "", nil)
		return
	}
	campaignID := c.Param("id")
	campaign, err := h.campaignService.GetCampaignForOrganization(campaignID, orgID)
	if err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaign", "", nil)
		}
		return
	}

	organizationID := campaign.OrganizationID
	createdByID := campaign.CreatedByID
	if err := c.ShouldBindJSON(campaign); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
		return
	}
	campaign.ID = campaignID
	campaign.OrganizationID = organizationID
	campaign.CreatedByID = createdByID

	if err := h.campaignService.UpdateCampaignForOrganization(campaign, orgID); err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to update campaign", "", nil)
		}
		return
	}
	utils.RespondSuccess(c, http.StatusOK, "Campaign updated successfully", campaign)
}

func (h *CampaignHandler) DeleteCampaign(c *gin.Context) {
	orgID := c.GetString("organization_id")
	if orgID == "" {
		utils.RespondError(c, http.StatusUnauthorized, "Invalid authentication context", "", nil)
		return
	}
	if err := h.campaignService.DeleteCampaignForOrganization(c.Param("id"), orgID); err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to delete campaign", "", nil)
		}
		return
	}
	utils.RespondSuccess(c, http.StatusOK, "Campaign deleted successfully", nil)
}

func (h *CampaignHandler) GetCampaignStats(c *gin.Context) {
	campaign, err := h.campaignService.GetCampaignForOrganization(c.Param("id"), c.GetString("organization_id"))
	if err != nil {
		if err == services.ErrCampaignNotFound {
			utils.RespondError(c, http.StatusNotFound, "Campaign not found", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve campaign", "", nil)
		}
		return
	}
	stats, err := h.campaignService.GetCampaignStats(campaign.ID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Failed to retrieve stats", "", nil)
		return
	}
	utils.RespondSuccess(c, http.StatusOK, "Campaign stats retrieved successfully", stats)
}
