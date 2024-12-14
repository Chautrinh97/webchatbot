'use client'
import axiosInstance from "@/app/apiService/axios";
import { errorToast } from "@/utils/toast";
import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation";

export const UpdateUserStatusButton = ({ id, isDisabled }: { id: number, isDisabled: boolean }) => {
   const router = useRouter();
   const updateUserStatus = async (id: number, isDisabled: boolean) => {
      try {
         await axiosInstance.put(`/user/${id}`,
            JSON.stringify({
               isDisabled: !isDisabled,
            }),
            {
               withCredentials: true,
            });
         router.refresh();
      }
      catch (error) {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }
   return (
      <Button
         className="rounded-md"
         color={!isDisabled ? 'success' : 'danger'}
         onClick={() => updateUserStatus(id, isDisabled)}
         title={!isDisabled ? 'Bấm để vô hiệu hóa' : 'Bấm để gỡ vô hiệu'}>
         {!isDisabled ? 'Vô hiệu hóa' : 'Gỡ vô hiệu'}
      </Button>
   )
}