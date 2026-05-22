import { create } from "zustand";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isLoading: false,
  error: "",

  login: async (email, password) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      set({ token, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await axios.post(`${API}/register`, { name, email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      set({ token, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  clearError: () => set({ error: "" }),
}));
