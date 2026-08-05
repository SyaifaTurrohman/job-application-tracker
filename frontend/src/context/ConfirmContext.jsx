import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { message } | null
  // useRef dipakai buat nyimpen fungsi resolve dari Promise di bawah,
  // supaya bisa dipanggil nanti dari handler tombol Yes/No
  const resolverRef = useRef(null);

  // confirm() mengembalikan Promise<boolean>, sehingga bisa dipakai dengan `await confirm(...)`
  // persis seperti window.confirm(), tapi tampilannya custom
  const confirm = useCallback((message) => {
    setDialog({ message });
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  function handleAnswer(answer) {
    setDialog(null);
    if (resolverRef.current) {
      resolverRef.current(answer);
      resolverRef.current = null;
    }
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="confirm-backdrop" onClick={() => handleAnswer(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-eyebrow">Confirm action</p>
            <p className="confirm-message">{dialog.message}</p>
            <div className="confirm-actions">
              <button onClick={() => handleAnswer(false)} className="confirm-btn confirm-btn--cancel">
                Cancel
              </button>
              <button onClick={() => handleAnswer(true)} className="confirm-btn confirm-btn--danger">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm harus dipakai di dalam <ConfirmProvider>');
  }
  return context;
}
