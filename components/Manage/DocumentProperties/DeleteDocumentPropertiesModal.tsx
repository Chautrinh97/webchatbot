'use client';
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
import { MdDeleteOutline } from "react-icons/md";
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

export const DeleteDocumentPropertiesModal = (
   { id, propertyAPIURI, propertyText }:
      { id: number, propertyAPIURI: string, propertyText: string }
) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleDelete = async () => {
      try {
         const response = await apiServiceClient.delete(`${propertyAPIURI}/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast(`Không tồn tại ${propertyText} này. Đang làm mới...`);
         }
         else successToast('Xóa thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         onClose();
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   return (
      <>
         <Tooltip content="Xóa" placement={'left'} color={'danger'}>
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
                        <MdDeleteOutline size={24} />Xóa {propertyText}
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        <p>Khi xóa, các văn bản thuộc {propertyText} này vẫn được giữ.</p>
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