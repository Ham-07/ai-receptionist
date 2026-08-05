/** Matches Postgres uuid text form (same check as /api/chat/[businessId]). */
export const UUID_FORMAT =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_FORMAT.test(value);
}

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
