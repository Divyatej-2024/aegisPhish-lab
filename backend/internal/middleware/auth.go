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

		parts := strings.Fields(authHeader)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			utils.RespondError(c, http.StatusUnauthorized, "Invalid authorization header format", "", nil)
			c.Abort()
			return
		}

		claims, err := utils.ValidateJWT(parts[1], secretKey)
		if err != nil {
			// Keep token-validation details out of client responses.
			utils.RespondError(c, http.StatusUnauthorized, "Invalid or expired token", "", nil)
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

// RoleMiddleware checks if user has required role.
func RoleMiddleware(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			utils.RespondError(c, http.StatusForbidden, "User role not found", "", nil)
			c.Abort()
			return
		}

		role, ok := userRole.(string)
		if !ok || role == "" {
			utils.RespondError(c, http.StatusForbidden, "Invalid user role", "", nil)
			c.Abort()
			return
		}

		for _, requiredRole := range requiredRoles {
			if role == requiredRole {
				c.Next()
				return
			}
		}

		utils.RespondError(c, http.StatusForbidden, "Insufficient permissions", "", nil)
		c.Abort()
	}
}

// CORSMiddleware provides CORS headers.
func CORSMiddleware(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowed := false

		for _, allowedOrigin := range origins {
			if origin != "" && allowedOrigin == origin {
				allowed = true
				break
			}
		}

		if allowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Add("Vary", "Origin")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		}

		if c.Request.Method == http.MethodOptions {
			if allowed {
				c.AbortWithStatus(http.StatusNoContent)
				return
			}
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		c.Next()
	}
}
