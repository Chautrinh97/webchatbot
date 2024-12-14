import axiosInstance from "@/app/apiService/axios";
import { AddUserModal } from "@/components/Manage/User/AddUserModal";
import { PageLimitComponent } from "@/components/Manage/PageLimitComponent";
import { PaginationComponent } from "@/components/Manage/PaginationComponent";
import { SearchBarComponent } from "@/components/Manage/SearchBarComponent";
import { UserComponent } from "@/components/Manage/User/UserComponent";
import { UserItem } from "@/types/manage";
import { getAuthorityGroup, UserRoleConstant } from "@/utils/constant";
import { validateSearchParams } from "@/utils/string";
import { StatusCodes } from "http-status-codes";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import queryString from "query-string";
import { Suspense } from "react";
import { Loading } from "@/components/Others/Loading";

export const metadata: Metadata = {
   title: 'Người dùng',
}

const fetchData = async (searchKey: string, pageLimit: number, pageNumber: number) => {
   const cookieStore = cookies();
   const accessToken = cookieStore.get("accessToken")?.value;
   const params = queryString.stringify({ searchKey, pageNumber, pageLimit });
   const response = await axiosInstance.get(`/user?${params}`,
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         withCredentials: true
      }
   );
   return response;
}
export default async function UserPage({ searchParams }: { searchParams: any }) {
   const role = cookies().get('role')?.value || UserRoleConstant.OFFICER;
   if (role !== UserRoleConstant.SUPERADMIN) {
      redirect('/manage/document');
   }

   const { searchKey = '' } = searchParams;
   const { pageLimit, pageNumber } = validateSearchParams(searchParams);

   try {
      const response = await fetchData(searchKey, pageLimit, pageNumber);
      if (response.status !== StatusCodes.OK) {
         return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3">
               <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
            </div>
         )
      }
      const users: UserItem[] = response.data.data.map((user: any) => ({
         id: user.id,
         fullName: user.fullName,
         email: user.email,
         authorityGroup: getAuthorityGroup(user.role, user.authorityGroup),
         isVerified: user.isVerified,
         isDisabled: user.isDisabled,
      }));
      const total = response.data.total;
      return (
         <Suspense fallback={<Loading />}>
            <div className="h-full w-full">
               <div className="flex pt-20 px-6 justify-between items-center">
                  <div className="flex gap-x-5 justify-start items-center">
                     <PageLimitComponent pageLimit={pageLimit} pageURI="/manage/user" />
                     <SearchBarComponent pageURI="/manage/user" initialSearch={searchKey} />
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
            <span>Có lỗi phía server. Vui lòng thử lại sau.</span>
         </div>
      )
   }
};