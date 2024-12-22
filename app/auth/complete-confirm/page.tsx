
import { CompleteConfirmComponent } from "@/components/Auth/CompleteComfirm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
   title: 'Hoàn thành xác minh',
}

const CompletConfirmPage = () => {
   return (
      <Suspense>
         <CompleteConfirmComponent />
      </Suspense>
   );
};
export default CompletConfirmPage;