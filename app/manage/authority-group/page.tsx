import { AuthorityGroupComponent } from "@/components/Manage/AuthorityGroup/AuthorityGroupComponent";
import { UserRoleConstant } from "@/utils/constant";
import { Metadata } from "next";
import { redirect } from 'next/navigation'
import { StatusCodes } from "http-status-codes";
import { AuthorityGroupDetail } from "@/types/manage";
import { Suspense } from "react";
import { Loading } from "@/components/Others/Loading";
import { getAccessToken } from "@/app/apiService/cookies";
import {apiService} from "@/app/apiService/apiService";
import { getRole } from "@/utils/access-utils";

export const metadata: Metadata = {
   title: 'Nhóm quyền',
}

const mapAuthorityGroups = (data: any) => {
   const authorityGroups = data.map((group: any) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      permissions: group.permissions.map((perm: any) => ({
         id: perm.id,
         name: perm.name,
         description: perm.description,
      })),
   }));
   return authorityGroups;
}

export default async function AuthorityGroupPage() {
   const role = await getRole();
   if (role !== UserRoleConstant.SUPERADMIN) {
      redirect('/manage/document');
   }

   try {
      const token = await getAccessToken();
      const response = await apiService.get(`/permission`, {}, {
         Authorization: `Bearer ${token}`,
      });
      if (response.status !== StatusCodes.OK) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau</span>
            </div>
         )
      }

      const data = await response.json();

      const authorityGroups: AuthorityGroupDetail[] = mapAuthorityGroups(data.data);
      return (
         <Suspense fallback={<Loading />}>
            <div className="h-full w-full pt-20 px-4">
               <AuthorityGroupComponent authorityGroups={authorityGroups} />
            </div>
         </Suspense>
      );
   } catch (error) {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau</span>
         </div>
      )
   }
};