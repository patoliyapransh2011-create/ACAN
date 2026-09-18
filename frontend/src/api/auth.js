import axios from "axios";

const API = axios.create({
  baseURL: "https://acan-6oi0.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// LOGIN
export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// SIGNUP
export const signupUser = async (userData) => {
  const response = await API.post("/auth/signup", userData);

  return response.data;
};

export default API;
