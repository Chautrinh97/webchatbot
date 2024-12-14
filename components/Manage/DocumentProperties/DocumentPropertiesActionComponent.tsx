'use client'
import { useUserStore } from "@/app/store/user.store";
import { DeleteDocumentPropertiesModal } from "./DeleteDocumentPropertiesModal";
import { EditDocumentPropertiesModal } from "./EditDocumentPropertiesModal";
import { UserRoleConstant } from "@/utils/constant";

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
   const hasPermission = user.permissions?.some((permission) => permission === propertyPermission);

   if (user.role === UserRoleConstant.SUPERADMIN || hasPermission)
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