const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export async function cancelPremium() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/premium/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    return await res.json();
  } catch (e) {
    console.error("premiumService.cancelPremium error:", e);
    return false;
  }
}
