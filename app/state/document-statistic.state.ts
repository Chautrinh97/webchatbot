export type DocumentStatisticState = {
   isRegulatory: boolean | undefined,
   validityStatus: boolean | undefined,
   syncStatus: boolean | undefined,
   statsData: StatsData
}

export const documentStatisticInitState: DocumentStatisticState = {
   isRegulatory: undefined,
   validityStatus: undefined,
   syncStatus: undefined,
   statsData: {
      totalDocuments: 0,
      totalDocumentFields: 0,
      totalDocumentTypes: 0,
      totalIssuingBodies: 0,
      totalRegulatory: 0,
      totalValid: 0,
      totalSync: 0,
      documentTypes: [],
      documentFields: [],
      issuingBodies: [],
   }
};

export type StatsData = {
   totalDocuments: number,
   totalDocumentFields: number,
   totalDocumentTypes: number,
   totalIssuingBodies: number,
   totalRegulatory: number,
   totalValid: number,
   totalSync: number,
   documentTypes: DocumentTypes
   documentFields: DocumentFields,
   issuingBodies: IssuingBody,
}

type DocumentTypes = { documentType: string, count: number }[]
type DocumentFields = { documentField: string, count: number }[]
type IssuingBody = { issuingBody: string, count: number }[]