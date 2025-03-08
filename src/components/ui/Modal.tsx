import React, { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import classNames from 'classnames';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  contentClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  contentClassName
}) => {
  // נעילת הסקרול כשהמודל פתוח
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:m-4'
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={classNames('relative z-50', className)}
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        {/* רקע כהה */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        {/* תוכן המודל */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  'w-full transform overflow-hidden rounded-lg bg-white text-right align-middle shadow-xl transition-all',
                  sizeClasses[size],
                  contentClassName
                )}
              >
                {/* כותרת */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">סגור</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}

                {/* תוכן */}
                <div className="px-6 py-4">{children}</div>

                {/* כפתורים */}
                {footer && (
                  <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmText = 'אישור',
  cancelText = 'ביטול',
  onConfirm,
  variant = 'danger',
  ...props
}) => {
  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'danger'
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'warning'
    },
    info: {
      icon: 'text-blue-600',
      button: 'primary'
    }
  };

  return (
    <Modal
      {...props}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={props.onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={variantStyles[variant].button as any}
            onClick={() => {
              onConfirm();
              props.onClose();
            }}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="text-center">
        <div className="mt-2">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </Modal>
  );
}; 