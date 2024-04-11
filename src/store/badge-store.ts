import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type BadgeData = {
    id: string 
    name: string 
    email: string
    eventTitle: string 
    checkInURL: string 
    image?: string 
}

type State = {
    data: BadgeData | null 
    save: (data: BadgeData) => void
    remove: () => void
    saveImage: (uri: string) => void
}

export const useBadgeStore = create(
    persist<State>((set) => ({
        data: null,

        save: (data: BadgeData) => set(() => ({ data })),
        remove: () => set(() => ({ data:null })),
        saveImage: (uri:string) => set((state) => ({
            data: state.data ? {...state.data, image:uri} : state.data,
        })),
    }),
    {
        name: "nwl-unite:badge",
        storage: createJSONStorage(() => AsyncStorage)
    })
)