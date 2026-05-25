import React, { createContext, useContext } from "react";

export type AlertOptions = {
    title?: string;
    description?: React.ReactNode;
    variant?: 'warning' | 'success' | 'danger' | 'info' | 'error';
    buttonText?: string;
    confirmation?: boolean;
    withRemarks?: boolean;
    remarksPlaceholder?: string;
    onConfirm?: () => void;
    inputValidator?: (val: string) => string | undefined;
};

type AlertResult = {
    isConfirmed: boolean;
    remarks?: string;
};

type AlertContextType = {
    showAlert: (options: AlertOptions) => Promise<AlertResult>;
};

export const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
    return ctx;
};