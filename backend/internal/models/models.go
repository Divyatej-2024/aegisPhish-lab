package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// User represents a system user
type User struct {
	ID            string    `gorm:"primaryKey;type:uuid" json:"id"`
	Email         string    `gorm:"uniqueIndex;type:varchar(255)" json:"email"`
	PasswordHash  string    `gorm:"type:varchar(255)" json:"-"`
	FirstName     string    `gorm:"type:varchar(255)" json:"first_name"`
	LastName      string    `gorm:"type:varchar(255)" json:"last_name"`
	Role          string    `gorm:"type:varchar(50);index" json:"role"` // admin, trainer, employee
	OrganizationID string   `gorm:"type:uuid;index" json:"organization_id"`
	DepartmentID  *string   `gorm:"type:uuid" json:"department_id"`
	IsActive      bool      `gorm:"default:true" json:"is_active"`
	LastLogin     *time.Time `json:"last_login"`
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	Organization *Organization `json:"organization,omitempty"`
	Department   *Department   `json:"department,omitempty"`
}

// BeforeCreate hook to set UUID
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

// Organization represents a tenant organization
type Organization struct {
	ID        string    `gorm:"primaryKey;type:uuid" json:"id"`
	Name      string    `gorm:"type:varchar(255);uniqueIndex" json:"name"`
	Slug      string    `gorm:"type:varchar(255);uniqueIndex" json:"slug"`
	Website   string    `gorm:"type:varchar(255)" json:"website"`
	LogoURL   string    `gorm:"type:text" json:"logo_url"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	Users       []User       `json:"users,omitempty"`
	Departments []Department `json:"departments,omitempty"`
	Campaigns   []Campaign   `json:"campaigns,omitempty"`
}

func (o *Organization) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String()
	}
	return nil
}

// Department represents a department within an organization
type Department struct {
	ID             string    `gorm:"primaryKey;type:uuid" json:"id"`
	Name           string    `gorm:"type:varchar(255)" json:"name"`
	OrganizationID string    `gorm:"type:uuid;index" json:"organization_id"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	Users []User `json:"users,omitempty"`
}

func (d *Department) BeforeCreate(tx *gorm.DB) error {
	if d.ID == "" {
		d.ID = uuid.New().String()
	}
	return nil
}

// Campaign represents a phishing campaign
type Campaign struct {
	ID             string           `gorm:"primaryKey;type:uuid" json:"id"`
	Name           string           `gorm:"type:varchar(255)" json:"name"`
	Description    string           `gorm:"type:text" json:"description"`
	OrganizationID string           `gorm:"type:uuid;index" json:"organization_id"`
	CreatedByID    string           `gorm:"type:uuid" json:"created_by_id"`
	Status         string           `gorm:"type:varchar(50);index" json:"status"` // draft, scheduled, active, paused, completed
	EmailTemplateID string          `gorm:"type:uuid" json:"email_template_id"`
	ScheduledAt    *time.Time       `json:"scheduled_at"`
	StartedAt      *time.Time       `json:"started_at"`
	EndedAt        *time.Time       `json:"ended_at"`
	Settings       datatypes.JSONType `gorm:"type:jsonb" json:"settings"`
	CreatedAt      time.Time        `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time        `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	CreatedBy      *User           `json:"created_by,omitempty"`
	EmailTemplate  *EmailTemplate  `json:"email_template,omitempty"`
	Targets        []CampaignTarget `json:"targets,omitempty"`
	TrackingEvents []TrackingEvent `json:"tracking_events,omitempty"`
}

func (c *Campaign) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}

// EmailTemplate represents an email template for campaigns
type EmailTemplate struct {
	ID             string    `gorm:"primaryKey;type:uuid" json:"id"`
	Name           string    `gorm:"type:varchar(255)" json:"name"`
	Subject        string    `gorm:"type:varchar(500)" json:"subject"`
	Content        string    `gorm:"type:text" json:"content"`
	Category       string    `gorm:"type:varchar(100)" json:"category"` // credential-reset, executive-wire, document-share, etc
	OrganizationID string    `gorm:"type:uuid;index" json:"organization_id"`
	CreatedByID    string    `gorm:"type:uuid" json:"created_by_id"`
	IsPublic       bool      `gorm:"default:false" json:"is_public"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	CreatedBy *User `json:"created_by,omitempty"`
}

func (e *EmailTemplate) BeforeCreate(tx *gorm.DB) error {
	if e.ID == "" {
		e.ID = uuid.New().String()
	}
	return nil
}

// CampaignTarget represents a target user for a campaign
type CampaignTarget struct {
	ID         string     `gorm:"primaryKey;type:uuid" json:"id"`
	CampaignID string     `gorm:"type:uuid;index" json:"campaign_id"`
	UserID     string     `gorm:"type:uuid" json:"user_id"`
	Email      string     `gorm:"type:varchar(255)" json:"email"`
	Status     string     `gorm:"type:varchar(50)" json:"status"` // pending, sent, opened, clicked, submitted
	SentAt     *time.Time `json:"sent_at"`
	CreatedAt  time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time  `gorm:"autoUpdateTime" json:"updated_at"`

	// Relations
	Campaign *Campaign `json:"campaign,omitempty"`
	User     *User     `json:"user,omitempty"`
}

func (ct *CampaignTarget) BeforeCreate(tx *gorm.DB) error {
	if ct.ID == "" {
		ct.ID = uuid.New().String()
	}
	return nil
}

// TrackingEvent represents tracked events (opens, clicks, submissions)
type TrackingEvent struct {
	ID               string    `gorm:"primaryKey;type:uuid" json:"id"`
	CampaignID       string    `gorm:"type:uuid;index" json:"campaign_id"`
	CampaignTargetID string    `gorm:"type:uuid;index" json:"campaign_target_id"`
	UserID           string    `gorm:"type:uuid;index" json:"user_id"`
	EventType        string    `gorm:"type:varchar(50);index" json:"event_type"` // open, click, submit
	IPAddress        string    `gorm:"type:varchar(45)" json:"ip_address"`
	UserAgent        string    `gorm:"type:text" json:"user_agent"`
	DeviceInfo       datatypes.JSONType `gorm:"type:jsonb" json:"device_info"`
	Timestamp        time.Time `gorm:"autoCreateTime;index" json:"timestamp"`

	// Relations
	Campaign       *Campaign       `json:"campaign,omitempty"`
	CampaignTarget *CampaignTarget `json:"campaign_target,omitempty"`
	User           *User           `json:"user,omitempty"`
}

func (te *TrackingEvent) BeforeCreate(tx *gorm.DB) error {
	if te.ID == "" {
		te.ID = uuid.New().String()
	}
	return nil
}

// JSONMap is a custom type for JSON data
type JSONMap map[string]interface{}

func (j JSONMap) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSONMap) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion failed")
	}
	return json.Unmarshal(bytes, &j)
}
