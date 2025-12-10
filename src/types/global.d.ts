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
  }
}

export {};