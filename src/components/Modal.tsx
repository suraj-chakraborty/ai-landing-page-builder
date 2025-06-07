import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // Optional title for the modal
  footer?: React.ReactNode; // Optional custom footer
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="relative bg-white inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
        role="button"
      />

      {/* Modal Content */}
      <div
        className="relative z-10 bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        {title && (
          <div className="mb-4">
            <h2 id="modal-title" className="text-lg font-bold text-gray-900">
              {title}
            </h2>
          </div>
        )}

        {/* Modal Body */}
        <div className="mb-4">{children}</div>

        {/* Modal Footer */}
        {footer ? (
          <div className="mt-4">{footer}</div>
        ) : (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
