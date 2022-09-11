import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export function alertContainer ({ title, text, icon, showConfirmButton }) {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: showConfirmButton,
    })
}

export default alertContainer;