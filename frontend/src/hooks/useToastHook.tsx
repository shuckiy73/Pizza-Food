import { ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useToastHook = () => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  };

  const toastSuccess = (message: string, autoClose:number = 5000) => {
    toast.success(message, {...options, autoClose});
  };

  const toastError = (message: string) => {
    toast.error(message, options);
  };

  const toastInfo = (message: string) => {
    toast.info(message, {...options, autoClose: 15000});
  };

  return { toastSuccess, toastError, toastInfo };
};

export default useToastHook;
