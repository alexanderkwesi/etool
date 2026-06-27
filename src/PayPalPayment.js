// components/PayPalPayment.jsx
import React, { useState, useCallback } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { usePayment } from "../src/usePayment";
import PaymentStatus from "../src/PaymentStatus";
import LoadingSpinner from "../src/LoadingSpinner";
import "../src/PayPalComponent.css";

const PayPalPayment = ({
  amount,
  currency,
  productName,
  productDescription,
  onPaymentSuccess,
  customId,
  isOpen = false,
  onClose,
}) => {
  const [subscriptionID, setSubscriptionID] = useState(null);
  const [paymentStep, setPaymentStep] = useState("initial");

  const {
    loading,
    error,
    paymentData,
    verifyPayment,
    clearError,
    resetPayment,
  } = usePayment();

  const paypalOptions = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: currency,
    intent: "capture",
    components: "buttons",
  };

  const createOrder = useCallback(
    (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount,
              currency_code: currency,
              breakdown: {
                item_total: {
                  value: amount,
                  currency_code: currency,
                },
              },
            },
            items: [
              {
                name: productName,
                description: productDescription,
                quantity: "1",
                unit_amount: {
                  value: amount,
                  currency_code: currency,
                },
                category: "DIGITAL_GOODS",
              },
            ],
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: window.location.href,
          cancel_url: window.location.href,
        },
      });
    },
    [amount, currency, productName, productDescription]
  );

  const onApprove = useCallback(
    async (data, actions) => {
      try {
        setPaymentStep("processing");
        setSubscriptionID(data.orderID);

        const details = await actions.order.capture();

        // Verify payment with backend
        const verificationData = {
          orderID: data.orderID,
          payerID: data.payerID,
          amount: amount,
          custom_id: customId || `payment_${Date.now()}`,
        };

        const verificationResult = await verifyPayment(verificationData);
        setPaymentStep("completed");

        if (onPaymentSuccess) {
          onPaymentSuccess({
            ...details,
            verification: verificationResult,
          });
        }

        return details;
      } catch (error) {
        console.error("Payment approval error:", error);
        setPaymentStep("error");
      }
    },
    [amount, customId, verifyPayment, onPaymentSuccess]
  );

  const onError = useCallback((err) => {
    console.error("PayPal error:", err);
    setPaymentStep("error");
  }, []);

  const onCancel = useCallback(
    (data) => {
      console.log("Payment cancelled:", data);
      setPaymentStep("initial");
      resetPayment();
    },
    [resetPayment]
  );

  const retryPayment = useCallback(() => {
    setPaymentStep("initial");
    clearError();
    resetPayment();
  }, [clearError, resetPayment]);

  const handleClose = useCallback(() => {
    setPaymentStep("initial");
    resetPayment();
    clearError();
    if (onClose) onClose();
  }, [onClose, resetPayment, clearError]);

  const handleProceedToPayment = useCallback(() => {
    setPaymentStep("payment");
  }, []);

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Modal wrapper component
  const ModalWrapper = ({ children, title, showCloseButton = true }) => (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          {showCloseButton && (
            <button className="modal-close-button" onClick={handleClose}>
              ×
            </button>
          )}
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );

  // Render different modals based on payment step
  const renderModalContent = () => {
    switch (paymentStep) {
      case "processing":
        return (
          <ModalWrapper title="Processing Payment" showCloseButton={false}>
            <div className="payment-processing">
              <LoadingSpinner />
              <p>Processing your payment...</p>
              <p>Please wait while we complete your transaction.</p>
            </div>
          </ModalWrapper>
        );

      case "completed":
        return (
          <ModalWrapper title="Payment Successful">
            <div className="payment-completed">
              <PaymentStatus
                paymentData={paymentData}
                orderID={subscriptionID}
                onNewPayment={retryPayment}
              />
              <div className="modal-actions">
                <button onClick={handleClose} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </ModalWrapper>
        );

      case "error":
        return (
          <ModalWrapper title="Payment Failed">
            <div className="payment-error">
              <div className="error-icon">⚠️</div>
              <h3>Payment Failed</h3>
              <p>{error || "There was an error processing your payment."}</p>
              <div className="modal-actions">
                <button onClick={retryPayment} className="retry-button">
                  Try Again
                </button>
                <button onClick={handleClose} className="close-button">
                  Cancel
                </button>
              </div>
            </div>
          </ModalWrapper>
        );

      case "payment":
        return (
          <ModalWrapper title="Complete Your Payment">
            <div className="payment-payment">
              <div className="payment-summary-modal">
                <h4>Order Summary</h4>
                <div className="summary-item">
                  <span>{productName}</span>
                  <span>
                    {amount} {currency}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>
                    {amount} {currency}
                  </span>
                </div>
              </div>

              <div className="paypal-buttons-container">
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal",
                    height: 45,
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  onCancel={onCancel}
                  disabled={loading}
                  forceReRender={[amount, currency]}
                />
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => setPaymentStep("initial")}
                  className="back-button"
                >
                  Back to Summary
                </button>
              </div>
            </div>
          </ModalWrapper>
        );

      default: // "initial"
        return (
          <ModalWrapper title="Payment Summary">
            <div className="payment-initial">
              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span>Product:</span>
                    <span>{productName}</span>
                  </div>
                  <div className="summary-item">
                    <span>Description:</span>
                    <span>{productDescription}</span>
                  </div>
                  <div className="summary-item">
                    <span>Amount:</span>
                    <span>
                      {amount} {currency}
                    </span>
                  </div>
                  <div className="summary-total">
                    <span>Total Amount:</span>
                    <span>
                      {amount} {currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleProceedToPayment}
                  className="proceed-to-payment-button"
                  disabled={!amount || amount === "0"}
                >
                  Proceed to Payment
                </button>
                <button onClick={handleClose} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </ModalWrapper>
        );
    }
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {renderModalContent()}
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
