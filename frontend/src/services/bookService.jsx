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


export const getDefaultBooksAPI = async (page = 1) => {
  return fetchBooksWithFallback(
    `${API_URL}/default?page=${page}`,
    `${GUTENDEX_URL}?page=${page}`
  );
};


export const searchBooksAPI = async (query, page = 1) => {
  return fetchBooksWithFallback(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}`,
    `${GUTENDEX_URL}?search=${encodeURIComponent(query)}&page=${page}`
  );
};


export const saveBookAPI = async (gutenId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
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
