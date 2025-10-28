import { useEffect } from 'react';

function Toast({ message, isVisible, onClose, isDark }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        isDark 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-800 border border-gray-700'
      }`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-green-400 flex-shrink-0" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-white">{message}</span>
      </div>
    </div>
  );
}

export default Toast;

