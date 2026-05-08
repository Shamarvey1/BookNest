import { ENDPOINT } from "../config/endpoint";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const PAYMENT_API = `${API_URL}/payments`;

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(plan = "monthly") {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${PAYMENT_API}/create-order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Failed to create order");
    return result;
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    return null;
  }
}

export async function verifyRazorpayPayment(payload) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${PAYMENT_API}/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Failed to verify payment");
    return result;
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    return null;
  }
}