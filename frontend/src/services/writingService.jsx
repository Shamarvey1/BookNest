import { ENDPOINT } from "../config/endpoint";

const API = `${ENDPOINT}/api/writing`;

const auth = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("token")
});

export const fetchMyBooks = async () => {
  const res = await fetch(API, { headers: auth() });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load books");
  }
  return result;
};

export const fetchBookById = async (id) => {
  const res = await fetch(`${API}/${id}`, { headers: auth() });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load book");
  }
  return result;
};

export const createBook = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data)
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to create book");
  }
  return result;
};

export const updateBook = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data)
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to update book");
  }
  return result;
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: auth()
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to delete book");
  }
  return result;
};
