package repositories

import (
    "github.com/aegisPhish/backend/internal/models"
    "gorm.io/gorm"
)

type DepartmentRepository struct {
    db *gorm.DB
}

func NewDepartmentRepository(db *gorm.DB) *DepartmentRepository {
    return &DepartmentRepository{db: db}
}

func (r *DepartmentRepository) Create(department *models.Department) error {
    return r.db.Create(department).Error
}

func (r *DepartmentRepository) GetByID(id string) (*models.Department, error) {
    var department models.Department
    err := r.db.Where("id = ?", id).First(&department).Error
    if err != nil {
        return nil, err
    }
    return &department, nil
}

func (r *DepartmentRepository) ListByOrganization(orgID string) ([]models.Department, error) {
    var departments []models.Department
    err := r.db.Where("organization_id = ?", orgID).Order("created_at DESC").Find(&departments).Error
    return departments, err
}
