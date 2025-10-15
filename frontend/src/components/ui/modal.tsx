"use client";

import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 bg-opacity-50 transition-opacity duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`bg-background rounded-lg shadow-xl w-full mx-4 p-6 transition-all duration-300 ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-secondary/20">
          <h3>
            {title || ' '}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-secondary hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="py-4">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end pt-4 gap-2 border-t border-secondary/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};