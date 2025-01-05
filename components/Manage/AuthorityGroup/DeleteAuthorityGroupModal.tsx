'use client'
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
import { MdDelete } from "react-icons/md";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";

export const DeleteAuthorityGroupModal = ({ id, isDisabled }: { id: number | undefined, isDisabled: boolean}) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleDelete = async () => {
      try {
         const response = await apiServiceClient.delete(`/permission/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Nhóm quyền không tồn tại. Đang làm mới...`);
            onClose();
            router.refresh();
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
         <button
            onClick={onOpen}
            disabled={isDisabled}
            className="flex items-center justify-center px-2 py-1 gap-1 bg-red-400 hover:bg-red-500 text-white rounded-sm shadow-sm">
            <MdDelete size={20} /> Xóa
         </button>
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
                        <MdDelete size={24} /> Xóa nhóm quyền
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        <p>Không thể hoàn tác nếu tiếp tục thực hiện.</p>
                        <p>Bạn có chắc chắn muốn xóa?</p>
                     </ModalBody>
                     <Divider />
                     <ModalFooter>
                        <Button color="danger" className="rounded-md text-white border border-red-600 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-700" onPress={handleDelete}>
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