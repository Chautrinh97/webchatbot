import axiosInstance from "@/app/apiService/axios";
import { DocumentTypeComponent } from "@/components/Manage/PositionComponent";
import { getCookie } from "@/utils/cookie";
import { Metadata } from "next";
export const metadata: Metadata = {
   title: 'Chức danh',
}
export default async function PositionPage() {
   return (
      <DocumentTypeComponent />
   );
};