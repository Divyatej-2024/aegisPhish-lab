package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	ServerPort string
	ServerEnv  string

	// Database
	DatabaseURL string

	// JWT
	JWTSecret string

	// CORS
	CORSOrigins []string

	// Email
	EmailFrom string
	SMTPHost  string
	SMTPPort  int
	SMTPUser  string
	SMTPPass  string
}

func Load() *Config {
	_ = godotenv.Load()

	return &Config{
		ServerPort:  getEnv("PORT", "8080"),
		ServerEnv:   getEnv("ENVIRONMENT", "development"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-key-change-in-production"),
		CORSOrigins: []string{
			getEnv("FRONTEND_URL", "http://localhost:3000"),
		},
		EmailFrom: getEnv("EMAIL_FROM", "noreply@aegisphish.com"),
		SMTPHost:  getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:  getEnvInt("SMTP_PORT", 587),
		SMTPUser:  getEnv("SMTP_USER", ""),
		SMTPPass:  getEnv("SMTP_PASS", ""),
	}
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	valStr := getEnv(key, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return defaultVal
}

func (c *Config) GetDSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "aegisphish"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_SSLMODE", "disable"),
	)
}
