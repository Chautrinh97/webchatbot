'use client';
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
import { TiDocumentDelete } from "react-icons/ti";
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
import { apiService, apiServiceClient } from "@/app/apiService/apiService";
import { ST } from "next/dist/shared/lib/utils";

export const DeleteDocumentModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleDelete = async () => {
      try {
         const response = await apiServiceClient.delete(`/document/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Văn bản không tòn tại. Đang làm mới...`);
         } else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Văn bản đang được xử lý trong một tiến trình khác. Vui lòng thử lại sau');
         } else {
            successToast('Xóa thành công');
         }
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
                     <ModalHeader className="flex items-center gap-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white">
                        <TiDocumentDelete size={24} /> Xóa văn bản
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        <p>Hành động này không thể hoàn tác.</p>
                        <p>Bạn có chắc chắn muốn xóa?</p>
                     </ModalBody>
                     <Divider />
                     <ModalFooter>
                        <Button color="danger" className="rounded-md text-red-500 font-bold" variant="light" onPress={handleDelete}>
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