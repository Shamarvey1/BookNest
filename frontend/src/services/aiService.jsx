import { ENDPOINT } from "../config/endpoint";

export const sendAIQuestion = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${ENDPOINT}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "AI request failed");
  }

  return data.response;
};
