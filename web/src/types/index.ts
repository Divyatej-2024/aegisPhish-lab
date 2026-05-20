// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'trainer' | 'employee';
  organization_id: string;
  department_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  created_by_id: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  email_template_id: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: User;
  email_template?: EmailTemplate;
  targets?: CampaignTarget[];
}

export interface CampaignTarget {
  id: string;
  campaign_id: string;
  user_id: string;
  email: string;
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'submitted';
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total_targets: number;
  opens: number;
  clicks: number;
  submissions: number;
  open_rate: number;
  click_rate: number;
  submission_rate: number;
}

// Email template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  organization_id: string;
  created_by_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by?: User;
}

// Tracking types
export interface TrackingEvent {
  id: string;
  campaign_id: string;
  campaign_target_id: string;
  user_id: string;
  event_type: 'open' | 'click' | 'submit';
  ip_address?: string;
  user_agent?: string;
  device_info?: Record<string, any>;
  timestamp: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_id: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Dashboard types
export interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_targets: number;
  overall_click_rate: number;
  overall_submission_rate: number;
  recent_campaigns: Campaign[];
}
