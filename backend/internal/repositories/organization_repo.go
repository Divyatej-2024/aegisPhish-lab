package repositories

import (
    "github.com/aegisPhish/backend/internal/models"
    "gorm.io/gorm"
)

type OrganizationRepository struct {
    db *gorm.DB
}

func NewOrganizationRepository(db *gorm.DB) *OrganizationRepository {
    return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) Create(org *models.Organization) error {
    return r.db.Create(org).Error
}

func (r *OrganizationRepository) GetByID(id string) (*models.Organization, error) {
    var org models.Organization
    err := r.db.Preload("Users").Preload("Departments").Preload("Campaigns").Where("id = ?", id).First(&org).Error
    if err != nil {
        return nil, err
    }
    return &org, nil
}

func (r *OrganizationRepository) ListAll() ([]models.Organization, error) {
    var orgs []models.Organization
    err := r.db.Order("created_at DESC").Find(&orgs).Error
    return orgs, err
}
