import api from "./axios";

export const subscribeNewsletter = async ({ email, source = "footer" }) => {
  const response = await api.post("/api/public/subscriptions/newsletter", {
    email,
    source,
  });
  return response.data;
};
