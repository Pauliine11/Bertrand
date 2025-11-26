interface SnackbarProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Snackbar({ open, message, type }: SnackbarProps) {
  if (!open) return null;

  const typeStyles = {
    success: 'bg-green-600 border-green-400 text-white',
    error: 'bg-red-600 border-red-400 text-white',
    info: 'bg-blue-600 border-blue-400 text-white',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl border-2 transform transition-all duration-300 ease-in-out z-50 animate-slide-in ${typeStyles[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium">{message}</span>
      </div>
    </div>
  );
}

