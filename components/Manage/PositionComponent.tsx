"use client"
import { displayPermission, Position } from "@/types/chat";
import queryString from 'query-string';
import { useEffect, useState } from "react";
import axiosInstance from "@/app/apiService/axios";
import { errorToast } from "@/utils/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { AddPositionModal } from "./AddPositionModal";
import { EditPositionModal } from "./EditPositionModal";
import { DeletePositionModal } from "./DeletePositionModal";
import { AiOutlineLoading } from "react-icons/ai";

export const DocumentTypeComponent = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [positions, setPositions] = useState<Position[]>([]);
   const [total, setTotal] = useState(0);
   const [numberOfPages, setNumberOfPages] = useState<number>(0);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [pageLimit, setPageLimit] = useState<number>(10);
   const [searchKey, setSearchKey] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(true);

   const fetchData = async (params = queryString.stringify({
      searchKey: searchParams.get('searchKey')?.trim(),
      pageNumber: searchParams.get('pageNumber') || 1,
      pageLimit: searchParams.get('pageLimit') || 10,
   })) => {
      try {
         const response = await axiosInstance.get(`/position?${params}`, {
            withCredentials: true,
         });
         const positions = response.data.data.map((pos: any) => ({
            id: pos._id,
            name: pos.name,
            description: pos.description,
            permissionLevel: pos.permissionLevel,
         }));
         setPositions(positions);
         setTotal(response.data.total);
         setIsLoading(false);
         setCurrentPage(response.data.currentPage);
         setNumberOfPages(response.data.numberOfPages);
      } catch (error) {
         errorToast('Có lỗi trong quá trình tải dữ liệu.');
      }
   };

   useEffect(() => { fetchData(); }, []);

   const refetchData = () => {
      fetchData(queryString.stringify({
         searchKey: '',
         pageNumber: 1,
         pageLimit: 10,
      }));
   }

   const updateQueryParam = (key: string, value: string) => {
      const currentQueryParam = new URLSearchParams(searchParams.toString());
      if (value)
         currentQueryParam.set(key, value);
      else
         currentQueryParam.delete(key);
      router.replace(`?${currentQueryParam.toString()}`, { scroll: true });
   }
   const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         handleSearch();
      }
   }
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKey(e.target.value);
   }
   useEffect(() => {
      updateQueryParam("searchKey", searchKey);
   }, [searchKey]);

   const handleSearch = () => {
      fetchData();
   }

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <AiOutlineLoading size={20} className="animate-spin"/>
            <span>Đang tải dữ liệu...</span>
         </div>
      )
   }

   return (
      <div className="h-full w-full">
         <div className="flex pt-20 px-6 justify-between items-center">
            <SearchBar handleKeydown={handleKeydown} handleSearchChange={handleSearchChange} handleClickSearch={handleSearch} />
            <AddPositionModal refetchTrigger={refetchData} />
         </div>
         <div className="mt-3 flex flex-col relative px-6">
            <div className="py-2 bg-gray-300 dark:dark:bg-gray-700 border border-gray-200 dark:border-neutral-500 text-center font-medium text-[17px] uppercase rounded-t-md">
               Danh sách chức danh
            </div>
            <div className="overflow-auto max-h-[400px] w-full inline-block align-middle">
               <div className="border border-gray-300 dark:border-neutral-500 divide-y divide-gray-300 dark:divide-neutral-700 rounded-b-md">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-700">
                     <thead className="bg-gray-200 dark:bg-neutral-700 text-[14px] text-neutral-800 dark:text-gray-200">
                        <tr>
                           <th scope="col" className="px-6 py-3 text-start font-medium uppercase">Tên</th>
                           <th scope="col" className="px-6 py-3 text-start font-medium uppercase">Mô tả</th>
                           <th scope="col" className="px-6 py-3 text-start font-medium uppercase">Quyền hạn</th>
                           <th scope="col" className="px-6 py-3 text-end font-medium uppercase">Hành động</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200 dark:divide-neutral-500">
                        {positions?.length ? (
                           <>
                              {positions.map((position) => (
                                 < tr className="hover:bg-gray-100 dark:hover:bg-neutral-700/50" key={position.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{position.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{position.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{displayPermission(position.permissionLevel)}</td>
                                    <td className="px-6 py-4 flex justify-end items-center gap-3">
                                       <EditPositionModal key={position.id} positionId={position.id} refetchTrigger={refetchData}/>
                                       <DeletePositionModal positionId={position.id} refetchTrigger={refetchData}/>
                                    </td>
                                 </tr>
                              ))}
                           </>
                        ) : (
                           <tr className="whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 ">
                              <div className="px-6 py-4">
                                 Không có chức vụ nào.
                              </div>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div >
      </div>
   );
}