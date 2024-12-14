'use client';
import { useRouter, useSearchParams } from "next/navigation";

export const PageLimitComponent = ({ pageLimit, pageURI }: { pageLimit: number, pageURI: string }) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      params.set("pageLimit", e.target.value);
      params.delete("pageNumber");
      router.push(`${pageURI}?${params.toString()}`);
   };
   return (
      <div className="flex gap-1 justify-start items-center">
         <span>Hiển thị</span>
         <select
            className="w-14 px-2 py-1 border border-gray-300 rounded"
            value={pageLimit}
            onChange={(e) => handleLimitChange(e)}
         >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
         </select>
         <span>mỗi trang</span>
      </div>
   );
}