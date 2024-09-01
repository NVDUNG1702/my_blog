import { create } from "zustand";

export const userStore = create((set) => (
    {
        user: {},
        setUser: (newUser) => set({ user: newUser }),
        delete: () => set({ user: {} }),
        update: (dataNew) => set((state) => ({ user: { ...state.user, dataNew } }))
    }
))