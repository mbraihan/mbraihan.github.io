/**
 * Public section release switches.
 *
 * Set a section to false to remove it from navigation, redirect its index
 * page to the homepage, and stop generating its detail routes.
 */
export const siteSections = {
  posts: false,
  gallery: false,
} as const;
