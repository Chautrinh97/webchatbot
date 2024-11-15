'use client'
import { errorToast } from "@/utils/toast";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { TbCheck } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/app/apiService/axios";

export const ConfirmEmailComponent = () => {
   const [isResend, setIsResend] = useState<boolean>(false);
   const [isDisabled, setIsDisabled] = useState<boolean>(false);
   const token = sessionStorage.getItem('verify-token');
   const email = token ? atob(token) : null;

   const handleResendEmail = async (e: any) => {
      try {
         const response = await axiosInstance.post(
            '/auth/resend-confirm',
            JSON.stringify({
               email: email,
            }),
         );

         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Email không tồn tại.');
            setIsDisabled(true);
         }
         else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Email đã được xác minh.');
            setIsDisabled(true);
         }
         else if (response.status === StatusCodes.BAD_REQUEST) {
            errorToast('Có lỗi xảy ra trong quá trình gửi mail, vui lòng thử lại sau.');
         }
         else {
            setIsResend(true);
         }
      }
      catch (error) {
         errorToast('Có lỗi xảy ra.');
      }
   }
   return (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Xác minh email của bạn</span>
            </div>
            <div className=" flex flex-col items-center text-[14px] w-80 px-2 rounded-sm gap-2 text-neutral-800">
               <span className="text-pretty">Chúng tôi đã gửi email tới </span>
               <span className="italic px-1">{email}.</span>
               <span>Vui lòng kiểm tra email của bạn.</span>
               <span className="">Bạn chưa nhận được email?</span>
               {!isResend ? (
                  <button className="w-60 h-10 border-2 text-center rounded-md hover:bg-neutral-200"
                     disabled={isDisabled}
                     onClick={handleResendEmail}>
                     Gửi lại email
                  </button>
               ) : (
                  <div className="flex">
                     <TbCheck size={18} />
                     <span>Gửi thành công</span>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}
