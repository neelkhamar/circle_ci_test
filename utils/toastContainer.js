import { toast } from 'react-toastify';

export function ToastMessage ( message, isSuccess ) {
    if(isSuccess) {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }
    else {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }
}

export default ToastMessage;