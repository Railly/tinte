/**
 * The theme workbench and theme gallery moved under /legacy when the new home
 * took over "/". Every internal link and every runtime pathname comparison for
 * those pages goes through here, so the prefix is defined once.
 *
 * This does NOT apply to machine routes, which did not move and must not:
 *   /api/*            CLI installer + shadcn preset endpoints
 *   /r/*              shadcn registry items
 *   /themes/:slug.json  public theme JSON
 */
export const LEGACY_PREFIX = "/legacy";

export const legacyPath = (path = "") => `${LEGACY_PREFIX}${path}`;

export const WORKBENCH_PATH = legacyPath("/workbench");
export const THEMES_PATH = legacyPath("/themes");

export const workbenchPath = (slug: string) => `${WORKBENCH_PATH}/${slug}`;
