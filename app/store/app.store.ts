import { create } from "zustand";
import { AppState, appInitState } from "../state/app.state";
import { Department } from "@/types/chat";

export type AppStore = {
   state: AppState;
   dispatch: (field: string, value: any) => void;
}
export const useAppStore = create<AppStore>((set) => ({
   state: appInitState,
   dispatch: (field, value) => set((prev) => ({
      state: {
         ...prev.state,
         [field]: value
      }
   })),
}));