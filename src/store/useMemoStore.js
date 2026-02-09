import { create } from "zustand";

export const useMemoStore = create((set) => ({
  memos: [],
  setMemos: (memos) => set({ memos }),
}));
