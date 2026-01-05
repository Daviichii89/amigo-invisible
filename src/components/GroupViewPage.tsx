import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useGroup, useParticipants, addParticipant, updateGroupName } from '../hooks/useFirestore';
import { useModal } from '../hooks/useModal';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import type { Participant } from '../types';
import { AddGiftForm } from './AddGiftForm';
import { ParticipantCard } from './ParticipantCard';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, Input, BackButton, Modal, ParticipantCardSkeleton } from './ui';

export function GroupViewPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const { t } = useI18n();
  const { modal, openModal, closeModal } = useModal();
  const { copyToClipboard } = useCopyToClipboard();
  const { group, loading: groupLoading } = useGroup(groupId);
  const { participants, loading: participantsLoading } = useParticipants(groupId || '');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const isAdmin = user?.uid === group?.adminUserId;

  const handleCopyCode = async () => {
    if (group?.inviteCode) {
      const result = await copyToClipboard(group.inviteCode);
      openModal(result.message, result.success ? 'success' : 'error');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim() && newParticipantEmail.trim() && groupId) {
      setAdding(true);
      try {
        await addParticipant(groupId, newParticipantName.trim(), newParticipantEmail.trim());
        setNewParticipantName('');
        setNewParticipantEmail('');
        setShowAddParticipant(false);
      } catch (error) {
        openModal(t('groupView.addError'), 'error');
      } finally {
        setAdding(false);
      }
    }
  };

  const handleEditName = () => {
    setNewGroupName(group?.name || '');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (!newGroupName.trim() || !groupId) return;
    
    setSavingName(true);
    try {
      await updateGroupName(groupId, newGroupName.trim());
      setEditingName(false);
    } catch (error) {
      openModal(t('groupView.editNameError'), 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setNewGroupName('');
  };

  if (groupLoading || participantsLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="animate-pulse bg-gray-300 h-8 w-48 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-64 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ParticipantCardSkeleton />
            <ParticipantCardSkeleton />
            <ParticipantCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!group || !groupId) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="w-full">
          <p className="text-red-600">{t('groupView.notFound')}</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <>
    <LanguageSwitcher />
    <div className="min-h-screen p-4 sm:p-8">
      <div className="w-full">
        <BackButton />

      <div className="mb-6 sm:mb-8">
        {editingName ? (
          <div className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              disabled={savingName}
              className="text-2xl sm:text-3xl font-bold"
              autoFocus
            />
            <Button
              onClick={handleSaveName}
              disabled={savingName || !newGroupName.trim()}
              variant="success"
              size="sm"
            >
              ✓
            </Button>
            <Button
              onClick={handleCancelEdit}
              disabled={savingName}
              variant="secondary"
              size="sm"
            >
              ✕
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold m-0">{group.name}</h1>
            {isAdmin && (
              <button
                onClick={handleEditName}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title={t('groupView.editName')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-3 text-gray-600 text-sm items-start">
          <div className="flex items-center gap-2">
            <strong>{t('groupView.code')}</strong>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 rounded bg-transparent border border-gray-300 text-gray-700 font-mono font-bold hover:bg-gray-100 hover:border-gray-400 cursor-pointer text-sm flex items-center gap-2 transition-colors"
            >
              {group.inviteCode}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="m-0">
            <strong>{t('groupView.budget')}</strong> {group.maxBudget}€
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mb-8">
          {!showAddParticipant ? (
            <Button
              onClick={() => setShowAddParticipant(true)}
              variant="primary"
              size="lg"
            >
              {t('groupView.addParticipantButton')}
            </Button>
          ) : (
            <form onSubmit={handleAddParticipant} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="mt-0 mb-4 font-semibold">{t('groupView.addParticipantForm')}</h3>
              <div className="mb-4">
                <Input
                  type="text"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder={t('groupView.participantName')}
                  className="mb-2"
                  required
                  disabled={adding}
                />
                <Input
                  type="email"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  placeholder={t('groupView.participantEmail')}
                  required
                  disabled={adding}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowAddParticipant(false)}
                  variant="secondary"
                  disabled={adding}
                >
                  {t('groupView.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={adding}
                >
                  {adding ? t('groupView.adding') : t('groupView.add')}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">{t('groupView.participantsTitle')} ({participants.length})</h2>
        {participants.length === 0 ? (
          <p className="text-gray-500">{t('groupView.noParticipants')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {[...participants].sort((a, b) => a.name.localeCompare(b.name)).map((participant) => {
              const canEdit = isAdmin || participant.userId === user?.uid;
              const isMe = participant.userId === user?.uid;
              
              return (
                <ParticipantCard
                  key={participant.id}
                  groupId={groupId}
                  participant={participant}
                  isAdmin={isAdmin}
                  canEdit={canEdit}
                  isMe={isMe}
                  maxBudget={group.maxBudget}
                  onAddGift={() => setSelectedParticipant(participant)}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedParticipant && (
        <AddGiftForm
          groupId={groupId}
          participantId={selectedParticipant.id}
          participantName={selectedParticipant.name}
          onClose={() => setSelectedParticipant(null)}
        />
      )}

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onConfirm={closeModal}
        onCancel={closeModal}
      />
      </div>
    </div>
    </>
  );
}
