package repositories

import (
	"github.com/aegisPhish/backend/internal/models"
	"gorm.io/gorm"
)

type CampaignRepository struct {
	db *gorm.DB
}

func NewCampaignRepository(db *gorm.DB) *CampaignRepository {
	return &CampaignRepository{db: db}
}

func (r *CampaignRepository) Create(campaign *models.Campaign) error {
	return r.db.Create(campaign).Error
}

func (r *CampaignRepository) GetByID(id string) (*models.Campaign, error) {
	var campaign models.Campaign
	err := r.db.Preload("CreatedBy").Preload("EmailTemplate").Preload("Targets").
		Where("id = ?", id).First(&campaign).Error
	if err != nil {
		return nil, err
	}
	return &campaign, nil
}

func (r *CampaignRepository) Update(campaign *models.Campaign) error {
	return r.db.Save(campaign).Error
}

func (r *CampaignRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.Campaign{}).Error
}

func (r *CampaignRepository) ListByOrganization(orgID string) ([]models.Campaign, error) {
	var campaigns []models.Campaign
	err := r.db.Where("organization_id = ?", orgID).
		Preload("CreatedBy").
		Preload("EmailTemplate").
		Order("created_at DESC").
		Find(&campaigns).Error
	return campaigns, err
}

func (r *CampaignRepository) ListByStatus(orgID, status string) ([]models.Campaign, error) {
	var campaigns []models.Campaign
	err := r.db.Where("organization_id = ? AND status = ?", orgID, status).
		Preload("CreatedBy").
		Order("created_at DESC").
		Find(&campaigns).Error
	return campaigns, err
}

func (r *CampaignRepository) CountByOrganization(orgID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Campaign{}).
		Where("organization_id = ?", orgID).
		Count(&count).Error
	return count, err
}

func (r *CampaignRepository) CountByStatus(orgID, status string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Campaign{}).
		Where("organization_id = ? AND status = ?", orgID, status).
		Count(&count).Error
	return count, err
}
