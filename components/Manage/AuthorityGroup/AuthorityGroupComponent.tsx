'use client'
import { AuthorityGroupDetail } from "@/types/manage";
import React, { useState } from "react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank
} from "react-icons/md";
import { TbPointFilled, TbPoint } from "react-icons/tb";
import { RiCornerDownRightFill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { PermissionsConstant } from "@/utils/constant";
import { Checkbox } from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import { errorToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { AddAuthorityGroupModal } from "@/components/Manage/AuthorityGroup/AddAuthorityGroupModal";
import { EditAuthorityGroupModal } from "./EditAuthorityGroupModal";
import { DeleteAuthorityGroupModal } from "./DeleteAuthorityGroupModal";
import { apiService, apiServiceClient } from "@/app/apiService/apiService";


export function AuthorityGroupComponent({ authorityGroups }: { authorityGroups: AuthorityGroupDetail[] }) {
  const [selectedGroup, setSelectedGroup] = useState<AuthorityGroupDetail | null>(null);
  const router = useRouter();

  const handleSelectGroup = (id: number) => {
    const group = authorityGroups.find(g => g.id === id) || null;
    setSelectedGroup(group);
  };

  const togglePermission = (permissionId: number) => {
    if (!selectedGroup) return;
    let updatedPermissions;
    if (permissionId === 1) {
      updatedPermissions = selectedGroup.permissions.some(p => p.id === 1)
        ? selectedGroup.permissions.filter(p => p.id !== 1)
        : selectedGroup.permissions.some(p => p.id === 2)
          ? [...selectedGroup.permissions.filter(p => p.id !== 2), PermissionsConstant.find(p => p.id === 1)!]
          : [...selectedGroup.permissions, PermissionsConstant.find(p => p.id === 1)!];
    } else if (permissionId === 2) {
      updatedPermissions = selectedGroup.permissions.some(p => p.id === 2)
        ? selectedGroup.permissions.filter(p => p.id !== 2)
        : selectedGroup.permissions.some(p => p.id === 1)
          ? [...selectedGroup.permissions.filter(p => p.id !== 1), PermissionsConstant.find(p => p.id === 2)!]
          : [...selectedGroup.permissions, PermissionsConstant.find(p => p.id === 2)!];
    } else {
      updatedPermissions = selectedGroup.permissions.some(p => p.id === permissionId)
        ? selectedGroup.permissions.filter(p => p.id !== permissionId)
        : [...selectedGroup.permissions, PermissionsConstant.find(p => p.id === permissionId)!];
    }
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
    const data = {
      permissionIds: selectedGroup?.permissions.map((perm) => perm.id),
    };
    console.log(data);
    try {
      const response = await apiServiceClient.put(`/permission/${selectedGroup?.id}`, data);

      if (response.status === StatusCodes.NOT_FOUND) {
        errorToast('Có dữ liệu không tồn tại. Đang làm mới...');
        router.refresh();
        return;
      }

      successToast('Cập nhật thành công.');
      router.refresh();
      return;
    } catch (error) {
      errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
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
          <DeleteAuthorityGroupModal id={selectedGroup?.id} isDisabled={selectedGroup ? false : true} />
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
            onClick={deselectAllPermissions}
            className="flex justify-center items-center gap-1 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 dark:text-white px-2 py-1 rounded-sm shadow-sm">
            <MdOutlineCheckBoxOutlineBlank size={20} /> Hủy chọn tất cả
          </button>
        </div>
        {selectedGroup ?
          <ul className="space-y-2 py-2 flex flex-col gap-2">
            <li>
              <div className="flex gap-2"><TbPoint size={20} />Các quyền quản lý văn bản</div>
              <ul className="space-y-3 px-4">
                <li className="space-y-2">
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center justify-start gap-2">
                      <RiCornerDownRightFill size={20} />
                      <span>{PermissionsConstant[0].description}</span>
                    </div>
                    <Checkbox
                      type="checkbox"
                      isSelected={selectedGroup?.permissions.some(p => p.id === 1)}
                      onChange={() => togglePermission(1)}
                    />
                  </div>
                  <ul className="space-y-1 ps-5">
                    <li className="flex"><TbPointFilled />Quản lý cơ quan ban hành</li>
                    <li className="flex"><TbPointFilled />Quản lý lĩnh vực văn bản</li>
                    <li className="flex"><TbPointFilled />Quản lý loại văn bản</li>
                    <li className="flex"><TbPointFilled />Quản lý văn bản</li>
                  </ul>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center justify-start gap-2">
                    <RiCornerDownRightFill size={20} />
                    <span>{PermissionsConstant[1].description}</span>
                  </div>
                  <Checkbox
                    type="checkbox"
                    isSelected={selectedGroup?.permissions.some(p => p.id === 2)}
                    onChange={() => togglePermission(2)}
                  />
                </li>
              </ul>
            </li>
            <li>
              <div className="flex gap-2"><TbPoint size={20} />Các quyền quản lý hệ thống</div>
              <ul className="space-y-2 px-4">
                <li className="flex items-center justify-between space-y-2">
                  <div className="flex items-center justify-start gap-2">
                    <RiCornerDownRightFill size={20} />
                    <span>{PermissionsConstant[2].description}</span>
                  </div>
                  <Checkbox
                    type="checkbox"
                    isSelected={selectedGroup?.permissions.some(p => p.id === 3)}
                    onChange={() => togglePermission(3)}
                  />
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center justify-start gap-2">
                    <RiCornerDownRightFill size={20} />
                    <span>{PermissionsConstant[3].description}</span>
                  </div>
                  <Checkbox
                    type="checkbox"
                    isSelected={selectedGroup?.permissions.some(p => p.id === 4)}
                    onChange={() => togglePermission(4)}
                  />
                </li>
              </ul>
            </li>
          </ul> : (
            <></>
          )
        }
      </div>
    </div>
  );
}
