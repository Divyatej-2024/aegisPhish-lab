package handlers

import (
    "net/http"

    "github.com/aegisPhish/backend/internal/services"
    "github.com/aegisPhish/backend/pkg/utils"
    "github.com/gin-gonic/gin"
)

type TrackingHandler struct {
    trackingService *services.TrackingService
}

func NewTrackingHandler(trackingService *services.TrackingService) *TrackingHandler {
    return &TrackingHandler{trackingService: trackingService}
}

func (h *TrackingHandler) TrackEvent(c *gin.Context) {
    var req services.TrackEventRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
        return
    }

    event, err := h.trackingService.TrackEvent(&req)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to record tracking event", err.Error(), nil)
        return
    }

    utils.RespondSuccess(c, http.StatusCreated, "Tracking event recorded", event)
}
