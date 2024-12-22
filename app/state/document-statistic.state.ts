export type DocumentStatisticState = {
   isRegulatory: boolean | undefined,
   validityStatus: boolean | undefined,
   syncStatus: boolean | undefined,
}

export const documentStatisticInitState: DocumentStatisticState = {
   isRegulatory: undefined,
   validityStatus: undefined,
   syncStatus: undefined,
};