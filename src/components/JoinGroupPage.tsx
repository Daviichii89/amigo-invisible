import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { joinGroupByCode } from '../hooks/useFirestore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, BackButton, InfoBox } from './ui';

interface JoinGroupPageProps {
  userId: string;
  userName: string;
  userEmail: string;
}

export function JoinGroupPage({ userId, userName, userEmail }: JoinGroupPageProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (inviteCode.trim()) {
      setLoading(true);
      try {
        const groupId = await joinGroupByCode(
          userId,
          inviteCode.trim(),
          userName,
          userEmail
        );
        navigate(`/group/${groupId}`);
      } catch (err: any) {
        setError(err.message || t('joinGroup.error'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <LanguageSwitcher />
    <div className="min-h-screen p-4 sm:p-8">
      <div className="w-full">
        <BackButton />

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('joinGroup.title')}</h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        {t('joinGroup.subtitle')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-bold">
            {t('joinGroup.inviteCode')}
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="Ej: ABC123"
            maxLength={6}
            className={`w-full px-3 py-3 rounded border text-2xl text-center tracking-widest font-bold box-border uppercase disabled:bg-gray-100 ${
              error ? 'border-red-600' : 'border-gray-300'
            }`}
            required
            disabled={loading}
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">
              ⚠️ {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || inviteCode.length !== 6}
          variant="primary"
          size="lg"
          fullWidth
          className="font-bold"
        >
          {loading ? t('joinGroup.joining') : t('joinGroup.join')}
        </Button>
      </form>

      <InfoBox title={t('joinGroup.info')}>
        <ul className="my-2 pl-6">
          <li>{t('joinGroup.infoBullet1')} <strong>{userName}</strong></li>
          <li>{t('joinGroup.infoBullet2')}</li>
          <li>{t('joinGroup.infoBullet3')}</li>
          <li>{t('joinGroup.infoBullet4')}</li>
        </ul>
      </InfoBox>
      </div>
    </div>
    </>
  );
}
