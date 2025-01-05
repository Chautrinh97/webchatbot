"use client"
import {
   TbFileExport,
   TbMistOff,
   TbArrowBarRight,
   TbArrowBarLeft,
   TbMessagePlus,
   TbPlus,
} from 'react-icons/tb';
import { useAppStore } from '@/app/store/app.store';
import { useEffect, useRef, useState } from 'react';
import { SidebarOptionButton } from './SidebarOptionButton';
import { Divider, Tooltip } from '@nextui-org/react';
import { ConversationItem } from '@/types/chat';
import { apiServiceClient } from '@/app/apiService/apiService';
import { StatusCodes } from 'http-status-codes';
import { errorToast, warnToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { ConversationComponent } from './ConversationComponent';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const SideBar = (
   // {conversations} : {conversations: ConversationItem[]}
) => {
   const triggerPersonalOptionRef = useRef<HTMLDivElement>(null);
   const [refetch, setRefetch] = useState<boolean>(false);
   const router = useRouter();
   const {
      state: {
         isSidebarOpen,
         conversations,
         selectedConversation,
         messageIsStreaming,
      },
      dispatch,
   } = useAppStore();

   const fetchConversation = async () => {
      const conversationResponse = await apiServiceClient.get('/conversation');
      const conversationData = await conversationResponse.json();
      const conversations = conversationData.data.map((conv: any) => ({
         id: conv.id,
         title: conv.title,
         slug: conv.slug,
      }));
      dispatch('conversations', conversations);
   }

   useEffect(() => {
      fetchConversation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [refetch]);

   useEffect(() => {
      fetchConversation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleNewConversation = async () => {
      try {
         const response = await apiServiceClient.post('/conversation');
         if (response.status !== StatusCodes.OK) {
            errorToast('Bạn đang có đoạn hội thoại rỗng. Không thể tạo mới');
            return;
         }
         const result = await response.json();
         setRefetch(!refetch);
         router.push(`/chat/${result.slug}`);
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   const handleToggleSidebar = () => {
      dispatch('isSidebarOpen', !isSidebarOpen);
   };

   const handleExportFile = async () => {
      if (selectedConversation.messages.length === 0) {
         warnToast('Đoạn hội thoại này không có nội dung nào');
         return;
      }
      const element = document.querySelector('#conversation-export') as HTMLElement;
      if (!element) return;

      const rect = element.getBoundingClientRect();

      const canvas = await html2canvas(element, {
         scale: 1,
         scrollX: 0,
         scrollY: -(rect.top + window.scrollY),
         windowWidth: element.scrollWidth,
         windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');

      const marginLeft = 10;
      const marginRight = 15;
      const pdf = new jsPDF({
         orientation: 'portrait',
         unit: 'pt',
         format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth() - marginLeft - marginRight;
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      let heightLeft = imgHeight;

      while (heightLeft > 0) {
         const currentHeight = Math.min(heightLeft, pdfHeight);

         const canvasPart = document.createElement('canvas');
         const ctx = canvasPart.getContext('2d');
         canvasPart.width = imgProps.width;
         canvasPart.height = currentHeight;

         ctx?.drawImage(
            canvas,
            0, //x pos to start cut
            imgHeight - heightLeft, // y pos to start cut
            imgWidth, // x range to cut
            currentHeight, // y range to cut
            0, // new x pos
            0, // new y pos
            imgWidth, // new x range
            currentHeight // new y range
         );

         const imgPartData = canvasPart.toDataURL('image/png');

         pdf.addImage(imgPartData, 'PNG', marginLeft, 0, pdfWidth, currentHeight);
         heightLeft -= currentHeight;
         if (heightLeft > 0) {
            pdf.addPage();
         }
      }


      const title = selectedConversation.title || 'conversation-data';
      pdf.save(`${title}.pdf`);
   }

   useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
         if (!triggerPersonalOptionRef?.current?.contains(e.target as Node)) {
            window.addEventListener('mouseup', handleMouseUp);
         }
      };

      const handleMouseUp = (e: MouseEvent) => {
         window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousedown', handleMouseDown);

      return () => {
         window.removeEventListener('mousedown', handleMouseDown);
      };
   },);

   useEffect(() => {
      if (window.innerWidth < 640) {
         dispatch("isSidebarOpen", false);
      }
   }, [dispatch]);

   return (
      <>
         <div
            className={`fixed top-0 flex flex-col h-full dark:bg-sb-black transition-all ease-in-out duration-200 bg-gray-100 text-black dark:text-white text-[14px] sm:relative sm:top-0
            ${isSidebarOpen ? 'w-[280px] z-20 border-r-1 dark:border-neutral-700' : 'z-10 w-0'}`}>
            {isSidebarOpen && (
               <div className="h-full flex flex-col overflow-x-hidden px-2 space-y-2">
                  <div className="flex justify-between border-b border-neutral-300 dark:border-neutral-700">
                     <Tooltip content='Đóng' placement='bottom'>
                        <button
                           className="flex justify-center mt-3 items-center h-7 w-7 sm:h-8 sm:w-8 rounded-md text-neutral-400 hover:text-black hover:bg-gray-300 dark:text-neutral-500 dark:hover:text-white dark:hover:bg-neutral-700"
                           onClick={handleToggleSidebar}
                        >
                           <TbArrowBarLeft size={21} />
                        </button>
                     </Tooltip>
                     <button
                        onClick={handleNewConversation}
                        className="relative grow flex cursor-pointer select-none items-center gap-3 rounded-md p-3 my-2 ms-1
                     transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-neutral-700">
                        <TbMessagePlus size={18} /> Đoạn hội thoại mới
                        <TbPlus size={18} className="absolute right-3" />
                     </button>
                  </div>
                  <div className="flex-grow overflow-auto">
                     {conversations?.length > 0 ? (
                        <div
                           className="pt-1"
                        >
                           {conversations.map((conversation) => (
                              <ConversationComponent
                                 key={conversation.id}
                                 conversation={conversation}
                                 refetch={() => setRefetch(!refetch)} />
                           ))}
                        </div>
                     ) :
                        (
                           <div className="mt-8 select-none text-center text-black dark:text-white opacity-70">
                              <TbMistOff className="mx-auto mb-3" size={18} />
                              <span className="text-[14px] leading-normal">
                                 Không có hội thoại nào
                              </span>
                           </div>
                        )}
                  </div>
                  < div className="flex flex-col items-center space-y-1 border-t border-neutral-300 dark:border-neutral-600 pt-1 text-sm">
                     <button
                        className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-black dark:text-white transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-neutral-700"
                        disabled={messageIsStreaming}
                        onClick={handleExportFile}
                     >
                        <div><TbFileExport size={18} /></div>
                        <span>Xuất dữ liệu hội thoại</span>
                     </button>
                     <SidebarOptionButton />
                  </div>
               </div>
            )}
         </div >
         {isSidebarOpen && (
            <div
               onClick={handleToggleSidebar}
               className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
            ></div>
         )}
         {!isSidebarOpen && (
            <Tooltip content='Mở' placement='right'>
               <button
                  className="fixed flex justify-center items-center top-6 left-2 z-50 h-7 w-7 rounded-md hover:bg-gray-300 text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white dark:hover:bg-neutral-700 sm:top-2 sm:left-2 sm:h-8 sm:w-8 "
                  onClick={handleToggleSidebar}
                  title="Mở"
               >
                  <TbArrowBarRight size={21} />
               </button>
            </Tooltip>
         )}
      </>
   )
}
