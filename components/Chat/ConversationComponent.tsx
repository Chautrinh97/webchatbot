'use client';
import {
   TbMessage,
   TbPencil,
   TbTrash,
} from 'react-icons/tb';
import {
   KeyboardEvent,
   MouseEventHandler,
   useEffect,
   useRef,
   useState,
} from 'react';

import { ConversationItem } from '@/types/chat';

import { useAppStore } from '@/app/store/app.store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { apiServiceClient } from '@/app/apiService/apiService';
import { errorToast } from '@/utils/toast';
import { StatusCodes } from 'http-status-codes';

interface Props {
   conversation: ConversationItem;
   refetch: () => void;
}

export const ConversationComponent = ({ conversation, refetch }: Props) => {
   const {
      state: {
         messageIsStreaming,
         selectedConversation,
      },
   } = useAppStore();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const pathname = usePathname();
   const [isRenaming, setIsRenaming] = useState(false);
   const [renameValue, setRenameValue] = useState('');
   const inputRef = useRef<HTMLInputElement | null>(null);
   const router = useRouter();

   const isActive = (slug: string) => {
      const pathSlugUUID = pathname.split('/')[2];
      return pathSlugUUID === slug;
   }

   const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
         handleRename();
      } else if (e.key === 'Escape') {
         setIsRenaming(false);
      }
   };

   const handleRename = async () => {
      if (renameValue.trim().length === 0 || renameValue === conversation.title) {
         setIsRenaming(false);
         return;
      }
      try {
         const response = await apiServiceClient.put(`/conversation/${conversation.id}`,
            { title: renameValue },
         );
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Đoạn hôi thoại không tồn tại. Đang làm mới...');
            router.replace('/chat');
            return;
         }
         setIsRenaming(false);
         refetch();
         router.refresh();
         return;
      } catch {
         setIsRenaming(false);
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.')
         return;
      }
   };

   const handleDeleteConversation = async () => {
      try {
         const response = await apiServiceClient.delete(`/conversation/${conversation.id}`);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Đoạn hội thoại không tồn tại. Đang làm mới...');
         }
         onClose();
         refetch();
         if (isActive(conversation.slug)) {
            router.push('/chat');
         }
         else router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         onClose();
         return;
      }
   };

   const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
      setIsRenaming(true);
      setRenameValue(conversation.title);
   };
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setIsRenaming(false);
         }
      };
      if (isRenaming) {
         document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isRenaming]);

   return (
      <div className="relative flex items-center py-1 transition-all ease-in-out duration-150">
         {isRenaming ? (
            <div className={`flex w-full items-center gap-3 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 
               transition-colors duration-200 p-2 ${isActive(conversation.slug) ? 'bg-gray-300 dark:bg-neutral-700' : ''}`}>
               <TbMessage size={18} />
               <input
                  ref={inputRef}
                  className="h-6 mr-12 flex-1 rounded-sm overflow-hidden overflow-ellipsis border-neutral-400 text-left text-[14px] leading-3 text-black dark:text-white outline-none focus:border-neutral-100"
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={handleEnterDown}
                  autoFocus
               />
            </div>
         ) : (
            <Link
               className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm 
                  hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors duration-200  
                  ${messageIsStreaming ? 'disabled:cursor-not-allowed' : ''
                  } ${isActive(conversation.slug) ? 'bg-gray-300 dark:bg-neutral-700' : ''}`}
               href={`/chat/${conversation.slug}`}
               onClick={(e) => { if (messageIsStreaming) e.preventDefault(); }}
            >
               <TbMessage size={18} />
               <div className={`relative max-h-6 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[14px] leading-3
                      ${selectedConversation?.id === conversation.id ? 'pr-12' : 'pr-1'}`}>
                  {conversation.title}
               </div>
            </Link>
         )}

         {!isRenaming && (
            <div className="absolute right-1 z-10 flex text-gray-300">
               <Tooltip content="Đổi tên" placement='bottom'>
                  <button
                     className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-white"
                     onClick={handleOpenRenameModal} >
                     <TbPencil size={18} />
                  </button>
               </Tooltip>
               <Tooltip content="Xóa" placement='bottom' color='danger'>
                  <button
                     className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-white"
                     onClick={onOpen}>
                     <TbTrash size={18} />
                  </button>
               </Tooltip>
               <Modal isOpen={isOpen} size='sm' backdrop='blur' hideCloseButton={true} onClose={onClose}>
                  <ModalContent>
                     {(onClose) => (
                        <>
                           <ModalHeader className="flex items-center gap-1 bg-red-600 text-white">
                              <TbTrash size={20} /> Xóa đoạn hội thoại
                           </ModalHeader>
                           <Divider />
                           <ModalBody>
                              <p>
                                 Hành động này không thể hoàn tác
                              </p>
                              <p>
                                 Bạn có chắc chắn xóa đoạn hội thoại này
                              </p>
                           </ModalBody>
                           <Divider />
                           <ModalFooter>
                              <Button color="danger" className="rounded-md text-red-500 font-bold" variant="light"
                                 onPress={handleDeleteConversation}>
                                 Có
                              </Button>
                              <Button color="default" className="rounded-md" variant="light" onPress={onClose}>
                                 Đóng
                              </Button>
                           </ModalFooter>
                        </>
                     )}
                  </ModalContent>
               </Modal>
            </div>
         )}
      </div>
   );
};
