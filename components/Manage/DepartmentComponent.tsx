"use client"
import axiosInstance from "@/app/apiService/axios";
import { DepartmentNode } from "@/types/manage";
import { errorToast } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { DepartmentTree } from "./DepartmentTree";
import { AiOutlineLoading } from "react-icons/ai";

export const DepartmentComponent = () => {
   const [departments, setDepartments] = useState<DepartmentNode[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [refetchData, setRefetch] = useState<boolean>(false);
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axiosInstance.get('/department', {
               withCredentials: true,
            });
            const processDepartments = (data: any[]): DepartmentNode[] => {
               return data.map((department: any) => ({
                  _id: department._id,
                  name: department.name,
                  description: department.description,
                  parentDepartmentId: department.parentDepartmentId,
                  children: processDepartments(department.children),
                  expand: false,
               }));
            };
            setDepartments(processDepartments(response.data));
            setIsLoading(false);
         } catch {
            errorToast('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
         }
      };
      fetchData();
   }, [refetchData]);

   const canDrop = (draggedId: string, targetId: string): boolean => {
      let foundDragged = false;
      let validDrop = false;

      const checkDropValidity = (draggedId: string, targetId: string, nodes: DepartmentNode[]): boolean => {
         for (let node of nodes) {
            if (node._id === targetId) {
               if (!foundDragged) {
                  validDrop = true;
                  return true;
               } else {
                  validDrop = false;
                  return false;
               }
            } else if (node._id === draggedId) {
               foundDragged = true;
               validDrop = true;
               checkDropValidity(draggedId, targetId, node.children);
               break;
            }
            if (checkDropValidity(draggedId, targetId, node.children)) {
               return true;
            }
            else if (validDrop) {
               return true;
            }
         }
         return false;
      };
      checkDropValidity(draggedId, targetId, departments);
      return validDrop;
   };

   const handleRefetch = () => {
      setRefetch((prev) => !prev);
   }

   const allowDrop = (e: any) => {
      e.preventDefault();
   }

   const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      if (e.dataTransfer) {
         const department = JSON.parse(e.dataTransfer.getData('department'));
         try {
            await axiosInstance.patch(
               `/department/${department._id}`,
               JSON.stringify({
                  parentDepartmentId: ""
               }), {
               withCredentials: true,
            });
            handleRefetch();
         } catch {
            errorToast("Có lỗi xảy ra. Vui lòng thử lại sau.");
         }
      }
   }

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <AiOutlineLoading className="animate-spin" />
            <span>Đang tải dữ liệu...</span>
         </div>
      )
   }
   return (
      <div className="flex pt-20 px-5 h-full pb-5">
         <div className="w-full h-full pt-2 pb-10 pe-3 rounded-md bg-gray-100 dark:bg-neutral-800">
            <div className="w-1/2 h-full ps-10">
               <div
                  onDragOver={allowDrop}
                  onDrop={handleDrop}
                  className="h-10 py-2 rounded-md"></div>
               {departments.map((department) => (
                  <DepartmentTree
                     key={department._id}
                     department={department}
                     canDrop={canDrop}
                     refetchTrigger={handleRefetch}
                  />
               ))}
               <div
                  onDragOver={allowDrop}
                  onDrop={handleDrop}
                  className="h-20 py-2 rounded-md"></div>
            </div>
         </div>
      </div>
   );
}