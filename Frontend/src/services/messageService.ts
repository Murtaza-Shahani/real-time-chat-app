import api from "./api";

export const getMessages = async (otherUserId: number) => {
  const res = await api.get(`/messages/${otherUserId}`);
  return res.data;
};

export const getConversations = async () => {
  const res = await api.get(`/messages/conversations`);
  return res.data;
};

export const markMessagesAsRead = async (otherUserId: number) => {
  await api.patch(`/messages/read/${otherUserId}`, {});
};