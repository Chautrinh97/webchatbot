'use client'
import { PieChart } from "./PieChart";
import { useStatisticStore } from "@/app/store/document-statistic.store";

export const PieChartGroup = () => {
   const { state: { statsData } } = useStatisticStore();

   const documentTypeLabels = statsData.documentTypes.map((item: any) => item.documentType);
   const documentTypeData = statsData.documentTypes.map((item: any) => item.count);
   const documentFieldLabels = statsData.documentFields.map((item: any) => item.documentField);
   const documentFieldData = statsData.documentFields.map((item: any) => item.count);
   const issuingBodyLabels = statsData.issuingBodies.map((item: any) => item.issuingBody);
   const issuingBodyData = statsData.issuingBodies.map((item: any) => item.count);

   const { state: { isRegulatory, validityStatus, syncStatus }, dispatch } = useStatisticStore();

   const handleChangeSelect = (field: string, value: string) => {
      if (value === '') dispatch(field, undefined);
      else dispatch(field, value === 'true');
   };

   return (
      <div className="w-full min-h-[450px] mt-3 p-2 grid grid-cols-3 gap-1 dark:bg-sb-black bg-white shadow-md rounded-md">
         <div className="col-span-3 flex items-center gap-16 p-2 mb-2 rounded-lg">
            <div className="flex gap-3 items-center">
               <span>Tính pháp quy</span>
               <select
                  onChange={(e) => handleChangeSelect('isRegulatory', e.target.value)}
                  value={isRegulatory === undefined? "": isRegulatory? "true": "false"}
                  className="w-44 p-1 border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Tất cả </option>
                  <option value="true">Văn bản pháp quy</option>
                  <option value="false">Văn bản thông thường</option>
               </select>
            </div>
            <div className="flex gap-3 items-center">
               <span>Trạng thái hiệu lực</span>
               <select
                  onChange={(e) => handleChangeSelect('validityStatus', e.target.value)}
                  value={validityStatus === undefined? "": validityStatus? "true": "false"}
                  className="w-32 p-1 border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Tất cả </option>
                  <option value="true">Còn hiệu lực</option>
                  <option value="false">Hết hiệu lực</option>
               </select>
            </div>
            <div className="flex gap-3 items-center">
               <span>Trạng thái đồng bộ</span>
               <select
                  onChange={(e) => handleChangeSelect('syncStatus', e.target.value)}
                  value={syncStatus === undefined? "": syncStatus? "true": "false"}
                  className="w-32 p-1 border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Tất cả </option>
                  <option value="true">Đã đồng bộ</option>
                  <option value="false">Chưa đồng bộ</option>
               </select>
            </div>
         </div>
         <div className="py-1 mx-1 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <PieChart total={statsData.totalDocuments} title={"Tỉ lệ văn bản theo lĩnh vực"} labels={documentFieldLabels} data={documentFieldData} />
         </div>
         <div className="py-3 mx-1 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <PieChart total={statsData.totalDocuments} title={"Tỉ lệ văn bản theo loại"} labels={documentTypeLabels} data={documentTypeData} />
         </div>
         <div className="py-3 mx-1 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <PieChart total={statsData.totalDocuments} title={"Tỉ lệ văn bản theo cơ quan ban hành"} labels={issuingBodyLabels} data={issuingBodyData} />
         </div>
      </div>
   );
}