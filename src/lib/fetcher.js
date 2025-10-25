// src/lib/fetcher.js

/**
 * Universal API fetch helper for client + server
 * Works on Vercel, Neon, and localhost automatically
 */

export async function apiFetch(path, options = {}) {
  // ensure path starts with /api/
  const url = path.startsWith("/api/")
    ? path
    : `/api/${path.replace(/^\/+/, "")}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error ${res.status}: ${text}`);
    }

    // try JSON, fallback to text
    try {
      return await res.json();
    } catch {
      return await res.text();
    }
  } catch (err) {
    console.error("❌ API fetch failed:", err);
    throw err;
  }
}

/**
 * Convenience helpers for POST / PUT / DELETE
 */

export async function apiPost(path, data) {
  return apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiPut(path, data) {
  return apiFetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" });
}
