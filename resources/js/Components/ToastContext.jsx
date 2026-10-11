import { createContext, useContext } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
    const toast = useContext(ToastContext);

    if (!toast) {
        throw new Error("useToast must be used within ToastContext.Provider");
    }

    return toast;
};

export default ToastContext;
