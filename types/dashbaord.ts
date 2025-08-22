// types/dashboard.ts
export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface DashboardState {
  currentView: string; // e.g., 'home', 'users/profile'
  breadcrumbItems: BreadcrumbItem[];
}