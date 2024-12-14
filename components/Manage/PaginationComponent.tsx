'use client'
import { Pagination } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

export const PaginationComponent = (
   { total, currentPage, pageLimit, pageURI }:
      { total: number, currentPage: number, pageLimit: number, pageURI: string }) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const numberOfPages = Math.ceil(total / pageLimit);
   const startIndex = total > 0 ? (currentPage - 1) * pageLimit + 1 : 0;
   const endIndex = total > 0? startIndex + Math.min(pageLimit, total - (currentPage - 1) * pageLimit) - 1 : 0;
   const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams as any);
      params.set("pageNumber", page.toString());
      router.push(`${pageURI}?${params.toString()}`);
   };
   return (
      <div className="flex justify-between items-center py-2 px-2 bg-sb-white dark:bg-neutral-700 border-x border-b dark:border dark:border-neutral-500 text-center font-medium text-[14px] rounded-b">
         <div>
            Hiển thị từ {startIndex} - {endIndex} trong tổng số {total} kết quả.
         </div>
         <div className="flex justify-end items-center">
            <span className="mx-2">Trang</span>
            <Pagination showControls total={numberOfPages} initialPage={1} page={currentPage} onChange={(page) => handlePageChange(page)} />
         </div>
      </div>
   );
}