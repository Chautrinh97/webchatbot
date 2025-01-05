'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbPlus } from "react-icons/tb";
import { RiUserAddLine } from "react-icons/ri";
import { AddUserFormSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusCodes } from "http-status-codes";
import { errorToast, errorToastUp, successToast } from "@/utils/toast";
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
import { UserRoleConstant } from "@/utils/constant";
import { apiServiceClient } from "@/app/apiService/apiService";
import { useUserStore } from "@/app/store/user.store";

type AddUserForm = z.TypeOf<typeof AddUserFormSchema>;
export const AddUserModal = () => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [action, setAction] = useState<"close" | "continue" | null>(null);
   const [authorityGroups, setAuthorityGroups] = useState<AuthorityGroup[]>([]);
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
      reset,
   } = useForm<AddUserForm>({
      resolver: zodResolver(AddUserFormSchema),
      defaultValues: { role: UserRoleConstant.GUEST }
   });
   const { user } = useUserStore();

   const fetchAuthorityGroups = async () => {
      try {
         const response = await apiServiceClient.get('/permission');
         const result = await response.json();
         setAuthorityGroups(result.data);
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
         const response = await apiServiceClient.post(`/user/`, data);
         if (response.status === StatusCodes.CONFLICT) {
            const message = (await response.json()).message;
            if (message === "EXIST_EMAIL")
               setError('email', { message: 'Email đã tồn tại, nhập email khác' });
            else {
               errorToastUp('Không thể đặt nhóm quyền cho người dùng Khách');
            }
            return;
         } else if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Nhóm quyền không tồn tại. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.FORBIDDEN) {
            errorToastUp('Bạn không được phép đặt nhóm quyền cho người dùng');
            return;
         }
         successToast('Thêm thành công.');
         if (action === 'close') {
            reset({ email: "", fullName: "", role: UserRoleConstant.GUEST, authorityGroup: null, password: "" });
            onClose();
            router.refresh();
            return;
         } else if (action === 'continue') {
            reset({ email: "", fullName: "", role: UserRoleConstant.GUEST, authorityGroup: null, password: "" });
            router.refresh();
            return;
         }
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <>
         <button className="flex gap-2 p-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
            onClick={handleOpenModal}>
            <TbPlus size={20} /> Thêm người dùng
         </button>
         <Modal
            backdrop="blur"
            size="xl"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={true}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex items-center gap-1 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 border border-blue-600 text-white">
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
                                    Vai trò
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <select className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 
                                    block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       {...register('role')}>
                                       <option value="guest">Khách</option>
                                       <option value="officer">Cán bộ. nhân viên</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Nhóm quyền
                                 </label>
                              </div>
                              <div className="sm:col-span-8 flex items-center mt-2.5">
                                 <select className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 
                                 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    disabled={user.role!==UserRoleConstant.SUPERADMIN}
                                    {...register('authorityGroup')}>
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
                           <Button type="submit"
                              className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                           focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              onPress={() => setAction('close')}>
                              Thêm và đóng
                           </Button>
                           <Button type="submit"
                              onPress={() => { setAction('continue') }}
                              className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Thêm và tiếp tục
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