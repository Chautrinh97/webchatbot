import axiosInstance from "@/app/apiService/axios";
import { AuthorityGroupComponent } from "@/components/Manage/AuthorityGroup/AuthorityGroupComponent";
import { UserRoleConstant } from "@/utils/constant";
import { Metadata } from "next";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { StatusCodes } from "http-status-codes";
import { AuthorityGroupDetail } from "@/types/manage";
import { Suspense } from "react";
import { Loading } from "@/components/Others/Loading";
export const metadata: Metadata = {
   title: 'Nhóm quyền',
}
const fetchAuthorityGroup = async () => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;
   const response = await axiosInstance.get(`/permission`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
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
   const role = cookies().get('role')?.value || UserRoleConstant.OFFICER;
   if (role !== UserRoleConstant.SUPERADMIN) {
      redirect('/manage/document');
   }

   try {
      const response = await fetchAuthorityGroup();
      if (response.status !== StatusCodes.OK) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
            </div>
         )
      }

      const authorityGroups: AuthorityGroupDetail[] = mapAuthorityGroups(response.data.data);
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
            <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
         </div>
      )
   }
};