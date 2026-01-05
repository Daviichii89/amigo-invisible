import { useState, useEffect } from 'react';
import { addGift, updateGift } from '../hooks/useFirestore';
import { useI18n } from '../contexts/I18nContext';
import { useModal } from '../hooks/useModal';
import { Modal } from './ui/Modal';
import type { Gift } from '../types';
import { Button, Input } from './ui';

interface AddGiftFormProps {
  groupId: string;
  participantId: string;
  participantName: string;
  onClose: () => void;
  editGift?: Gift;
}

export function AddGiftForm({
  groupId,
  participantId,
  participantName,
  onClose,
  editGift,
}: AddGiftFormProps) {
  const { t, tReplace } = useI18n();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { modal, openModal, closeModal } = useModal();

  useEffect(() => {
    if (editGift) {
      setTitle(editGift.title);
      setPrice(editGift.price.toString());
      setUrl(editGift.url || '');
      setImageUrl(editGift.imageUrl || '');
    }
  }, [editGift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    
    if (title.trim() && !isNaN(priceNum) && priceNum > 0) {
      setLoading(true);
      try {
        if (editGift) {
          await updateGift(groupId, participantId, editGift.id, {
            title: title.trim(),
            price: priceNum,
            url: url.trim() || undefined,
            imageUrl: imageUrl.trim() || undefined,
          });
        } else {
          await addGift(groupId, participantId, {
            title: title.trim(),
            price: priceNum,
            url: url.trim() || undefined,
            imageUrl: imageUrl.trim() || undefined,
          });
        }
        
        setTitle('');
        setPrice('');
        setUrl('');
        setImageUrl('');
        onClose();
      } catch (error) {
        openModal(editGift ? t('gift.errorUpdate') : t('gift.error'), 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 sm:p-8 rounded-lg w-full max-w-125"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mt-0 text-lg sm:text-xl font-semibold">{editGift ? t('gift.editGiftForm') : tReplace('gift.addGiftForm', { name: participantName })}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-4">
          {t('gift.description')}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label={t('gift.title')}
              placeholder={t('gift.titlePlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label={t('gift.price')}
              placeholder={t('gift.pricePlaceholder')}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              label={t('gift.url')}
              placeholder={t('gift.urlPlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              label={t('gift.imageUrl')}
              placeholder={t('gift.imageUrlPlaceholder')}
              disabled={loading}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt={t('gift.imagePreview')}
                className="mt-2 max-w-full max-h-37.5 rounded hidden [[src]]:block"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              {t('gift.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
            >
              {loading ? (editGift ? t('gift.saving') : t('gift.adding')) : (editGift ? t('gift.save') : t('gift.add'))}
            </Button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        title={t('common.error')}
        onConfirm={closeModal}
        onCancel={closeModal}
      />
    </div>
    </>
  );
}
