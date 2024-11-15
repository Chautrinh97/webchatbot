import axiosInstance from "@/app/apiService/axios";
import { DepartmentNode } from "@/types/manage";
import { errorToast, warnToast } from "@/utils/toast";
import { ChangeEvent, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { TbPlus, TbMinus, TbCheck } from 'react-icons/tb';
type DepartmentProps = {
   department: DepartmentNode,
   canDrop: (draggedId: string, targetId: string) => boolean,
   refetchTrigger: () => void,
};

export const DepartmentTree: React.FC<DepartmentProps> = ({
   department,
   canDrop,
   refetchTrigger,
}) => {
   const [isExpand, setExpand] = useState<boolean>(department.expand);
   const [name, setName] = useState<string>(department.name);
   const [isRenaming, setRenaming] = useState<boolean>(false);
   const toggleExpansion = () => {
      department.expand = !department.expand;
      setExpand((prev) => !prev);
   };
   const openRenameForm = () => {
      setRenaming(true);
   }

   function onChangeName(event: ChangeEvent<HTMLInputElement>): void {
      setName(event.target.value.trim());
   }

   const handleRename = (doRename: boolean) => {
      if (doRename) {
         if (name)
            department.name = name;
      }
      else setName(department.name);
      setRenaming(false);
   }

   const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      if (event.dataTransfer) {
         event.dataTransfer.setData('department', JSON.stringify(department));
      }
   };

   const allowDrop = (event: any) => {
      event.preventDefault();
   }

   const handleDrop = async (event: any) => {
      if (event.dataTransfer) {
         const draggedItem = JSON.parse(event.dataTransfer.getData('department'));
         if (department._id === draggedItem._id) return;
         if (department._id === draggedItem.parentDepartmentId) return;
         if (!canDrop(draggedItem._id, department._id)) 
            warnToast('Phòng ban cha không được phép trở thành con của phòng ban con của nó.');
         try {
            await axiosInstance.patch(
               `/department/${draggedItem._id}`,
               JSON.stringify({ parentDepartmentId: department._id }), {
               withCredentials: true,
            });
            refetchTrigger();
         } catch {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
         }
      }
   }

   return (
      <div className="mt-2 ms-5">
         <div
            draggable={true}
            onDragOver={allowDrop}
            onDragStart={(e) => handleDragStart(e)}
            onDrop={handleDrop}
            className="relative h-6 py-4 flex items-center rounded-md hover:cursor-pointer bg-gray-200 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-gray-700 select-none">
            {department.children.length > 0 && (
               <button className="absolute -left-6 h-5 w-5 flex items-center justify-center bg-gray-200 dark:bg-neutral-600 rounded-full"
                  onClick={toggleExpansion}>
                  {isExpand ?
                     <TbMinus size={18} />
                     :
                     <TbPlus size={18} />
                  }
               </button>
            )}
            {!isRenaming ? (
               <div onDoubleClick={openRenameForm} className="ps-2">{department.name}</div>
            ) : (
               <div className="flex justify-between items-center ps-2">
                  <input className="py-1 px-2 grow rounded-md dark:bg-neutral-500" type="text" value={name} onChange={onChangeName} />
                  <div className="ms-2 flex gap-2">
                     <TbCheck onClick={() => handleRename(true)} size={18} />
                     <HiXMark onClick={() => handleRename(false)} size={18} />
                  </div>
               </div>
            )}
         </div>
         {department.children && department.children.length > 0 && isExpand && (
            <div className="flex flex-col">
               {department.children.map((child: any) => (
                  <DepartmentTree
                     key={child._id}
                     department={child}
                     canDrop={canDrop}
                     refetchTrigger={refetchTrigger}
                  />
               ))}
            </div>
         )}
      </div>
   );
};