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
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(API, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data)
  });
  return res.json();
}
