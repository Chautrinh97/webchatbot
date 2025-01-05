import { Metadata } from "next";
import { DocumentStatisticComponent } from "@/components/Statistic/DocumentStatisticComponent";
import { getPermissions } from "@/utils/access-utils";
import { redirect } from "next/navigation";
import { UserPermissionConstant } from "@/utils/constant";

export const metadata: Metadata = {
   title: 'Thống kê văn bản',
}

export default async function DocumentStatisticPage() {
   const permissions = await getPermissions();
   if (!permissions?.some((perm: string) =>
      perm === UserPermissionConstant.MANAGE_ALL_DOCUMENTS ||
      perm === UserPermissionConstant.MANAGE_OWN_DOCUMENTS)
   ) {
      redirect('/manage/document');
   }
   return <>
      <DocumentStatisticComponent />
   </>;
}