import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // useCallback biar fungsi ini nggak dibuat ulang tiap render,
  // penting karena dipakai di banyak komponen lewat context
  const showToast = useCallback((message, type = 'info') => {
    const id = idCounter++;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Toast otomatis hilang setelah 3.5 detik
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`} onClick={() => dismissToast(toast.id)}>
            <span className="toast-marker" />
            <p className="toast-message">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook: komponen manapun tinggal panggil `const showToast = useToast()`
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus dipakai di dalam <ToastProvider>');
  }
  return context;
}
