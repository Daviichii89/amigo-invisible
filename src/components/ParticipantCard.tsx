import type { Participant, Gift } from '../types';
import { useGifts, calculateTotal, deleteParticipant, deleteGift } from '../hooks/useFirestore';
import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Modal } from './ui/Modal';
import { AddGiftForm } from './AddGiftForm';
import { Accordion } from './ui/Accordion';
import { Button, GiftCardSkeleton } from './ui';

interface ParticipantCardProps {
  groupId: string;
  participant: Participant;
  isAdmin: boolean;
  canEdit: boolean;
  isMe: boolean;
  maxBudget: number;
  onAddGift: () => void;
}

export function ParticipantCard({ 
  groupId,
  participant, 
  isAdmin, 
  canEdit, 
  isMe,
  onAddGift 
}: ParticipantCardProps) {
  const { t, tReplace } = useI18n();
  const { gifts, loading } = useGifts(groupId, participant.id);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; giftId?: string; giftTitle?: string }>({ 
    isOpen: false 
  });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  const handleDelete = async () => {
    if (window.confirm(tReplace('groupView.deleteParticipantConfirm', { name: participant.name }))) {
      try {
        await deleteParticipant(groupId, participant.id);
      } catch (error) {
        alert(t('groupView.deleteParticipantError'));
      }
    }
  };

  const handleDeleteGift = async () => {
    if (!deleteModal.giftId) return;
    
    try {
      await deleteGift(groupId, participant.id, deleteModal.giftId);
      setDeleteModal({ isOpen: false });
    } catch (error) {
      setDeleteModal({ isOpen: false });
      setErrorModal({ isOpen: true, message: t('gift.errorDelete') });
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500 m-0">{t('groupView.loading')}</p>
      </div>
    );
  }

  const total = calculateTotal(gifts);
  const sortedGifts = [...gifts].sort((a, b) => a.title.localeCompare(b.title));

  const title = `${participant.name}${isMe ? ` ${t('groupView.you')}` : ''}`;
  const subtitle = gifts.length > 0 ? `(${gifts.length} ${gifts.length === 1 ? t('groupView.gift') : t('groupView.gifts')})` : undefined;

  const footerActions = (canEdit || isAdmin) ? (
    <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
      {canEdit && (
        <Button
          onClick={onAddGift}
          variant="primary"
          size="sm"
        >
          {t('groupView.addGift')}
        </Button>
      )}
      {isAdmin && (
        <Button
          onClick={handleDelete}
          variant="danger"
          size="sm"
        >
          {t('groupView.deleteParticipant')}
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <>
      <Accordion
        title={title}
        subtitle={subtitle}
        footerActions={footerActions}
        className={isMe ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'}
      >
        {loading ? (
          <div className="space-y-2">
            <GiftCardSkeleton />
          </div>
        ) : gifts.length === 0 ? (
          <p className="text-gray-500 text-sm m-0">
            {t('groupView.noGifts')}
          </p>
        ) : (
          <>
            <ul className="my-2 pl-0 list-none">
              {sortedGifts.map((gift) => (
                <li key={gift.id} className="mb-3">
                  <div className="flex flex-col items-center text-center gap-2">
                    {gift.imageUrl && (
                      <img
                        src={gift.imageUrl}
                        alt={gift.title}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded"
                      />
                    )}
                    <div className="w-full">
                      <div className="text-sm sm:text-base font-semibold">
                        {gift.title}
                      </div>
                      <div className="text-base sm:text-lg text-indigo-600 font-bold mt-1">
                        {gift.price.toFixed(2)}€
                      </div>
                      <div className="flex flex-col gap-2 mt-2 w-full items-center">
                        {gift.url && (
                          <Button
                            onClick={() => window.open(gift.url, '_blank', 'noopener,noreferrer')}
                            variant="primary"
                            size="sm"
                            className="w-full sm:w-32"
                          >
                            {t('gift.viewProduct')}
                          </Button>
                        )}
                        {canEdit && (
                          <>
                            <Button
                              onClick={() => setEditingGift(gift)}
                              variant="success"
                              size="sm"
                              className="w-full sm:w-32"
                            >
                              {t('gift.edit')}
                            </Button>
                            <Button
                              onClick={() => setDeleteModal({ isOpen: true, giftId: gift.id, giftTitle: gift.title })}
                              variant="danger"
                              size="sm"
                              className="w-full sm:w-32"
                            >
                              {t('gift.delete')}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 mb-0 font-semibold text-gray-700 text-sm sm:text-base text-center">
              {t('groupView.total')} {total.toFixed(2)}€
            </p>
          </>
        )}
      </Accordion>

      <Modal
        isOpen={deleteModal.isOpen}
        title={t('common.delete')}
        message={deleteModal.giftTitle ? tReplace('gift.deleteConfirm', { title: deleteModal.giftTitle }) : ''}
        type="confirm"
        onConfirm={handleDeleteGift}
        onCancel={() => setDeleteModal({ isOpen: false })}
        confirmText={t('common.delete')}
        cancelText={t('groupView.cancel')}
      />

      <Modal
        isOpen={errorModal.isOpen}
        title={t('common.error')}
        message={errorModal.message}
        type="error"
        onConfirm={() => setErrorModal({ isOpen: false, message: '' })}
      />

      {editingGift && (
        <AddGiftForm
          groupId={groupId}
          participantId={participant.id}
          participantName={participant.name}
          onClose={() => setEditingGift(null)}
          editGift={editingGift}
        />
      )}
    </>
  );
}
