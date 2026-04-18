import axios from "axios";

const API = "http://localhost:3000/auth";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/signup`, data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};