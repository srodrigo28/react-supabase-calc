import axios from "axios";

const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getPurchases = async () => {
  const { data } = await api.get("", { params: { select: "*" } });
  return data;
};

export const savePurchase = async ({ id, nome, quantidade, valor }) => {
  const payload = { nome, quantidade, valor };
  if (id) {
    await api.patch("", payload, { params: { id: `eq.${id}` } });
  } else {
    await api.post("", payload, { headers: { Prefer: "return=representation" } });
  }
};

export const deletePurchase = async (id) => {
  await api.delete("", { params: { id: `eq.${id}` } });
};