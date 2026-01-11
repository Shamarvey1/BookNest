import { ENDPOINT } from "../config/endpoint";

const API = `${ENDPOINT}/api/writing`;


function auth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}


export async function createBook(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Failed to create book");
  }

  return result;
}


export async function fetchMyBooks() {
  const res = await fetch(API, {
    headers: auth(),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Failed to fetch books");
  }

  return result;
}


export async function fetchBookById(id) {
  const res = await fetch(`${API}/${id}`, {
    headers: auth(),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Failed to fetch book");
  }

  return result;
}


export async function updateBook(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Failed to update book");
  }

  return result;
}

export async function deleteBook(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: auth(),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Failed to delete book");
  }

  return result;
}
