import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm">
        <CheckCircle size={20} className="text-highlight flex-shrink-0" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors duration-150 focus-ring rounded-full p-1"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
