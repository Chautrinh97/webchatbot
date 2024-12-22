'use client';
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbEdit } from "react-icons/tb";
import { DocumentPropertiesSchema } from "@/types/validation";
import { MdOutlineEdit } from "react-icons/md";
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
   Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";

type EditDocumentPropertiesForm = z.TypeOf<typeof DocumentPropertiesSchema>;
export const EditDocumentPropertiesModal = (
   { id, propertyAPIURI, propertyText }:
      { id: number, propertyAPIURI: string, propertyText: string }
) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      setError,
   } = useForm<EditDocumentPropertiesForm>({
      resolver: zodResolver(DocumentPropertiesSchema),
   });

   const onSubmit: SubmitHandler<EditDocumentPropertiesForm> = async (data) => {
      try {
         const response = await apiServiceClient.put(`${propertyAPIURI}/${id}`, data);
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: `Tên ${propertyText} đã tồn tại, hãy dùng tên khác.` });
            return;
         }
         successToast('Cập nhật thành công.');
         onClose();
         router.refresh();
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
   }
   const fetchProperty = async () => {
      try {
         const response = await apiServiceClient.get(`${propertyAPIURI}/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Không tồn tại ${propertyText} này.`);
            router.refresh();
            return;
         }
         const result = await response.json();
         setValue('name', result.name);
         setValue('description', result.description);
         onOpen();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <>
         <Tooltip content="Cập nhật" placement={'left'}>
            <button
               onClick={fetchProperty}
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent 
            text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none 
            dark:text-blue-500 dark:hover:text-blue-400 hover:animate-bounceupdown">
               <TbEdit size={20} />
            </button>
         </Tooltip>
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
                        <ModalHeader className="flex gap-1">
                           <MdOutlineEdit size={24} /> Cập nhật {propertyText}
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