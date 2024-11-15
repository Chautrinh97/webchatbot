import { displayPermission, PermissionLevelEnum } from "@/types/chat";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbEdit, TbPlus } from "react-icons/tb";
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
export const EditPositionModal = ({ positionId, refetchTrigger }: { positionId: string, refetchTrigger: () => void }) => {
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
         const response = await axiosInstance.patch(
            `/position/${positionId}`,
            JSON.stringify(data),
            {
               withCredentials: true,
            });
         if (response.status === StatusCodes.CONFLICT) {
            setError('name', { message: 'Tên chức danh đã tồn tại, hãy dùng tên khác.' });
            return;
         }
         else if (response.status === StatusCodes.BAD_REQUEST) {
            setError('permissionLevel', {message: 'Tồn tại người dùng với chức danh này không thuộc phòng ban nào.'});
            return;
         }
         successToast('Cập nhật thành công.');
         onClose();
         refetchTrigger();
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
   }
   const fetchPostion = async () => {
      try {
         const response = await axiosInstance.get(`position/${positionId}`, {
            withCredentials: true,
         });

         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Không tồn tại chức danh này.');
            refetchTrigger();
            return;
         }
         setValue('name', response.data.name);
         setValue('description', response.data.description);
         setValue('permissionLevel', response.data.permissionLevel);
         setSelectedPermission(displayPermission(response.data.permissionLevel));
         onOpen();
      } catch {
         errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
         return;
      }
   }

   return (
      <>
         <button
            onClick={fetchPostion}
            title="Cập nhật"
            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">
            <TbEdit size={20} />
         </button>
         <Modal
            size="xl"
            isOpen={isOpen}
            onClose={onClose}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Chỉnh sửa chức danh</ModalHeader>
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