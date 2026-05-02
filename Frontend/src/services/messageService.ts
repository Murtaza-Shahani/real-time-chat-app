import axios from "axios";

export const getMessages = async ( otherUserId: number) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await axios.get(
    `${API_URL}/messages/${otherUserId}`, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }
  );
  return res.data;
};
export const getConversations = async () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await axios.get(`${API_URL}/messages/conversations`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};