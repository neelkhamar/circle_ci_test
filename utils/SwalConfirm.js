import Swal from 'sweetalert2';

export function confirmContainer ( title, text ) {
    return Swal.fire({
        title: title,
        text: text,
        showDenyButton: false,
        showCancelButton: true,
        icon: 'warning',
        confirmButtonColor: '#ff4d4f',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    })
}

export default confirmContainer;