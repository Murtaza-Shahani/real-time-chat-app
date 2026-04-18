import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};