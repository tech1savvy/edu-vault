export function getPortfolioShareUrl(userId, layout = "k") {
  if (userId == null || userId === "") return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const safeLayout = ["k", "t", "s"].includes(layout) ? layout : "k";
  return `${origin}/share/portfolio/${userId}?layout=${safeLayout}`;
}
