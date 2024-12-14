'use client'
import { AuthorityGroupDetail } from "@/types/manage";
import React, { useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank
} from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { PermissionsConstant } from "@/utils/constant";
import { Checkbox } from "@nextui-org/react";
import axiosInstance from "@/app/apiService/axios";
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { AddAuthorityGroupModal } from "@/components/Manage/AuthorityGroup/AddAuthorityGroupModal";
import { EditAuthorityGroupModal } from "./EditAuthorityGroupModal";
import { DeleteAuthorityGroupModal } from "./DeleteAuthorityGroupModal";


export function AuthorityGroupComponent({ authorityGroups }: { authorityGroups: AuthorityGroupDetail[] }) {
  const [selectedGroup, setSelectedGroup] = useState<AuthorityGroupDetail | null>(null);
  const router = useRouter();

  const handleSelectGroup = (id: number) => {
    const group = authorityGroups.find(g => g.id === id) || null;
    setSelectedGroup(group);
  };

  const togglePermission = (permissionId: number) => {
    if (!selectedGroup) return;

    const updatedPermissions = selectedGroup.permissions.some(p => p.id === permissionId)
      ? selectedGroup.permissions.filter(p => p.id !== permissionId)
      : [...selectedGroup.permissions, PermissionsConstant.find(p => p.id === permissionId)!];

    setSelectedGroup({ ...selectedGroup, permissions: updatedPermissions });
  };

  const selectAllPermissions = () => {
    if (!selectedGroup) return;

    setSelectedGroup({ ...selectedGroup, permissions: [...PermissionsConstant] });
  };

  const deselectAllPermissions = () => {
    if (!selectedGroup) return;

    setSelectedGroup({ ...selectedGroup, permissions: [] });
  };

  const handleSaveChangePermissions = async () => {
    const data = JSON.stringify({
      permissionIds: selectedGroup?.permissions.map((perm) => perm.id),
    });
    console.log(data);
    try {
      const response = await axiosInstance.put(`/permission/${selectedGroup?.id}`, data, {
        withCredentials: true,
      });

      if (response.status === StatusCodes.NOT_FOUND) {
        errorToast('Có dữ liệu không tồn tại. Đang làm mới...');
        router.refresh();
        return;
      }

      successToast('Cập nhật thành công.');
      router.refresh();
      return;
    } catch (error) {
      errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
      return;
    }
  };

  return (
    <div className="flex min-h-full">
      {/* Sidebar: Groups */}
      <div className="border-r dark:border-neutral-500 bg-gray-100 dark:bg-neutral-700">
        <div className="flex justify-start gap-2 mb-2 p-4 transition duration-200 border-b dark:border-neutral-500">
          <AddAuthorityGroupModal />
          <EditAuthorityGroupModal id={selectedGroup?.id} isDisabled={selectedGroup ? false : true} />
          <DeleteAuthorityGroupModal id={selectedGroup?.id} isDisabled={selectedGroup ? false : true}/>
        </div>
        <ul className="space-y-2 px-4 pt-2">
          {authorityGroups.map((group) => (
            <li
              key={group.id}
              className={`cursor-pointer px-3 py-2 rounded ${selectedGroup?.id === group.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-300"
                }`}
              onClick={() => handleSelectGroup(group.id)}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Permissions */}
      <div className="p-4 divide-y dark:divide-neutral-500">
        {selectedGroup ? (
          <div className="mb-2">
            <h2 className="text-lg font-semibold mb-2">
              Phân quyền sử dụng: {selectedGroup?.name}
            </h2>
            <p className="text-md">{selectedGroup?.description}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Phân quyền sử dụng theo nhóm.
            </h2>
          </div>
        )}
        <div className="flex justify-start items-center gap-2 py-3">
          <button
            disabled={selectedGroup ? false : true}
            onClick={handleSaveChangePermissions}
            className="flex justify-center items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-sm shadow-sm">
            <FaSave size={20} /> Lưu
          </button>
          <button
            disabled={selectedGroup ? false : true}
            onClick={selectAllPermissions}
            className="flex justify-center items-center gap-1 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 dark:text-white px-2 py-1 rounded-sm shadow-sm">
            <MdOutlineCheckBox size={20} /> Chọn tất cả
          </button>
          <button
            disabled={selectedGroup ? false : true}
            onClick={deselectAllPermissions}
            className="flex justify-center items-center gap-1 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 dark:text-white px-2 py-1 rounded-sm shadow-sm">
            <MdOutlineCheckBoxOutlineBlank size={20} /> Hủy chọn
          </button>
        </div>
        {selectedGroup ?
          <ul className="space-y-1 py-2 flex flex-col gap-2">
            {PermissionsConstant.map((perm) => (
              <li key={perm.id} className="flex items-center justify-between">
                <span>{perm.description}</span>
                <Checkbox
                  type="checkbox"
                  isSelected={selectedGroup?.permissions.some(p => p.id === perm.id)}
                  onChange={() => togglePermission(perm.id)}
                />
              </li>
            ))}
          </ul> : (
            <></>
          )
        }
      </div>
    </div>
  );
}
