import { useStatisticStore } from "@/app/store/document-statistic.store";
import { BarChart } from "./BarChart";

export const BarChartGroup = () => {
   const { state: { statsData } } = useStatisticStore();

   const validvalidLabels = ["Còn hiệu lực", "Hết hiệu lực"];
   const validData = [statsData.totalValid, statsData.totalDocuments - statsData.totalValid];
   const validBgColors = [
      'rgb(0, 0, 255, 0.8)',
      'rgb(0, 0, 255, 0.5)'
   ];

   const regulatoryLabels = ["Văn bản pháp quy", "Văn bản thường"];
   const regulatoryData = [statsData.totalRegulatory, statsData.totalDocuments - statsData.totalRegulatory];
   const regulatoryBgColors = [
      'rgb(0, 204, 0, 0.8)',
      'rgb(0, 204, 0, 0.5)'
   ];

   const syncLabels = ["Đã đồng bộ", "Chưa đồng bộ"];
   const syncData = [statsData.totalSync, statsData.totalDocuments - statsData.totalSync];
   const syncBgColors = [
      'rgb(255, 0, 0, 0.8)',
      'rgb(255, 0, 0, 0.5)'
   ];

   return (
      <div className="w-full grid grid-cols-3 gap-3 my-3">
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <BarChart
               title={"Số lượng văn bản theo tính pháp quy"}
               labels={regulatoryLabels}
               data={regulatoryData} bgColors={regulatoryBgColors} />
         </div>
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <BarChart
               title={"Số lượng văn bản theo trạng thái hiệu lực"}
               labels={validvalidLabels} data={validData}
               bgColors={validBgColors} />
         </div>
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-200 dark:hover:bg-neutral-600">
            <BarChart
               title={"Số lượng văn bản theo trạng thái đồng bộ truy vấn"}
               labels={syncLabels} data={syncData}
               bgColors={syncBgColors} />
         </div>
      </div>
   );
}