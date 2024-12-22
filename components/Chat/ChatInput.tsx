'use client'
import { useAppStore } from '@/app/store/app.store';
import { Message } from '@/types/chat';
import { errorToastShort } from '@/utils/toast';
import {
   KeyboardEvent,
   MutableRefObject,
   useEffect,
   useState,
} from 'react';
import {
   TbArrowDown,
   TbBolt,
   TbPlayerStop,
   TbRepeat,
   TbSend2,
} from 'react-icons/tb';



interface Props {
   onSend: (message: Message) => void;
   onRegenerate: () => void;
   onScrollDownClick: () => void;
   stopConversationRef: MutableRefObject<boolean>;
   textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
   showScrollDownButton: boolean;
}

export const ChatInput = ({
   onSend,
   onRegenerate,
   onScrollDownClick,
   stopConversationRef,
   textareaRef,
   showScrollDownButton,
}: Props) => {
   const {
      state: { messageIsStreaming, selectedConversation },
   } = useAppStore();

   const [content, setContent] = useState<string>();
   const [isTyping, setIsTyping] = useState<boolean>(false);

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);
   };

   const handleSend = () => {
      if (messageIsStreaming) {
         return;
      }
      if (!content) {
         return;
      }
      if (content.length > 300) {
         errorToastShort("Câu hỏi vượt quá độ dài cho phép.")
         return;
      }
      onSend({ role: 'user', content: content.trim() });
      setContent('');

      if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
         textareaRef.current.blur();
      }
   };

   const handleStopConversation = () => {
      stopConversationRef.current = true;
      setTimeout(() => {
         stopConversationRef.current = false;
      }, 1000);
   };

   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      } else if (e.key === '/' && e.metaKey) {
         e.preventDefault();
      }
   };

   useEffect(() => {
      if (textareaRef && textareaRef.current) {
         textareaRef.current.style.height = 'inherit';
         textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
         textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 200 ? 'auto' : 'hidden'
            }`;
      }
   }, [content, textareaRef]);

   return (
      <div className="absolute bottom-0 left-0 border-transparent w-full pt-6 md:pt-2 bg-gradient-to-b from-transparent via-white to-white dark:via-[#212121] dark:to-[#212121] dark:border-white/20">
         <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
            {messageIsStreaming && (
               <button
                  className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 py-2 px-4 rounded border border-neutral-200 md:mb-0 md:mt-2"
                  onClick={handleStopConversation}
               >
                  <TbPlayerStop size={16} /> Dừng trả lời
               </button>
            )}

            {!messageIsStreaming && selectedConversation && selectedConversation.messages.length > 0 && (
               <button
                  className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 md:mb-0 md:mt-2 py-2 px-4 rounded 
                  border border-neutral-300 transition-all ease-in-out duration-150 bg-white text-black opacity-90 
                  hover:opacity-100 dark:border-neutral-600 dark:bg-[#2f2f2f] dark:text-white 
                  hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  onClick={onRegenerate}
               >
                  <TbRepeat size={18} /> Làm mới câu trả lời
               </button>
            )}

            <div className="relative mx-2 flex w-full grow flex-col rounded-[25px] border border-black/10 bg-white dark:border-gray-900/50 dark:bg-[#2F2F2F] dark:text-white sm:mx-4 shadow-md dark:border-gray-900/50">
               <div
                  className="absolute left-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
               >
                  <TbBolt size={21} />
               </div>
               <textarea
                  ref={textareaRef}
                  disabled={messageIsStreaming}
                  className="m-0 w-full resize-none rounded-[25px] min-h-10 focus:outline-none border-0 p-0 py-2 pr-8 pl-10 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-10"
                  style={{
                     bottom: `${textareaRef?.current?.scrollHeight}px`,
                     maxHeight: '200px',
                     overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 200
                        ? 'auto'
                        : 'hidden'
                        }`,
                  }}
                  placeholder={
                     'Nhập một câu hỏi...'
                  }
                  value={content}
                  rows={1}
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
               />

               <button
                  className={`absolute right-2 top-2 rounded-full p-1 text-white dark:text-black ${content ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  onClick={handleSend}
                  title='Gửi'
               >
                  {messageIsStreaming ? (
                     <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
                  ) : (
                     <TbSend2 size={20} />
                  )}
               </button>

               {showScrollDownButton && (
                  <div className="absolute bottom-2 -right-10">
                     <button
                        className="flex h-7 w-7 animate-bounce  items-center justify-center rounded-full bg-neutral-300 text-neutral-800 shadow-lg focus:outline-none dark:bg-neutral-500 dark:text-neutral-200"
                        onClick={onScrollDownClick}
                     >
                        <TbArrowDown size={19} />
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
