'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbPlus } from "react-icons/tb";
import { RiUserAddLine } from "react-icons/ri";
import { AddUserFormSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/app/apiService/axios";
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
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
import { useState } from "react";
import { AuthorityGroup } from "@/types/manage";
import { useRouter } from "next/navigation";

type AddUserForm = z.TypeOf<typeof AddUserFormSchema>;
export const AddUserModal = () => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [authorityGroups, setAuthorityGroups] = useState<AuthorityGroup[]>([]);
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<AddUserForm>({
      resolver: zodResolver(AddUserFormSchema),
   });

   const fetchAuthorityGroups = async () => {
      try {
         const response = await axiosInstance.get('/permission', { withCredentials: true });
         const result = response.data.data;
         setAuthorityGroups(result);
      }
      catch (error) {
         errorToast('Có lỗi xảy ra, vui lòng thử lại sau');
         onClose();
      }
   }
   const handleOpenModal = () => {
      fetchAuthorityGroups();
      onOpen();
   }

   const onSubmit: SubmitHandler<AddUserForm> = async (data) => {
      try {
         const response = await axiosInstance.post(`/user/`, JSON.stringify(data), {
            withCredentials: true,
         });
         if (response.status === StatusCodes.BAD_REQUEST) {
            errorToast('Có lỗi xảy ra khi gửi email xác thực. Vui lòng thử lại sau.')
            return;
         }
         if (response.status === StatusCodes.CONFLICT) {
            setError('email', { message: 'Email đã tồn tại, nhập email khác.' });
            return;
         }
         successToast('Thêm thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }

   return (
      <>
         <Button className="flex gap-2 p-3 rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onPress={handleOpenModal}>
            <TbPlus size={20} /> Thêm người dùng
         </Button>
         <Modal
            size="xl"
            isOpen={isOpen}
            onClose={onClose}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex items-center gap-1 bg-blue-600 text-white">
                           <RiUserAddLine size={24} />Thêm người dùng mới
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                           <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 my-2">
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Tên người dùng
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("fullName")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập tên người dùng `} />
                                 </div>
                                 {errors.fullName?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.fullName?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Địa chỉ Email
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("email")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập địa chỉ Email `} />
                                 </div>
                                 {errors.email?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.email?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Mật khẩu
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("password")}
                                       type="password"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập mật khẩu `} />
                                 </div>
                                 {errors.password?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.password?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Nhóm quyền
                                 </label>
                              </div>
                              <div className="sm:col-span-8 flex items-center mt-2.5">
                                 <select className="w-full" {...register('authorityGroup')}>
                                    <option value="">Chọn nhóm quyền</option>
                                    {authorityGroups.map((authorityGroup) => (
                                       <option key={authorityGroup.id} value={authorityGroup.id}>
                                          {authorityGroup.name}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                           <Button type="submit" className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Tiếp tục
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