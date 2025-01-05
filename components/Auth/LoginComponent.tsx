'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginFormSchema } from "@/types/validation";
import Link from "next/link";
import { TbAlertCircle } from "react-icons/tb";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { useRouter, useSearchParams } from "next/navigation";
import { errorToast, successToast } from "@/utils/toast";
import { useAppStore } from "@/app/store/app.store";
import { LoginConstantMessage } from "@/utils/constant";
import { apiServiceClient } from "@/app/apiService/apiService";

type LoginFormData = z.TypeOf<typeof LoginFormSchema>;

export const LoginComponent = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<LoginFormData>({
      resolver: zodResolver(LoginFormSchema)
   });
   const { state: { isLoading }, dispatch } = useAppStore();

   const onSubmit: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
      if (isLoading) return;
      dispatch("isLoading", true);
      try {
         const response = await apiServiceClient.post('/auth/login', data);
         if (response.status === StatusCodes.NOT_FOUND) {
            setError("email", { message: "Email không tồn tại." });
            return;
         }
         if (response.status === StatusCodes.UNAUTHORIZED) {
            setError("password", { message: "Sai mật khẩu hoặc email." });
            return;
         }

         const result = await response.json();
         if (result.message === LoginConstantMessage.TEMPORARILY_BLOCKED) {
            errorToast('Tài khoản tạm thời bị khóa do đăng nhập sai nhiều lần.');
            return;
         }
         if (result.message === LoginConstantMessage.DISABLED_EMAIL) {
            errorToast('Tài khoản bị vô hiệu. Vui lòng liên hệ quản trị viên.');
            return;
         }
         if (result.message === LoginConstantMessage.NOT_VERIFIED_EMAIL) {
            sessionStorage.setItem('verify-token', btoa(data.email));
            const timestamp = new Date().getTime();
            sessionStorage.setItem('verify-timestamp', timestamp.toString());
            router.push(`/auth/confirm-email`);
            return;
         }
         localStorage.setItem('accessToken', result.accessToken);
         localStorage.setItem('refreshToken', result.refreshToken);
         await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({
               accessToken: result.accessToken,
               refreshToken: result.refreshToken,
            }),
         });
         successToast('Đăng nhập thành công');
         router.push(searchParams.get('redirect') || '/chat');

      } catch (error) {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
      } finally {
         dispatch("isLoading", false);
      }
   }

   return (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Chào mừng trở lại</span>
            </div>
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Bạn cần đăng nhập</span>
            </div>
            <div className=" flex flex-col items-center w-80 px-10 rounded-sm">
               <form onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="relative mt-2">
                     <input {...register("password", { required: "Hãy nhập mật khẩu." })}
                        type="password" id="password" required name="password" className="px-3 w-80 h-12 text-sm text-neutral-900 rounded-md bg-white border border-neutral-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                     <label htmlFor="password" className="absolute text-sm text-neutral-800 duration-300 transform -translate-y-4 scale-[.85] top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Mật khẩu*
                     </label>
                  </div>
                  {errors.password?.message &&
                     <div className="ps-2 flex text-[11px] text-red-600 py-2">
                        <TbAlertCircle className="me-1" /> {errors.password?.message}
                     </div>
                  }
                  <div className="relative mt-2 text-[13px]">
                     <Link href='/auth/forgot-password' className="text-blue-500 hover:text-blue-700">Quên mật khẩu?</Link>
                  </div>
                  <div className="my-3">
                     <button type="submit" className="w-80 h-12 transition-colors ease-out duration 200 text-md text-white bg-blue-500 rounded-md hover:bg-blue-600">Tiếp tục</button>
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
   );
};