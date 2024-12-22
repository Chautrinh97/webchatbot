import { ResetPasswordComponent } from "@/components/Auth/ResetPasswordComponent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
   title: 'Thiết lập mật khẩu mới',
}

const ResetPasswordPage = () => {
   return (
      <Suspense>
         <ResetPasswordComponent />
      </Suspense>
   );
};
export default ResetPasswordPage;