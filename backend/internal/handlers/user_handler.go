package handlers

import (
    "net/http"

    "github.com/aegisPhish/backend/internal/models"
    "github.com/aegisPhish/backend/internal/services"
    "github.com/aegisPhish/backend/pkg/utils"
    "github.com/gin-gonic/gin"
)

type UserHandler struct {
    userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
    return &UserHandler{userService: userService}
}

func (h *UserHandler) ListUsers(c *gin.Context) {
    orgID := c.GetString("organization_id")
    users, err := h.userService.ListUsers(orgID)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Unable to load users", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "Users retrieved successfully", users)
}

func (h *UserHandler) GetUser(c *gin.Context) {
    userID := c.Param("id")
    user, err := h.userService.GetUser(userID)
    if err != nil {
        utils.RespondError(c, http.StatusNotFound, "User not found", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "User retrieved successfully", user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
    userID := c.Param("id")
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
        return
    }

    user.ID = userID
    if err := h.userService.UpdateUser(&user); err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to update user", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "User updated successfully", user)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
    userID := c.Param("id")
    if err := h.userService.DeleteUser(userID); err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to delete user", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "User deleted successfully", nil)
}
