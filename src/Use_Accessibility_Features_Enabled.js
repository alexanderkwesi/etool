import React from "react";
import "./Use__Accessibility_Features_Enabled.css"; // Optional: import styles if you create a separate CSS file

/**
 * AccessibilityMessagePage
 *
 * A React page component that displays an accessibility notice.
 * It informs users that accessibility features need to be enabled,
 * or they can call a provided number for assistance ("let us buy for you").
 */
const AccessibilityMessagePage = () => {
  // Handler for the call-to-action button – could be extended with analytics or a modal
  const handleCallClick = () => {
    // Placeholder for potential analytics tracking or additional UI feedback
    console.log("Call us clicked – assistive shopping requested");
  };

  return (
    <main
      className="accessibility-page"
      role="main"
      aria-labelledby="accessibility-heading"
    >
      <div className="accessibility-container">
        {/* Icon or decorative element for visual emphasis */}
        <div className="accessibility-icon" aria-hidden="true">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="6"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 10L12 18M12 18L8 22M12 18L16 22M5 13L12 13L19 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Main heading – clearly identifies the accessibility message */}
        <h1 id="accessibility-heading" className="accessibility-heading">
          Accessibility Features Required
        </h1>

        {/* Primary message explaining the need to enable assistive tools */}
        <p className="accessibility-message">
          To ensure a seamless and inclusive shopping experience, please enable
          your browser’s accessibility features (such as screen reader support,
          high contrast, or keyboard navigation). If you need assistance or
          prefer to shop with personalized help, our team is ready to assist
          you.
        </p>

        {/* Call-to-action area – emphasizes "let us buy for you" service */}
        <div className="accessibility-cta">
          <p className="cta-text">
            <strong>Need help? Let us buy for you.</strong>
          </p>
          <p className="call-instructions">
            Call our dedicated accessibility support line:
          </p>

          {/* Phone number with clear, large touch target – actual number would be real in production */}
          <a
            href="tel:+18005551234" // Replace with actual support number
            className="call-button"
            onClick={handleCallClick}
            aria-label="Call us at 1-800-555-1234 for assisted shopping"
          >
            📞 1-800-555-1234
          </a>
          <p className="availability-note">
            Our accessibility team is available Monday–Friday, 8 AM – 8 PM ET.
          </p>
        </div>

        {/* Secondary message with additional context or reassurance */}
        <p className="secondary-message">
          We are committed to providing an accessible environment for all
          customers. Enabling features or calling us ensures you receive the
          best possible support.
        </p>
      </div>

      {/* Optional footer with copyright or other links, can be omitted */}
      <footer className="accessibility-footer" role="contentinfo">
        <small>&copy; 2025 Your Company Name. All rights reserved.</small>
      </footer>
    </main>
  );
};

export default AccessibilityMessagePage;
