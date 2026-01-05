import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const openModal = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setModal({ isOpen: true, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', type: 'info' });
  };

  return { modal, openModal, closeModal };
}

interface ConfirmModalState {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
}

export function useConfirmModal() {
  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    message: '',
  });

  const openConfirmModal = (message: string, onConfirm: () => void) => {
    setModal({ isOpen: true, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setModal({ isOpen: false, message: '', onConfirm: undefined });
  };

  const handleConfirm = () => {
    modal.onConfirm?.();
    closeConfirmModal();
  };

  return { modal, openConfirmModal, closeConfirmModal, handleConfirm };
}
