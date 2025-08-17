import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

import { ConfirmModal, type ConfirmModalProps } from '@/components/ui/confirm-modal';
import { InputModal, type InputModalProps } from '@/components/ui/input-modal';

// Types for modal configurations
export interface ConfirmOptions
  extends Omit<ConfirmModalProps, 'onConfirm' | 'onClose' | 'visible'> {
  title: string;
  message: string;
}

export interface InputOptions extends Omit<InputModalProps, 'onSubmit' | 'onClose' | 'visible'> {
  title: string;
}

// Modal queue item types
interface BaseModalItem {
  id: string;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

interface ConfirmModalItem extends BaseModalItem {
  type: 'confirm';
  options: ConfirmOptions;
}

interface InputModalItem extends BaseModalItem {
  type: 'input';
  options: InputOptions;
}

type ModalItem = ConfirmModalItem | InputModalItem;

// Context interface
interface ModalContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  input: (options: InputOptions) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

// Provider component
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalQueue, setModalQueue] = useState<ModalItem[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalItem | null>(null);
  const modalIdRef = useRef(0);

  // Process next modal in queue
  const processNextModal = useCallback(() => {
    setModalQueue((prev) => {
      if (prev.length === 0) {
        setCurrentModal(null);
        return prev;
      }

      const [nextModal, ...remaining] = prev;
      setCurrentModal(nextModal);
      return remaining;
    });
  }, []);

  // Add modal to queue
  const enqueueModal = useCallback(
    (modal: Omit<ModalItem, 'id' | 'resolve' | 'reject'>) => {
      return new Promise((resolve, reject) => {
        const modalWithId = {
          ...modal,
          id: `modal-${modalIdRef.current++}`,
          resolve,
          reject,
        } as ModalItem;

        setModalQueue((prev) => {
          const newQueue = [...prev, modalWithId];

          // If no modal is currently showing, process this one immediately
          if (currentModal === null && prev.length === 0) {
            setCurrentModal(modalWithId);
            return [];
          }

          return newQueue;
        });
      });
    },
    [currentModal]
  );

  // Confirm modal function
  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return enqueueModal({
        type: 'confirm',
        options,
      }) as Promise<boolean>;
    },
    [enqueueModal]
  );

  // Input modal function
  const input = useCallback(
    (options: InputOptions): Promise<string | null> => {
      return enqueueModal({
        type: 'input',
        options,
      }) as Promise<string | null>;
    },
    [enqueueModal]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    if (currentModal) {
      if (currentModal.type === 'confirm') {
        currentModal.resolve(false);
      } else if (currentModal.type === 'input') {
        currentModal.resolve(null);
      }
    }
    processNextModal();
  }, [currentModal, processNextModal]);

  // Handle confirm modal actions
  const handleConfirm = useCallback(() => {
    if (currentModal?.type === 'confirm') {
      currentModal.resolve(true);
      processNextModal();
    }
  }, [currentModal, processNextModal]);

  // Handle input modal actions
  const handleInputSubmit = useCallback(
    (value: string) => {
      if (currentModal?.type === 'input') {
        currentModal.resolve(value);
        processNextModal();
      }
    },
    [currentModal, processNextModal]
  );

  const contextValue: ModalContextValue = {
    confirm,
    input,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Render current modal */}
      {currentModal?.type === 'confirm' && (
        <ConfirmModal
          {...currentModal.options}
          visible={true}
          onConfirm={handleConfirm}
          onClose={handleModalClose}
          closeOnConfirm={false} // We handle closing manually
        />
      )}

      {currentModal?.type === 'input' && (
        <InputModal
          {...currentModal.options}
          visible={true}
          onSubmit={handleInputSubmit}
          onClose={handleModalClose}
          closeOnSubmit={false} // We handle closing manually
        />
      )}
    </ModalContext.Provider>
  );
}

// Hook to use modal functions
export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
