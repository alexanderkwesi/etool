// hooks/usePayment.js
import { useState, useCallback } from "react";
import { paymentService, paymentUtils } from "../src/paymentService";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const verifyPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.verifyPayment(paymentData);
      setPaymentData(result);
      return result;
    } catch (err) {
      const errorMessage = paymentUtils.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetPayment = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentData(null);
  }, []);

  return {
    loading,
    error,
    paymentData,
    verifyPayment,
    clearError,
    resetPayment,
  };
};
