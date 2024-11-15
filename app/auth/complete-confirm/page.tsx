
import { CompleteConfirmComponent } from "@/components/Auth/CompleteComfirm";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Hoàn thành xác minh',
}

const CompletConfirmPage = () => {
   return <CompleteConfirmComponent />;
};
export default CompletConfirmPage;