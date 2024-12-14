import { BarChart } from "./BarChart";

export const BarChartGroup = (
   { totalDocuments, totalPublic, totalRegulatory, totalValid }:
      { totalDocuments: number, totalPublic: number, totalRegulatory: number, totalValid: number }
) => {
   const publicLabels = ["Công khai", "Nội bộ"];
   const publicData = [totalPublic, totalDocuments - totalPublic];
   const publicBgColors = [
      'rgb(255, 0, 0, 0.8)',
      'rgb(255, 0, 0, 0.5)',
   ];

   const validvalidLabels = ["Còn hiệu lực", "Hết hiệu lực"];
   const validData = [totalValid, totalDocuments - totalValid];
   const validBgColors = [
      'rgb(0, 0, 255, 0.8)',
      'rgb(0, 0, 255, 0.5)'
   ];

   const regulatoryLabels = ["Văn bản pháp quy", "Tài liệu thường"];
   const regulatoryData = [totalRegulatory, totalDocuments - totalRegulatory];
   const regulatoryBgColors = [
      'rgb(0, 204, 0, 0.8)',
      'rgb(0, 204, 0, 0.5)'
   ];


   return (
      <div className="w-full grid grid-cols-3 gap-3 my-3">
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <BarChart
               title={"Số lượng tài liệu theo tính pháp quy"}
               labels={regulatoryLabels}
               data={regulatoryData} bgColors={regulatoryBgColors} />
         </div>
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <BarChart
               title={"Số lượng tài liệu theo trạng thái công khai"}
               labels={publicLabels} data={publicData}
               bgColors={publicBgColors} />
         </div>
         <div className="py-2 px-2 shadow-md border dark:border-0 rounded-lg bg-white dark:bg-sb-black hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <BarChart
               title={"Số lượng tài liệu theo trạng thái hiệu lực"}
               labels={validvalidLabels} data={validData}
               bgColors={validBgColors} />
         </div>
      </div>
   );
}