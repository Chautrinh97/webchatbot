'use client';
import { useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';
import { useSearchParams, useRouter } from 'next/navigation';
import { basicToast } from '@/utils/toast';
import { apiServiceClient} from '@/app/apiService/apiService';

export function CompleteConfirmComponent() {
   const searchParams = useSearchParams();
   const verifyToken = searchParams.get('verify-from');
   const router = useRouter();
   const [message, setMessage] = useState('Đang xử lý...');

   useEffect(() => {
      const confirmEmail = async () => {
         try {
            const response = await apiServiceClient.post(
               '/auth/confirm-email', {
               token: verifyToken,
            });

            if (response.status === StatusCodes.CONFLICT) {
               setMessage('Email đã được xác nhận trước đây.');
               basicToast('Trở về trang đăng nhập');
               router.replace('/auth/login');
               return;
            } else if (response.status === StatusCodes.UNAUTHORIZED) {
               setMessage('Mã xác nhận có vấn đề.');
            } else if (response.status === StatusCodes.NOT_FOUND) {
               setMessage('Email không tồn tại.');
            } else {
               basicToast('Trở về trang đăng nhập');
               setTimeout(() => router.push('/auth/login'), 2000);
               setMessage('Xác minh thành công, vui lòng đăng nhập để tiếp tục');
            }
         } catch (error) {
            setMessage('Có lỗi xảy ra trong quá trình xác minh.');
         }
      };
      confirmEmail();
   }, [router, verifyToken]);

   return (
      <div className="flex flex-col items-center gap-3 transition-all ease-in duration-300">
         <div className="w-80 font-bold uppercase text-xl text-center pb-6 text-neutral-800">
            <span>{message}</span>
         </div>
      </div>
   );
}
