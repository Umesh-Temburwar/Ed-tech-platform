import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen = false,
  onClose,
  children,
  title,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  useEffect(() => {
    if (!isOpen) return;
    
    previousFocusRef.current = document.activeElement;
    
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  const handleCloseClick = () => {
    onClose?.();
  };
  
  if (!isOpen) return null;
  
  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/60 transition-opacity" />
      
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size] || sizeClasses.medium}
          bg-surface border border-border rounded-xl shadow-2xl
          transform transition-all duration-200 scale-100
          max-h-[90vh] overflow-hidden flex flex-col
          ${className}
        `}
        tabIndex={-1}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-2">
            {title && (
              <h2 className="text-sm font-bold text-text">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleCloseClick}
                className="p-1 text-muted hover:text-text hover:bg-surface rounded transition-colors ml-auto"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

const ModalHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-5 py-4 border-b border-border bg-surface-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-5 py-3.5 border-t border-border bg-surface-2 flex items-center justify-end space-x-2.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
export { ModalHeader, ModalBody, ModalFooter };
