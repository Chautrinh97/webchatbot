import axiosInstance from "@/app/apiService/axios";
import { AddDocumentPropertiesModal } from "@/components/Manage/DocumentProperties/AddDocumentPropertiesModal";
import { DocumentPropertiesComponent } from "@/components/Manage/DocumentProperties/DocumentPropertiesComponent";
import { PageLimitComponent } from "@/components/Manage/PageLimitComponent";
import { PaginationComponent } from "@/components/Manage/PaginationComponent";
import { SearchBarComponent } from "@/components/Manage/SearchBarComponent";
import { Loading } from "@/components/Others/Loading";
import { DocumentProperty } from "@/types/chat";
import { UserPermissionConstant } from "@/utils/constant";
import { validateSearchParams } from "@/utils/string";
import { StatusCodes } from "http-status-codes";
import { Metadata } from "next";
import { cookies } from "next/headers";
import queryString from "query-string";
import { Suspense } from "react";

export const metadata: Metadata = {
   title: 'Loại tài liệu',
}

const fetchData = async (searchKey: string, pageLimit: number, pageNumber: number) => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;
   const params = queryString.stringify({ searchKey, pageNumber, pageLimit });
   const response = await axiosInstance.get(`/document-type?${params}`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}

export default async function DocumentTypePage({ searchParams }: { searchParams: any }) {
   const { searchKey = '' } = searchParams;
   const { pageNumber, pageLimit } = validateSearchParams(searchParams);

   try {
      const response = await fetchData(searchKey, pageLimit, pageNumber);

      if (response.status !== StatusCodes.OK) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
            </div>
         )
      }
      const properties: DocumentProperty[] = response.data.data.map((property: any) => ({
         id: property.id,
         name: property.name,
         description: property.description,
      }));
      const total = response.data.total;
      return (
         <Suspense fallback={<Loading />}>
            <div className="w-full h-full">
               <div className="flex pt-20 px-6 justify-between items-center flex-shrink-0">
                  <div className="flex gap-x-5 justify-start items-center">
                     <PageLimitComponent pageLimit={pageLimit} pageURI="/manage/document-type" />
                     <SearchBarComponent initialSearch={searchKey} pageURI="/manage/document-type" />
                  </div>
                  <AddDocumentPropertiesModal
                     propertyApiURI="/document-type"
                     propertyText="loại tài liệu"
                     propertyPermission={UserPermissionConstant.MANAGE_DOCUMENT_TYPES} />
               </div>
               <div className="mt-3 flex flex-col relative px-6">
                  <DocumentPropertiesComponent
                     properties={properties}
                     propertyAPIURI="/document-type"
                     propertyText="loại tài liệu"
                     propertyPermission={UserPermissionConstant.MANAGE_DOCUMENT_TYPES}
                     pageNumber={pageNumber}
                     pageLimit={pageLimit} />
                  <PaginationComponent
                     total={total}
                     currentPage={pageNumber}
                     pageLimit={pageLimit}
                     pageURI="/manage/document-type" />
               </div >
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