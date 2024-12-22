'use client'
import { PieChart } from "./PieChart";
import { ChangeEvent } from "react";
import { useStatisticStore } from "@/app/store/document-statistic.store";

export const PieChartGroup = (
   { totalDocuments: total, documentTypes, documentFields, issuingBodies, handleRefetch }:
      { totalDocuments: number, documentTypes: any, documentFields: any, issuingBodies: any, handleRefetch: () => void }) => {

   const documentTypeLabels = documentTypes.map((item: any) => item.documentType);
   const documentTypeData = documentTypes.map((item: any) => item.count);
   const documentFieldLabels = documentFields.map((item: any) => item.documentField);
   const documentFieldData = documentFields.map((item: any) => item.count);
   const issuingBodyLabels = issuingBodies.map((item: any) => item.issuingBody);
   const issuingBodyData = issuingBodies.map((item: any) => item.count);

   const { state: { isRegulatory, validityStatus }, dispatch } = useStatisticStore();

   const handleChangeIsRegulatory = (e: ChangeEvent<HTMLSelectElement>) => {
      dispatch("regulatory", e.target.value);
      handleRefetch();
   }

   return (
      <div className="w-full mt-3 grid grid-cols-3 gap-3">
         {/* <div className="col-span-3 flex items-center gap-x-24 p-2 mb-2 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <div className="flex gap-3 items-center">
               <span>Tính pháp quy</span>
               <select
                  onChange={(e) => handleChangeIsRegulatory(e)}
                  value={isRegulatory === undefined? "": isRegulatory? "true": "false"}
                  className="w-48 p-1 border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Tất cả </option>
                  <option value="true">Văn bản pháp quy </option>
                  <option value="false">Văn bản thông thường </option>
               </select>
            </div>
            <div className="flex gap-3">
               <span>Trạng thái công khai</span>
               <Checkbox />
            </div>
            <div>
               Trạng thái hiệu lực
            </div>
         </div> */}
         <div className="py-1 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <PieChart total={total} title={"Tỉ lệ văn bản theo lĩnh vực"} labels={documentFieldLabels} data={documentFieldData} />
         </div>
         <div className="py-3 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <PieChart total={total} title={"Tỉ lệ văn bản theo loại"} labels={documentTypeLabels} data={documentTypeData} />
         </div>
         <div className="py-3 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <PieChart total={total} title={"Tỉ lệ văn bản theo cơ quan ban hành"} labels={issuingBodyLabels} data={issuingBodyData} />
         </div>
      </div>
   );
}