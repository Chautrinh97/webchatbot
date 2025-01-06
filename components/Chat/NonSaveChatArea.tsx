"use client"
import { useAppStore } from "@/app/store/app.store";
import { Conversation, Message } from "@/types/chat";
import { memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { MemoizedChatMessage } from "./MemoizedChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { throttle } from "@/utils/throttle";
import Image from 'next/image'
import { errorToast } from "@/utils/toast";
import icon from "../../app/icon_75.jpg"
import { useRouter } from "next/navigation";
import { Loading } from "../Others/Loading";
import { IoIosRefresh } from "react-icons/io";
import { Tooltip } from "@nextui-org/react";

const NonSaveChatErea = () => {
   const {
      state: { isLoading, selectedConversation, messageIsStreaming },
      dispatch,
   } = useAppStore();
   const [currentMessage, setCurrentMessage] = useState<Message>();
   const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
   const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);

   const stopConversationRef = useRef<boolean>(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const chatContainerRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const router = useRouter();

   useEffect(() => {
      const nonSaveConversation: Conversation = {
         id: 0,
         title: '',
         slug: "",
         messages: []
      }
      dispatch('selectedConversation', nonSaveConversation);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSend = useCallback(
      async (message: Message) => {
         const webSocket = new WebSocket(`${process.env.CHATBOT_ENDPOINT}/non-save-chat`);
         let updatedConversation: Conversation;

         if (!selectedConversation) return;

         webSocket.onopen = () => {
            let first = true;
            let chunks = '';

            dispatch("isLoading", true);
            dispatch("messageIsStreaming", true);

            updatedConversation = {
               ...selectedConversation,
               messages: [...selectedConversation.messages, message],
            };
            dispatch("selectedConversation", updatedConversation);

            dispatch("isLoading", false);

            webSocket.send(JSON.stringify({
               question: message.content,
            }));

            webSocket.onmessage = (event) => {
               const response = event.data;
               chunks += response;
               if (first) {
                  first = false;
                  updatedConversation.messages.push({
                     content: response,
                     role: 'assistant',
                  });
                  dispatch('selectedConversation', updatedConversation);
               } else {
                  updatedConversation.messages.pop();
                  updatedConversation.messages.push({
                     content: chunks,
                     role: 'assistant',
                  });
                  dispatch('selectedConversation', updatedConversation);
               }
               if (stopConversationRef.current) {
                  webSocket.close();
                  dispatch('isLoading', false);
                  dispatch('messageIsStreaming', false);
               }
            };
         };

         // Handle WebSocket errors and close the connection properly
         webSocket.onerror = (error) => {
            errorToast('Có lỗi phía server. Vui lòng thử lại sau');
            webSocket.close();
            dispatch('isLoading', false);
            dispatch('messageIsStreaming', false);
         };
         webSocket.onclose = () => {
            console.log('Closed connected socket');
            dispatch('isLoading', false);
            dispatch('messageIsStreaming', false);
         }
      },
      [selectedConversation, dispatch]
   );

   const handleRefreshChat = () => {
      router.refresh();

      /* dispatch('selectedConversation', {
         id: 0,
         title: '',
         slug: "",
         messages: []
      }); */

      return;
   }

   /* const handleSend = useCallback(
      async (message: Message) => {
         dispatch("isLoading", true);
         dispatch("messageIsStreaming", true);

         const controller = new AbortController();
         let response;
         try {
            response = await fetch(`${process.env.CHATBOT_ENDPOINT}/chat`, {
               method: "POST",
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ question: message.content, conversation_id: selectedConversation.id }),
               signal: controller.signal,
               credentials: 'include',
            })

            if (!response.body || response.status !== StatusCodes.OK) {
               errorToast('Có lỗi xảy ra khi truy vấn. Vui lòng thử lại sau');
               dispatch('isLoading', false);
               dispatch('messageIsStreaming', false);
               return;
            }
         } catch (e) {
            errorToast('Có lỗi xảy ra khi truy vấn. Vui lòng thử lại sau');
            dispatch('isLoading', false);
            dispatch('messageIsStreaming', false);
            return;
         }

         if (!selectedConversation) return;
         let updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
         };
         dispatch("selectedConversation", updatedConversation);

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

         dispatch('messageIsStreaming', false);
      },
      [selectedConversation, dispatch]); */

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
      selectedConversation.messages.length > 0 &&
         setCurrentMessage(
            selectedConversation.messages[selectedConversation.messages.length - 1].role === 'assistant'
               ? selectedConversation.messages[selectedConversation.messages.length - 2]
               : selectedConversation.messages[selectedConversation.messages.length - 1]
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
      <Suspense fallback={<Loading />}>
         <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#212121]">
            {!selectedConversation?.messages.length ? (
               <div className="m-auto h-full flex flex-col items-center justify-center space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
                  <Image
                     src={icon}
                     alt="Logo Chatbot"
                     width={60}
                     height={60}
                     className="rounded-full animate-bounceupdown"
                     loading='lazy' />
                  <div className="text-xs ">
                     <p className="opacity-80">Để lưu lịch sử, tạo đoạn hội thoại mới</p>
                     <p className="opacity-80">Hoặc chọn đoạn hội thoại đã tồn tại</p>
                  </div>
                  <div className="text-lg">Hãy đặt một câu hỏi...</div>
               </div>
            ) : (
               <>
                  <Tooltip content='Làm mới đoạn chat' placement="bottom">
                     <button
                        onClick={handleRefreshChat}
                        disabled={messageIsStreaming}
                        className="absolute top-12 right-8 z-20 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700">
                        <IoIosRefresh size={20} />
                     </button>
                  </Tooltip>
                  <div
                     id="conversation-export"
                     className="max-h-full overflow-x-hidden"
                     ref={chatContainerRef}
                     onScroll={handleScroll}>
                     {selectedConversation?.messages.map((message, index) => (
                        <MemoizedChatMessage
                           onSend={(message) => {
                              setCurrentMessage(message);
                              handleSend(message);
                           }}
                           key={index}
                           message={message} />
                     ))}

                     {isLoading && <ChatLoader />}

                     <div
                        className="h-[162px] bg-white dark:bg-[#212121]"
                        ref={messagesEndRef} />
                  </div>
               </>
            )}
            <ChatInput
               stopConversationRef={stopConversationRef}
               textareaRef={textareaRef}
               onSend={(message) => {
                  setCurrentMessage(message);
                  handleSend(message);
               }}
               onScrollDownClick={handleScrollDown}
               onRegenerate={() => {
                  if (currentMessage) {
                     handleSend(currentMessage);
                  }
               }}
               showScrollDownButton={showScrollDownButton}
            />
         </div>
      </Suspense>
   )
};
export default memo(NonSaveChatErea);