'use client';
import { apiServiceClient } from "@/app/apiService/apiService";
import { useUserStore } from "@/app/store/user.store";
import { SyncStatus, UserPermissionConstant } from "@/utils/constant";
import { basicToast, errorToast, successToast } from "@/utils/toast";
import {
   Button,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   useDisclosure,
   Tooltip,
} from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VscSync, VscSyncIgnored } from "react-icons/vsc";

export const SyncActionButton = ({ id, syncStatus }: { id: number, syncStatus: string }) => {
   const router = useRouter();
   const { isOpen, onClose, onOpen } = useDisclosure();
   const [action, setAction] = useState<string>("");
   const handleOpenModal = (action: string) => {
      setAction(action);
      onOpen();
   }
   const handleUnsync = async () => {
      try {
         const response = await apiServiceClient.post(`/document/unsync/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Văn bản không tồn tại. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Văn bản đang trong tiến trình khác. Vui lòng đợi');
            onClose();
            return;
         } else if (response.status === StatusCodes.FORBIDDEN) {
            errorToast('Văn bản đã được hủy đồng bộ trước đây. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         }
         onClose();
         successToast('Văn bản đã được hủy đồng bộ.');
         router.refresh();
      } catch {
         errorToast("Có lỗi xảy ra. Vui lòng thử lại sau");
         onClose();
         return;
      }
   }

   const handleResync = async () => {
      try {
         const response = await apiServiceClient.post(`/document/resync/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Văn bản không tồn tại. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.FORBIDDEN) {
            errorToast('Văn bản đang trong tình trạng: Hết hiệu lực. Không thể đồng bộ');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Văn bản đang trong tiến trình khác. Vui lòng đợi');
            onClose();
            router.refresh();
            return;
         }
         onClose();
         basicToast("Văn bản đang được đồng bộ. Vui lòng đợi");
         router.refresh();
         return;
      } catch {
         errorToast("Có lỗi xảy ra. Vui lòng thử lại sau");
         onClose();
         return;
      }
   }

   const handleSync = async () => {
      try {
         const response = await apiServiceClient.post(`/document/sync/${id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Văn bản không tồn tại. Đang làm mới...');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.FORBIDDEN) {
            errorToast('Văn bản đang trong tình trạng: Hết hiệu lực. Không thể đồng bộ');
            onClose();
            router.refresh();
            return;
         } else if (response.status === StatusCodes.CONFLICT) {
            errorToast('Văn bản đang trong tiến trình khác. Vui lòng đợi');
            onClose();
            router.refresh();
            return;
         }
         onClose();
         basicToast("Văn bản đang được đồng bộ. Vui lòng đợi");
         router.refresh();
         return;
      } catch {
         errorToast("Có lỗi xảy ra. Vui lòng thử lại sau");
         onClose();
         return;
      }
   }

   return (
      <>
         {syncStatus === SyncStatus.NOT_SYNC &&
            <Tooltip content='Đồng bộ' showArrow={true} placement={"left"}>
               <button
                  onClick={() => handleOpenModal('sync')}
                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border 
                     border-transparent text-green-400 hover:text-green-700 disabled:opacity-50 disabled:pointer-events-none 
                     dark:text-green-700 dark:hover:text-green-500 hover:animate-bounceupdown">
                  <VscSync size={20} />
               </button>
            </Tooltip>
         }
         {syncStatus === SyncStatus.PENDING_SYNC &&
            <button
               onClick={() => handleOpenModal('sync')}
               disabled
               className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border 
            border-transparent text-green-300 disabled:opacity-50 disabled:pointer-events-none 
            dark:text-green-800 hover:animate-bounceupdown cursor-not-allowed">
               <VscSync size={20} />
            </button>
         }
         {syncStatus === SyncStatus.FAILED_RESYNC &&
            <>
               <Tooltip content='Đồng bộ lại' showArrow={true} placement={"left"}>
                  <button
                     onClick={() => handleOpenModal('resync')}
                     className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border 
                     border-transparent text-green-300 hover:text-green-600 disabled:opacity-50 disabled:pointer-events-none 
                     dark:text-green-700 dark:hover:text-green-500 hover:animate-bounceupdown">
                     <VscSync size={20} />
                  </button>
               </Tooltip>
               <Tooltip content='Hủy đồng bộ' showArrow={true} placement={"left"} color={"danger"}>
                  <button
                     onClick={() => handleOpenModal('unsync')}
                     className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg 
                  border border-transparent text-red-400 hover:text-red-600 disabled:opacity-50 disabled:pointer-events-none 
                  dark:text-red-700 dark:hover:text-red-500 hover:animate-bounceupdown">
                     <VscSyncIgnored size={20} />
                  </button>
               </Tooltip>
            </>
         }
         {syncStatus === SyncStatus.SYNC &&
            <>
               <Tooltip content='Hủy đồng bộ' showArrow={true} placement={"left"} color={"danger"}>
                  <button
                     onClick={() => handleOpenModal('unsync')}
                     className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg 
                     border border-transparent text-red-400 hover:text-red-600 disabled:opacity-50 disabled:pointer-events-none 
                     dark:text-red-700 dark:hover:text-red-500 hover:animate-bounceupdown">
                     <VscSyncIgnored size={20} />
                  </button>
               </Tooltip>
               <Tooltip content='Đồng bộ lại' showArrow={true} placement={"left"}>
                  <button
                     onClick={() => handleOpenModal('resync')}
                     className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border 
                     border-transparent text-green-300 hover:text-green-600 disabled:opacity-50 disabled:pointer-events-none 
                     dark:text-green-700 dark:hover:text-green-500 hover:animate-bounceupdown">
                     <VscSync size={20} />
                  </button>
               </Tooltip>
            </>
         }
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
                     <ModalHeader
                        className={`flex items-center gap-1 ${action !== 'unsync' ?
                           "bg-gradient-to-r from-green-600 via-green-500 to-green-600" :
                           "bg-gradient-to-r from-red-500 via-red-600 to-red-500"} text-white`}>
                        {action === 'sync' ? (
                           <><VscSync size={24} /> Đồng bộ  </>
                        ) : action === 'unsync' ? (
                           <><VscSyncIgnored size={24} /> Hủy đồng bộ </>
                        ) : (
                           <><><VscSync size={24} /> Đồng bộ lại </></>
                        )}
                     </ModalHeader>
                     <Divider />
                     <ModalBody className="text-center">
                        {action === 'sync' ? (
                           <><p>Đồng bộ văn bản vào dữ liệu truy vấn.</p><p>Bạn có muốn tiếp tục?</p></>
                        ) : action === 'unsync' ? (
                           <><p>Hủy đồng bộ văn bản khỏi dữ liệu truy vấn.</p><p>Bạn có muốn tiếp tục?</p></>
                        ) : (
                           <><p>Đồng bộ lại văn bản trong dữ liệu truy vấn.</p><p>Bạn có muốn tiếp tục?</p></>
                        )}
                     </ModalBody>
                     <Divider />
                     <ModalFooter>
                        {action === 'sync' ? (
                           <Button className="rounded-md text-white bg-green-600 border-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800"
                              onPress={handleSync}>
                              Tiếp tục
                           </Button>
                        ) : action === "unsync" ? (
                           < Button color="danger" className="rounded-md text-red-500 font-bold" variant="light"
                              onPress={handleUnsync}>
                              Tiếp tục
                           </Button>
                        ) : (
                           <Button className="rounded-md text-white bg-green-600 border-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800"
                              onPress={handleResync}>
                              Tiếp tục
                           </Button>
                        )}
                        < Button color="default" className="rounded-md" variant="light" onPress={onClose}>
                           Không
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal >
      </>
   );
}