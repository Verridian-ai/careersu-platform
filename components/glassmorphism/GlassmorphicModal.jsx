/**
 * GlassmorphicModal - Dialog/Modal with glassmorphism
 *
 * Features:
 * - Multiple size options
 * - Backdrop blur effect
 * - Keyboard support (ESC to close)
 * - Focus management
 * - Accessibility features
 * - Scroll prevention when open
 */

import React, { useEffect, useRef } from 'react';

export const GlassmorphicModal = React.forwardRef(
  ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
    showCloseButton = true,
    className = '',
  }, ref) => {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
      if (!isOpen) return;

      // Store the previously focused element
      previousActiveElement.current = document.activeElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the modal
      setTimeout(() => {
        const closeButton = modalRef.current?.querySelector('[aria-label="Close modal"]');
        closeButton?.focus();
      }, 0);

      // Handle keyboard events
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        // Restore focus to previously focused element
        previousActiveElement.current?.focus();
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };

    return (
      <>
        {/* Backdrop with blur */}
        <div
          className="
            fixed inset-0 bg-black/30 backdrop-filter backdrop-blur-sm
            z-40 transition-opacity duration-200
          "
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div className="
          fixed inset-0 flex items-center justify-center z-50
          p-4 pointer-events-none
        ">
          <div className={`${sizeClasses[size]} w-full pointer-events-auto`}>
            {/* Glass Modal */}
            <div
              ref={modalRef}
              className={`
                bg-white/10 backdrop-filter backdrop-blur-xl
                border border-white/20 rounded-2xl shadow-2xl
                overflow-hidden transition-all duration-300
                ${className}
              `}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <div className="
                flex items-center justify-between p-6
                border-b border-white/10
              ">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-white"
                >
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="
                      p-1 hover:bg-white/10 rounded-lg transition
                      text-gray-300 hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-white
                    "
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="
                  flex justify-end gap-3 p-6
                  border-t border-white/10
                ">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
);

GlassmorphicModal.displayName = 'GlassmorphicModal';

export default GlassmorphicModal;
