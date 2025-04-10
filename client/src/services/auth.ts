import { useAuthStore } from "@/hooks/useAuthStore";
import api from "@/lib/api";
import { LoginRequest, LoginResponse } from "./dtos/login";

export const authService = {
  login: async (req: LoginRequest) => {
    // We have to turn on withCredentials for accept cookies saving from BE
    const response = await api.post<LoginResponse>("/auth/login", req, {
      withCredentials: true,
    });

    const { data } = response.data; // e.g., { success: true, data: { ... }, token }

    useAuthStore.getState().setAuth(data, data.expires_in);
    return response.data;
  },
  // To use cookie for authorization, we just need add withCredentials: true
};
