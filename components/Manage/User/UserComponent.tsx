import { UserItem } from "@/types/manage";
import { EditUserModal } from './EditUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UpdateUserStatusButton } from "./UpdateUserStatusButton";
import { UserRoleConstant } from "@/utils/constant";

export const UserComponent = ({ users, pageNumber, pageLimit }: { users: UserItem[], pageNumber: number, pageLimit: number }) => {
   return (
      <>
         <div className="py-2 bg-blue-600 border border-gray-200 dark:border-neutral-500 text-white text-center font-medium text-[17px] uppercase rounded-t">
            Danh sách người dùng
         </div>
         <div className="w-full inline-block align-middle">
            <div className="border border-gray-300 dark:border-neutral-500 divide-y divide-gray-300 dark:divide-neutral-700">
               <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-700">
                  <thead className="bg-gray-200 dark:bg-neutral-700 text-[14px] text-neutral-800 dark:text-gray-200 sticky top-0">
                     <tr className="divide-x divide-gray-300 dark:divide-neutral-500">
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase w-3">Số thứ tự</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase w-44">Tên người dùng</th>
                        <th scope="col" className="px-3 py-3 text-center font-medium uppercase">Email</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase">Vai trò</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase">Nhóm quyền</th>
                        <th scope="col" className="px-3 py-3 text-center font-medium uppercase">Mô tả quyền</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase w-32">Email đã xác minh?</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase w-28">Trạng thái tài khoản</th>
                        <th scope="col" className="px-3 py-3 text-start font-medium uppercase w-2">Tác vụ</th>
                     </tr>
                  </thead>
                  <tbody className="min-w-full divide-y divide-gray-200 dark:divide-neutral-600">
                     {users?.length ? (
                        <>
                           {users.map((user, index) => (
                              <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700/50 divide-x dark:divide-neutral-600" key={user.id}>
                                 <td className="px-4 py-4 whitespace-normal text-sm font-semibold text-gray-800 dark:text-neutral-200">{pageLimit * (pageNumber - 1) + index + 1}</td>
                                 <td className="px-3 py-4 whitespace-normal text-sm font-medium text-gray-800 dark:text-neutral-200">{user.fullName}</td>
                                 <td className="px-3 py-4 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{user.email}</td>
                                 <td className="px-3 py-4 whitespace-normal text-sm font-medium text-gray-800 dark:text-neutral-200">{user.role === UserRoleConstant.GUEST ? 'Khách': "Cán bộ, nhân viên"}</td>
                                 <td className="px-3 py-4 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{user.authorityGroup}</td>
                                 <td className="px-3 py-4 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{user.permissionDescription}</td>
                                 <td className="px-3 py-4 whitespace-normal text-center text-sm text-gray-800 dark:text-neutral-200">
                                    {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    {user.isDisabled ? "Bị vô hiệu" : "Bình thường"}
                                 </td>
                                 <td className="px-3 py-4 my-2 text-center">
                                    <div className="flex flex-col justify-between items-center gap-3">
                                       <EditUserModal id={user.id} />
                                       <DeleteUserModal id={user.id} />
                                       <UpdateUserStatusButton id={user.id} isDisabled={user.isDisabled} />
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </>
                     ) : (
                        <tr className="whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 ">
                           <td colSpan={7} className="px-6 py-4">
                              Không có người dùng nào.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div></>
   );
}