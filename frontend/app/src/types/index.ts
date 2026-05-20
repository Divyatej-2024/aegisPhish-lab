export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'organization_admin' | 'trainer' | 'employee';
  organization_id: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_id: string;
};

export type DashboardOverview = {
  campaign_count: number;
  active_campaigns: number;
  user_count: number;
  open_events: number;
  click_events: number;
  submission_events: number;
};
