import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Configuration for consistent styling
const toastConfig = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

/**
 * Show a toast notification
 * @param icon 'success', 'error', 'warning', 'info', 'question'
 * @param title Title of the toast
 */
export const showToast = (icon: SweetAlertIcon, title: string) => {
    return toastConfig.fire({
        icon: icon,
        title: title
    });
};

/**
 * Show a standard alert modal (centered)
 * @param icon 'success', 'error', 'warning', 'info', 'question'
 * @param title Title of the alert
 * @param text Optional text body
 */
export const showAlert = (icon: SweetAlertIcon, title: string, text?: string) => {
    return MySwal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonColor: '#3838EC', // Primary
    });
};

/**
 * Show a success alert specifically for login or major actions
 * Centered with progress bar, auto close
 * @param title Title of the success message
 * @param text Optional text
 */
export const showSuccessAlert = (title: string, text?: string) => {
    return MySwal.fire({
        icon: 'success',
        title: title,
        text: text,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center',
        iconColor: '#16A34A', // Success color from globals.css
        backdrop: `
      rgba(0,0,123,0.4)
    `
    });
};

/**
 * Show a blocking success dialog (user must click OK)
 * @param title Title of the alert
 * @param text Optional text body
 * @returns Promise that resolves when user dismisses
 */
export const showSuccessDialog = (title: string, text?: string) => {
    return MySwal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#3838EC', // Primary
        iconColor: '#16A34A', // Success color
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent dismissing by clicking outside
        allowEscapeKey: false,   // Prevent dismissing by Esc key
    });
};

/**
 * Show a confirmation dialog
 * @param title Title of the dialog
 * @param text Description of the action
 * @param confirmButtonText Text for the confirm button
 * @returns Promise that resolves to SweetAlertResult
 */
export const showConfirm = (
    title: string,
    text: string,
    confirmButtonText: string = 'Ya, Lanjutkan'
): Promise<SweetAlertResult> => {
    return MySwal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626', // Danger
        cancelButtonColor: '#858585',  // Secondary
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Batal'
    });
};
