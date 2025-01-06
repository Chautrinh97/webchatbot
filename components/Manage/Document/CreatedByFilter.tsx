'use client'

import { useUserStore } from "@/app/store/user.store";
import { UserPermissionConstant } from "@/utils/constant";
import { Checkbox } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const CreatedByFilter = ({ createdBy }: { createdBy: boolean }) => {
   const [isCreated, setIsCreated] = useState<boolean>(createdBy);
   const searchParams = useSearchParams();
   const router = useRouter();
   const { user } = useUserStore();

   const hasPermission = user.permissions?.some((permission) =>
      permission === UserPermissionConstant.MANAGE_ALL_DOCUMENTS ||
      permission === UserPermissionConstant.MANAGE_OWN_DOCUMENTS);

   const handleChange = (e: any) => {
      const params = new URLSearchParams(searchParams as any);
      if (e.target.checked) {
         setIsCreated(true);
         params.set('createdBy', 'true');
      }
      else {
         setIsCreated(false);
         params.delete('createdBy');
      }
      params.delete("pageNumber");
      params.delete("searchKey");
      router.push(`/manage/document?${params.toString()}`);
   };

   return (
      <>
         {hasPermission ?
            <Checkbox
               isSelected={isCreated}
               radius="sm"
               className={`text-[14px] ${!isCreated && 'line-through'}`}
               onChange={handleChange}>
               Tạo bởi tôi
            </Checkbox>
            : 
            <></>
         }
      </>
   );
}