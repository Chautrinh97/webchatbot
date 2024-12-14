'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbEdit } from "react-icons/tb";
import { TbUserEdit } from "react-icons/tb";
import { EditUserSchemaUnverified, EditUserSchemaVerified } from "@/types/validation";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthorityGroup } from "@/types/manage";

export type EditVerifiedUserForm = z.TypeOf<typeof EditUserSchemaVerified>;
export type EditUnverifiedUserUserForm = z.TypeOf<typeof EditUserSchemaUnverified>;
export const EditUserModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const modalVerified = useDisclosure();
   const modalUnverified = useDisclosure();
   const [authorityGroups, setAuthorityGroups] = useState<AuthorityGroup[]>([]);
   const [isVerified, setIsVerified] = useState<boolean>(false);

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
      const response = await axiosInstance.get('/permission', { withCredentials: true });
      const result = response.data.data;
      setAuthorityGroups(result);
   }

   const fetchUser = async () => {
      const response = await axiosInstance.get(`/user/${id}`, { withCredentials: true });
      if (response.status === StatusCodes.NOT_FOUND) {
         errorToast(`Không tồn tại người dùng này.`);
         router.refresh();
         return;
      }
      setIsVerified(response.data.isVerified);
      if (response.data.isVerified) {
         setValueVerfied('fullName', response.data.fullName);
         setValueVerfied('email', response.data.email);
         setValueVerfied('authorityGroup', response.data.authorityGroup?.id);
         modalVerified.onOpen();
      } else {
         setValueUnverified('fullName', response.data.fullName);
         setValueUnverified('email', response.data.email);
         setValueUnverified('authorityGroup', response.data.authorityGroup?.id);
         modalUnverified.onOpen();
      }
   }

   const onSubmitUnverified: SubmitHandler<EditUnverifiedUserUserForm> = async (data) => {
      try {
         const response = await axiosInstance.put(`/user/${id}`, JSON.stringify(data), {
            withCredentials: true,
         });
         if (response.status === StatusCodes.CONFLICT) {
            setErrorUnverified('email', { message: `Email đã tồn tại, hãy nhập email khác.` });
            return;
         }
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Dữ liệu không tồn tại trên hệ thống, đang làm mới...');
            modalUnverified.onClose();
            router.refresh();
            return;
         }
         successToast('Cập nhật thành công.');
         modalUnverified.onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
         return;
      }
   }

   const onSubmitVerified: SubmitHandler<EditVerifiedUserForm> = async (data) => {
      try {
         const response = await axiosInstance.put(`/user/${id}`, JSON.stringify(data), {
            withCredentials: true,
         });
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Dữ liệu không tồn tại trên hệ thống, đang làm mới...');
            modalVerified.onClose();
            router.refresh();
            return;
         }
         successToast('Cập nhật thành công.');
         modalVerified.onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
         return;
      }
   }

   const handleOpenModal = async () => {
      try {
         fetchAuthorityGroups();
         fetchUser();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
         return;
      }
   }

   return (
      <>
         <button
            onClick={handleOpenModal}
            title="Cập nhật"
            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">
            <TbEdit size={20} />
         </button>
         <Modal
            size="xl"
            isOpen={modalUnverified.isOpen}
            onClose={modalUnverified.onClose}
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
            size="xl"
            isOpen={modalVerified.isOpen}
            onClose={modalVerified.onClose}
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