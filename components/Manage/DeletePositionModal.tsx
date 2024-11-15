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
} from "@nextui-org/react";
import { TbTrash } from "react-icons/tb";

export const DeletePositionModal = ({ positionId, refetchTrigger }: { positionId: string, refetchTrigger: () => void }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const handleDelete = async () => {
      try {
         const response = await axiosInstance.delete(`/position/${positionId}`, {
            withCredentials: true,
         });
         if (response.status === StatusCodes.NOT_FOUND) {
            console.log(response.data);
            errorToast('Không tồn tại chức danh này.');
         }
         else successToast('Xóa thành công.');
         onClose();
         refetchTrigger();
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
                     <ModalHeader className="flex flex-col gap-1 text-center text-red-500">Xóa chức danh</ModalHeader>
                     <ModalBody className="text-center">
                        <p>Khi xóa chức danh, người dùng với chức danh này không bị xóa theo.</p>
                        <p>Bạn có chắc chắn muốn xóa?</p>
                     </ModalBody>
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