import { ConfirmEmailComponent} from "@/components/Auth/ComfirmEmailComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Yêu cần xác minh',
}

const ConfirmEmailPage = () => {
   return <ConfirmEmailComponent />;
};
export default ConfirmEmailPage;