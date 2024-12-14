import { create } from "zustand";
import { documentStatisticInitState, DocumentStatisticState } from "../state/document-statistic.state";

export type DocumentStatisticStore = {
   state: DocumentStatisticState;
   dispatch: (field: string, value: any) => void;
}
export const useStatisticStore = create<DocumentStatisticStore>((set) => ({
   state: documentStatisticInitState,
   dispatch: (field: any, value: any) => set((prev) => ({
      state: {
         ...prev.state,
         [field]: value
      }
   })),
}));