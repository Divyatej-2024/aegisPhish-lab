package services

import (
	"github.com/aegisPhish/backend/internal/models"
	"github.com/aegisPhish/backend/internal/repositories"
	"github.com/aegisPhish/backend/pkg/utils"
)

type AuthService struct {
	userRepo  *repositories.UserRepository
	secretKey string
}

func NewAuthService(userRepo *repositories.UserRepository, secretKey string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		secretKey: secretKey,
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         *models.User `json:"user"`
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	OrgID     string `json:"organization_id" binding:"required"`
}

func (s *AuthService) Register(req *RegisterRequest) (*LoginResponse, error) {
	// Check if user already exists
	existingUser, _ := s.userRepo.GetByEmail(req.Email)
	if existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:          req.Email,
		PasswordHash:   hashedPassword,
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		OrganizationID: req.OrgID,
		Role:           "employee",
		IsActive:       true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	accessToken, err := utils.GenerateJWT(user.ID, user.Email, user.Role, user.OrganizationID, s.secretKey)
	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, s.secretKey)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}

func (s *AuthService) Login(email, password string) (*LoginResponse, error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := utils.ComparePassword(user.PasswordHash, password); err != nil {
		return nil, ErrInvalidCredentials
	}

	accessToken, err := utils.GenerateJWT(user.ID, user.Email, user.Role, user.OrganizationID, s.secretKey)
	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, s.secretKey)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}
