package middleware

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "golang.org/x/time/rate"
)

func SecurityHeaders() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
        c.Writer.Header().Set("X-Frame-Options", "DENY")
        c.Writer.Header().Set("X-XSS-Protection", "1; mode=block")
        c.Writer.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
        c.Writer.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';")
        c.Next()
    }
}

func RateLimitMiddleware(limit rate.Limit, burst int) gin.HandlerFunc {
    limiter := rate.NewLimiter(limit, burst)
    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.JSON(http.StatusTooManyRequests, gin.H{
                "message": "Too many requests",
                "error":   "rate_limit_exceeded",
            })
            c.Abort()
            return
        }
        c.Next()
    }
}
