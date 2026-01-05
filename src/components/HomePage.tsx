import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useUserGroups, deleteGroup } from '../hooks/useFirestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal, useConfirmModal } from '../hooks/useModal';
import { Modal } from './ui/Modal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, GroupCardSkeleton } from './ui';

export function HomePage() {
  const { user, signOut } = useAuth();
  const { t, tReplace } = useI18n();
  const { groups, loading } = useUserGroups(user?.uid);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);
  const { modal, openModal, closeModal } = useModal();
  const { modal: confirmModal, openConfirmModal, closeConfirmModal, handleConfirm } = useConfirmModal();

  const handleDeleteGroup = async (groupId: string, groupName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal(
      tReplace('home.deleteConfirm', { groupName }),
      async () => {
        setDeleting(groupId);
        try {
          await deleteGroup(groupId);
        } catch (error) {
          openModal(t('home.error'), 'error');
        } finally {
          setDeleting(null);
        }
      }
    );
  };

  return (
    <>
    <LanguageSwitcher />
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold">🎁 {t('login.title')}</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {t('home.greeting')}, {user?.displayName || user?.email}
          </p>
        </div>
        <Button
          onClick={signOut}
          variant="secondary"
          size="sm"
          className="whitespace-nowrap"
        >
          {t('common.close')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          onClick={() => navigate('/create-group')}
          variant="primary"
          size="lg"
          className="flex-1 font-bold"
        >
          ➞ {t('home.createGroup')}
        </Button>
        <Button
          onClick={() => navigate('/join-group')}
          variant="secondary"
          size="lg"
          className="flex-1 font-bold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
        >
          🔗 {t('home.joinGroup')}
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">{t('home.title')}</h2>
        {loading ? (
          <div className="flex flex-col gap-4">
            <GroupCardSkeleton />
            <GroupCardSkeleton />
            <GroupCardSkeleton />
          </div>
        ) : groups.length === 0 ? (
          <p className="text-gray-500">
            {t('home.noGroups')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => {
              const isAdmin = group.adminUserId === user?.uid;
              return (
                <div
                  key={group.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 transition-all hover:bg-gray-100 hover:border-indigo-600"
                >
                  <div 
                    onClick={() => navigate(`/group/${group.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="m-0 mb-2 text-xl font-semibold">{group.name}</h3>
                    <p className="m-0 text-sm text-gray-600">
                      {t('home.inviteCode')} <strong>{group.inviteCode}</strong> · {t('createGroup.maxBudget')}: {group.maxBudget}€
                      {isAdmin && <span className="ml-2 text-indigo-600 font-semibold">· {t('home.admin')}</span>}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={(e: React.MouseEvent) => handleDeleteGroup(group.id, group.name, e)}
                        disabled={deleting === group.id}
                        variant="danger"
                        size="sm"
                      >
                        {deleting === group.id ? t('common.loading') : `🗑️ ${t('home.deleteGroup')}`}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>

    <Modal
      isOpen={confirmModal.isOpen}
      title={t('common.delete')}
      message={confirmModal.message}
      type="confirm"
      confirmText={t('common.delete')}
      cancelText={t('common.cancel')}
      onConfirm={handleConfirm}
      onCancel={closeConfirmModal}
    />

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
