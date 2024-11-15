import { LoginComponent } from "@/components/Auth/LoginComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Trang đăng nhập',
}

const LoginPage = () => {
   return <LoginComponent />;
};
export default LoginPage;