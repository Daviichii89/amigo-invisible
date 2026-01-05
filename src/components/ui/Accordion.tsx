import { useState, type ReactNode } from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface AccordionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export function Accordion({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  headerActions,
  className = '',
}: AccordionProps) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border-2 rounded-lg p-3 sm:p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 bg-transparent border-none cursor-pointer p-0 text-left hover:opacity-75 transition-opacity"
          title={isExpanded ? t('common.close') : t('common.edit')}
        >
          <span className="text-xl w-6 h-6 flex items-center justify-center shrink-0">
            {isExpanded ? '▼' : '▶'}
          </span>
          <h3 className="m-0 text-base sm:text-lg font-semibold">
            {title}
            {!isExpanded && subtitle && (
              <span className="text-sm text-gray-600 ml-2">{subtitle}</span>
            )}
          </h3>
        </button>
        {headerActions}
      </div>

      {isExpanded && <div className="mt-2">{children}</div>}
    </div>
  );
}
