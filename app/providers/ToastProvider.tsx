import 'react-toastify/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default function ToastProvider({ children }: {children: React.ReactNode}) {

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}