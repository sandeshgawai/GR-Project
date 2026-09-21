export type NavKey =
  | "dashboard"
  | "repository"
  | "search"
  | "add"
  | "import"
  | "departments"
  | "reports"
  | "settings";

export interface Route {
  key: NavKey;
  detailId?: string; // when viewing a GR detail
}
