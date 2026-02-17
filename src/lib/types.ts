export interface ProjectRow {
  projectId: string;
  projectName: string;
  projectStartDate: string;
  projectEndDate: string;
  productName: string;
  productType: string;
  companyName: string;
  earnedRevenueWithFees: number;
}

export interface ProductBreakdown {
  productName: string;
  productType: string;
  revenue: number;
  projectCount: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  projects: number;
}

export interface KPIData {
  totalRevenue: number;
  totalProjects: number;
  avgRevenuePerProject: number;
}

export interface DashboardData {
  kpis: KPIData;
  revenueByProduct: ProductBreakdown[];
  revenueByMonth: MonthlyRevenue[];
  projects: ProjectRow[];
}
