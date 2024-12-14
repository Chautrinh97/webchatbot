'use client'
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
import { TbTrash } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { HiOutlineUserRemove } from "react-icons/hi";


export const DeleteUserModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const handleDelete = async () => {
      try {
         const response = await axiosInstance.delete(`/user/${id}`, {
            withCredentials: true,
         });
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Không tồn tại người dùng này, đang làm mới...`);
            onClose();
            router.refresh();
            return;
         }
         successToast('Xóa thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
         return;
      }
   }
   return (
      <>
         <button
            type="button"
            onClick={onOpen}
            title="Xóa"
            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400">
            <TbTrash size={20} />
         </button>
         <Modal
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <ModalHeader className="flex items-center gap-2 bg-red-600 text-white">
                        <HiOutlineUserRemove size={24} /> Xóa người dùng
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        <p>Không thể hoàn tác nếu tiếp tục thực hiện.</p>
                        <p>Bạn có chắc chắn muốn xóa?</p>
                     </ModalBody>
                     <Divider />
                     <ModalFooter>
                        <Button color="danger" className="rounded-md text-white border border-red-600 bg-red-700 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onPress={handleDelete}>
                           Có
                        </Button>
                        <Button color="default" className="rounded-md" variant="light" onPress={onClose}>
                           Không
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
}