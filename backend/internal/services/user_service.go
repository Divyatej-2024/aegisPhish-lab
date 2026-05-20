package services

import (
    "github.com/aegisPhish/backend/internal/models"
    "github.com/aegisPhish/backend/internal/repositories"
)

type UserService struct {
    userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
    return &UserService{userRepo: userRepo}
}

func (s *UserService) ListUsers(orgID string) ([]models.User, error) {
    return s.userRepo.ListByOrganization(orgID)
}

func (s *UserService) GetUser(id string) (*models.User, error) {
    return s.userRepo.GetByID(id)
}

func (s *UserService) UpdateUser(user *models.User) error {
    return s.userRepo.Update(user)
}

func (s *UserService) DeleteUser(id string) error {
    return s.userRepo.Delete(id)
}
