import { toast, Slide } from 'react-toastify';

export const successToast = (message: string, id: string = '1') => {
   toast.success(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const errorToastShort = (message: string, id: string = '2') => {
   toast.error(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const errorToast = (message: string, id: string = '2') => {
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
export const errorToastUp = (message: string, id: string = '2') => {
   toast.error(message, {
      toastId: id,
      position: "top-center",
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
export const errorToastLong = (message: string, id: string = '2') => {
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
export const basicToast = (message: string, id: string = '3') => {
   toast(message, {
      toastId: id,
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
   });
};
export const warnToast = (message: string, id: string = '4') => {
   toast.warn(message, {
      toastId: id,
      position: "top-center",
      autoClose: 1500,
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