"use client"
import axiosInstance from "@/app/apiService/axios";
import { useAppStore } from "@/app/store/app.store";
import { Department } from "@/types/chat"
import { errorToast, warnToast } from "@/utils/toast";
import { HSDropdown } from "preline/preline";
import { useEffect } from "react";
import { TbChevronDown } from "react-icons/tb";
type Props = {
   departments?: Department[];
}
export const SelectDepartment: React.FC<Props> = ({ departments }) => {
   const { state: {
      isSidebarOpen,
      selectedDepartment,
      selectedConversation,
   }, dispatch } = useAppStore();
   const handleChangeSelectDepartment = (department: any) => {
      dispatch("selectedDepartment", department);
   }
   const isExistMessage = selectedConversation?.messages.length > 0;

   const checkExistMessage = () => {
      if (isExistMessage) {
         warnToast('Không thể thay đổi phòng ban.');
      }
   }

   return (
      <>
         <div className={`hs-dropdown absolute inline-flex mt-2 ${isSidebarOpen ? 'ms-2' : 'ms-10'}`}>
            <button id="hs-dropdown" type="button" className="hs-dropdown-toggle py-2 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-[#212121] dark:text-white dark:hover:bg-neutral-700"
               onClick={checkExistMessage}
            >
               {selectedDepartment.id ? selectedDepartment.name : 'Chọn phòng ban'}
               <TbChevronDown className="hs-dropdown-open:rotate-180" size={18} />
            </button>
            {(departments && !isExistMessage) && (
               <div className="hs-dropdown-menu z-10 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 bg-white shadow-lg rounded-lg p-2 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" aria-labelledby="hs-dropdown-default">
                  {departments.map((department) => (
                     <div
                        key={department.id}
                        onClick={() => handleChangeSelectDepartment(department)}
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                        {department.name}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </>
   )
}