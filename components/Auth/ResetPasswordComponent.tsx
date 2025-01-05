'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from 'react-hook-form'
import { ResetPasswordSchema } from "@/types/validation";
import { TbAlertCircle } from "react-icons/tb";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { errorToast, promiseToast, successToast } from "@/utils/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { apiServiceClient } from "@/app/apiService/apiService";

type ResetPasswordFormData = z.TypeOf<typeof ResetPasswordSchema>;

export const ResetPasswordComponent = () => {
   const searchParams = useSearchParams();
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ResetPasswordFormData>({
      resolver: zodResolver(ResetPasswordSchema)
   });

   const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data: ResetPasswordFormData) => {
      try {
         const response = await promiseToast(apiServiceClient.post(
            '/auth/reset-password', {
            ...data,
            token: searchParams.get('reset-from'),
         },
         ), 'Đang xử lý...');

         if (response.status === StatusCodes.UNAUTHORIZED) {
            errorToast('Mã thiết lập mật khẩu không hợp lệ.')
            return;
         }
         else if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Email không tồn tại.');
            return;
         }
         else if (response.status === StatusCodes.BAD_REQUEST) {
            errorToast('Mã thiết lập mật khẩu đã được sử dụng hoặc hết hạn.');
            return;
         }

         successToast('Thiết lập thành công, quay về đăng nhập.');
         router.push('/auth/login');
      } catch (error) {
         errorToast('Có lỗi xảy ra.');
      }
   }

   return (
      <>
         <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
            <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
               <span>Thiết lập mật khẩu mới</span>
            </div>
            <div className=" flex flex-col items-center w-80 px-10 rounded-sm gap-2">
               <span className="text-pretty text-center text-neutral-800">Vui lòng nhập mật khẩu mới của bạn.</span>
               <form onSubmit={handleSubmit(onSubmit)}>
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
            </div>
         </div>
      </>
   );
};