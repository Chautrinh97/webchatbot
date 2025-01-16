'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { DocumentProperty } from "@/types/chat";
import { PageLimitComponent } from "../PageLimitComponent";
import { SearchBarComponent } from "../SearchBarComponent";

export const FilterDocumentComponent = (
   {
      pageLimit,
      searchKey,
      issuingBody,
      documentField,
      documentType,
      issuingBodies,
      documentFields,
      documentTypes,
      isRegulatory,
      isValid,
      isSync,
      year,
      issuanceYears,
   }:
      {
         pageLimit: number,
         searchKey: string,
         issuingBody: any,
         documentField: any,
         documentType: any,
         issuingBodies: DocumentProperty[],
         documentFields: DocumentProperty[],
         documentTypes: DocumentProperty[],
         isRegulatory: string,
         isValid: string,
         isSync: string,
         year: number,
         issuanceYears: number[],
      }
) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const handleDocumentFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('documentField');
      else params.set("documentField", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('documentType');
      else params.set("documentType", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleIssuingBodyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('issuingBody');
      else params.set("issuingBody", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleChangeIsRegulatory = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('isRegulatory');
      else params.set("isRegulatory", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleChangeValidityStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('isValid');
      else params.set("isValid", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleChangeSyncStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('isSync');
      else params.set("isSync", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   const handleChangeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      const selectedYear = parseInt(e.target.value, 10);
      if (selectedYear === 0) params.delete('year');
      else params.set("year", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };
   return (
      <div className="grid grid-cols-10 gap-y-4 ">
         <div className="col-span-2 flex items-center">
            <PageLimitComponent pageLimit={pageLimit} pageURI="/manage/document" />
         </div>
         <div className="col-span-3">
            <SearchBarComponent pageURI="/manage/document" initialSearch={searchKey} />
         </div>
         <div className="col-span-2 col-start-7 flex items-center justify-end pe-3">
            Năm ban hành
         </div>
         <div className="col-span-1 flex items-center">
            <select
               onChange={(e) => handleChangeYear(e)}
               value={year}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
               <option value={0}>
                  Tất cả
               </option>
               {issuanceYears.map((y) => (
                  <option key={y} value={y}>
                     {y}
                  </option>
               ))}
            </select>
         </div>
         <div className="col-start-1 col-span-2 text-end pe-3">Lĩnh vực</div>
         <div className="col-span-3">
            <select
               onChange={(e) => handleDocumentFieldChange(e)}
               value={documentField}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">
                  Tất cả
               </option>
               {documentFields.map((documentField) => (
                  <option key={documentField.id} value={documentField.id}>
                     {documentField.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="col-span-2 text-end pe-3">Tính pháp quy</div>
         <div className="col-span-2">
            <select
               onChange={(e) => handleChangeIsRegulatory(e)}
               value={isRegulatory}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">Tất cả </option>
               <option value="true">Văn bản pháp quy </option>
               <option value="false">Tài liệu thông thường </option>
            </select>
         </div>

         <div className="col-span-2 text-end pe-3">Cơ quan ban hành</div>
         <div className="col-span-3">
            <select
               onChange={(e) => handleIssuingBodyChange(e)}
               value={issuingBody}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">
                  Tất cả
               </option>
               {issuingBodies.map((issuingBody) => (
                  <option key={issuingBody.id} value={issuingBody.id}>
                     {issuingBody.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="col-span-2 text-end pe-3">Trạng thái hiệu lực</div>
         <div className="col-span-2">
            <select
               onChange={(e) => handleChangeValidityStatus(e)}
               value={isValid}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">Tất cả </option>
               <option value="true">Còn hiệu lực </option>
               <option value="false">Hết hiệu lực </option>
            </select>
         </div>
         <div className="col-span-2 text-end pe-3">Loại văn bản</div>
         <div className="col-span-3">
            <select
               onChange={(e) => handleDocumentTypeChange(e)}
               value={documentType}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">
                  Tất cả
               </option>
               {documentTypes.map((documentType) => (
                  <option key={documentType.id} value={documentType.id}>
                     {documentType.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="col-span-2 text-end pe-3">Trạng thái đồng bộ</div>
         <div className="col-span-2">
            <select
               onChange={(e) => handleChangeSyncStatus(e)}
               value={isSync}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">Tất cả </option>
               <option value="true">Đã đồng bộ </option>
               <option value="false">Chưa đồng bộ </option>
            </select>
         </div>
      </div>
   );
}