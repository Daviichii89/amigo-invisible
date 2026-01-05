import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export function BackButton({ to = '/', label, className = '' }: BackButtonProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const defaultLabel = t('common.back') || 'Volver';
  
  return (
    <button
      onClick={() => navigate(to)}
      className={`px-4 py-2 rounded border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 text-sm mb-6 sm:mb-8 ${className}`}
    >
      ← {label || defaultLabel}
    </button>
  );
}
