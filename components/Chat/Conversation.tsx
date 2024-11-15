import {
   TbCheck,
   TbMessage,
   TbPencil,
   TbTrash,
} from 'react-icons/tb';
import { HiXMark } from 'react-icons/hi2';
import {
   KeyboardEvent,
   MouseEventHandler,
   useEffect,
   useState,
} from 'react';

import { Conversation } from '@/types/chat';

import { useAppStore } from '@/app/store/app.store';
import { updateConversation } from '@/utils/conversation';
import { KeyValuePair } from 'tailwindcss/types/config';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

interface Props {
   conversation: Conversation;
}

export const ConversationComponent = ({ conversation }: Props) => {
   const {
      state: {
         selectedConversation,
         messageIsStreaming,
         conversations,
         searchTerm
      },
      dispatch
   } = useAppStore();

   const [isDeleting, setIsDeleting] = useState(false);
   const [isRenaming, setIsRenaming] = useState(false);
   const [renameValue, setRenameValue] = useState('');

   const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         selectedConversation && handleRename(selectedConversation);
      }
   };

   const handleUpdateConversation = (
      conversation: Conversation,
      data: KeyValuePair,
   ) => {
      const updatedConversation = {
         ...conversation,
         [data.key]: data.value,
      };

      const { single, all } = updateConversation(
         updatedConversation,
         conversations,
      );

      dispatch('selectedConversation', single);
      dispatch('conversations', all);
   };

   const handleRename = (conversation: Conversation) => {
      if (renameValue.trim().length > 0) {
         handleUpdateConversation(conversation, {
            key: 'title',
            value: renameValue,
         });
         setRenameValue('');
         setIsRenaming(false);
      }
   };

   const handleSelectConversation = (conversation: Conversation) => {
      dispatch('selectedConversation', conversation);
   };

   const handleDeleteConversation = (conversation: Conversation) => {
      const updatedConversations = conversations.filter(
         (c) => c.id !== conversation.id,
      );

      dispatch('conversations', updatedConversations);
      dispatch('searchTerm', '');

      if (updatedConversations.length > 0) {
         dispatch('selectedConversation', updatedConversations[updatedConversations.length - 1]);
      } else {
         dispatch(
            'selectedConversation',
            {
               id: uuidv4(),
               title: 'Hội thoại mới',
               messages: [],
            }
         );
         localStorage.removeItem('selectedConversation');
      }
   };

   const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      if (isDeleting) {
         handleDeleteConversation(conversation);
      } else if (isRenaming) {
         handleRename(conversation);
      }
      setIsDeleting(false);
      setIsRenaming(false);
   };

   const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      setIsDeleting(false);
      setIsRenaming(false);
   };

   const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      setIsRenaming(true);
      selectedConversation && setRenameValue(selectedConversation.title);
   };
   const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      setIsDeleting(true);
   };

   useEffect(() => {
      if (isRenaming) {
         setIsDeleting(false);
      } else if (isDeleting) {
         setIsRenaming(false);
      }
   }, [isRenaming, isDeleting]);

   return (
      <div className="relative flex items-center transition-all ease-in-out duration-150">
         {isRenaming && selectedConversation?.id === conversation.id ? (
            <div className="flex w-full items-center gap-3 rounded-lg dark:bg-neutral-800 p-3">
               <TbMessage size={18} />
               <input
                  className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 text-left text-[14px] leading-3 text-white outline-none focus:border-neutral-100"
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={handleEnterDown}
                  autoFocus
               />
            </div>
         ) : (
            <button
               className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm bg-[#F9F9F9] hover:bg-[#ECECEC] dark:bg-sb-black dark:hover:bg-neutral-800 transition-colors duration-200  ${messageIsStreaming ? 'disabled:cursor-not-allowed' : ''
                  } ${selectedConversation?.id === conversation.id
                     ? 'bg-[#2F2F2F]'
                     : ''
                  }`}
               onClick={() => handleSelectConversation(conversation)}
               onDoubleClick={handleOpenRenameModal}
               disabled={messageIsStreaming}
            >
               <TbMessage size={18} />
               <div
                  className={`relative max-h-6 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[14px] leading-3 ${selectedConversation?.id === conversation.id ? 'pr-12' : 'pr-1'
                     }`}
               >
                  {conversation.title}
               </div>
            </button>
         )}

         {(isDeleting || isRenaming) && selectedConversation?.id === conversation.id && (
            <div className="absolute right-1 z-10 flex text-gray-300">
               <button
                  className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                  onClick={handleConfirm}
               >
                  <TbCheck size={18} />
               </button>
               <button
                  className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                  onClick={handleCancel}
               >
                  <HiXMark size={18} />
               </button>
            </div>
         )}

         {selectedConversation?.id === conversation.id && !isDeleting && !isRenaming && (
            <div className="absolute right-1 z-10 flex text-gray-300">
               <button
                  className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-white"
                  onClick={handleOpenRenameModal}
               >
                  <TbPencil size={18} />
               </button>
               <button
                  className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-white"
                  onClick={handleOpenDeleteModal}
               >
                  <TbTrash size={18} />
               </button>
            </div>
         )}
      </div>
   );
};
