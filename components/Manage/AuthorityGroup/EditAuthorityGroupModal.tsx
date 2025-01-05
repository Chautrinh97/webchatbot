'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle } from "react-icons/tb";
import { AuthorityGroupSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MdEdit } from "react-icons/md";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";

type EditAuthorityGroupForm = z.TypeOf<typeof AuthorityGroupSchema>;
export const EditAuthorityGroupModal = ({ id, isDisabled }: { id: number | undefined, isDisabled: boolean }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      setError,
   } = useForm<EditAuthorityGroupForm>({
      resolver: zodResolver(AuthorityGroupSchema),
   });

   const fetchAuthorityGroup = async () => {
      try {
         const response = await apiServiceClient.get(`/permission/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Nhóm quyền không tồn tại. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         }

         const result = await response.json();
         setValue('name', result.name);
         setValue('description', result.description);
         onOpen();
      } catch (error) {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   const handleOpenModal = () => {
      fetchAuthorityGroup();
      onOpen();
   }

   const onSubmit: SubmitHandler<EditAuthorityGroupForm> = async (data) => {
      try {
         const response = await apiServiceClient.put(`/permission/${id}`, data);
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: 'Tên nhóm quyền đã tồn tại. Vui lòng dùng tên khác' });
            return;
         }

         successToast('Cập nhật thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         onClose();
         return;
      }
   }

   return (
      <>
         <button
            onClick={handleOpenModal}
            disabled={isDisabled}
            className="flex items-center justify-center px-2 py-1 gap-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-sm shadow-sm">
            <MdEdit size={20} />Sửa
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
                        <ModalHeader className="flex items-center gap-1 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 text-white">
                           <MdEdit size={24} />Cập nhật nhóm quyền
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                           <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 my-2">
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Tên nhóm quyền
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("name")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập tên nhóm quyền `} />
                                 </div>
                                 {errors.name?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.name?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Mô tả
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <textarea
                                       {...register("description")}
                                       rows={3}
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Thêm mô tả...`} />
                                 </div>
                                 {errors.description?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.description?.message}
                                    </div>
                                 }
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