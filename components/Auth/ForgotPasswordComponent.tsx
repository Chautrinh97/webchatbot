'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from "next/link";
import { TbAlertCircle } from "react-icons/tb";
import { z } from "zod";
import { errorToast, promiseToast } from "@/utils/toast";
import { StatusCodes } from "http-status-codes";
import { useRef, useState } from "react";
import { EmailIcon } from "@/app/assets/email";
import { ForgotPasswordSchema } from "@/types/validation";
import { apiServiceClient } from "@/app/apiService/apiService";

type ForgotPasswordForm = z.TypeOf<typeof ForgotPasswordSchema>;
export const ForgotPasswordComponent = () => {
   const [sendMailStatus, setSendMailStatus] = useState<boolean>(false);
   const formRef = useRef<HTMLFormElement>(null);
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
      getValues,
   } = useForm<ForgotPasswordForm>({
      resolver: zodResolver(ForgotPasswordSchema)
   });

   const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data: ForgotPasswordForm) => {
      try {
         const response = await promiseToast(apiServiceClient.post('/auth/forgot-password', data), 'Đang xử lý...');

         if (response.status === StatusCodes.NOT_FOUND) {
            setError('email', { message: 'Email không tồn tại.' });
            return;
         }
         else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Email đã được gửi đi gần đây, vui lòng kiểm tra email của bạn.');
            return;
         }
         else if (response.status === StatusCodes.BAD_REQUEST) {
            errorToast('Có lỗi xảy ra, vui lòng thử lại sau.');
            return;
         }
         setSendMailStatus(true);
      } catch (error) {
         errorToast('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
   }

   const handleResend = () => {
      handleSubmit(onSubmit)();
   }

   return !sendMailStatus ? (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Thiết lập lại mật khẩu <br />của bạn</span>
            </div>
            <div className=" flex flex-col items-center w-80 px-10 rounded-sm">
               <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative mt-2 mb-10 text-[14px] text-center text-neutral-800">
                     Vui lòng nhập email để chúng tôi gửi cho bạn hướng dẫn đặt lại mật khẩu.
                  </div>
                  <div className="relative">
                     <input {...register("email", { required: "Hãy nhập email." })}
                        type="text" id="email" required name="email" className="px-3 w-80 h-12 text-sm text-neutral-900 rounded-md bg-white border border-neutral-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                     <label htmlFor="email" className="absolute text-sm text-neutral-800 duration-300 transform -translate-y-4 scale-[.85] top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Địa chỉ Email
                     </label>
                  </div>
                  {errors.email?.message &&
                     <div className="ps-2 flex text-[11px] text-red-600 py-2">
                        <TbAlertCircle className="me-1" /> {errors.email?.message}
                     </div>
                  }
                  <div className="my-3">
                     <button type="submit" className="w-80 h-12 transition-colors ease-out duration 200 text-md text-white bg-blue-500 rounded-md hover:bg-blue-600">Tiếp tục</button>
                  </div>
                  <div className="relative mt-2 text-[13px] text-center text-neutral-800">
                     <span>Quay lại <Link href='/auth/login' className="text-blue-500 hover:text-blue-700">đăng nhập</Link></span>
                  </div>
                  {/* <div className="relative w-80 mt-8 flex items-center justify-center">
                     <div className="flex-grow border-t border-neutral-300"></div>
                     <span className="mx-2 text-neutral-500">Hoặc</span>
                     <div className="flex-grow border-t border-neutral-300"></div>
                  </div>
                  <div className="relative mt-4">
                     <Link href="/chat" className="relative flex gap-5 items-center px-3 w-80 h-12 text-sm text-neutral-900 rounded-md border border-neutral-400 transition-colors duration-150 bg-white hover:bg-neutral-200">
                        <TbMessageChatbot size={24} className="absolute left-4" />
                        <span className="w-full text-center">Chuyển đến chatbot</span>
                     </Link>
                  </div> */}
               </form>
            </div>
         </div>
      </>
   ) : (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="flex w-80 items-center justify-center pb-6 text-neutral-800">
               <EmailIcon size={120} />
            </div>
            <div className=" flex flex-col items-center text-[14px] w-80 px-2 rounded-sm gap-2 text-neutral-800">
               <span className="text-pretty text-center">Chúng tôi đã gửi một thông báo tới email</span>
               <span className="italic px-1">{getValues('email')}.</span>
               <span className="text-pretty text-center">Vui lòng kiểm tra email của bạn để tiếp tục thực hiện đặt lại mật khẩu.</span>
               <span className="text-pretty text-center">Bạn chưa nhận được mail?</span>
               <button type='submit'
                  className="w-60 h-10 border-2 text-center rounded-md hover:bg-neutral-200"
                  onClick={handleResend}>
                  Gửi lại email
               </button>
            </div>
         </div>
      </>
   )
};