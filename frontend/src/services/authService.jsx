const API_URL = "https://booknest-aewf.onrender.com/api/auth";
export const signupAPI = async (data) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Signup failed");
  }

  return result;
};

export const loginAPI = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.msg || "Login failed");
  }

  return result;
};
