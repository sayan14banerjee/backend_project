import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900 border-green-600';
      case 'error':
        return 'bg-red-900 border-red-600';
      case 'info':
        return 'bg-blue-900 border-blue-600';
      default:
        return 'bg-gray-900 border-gray-600';
    }
  };

  return (
    <div className={`${getBgColor()} border border-l-4 rounded-lg p-4 flex items-center gap-3 mb-3 animate-slideIn`}>
      {getIcon()}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
