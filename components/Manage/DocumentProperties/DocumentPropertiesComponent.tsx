import { DocumentProperty } from "@/types/chat";
import { EditDocumentPropertiesModal } from "./EditDocumentPropertiesModal";
import { DeleteDocumentPropertiesModal } from "./DeleteDocumentPropertiesModal";
import { DocumentPropertiesActionComponent } from "./DocumentPropertiesActionComponent";

export const DocumentPropertiesComponent = (
   {
      properties,
      propertyAPIURI,
      propertyText,
      propertyPermission,
      pageNumber,
      pageLimit,
   }: {
      properties: DocumentProperty[],
      propertyAPIURI: string,
      propertyText: string,
      propertyPermission: string,
      pageNumber: number,
      pageLimit: number
   }
) => {
   return (
      <>
         <div className="py-2 bg-blue-600 border border-gray-200 dark:border-neutral-500 text-white text-center font-medium text-[17px] uppercase rounded-t">
            Danh sách {propertyText}
         </div>
         <div className="w-full inline-block align-middle">
            <div className="border border-gray-300 dark:border-neutral-500 divide-y divide-gray-300 dark:divide-neutral-700">
               <table className="min-w-full divide-y divide-gray-300 dark:divide-neutral-700">
                  <thead className="bg-gray-200 dark:bg-neutral-700 text-[14px] text-neutral-800 dark:text-gray-200 sticky top-0">
                     <tr className="divide-x divide-gray-300 dark:divide-neutral-500">
                        <th scope="col" className="px-6 py-3 text-start font-medium uppercase w-2">Số thứ tự</th>
                        <th scope="col" className="px-6 py-3 text-start font-medium uppercase w-96">Tên</th>
                        <th scope="col" className="px-6 py-3 text-start font-medium uppercase">Mô tả</th>
                        <th scope="col" className="px-6 py-3 text-start font-medium uppercase w-20">Tác vụ</th>
                     </tr>
                  </thead>
                  <tbody className="min-w-full divide-y divide-gray-200 dark:divide-neutral-500">
                     {properties?.length ? (
                        <>
                           {properties.map((property, index) => (
                              <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700/50 divide-x dark:divide-neutral-500" key={property.id}>
                                 <td className="px-12 py-4 whitespace-normal text-sm font-semibold text-gray-800 dark:text-neutral-200">{pageLimit * (pageNumber - 1) + index + 1}</td>
                                 <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-800 dark:text-neutral-200">{property.name}</td>
                                 <td className="px-6 py-4 whitespace-normal text-sm text-gray-800 dark:text-neutral-200">{property.description}</td>
                                 <td className="px-6 py-4 my-2 text-center">
                                    <div className="flex flex-col justify-center items-center gap-2">
                                       <DocumentPropertiesActionComponent
                                          key={property.id}
                                          id={property.id}
                                          propertyAPIURI={propertyAPIURI}
                                          propertyText={propertyText}
                                          propertyPermission={propertyPermission} />
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </>
                     ) : (
                        <tr className="whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 ">
                           <td colSpan={4} className="px-6 py-4">
                              Không có {propertyText} nào.
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