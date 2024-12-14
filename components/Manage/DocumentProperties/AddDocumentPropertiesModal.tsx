'use client';
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbPlus } from "react-icons/tb";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DocumentPropertiesSchema } from "@/types/validation";
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
import { useUserStore } from "@/app/store/user.store";
import { UserRoleConstant } from "@/utils/constant";

type AddDocumentPropertiesForm = z.TypeOf<typeof DocumentPropertiesSchema>;
export const AddDocumentPropertiesModal = (
   { propertyText, propertyApiURI, propertyPermission }:
      { propertyText: string, propertyApiURI: string, propertyPermission: string }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<AddDocumentPropertiesForm>({
      resolver: zodResolver(DocumentPropertiesSchema),
   });
   const { user } = useUserStore();
   const hasPermission = user.permissions?.some((permission) => permission === propertyPermission);

   const onSubmit: SubmitHandler<AddDocumentPropertiesForm> = async (data) => {
      try {
         const response = await axiosInstance.post(`${propertyApiURI}`, JSON.stringify(data), {
            withCredentials: true,
         });
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: `Tên ${propertyText} đã tồn tại, hãy dùng tên khác.` });
            return;
         }
         else if (response.status === StatusCodes.FORBIDDEN) {
            errorToast('Bạn không có quyền thực hiện   này.');
            return;
         }
         successToast('Thêm thành công.');
         onClose();
         router.refresh();
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }

   return (
      <>
         {(user.role === UserRoleConstant.SUPERADMIN || hasPermission) &&
            <Button className="flex gap-2 p-3 rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
               onPress={onOpen}>
               <TbPlus size={20} />
               Thêm {propertyText}
            </Button>
         }
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
                           <IoIosAddCircleOutline size={24} /> Thêm {propertyText} mới
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                           <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 my-2">
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Tên {propertyText}
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("name")}
                                       type="text"
                                       className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder={`Nhập tên ${propertyText}`} />
                                 </div>
                                 {errors.name?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.name?.message}
                                    </div>
                                 }
                              </div>
                              <div className="sm:col-span-4">
                                 <label htmlFor="description" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Mô tả
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <textarea
                                       {...register("description")}
                                       className="py-2 px-3 block w-full bg-gray-100 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       rows={4}
                                       placeholder="Thêm mô tả..."></textarea>
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