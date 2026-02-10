import { create } from "zustand";

const API_BASE = "https://be-dosa.store";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setAuth: (user) => set({ user, isLoggedIn: !!user }),

  /** 로그인 리다이렉트 끝난 뒤 호출. POST /auth/token으로 세션 확인 후 상태 반영 */
  fetchAfterLogin: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/token`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const name =
          data?.name ??
          data?.username ??
          data?.email ??
          data?.nickname ??
          "사용자";
        set({ user: name, isLoggedIn: true });
        return true;
      }
    } catch (e) {
      console.warn("fetchAfterLogin failed", e);
    }
    set({ user: null, isLoggedIn: false });
    return false;
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}
    set({ user: null, isLoggedIn: false });
  },
}));
