"use client"
import { useAppStore } from "@/app/store/app.store";
import { Conversation, Message } from "@/types/chat";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MemoizedChatMessage } from "./MemoizedChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { updateConversation } from "@/utils/conversation";
import { throttle } from "@/utils/throttle";
import Image from 'next/image'
import { errorToast } from "@/utils/toast";
import { HttpStatusCode } from "axios";
import icon from "../../app/icon_75.jpg"

type Props = {
   conversationId?: string;
}
const ChatArea: React.FC<Props> = ({ conversationId: id = "" }) => {
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
      async (message: Message, deleteCount = 0) => {
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

         const controller = new AbortController();
         let response;
         try {
            response = await fetch(`${process.env.API_ENDPOINT}/conversation/chat`, {
               method: "POST",
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify({ question: message.content }),
               signal: controller.signal,
               credentials: 'include',
            })
            // errorToast(response.status.toString())
            if (!response.body || response.status !== HttpStatusCode.Created) {
               errorToast('Không nhận được phản hồi từ server');
               dispatch('messageIsStreaming', false);
               dispatch('isLoading', false);
               return;
            }
         } catch {
            errorToast('Có lỗi xảy ra khi truy vấn. Vui lòng thử lại sau');
            dispatch('messageIsStreaming', false);
            return;
         }

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

         let doneFlag = false;
         const reader = response.body.getReader();
         const decoder = new TextDecoder();
         let text = '';
         let isFirst = true;

         while (!doneFlag) {
            if (stopConversationRef.current === true) {
               controller.abort();
               doneFlag = true;
               break;
            }
            const { value, done: doneReading } = await reader.read();
            doneFlag = doneReading;
            const chunkValue = decoder.decode(value, { stream: true });
            text += chunkValue;

            if (isFirst) {
               isFirst = false;
               const updatedMessages: Message[] = [
                  ...updatedConversation.messages,
                  { role: 'assistant', content: chunkValue },
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
                           content: text,
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
            {!selectedConversation?.messages.length ? (
               <div className="m-auto h-full flex flex-col items-center justify-center space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
                  <Image
                     src={icon}
                     alt="Logo Chatbot"
                     width={60}
                     height={60}
                     className="rounded-full hover:animate-bounceupdown"
                     loading='lazy' />
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
                        onSend={(message) => {
                           setCurrentMessage(message);
                           handleSend(message, 0);
                        }}
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