import api from "./api";
import { API_ROUTES } from "../constants/apiRoutes";

export async function loginUser(payload) {
  const res = await api.post(API_ROUTES.LOGIN, payload);
  return res.data; // ✅ FIX
}

export async function registerUser(payload) {
  const res = await api.post(API_ROUTES.REGISTER, payload);
  return res.data; // ✅ FIX
}
