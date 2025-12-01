const API_URL = "http://localhost:5001/api/books";

export const searchBooksAPI = async (query) => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  return res.json();
};

export const saveBookAPI = async (gutenId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
};

export const getBookByIdAPI = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
};
