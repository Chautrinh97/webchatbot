'use client'
import { apiServiceClient } from "@/app/apiService/apiService";
import { errorToast, errorToastUp, successToast } from "@/utils/toast";
import { Tooltip } from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";


export const UpdateUserStatusButton = ({ id, isDisabled }: { id: number, isDisabled: boolean }) => {
   const router = useRouter();
   const updateUserStatus = async () => {
      try {
         const response = await apiServiceClient.put(`/user/${id}`, {
            isDisabled: (!isDisabled).toString(),
         });

         if (response.status === StatusCodes.FORBIDDEN) {
            errorToastUp('Tài khoản này có quyền quản lý người dùng. Tác vụ bị từ chối')
            return;
         }
         successToast('Đổi trạng thái tài khoản thành công')
         router.refresh();
      }
      catch (error) {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
   }
   return <>
      {isDisabled ? (
         <Tooltip content='Gỡ vô hiệu' placement={'left'} color={'success'} >
            <button
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg 
            border border-transparent text-green-500 hover:text-green-700 disabled:opacity-50 
            disabled:pointer-events-none dark:text-gree-700 dark:hover:text-green-500 hover:animate-bounceupdown"
               onClick={updateUserStatus}>
               <IoLockOpenOutline size={20} />
            </button>
         </Tooltip >
      ) : (
         <Tooltip content='Vô hiệu' placement={'left'} color={'danger'} >
            <button
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg 
            border border-transparent text-red-400 hover:text-red-600 disabled:opacity-50 
            disabled:pointer-events-none dark:text-red-700 dark:hover:text-red-500 hover:animate-bounceupdown"
               onClick={updateUserStatus}>
               <IoLockClosedOutline size={20}/>
            </button>
         </Tooltip>
      )}
   </>
}