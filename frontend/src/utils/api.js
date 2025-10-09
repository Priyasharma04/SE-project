import axios from "axios";
const API_BASE = "http://127.0.0.1:8000";

export const signup = async (username, email, password) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  const res = await axios.post(`${API_BASE}/signup`, formData);
  return res.data;
};

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const res = await axios.post(`${API_BASE}/login`, formData);
  return res.data;
};

export const uploadPDF = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getHistory = async (token) => {
  const res = await axios.get(`${API_BASE}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
