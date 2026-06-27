// AdvancedPayPalPayment.jsx
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";


const API_BASE = 'http://localhost:5000/api';



const AdvancedPayPalPayment = () => {
  const [amount, setAmount] = useState("50.00");
  const [message, setMessage] = useState("");
  const [plan_details, setPlan_Details] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [transactionDetails, setTransactionDetails] = useState(null);

  const initialOptions = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
  };


const showSnackbar = (message, severity = "info") => {
  setSnackbar({ open: true, message, severity });
};


const get_paypal_payment = async() =>
{

        try{

            const response = await axios.get(
            `${API_BASE}/get/paypal_payment_details`,
            {
                withCredentials: true
            }
            );


            if( response.status === 200 || response.status === 201)
            {
                setPlan_Details(response.data.plan);
                alert(plan_details);
                showSnackbar("Subscription successfully retrieved", "success");
            }

        }
        catch(error){
            showSnackbar("Subscription successfully retrieved", `${error.response.data.error}`);
        }


};





  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: plan_details.amount,
            currency_code: "GBP",
            breakdown: {
              item_total: {
                value: plan_details.amount,
                currency_code: "GBP",
              },
            },
          },
          items: [
            {
              name:
                plan_details.amount === "2.99" ||
                plan_details.amount === "20.99"
                  ? "Standard Plan"
                  : "Premium Plan",
              description: "Product description",
              quantity: "1",
              unit_amount: {
                value: plan_details.amount,
                currency_code: "GBP",
              },
            },
          ],
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      setMessage("Payment successful!");
      setTransactionDetails(details);

      // Send to backend
      await sendPaymentToBackend(details);
    } catch (error) {
      setMessage(`Payment failed: ${error.message}`);
    }
  };

  const sendPaymentToBackend = async (paymentDetails) => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: paymentDetails.id,
          payerID: paymentDetails.payer.payer_id,
          amount: plan_details.amount,
          status: paymentDetails.status,
        }),
      });

      const result = await response.json();
      console.log("Backend response:", result);
    } catch (error) {
      console.error("Error sending to backend:", error);
    }
  };

  return (
    <div
      style={{ padding: "20px", maxWidth: "500px" }}
      onClick={()=> {get_paypal_payment();}}
    >
      <h3>PayPal Payment</h3>

      <div style={{ marginBottom: "20px" }}>
        <label>Amount (GBP): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => setMessage(`Error: ${err.message}`)}
          onCancel={() => setMessage("Payment cancelled")}
        />
      </PayPalScriptProvider>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: message.includes("successful")
              ? "#d4edda"
              : "#f8d7da",
            border: "1px solid",
            borderColor: message.includes("successful") ? "#c3e6cb" : "#f5c6cb",
          }}
        >
          {message}
        </div>
      )}

      {transactionDetails && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h4>Transaction Details:</h4>
          <pre>{JSON.stringify(transactionDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdvancedPayPalPayment;
