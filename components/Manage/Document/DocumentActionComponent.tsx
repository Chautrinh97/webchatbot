'use client'
import { useUserStore } from "@/app/store/user.store"
import { EditDocumentModal } from "./EditDocumentModal";
import { DeleteDocumentModal } from "./DeleteDocumentModal";
import { UserPermissionConstant } from "@/utils/constant";
import { AttachFileButton } from "./AttachFileButton";
import { SyncActionButton } from "./SyncActionButton";

export const DocumentActionComponent = (
   { id, mimeType, syncStatus }
      : { id: number, mimeType: string, syncStatus: string }) => {
   const { user } = useUserStore();
   const hasPermission = user.permissions?.some((permission) =>
      permission === UserPermissionConstant.MANAGE_DOCUMENTS ||
      permission === UserPermissionConstant.MANAGE_DOCUMENTS_PROPERTIES);

   return (
      <div className="grid grid-rows-3 grid-flow-col gap-3 divide-x">
         <AttachFileButton mimeType={mimeType} id={id} />
         {hasPermission &&
            <>
               <EditDocumentModal id={id} />
               <DeleteDocumentModal id={id} />
               <SyncActionButton syncStatus={syncStatus} id={id} />
            </>
         }
      </div>

   );
}