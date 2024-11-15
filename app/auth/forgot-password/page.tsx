import { ForgotPasswordComponent } from "@/components/Auth/ForgotPasswordComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Quên mật khẩu',
}

const ForgotPasswordPage = () => {
   return <ForgotPasswordComponent />;
};
export default ForgotPasswordPage;