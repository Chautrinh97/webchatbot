"use client"
import { useAppStore } from "@/app/store/app.store";
import { ChatBody, Conversation, Department, Message } from "@/types/chat";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MemoizedChatMessage } from "./MemoizedChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { generateRandomString } from "@/utils/string";
import { updateConversation } from "@/utils/conversation";
import { throttle } from "@/utils/throttle";
import Image from 'next/image'
import { SelectDepartment } from "./SelectDepartment";

type Props = {
   conversationId?: string;
   // departments?: Department[];
}
const ChatArea: React.FC<Props> = ({ conversationId: id = ""}) => {
   const {
      state: {
         isLoading,
         selectedConversation,
         conversations,
      },
      dispatch,
   } = useAppStore();


   const [currentMessage, setCurrentMessage] = useState<Message>();
   const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
   const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);

   const stopConversationRef = useRef<boolean>(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const chatContainerRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const handleSend = useCallback(
      (message: Message, deleteCount = 0) => {
         if (!selectedConversation) return;
         let updatedConversation: Conversation;
         if (deleteCount) {
            const updatedMessages = [...selectedConversation.messages];
            for (let i = 0; i < deleteCount; i++) {
               updatedMessages.pop();
            }
            updatedConversation = {
               ...selectedConversation,
               messages: [...updatedMessages, message],
            };
         } else {
            updatedConversation = {
               ...selectedConversation,
               messages: [...selectedConversation.messages, message],
            };
         }
         dispatch("selectedConversation", updatedConversation);
         dispatch("isLoading", true);
         dispatch("messageIsStreaming", true);

         const chatBody: ChatBody = {
            prompt: updatedConversation.messages.map(message => message.content).join(' ')
         }
         const controller = new AbortController();
         //Phan goi API 
         const dataResponse: string = generateRandomString(50);
         //Phan goi API
         if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
               content.length > 20 ? content.substring(0, 20) + '...' : content;
            updatedConversation = {
               ...updatedConversation,
               title: customName,
            };
         }
         dispatch('isLoading', false);

         let isFirst = true;
         if (isFirst) {
            isFirst = false;
            const updatedMessages: Message[] = [
               ...updatedConversation.messages,
               { role: 'assistant', content: dataResponse },
            ];
            updatedConversation = {
               ...updatedConversation,
               messages: updatedMessages,
            };
            dispatch('selectedConversation', updatedConversation);

         } else {
            const updatedMessages: Message[] =
               updatedConversation.messages.map((message, index) => {
                  if (index === updatedConversation.messages.length - 1) {
                     return {
                        ...message,
                        content: dataResponse,
                     };
                  }
                  return message;
               });
            updatedConversation = {
               ...updatedConversation,
               messages: updatedMessages,
            };
            dispatch('selectedConversation', updatedConversation);
         }

         const { all } = updateConversation(updatedConversation, conversations);
         dispatch('conversations', all);

         dispatch('messageIsStreaming', false);
      },
      [selectedConversation, dispatch, conversations]);

   const handleScroll = () => {
      if (chatContainerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current;
         const bottomTolerance = 30;

         if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
            setAutoScrollEnabled(false);
            setShowScrollDownButton(true);
         } else {
            setAutoScrollEnabled(true);
            setShowScrollDownButton(false);
         }
      }
   }

   const handleScrollDown = () => {
      chatContainerRef.current?.scrollTo({
         top: chatContainerRef.current.scrollHeight,
         behavior: 'smooth',
      });
   };

   const scrollDown = () => {
      if (autoScrollEnabled) {
         messagesEndRef.current?.scrollIntoView(true);
      }
   };

   const throttledScrollDown = throttle(scrollDown, 250);

   useEffect(() => {
      throttledScrollDown();
      selectedConversation &&
         setCurrentMessage(
            selectedConversation.messages[selectedConversation.messages.length - 2],
         );
   }, [selectedConversation, throttledScrollDown]);

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setAutoScrollEnabled(entry.isIntersecting);
            if (entry.isIntersecting) {
               textareaRef.current?.focus();
            }
         },
         {
            root: null,
            threshold: 0.5,
         },
      );
      const messagesEndElement = messagesEndRef.current;
      if (messagesEndElement) {
         observer.observe(messagesEndElement);
      }
      return () => {
         if (messagesEndElement) {
            observer.unobserve(messagesEndElement);
         }
      };
   }, [messagesEndRef]);

   return (
      <>
         <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#212121]">
            {/* <SelectDepartment departments={departments} /> */}
            {!selectedConversation?.messages.length ? (
               <div className="m-auto h-full flex flex-col items-center justify-center space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
                  <Image
                     src="/icon.jpg"
                     alt="Logo Chatbot"
                     width={60}
                     height={60}
                     className="rounded-full hover:animate-bounceupdown" 
                     loading='lazy'/>
                  <div className="opacity-70">Hãy đặt một câu hỏi...</div>
               </div>
            ) : (
               <div
                  className="max-h-full overflow-x-hidden"
                  ref={chatContainerRef}
                  onScroll={handleScroll}
               >
                  {selectedConversation?.messages.map((message, index) => (
                     <MemoizedChatMessage
                        key={index}
                        message={message}
                        messageIndex={index}
                        onEdit={(editedMessage) => {
                           setCurrentMessage(editedMessage);
                           handleSend(
                              editedMessage,
                              selectedConversation?.messages.length - index
                           );
                        }} />
                  ))}

                  {isLoading && <ChatLoader />}

                  <div
                     className="h-[162px] bg-white dark:bg-[#212121]"
                     ref={messagesEndRef} />
               </div>
            )}
            <ChatInput
               stopConversationRef={stopConversationRef}
               textareaRef={textareaRef}
               onSend={(message) => {
                  setCurrentMessage(message);
                  handleSend(message, 0);
               }}
               onScrollDownClick={handleScrollDown}
               onRegenerate={() => {
                  if (currentMessage) {
                     handleSend(currentMessage, 2);
                  }
               }}
               showScrollDownButton={showScrollDownButton}
            />
         </div>
      </>
   )
};
export default memo(ChatArea);