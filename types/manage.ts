import { number } from "zod"

export type DepartmentNode = {
   _id: string,
   name: string,
   description: string,
   parentDepartmentId: string,
   children: DepartmentNode[],
   expand: boolean,
}

export type UserItem = {
   id: number,
   fullName: string,
   email: string,
   authorityGroup: string,
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
   storagePath: string,
   documentSize: number,
   validityStatus: boolean,
   isPublic: boolean,
   isRegulatory: boolean,
   mimeType: string,
}

export type StatsData = {
   totalDocuments: number,
   totalDocumentFields: number,
   totalDocumentTypes: number,
   totalIssuingBodies: number,
   totalPublic: number,
   totalValid: number,
   totalRegulatory: number,
   documentTypes: DocumentTypeStats[],
   documentFields: DocumentFieldStats[],
   issuingBodies: IssuingBodyStats[],
}

export const StatsDataInit: StatsData = {
   totalDocuments: 0,
   totalDocumentFields: 0,
   totalDocumentTypes: 0,
   totalIssuingBodies: 0,
   totalPublic: 0,
   totalValid: 0,
   totalRegulatory: 0,
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