import { create } from "zustand";

export const userStore = create((set) => (
    {
        user: {},
        setUser: (newUser) => set({ user: newUser }),
        delete: () => set({ user: {} }),
        update: (dataNew) => set((state) => ({ user: { ...state.user, dataNew } }))
    }
))


export const listMessageStore = create((set) => (
    {
        list: [],
        setList: (newList) => set({ list: newList }),
        delete: () => set({ list: {} }),
    }
))

export const messageStore = create((set) => (
    {
        list: [],
        setList: (newList) => set({ list: newList }),
        delete: () => set({ list: {} }),
        addMessage: (newMessage) => set((state) => ({
            
            
            list: [...state.list, newMessage] // Thêm một tin nhắn mới vào danh sách
        })),
    }
))