package repositories

import (
	"github.com/aegisPhish/backend/internal/models"
	"gorm.io/gorm"
)

type TrackingEventRepository struct {
	db *gorm.DB
}

func NewTrackingEventRepository(db *gorm.DB) *TrackingEventRepository {
	return &TrackingEventRepository{db: db}
}

func (r *TrackingEventRepository) Create(event *models.TrackingEvent) error {
	return r.db.Create(event).Error
}

func (r *TrackingEventRepository) GetByCampaign(campaignID string) ([]models.TrackingEvent, error) {
	var events []models.TrackingEvent
	err := r.db.Where("campaign_id = ?", campaignID).
		Order("timestamp DESC").
		Find(&events).Error
	return events, err
}

func (r *TrackingEventRepository) CountByEventType(campaignID, eventType string) (int64, error) {
	var count int64
	err := r.db.Where("campaign_id = ? AND event_type = ?", campaignID, eventType).
		Count(&count).Error
	return count, err
}

func (r *TrackingEventRepository) GetCampaignStats(campaignID string) (map[string]int64, error) {
	stats := make(map[string]int64)
	events := []string{"open", "click", "submit"}

	for _, eventType := range events {
		count, err := r.CountByEventType(campaignID, eventType)
		if err != nil {
			return nil, err
		}
		stats[eventType] = count
	}

	return stats, nil
}

func (r *TrackingEventRepository) CountByOrganization(orgID string) (map[string]int64, error) {
	stats := make(map[string]int64)
	events := []string{"open", "click", "submit"}

	for _, eventType := range events {
		var count int64
		err := r.db.Model(&models.TrackingEvent{}).
			Joins("JOIN campaigns ON campaigns.id = tracking_events.campaign_id").
			Where("campaigns.organization_id = ? AND tracking_events.event_type = ?", orgID, eventType).
			Count(&count).Error
		if err != nil {
			return nil, err
		}
		stats[eventType] = count
	}

	return stats, nil
}
