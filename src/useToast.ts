import { useContext } from 'react';
import { ToastContext } from './ToastProvider';

export function useToast() {
    const value = useContext(ToastContext);

    if (value == null) {
        throw new Error('Must be used in a provider');
    }

    return value;
}
