import { Card, CardBody } from "@nextui-org/react"
import { FaBriefcase, FaClipboard, FaLandmark } from "react-icons/fa"
import { HiOutlineDocumentDuplicate } from "react-icons/hi2"

export const GeneralStatsComponent = (
   {
      totalDocuments,
      totalDocumentFields,
      totalDocumentTypes,
      totalIssuingBodies,
   }: {
      totalDocuments: number,
      totalDocumentFields: number,
      totalDocumentTypes: number,
      totalIssuingBodies: number,
   }) => {

   return (
      <div className="w-full grid grid-cols-4 gap-4 text-medium">
         <Card className="hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <CardBody>
               <div className="relative py-2 pl-10 pr-2"><HiOutlineDocumentDuplicate className="absolute left-0" size={24}/> Tổng số tài liệu</div>
               <span className="py-2 pl-10 pr-2 text-3xl font-bold">{totalDocuments}</span>
            </CardBody>
         </Card>
         <Card className="hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <CardBody>
               <div className="relative py-2 pl-10 pr-2"><FaBriefcase className="absolute left-0" size={24} /> Tổng số lĩnh vực tài liệu</div>
               <span className="py-2 pl-10 pr-2 text-3xl font-bold">{totalDocumentFields}</span>
            </CardBody>
         </Card>
         <Card className="hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <CardBody>
               <div className="relative py-2 pl-10 pr-2"><FaClipboard className="absolute left-0" size={24}/>Tổng số loại tài liệu</div>
               <span className="py-2 pl-10 pr-2 text-3xl font-bold">{totalDocumentTypes}</span>
            </CardBody>
         </Card>
         <Card className="hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <CardBody>
               <div className="relative py-2 pl-10 pr-2"><FaLandmark className="absolute left-0" size={24}/>Tổng số cơ quan ban hành</div>
               <span className="py-2 pl-10 pr-2 text-3xl font-bold">{totalIssuingBodies}</span>
            </CardBody>
         </Card>
      </div>
   );
}