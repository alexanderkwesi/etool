// components/PayPalPayment.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { usePayment } from "../src/usePayment";
import PaymentStatus from "../src/PaymentStatus";
import LoadingSpinner from "../src/LoadingSpinner";
import "../src/PayPalComponent.css";
import axios from "axios";
import { API_BASE, apiFetch, authApi, userApi, plansApi, paypalApi } from "./apiConfig";

const PayPalPayments = ({
  amount,
  currency,
  productName,
  productDescription,
  onPaymentSuccess,
  customId,
  isOpen = false,
  onClose,
  userEmail, // Add userEmail prop from parent
  planId, // Add planId prop from parent
}) => {
  const [subscriptionID, setSubscriptionID] = useState(null);
  const [paymentStep, setPaymentStep] = useState("initial");
  const [backendLoading, setBackendLoading] = useState(false);

  const {
    loading,
    error,
    paymentData,
    verifyPayment,
    clearError,
    resetPayment,
  } = usePayment();



  const [PayPalButton, setPayPalButton] = useState(false); 


  const paypalRef = useRef();

  useEffect(() => {
    console.log("PayPal button mounted:", paypalRef.current);
  }, []);





  const paypalOptions = {
    clientId:
      process.env.PAYPAL_CLIENT_ID ||
      "AcoW2RZf27DrcuuOiWhQE5w-Ys8urRWvnVl4TXbvNPBxtXhpIca2JC6te0NkJCnjsEd5HIg-A8RtmvXK", // Fixed: Use REACT_APP prefix
    currency: currency,
    intent: "capture",
    components: "buttons",
    "enable-funding": "paypal",
    "disable-funding": "card,venmo",
  };


  const PaymentSuccess = (onPaymentSuccess) =>{

    if(onPaymentSuccess)
    {
        handleProceedToPayment();
    }

  } ;

  // Enhanced handleProceedToPayment with backend call
  const handleProceedToPayment = useCallback(async () => {
    try {
      setBackendLoading(true);

      // Call backend to create payment record before proceeding to PayPal
      const response = await axios.post(
        `${API_BASE}/payments/create-payment-intent`,
        {
          amount: amount,
          currency: currency,
          productName: productName,
          productDescription: productDescription,
          customId: customId,
          userEmail: userEmail,
          planId: planId,
          paymentMethod: "paypal",
          status: "pending",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Payment intent created:", response.data);
        setPaymentStep("payment");
        setPayPalButton(true);
        alert(response.data.message);

        if (response.data.paymentIntentId) {
          localStorage.setItem(
            "paymentIntentId",
            response.data.paymentIntentId
          );
        }
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to initialize payment. Please try again.";

      // Use a better error display method instead of alert
      console.error("Payment initialization error:", errorMessage);
      setPaymentStep("initial");
    } finally {
      setBackendLoading(false);
    }
  }, [
    amount,
    currency,
    productName,
    productDescription,
    customId,
    userEmail,
    planId,
    API_BASE,
  ]);
















const handleOrderCancellation = async (orderData, error) => {
  try {
    const cancellationData = {
      order_id: orderData?.order?.id,
      // eslint-disable-next-line no-undef
      user_id: getCurrentUserId(), // Your user ID function
      // eslint-disable-next-line no-undef
      session_id: getSessionId(), // Your session ID function
      amount: orderData?.amount,
      currency: orderData?.currency,
      reason: error.message,
      additional_info: {
        error_type: error.name,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      },
    };

    const response = await axios.post(
      `${API_BASE}/cancel-order`,
      cancellationData,
      {
        withCredentials: true,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          "X-Cancellation-Source": "frontend-paypal-flow",
        },
      }
    );

    if (response.data.success) {
      console.log("Order cancellation processed:", response.data);
      return response.data.cancellation_id;
    } else {
      console.warn("Cancellation request failed:", response.data);
      return null;
    }
  } catch (cancelError) {
    console.error("Failed to notify backend about cancellation:", cancelError);
    // Don't throw - this is secondary to the main error
    return null;
  }
};














const createOrder = useCallback(
  async (data, actions, url) => {
    // Validate amount before creating order
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error("Invalid amount specified");
    }

    // Validate currency
    if (!currency || currency.trim() === "") {
      throw new Error("Currency is required");
    }

    // Use data for analytics/logging
    console.log("Creating order with payment source:", data.paymentSource);

    const orderUrl = `${API_BASE}/create-paypal-order`;

    try {
      // Step 1: Create order on your backend
      const response = await axios.post(
        orderUrl,
        {
          amount: String(amount),
          currency: currency,
          //product_name: productName,
         // product_description: productDescription,
         // custom_id: customId,
        },
        {
          withCredentials: true,
          timeout: 30000, // 30 second timeout
        }
      );

      // Check for successful response
      if (response.status === 200 || response.status === 201) {
        // Check if the backend response indicates success
        if (response.data.success) {
          console.log(
            "Backend order created successfully:",
            response.data.message
          );

          // Step 2: Create PayPal order on frontend using backend order ID
          try {
            const paypalOrder = await actions.order.create({
              
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                    "amount": {
                        "currency_code": "GBP",
                        "value": String(amount),
                    }
                    }
                ],
                "payment_method": {
                    "payer_selected": "PAYPAL",  // Uppercase, or remove entirely
                    "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
                },
                "application_context": {
                    "return_url": "https://localhost:3000/payment",
                    "cancel_url": "https://yourdomain.com/cancel"
                }
                }
            );

            console.log("PayPal order created successfully:", paypalOrder);
            return paypalOrder;
          } catch (paypalError) {
            console.error("PayPal order creation error:", paypalError);

            // Optionally: Notify backend about failed PayPal order creation
            try {
             const res = await axios.post(
                `${API_BASE}/cancel-order`,
                {
                  order_id: response.data.order?.id,
                  reason: "PayPal order creation failed",
                },
                { withCredentials: true }
              );
            } catch (cancelError) {
              console.error(
                "Failed to notify backend about cancelled order:",
                cancelError
              );
              // Notify backend about cancellation
              await handleOrderCancellation(cancelError.res?.data, error);
            }

            throw new Error(
              `PayPal order creation failed: ${paypalError.message}`
            );
          }
        } else {
          // Backend returned error
          throw new Error(
            response.data.error || "Backend order creation failed"
          );
        }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);

      // Enhanced error messages for better user experience
      let userFriendlyError = "Order creation failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 400) {
          userFriendlyError =
            "Invalid request. Please check your payment details.";
        } else if (status === 401 || status === 403) {
          userFriendlyError =
            "Authentication error. Please refresh the page and try again.";
        } else if (status === 422) {
          userFriendlyError =
            errorData.details || "Validation error. Please check your input.";
        } else if (status === 500) {
          userFriendlyError =
            "Server error. Please try again in a few moments.";
        } else if (status === 503) {
          userFriendlyError =
            "Service temporarily unavailable. Please try again later.";
        } else {
          userFriendlyError =
            errorData.error || `Payment error (${status}). Please try again.`;
        }

        console.error("Server error details:", errorData);
      } else if (error.request) {
        // Request was made but no response received
        userFriendlyError =
          "Network error. Please check your connection and try again.";
      } else if (error.code === "ECONNABORTED") {
        // Request timeout
        userFriendlyError = "Request timeout. Please try again.";
      }

      // Show user-friendly alert
      alert(`Order creation error: ${userFriendlyError}`);

      // Re-throw the original error for PayPal to handle
      throw new Error(userFriendlyError);
    }
  },
  [amount, currency, API_BASE, productName, productDescription, customId, error]
);








  const onApprove = useCallback(
    async (data, actions) => {
      try {
        setPaymentStep("processing");
        setSubscriptionID(data.orderID);

        // Capture the payment with PayPal
        const details = await actions.order.capture();

        // Verify payment with our backend
        const verificationData = {
          orderID: data.orderID,
          payerID: data.payerID,
          amount: amount,
          custom_id: customId,
          userEmail: userEmail,
          planId: planId,
        };

        const verificationResult = await verifyPayment(verificationData);

        // Update backend with successful payment
        try {
          await axios.post(
            `${API_BASE}/payments/update-payment-status`,
            {
              orderID: data.orderID,
              status: "completed",
              paypalTransactionId: details.id,
              verificationData: verificationResult,
            },
            {
              withCredentials: true,
            }
          );
        } catch (updateError) {
          console.error("Failed to update payment status:", updateError);
          // Don't throw here - the payment was successful with PayPal
        }

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

        // Update backend with failed payment status
        try {
          await axios.post(
            `${API_BASE}/payments/update-payment-status`,
            {
              orderID: data.orderID,
              status: "failed",
              error: error.message,
            },
            {
              withCredentials: true,
            }
          );
        } catch (updateError) {
          console.error("Failed to update payment status:", updateError);
        }

        setPaymentStep("error");
      }
    },
    [
      amount,
      customId,
      verifyPayment,
      onPaymentSuccess,
      userEmail,
      planId,
      API_BASE,
    ]
  );

  const onError = useCallback((err) => {
    console.error("PayPal error:", err);
    setPaymentStep("error");
  }, []);

  const onCancel = useCallback(
    async (data) => {
      console.log("Payment cancelled:", data);

      // Update backend with cancelled payment status
      try {
        await axios.post(
          `${API_BASE}/payments/update-payment-status`,
          {
            orderID: data.orderID,
            status: "cancelled",
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Failed to update cancelled payment status:", error);
      }

      setPaymentStep("initial");
      resetPayment();
    },
    [resetPayment, API_BASE]
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

              {PayPalButton ? (
                <div className="paypal-buttons-container">
                  <PayPalButtons
                    ref={paypalRef}
                    key={`paypal-${amount}-${currency}-${Date.now()}`} // Force re-render
                    style={{
                      layout: "vertical",
                      color: "blue",
                      shape: "rect",
                      label: "paypal",
                      height: 45,
                      width: 145,
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    disabled={loading}
                    forceReRender={[amount, currency]}
                  />
                </div>
              ) : (
                <div className="modal-actions">
                  <button
                    onClick={() => setPaymentStep("initial")}
                    className="back-button"
                  >
                    Back to Summary
                  </button>
                </div>
              )}
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
                  {userEmail && (
                    <div className="summary-item">
                      <span>Customer Email:</span>
                      <span>{userEmail}</span>
                    </div>
                  )}
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
                  disabled={!amount || amount === "0" || backendLoading}
                >
                  {backendLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Initializing Payment...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="cancel-button"
                  disabled={backendLoading}
                >
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

export default PayPalPayments;
