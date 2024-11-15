import { RegisterComponent } from "@/components/Auth/RegisterComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
   title: 'Trang đăng ký',
}

const RegisterPage = () => {
   return <RegisterComponent />;
};
export default RegisterPage;