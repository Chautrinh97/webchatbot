export type UserItem = {
   id: number,
   fullName: string,
   email: string,
   role: string,
   authorityGroup: string,
   permissionDescription: string,
   isVerified: boolean,
   isDisabled: boolean,
}

export type AuthorityGroup = {
   id: number,
   name: string,
}

export type AuthorityGroupDetail = {
   id: number,
   name: string,
   description: string,
   permissions: Permission[]
}
export type Permission = {
   id: number,
   name: string,
   description: string,
}

export type CreatedUser = {
   id: number,
   fullName: string,
}
export type DocumentItem = {
   id: number,
   title: string,
   description: string | null,
   referenceNumber: string | null,
   documentField: string | null,
   documentType: string | null,
   issuingBody: string | null,
   issuanceDate: Date | null,
   effectiveDate: Date | null,
   fileUrl: string,
   documentSize: number,
   validityStatus: boolean,
   invalidDate: Date | null,
   isRegulatory: boolean,
   mimeType: string,
   syncStatus: "NOT_SYNC" | "SYNC" | "PENDING_SYNC" | "FAILED_SYNC",
   user: CreatedUser | null,
   createdAt: Date,
}

export type StatsData = {
   totalDocuments: number,
   totalDocumentFields: number,
   totalDocumentTypes: number,
   totalIssuingBodies: number,
   totalValid: number,
   totalRegulatory: number,
   totalSync: number,
   documentTypes: DocumentTypeStats[],
   documentFields: DocumentFieldStats[],
   issuingBodies: IssuingBodyStats[],
}

export const StatsDataInit: StatsData = {
   totalDocuments: 0,
   totalDocumentFields: 0,
   totalDocumentTypes: 0,
   totalIssuingBodies: 0,
   totalValid: 0,
   totalRegulatory: 0,
   totalSync: 0,
   documentTypes: [],
   documentFields: [],
   issuingBodies: [],
}

type DocumentTypeStats = {
   documentType: string,
   count: number,
}
type DocumentFieldStats = {
   documentType: string,
   count: number,
}
type IssuingBodyStats = {
   documentType: string,
   count: number,
}