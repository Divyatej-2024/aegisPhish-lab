package services

import (
    "github.com/aegisPhish/backend/internal/repositories"
)

type DashboardService struct {
    campaignRepo *repositories.CampaignRepository
    userRepo     *repositories.UserRepository
    trackingRepo *repositories.TrackingEventRepository
}

type DashboardOverview struct {
    CampaignCount     int64   `json:"campaign_count"`
    ActiveCampaigns   int64   `json:"active_campaigns"`
    UserCount         int64   `json:"user_count"`
    OpenEvents        int64   `json:"open_events"`
    ClickEvents       int64   `json:"click_events"`
    SubmissionEvents  int64   `json:"submission_events"`
}

func NewDashboardService(
    campaignRepo *repositories.CampaignRepository,
    userRepo *repositories.UserRepository,
    trackingRepo *repositories.TrackingEventRepository,
) *DashboardService {
    return &DashboardService{
        campaignRepo: campaignRepo,
        userRepo:     userRepo,
        trackingRepo: trackingRepo,
    }
}

func (s *DashboardService) Overview(orgID string) (*DashboardOverview, error) {
    campaignCount, err := s.campaignRepo.CountByOrganization(orgID)
    if err != nil {
        return nil, err
    }

    activeCampaigns, err := s.campaignRepo.CountByStatus(orgID, "active")
    if err != nil {
        return nil, err
    }

    users, err := s.userRepo.ListByOrganization(orgID)
    if err != nil {
        return nil, err
    }

    eventStats, err := s.trackingRepo.CountByOrganization(orgID)
    if err != nil {
        return nil, err
    }

    return &DashboardOverview{
        CampaignCount:    campaignCount,
        ActiveCampaigns:  activeCampaigns,
        UserCount:        int64(len(users)),
        OpenEvents:       eventStats["open"],
        ClickEvents:      eventStats["click"],
        SubmissionEvents: eventStats["submit"],
    }, nil
}
