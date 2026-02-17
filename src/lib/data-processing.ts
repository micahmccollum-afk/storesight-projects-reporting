import type {
  ProjectRow,
  KPIData,
  ProductBreakdown,
  MonthlyRevenue,
  DashboardData,
} from "./types";

function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/[$,%]/g, "").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findColumn(
  row: Record<string, string>,
  ...candidates: string[]
): string {
  const normalizedKeys = Object.keys(row).map((k) => ({
    original: k,
    normalized: normalizeHeader(k),
  }));

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeHeader(candidate);
    const match = normalizedKeys.find(
      (k) => k.normalized === normalizedCandidate
    );
    if (match) return row[match.original];
  }
  return "";
}

export function mapRowToProject(row: Record<string, string>): ProjectRow {
  return {
    projectId: findColumn(row, "Project ID", "ProjectID", "project_id"),
    projectName: findColumn(row, "Project Name", "ProjectName", "project_name"),
    projectStartDate: findColumn(
      row,
      "Project Start Date",
      "ProjectStartDate",
      "project_start_date"
    ),
    projectEndDate: findColumn(
      row,
      "Project End Date",
      "ProjectEndDate",
      "project_end_date"
    ),
    productName: findColumn(
      row,
      "Product Name",
      "ProductName",
      "product_name"
    ),
    productType: findColumn(
      row,
      "Product Type",
      "ProductType",
      "product_type"
    ),
    companyName: findColumn(
      row,
      "Company Name",
      "CompanyName",
      "company_name"
    ),
    earnedRevenueWithFees: parseNumber(
      findColumn(
        row,
        "Earned Revenue w/ Fees",
        "Earned Revenue w Fees",
        "EarnedRevenuewFees",
        "earned_revenue_w_fees"
      )
    ),
  };
}

export function computeKPIs(
  projects: ProjectRow[],
  grandTotalRevenue?: number
): KPIData {
  const totalProjects = projects.length;
  const totalRevenue =
    grandTotalRevenue ?? projects.reduce((sum, p) => sum + p.earnedRevenueWithFees, 0);
  const avgRevenuePerProject =
    totalProjects > 0 ? Math.round(totalRevenue / totalProjects) : 0;

  return { totalRevenue, totalProjects, avgRevenuePerProject };
}

export function computeRevenueByProduct(
  projects: ProjectRow[]
): ProductBreakdown[] {
  const map = new Map<
    string,
    { productType: string; revenue: number; count: number }
  >();

  projects.forEach((p) => {
    if (!p.productName) return;
    const existing = map.get(p.productName);
    if (existing) {
      existing.revenue += p.earnedRevenueWithFees;
      existing.count += 1;
    } else {
      map.set(p.productName, {
        productType: p.productType,
        revenue: p.earnedRevenueWithFees,
        count: 1,
      });
    }
  });

  return Array.from(map.entries())
    .map(([name, data]) => ({
      productName: name,
      productType: data.productType,
      revenue: data.revenue,
      projectCount: data.count,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function computeRevenueByMonth(
  projects: ProjectRow[]
): MonthlyRevenue[] {
  const map = new Map<string, { revenue: number; projects: number }>();

  projects.forEach((p) => {
    if (!p.projectStartDate) return;
    const date = new Date(p.projectStartDate);
    if (isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const existing = map.get(key);
    if (existing) {
      existing.revenue += p.earnedRevenueWithFees;
      existing.projects += 1;
    } else {
      map.set(key, {
        revenue: p.earnedRevenueWithFees,
        projects: 1,
      });
    }
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => {
      const [year, month] = key.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return { month: label, revenue: data.revenue, projects: data.projects };
    });
}

export function extractGrandTotalRevenue(
  rawRows: Record<string, string>[]
): number | undefined {
  const totalRow = rawRows.find((row) => {
    const firstVal = Object.values(row)[0]?.trim();
    return firstVal === "Grand Total";
  });

  if (!totalRow) return undefined;

  const keys = Object.keys(totalRow);
  const values = Object.values(totalRow);

  for (let i = 0; i < keys.length; i++) {
    const key = normalizeHeader(keys[i]);
    if (key.includes("earnedrevenue")) {
      return parseNumber(values[i]);
    }
  }

  return undefined;
}

export function processDashboardData(
  rawRows: Record<string, string>[]
): DashboardData {
  const grandTotalRevenue = extractGrandTotalRevenue(rawRows);

  const projects = rawRows
    .map(mapRowToProject)
    .filter((p) => p.projectId && p.projectId !== "Grand Total");

  const kpis = computeKPIs(projects, grandTotalRevenue);
  const revenueByProduct = computeRevenueByProduct(projects);
  const revenueByMonth = computeRevenueByMonth(projects);

  return { kpis, revenueByProduct, revenueByMonth, projects };
}
