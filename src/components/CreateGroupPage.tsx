import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { createGroup } from '../hooks/useFirestore';
import { useModal } from '../hooks/useModal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, Input, BackButton, InfoBox, Modal } from './ui';

interface CreateGroupPageProps {
  userId: string;
}

export function CreateGroupPage({ userId }: CreateGroupPageProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { modal, openModal, closeModal } = useModal();
  const [name, setName] = useState('');
  const [maxBudget, setMaxBudget] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setLoading(true);
      try {
        const groupId = await createGroup(userId, name.trim(), maxBudget);
        navigate(`/group/${groupId}`);
      } catch (error) {
        openModal(t('createGroup.error'), 'error');
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

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('createGroup.title')}</h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        {t('createGroup.subtitle')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={t('createGroup.groupName')}
            placeholder="Ej: Amigo Invisible Familia 2026"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <Input
            type="number"
            min="1"
            max="1000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(parseInt(e.target.value))}
            label={t('createGroup.maxBudget')}
            required
            disabled={loading}
          />
          <p className="text-sm text-gray-600 mt-2">
            {t('createGroup.maxBudgetHint')}
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
          className="font-bold"
        >
          {loading ? t('createGroup.creating') : t('createGroup.create')}
        </Button>
      </form>

      <InfoBox title={t('createGroup.info')}>
        <ul className="my-2 pl-6">
          <li>{t('createGroup.infoBullet1')}</li>
          <li>{t('createGroup.infoBullet2')}</li>
          <li>{t('createGroup.infoBullet3')}</li>
          <li>{t('createGroup.infoBullet4')}</li>
        </ul>
      </InfoBox>
      </div>
    </div>

    <Modal
      isOpen={modal.isOpen}
      message={modal.message}
      type={modal.type}
      onConfirm={closeModal}
      onCancel={closeModal}
    />
    </>
  );
}
