import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';

export function useCopyToClipboard() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string): Promise<{ success: boolean; message: string }> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return { success: true, message: t('home.copied') };
    } catch (error) {
      return { success: false, message: 'Error al copiar' };
    }
  };

  return { copyToClipboard, copied };
}
