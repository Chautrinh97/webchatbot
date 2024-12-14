'use client'
import { useUserStore } from "@/app/store/user.store"
import { EditDocumentModal } from "./EditDocumentModal";
import { DeleteDocumentModal } from "./DeleteDocumentModal";
import { UserPermissionConstant, UserRoleConstant } from "@/utils/constant";

export const DocumentActionComponent = ({ id }: { id: number }) => {
   const { user } = useUserStore();
   const hasPermission = user.permissions?.some((permission) => permission === UserPermissionConstant.MANAGE_DOCUMENTS)
   if (user.role === UserRoleConstant.SUPERADMIN || hasPermission)
      return (
         <>
            <EditDocumentModal id={id} />
            <DeleteDocumentModal id={id} />
         </>
      );
   return <></>;
}