import { useEffect } from "react";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  footer = null,
  size = "medium",
  closable = true,
  className = "",
}) => {
  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-lg",
    large: "max-w-2xl",
    full: "max-w-4xl mx-4",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closable, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closable && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className={`relative w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200/50 dark:border-neutral-700/50 ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-neutral-700/50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-t-xl">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </div>
          {closable && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 p-4 border-t border-gray-200/50 dark:border-neutral-700/50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  closable: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
