'use client'
import { apiServiceClient } from "@/app/apiService/apiService";
import { MimeType } from "@/utils/constant";
import { errorToast } from "@/utils/toast";
import { Tooltip } from "@nextui-org/react";
import { FaFileWord, FaFilePdf } from "react-icons/fa";

export const AttachFileButton = ({ mimeType, id }: { mimeType: string, id: number }) => {
   const handleDownload = async () => {
      try {
         const response = await apiServiceClient.get(`/document/download/${id}`, {
            // responseType: 'blob',
         });
         /* const blob = new Blob([response.data], { type: mimeType });
         const contentDisposition = response.headers['content-disposition'];
         const fileName = contentDisposition.split('filename=')[1];
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         window.URL.revokeObjectURL(url); */

         const URL = (await response.json()).url;
         window.open(URL, '_blank');
      } catch (error) {
         errorToast('Có lỗi khi tải về tệp đính kèm. Vui lòng thử lại sau')
         return;
      }
   };
   return (
      <>
         <Tooltip content='Xem đính kèm' placement={'left'}>
            <button onClick={handleDownload} className="hover:animate-bounceupdown">
               {mimeType === MimeType.PDF
                  ? <FaFilePdf size={20} color="red" />
                  : <FaFileWord size={20} color="blue" />}
            </button>
         </Tooltip>
      </>
   );
}