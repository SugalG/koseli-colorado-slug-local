// src/lib/slugify.js

export default function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove all non-word chars (except hyphens)
    .replace(/[^\w-]+/g, "")
    // Replace multiple hyphens with a single one
    .replace(/--+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}
