'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";

export const SearchBarComponent= ({ initialSearch, pageURI }: { initialSearch: string, pageURI: string }) => {
   const [query, setQuery] = useState(initialSearch);
   const router = useRouter();
   const searchParams = useSearchParams();
   const handleSearch = () => {
      const params = new URLSearchParams(searchParams as any);
      params.set("searchKey", query);
      params.delete("pageNumber"); 
      router.push(`${pageURI}?${params.toString()}`);
   };
   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSearch();
      }
   }
   return (
      <div className="flex min-w-[320px] max-w-[400px]">
         <div className="relative w-full">
            <input type="text" id="search" className="block ps-4 py-3 w-full z-20 text-[14px] text-black rounded-lg border border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-300 dark:text-white focus:outline-none"
               placeholder="Tìm kiếm..."
               value={query}
               onKeyDown={handleKeyDown}
               onChange={(e) => setQuery(e.target.value)}
               required />
            <button type="button"
               title="Tìm kiếm"
               onClick={handleSearch}
               className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
               <TbSearch size={20} />
               <span className="sr-only">Search</span>
            </button>
         </div>
      </div>
   )
}