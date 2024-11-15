'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from 'react-hook-form'
import { SignupFormSchema } from "@/types/validation";
import Link from "next/link";
import { TbAlertCircle } from "react-icons/tb";
import { GoogleIcon } from "@/app/assets/google";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { errorToast, promiseToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/apiService/axios";
import { useAppStore } from "@/app/store/app.store";

type RegisterFormData = z.TypeOf<typeof SignupFormSchema>;

export const RegisterComponent = () => {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<RegisterFormData>({
      resolver: zodResolver(SignupFormSchema)
   });
   const {state: {isLoading}, dispatch} = useAppStore();

   const onSubmit: SubmitHandler<RegisterFormData> = async (data: RegisterFormData) => {
      if (isLoading) return;
      dispatch("isLoading", true);
      try {
         const response = await promiseToast(axiosInstance.post('/auth/register', JSON.stringify(data)), 'Đang xử lý...');
         if (response.status === StatusCodes.BAD_REQUEST) {
            setError("email", { message: "Email đã tồn tại." });
            return;
         }
         successToast('Đăng ký thành công.');
         const result = response.data;
         const token = btoa(result.user.email);
         sessionStorage.setItem('verify-token', token);
         router.push(`/auth/confirm-email`);
      } catch (error) {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      } finally {
         dispatch("isLoading", false);
      }
   }

   return (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Tạo một tài khoản</span>
            </div>
            <div className=" flex flex-col items-center w-80 px-10 rounded-sm">
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative mt-2">
                     <input {...register("email")}
                        type="text" id="email" required name="email" className="px-3 w-80 h-12 text-sm text-neutral-900 rounded-md bg-white border border-neutral-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                     <label htmlFor="email" className="absolute text-sm text-neutral-800 duration-300 transform -translate-y-4 scale-[.85] top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Địa chỉ Email
                     </label>
                  </div>
                  {errors.email?.message &&
                     <div className="ps-2 flex text-[12px] text-red-600 py-2">
                        <TbAlertCircle className="me-1" /> {errors.email?.message}
                     </div>
                  }
                  <div className="relative mt-2">
                     <input {...register("password")}
                        type="password" id="password" required name="password" className="px-3 w-80 h-12 text-sm text-neutral-900 rounded-md bg-white border border-neutral-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                     <label htmlFor="password" className="absolute text-sm text-neutral-800 duration-300 transform -translate-y-4 scale-[.85] top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Mật khẩu*
                     </label>
                  </div>
                  {errors.password?.message &&
                     <div className="ps-2 flex text-[12px] text-red-600 py-2">
                        <TbAlertCircle className="me-1" /> Mật khẩu phải {errors.password?.message}
                     </div>
                  }
                  <div className="relative mt-2">
                     <input {...register("confirmPassword")}
                        type="password" id="confirmPassword" required name="confirmPassword" className="px-3 w-80 h-12 text-sm text-neutral-900 rounded-md bg-white border border-neutral-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                     <label htmlFor="confirmPassword" className="absolute text-sm text-neutral-800 duration-300 transform -translate-y-4 scale-[.85] top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Xác nhận mật khẩu*
                     </label>
                  </div>
                  {errors.confirmPassword?.message &&
                     <div className="ps-2 flex text-[12px] text-red-600 py-2">
                        <TbAlertCircle className="me-1" /> {errors.confirmPassword?.message}
                     </div>
                  }
                  <div className="my-3">
                     <button type="submit" className="w-80 h-12 transition-colors ease-out duration 200 text-md text-white bg-blue-500 rounded-md hover:bg-blue-600">Tiếp tục</button>
                  </div>
               </form>
               <div className="text-[13px] text-center w-80 box-border text-neutral-800">
                  Đã có tài khoản?
                  <Link href="/auth/login" className="text-blue-500 hover:text-blue-700"> Đăng nhập</Link>
               </div>
               <div className="relative w-80 mt-8 flex items-center justify-center">
                  <div className="flex-grow border-t border-neutral-300"></div>
                  <span className="mx-2 text-neutral-500">Hoặc</span>
                  <div className="flex-grow border-t border-neutral-300"></div>
               </div>
               <div className="relative mt-4">
                  <button type="button" className="flex gap-5 items-center px-3 w-80 h-12 text-sm text-neutral-900 rounded-md border border-neutral-400 transition-colors duration-150 bg-white hover:bg-neutral-200">
                     <GoogleIcon size={24} />
                     <span >Tiếp tục với Google</span>
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};