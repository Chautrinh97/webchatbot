export type DocumentStatisticState = {
   isRegulatory: boolean | undefined,
   isPublic: boolean | undefined,
   validityStatus: boolean | undefined,
}

export const documentStatisticInitState: DocumentStatisticState = {
   isRegulatory: undefined,
   isPublic: undefined,
   validityStatus: undefined,
};