import { useState, useCallback } from 'react';

export interface ModalConfig {
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({});

  const openModal = useCallback((modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setConfig({});
  }, []);

  const confirm = useCallback(() => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    closeModal();
  }, [config, closeModal]);

  const cancel = useCallback(() => {
    if (config.onCancel) {
      config.onCancel();
    }
    closeModal();
  }, [config, closeModal]);

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    confirm,
    cancel
  };
}; 