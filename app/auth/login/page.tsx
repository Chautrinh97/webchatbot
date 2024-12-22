import { LoginComponent } from "@/components/Auth/LoginComponent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
   title: 'Trang đăng nhập',
}

const LoginPage = () => {
   return (
      <Suspense>
         <LoginComponent />
      </Suspense>
   );
};
export default LoginPage;