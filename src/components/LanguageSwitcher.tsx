import { useI18n } from '../contexts/I18nContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded border-none cursor-pointer transition-colors ${
          language === 'es'
            ? 'bg-indigo-600 text-white font-semibold'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded border-none cursor-pointer transition-colors ${
          language === 'en'
            ? 'bg-indigo-600 text-white font-semibold'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
