'use client'
import axiosInstance from "@/app/apiService/axios";
import { MimeType } from "@/utils/constant";
import { errorToast } from "@/utils/toast";
import { FaFileWord, FaFilePdf } from "react-icons/fa";

export const AttachFileButton = ({ mimeType, id }: { mimeType: string, id: number }) => {
   const handleDownload = async () => {
      try {
         const response = await axiosInstance.get(`/document/download/${id}`, {
            // responseType: 'blob',
            withCredentials: true,
         });
         // const blob = new Blob([response.data], { type: mimeType });
         // const contentDisposition = response.headers['content-disposition'];
         // const fileName = contentDisposition.split('filename=')[1];
         // const url = window.URL.createObjectURL(blob);
         // const link = document.createElement('a');
         // link.href = url;
         // link.download = fileName;
         // document.body.appendChild(link);
         // link.click();
         // window.URL.revokeObjectURL(url);

         const URL = response.data.presignedUrl;
         window.open(URL, '_blank');
      } catch (error) {
         errorToast('Có lỗi khi tải về tệp đính kèm. Vui lòng thử lại sau.')
         return;
      }
   };
   if (mimeType === MimeType.PDF) {
      return (
         <button title="Tải về" onClick={handleDownload}>
            <FaFilePdf size={20} color="red" />
         </button>
      );
   }
   else {
      return (
         <button title="Tải về" onClick={handleDownload}>
            <FaFileWord size={20} color="blue" />
         </button>
      )
   }
}