'use client';
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbEdit, TbPlus } from "react-icons/tb";
import { DocumentFormSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/app/apiService/axios";
import { errorToast, successToast } from "@/utils/toast";
import { MdEditDocument } from "react-icons/md";
import {
   Button,
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   useDisclosure,
   Divider,
} from "@nextui-org/react";
import { useState } from "react";
import { DocumentProperty } from "@/types/chat";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";

type EditDocumentForm = z.TypeOf<typeof DocumentFormSchema>;
export const EditDocumentModal = ({ id }: { id: number }) => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [issuingBodies, setIssuingBodies] = useState<DocumentProperty[]>([]);
   const [documentTypes, setDocumentTypes] = useState<DocumentProperty[]>([]);
   const [documentFields, setDocumentFields] = useState<DocumentProperty[]>([]);
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm<EditDocumentForm>({
      resolver: zodResolver(DocumentFormSchema),
   });

   const fetchIssuingBodies = async () => {
      const response = await axiosInstance.get('/issuing-body',
         {
            params: {
               isExport: true,
            },
            withCredentials: true
         });
      const result = response.data.data;
      setIssuingBodies(result);
   }
   const fetchDocumentTypes = async () => {
      const response = await axiosInstance.get('/document-type',
         {
            params: {
               isExport: true,
            },
            withCredentials: true
         });
      const result = response.data.data;
      setDocumentTypes(result);
   }
   const fetchDocumentFields = async () => {
      const response = await axiosInstance.get('/document-field',
         {
            params: {
               isExport: true,
            },
            withCredentials: true
         });
      const result = response.data.data;
      setDocumentFields(result);
   }

   const formatDate = (date: string) => {
      const localeDate = new Date(date).toLocaleDateString('en-GB').split('/');
      return `${localeDate[2]}-${localeDate[1]}-${localeDate[0]}`;
   }
   const fetchDocument = async () => {
      const response = await axiosInstance.get(`/document/${id}`, { withCredentials: true });
      const result = response.data;
      setValue('title', result.title);
      setValue('referenceNumber', result.referenceNumber);
      setValue('issuanceDate', result.issuanceDate ? formatDate(result.issuanceDate) : "");
      setValue('effectiveDate', result.effectiveDate ? formatDate(result.effectiveDate) : "");
      setValue('isPublic', result.isPublic ? "true" : "false");
      setValue('isRegulatory', result.isRegulatory ? "true" : "false");
      setValue('validityStatus', result.validityStatus ? "true" : "false");
      setValue('issuingBody', result.issuingBody?.id);
      setValue('documentField', result.documentField?.id);
      setValue('documentType', result.documentType?.id);
   }

   const handleOpenModal = async () => {
      try {
         await fetchDocumentFields();
         await fetchDocumentTypes();
         await fetchIssuingBodies();
         await fetchDocument();
         onOpen();
      }
      catch (error) {
         errorToast('Có lỗi xảy ra, vui lòng thử lại sau');
         onClose();
         return;
      }
   }

   const onSubmit: SubmitHandler<EditDocumentForm> = async (data) => {
      const { file, ...santizedData } = data;
      let formData = {};
      try {
         const formFile = new FormData();
         if (file?.[0]) {
            formFile.append('file', file?.[0]);
            const responseUpload = await axiosInstance.post(`/document/upload`, formFile, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
               withCredentials: true,
            });
            const key = responseUpload.data.key;
            formData = {
               ...santizedData,
               mimeType: file?.[0].type,
               documentSize: file?.[0].size,
               key: key,
               isNewAttachFile: true,
            };
         }
         else {
            formData = {
               ...santizedData,
               isNewAttachFile: false,
            }
         }

         const response = await axiosInstance.put(`/document/${id}`,
            JSON.stringify(formData),
            {
               withCredentials: true,
            }
         );

         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Tồn tại dữ liệu không tìm thấy, đang tải lại.');
            onClose();
            router.refresh();
            return;
         }
         else if (response.status !== StatusCodes.OK) {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
            onClose();
            router.refresh();
            return;
         }

         successToast('Cập nhật thành công.');
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau.');
         onClose();
         return;
      }
   }

   return (
      <>
         <button
            onClick={handleOpenModal}
            title="Cập nhật"
            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">
            <TbEdit size={20} />
         </button>
         <Modal
            size="4xl"
            isOpen={isOpen}
            onClose={onClose}
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => {
                  return (
                     <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                           <ModalHeader className="flex items-center gap-2 bg-blue-600 text-white">
                              <MdEditDocument size={24} /> Cập nhật tài liệu
                           </ModalHeader>
                           <Divider />
                           <ModalBody>
                              <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 my-2 divide-x divide-neutral-200">
                                 <div className="grid sm:grid-cols-12 gap-2 sm:gap-2 my-2">
                                    <div className="sm:col-span-4">
                                       <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tên tài liệu
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <textarea
                                             {...register("title")}
                                             className="py-2 px-3 block w-full bg-gray-100 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             rows={3}
                                             placeholder="Nhập tên tài liệu"></textarea>
                                       </div>
                                       {errors.title?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.title?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="referenceNumber" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Số hiệu
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <input
                                             {...register("referenceNumber")}
                                             type="text"
                                             className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             placeholder={`Nhập số hiệu tài liệu`} />
                                       </div>
                                       {errors.referenceNumber?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.referenceNumber?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4 flex items-center">
                                       <label htmlFor="issuingBody" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Cơ quan ban hành
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex items-center mt-2.5">
                                       <select
                                          className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('issuingBody')}>
                                          <option value="">Chọn cơ quan</option>
                                          {issuingBodies.map((issuingBody) => (
                                             <option key={issuingBody.id} value={issuingBody.id}>
                                                {issuingBody.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="sm:col-span-4 flex items-center">
                                       <label htmlFor="documentField" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Lĩnh vực
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex items-center mt-2.5">
                                       <select
                                          className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('documentField')}>
                                          <option value="">Chọn lĩnh vực</option>
                                          {documentFields.map((documentField) => (
                                             <option key={documentField.id} value={documentField.id}>
                                                {documentField.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="sm:col-span-4 flex items-center">
                                       <label htmlFor="documentType" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Loại tài liệu
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex items-center mt-2.5">
                                       <select className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('documentType')}>
                                          <option value="">Chọn loại tài liệu</option>
                                          {documentTypes.map((documentType) => (
                                             <option key={documentType.id} value={documentType.id}>
                                                {documentType.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                 </div>
                                 <div className="grid sm:grid-cols-12 gap-4 sm:gap-6 my-2 ps-4">
                                    <div className="sm:col-span-4">
                                       <label htmlFor="issuingDate" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Ngày ban hành
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <input
                                             {...register("issuanceDate")}
                                             type="date"
                                             className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             placeholder={`Chọn ngày ban hành `} />
                                       </div>
                                       {errors.issuanceDate?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.issuanceDate?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="effectiveDate" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Ngày hiệu lực
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <input
                                             {...register("effectiveDate")}
                                             type="date"
                                             className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             placeholder={`Chọn ngày hiệu lực`} />
                                       </div>
                                       {errors.effectiveDate?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.effectiveDate?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="isRegulatory" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Văn bản pháp quy?
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex justify-start items-center mt-2.5 ms-3">
                                       <div className="flex items-center me-4">
                                          <input id="is-regulatory-yes" type="radio" value="true" {...register('isRegulatory')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="is-regulatory-yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Có</label>
                                       </div>
                                       <div className="flex items-center me-4">
                                          <input id="is-regulatory-yes-no" type="radio" value="false" {...register('isRegulatory')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="is-regulatory-no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Không</label>
                                       </div>
                                       {errors.isRegulatory?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.isRegulatory?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="isPublic" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tài liệu công khai?
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex justify-start items-center mt-2.5 ms-3">
                                       <div className="flex items-center me-4">
                                          <input id="is-public-yes" type="radio" value="true" {...register('isPublic')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="is-public-yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Có</label>
                                       </div>
                                       <div className="flex items-center me-4">
                                          <input id="is-public-no" type="radio" value="false" {...register('isPublic')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="is-public-no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Không</label>
                                       </div>
                                       {errors.isPublic?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.isPublic?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="validityStatus" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Trạng thái hiệu lực
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 flex justify-start items-center mt-2.5 ms-3">
                                       <div className="flex items-center me-4">
                                          <input id="validity-status-yes" type="radio" value="true" {...register('validityStatus')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="validity-status-yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Còn hiệu lực</label>
                                       </div>
                                       <div className="flex items-center me-4">
                                          <input id="validity-status-no" type="radio" value="false" {...register('validityStatus')}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                          <label htmlFor="validity-status-no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hết hiệu lực</label>
                                       </div>
                                       {errors.validityStatus?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.validityStatus?.message}
                                          </div>}
                                    </div>
                                    <div className="sm:col-span-4">
                                       <label htmlFor="file" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tệp đính kèm
                                       </label>
                                    </div>
                                    <div className="sm:col-span-8 mt-2.5">
                                       <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                          type="file"
                                          required
                                          {...register('file')} />
                                       <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">.doc, .docx, .pdf (Tối đa 10MB).</p>
                                       {errors.file?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.file?.message.toString()}
                                          </div>}
                                    </div>
                                 </div>
                              </div>
                           </ModalBody>
                           <Divider />
                           <ModalFooter>
                              <Button type="submit" className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                 Tiếp tục
                              </Button>
                              <Button color="danger" className="rounded-md" variant="light" onPress={onClose}>
                                 Đóng
                              </Button>
                           </ModalFooter>
                        </form>
                     </>
                  );
               }}
            </ModalContent>
         </Modal>
      </>
   );
}