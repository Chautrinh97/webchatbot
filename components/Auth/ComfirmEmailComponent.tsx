'use client'
import { basicToast, errorToast } from "@/utils/toast";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { TbCheck } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { useAppStore } from "@/app/store/app.store";
import {apiService} from "@/app/apiService/apiService";

export const ConfirmEmailComponent = () => {
   const { state: { isLoading } } = useAppStore();
   const router = useRouter();
   const [isResend, setIsResend] = useState<boolean>(false);
   const [isDisabled, setIsDisabled] = useState<boolean>(false);
   const [email, setEmail] = useState<string | null>(null);

   useEffect(() => {
      const token = sessionStorage.getItem('verify-token');
      const timestamp = sessionStorage.getItem("verify-timestamp") as string;
      const currentTime = new Date().getTime();
      if (!token || !timestamp || isNaN(parseInt(timestamp))) {
         basicToast('Đang tự động chuyển hướng đến trang đăng nhập');
         router.replace('/auth/login');
         return;
      }

      const timeLimit = 5 * 1000;
      if (currentTime - parseInt(timestamp) > timeLimit) {
         sessionStorage.removeItem("verify-token");
         sessionStorage.removeItem("verify-timestamp");
         basicToast('Đang tự động chuyển hướng đến trang đăng nhập');
         router.replace("/auth/login");
         return;
      }

      setEmail(token ? atob(token) : null);

   }, [router]);

   const handleResendEmail = async (e: any) => {
      try {
         const response = await apiService.post(
            '/auth/send-confirm-email', {
            email: email,
         });

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

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <AiOutlineLoading className="animate-spin" />
            <span>Đang tải dữ liệu...</span>
         </div>
      )
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
