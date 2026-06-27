// components/PaymentStatus.jsx
import React from "react";
import { paymentUtils } from "../src/paymentService";

const PaymentStatus = ({ paymentData, orderID, onNewPayment }) => {
  if (!paymentData) return null;

  const { status, amount, currency, transaction_id, timestamp } = paymentData;

  const isSuccess = status === "COMPLETED" || status === "APPROVED";

  return (
    <div className="payment-status">
      <div className={`status-icon ${isSuccess ? "success" : "warning"}`}>
        {isSuccess ? "✅" : "⚠️"}
      </div>

      <h3>Payment {isSuccess ? "Successful" : "Processing"}</h3>

      <div className="payment-details">
        <div className="detail-item">
          <span>Order ID:</span>
          <span>{orderID}</span>
        </div>

        {transaction_id && (
          <div className="detail-item">
            <span>Transaction ID:</span>
            <span>{transaction_id}</span>
          </div>
        )}

        <div className="detail-item">
          <span>Amount:</span>
          <span>{paymentUtils.formatAmount(amount, currency)}</span>
        </div>

        <div className="detail-item">
          <span>Status:</span>
          <span className={`status-badge ${status.toLowerCase()}`}>
            {status}
          </span>
        </div>

        {timestamp && (
          <div className="detail-item">
            <span>Date:</span>
            <span>{new Date(timestamp).toLocaleString()}</span>
          </div>
        )}
      </div>

      {!isSuccess && (
        <div className="processing-notice">
          <p>Your payment is being processed. This may take a few moments.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
