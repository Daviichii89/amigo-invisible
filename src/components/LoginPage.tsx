import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useModal } from '../hooks/useModal';
import { Modal } from './ui/Modal';
import { LanguageSwitcher } from './LanguageSwitcher';

export function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const { t } = useI18n();
  const { modal, openModal, closeModal } = useModal();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      openModal(t('login.error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-5xl mb-4">🎁</div>
            <div className="bg-gray-300 h-8 w-48 rounded mx-auto mb-4"></div>
            <div className="bg-gray-300 h-4 w-64 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <LanguageSwitcher />
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
      <div className="text-center max-w-md">
        <h1 className="text-5xl mb-4">🎁</h1>
        <h2 className="text-3xl font-bold mb-2 text-white">{t('login.title')}</h2>
        <p className="text-white/90 mb-8">
          {t('login.subtitle')}
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 px-6 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer w-full max-w-xs mx-auto transition-all hover:bg-gray-50 hover:shadow-md"
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path
                d="M17.6 9.2l-.1-1.8H9v3.4h4.8C13.6 12 13 13 12 13.6v2.2h3a8.8 8.8 0 0 0 2.6-6.6z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.4 0 4.5-.8 6-2.2l-3-2.2a5.4 5.4 0 0 1-8-2.9H1V13a9 9 0 0 0 8 5z"
                fill="#34A853"
              />
              <path
                d="M4 10.7a5.4 5.4 0 0 1 0-3.4V5H1a9 9 0 0 0 0 8l3-2.3z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.6c1.3 0 2.5.4 3.4 1.3L15 2.3A9 9 0 0 0 1 5l3 2.4a5.4 5.4 0 0 1 5-3.7z"
                fill="#EA4335"
              />
            </g>
          </svg>
          {t('login.signIn')}
        </button>
      </div>

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onConfirm={closeModal}
        onCancel={closeModal}
      />
    </div>
    </>
  );
}
