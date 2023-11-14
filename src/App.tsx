import { useRef } from 'react';
import './styles.css';
import { useToast } from './useToast';

function App() {
    const { toasts, addToast, removeToast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);

    function createToast() {
        if (inputRef.current == null || inputRef.current.value === '') return;
        addToast(inputRef.current.value);
    }
    return (
        <div className="form">
            <input type="text" ref={inputRef} />
            <button onClick={createToast}>Add Toast</button>
        </div>
    );
}

export default App;
