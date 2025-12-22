// Global type declarations
declare global {
  interface Window {
    __router: any;
    __handleDynamicRoute: (path: string) => void;
    submitOrder: (iphoneId: number) => Promise<void>;
    trackOrder: (code: string) => void;
    resetTestimonialForm: () => void;
    showEditForm: () => void;
    cancelEdit: () => void;
    sendVerificationCode: () => Promise<void>;
    verifyCode: () => Promise<void>;
    resendCode: () => Promise<void>;
    backToSend: () => void;
    closeAppVersionModal: () => void;
    closeNewVersionModal: () => void;
    dismissAppAnnouncement: () => void;
    showLogoutConfirmation: () => void;
    closeModal: () => void;
    confirmLogout: () => void;
    showOrderSuccessModal: () => void;
    confirmDelete: (id: number) => void;
    goToOrders: () => void;
    __handleAlertClose: () => void;
    __confirmUserAction: () => void;
    __deleteTestimonialCallback: (id: number) => void;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}