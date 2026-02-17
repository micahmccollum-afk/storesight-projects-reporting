export function getChartColors() {
  if (typeof window === "undefined") {
    return {
      grid: "#D9E2FF",
      tick: "#6E328C",
      label: "#463572",
      tooltipBg: "#ffffff",
      tooltipBorder: "#D9E2FF",
    };
  }

  const styles = getComputedStyle(document.documentElement);
  return {
    grid: styles.getPropertyValue("--chart-grid").trim() || "#D9E2FF",
    tick: styles.getPropertyValue("--chart-tick").trim() || "#6E328C",
    label: styles.getPropertyValue("--chart-label").trim() || "#463572",
    tooltipBg: styles.getPropertyValue("--tooltip-bg").trim() || "#ffffff",
    tooltipBorder:
      styles.getPropertyValue("--tooltip-border").trim() || "#D9E2FF",
  };
}
