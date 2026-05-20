package utils

import "github.com/gin-gonic/gin"

type ErrorResponse struct {
	Message string      `json:"message"`
	Error   string      `json:"error,omitempty"`
	Details interface{} `json:"details,omitempty"`
}

type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func RespondError(c *gin.Context, statusCode int, message, errorDetail string, details interface{}) {
	c.JSON(statusCode, ErrorResponse{
		Message: message,
		Error:   errorDetail,
		Details: details,
	})
}

func RespondSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, SuccessResponse{
		Message: message,
		Data:    data,
	})
}
