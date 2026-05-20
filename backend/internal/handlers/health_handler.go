package handlers

import (
	"net/http"

	"github.com/aegisPhish/backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) Health(c *gin.Context) {
	utils.RespondSuccess(c, http.StatusOK, "API is healthy", gin.H{
		"status": "ok",
	})
}
