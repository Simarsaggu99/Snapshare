import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export const notifyError = ({ message }: any) => {
  const screenWidth = typeof window !== "undefined" ? window.screen.width : 768;
  toast(<p style={{ fontSize: 16 }}>{message}</p>, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type: "error",
  });
};
export const notifySuccess = ({ message }: any) => {
  const screenWidth = typeof window !== "undefined" ? window.screen.width : 768;

  toast(<p style={{ fontSize: 16 }}>{message}</p>, {
    position: "top-right",
    autoClose: 2000,

    hideProgressBar: false,
    // newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type: "success",
  });
};
export const notifyWarning = ({ message }: any) => {
  const screenWidth = typeof window !== "undefined" ? window.screen.width : 768;

  toast(<p style={{ fontSize: 16 }}>{message}</p>, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    // newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type: "warning",
  });
};
