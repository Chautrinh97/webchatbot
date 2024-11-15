import { displayPermission, PermissionLevelEnum } from "@/types/chat";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbPlus } from "react-icons/tb";
import { AddPositionFormSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
   DropdownTrigger,
   Dropdown,
   DropdownItem,
   DropdownMenu,
} from "@nextui-org/react";

type AddPositionForm = z.TypeOf<typeof AddPositionFormSchema>;
export const AddPositionModal = ({ refetchTrigger }: { refetchTrigger: () => void }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [selectedPermission, setSelectedPermission] = useState<string>('Chọn phân quyền...');
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      setError,
   } = useForm<AddPositionForm>({
      resolver: zodResolver(AddPositionFormSchema),
   });
   const handleSelectPermission = (permissionLevel: string) => {
      setValue('permissionLevel', permissionLevel);
      setSelectedPermission(displayPermission(permissionLevel));
   }

   const onSubmit: SubmitHandler<AddPositionForm> = async (data) => {
      try {
         const response = await axiosInstance.post('/position', JSON.stringify(data), {
            withCredentials: true,
         });
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: 'Tên chức danh đã tồn tại, hãy dùng tên khác.' });
            return;
         }
         successToast('Thêm thành công.');
         onClose();
         refetchTrigger();
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }

   return (
      <>
         <Button className="flex gap-2 p-3 rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onPress={onOpen}>
            <TbPlus size={20} />
            Thêm chức danh
         </Button>
         <Modal
            size="xl"
            isOpen={isOpen}
            onClose={onClose}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Thêm chức danh mới</ModalHeader>
                     <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                           <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 my-2">
                              <div className="sm:col-span-4">
                                 <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Tên chức danh
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                    <input
                                       {...register("name")}
                                       type="text"
                                       className="py-2 px-3 pe-11 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                       placeholder="Điền tên chức danh" />
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
                              <div className="sm:col-span-4">
                                 <label htmlFor="description" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                    Phân quyền
                                 </label>
                              </div>
                              <div className="sm:col-span-8">
                                 <div className="inline-flex w-full rounded-md">
                                    <Dropdown>
                                       <DropdownTrigger>
                                          <Button
                                             className="py-2 px-2 w-full inline-flex items-center gap-x-2 text-sm font-sm rounded-md bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-[#212121] dark:text-white dark:hover:bg-neutral-700"
                                          >
                                             {selectedPermission}
                                          </Button>
                                       </DropdownTrigger>
                                       <DropdownMenu className="min-w-40 bg-white shadow-lg rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700">
                                          <DropdownItem
                                             className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                             onClick={() => handleSelectPermission(PermissionLevelEnum.Full)}>Quản lý file toàn bộ</DropdownItem>
                                          <DropdownItem
                                             className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                             onClick={() => handleSelectPermission(PermissionLevelEnum.DAAS)}>Quản lý file phòng ban và phòng ban con</DropdownItem>
                                          <DropdownItem
                                             className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                                             onClick={() => handleSelectPermission(PermissionLevelEnum.Only)}>Quyền quản lý file chỉ phòng ban</DropdownItem>
                                       </DropdownMenu>
                                    </Dropdown>
                                 </div>
                                 {errors.permissionLevel?.message &&
                                    <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                       <TbAlertCircle className="me-1" /> {errors.permissionLevel?.message}
                                    </div>
                                 }
                              </div>
                           </div>
                           <div className="flex mt-4 justify-center">
                              <button type="submit" className="py-3 w-40 text-center text-sm font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                 Tiếp tục
                              </button>
                           </div>
                        </form>
                     </ModalBody>
                     <ModalFooter>
                        <Button color="danger" className="rounded-md" variant="light" onPress={onClose}>
                           Đóng
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
}