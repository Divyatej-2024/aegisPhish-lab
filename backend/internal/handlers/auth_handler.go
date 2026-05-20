package handlers

import (
	"net/http"

	"github.com/aegisPhish/backend/internal/services"
	"github.com/aegisPhish/backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req services.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
		return
	}

	user, err := h.authService.Register(&req)
	if err != nil {
		if err == services.ErrUserAlreadyExists {
			utils.RespondError(c, http.StatusConflict, "User already exists", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Registration failed", err.Error(), nil)
		}
		return
	}

	utils.RespondSuccess(c, http.StatusCreated, "User registered successfully", user)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req services.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
		return
	}

	response, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		if err == services.ErrInvalidCredentials {
			utils.RespondError(c, http.StatusUnauthorized, "Invalid credentials", "", nil)
		} else {
			utils.RespondError(c, http.StatusInternalServerError, "Login failed", err.Error(), nil)
		}
		return
	}

	utils.RespondSuccess(c, http.StatusOK, "Login successful", response)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// Token is handled client-side, but we can invalidate on server if needed
	utils.RespondSuccess(c, http.StatusOK, "Logout successful", nil)
}
