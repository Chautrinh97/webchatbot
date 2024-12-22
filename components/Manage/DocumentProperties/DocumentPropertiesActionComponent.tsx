'use client'
import { useUserStore } from "@/app/store/user.store";
import { DeleteDocumentPropertiesModal } from "./DeleteDocumentPropertiesModal";
import { EditDocumentPropertiesModal } from "./EditDocumentPropertiesModal";
import { UserPermissionConstant, UserRoleConstant } from "@/utils/constant";

export const DocumentPropertiesActionComponent = (
   {
      id,
      propertyAPIURI,
      propertyText,
      propertyPermission
   }: {
      id: number,
      propertyAPIURI:
      string,
      propertyText: string,
      propertyPermission: string
   }) => {
   const { user } = useUserStore();
   const hasPermission = user.permissions?.some((permission) => permission === UserPermissionConstant.MANAGE_DOCUMENTS_PROPERTIES);

   if (hasPermission)
      return <>
         <EditDocumentPropertiesModal
            id={id}
            propertyAPIURI={propertyAPIURI}
            propertyText={propertyText} />
         <DeleteDocumentPropertiesModal
            id={id}
            propertyAPIURI={propertyAPIURI}
            propertyText={propertyText} />
      </>;
   return <></>;
}