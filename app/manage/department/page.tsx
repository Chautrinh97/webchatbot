import { DepartmentComponent } from "@/components/Manage/DepartmentComponent";
import { Metadata } from "next";
export const metadata: Metadata = {
   title: 'Phòng ban',
}
const DepartmentPage = ({}) => {
   return (
      <DepartmentComponent />
   );
}
export default DepartmentPage;