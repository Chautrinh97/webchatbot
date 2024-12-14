import axiosInstance from "@/app/apiService/axios";
import { AddDocumentModal } from "@/components/Manage/Document/AddDocumentModal";
import { DocumentTable } from "@/components/Manage/Document/DocumentTable";
import { FilterDocumentComponent } from "@/components/Manage/Document/FilterDocumentComponent";
import { PaginationComponent } from "@/components/Manage/PaginationComponent";
import { Loading } from "@/components/Others/Loading";
import { DocumentProperty } from "@/types/chat";
import { DocumentItem } from "@/types/manage";
import { StatusCodes } from "http-status-codes";
import { Metadata } from "next";
import { cookies } from "next/headers";
import queryString from "query-string";
import { Suspense } from 'react'

export const metadata: Metadata = {
   title: 'Tài liệu',
}

const fetchData = async (
   searchKey: string,
   pageLimit: number,
   pageNumber: number,
   documentField: number | null,
   documentType: number | null,
   issuingBody: number | null,
   isRegulatory: string | null,
) => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;
   const params = queryString.stringify({ searchKey, pageNumber, pageLimit, documentField, documentType, issuingBody, isRegulatory });
   const response = await axiosInstance.get(`/document?${params}`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}

const fetchIssuingBodies = async () => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;

   const response = await axiosInstance.get(`/issuing-body`,
      {
         params: {
            isExport: true,
         },
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}

const fetchDocumentFields = async () => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;

   const response = await axiosInstance.get(`/document-field`,
      {
         params: {
            isExport: true,
         },
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}

const fetchDocumentTypes = async () => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;

   const response = await axiosInstance.get(`/document-type`,
      {
         params: {
            isExport: true,
         },
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
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
      storagePath: document.storagePath,
      documentSize: document.documentSize,
      validityStatus: document.validityStatus,
      isPublic: document.isPublic,
      isRegulatory: document.isRegulatory,
      mimeType: document.mimeType,
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
   const { pageNumber, pageLimit, documentField, documentType, issuingBody, isRegulatory } = params;

   const isNumberOrNull = (value: any) =>
      value === null || (!isNaN(parseInt(value)) && parseInt(value) > 0);
   const isRegulatoryValue = (value: any) =>
      value ? value === 'true' || value === 'false' ? value : undefined : undefined;

   return {
      pageNumber: isNumberOrNull(pageNumber) ? parseInt(pageNumber) : 1,
      pageLimit: isNumberOrNull(pageLimit) ? parseInt(pageLimit) : 10,
      documentField: isNumberOrNull(documentField) ? parseInt(documentField) : null,
      documentType: isNumberOrNull(documentType) ? parseInt(documentType) : null,
      issuingBody: isNumberOrNull(issuingBody) ? parseInt(issuingBody) : null,
      isRegulatory: isRegulatoryValue(isRegulatory),
   };
};

export default async function DocumentPage({ searchParams }: { searchParams: any }) {
   const { searchKey = '' } = searchParams;
   const {
      pageNumber,
      pageLimit,
      documentField,
      documentType,
      issuingBody,
      isRegulatory,
   } = validateSearchParams(searchParams);

   try {
      const responseIssuingBodies = await fetchIssuingBodies();
      const responseDocumentFields = await fetchDocumentFields();
      const responseDocumentTypes = await fetchDocumentTypes();
      const responseDocuments =
         await fetchData(
            searchKey,
            pageLimit,
            pageNumber,
            documentField,
            documentType,
            issuingBody,
            isRegulatory
         );

      if (
         responseDocuments.status !== StatusCodes.OK ||
         responseIssuingBodies.status !== StatusCodes.OK ||
         responseDocumentFields.status !== StatusCodes.OK ||
         responseDocumentTypes.status !== StatusCodes.OK
      ) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
            </div>
         )
      }

      const issuingBodies = mapProperty(responseIssuingBodies.data.data);
      const documentFields = mapProperty(responseDocumentFields.data.data);
      const documentTypes = mapProperty(responseDocumentTypes.data.data);

      const documentsData: DocumentItem[] = mapDocument(responseDocuments.data.data);
      const total = responseDocuments.data.total;

      return (
         <Suspense fallback={<Loading />}>
            <div className="h-full w-full">
               <div className="flex pt-20 px-6 justify-between">
                  <FilterDocumentComponent
                     pageLimit={pageLimit}
                     searchKey={searchKey}
                     documentField={documentField ? documentField : ""}
                     documentType={documentType ? documentType : ""}
                     issuingBody={issuingBody ? issuingBody : ""}
                     issuingBodies={issuingBodies}
                     documentFields={documentFields}
                     documentTypes={documentTypes}
                     isRegulatory={isRegulatory ? isRegulatory : ""} />
                  <AddDocumentModal />
               </div>
               <div className="mt-3 flex flex-col relative px-6">
                  <DocumentTable documents={documentsData} pageLimit={pageLimit} pageNumber={pageNumber} />
                  <PaginationComponent total={total} pageLimit={pageLimit} currentPage={pageNumber} pageURI="/manage/document" />
               </div>
            </div>
         </Suspense>
      );
   } catch {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
         </div>
      )
   }
};