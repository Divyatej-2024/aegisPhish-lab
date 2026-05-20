package services

import (
    "github.com/aegisPhish/backend/internal/models"
    "github.com/aegisPhish/backend/internal/repositories"
)

type OrganizationService struct {
    orgRepo       *repositories.OrganizationRepository
    departmentRepo *repositories.DepartmentRepository
}

func NewOrganizationService(orgRepo *repositories.OrganizationRepository, departmentRepo *repositories.DepartmentRepository) *OrganizationService {
    return &OrganizationService{
        orgRepo:        orgRepo,
        departmentRepo: departmentRepo,
    }
}

type CreateOrganizationRequest struct {
    Name    string `json:"name" binding:"required,min=3,max=120"`
    Slug    string `json:"slug" binding:"required"`
    Website string `json:"website" binding:"omitempty,url"`
    LogoURL string `json:"logo_url" binding:"omitempty,url"`
}

type CreateDepartmentRequest struct {
    Name string `json:"name" binding:"required,min=2,max=100"`
}

func (s *OrganizationService) CreateOrganization(req *CreateOrganizationRequest) (*models.Organization, error) {
    organization := &models.Organization{
        Name:    req.Name,
        Slug:    req.Slug,
        Website: req.Website,
        LogoURL: req.LogoURL,
    }
    if err := s.orgRepo.Create(organization); err != nil {
        return nil, err
    }
    return organization, nil
}

func (s *OrganizationService) GetOrganization(id string) (*models.Organization, error) {
    return s.orgRepo.GetByID(id)
}

func (s *OrganizationService) ListOrganizations() ([]models.Organization, error) {
    return s.orgRepo.ListAll()
}

func (s *OrganizationService) CreateDepartment(orgID string, req *CreateDepartmentRequest) (*models.Department, error) {
    department := &models.Department{
        Name:           req.Name,
        OrganizationID: orgID,
    }
    if err := s.departmentRepo.Create(department); err != nil {
        return nil, err
    }
    return department, nil
}

func (s *OrganizationService) ListDepartments(orgID string) ([]models.Department, error) {
    return s.departmentRepo.ListByOrganization(orgID)
}
