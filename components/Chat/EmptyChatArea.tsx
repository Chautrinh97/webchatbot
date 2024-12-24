"use client"
import Image from 'next/image';
import icon from "../../app/icon_75.jpg"

export const EmptyChatArea = () => {
   return (
      <>
         <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#212121]">
            <div className="m-auto h-full flex flex-col items-center justify-center space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]">
               <Image
                  src={icon}
                  alt="Logo Chatbot"
                  width={60}
                  height={60}
                  className="rounded-full hover:animate-bounceupdown"
                  loading='lazy' />
               <div className="opacity-70">Vui lòng tạo đoạn hội thoại mới</div>
               <div className="opacity-70">Hoặc lựa chọn hội thoại cũ để tiếp tục</div>
            </div>
         </div>
      </>
   )
};