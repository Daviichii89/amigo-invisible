import { useI18n } from '../../contexts/I18nContext';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Modal({
  isOpen,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: ModalProps) {
  const { t } = useI18n();
  
  // Use provided text or fall back to translations
  const finalConfirmText = confirmText || t('common.accept');
  const finalCancelText = cancelText || t('common.cancel');
  if (!isOpen) return null;

  const isConfirm = type === 'confirm';
  const bgColor = type === 'error' ? 'bg-red-50' : type === 'success' ? 'bg-green-50' : 'bg-blue-50';
  const iconColor = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-blue-600';

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-2000 p-4"
      onClick={isConfirm ? undefined : handleCancel}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full shadow-xl ${bgColor} border-2 ${iconColor.replace('text-', 'border-')}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        )}
        
        <p className="text-gray-700 mb-6 text-base whitespace-pre-wrap">{message}</p>

        <div className="flex gap-3 justify-end">
          {isConfirm && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {finalCancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded border-none text-white cursor-pointer transition-colors ${
              type === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
