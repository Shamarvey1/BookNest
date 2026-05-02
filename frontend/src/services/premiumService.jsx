const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export async function upgradePremium() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/premium/upgrade`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: "premium",
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
    });
    if (!res.ok) return false;
    return await res.json();
  } catch (e) {
    console.error("premiumService.upgradePremium error:", e);
    return false;
  }
}

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
