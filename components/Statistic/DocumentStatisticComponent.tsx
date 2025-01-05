'use client';
import { Suspense, useEffect } from "react";
import { Loading } from "../Others/Loading";
import { GeneralStatsComponent } from "./GeneralStatsComponent";
import { PieChartGroup } from "./PieChartGroup";
import { BarChartGroup } from "./BarChartGroup";
import { basicToast, errorToast } from "@/utils/toast";
import { useStatisticStore } from "@/app/store/document-statistic.store";
import { apiServiceClient } from "@/app/apiService/apiService";
export const DocumentStatisticComponent = () => {
   const { state: { isRegulatory, validityStatus, syncStatus }, dispatch } = useStatisticStore();
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await apiServiceClient.get(`/statistic`, {
               isRegulatory,
               validityStatus,
               syncStatus,
            });
            const result = await response.json();
            console.log(result);
            dispatch('statsData', result.data);
         } catch {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
            return;
         }
      };
      fetchData();
   }, [dispatch, isRegulatory, syncStatus, validityStatus]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await apiServiceClient.get(`/statistic`, {
               isRegulatory,
               validityStatus,
               syncStatus,
            });
            const result = await response.json();
            dispatch('statsData', result.data);
         } catch {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
            return;
         }
      };
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Suspense fallback={<Loading />}>
         <div className="w-full h-full">
            <div className="flex flex-col pt-20 px-6 justify-between items-center flex-shrink-0">
               <div className="w-full mb-3 p-2 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700  shadow-sm dark:shadow-md rounded-lg text-center text-lg text-white uppercase">
                  Trang thống kê văn bản
               </div>
               <GeneralStatsComponent />
               <BarChartGroup />
               <PieChartGroup />
            </div>
         </div>
      </Suspense>
   );
}