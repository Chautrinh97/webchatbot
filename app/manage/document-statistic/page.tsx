import { Metadata } from "next";
import { DocumentStatisticComponent } from "@/components/Statistic/DocumentStatisticComponent";

export const metadata: Metadata = {
   title: 'Thống kê tài liệu',
}

export default async function DocumentStatisticPage() {
   return <>
      <DocumentStatisticComponent />
   </>;
}