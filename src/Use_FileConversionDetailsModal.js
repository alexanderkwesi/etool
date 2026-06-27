import React, { useEffect, useRef } from "react";
import "./Use_FileConversionModal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  backdropClose = true,
  animation = "fade",
  zIndex = 1000,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footer,
  footerClassName = "",
  conversionData, // NEW: Add conversionData prop
}) => {
  const modalRef = useRef(null);
  const lastFocusRef = useRef(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Save last focused element before modal opens
    if (isOpen) {
      lastFocusRef.current = document.activeElement;
      document.addEventListener("keydown", handleEscape);

      // Focus first focusable element in modal
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements?.length > 0) {
          focusableElements[0].focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);

      // Restore focus when modal closes
      if (lastFocusRef.current && isOpen) {
        lastFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (backdropClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle modal content click (prevent backdrop close)
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const sizeClasses = {
    small: "modal-small",
    medium: "modal-medium",
    large: "modal-large",
    xlarge: "modal-xlarge",
    full: "modal-full",
  };

  const animationClasses = {
    fade: "modal-fade",
    slide: "modal-slide",
    scale: "modal-scale",
    bounce: "modal-bounce",
  };

  return (
    <div
      className={`modal-backdrop ${animationClasses[animation]} ${className}`}
      onClick={handleBackdropClick}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`modal-container ${sizeClasses[size]}`}
        onClick={handleModalClick}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className={`modal-header ${headerClassName}`}>
            {title && (
              <h2 className="modal-title" id="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="modal-close-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 5L5 15" />
                  <path d="M5 5L15 15" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className={`modal-body ${bodyClassName}`}>
          {conversionData ? (
            <div className="conversion-details">
              <div className="detail-section">
                <h3>File Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Original File:</span>
                    <span className="detail-value">
                      {conversionData.convertedName || conversionData.fileName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Converted File:</span>
                    <span className="detail-value">
                      {conversionData.convertedName || conversionData.fileName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">From Format:</span>
                    <span className="detail-value">
                      {(
                        conversionData.originalFormat ||
                        conversionData.sourceFormat ||
                        "N/A"
                      ).toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">To Format:</span>
                    <span className="detail-value">
                      {(
                        conversionData.targetFormat ||
                        conversionData.conversionType ||
                        "N/A"
                      ).toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">
                      {conversionData.size
                        ? `${(conversionData.size / 1024 / 1024).toFixed(2)} MB`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Conversion Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`detail-value status-${conversionData.status || conversionData.success}`}
                    >
                      {conversionData.status ||
                        (conversionData.success ? "Success" : "Failed")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">
                      {new Date(
                        conversionData.timestamp ||
                          conversionData.convertedAt ||
                          Date.now(),
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Conversion ID:</span>
                    <span className="detail-value code">
                      {conversionData.id || "N/A"}
                    </span>
                  </div>
                  {conversionData.duration && (
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">
                        {conversionData.duration} seconds
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {conversionData.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p className="notes">{conversionData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            children || <p>No conversion data available.</p>
          )}
        </div>

        {/* Modal Footer (optional) */}
        {footer && (
          <div className={`modal-footer ${footerClassName}`}>{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
