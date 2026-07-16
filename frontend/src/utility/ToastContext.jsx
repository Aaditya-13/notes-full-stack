/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Icon selector based on type
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-white" size={20} strokeWidth={3} />;
      case "error":
        return <AlertCircle className="text-white" size={20} strokeWidth={3} />;
      case "warning":
        return <AlertTriangle className="text-white" size={20} strokeWidth={3} />;
      default:
        return <Info className="text-white" size={20} strokeWidth={3} />;
    }
  };

  // Color theme selector based on type
  const getColorClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-brutal-green text-white";
      case "error":
        return "bg-brutal-danger text-white";
      case "warning":
        return "bg-brutal-warning text-white";
      default:
        return "bg-brutal-purple text-white";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between border-3 border-brutal-dark p-4 brutal-shadow font-bold animate-slide-in ${getColorClasses(
              toast.type
            )}`}
            role="alert"
          >
            <div className="flex items-center gap-3">
              {getIcon(toast.type)}
              <span className="text-sm tracking-wide">{toast.message}</span>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Close notification"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
