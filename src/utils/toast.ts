import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    rtl: true,
  });
};

// מילון הודעות מערכת נפוצות
export const systemMessages = {
  success: {
    created: 'נוצר בהצלחה',
    updated: 'עודכן בהצלחה',
    deleted: 'נמחק בהצלחה',
    saved: 'נשמר בהצלחה',
  },
  error: {
    general: 'אירעה שגיאה, אנא נסה שוב',
    network: 'שגיאת תקשורת, אנא בדוק את החיבור לאינטרנט',
    validation: 'אנא בדוק את הנתונים שהוזנו',
    unauthorized: 'אין לך הרשאה לבצע פעולה זו',
    notFound: 'הפריט המבוקש לא נמצא',
  },
  info: {
    loading: 'טוען נתונים...',
    processing: 'מעבד בקשה...',
    noData: 'לא נמצאו נתונים',
  },
  warning: {
    unsavedChanges: 'יש שינויים שלא נשמרו',
    deleteConfirmation: 'האם אתה בטוח שברצונך למחוק?',
  }
}; 