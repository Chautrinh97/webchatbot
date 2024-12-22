import {apiService} from "@/app/apiService/apiService";
import { getAccessToken } from "@/app/apiService/cookies";
import { AddDocumentModal } from "@/components/Manage/Document/AddDocumentModal";
import { DocumentTable } from "@/components/Manage/Document/DocumentTable";
import { FilterDocumentComponent } from "@/components/Manage/Document/FilterDocumentComponent";
import { PaginationComponent } from "@/components/Manage/PaginationComponent";
import { Loading } from "@/components/Others/Loading";
import { DocumentProperty } from "@/types/chat";
import { DocumentItem } from "@/types/manage";
import { StatusCodes } from "http-status-codes";
import { Metadata } from "next";
import { Suspense } from 'react'

export const metadata: Metadata = {
   title: 'Văn bản',
}

const fetchData = async (
   searchKey: string,
   pageLimit: number,
   pageNumber: number,
   documentField: number | null,
   documentType: number | null,
   issuingBody: number | null,
   isRegulatory: string | null,
   isValid: string | null,
   isSync: string | null,
   token: any,
) => {
   const response = await apiService.get(`/document`, {
      searchKey,
      pageLimit,
      pageNumber,
      documentField,
      documentType,
      issuingBody,
      isRegulatory,
      isValid,
      isSync,
   },{
      Authorization: `Bearer ${token}`,
   });
   return response;
}

const fetchIssuingBodies = async (token: any) => {
   const response = await apiService.get(`/issuing-body`, {
      isExport: true,
   }, {
      Authorization: `Bearer ${token}`,
   });
   return response;
}

const fetchDocumentFields = async (token: any) => {
   const response = await apiService.get(`/document-field`, {
      isExport: true,
   }, {
      Authorization: `Bearer ${token}`,
   });
   return response;
}

const fetchDocumentTypes = async (token: any) => {
   const response = await apiService.get(`/document-type`, {
      isExport: true,
   }, {
      Authorization: `Bearer ${token}`,
   });
   return response;
}
const mapDocument = (data: any) => {
   const documents: DocumentItem[] = data.map((document: any) => ({
      id: document.id,
      title: document.title,
      description: document.description,
      referenceNumber: document.referenceNumber,
      documentType: document.documentType?.name,
      issuingBody: document.issuingBody?.name,
      documentField: document.documentField?.name,
      issuanceDate: document.issuanceDate && new Date(document.issuanceDate),
      effectiveDate: document.effectiveDate && new Date(document.effectiveDate),
      fileUrl: document.fileUrl,
      documentSize: document.documentSize,
      validityStatus: document.validityStatus,
      invalidDate: document.invalidDate && document.invalidDate && new Date(document.invalidDate),
      isRegulatory: document.isRegulatory,
      mimeType: document.mimeType,
      syncStatus: document.syncStatus
   }));
   return documents;
}

const mapProperty = (data: any) => {
   const properties: DocumentProperty[] = data.map((property: any) => ({
      id: property.id,
      name: property.name,
      description: property.description,
   }));
   return properties;
}

const validateSearchParams = (params: any) => {
   const { 
      pageNumber, 
      pageLimit, 
      documentField, 
      documentType, 
      issuingBody, 
      isRegulatory,
      isValid,
      isSync,  
   } = params;

   const isNumberOrNull = (value: any) =>
      value === null || (!isNaN(parseInt(value)) && parseInt(value) > 0);
   const isBooleanStringValue = (value: any) =>
      value ? value === 'true' || value === 'false' ? value : undefined : undefined;

   return {
      pageNumber: isNumberOrNull(pageNumber) ? parseInt(pageNumber) : 1,
      pageLimit: isNumberOrNull(pageLimit) ? parseInt(pageLimit) : 10,
      documentField: isNumberOrNull(documentField) ? parseInt(documentField) : null,
      documentType: isNumberOrNull(documentType) ? parseInt(documentType) : null,
      issuingBody: isNumberOrNull(issuingBody) ? parseInt(issuingBody) : null,
      isRegulatory: isBooleanStringValue(isRegulatory),
      isValid: isBooleanStringValue(isValid),
      isSync: isBooleanStringValue(isSync),
   };
};

export default async function DocumentPage(props: { searchParams: Promise<any> }) {
   const token = await getAccessToken();
   const searchParams = await props.searchParams;
   const { searchKey = '' } = searchParams;
   const {
      pageNumber,
      pageLimit,
      documentField,
      documentType,
      issuingBody,
      isRegulatory,
      isValid,
      isSync,
   } = validateSearchParams(searchParams);

   try {
      const responseIssuingBodies = await fetchIssuingBodies(token);
      const responseDocumentFields = await fetchDocumentFields(token);
      const responseDocumentTypes = await fetchDocumentTypes(token);
      const responseDocuments =
         await fetchData(
            searchKey,
            pageLimit,
            pageNumber,
            documentField,
            documentType,
            issuingBody,
            isRegulatory,
            isValid,
            isSync,
            token,
         );

      if (
         responseDocuments.status !== StatusCodes.OK ||
         responseIssuingBodies.status !== StatusCodes.OK ||
         responseDocumentFields.status !== StatusCodes.OK ||
         responseDocumentTypes.status !== StatusCodes.OK
      ) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau</span>
            </div>
         )
      }

      const documentsData = await responseDocuments.json();
      const issuingBodiesData = await responseIssuingBodies.json();
      const documentFieldsData = await responseDocumentFields.json();
      const documentTypesData = await responseDocumentTypes.json();

      const issuingBodies = mapProperty(issuingBodiesData.data);
      const documentFields = mapProperty(documentFieldsData.data);
      const documentTypes = mapProperty(documentTypesData.data);

      const documents: DocumentItem[] = mapDocument(documentsData.data);
      const total = documentsData.total;

      return (
         <Suspense fallback={<Loading />}>
            <div className="h-full w-full">
               <div className="flex pt-20 px-6 justify-between relative">
                  <FilterDocumentComponent
                     pageLimit={pageLimit}
                     searchKey={searchKey}
                     documentField={documentField ? documentField : ""}
                     documentType={documentType ? documentType : ""}
                     issuingBody={issuingBody ? issuingBody : ""}
                     issuingBodies={issuingBodies}
                     documentFields={documentFields}
                     documentTypes={documentTypes}
                     isRegulatory={isRegulatory ? isRegulatory : ""} 
                     isValid={isValid ? isValid : ""}
                     isSync={isSync ? isSync : ""}/>
                  <AddDocumentModal />
               </div>
               <div className="mt-3 flex flex-col relative px-6">
                  <DocumentTable documents={documents} />
                  <PaginationComponent total={total} pageLimit={pageLimit} currentPage={pageNumber} pageURI="/manage/document" />
               </div>
            </div>
         </Suspense>
      );
   } catch {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau</span>
         </div>
      )
   }
};