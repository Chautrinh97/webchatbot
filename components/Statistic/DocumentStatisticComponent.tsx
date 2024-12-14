'use client';
import axiosInstance from "@/app/apiService/axios";
import { useEffect, useState } from "react";
import { Loading } from "../Others/Loading";
import { GeneralStatsComponent } from "./GeneralStatsComponent";
import { PieChartGroup } from "./PieChartGroup";
import { BarChartGroup } from "./BarChartGroup";
import { errorToast } from "@/utils/toast";
import { StatsData, StatsDataInit } from "@/types/manage";
import { useStatisticStore } from "@/app/store/document-statistic.store";
export const DocumentStatisticComponent = () => {
   const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
   const [statsData, setStatsData] = useState<StatsData>(StatsDataInit);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const { state: { isRegulatory, isPublic, validityStatus } } = useStatisticStore();

   const fetchData = async () => {
      try {
         const response = await axiosInstance.get(`/statistic`,
            {
               params: {
                  isRegulatory,
                  isPublic,
                  validityStatus,
               },
               withCredentials: true
            });
         setStatsData(response.data.data);
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }

   useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [refetchTrigger]);

   useEffect(() => {
      setIsLoading(true);
      fetchData();
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleRefetch = () => {
      setRefetchTrigger(!refetchTrigger);
   }

   if (isLoading) {
      return <Loading />;
   }

   return (
      <div className="w-full h-full">
         <div className="flex flex-col pt-20 px-6 justify-between items-center flex-shrink-0">
            <div className="w-full mb-3 p-2 border dark:border-neutral-600 bg-blue-600 dark:border-0 shadow-sm dark:shadow-md rounded-lg text-center text-lg text-white uppercase">
               Trang thống kê tài liệu
            </div>
            <GeneralStatsComponent
               totalDocuments={statsData.totalDocuments}
               totalDocumentFields={statsData.totalDocumentFields}
               totalDocumentTypes={statsData.totalDocumentTypes}
               totalIssuingBodies={statsData.totalIssuingBodies} />
            <PieChartGroup
               totalDocuments={statsData.totalDocuments}
               documentTypes={statsData.documentTypes}
               documentFields={statsData.documentFields}
               issuingBodies={statsData.issuingBodies}
               handleRefetch={handleRefetch}
            />
            <BarChartGroup
               totalDocuments={statsData.totalDocuments}
               totalPublic={statsData.totalPublic}
               totalRegulatory={statsData.totalRegulatory}
               totalValid={statsData.totalValid} />
         </div>
      </div>
   );
}