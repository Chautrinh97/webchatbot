import { DocumentItem } from "@/types/manage";
import { Checkbox } from '@nextui-org/react';
import { AttachFileButton } from "./AttachFileButton";
import { DocumentActionComponent } from "./DocumentActionComponent";
import { getSyncStatus } from "@/utils/string";
import { SyncActionButton } from "./SyncActionButton";

export const DocumentTable = ({ documents }: { documents: DocumentItem[] }) => {
   return (
      <>
         <div className="py-2 bg-blue-600 border border-gray-200 dark:border-neutral-500 text-white text-center font-bold text-[17px] uppercase rounded-t">
            Danh sách văn bản
         </div>
         <div className="w-full inline-block align-middle">
            <div className="border border-gray-300 dark:border-neutral-500 divide-y divide-gray-300 dark:divide-neutral-700">
               <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-700">
                  <thead className="bg-gray-200 dark:bg-neutral-700 text-[13px] text-neutral-800 dark:text-gray-200">
                     <tr className="divide-x divide-gray-300 dark:divide-neutral-500">
                        {/* <th scope="col" className="px-4 py-2 text-start font-medium uppercase">Số thứ tự</th> */}
                        <th scope="col" className="px-3 py-2 text-center font-semibold uppercase w-56">Tên văn bản</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase">Số hiệu</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase min-w-20 max-w-24">Lĩnh vực</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase min-w-24 max-w-28">Cơ quan ban hành</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase min-w-24 max-w-28">Loại văn bản</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase">Ngày ban hành</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase">Ngày hiệu lực</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase min-w-24 max-w-32">Trạng thái hiệu lực</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase min-w-24 max-w-28">Trạng thái đồng bộ</th>
                        <th scope="col" className="px-2 py-2 text-start font-semibold uppercase w-12">Tác vụ</th>
                     </tr>
                  </thead>
                  <tbody className="min-w-full divide-y divide-gray-200 dark:divide-neutral-600">
                     {documents.length > 0 ? (
                        <>
                           {documents.map((document, index) => (
                              < tr className="hover:bg-gray-100 dark:hover:bg-neutral-700/50 divide-x dark:divide-neutral-600" key={document.id}>
                                 {/* <td className="px-4 py-2 max-w-4 text-sm text-center font-semibold text-gray-800 dark:text-neutral-200">{pageLimit * (pageNumber - 1) + index + 1}</td> */}
                                 <td className="ps-4 pe-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.title}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.referenceNumber}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm font-medium text-gray-800 dark:text-neutral-200">{document.documentField}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.issuingBody}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.documentType}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.issuanceDate?.toLocaleDateString('en-GB')}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{document.effectiveDate?.toLocaleDateString('en-GB')}</td>
                                 <td className="px-2 py-2 whitespace-normal text-sm text-center text-gray-800 dark:text-neutral-200">
                                    {document.validityStatus ? "Còn hiệu lực" :
                                       <div className="flex flex-col gap-2">
                                          <p>Hết hiệu lực</p>
                                          <p>Từ {document.invalidDate?.toLocaleDateString('en-GB')}</p>
                                       </div>
                                    }
                                 </td>
                                 <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-800 dark:text-neutral-200">
                                    {getSyncStatus(document.syncStatus)}
                                 </td>
                                 <td className="px-2 py-2 my-2 text-center">
                                    <div className="flex flex-col justify-between gap-4 items-center">
                                       <AttachFileButton mimeType={document.mimeType} id={document.id} />
                                       <DocumentActionComponent key={document.id} id={document.id} />
                                       <SyncActionButton syncStatus={document.syncStatus} id={document.id} />
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </>
                     ) : (
                        <tr className="text-sm font-medium text-gray-800 dark:text-neutral-200 ">
                           <td colSpan={11} className="px-4 py-2">
                              Không có văn bản nào.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
}