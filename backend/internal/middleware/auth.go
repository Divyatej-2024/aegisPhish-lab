package middleware

import (
	"net/http"
	"strings"

	"github.com/aegisPhish/backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.RespondError(c, http.StatusUnauthorized, "Missing authorization header", "", nil)
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.RespondError(c, http.StatusUnauthorized, "Invalid authorization header format", "", nil)
			c.Abort()
			return
		}

		claims, err := utils.ValidateJWT(parts[1], secretKey)
		if err != nil {
			utils.RespondError(c, http.StatusUnauthorized, "Invalid or expired token", err.Error(), nil)
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("organization_id", claims.OrganizationID)

		c.Next()
	}
}

// RoleMiddleware checks if user has required role
func RoleMiddleware(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			utils.RespondError(c, http.StatusForbidden, "User role not found", "", nil)
			c.Abort()
			return
		}

		role := userRole.(string)
		allowed := false
		for _, requiredRole := range requiredRoles {
			if role == requiredRole {
				allowed = true
				break
			}
		}

		if !allowed {
			utils.RespondError(c, http.StatusForbidden, "Insufficient permissions", "", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}

// CORSMiddleware provides CORS headers
func CORSMiddleware(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowed := false

		for _, allowedOrigin := range origins {
			if allowedOrigin == origin {
				allowed = true
				break
			}
		}

		if allowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
