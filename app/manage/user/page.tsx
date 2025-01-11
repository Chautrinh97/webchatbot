import { AddUserModal } from "@/components/Manage/User/AddUserModal";
import { PageLimitComponent } from "@/components/Manage/PageLimitComponent";
import { PaginationComponent } from "@/components/Manage/PaginationComponent";
import { SearchBarComponent } from "@/components/Manage/SearchBarComponent";
import { UserComponent } from "@/components/Manage/User/UserComponent";
import { UserItem } from "@/types/manage";
import { UserPermissionConstant } from "@/utils/constant";
import { validateSearchParams } from "@/utils/string";
import { StatusCodes } from "http-status-codes";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading } from "@/components/Others/Loading";
import { apiService } from "@/app/apiService/apiService";
import { getAccessToken } from "@/app/apiService/cookies";
import { getPermissions } from "@/utils/access-utils";
import { RoleFilterComponent } from "@/components/Manage/User/RoleFilterComponent";

export const metadata: Metadata = {
   title: 'Người dùng',
}

const validateRoleParam = (params: any) => {
   const { role } = params;
   return ['guest', 'officer'].includes(role) ? role : undefined;
}

export default async function UserPage(props: { searchParams: Promise<any> }) {
   const permissions = await getPermissions();
   if (!permissions?.some((perm: string) => perm === UserPermissionConstant.MANAGE_USERS)) {
      redirect('/manage/document');
   }
   const searchParams = await props.searchParams;

   const { searchKey = '' } = searchParams;
   const { pageLimit, pageNumber } = validateSearchParams(searchParams);
   const role = validateRoleParam(searchParams);

   try {
      const token = await getAccessToken();
      const response = await apiService.get(`/user`, {
         searchKey, pageLimit, pageNumber, role
      }, {
         Authorization: `Bearer ${token}`,
      });
      if (response.status !== StatusCodes.OK) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau</span>
            </div>
         )
      }

      const usersData = await response.json();
      const users: UserItem[] = usersData.data.map((user: any) => ({
         id: user.id,
         fullName: user.fullName,
         email: user.email,
         role: user.role,
         authorityGroup: user.authorityGroup?.name,
         permissionDescription: user.authorityGroup?.description,
         isVerified: user.isVerified,
         isDisabled: user.isDisabled,
      }));
      const total = usersData.total;

      return (
         <Suspense fallback={<Loading />}>
            <div className="h-full w-full">
               <div className="flex pt-20 px-6 justify-between items-center">
                  <div className="flex gap-x-5 justify-start items-center">
                     <PageLimitComponent pageLimit={pageLimit} pageURI="/manage/user" />
                     <SearchBarComponent pageURI="/manage/user" initialSearch={searchKey} />
                     <RoleFilterComponent role={role || ''} />
                  </div>
                  <AddUserModal />
               </div>
               <div className="mt-3 flex flex-col relative px-6">
                  <UserComponent
                     users={users}
                     pageNumber={pageNumber}
                     pageLimit={pageLimit} />
                  <PaginationComponent
                     total={total}
                     pageLimit={pageLimit}
                     currentPage={pageNumber}
                     pageURI="/manage/user" />
               </div >
            </div>
         </Suspense>
      );
   } catch {
      return (
         <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <span>Có lỗi phía server. Vui lòng thử lại sau</span>
         </div>
      )
   }
};