'use client';
import { SubmitHandler, useForm } from "react-hook-form";
import { TbAlertCircle, TbPlus } from "react-icons/tb";
import { TiDocumentAdd } from "react-icons/ti";
import { DocumentFormSchema } from "@/types/validation";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { basicToast, errorToast, successToast } from "@/utils/toast";
import {
   Button,
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   useDisclosure,
   Divider,
   Tooltip,
   Input,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { DocumentProperty } from "@/types/chat";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import { useUserStore } from "@/app/store/user.store";
import { MimeType, UserPermissionConstant } from "@/utils/constant";
import { apiServiceClient } from "@/app/apiService/apiService";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { renderAsync } from 'docx-preview';

type AddDocumentForm = z.TypeOf<typeof DocumentFormSchema>;
export const AddDocumentModal = () => {
   const router = useRouter();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [issuingBodies, setIssuingBodies] = useState<DocumentProperty[]>([]);
   const [documentTypes, setDocumentTypes] = useState<DocumentProperty[]>([]);
   const [documentFields, setDocumentFields] = useState<DocumentProperty[]>([]);
   const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean>(false);
   const [isPreview, setIsPreview] = useState<boolean>(false);
   const [file, setFile] = useState<any>(undefined);
   const [url, setUrl] = useState<string>('');
   const [isSyncAction, setIsSyncAction] = useState<boolean>(true);
   const wordPreview = useRef<any>(null);
   const {
      register,
      handleSubmit,
      reset,
      watch,
      clearErrors,
      setError,
      setValue,
      formState: { errors },
   } = useForm<AddDocumentForm>({
      resolver: zodResolver(DocumentFormSchema),
      defaultValues: {
         isRegulatory: "true",
         validityStatus: "true",
      }
   });
   const isValid = watch('validityStatus');
   const { user } = useUserStore();
   const hasPermission = user.permissions?.some((permission) =>
      permission === UserPermissionConstant.MANAGE_ALL_DOCUMENTS ||
      permission === UserPermissionConstant.MANAGE_OWN_DOCUMENTS);

   const documentType = watch('documentType');
   const issuingBody = watch('issuingBody');
   const documentField = watch('documentField');

   const generateReferenceNumber = () => {
      const typeAcronym = documentTypes.find((t) => t.id == documentType)?.acronym || '';
      const issuingBodyAcronym = issuingBodies.find((ib) => ib.id == issuingBody)?.acronym || '';
      const fieldAcronym = documentFields.find((f) => f.id == documentField)?.acronym || '';
      const parts = [typeAcronym, issuingBodyAcronym, fieldAcronym].filter((part) => part != '');
      return `${parts.join('-')}`;
   };

   useEffect(() => {
      const refNumber = generateReferenceNumber();
      setValue('referenceNumber', refNumber);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [documentType, issuingBody]);

   const handleOpenModal = async () => {
      try {
         const responseDocumentField = await apiServiceClient.get(`/document-field`, {
            isExport: true,
         });
         const responseDocumentType = await apiServiceClient.get(`/document-type`, {
            isExport: true,
         });
         const responseIssuingBody = await apiServiceClient.get(`/issuing-body`, {
            isExport: true,
         });

         if (responseDocumentField.status !== StatusCodes.OK ||
            responseDocumentType.status !== StatusCodes.OK ||
            responseIssuingBody.status !== StatusCodes.OK
         ) {
            errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
            return;
         }
         setDocumentFields((await responseDocumentField.json()).data);
         setDocumentTypes((await responseDocumentType.json()).data);
         setIssuingBodies((await responseIssuingBody.json()).data);
         onOpen();
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         return;
      }
   }

   const onSubmit: SubmitHandler<AddDocumentForm> = async (data) => {
      const { files, ...santizedData } = data;

      const formFile = new FormData();
      formFile.append('file', files?.[0]);

      try {
         if (isSyncAction) {
            if (data.validityStatus === "false") {
               setError('validityStatus', { message: 'Văn bản hết hiệu lực. Không thể thêm và đồng bộ.' });
               return;
            }
         }
         const maxSize = files?.[0].type === "application/pdf" ? 10 * 1024 * 1024 : 200 * 1024;
         if (files?.[0].size > maxSize) {
            setError("files", {
               message: files?.[0].type === "application/pdf"
                  ? "Kích thước file PDF không được vượt quá 10MB."
                  : "Kích thước file Word không được vượt quá 200KB."
            });
            return;
         }
         const responseUpload = await apiServiceClient.post(`/document/upload`, formFile);
         if (responseUpload.status !== StatusCodes.OK) {
            errorToast('Có lỗi trong quá trình upload văn bản. Vui lòng thử lại sau');
            onClose();
            return;
         }

         const key = (await responseUpload.json()).key;
         let formData;
         if (isSyncAction) {
            formData = {
               ...santizedData,
               mimeType: files?.[0].type,
               documentSize: files?.[0].size,
               key: key,
               isSync: true,
            };
         } else {
            formData = {
               ...santizedData,
               mimeType: files?.[0].type,
               documentSize: files?.[0].size,
               key: key,
               isSync: false,
            };
         }
         if (data.validityStatus === "true") {
            formData = {
               ...formData,
               invalidDate: undefined,
            }
         }
         const response = await apiServiceClient.post('/document/', formData);
         if (response.status === StatusCodes.NOT_FOUND) {
            errorToast('Dữ liệu không tồn tại. Đang tải lại...');
            onClose();
            router.refresh();
            return;
         }
         if (isSyncAction)
            basicToast('Văn bản đã được thêm đang đồng bộ. Vui lòng đợi');
         else
            successToast('Thêm thành công');
         setIsSubmitSuccessful(true);
         onClose();
         router.refresh();
         return;
      } catch {
         errorToast('Có lỗi xảy ra. Vui lòng thử lại sau');
         onClose();
         return;
      }
   }

   useEffect(() => {
      if (!isSubmitSuccessful) return;
      reset();
      setIsSubmitSuccessful(false);
      setIsPreview(false);
      setFile(undefined);
      setUrl('');
   }, [isSubmitSuccessful, reset]);

   const handleCloseModal = () => {
      reset();
      clearErrors();
      setIsPreview(false);
      setFile(undefined);
      setUrl('');
      onClose();
   }

   const handleTogglePreview = async () => {
      if (!file) {
         setError('files', { message: 'Vui lòng chọn tệp để xem trước' });
         return;
      }
      if (!isPreview) {
         setIsPreview(!isPreview);
         if (file.type !== "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            renderAsync(arrayBuffer, wordPreview.current);
         } else {
            setUrl(URL.createObjectURL(file));
         }
      }
      else setIsPreview(!isPreview);
   }

   const handleSelectedFile = (e: any) => {
      clearErrors('files');
      if (e.target.files && e.target.files.length > 0) {
         setFile(e.target.files[0]);
         setIsPreview(false);
      }
      else {
         setUrl('');
         setIsPreview(false);
         setFile(undefined);
      }
   }

   return (
      <>
         {hasPermission &&
            <button className="flex gap-2 p-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
               onClick={handleOpenModal}>
               <TbPlus size={20} /> Thêm văn bản
            </button>
         }
         <Modal
            backdrop="blur"
            size="full"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={true}
            scrollBehavior="outside"
         >
            <ModalContent className="bg-white dark:bg-neutral-800">
               {(onClose) => {
                  return (
                     <>
                        <ModalHeader className="flex items-center gap-1 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 border border-blue-600 text-white">
                           <TiDocumentAdd size={24} />Thêm văn bản mới
                        </ModalHeader>
                        <ModalBody className="flex flex-row relative justify-center items-center py-0">
                           <form onSubmit={handleSubmit(onSubmit)} id="submitAddForm"
                              className={`flex h-full w-1/2 justify-center px-2 border-y-5 border-gray-400 dark:border-neutral-600 transition-transform duration-500 ease-in-out
                              ${isPreview ? '-translate-x-1/2' : 'translate-x-0'}`}>
                              <div className='flex gap-3'>
                                 <div className="grid grid-cols-8 gap-6 my-2 mr-2">
                                    <div className="col-span-2 mt-4">
                                       <label htmlFor="name" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tên văn bản
                                       </label>
                                    </div>
                                    <div className="col-span-6 mt-4">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <textarea
                                             {...register("title")}
                                             className="py-2 px-3 block w-full bg-gray-100 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             rows={3}
                                             placeholder="Nhập tên văn bản"></textarea>
                                       </div>
                                       {errors.title?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.title?.message}
                                          </div>}
                                    </div>
                                    <div className="col-span-2">
                                       <label htmlFor="referenceNumber" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Số hiệu
                                       </label>
                                    </div>
                                    <div className="col-span-6">
                                       <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                          <input
                                             {...register("referenceNumber")}
                                             type="text"
                                             className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                             placeholder={`Nhập số hiệu văn bản`} />
                                       </div>
                                       {errors.referenceNumber?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.referenceNumber?.message}
                                          </div>}
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                       <label htmlFor="issuingBody" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Cơ quan ban hành
                                       </label>
                                    </div>
                                    <div className="col-span-6 flex items-center mt-2.5">
                                       <select
                                          className="border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('issuingBody')}>
                                          <option value="">Chọn cơ quan</option>
                                          {issuingBodies.map((issuingBody) => (
                                             <option key={issuingBody.id} value={issuingBody.id}>
                                                {issuingBody.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                       <label htmlFor="documentField" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Lĩnh vực
                                       </label>
                                    </div>
                                    <div className="col-span-6 flex items-center mt-2.5">
                                       <select
                                          className="border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('documentField')}>
                                          <option value="">Chọn lĩnh vực</option>
                                          {documentFields.map((documentField) => (
                                             <option key={documentField.id} value={documentField.id}>
                                                {documentField.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                       <label htmlFor="documentType" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Loại văn bản
                                       </label>
                                    </div>
                                    <div className="col-span-6 flex items-center mt-2.5">
                                       <select className="border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          {...register('documentType')}>
                                          <option value="">Chọn loại văn bản</option>
                                          {documentTypes.map((documentType) => (
                                             <option key={documentType.id} value={documentType.id}>
                                                {documentType.name}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div className="col-span-2">
                                       <label htmlFor="issuingDate" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Ngày ban hành
                                       </label>
                                    </div>
                                    <div className="col-span-6">
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
                                    <div className="col-span-2">
                                       <label htmlFor="effectiveDate" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Ngày hiệu lực
                                       </label>
                                    </div>
                                    <div className="col-span-6">
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
                                 </div>
                                 <Divider orientation="vertical" />
                                 <div className="grid grid-cols-6 gap-5 my-2 px-2 pt-4 content-start">
                                    <div className="col-span-2">
                                       <label htmlFor="isRegulatory" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tính pháp quy
                                       </label>
                                    </div>
                                    <div className="col-span-4 flex flex-col ms-3">
                                       <div className="flex mt-2.5 me-4 items-start">
                                          <input id="is-regulatory-yes" type="radio" value="true" {...register('isRegulatory')}
                                             className="w-4 h-4" />
                                          <label htmlFor="is-regulatory-yes" className="ms-2 text-sm font-medium">Văn bản pháp quy</label>
                                       </div>
                                       <div className="flex mt-2.5 items-start me-4">
                                          <input id="is-regulatory-yes-no" type="radio" value="false" {...register('isRegulatory')}
                                             className="w-4 h-4" />
                                          <label htmlFor="is-regulatory-no" className="ms-2 text-sm font-medium">Tài liệu thông thường</label>
                                       </div>
                                    </div>
                                    <div className="col-span-2">
                                       <label htmlFor="validityStatus" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Trạng thái hiệu lực
                                       </label>
                                    </div>
                                    <div className="col-span-4 flex flex-col ms-3">
                                       <div>
                                          <div className="flex items-start mt-2.5 me-4">
                                             <input id="validity-status-yes" type="radio" value="true" {...register('validityStatus')}
                                                className="w-4 h-4" />
                                             <label htmlFor="validity-status-yes" className="ms-2 text-sm font-medium">Còn hiệu lực</label>
                                          </div>
                                          <div className="flex items-start mt-2.5 me-4">
                                             <input id="validity-status-no" type="radio" value="false" {...register('validityStatus')}
                                                className="w-4 h-4" />
                                             <label htmlFor="validity-status-no" className="ms-2 text-sm font-medium">Hết hiệu lực</label>
                                          </div>
                                       </div>
                                       {errors.validityStatus?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.validityStatus?.message}
                                          </div>}
                                    </div>
                                    {isValid === "false" &&
                                       <>
                                          <div className="col-span-2">
                                             <label htmlFor="validityStatus" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                                Ngày hết hiệu lực
                                             </label>
                                          </div><div className="col-span-4">
                                             <div className="border border-gray-500 dark:border-neutral-600 rounded-md">
                                                <input
                                                   {...register("invalidDate")}
                                                   type="date"
                                                   className="py-2 px-3 block w-full bg-gray-100 text-sm rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                   placeholder={`Chọn ngày hết hiệu lực`} />
                                             </div>
                                             {errors.invalidDate?.message &&
                                                <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                                   <TbAlertCircle className="me-1" /> {errors.invalidDate?.message}
                                                </div>}
                                          </div>
                                       </>
                                    }
                                    <div className="col-span-2">
                                       <label htmlFor="file" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                          Tệp đính kèm
                                       </label>
                                       <div className="text-center">
                                          {!isPreview ? (
                                             <Tooltip content='Hiện xem trước' placement='bottom-start'>
                                                <button
                                                   type='button'
                                                   onClick={handleTogglePreview}
                                                   className="flex items-center justify-center rounded-full h-6 w-6 text-sm 
                                                   hover:bg-gray-300 dark:hover:bg-neutral-700">
                                                   <FaRegEye size={16} />
                                                </button>
                                             </Tooltip>) : (
                                             <Tooltip content='Ẩn xem trước' placement='bottom-start'>
                                                <button
                                                   type='button'
                                                   onClick={handleTogglePreview}
                                                   className="flex items-center justify-center rounded-full h-6 w-6 text-sm 
                                                   hover:bg-gray-300 dark:hover:bg-neutral-700">
                                                   <FaRegEyeSlash size={16} />
                                                </button>
                                             </Tooltip>
                                          )}
                                       </div>
                                    </div>
                                    <div className="col-span-4 mt-2.5">
                                       <Input
                                          type="file"
                                          className="w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                          size="sm"
                                          accept=".doc,.docx,.pdf"
                                          required
                                          {...register('files')}
                                          onChange={(e) => handleSelectedFile(e)} />
                                       {errors.files?.message &&
                                          <div className="ps-2 flex text-[11px] text-red-600 py-2">
                                             <TbAlertCircle className="me-1" /> {errors.files?.message.toString()}
                                          </div>}
                                    </div>
                                 </div>
                              </div>
                           </form>
                           {isPreview &&
                              < div
                                 ref={wordPreview}
                                 className="w-[700px] absolute right-5 h-[600px] overflow-auto px-4 mx-2 border rounded-md">
                                 {file.type === MimeType.PDF &&
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                       <Viewer fileUrl={url} />;
                                    </Worker>
                                 }
                              </div>
                           }
                        </ModalBody >
                        <Divider />
                        <ModalFooter>
                           <Button
                              type="submit"
                              form="submitAddForm"
                              onPress={() => setIsSyncAction(true)}
                              className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Thêm mới và đồng bộ
                           </Button>
                           <Button
                              type="submit"
                              form="submitAddForm"
                              onPress={() => setIsSyncAction(false)}
                              className="rounded-md text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Chỉ thêm mới
                           </Button>
                           <Button color="danger" className="rounded-md" variant="light" onPress={handleCloseModal}>
                              Đóng
                           </Button>
                        </ModalFooter>
                     </>
                  );
               }}
            </ModalContent>
         </Modal >
      </>
   );
}