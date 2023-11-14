import { ReactNode, createContext, useState } from 'react';

type ToastContextType = {
    toasts: Toast[];
    addToast: (
        text: string,
        options?: Partial<ToastOptions & { id: string }>,
    ) => void;
    removeToast: (id: string) => void;
};
export const ToastContext = createContext<ToastContextType | null>(null);

type ToastProviderProps = {
    children: ReactNode;
};

type Toast = {
    id: string;
    text: string;
    options: ToastOptions;
};

type ToastOptions = {
    autoDismiss: boolean;
    autoDismissTimeout: number;
    position: string;
};

const DEFAULT_OPTIONS: ToastOptions = {
    autoDismiss: true,
    autoDismissTimeout: 5000,
    position: 'top-right',
};

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    function addToast(
        text: string,
        {
            id = crypto.randomUUID(),
            ...userDefinedOptions
        }: Partial<ToastOptions & { id: string }> = {},
    ) {
        const options = { ...DEFAULT_OPTIONS, ...userDefinedOptions };

        setToasts((currentToasts) => {
            return [...currentToasts, { text, options, id }];
        });
    }

    function removeToast(id: string) {
        setToasts((currentToasts) => {
            return currentToasts.filter((toasts) => toasts.id !== id);
        });
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}
