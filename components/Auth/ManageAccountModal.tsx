'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle } from "react-icons/tb";
import { ChangePasswordSchemas } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
import { FaInfoCircle } from "react-icons/fa";
import {
   Button,
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   useDisclosure,
   Divider,
} from "@nextui-org/react";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { useRouter } from "next/navigation";
import { MdOutlinePassword } from "react-icons/md";
import { apiService } from "@/app/apiService/apiService";

type ChangePasswordForm = z.TypeOf<typeof ChangePasswordSchemas>;
export const ManageAccountModal = ({ disClosure, user }: { disClosure: UseDisclosureReturn, user: any }) => {
   const router = useRouter();
   const { isOpen, onClose } = disClosure;

   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<ChangePasswordForm>({
      resolver: zodResolver(ChangePasswordSchemas),
   });

   const onSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
      const { confirmPassword, ...formData } = data;
      try {
         const response = await apiService.put(`/user/me`, formData);
         if (response.status === StatusCodes.CONFLICT) {
            setError("oldPassword", { message: "Mật khẩu cũ không chính xác." });
            return;
         } else if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Người dùng không tồn tại. Đang đăng xuất...');
            await fetch('/api/auth/logout', {
               method: "POST",
            });
            router.push('/');
            return;
         }
         successToast('Đổi mật khẩu thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <>
         <Modal
            backdrop="blur"
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={true}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex items-center bg-blue-600 text-white gap-2">
                           <FaInfoCircle size={24} /> Thông tin cá nhân
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                           <div className="flex flex-col divide-y-2">
                              <div className="grid sm:grid-cols-5 gap-2 sm:gap-6 mt-2 mb-3">
                                 <div className="sm:col-span-2">
                                    <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                       Tên người dùng
                                    </label>
                                 </div>
                                 <div className="sm:col-span-3">
                                    <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                       <input
                                          type="text"
                                          readOnly
                                          value={user.fullName}
                                          className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       />
                                    </div>
                                 </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                       Địa chỉ email
                                    </label>
                                 </div>
                                 <div className="sm:col-span-3">
                                    <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                       <input
                                          type="text"
                                          readOnly
                                          value={user.email}
                                          className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       />
                                    </div>
                                 </div>
                              </div>
                              <div className="grid sm:grid-cols-5 gap-2 sm:gap-6 mt-2 mb-3">
                                 <div className="sm:col-span-5 flex items-center justify-center gap-2 mt-4">
                                    <MdOutlinePassword size={24} /> Thay đổi mật khẩu
                                 </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                       Mật khẩu cũ
                                    </label>
                                 </div>
                                 <div className="sm:col-span-3">
                                    <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                       <input
                                          type="password"
                                          placeholder="Nhập mật khẩu cũ"
                                          {...register('oldPassword')}
                                          className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       />
                                    </div>
                                    {errors.oldPassword?.message &&
                                       <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                          <TbAlertCircle className="me-1" /> {errors.oldPassword?.message}
                                       </div>}
                                 </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                       Mật khẩu mới
                                    </label>
                                 </div>
                                 <div className="sm:col-span-3">
                                    <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                       <input
                                          type="password"
                                          {...register("newPassword")}
                                          placeholder="Nhập mật khẩu mới"
                                          className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       />
                                    </div>
                                    {errors.newPassword?.message &&
                                       <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                          <TbAlertCircle className="me-1" /> {errors.newPassword?.message}
                                       </div>}
                                 </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                       Xác nhận mật khẩu
                                    </label>
                                 </div>
                                 <div className="sm:col-span-3">
                                    <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                       <input
                                          type="password"
                                          placeholder="Nhập lại mật khẩu mới"
                                          {...register("confirmPassword")}
                                          className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       />
                                    </div>
                                    {errors.confirmPassword?.message &&
                                       <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                          <TbAlertCircle className="me-1" /> {errors.confirmPassword?.message}
                                       </div>}
                                 </div>
                              </div>
                           </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                           <Button type="submit" className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Đổi mật khẩu
                           </Button>
                           <Button color="danger" className="rounded-md" variant="light" onPress={onClose}>
                              Đóng
                           </Button>
                        </ModalFooter>
                     </form>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
}