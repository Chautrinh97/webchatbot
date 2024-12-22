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
import { MdAdd } from "react-icons/md";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";

type AddAuthorityGroupForm = z.TypeOf<typeof AuthorityGroupSchema>;
export const AddAuthorityGroupModal = () => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<AddAuthorityGroupForm>({
      resolver: zodResolver(AuthorityGroupSchema),
   });

   const onSubmit: SubmitHandler<AddAuthorityGroupForm> = async (data) => {
      try {
         const response = await apiServiceClient.post(`/permission/`, data);
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: 'Tên nhóm quyền đã tồn tại. Vui lòng dùng tên khác.' });
            return;
         }
         successToast('Thêm thành công.');
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
            onClick={onOpen}
            className="flex items-center justify-center px-2 py-1 gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-sm shadow-sm">
            <MdAdd size={20} /> Thêm nhóm
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
                        <ModalHeader className="flex items-center gap-1 bg-blue-600 text-white">
                           <MdAdd size={24} />Thêm nhóm quyền mới
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