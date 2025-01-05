'use client'
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
import { TbTrash } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { HiOutlineUserRemove } from "react-icons/hi";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";


export const DeleteUserModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const handleDelete = async () => {
      try {
         const response = await apiServiceClient.delete(`/user/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Không tồn tại người dùng này. Đang làm mới...`);
            onClose();
            router.refresh();
            return;
         }
         else if (response.status === StatusCodes.FORBIDDEN) {
            errorToastUp('Bạn không được phép xóa người dùng này');
            onClose();
            return;
         }
         successToast('Xóa thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }
   return (
      <>
         <Tooltip content='Xóa' placement={'left'} color={'danger'}>
            <button
               type="button"
               onClick={onOpen}
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent 
            text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none 
            dark:text-red-500 dark:hover:text-red-400 hover:animate-bounceupdown">
               <TbTrash size={20} />
            </button>
         </Tooltip>
         <Modal
            backdrop="blur"
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={true}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => (
                  <>
                     <ModalHeader className="flex items-center gap-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white">
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