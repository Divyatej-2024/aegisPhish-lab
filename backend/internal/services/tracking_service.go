package services

import (
    "github.com/aegisPhish/backend/internal/models"
    "github.com/aegisPhish/backend/internal/repositories"
)

type TrackingService struct {
    trackingRepo *repositories.TrackingEventRepository
}

func NewTrackingService(trackingRepo *repositories.TrackingEventRepository) *TrackingService {
    return &TrackingService{trackingRepo: trackingRepo}
}

type TrackEventRequest struct {
    CampaignID       string                 `json:"campaign_id" binding:"required,uuid"`
    CampaignTargetID string                 `json:"campaign_target_id" binding:"required,uuid"`
    UserID           string                 `json:"user_id" binding:"required,uuid"`
    EventType        string                 `json:"event_type" binding:"required,oneof=open click submit"`
    IPAddress        string                 `json:"ip_address" binding:"required,ip"`
    UserAgent        string                 `json:"user_agent" binding:"required"`
    DeviceInfo       map[string]interface{} `json:"device_info"`
}

func (s *TrackingService) TrackEvent(req *TrackEventRequest) (*models.TrackingEvent, error) {
    event := &models.TrackingEvent{
        CampaignID:       req.CampaignID,
        CampaignTargetID: req.CampaignTargetID,
        UserID:           req.UserID,
        EventType:        req.EventType,
        IPAddress:        req.IPAddress,
        UserAgent:        req.UserAgent,
        DeviceInfo:       req.DeviceInfo,
    }
    if err := s.trackingRepo.Create(event); err != nil {
        return nil, err
    }
    return event, nil
}
