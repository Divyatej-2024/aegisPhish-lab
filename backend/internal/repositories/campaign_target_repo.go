package repositories

import (
	"github.com/aegisPhish/backend/internal/models"
	"gorm.io/gorm"
)

type CampaignTargetRepository struct {
	db *gorm.DB
}

func NewCampaignTargetRepository(db *gorm.DB) *CampaignTargetRepository {
	return &CampaignTargetRepository{db: db}
}

func (r *CampaignTargetRepository) Create(target *models.CampaignTarget) error {
	return r.db.Create(target).Error
}

func (r *CampaignTargetRepository) GetByID(id string) (*models.CampaignTarget, error) {
	var target models.CampaignTarget
	err := r.db.Where("id = ?", id).First(&target).Error
	if err != nil {
		return nil, err
	}
	return &target, nil
}

func (r *CampaignTargetRepository) GetByCampaign(campaignID string) ([]models.CampaignTarget, error) {
	var targets []models.CampaignTarget
	err := r.db.Where("campaign_id = ?", campaignID).Find(&targets).Error
	return targets, err
}

func (r *CampaignTargetRepository) Update(target *models.CampaignTarget) error {
	return r.db.Save(target).Error
}

func (r *CampaignTargetRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.CampaignTarget{}).Error
}
