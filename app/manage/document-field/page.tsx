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
   title: 'Lĩnh vực',
}

const fetchData = async (searchKey: string, pageLimit: number, pageNumber: number) => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;
   const params = queryString.stringify({ searchKey, pageNumber, pageLimit });
   const response = await axiosInstance.get(`/document-field?${params}`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}

export default async function DocumentFieldPage({ searchParams }: { searchParams: any }) {
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
            <div className="h-full w-full">
               <div className="flex pt-20 px-6 justify-between items-center">
                  <div className="flex gap-x-5 justify-start items-center">
                     <PageLimitComponent pageLimit={pageLimit} pageURI="/manage/document-field" />
                     <SearchBarComponent initialSearch={searchKey} pageURI="/manage/document-field" />
                  </div>
                  <AddDocumentPropertiesModal
                     propertyApiURI="/document-field"
                     propertyText="lĩnh vực"
                     propertyPermission={UserPermissionConstant.MANAGE_DOCUMENT_FIELDS} />
               </div>
               <div className="mt-3 flex flex-col relative px-6">
                  <DocumentPropertiesComponent
                     properties={properties}
                     propertyAPIURI="/document-field"
                     propertyText="lĩnh vực"
                     propertyPermission={UserPermissionConstant.MANAGE_DOCUMENT_FIELDS}
                     pageNumber={pageNumber}
                     pageLimit={pageLimit} />
                  <PaginationComponent
                     total={total}
                     currentPage={pageNumber}
                     pageLimit={pageLimit}
                     pageURI="/manage/document-field" />
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