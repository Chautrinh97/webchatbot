'use client';
import {
   TbCheck,
   TbCopy,
   TbEdit,
   TbRobotFace,
} from 'react-icons/tb';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import { useAppStore } from '@/app/store/app.store';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHightlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm';

export interface Props {
   onSend: (message: Message) => void;
   message: Message;
}

export const ChatMessage: FC<Props> = memo(({ message, onSend }) => {
   // const {
   //    state: { selectedConversation },
   //    dispatch,
   // } = useAppStore();

   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [isTyping, setIsTyping] = useState<boolean>(false);
   const [messageContent, setMessageContent] = useState(message.content);
   const [messagedCopied, setMessageCopied] = useState(false);

   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const toggleEditing = () => {
      setIsEditing(!isEditing);
   };

   const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessageContent(event.target.value);
      if (textareaRef.current) {
         textareaRef.current.style.height = 'inherit';
         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
   };

   const handleEditMessage = () => {
      setIsEditing(false);
      onSend({ role: 'user', content: messageContent.trim() });
   };

   const copyOnClick = () => {
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(message.content).then(() => {
         setMessageCopied(true);
         setTimeout(() => {
            setMessageCopied(false);
         }, 3000);
      });
   };

   useEffect(() => {
      setMessageContent(message.content);
   }, [message.content]);


   useEffect(() => {
      if (textareaRef.current) {
         textareaRef.current.style.height = 'inherit';
         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
   }, [isEditing]);

   return message.role === "user" ?
      (
         <div className="w-full my-3">
            <div className="py-2 px-3 text-base md:px-4 m-auto lg:px-1 xl:px-5">
               <div className="mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
                  <div className="group relative flex w-full min-w-0 flex-col items-end rtl:items-start min-h-[20px] whitespace-pre-wrap break-words overflow-x-auto gap-2"
                     style={{ overflowWrap: 'anywhere' }}>
                     {!isEditing ? (
                        <div className="relative max-w-[90%] rounded-3xl px-5 py-2.5 bg-gray-200 text-black dark:bg-neutral-700 dark:text-white">
                           {message.content}
                           <div className="absolute bottom-0 right-full top-0 -mr-3.5 hidden pr-5 pt-1 group-hover:block">
                              <button
                                 className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
                                 onClick={toggleEditing}>
                                 <TbEdit />
                              </button>
                           </div>
                        </div>
                     ) : (
                        <div className="flex-col gap-1 md:gap-3 w-full">
                           <div className="flex grow flex-col max-w-full">
                              <div className="rounded-3xl px-3 py-2 bg-[#ECECEC] dark:bg-[#424242]">
                                 <textarea
                                    ref={textareaRef}
                                    className=" m-0 resize-none border-0 bg-[#ECECEC] dark:bg-[#424242] p-0 focus:outline-none overflow-y- w-full"
                                    value={messageContent}
                                    onChange={handleInputChange}
                                    // onKeyDown={handlePressEnter}
                                    onCompositionStart={() => setIsTyping(true)}
                                    onCompositionEnd={() => setIsTyping(false)}
                                 >
                                 </textarea>
                                 <div className="flex justify-end gap-2">
                                    <button
                                       className="h-9 w-20 rounded-full text-[14px] text-black bg-white hover:bg-gray-100 shadow-sm dark:text-white dark:bg-neutral-900 dark:hover:bg-zinc-800"
                                       onClick={() => {
                                          setMessageContent(message.content);
                                          setIsEditing(false);
                                       }}>
                                       <div className="flex w-full gap-2 items-center justify-center">
                                          Hủy bỏ
                                       </div>
                                    </button>
                                    <button
                                       className="h-9 w-14 rounded-full text-[14px] text-white bg-black hover:bg-neutral-700 dark:text-black dark:shadow-sm dark:bg-white dark:hover:bg-neutral-200"
                                       onClick={handleEditMessage}
                                       disabled={messageContent.trim().length <= 0}>
                                       <div className="flex w-full gap-2 items-center justify-center">
                                          Gửi
                                       </div>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      ) :
      // assistant style
      (
         <div className="relative w-full my-3">
            <div className="py-2 px-3 text-base md:px-4 m-auto lg:px-1 xl:px-5">
               <div className="mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">

                  <div className="flex-shrink-0 flex flex-col relative items-end">
                     <div className="pt-0.5">
                        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
                           <div className="relative p-1 rounded-sm flex items-center justify-center h-8 w-8">
                              <TbRobotFace size={24} />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="group relative flex w-full min-w-0 flex-col py-3 px-2 rounded-xl 
                  bg-gray-200 text-black dark:bg-neutral-700 dark:text-white">
                     <div className="flex-col gap-1 md:gap-3">
                        <div className="flex grow flex-col max-w-full min-h-[20px] items-start whitespace-pre-wrap break-words overflow-x-auto gap-2"
                           style={{ overflowWrap: 'anywhere' }}>
                           <div className="w-full flex flex-col">
                              <div className="grow pt-2 ps-3 ">
                                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {message.content}
                                 </ReactMarkdown>
                              </div>
                              <div className="md:mr-2 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                                 {messagedCopied ? (
                                    <div className="absolute -bottom-8 flex justify-center items-centert text-sm">
                                       <TbCheck
                                          size={20}
                                          className="text-black dark:text-neutral-300"
                                       /> Đã sao chép
                                    </div>
                                 ) : (
                                    <div className="absolute -bottom-8 hidden group-hover:block">
                                       <button
                                          className="flex items-center justify-center mt-3 h-7 w-7 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700"
                                          onClick={copyOnClick}
                                          title="Sao chép"
                                       >
                                          <TbCopy size={16} />
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div >
      )
});
ChatMessage.displayName = 'ChatMessage';
