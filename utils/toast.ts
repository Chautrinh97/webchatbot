import { toast, Slide } from 'react-toastify';

export const successToast = (message: string, id: string = '') => {
   toast.success(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const errorToast = (message: string, id: string = '') => {
   toast.error(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const errorToastLong = (message: string, id: string = '') => {
   toast.error(message, {
      toastId: id,
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const basicToast = (message: string, id: string = '') => {
   toast(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const warnToast = (message: string, id: string = '') => {
   toast.warn(message, {
      toastId: id,
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};

export const promiseToast = async<T>(promise: Promise<T>, messagePending: string) => {
   try {
      const response = await toast.promise(
         promise,
         {
            pending: messagePending,
         },
         {
            position: "bottom-right",
            autoClose: 1,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
         }
      );
      return response;
   } catch (error) {
      throw error;
   }
};