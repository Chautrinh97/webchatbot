'use client'
import { useRouter, useSearchParams } from "next/navigation";

export const RoleFilterComponent = ({ role }: { role: string }) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.value === "") params.delete('role');
      else params.set("role", e.target.value);
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/user?${params.toString()}`);
   };
   return (
      <div className="flex ms-5 items-center">
         <div className="pe-3">Vai trò</div>
         <div>
            <select
               onChange={(e) => handleChangeRole(e)}
               value={role}
               className="border border-gray-300 rounded-md dark:bg-neutral-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
               <option value="">Tất cả </option>
               <option value="officer">Cán bộ, nhân viên</option>
               <option value="guest">Khách</option>
            </select>
         </div>
      </div>
   );
}