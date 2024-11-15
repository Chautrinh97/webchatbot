import { ResetPasswordComponent } from "@/components/Auth/ResetPasswordComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Thiết lập mật khẩu mới',
}

const ResetPasswordPage = () => {
   return <ResetPasswordComponent />;
};
export default ResetPasswordPage;