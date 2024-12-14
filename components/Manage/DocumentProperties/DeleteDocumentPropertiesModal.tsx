'use client';
import axiosInstance from "@/app/apiService/axios";
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
} from "@nextui-org/react";
import { TbTrash } from "react-icons/tb";
import { useRouter } from "next/navigation";

export const DeleteDocumentPropertiesModal = (
   { id, propertyAPIURI, propertyText }:
      { id: number, propertyAPIURI: string, propertyText: string }
) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleDelete = async () => {
      try {
         const response = await axiosInstance.delete(`${propertyAPIURI}/${id}`, {
            withCredentials: true,
         });
         if (response.status === StatusCodes.NOT_FOUND) {
            console.log(response.data);
            errorToast(`Không tồn tại ${propertyText} này.`);
         }
         else successToast('Xóa thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         onClose();
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
                     <ModalHeader className="flex items-center gap-1 bg-red-600 text-white">
                        <MdDeleteOutline size={24} />Xóa {propertyText}
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        <p>Khi xóa, các tài liệu thuộc {propertyText} này vẫn được giữ.</p>
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