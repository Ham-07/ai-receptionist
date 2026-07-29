export const RESERVED_SLUGS = [
  "api",
  "admin",
  "dashboard",
  "auth",
  "_next",
  "static",
  "widget",
  "login",
  "signup",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];

export function isReservedSlug(slug: string): boolean {
  if (!slug) return true;
  return RESERVED_SLUGS.includes(slug.toLowerCase() as ReservedSlug);
}

export function formatSlugToTitle(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
