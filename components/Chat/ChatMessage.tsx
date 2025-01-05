'use client';
import {
   TbCheck,
   TbCopy,
   TbEdit,
   TbRobotFace,
} from 'react-icons/tb';
import { FaFileWord, FaFilePdf } from "react-icons/fa";
import { FC, memo, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Tooltip } from '@nextui-org/react';

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
                              <Tooltip content="Sửa" placement='bottom'>
                                 <button
                                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
                                    onClick={toggleEditing}>
                                    <TbEdit size={18} />
                                 </button>
                              </Tooltip>
                           </div>
                        </div>
                     ) : (
                        <div className="flex-col gap-1 md:gap-3 w-full">
                           <div className="flex grow flex-col max-w-full">
                              <div className="rounded-3xl px-3 py-2 bg-gray-200 dark:bg-neutral-700">
                                 <textarea
                                    ref={textareaRef}
                                    className=" m-0 resize-none border-0 bg-gray-200 dark:bg-neutral-700 p-0 focus:outline-none overflow-y- w-full"
                                    value={messageContent}
                                    onChange={handleInputChange}
                                    // onKeyDown={handlePressEnter}
                                    onCompositionStart={() => setIsTyping(true)}
                                    onCompositionEnd={() => setIsTyping(false)}
                                 >
                                 </textarea>
                                 <div className="flex justify-end gap-2">
                                    <button
                                       className="h-9 w-20 rounded-full text-[14px] text-black bg-gray-300 hover:bg-white shadow-md dark:text-white dark:bg-neutral-600 dark:hover:bg-neutral-800"
                                       onClick={() => {
                                          setMessageContent(message.content);
                                          setIsEditing(false);
                                       }}>
                                       <div className="flex w-full gap-2 items-center justify-center">
                                          Hủy bỏ
                                       </div>
                                    </button>
                                    <button
                                       className="h-9 w-14 rounded-full text-[14px] text-white bg-blue-500 hover:bg-blue-700 shadow-md dark:bg-blue-700 dark:hover:bg-blue-500"
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
                              <div className="grow pt-2 ps-3">
                                 <ReactMarkdown
                                    className="flex flex-col justify-start text-justify gap-2 pe-3 text-[15px]"
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                       table({ children }) {
                                          return (
                                             <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                                {children}
                                             </table>
                                          );
                                       },
                                       th({ children }) {
                                          return (
                                             <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                                                {children}
                                             </th>
                                          );
                                       },
                                       td({ children }) {
                                          return (
                                             <td className="break-words border border-black px-3 py-1 dark:border-white">
                                                {children}
                                             </td>
                                          );
                                       },
                                       a({ href, children }) {
                                          return (
                                             <a href={href} target='_blank' className="flex justify-start gap-3 text-blue-500 dark:text-blue-600">
                                                {href?.toLowerCase().endsWith('pdf')
                                                   ? <FaFilePdf size={20} color="red" />
                                                   : <FaFileWord size={20} color="blue" />
                                                }{children}
                                             </a>
                                          );
                                       },
                                       strong: ({ children }) => (
                                          <strong className="dark:text-neutral-200">
                                             {children}
                                          </strong>
                                       ),
                                       ul: ({ children }) => (
                                          <ul className="flex flex-col justify-start">
                                             {children}
                                          </ul>
                                       ),
                                       li: ({ children }) => (
                                          <li className="flex flex-col justify-start gap-2 py-1">
                                             {children}
                                          </li>
                                       )
                                    }}
                                 >
                                    {message.content}
                                 </ReactMarkdown>
                              </div>
                              <div className="md:mr-2 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                                 {messagedCopied ? (
                                    <div className="absolute -bottom-8 flex justify-center items-centert text-sm">
                                       <TbCheck
                                          size={18}
                                          className="text-black dark:text-neutral-300"
                                       /> Đã sao chép
                                    </div>
                                 ) : (
                                    <div className="absolute -bottom-10 hidden group-hover:block">
                                       <Tooltip content='Sao chép' placement='bottom'>
                                          <button
                                             className="flex items-center justify-center mt-3 h-9 w-9 text-black dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
                                             onClick={copyOnClick}>
                                             <TbCopy size={18} />
                                          </button>
                                       </Tooltip>
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
