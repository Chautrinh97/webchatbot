"use client"
import { HiMiniMoon, HiMiniSun } from 'react-icons/hi2';
import { useTheme } from 'next-themes';

export const ThemeToggle: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => {
   const { setTheme, resolvedTheme } = useTheme();
   const handleCheckboxChange = () => {
      if (resolvedTheme === "dark")
         setTheme("light");
      else
         setTheme("dark");
   };
   return (
      <>
         <label className='relative inline-flex cursor-pointer select-none items-center'>
            <input
               type='checkbox'
               checked={resolvedTheme === "light"}
               onChange={handleCheckboxChange}
               title='Đổi màu nền'
               className='sr-only'
            />
            <div className={`flex gap-2 justify-center items-center border border-neutral-800 transition-opacity ease-in-out duration-300 opacity-80 hover:opacity-100 shadow-card rounded-full bg-sb-white
            ${isVertical ? 'flex-col h-[80px] w-[44px]' : 'h-[32px] w-[70px]'}`}>
               <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black"
               >
                  <HiMiniSun size={20} />
               </span>
               <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white"
               >
                  <HiMiniMoon size={20} />
               </span>
            </div>
         </label>
      </>
   );
};
