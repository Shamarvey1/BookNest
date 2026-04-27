import { ENDPOINT } from "../config/endpoint";

const API = `${ENDPOINT}/api/profile`;

function auth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}

export async function getProfile() {
  const res = await fetch(API, { headers: auth() });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load profile");
  }
  return result;
}

export async function updateProfile(data) {
  const res = await fetch(API, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data)
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to update profile");
  }
  return result;
}
