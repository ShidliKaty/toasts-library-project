import { ReactNode, createContext, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastContextType = {
    toasts: Toast[];
    addToast: (
        text: string,
        options?: Partial<ToastOptions & { id: string }>,
    ) => string;
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

        if (options.autoDismiss) {
            setTimeout(() => removeToast(id), options.autoDismissTimeout);
        }

        return id;
    }

    function removeToast(id: string) {
        setToasts((currentToasts) => {
            return currentToasts.filter((toasts) => toasts.id !== id);
        });
    }

    const toastsByPosition = toasts.reduce(
        (grouped, toast) => {
            const { position } = toast.options;
            if (grouped[position] == null) {
                grouped[position] = [];
            }
            grouped[position].push(toast);

            return grouped;
        },
        {} as Record<string, Toast[]>,
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {createPortal(
                Object.entries(toastsByPosition).map(([position, toasts]) => (
                    <div
                        key={position}
                        className={`toast-container ${position}`}
                    >
                        {toasts.map((toast) => (
                            <Toast
                                text={toast.text}
                                key={toast.id}
                                remove={() => removeToast(toast.id)}
                            />
                        ))}
                    </div>
                )),
                document.getElementById('toast-container') as HTMLDivElement,
            )}
        </ToastContext.Provider>
    );
}

type ToastType = {
    text: string;
    remove: () => void;
};

function Toast({ text, remove }: ToastType) {
    return (
        <div onClick={remove} className="toast">
            {text}
        </div>
    );
}
