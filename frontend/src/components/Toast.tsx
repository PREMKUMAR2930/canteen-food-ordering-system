import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'info':
      default:
        return 'bg-sky-50 text-sky-800 border-sky-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-md animate-in slide-in-from-bottom-5 duration-300 ${getStyles()}`}
    >
      {getIcon()}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors ml-auto text-slate-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
