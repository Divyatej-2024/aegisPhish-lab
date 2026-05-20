package services

import (
	"github.com/aegisPhish/backend/internal/models"
	"github.com/aegisPhish/backend/internal/repositories"
)

type CampaignService struct {
	campaignRepo *repositories.CampaignRepository
	targetRepo   *repositories.CampaignTargetRepository
	trackingRepo *repositories.TrackingEventRepository
}

func NewCampaignService(
	campaignRepo *repositories.CampaignRepository,
	targetRepo *repositories.CampaignTargetRepository,
	trackingRepo *repositories.TrackingEventRepository,
) *CampaignService {
	return &CampaignService{
		campaignRepo: campaignRepo,
		targetRepo:   targetRepo,
		trackingRepo: trackingRepo,
	}
}

type CreateCampaignRequest struct {
	Name            string      `json:"name" binding:"required"`
	Description     string      `json:"description"`
	EmailTemplateID string      `json:"email_template_id" binding:"required"`
	ScheduledAt     *string     `json:"scheduled_at"`
	Settings        map[string]interface{} `json:"settings"`
}

func (s *CampaignService) CreateCampaign(orgID, userID string, req *CreateCampaignRequest) (*models.Campaign, error) {
	campaign := &models.Campaign{
		Name:            req.Name,
		Description:     req.Description,
		OrganizationID:  orgID,
		CreatedByID:     userID,
		EmailTemplateID: req.EmailTemplateID,
		Status:          "draft",
	}

	if err := s.campaignRepo.Create(campaign); err != nil {
		return nil, err
	}

	return campaign, nil
}

func (s *CampaignService) GetCampaign(campaignID string) (*models.Campaign, error) {
	campaign, err := s.campaignRepo.GetByID(campaignID)
	if err != nil {
		return nil, ErrCampaignNotFound
	}
	return campaign, nil
}

func (s *CampaignService) UpdateCampaign(campaign *models.Campaign) error {
	return s.campaignRepo.Update(campaign)
}

func (s *CampaignService) DeleteCampaign(campaignID string) error {
	return s.campaignRepo.Delete(campaignID)
}

func (s *CampaignService) ListCampaigns(orgID string) ([]models.Campaign, error) {
	return s.campaignRepo.ListByOrganization(orgID)
}

type CampaignStats struct {
	TotalTargets       int64   `json:"total_targets"`
	Opens              int64   `json:"opens"`
	Clicks             int64   `json:"clicks"`
	Submissions        int64   `json:"submissions"`
	OpenRate           float64 `json:"open_rate"`
	ClickRate          float64 `json:"click_rate"`
	SubmissionRate     float64 `json:"submission_rate"`
}

func (s *CampaignService) GetCampaignStats(campaignID string) (*CampaignStats, error) {
	stats, err := s.trackingRepo.GetCampaignStats(campaignID)
	if err != nil {
		return nil, err
	}

	targets, err := s.targetRepo.GetByCampaign(campaignID)
	if err != nil {
		return nil, err
	}

	totalTargets := int64(len(targets))
	if totalTargets == 0 {
		totalTargets = 1 // Avoid division by zero
	}

	return &CampaignStats{
		TotalTargets:   totalTargets,
		Opens:          stats["open"],
		Clicks:         stats["click"],
		Submissions:    stats["submit"],
		OpenRate:       float64(stats["open"]) / float64(totalTargets) * 100,
		ClickRate:      float64(stats["click"]) / float64(totalTargets) * 100,
		SubmissionRate: float64(stats["submit"]) / float64(totalTargets) * 100,
	}, nil
}
