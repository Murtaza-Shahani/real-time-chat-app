import api from "./api";

const AUTH = "/auth";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post(`${AUTH}/signup`, data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post(`${AUTH}/login`, data);
  return res.data;
};