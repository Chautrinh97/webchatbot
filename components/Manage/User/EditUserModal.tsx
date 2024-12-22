'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbEdit } from "react-icons/tb";
import { TbUserEdit } from "react-icons/tb";
import { EditUserSchemaUnverified, EditUserSchemaVerified } from "@/types/validation";
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
   Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthorityGroup } from "@/types/manage";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";
import { useUserStore } from "@/app/store/user.store";

export type EditVerifiedUserForm = z.TypeOf<typeof EditUserSchemaVerified>;
export type EditUnverifiedUserUserForm = z.TypeOf<typeof EditUserSchemaUnverified>;
export const EditUserModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const modalVerified = useDisclosure();
   const modalUnverified = useDisclosure();
   const [authorityGroups, setAuthorityGroups] = useState<AuthorityGroup[]>([]);
   const [isVerified, setIsVerified] = useState<boolean>(false);
   const { user } = useUserStore(); 

   const {
      register: registerVerified,
      handleSubmit: handleSubmitVerified,
      setValue: setValueVerfied,
      formState: { errors: errorVerified },
      setError: setErrorVerified,
   } = useForm<EditVerifiedUserForm>({
      resolver: zodResolver(EditUserSchemaVerified),
   });

   const {
      register: registerUnverified,
      handleSubmit: handleSubmitUnverified,
      setValue: setValueUnverified,
      formState: { errors: errorUnverified },
      setError: setErrorUnverified,
   } = useForm<EditUnverifiedUserUserForm>({
      resolver: zodResolver(EditUserSchemaUnverified),
   });

   const fetchAuthorityGroups = async () => {
      const response = await apiServiceClient.get('/permission');
      const result = (await response.json()).data;
      setAuthorityGroups(result);
   }

   const fetchUser = async () => {
      const response = await apiServiceClient.get(`/user/${id}`);
      if (response.status === StatusCodes.NOT_FOUND) {
         errorToast(`Không tồn tại người dùng này`);
         router.refresh();
         return;
      } else if (response.status === StatusCodes.FORBIDDEN) {
         errorToast('Bạn không được phép cập nhật người dùng này');
         return;
      }
      const result = await response.json();
      setIsVerified(result.isVerified);
      if (result.isVerified) {
         setValueVerfied('fullName', result.fullName);
         setValueVerfied('email', result.email);
         setValueVerfied('authorityGroup', result.authorityGroup?.id);
         modalVerified.onOpen();
      } else {
         setValueUnverified('fullName', result.fullName);
         setValueUnverified('email', result.email);
         setValueUnverified('authorityGroup', result.authorityGroup?.id);
         modalUnverified.onOpen();
      }
   }

   const onSubmitUnverified: SubmitHandler<EditUnverifiedUserUserForm> = async (data) => {
      try {
         const response = await apiServiceClient.put(`/user/${id}`, data);
         if (response.status === StatusCodes.CONFLICT) {
            setErrorUnverified('email', { message: 'Email đã tồn tại, nhập email khác' });
            return;
         }
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Có dữ liệu không tồn tại. Đang làm mới...');
            modalUnverified.onClose();
            router.refresh();
            return;
         }
         if (response.status === StatusCodes.FORBIDDEN) {
            const message = (await response.json()).message;
            if (message === 'VERIFIED_USER') {
               errorToastUp('Tài khoản này đã xác minh email. Đang làm mới...');
               modalUnverified.onClose();
               router.refresh();
               return;
            } else if (message === 'NOT_ALLOW_SET_AUTHORITY')
               errorToast('Chỉ có quản trị viên mới được phép đặt nhóm quyền');
            else if (message === "GUESS_ACCOUNT")
               errorToast('Không thể đặt nhóm quyền cho người dùng Khách');
            return;
         }
         successToast('Cập nhật thành công');
         modalUnverified.onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   const onSubmitVerified: SubmitHandler<EditVerifiedUserForm> = async (data) => {
      try {
         const response = await apiServiceClient.put(`/user/${id}`, data);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Có dữ liệu không tồn tại. Đang làm mới...');
            modalVerified.onClose();
            router.refresh();
            return;
         }
         if (response.status === StatusCodes.FORBIDDEN) {
            const message = (await response.json()).message;
            if (message === 'NOT_ALLOW_SET_AUTHORITY')
               errorToast('Chỉ có quản trị viên mới được phép đặt nhóm quyền');
            else if (message === "GUESS_ACCOUNT")
               errorToast('Không thể đặt nhóm quyền cho người dùng Khách');
            return;
         }
         successToast('Cập nhật thành công.');
         modalVerified.onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   const handleOpenModal = async () => {
      try {
         fetchAuthorityGroups();
         fetchUser();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <>
         <Tooltip content='Cập nhật' placement={'left'}>
            <button
               onClick={handleOpenModal}
               title="Cập nhật"
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg 
            border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none 
            dark:text-blue-500 dark:hover:text-blue-400 hover:animate-bounceupdown">
               <TbEdit size={20} />
            </button>
         </Tooltip>
         <Modal
            backdrop="blur"
            size="xl"
            isOpen={modalUnverified.isOpen}
            onClose={modalUnverified.onClose}
            hideCloseButton={true}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <form onSubmit={handleSubmitUnverified(onSubmitUnverified)}>
                        <ModalHeader className="flex items-center gap-2 bg-blue-600 text-white">
                           <TbUserEdit size={24} /> Cập nhật người dùng
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
                                       {...registerUnverified("fullName")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập tên người dùng `} />
                                 </div>
                                 {errorUnverified.fullName?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errorUnverified.fullName?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Địa chỉ email
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...registerUnverified("email")}
                                       type="text"
                                       readOnly={isVerified}
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập địa chỉ email `} />
                                 </div>
                                 {errorUnverified.email?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errorUnverified.email?.message}
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
                                       {...registerUnverified("password")}
                                       type="password"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập mật khẩu mới `} />
                                 </div>
                                 {errorUnverified.password?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errorUnverified.password?.message}
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
                                       {...registerUnverified('role')}>
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
                                 <select className="w-full" {...registerUnverified('authorityGroup')}>
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
         <Modal
            backdrop="blur"
            size="xl"
            isOpen={modalVerified.isOpen}
            onClose={modalVerified.onClose}
            hideCloseButton={true}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <form onSubmit={handleSubmitVerified(onSubmitVerified)}>
                        <ModalHeader className="flex items-center gap-2 bg-blue-600 text-white">
                           <TbUserEdit size={24} /> Cập nhật người dùng
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
                                       {...registerVerified("fullName")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập tên người dùng `} />
                                 </div>
                                 {errorVerified.fullName?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errorVerified.fullName?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Địa chỉ email
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...registerVerified("email")}
                                       type="text"
                                       readOnly={isVerified}
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập địa chỉ email `} />
                                 </div>
                                 {errorVerified.email?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errorVerified.email?.message}
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
                                       {...registerVerified('role')}>
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
                                 <select className="w-full" {...registerVerified('authorityGroup')}>
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