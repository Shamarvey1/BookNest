import { ENDPOINT } from "../config/endpoint";

const API_URL = `${ENDPOINT}/api/books`;
const GUTENDEX_URL = "https://gutendex.com/books/";

const normalizeBook = (book) => ({
  gutenId: book.gutenId || book.id,
  title: book.title,
  authors: book.authors?.map((author) => author.name) || [],
  coverUrl: book.coverUrl || book.formats?.["image/jpeg"] || null,
});

const normalizeBooksResponse = (payload) => {
  if (payload?.books) {
    return payload;
  }

  return {
    books: (payload?.results || []).map(normalizeBook),
    total: Number(payload?.count) || 0,
    hasNext: Boolean(payload?.next),
  };
};

const fetchBooksWithFallback = async (primaryUrl, fallbackUrl) => {
  const primaryRes = await fetch(primaryUrl);
  const primaryResult = await primaryRes.json().catch(() => null);

  if (primaryRes.ok) {
    const normalizedPrimary = normalizeBooksResponse(primaryResult);
    if (normalizedPrimary.books.length > 0 || normalizedPrimary.total > 0) {
      return normalizedPrimary;
    }
  }

  const fallbackRes = await fetch(fallbackUrl);
  const fallbackResult = await fallbackRes.json().catch(() => null);

  if (!fallbackRes.ok) {
    if (fallbackRes.status === 401) throw new Error("unauthorized");
    throw new Error(
      fallbackResult?.msg || fallbackResult?.message || "Failed to fetch books"
    );
  }

  return normalizeBooksResponse(fallbackResult);
};

const CACHE_PREFIX = "booknest_cache_";

const getClientCache = (key) => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

const setClientCache = (key, data, ttlMs = 30 * 60 * 1000) => {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, expiry: Date.now() + ttlMs })
    );
  } catch {

  }
};

export const getDefaultBooksAPI = async (page = 1) => {
  const cacheKey = `default_page_${page}`;
  const cached = getClientCache(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await fetchBooksWithFallback(
    `${API_URL}/default?page=${page}`,
    `${GUTENDEX_URL}?page=${page}`
  );

  if (result && (result.books?.length > 0 || result.total > 0)) {
    const ttl = page === 1 ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
    setClientCache(cacheKey, result, ttl);
  }

  return result;
};

export const searchBooksAPI = async (query, page = 1) => {
  const cleanQ = query.trim().toLowerCase();
  const cacheKey = `search_${cleanQ}_page_${page}`;
  const cached = getClientCache(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await fetchBooksWithFallback(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}`,
    `${GUTENDEX_URL}?search=${encodeURIComponent(query)}&page=${page}`
  );

  if (result && (result.books?.length > 0 || result.total > 0)) {
    const ttl = page === 1 ? 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
    setClientCache(cacheKey, result, ttl);
  }

  return result;
};

export const preWarmAllGenresAPI = async () => {
  try {
    await Promise.all([
      getDefaultBooksAPI(1),
      searchBooksAPI("mystery", 1),
      searchBooksAPI("adventure", 1),
      searchBooksAPI("romance", 1),
      searchBooksAPI("philosophy", 1),
    ]);
  } catch {
    // Graceful fallback
  }
};

export const saveBookAPI = async (gutenId, meta = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(meta),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to save book");
  }
  return result;
};

export const getBookByIdAPI = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load book");
  }
  return result;
};

