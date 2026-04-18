import axios from "axios";

export const getMessages = async (userId: number, otherUserId: number) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await axios.get(
    `${API_URL}/messages/${otherUserId}?userId=${userId}`
  );
  return res.data;
};