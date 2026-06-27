import React, { useState, useEffect } from "react";
import PayPalPayment from '../src/PayPalPayments';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  CreditCard,
  AccountBalance,
  Lock,
  ArrowBack,
  CheckCircle,
  Description,
} from "@mui/icons-material";
import axios from "axios";
import { useCallback } from "react";

import { API_BASE, apiFetch, authApi, userApi, plansApi, paypalApi } from "./apiConfig";


const PaymentPage = () => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    rememberCard: false,
  });
  const [selectedAddress, setSelectedAddress] = useState({});
  const [saveCard, setCard] = useState([]);
  const [assignemail, setEmail] = useState([]);
  const [errorMsg, setEmailError] = useState({});
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [cardSave, setonCardSaved] = useState([]);
  const [saveAddress, setSaveAddress] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Name, setName] = useState("");
  const [addressErrors, setAddressErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  let address__id = 0;
  let payment__id = 0;
  let email = "";

  const steps = ["Payment Method", "Review & Pay", "Confirmation"];
  // In Use_Payment.js - Complete PayPal integration
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [storeSubscription, setSubscription] = useState([]);
  //const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    retrieve_subscription();
    // eslint-disable-next-line no-use-before-define
  }, []);

  useEffect(() => {
    // Update billing address country when selectedAddress changes
    if (selectedAddress.country) {
      setBillingAddress((prev) => ({
        ...prev,
        country:
          selectedAddress.country === "United Kingdom"
            ? "United Kingdom"
            : selectedAddress.country,
      }));
    }
  }, [selectedAddress]);




  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  

  const getSessionDebugData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get/created-subscription/session`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        // Access the subscription data from the debug response
        const subscription = data.subscription;

        console.log("Debug session info:", data);
        console.log("Subscription from debug:", subscription);

        if (subscription && subscription.name) {
          setSelectedPlan(subscription);
          setName(subscription.name);
          setShow(true);
          setActive(false);
          showSnackbar("Subscription successfully retrieved", "success");
        } else {
          console.warn("No valid subscription in debug data:", data);
          showSnackbar("No active subscription found", "info");
          setShow(false);
        }
      }
    } catch (error) {
      // Axios error handling
      if (error.response) {
        // Server responded with a status code outside 2xx range
        const status = error.response.status;

        if (status === 404) {
          showSnackbar("No active subscription found", "info");
          setShow(false);
        } else if (status === 401) {
          showSnackbar(
            "Please log in to view subscription if you have any or contact support",
            "error"
          );
          window.location.href = "/signup";
        } else {
          showSnackbar("Failed to retrieve subscription", `${error.message}`);
          setShow(false);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error:", error.request);
        showSnackbar("Network error: Unable to connect to server", "error");
        setShow(false);
      } else {
        // Something else happened
        console.error("Error:", error.message);
        showSnackbar(`Unable to load subscription: ${error.message}`, "error");
        setShow(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionData_ = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get/created-subscription/session`,
        {
          withCredentials: true,
        }
      );
      // Handle all possible cases - data IS the serializable_data
      if (response.status === 200 || response.status === 201) {
        const data = response.data; // This contains the serializable_data directly

        let subscription = null;

        subscription = data.subscription;

        console.log("Processed subscription:", subscription);

        if (subscription && subscription.name) {
          //alert(subscription.name);
          setSelectedPlan(subscription);
          setName(subscription.name);
          setShow(true);
          setActive(false);
          showSnackbar("Subscription successfully retrieved", "success");
        } else {
          console.warn("Invalid subscription data:", data);
          showSnackbar("Invalid subscription data format", "error");
          setShow(false);
        }
      } else {
        showSnackbar("Try again!!!", "error");
        window.location.href = "/features";
      }
    } catch (error) {
      // Axios error handling
      if (error.response) {
        // Server responded with a status code outside 2xx range
        const status = error.response.status;

        if (status === 404) {
          showSnackbar("No active subscription found", "info");
          setShow(false);
        } else if (status === 401) {
          showSnackbar(
            "Please log in to view subscription if you have any or contact support",
            "error"
          );
          window.location.href = "/signup";
        } else {
          showSnackbar("Failed to retrieve subscription", `${error.message}`);
          setShow(false);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error:", error.request);
        showSnackbar("Network error: Unable to connect to server", "error");
        setShow(false);
      } else {
        // Something else happened
        console.error("Error:", error.message);
        showSnackbar(`Unable to load subscription: ${error.message}`, "error");
        setShow(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retrieve_subscription = () => {
    if (window.location.pathname === "/payment") {
      setActive(true);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });

    // Clear error when user starts typing
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(value);
    const isLengthValid = value.length <= 50 && value.length > 0;
    const isValid = isValidFormat && isLengthValid;

    setEmail(value);

    // Set validation states (optional)
    setEmailError(
      !isValid ? "Please enter a valid email address (max 50 characters)" : ""
    );

    return isValid;
  };

  const handleBankTransferEmailChange = (e) => {
    const value = e.target.value.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(value);
    const isLengthValid = value.length <= 50 && value.length > 0;
    const isValid = isValidFormat && isLengthValid;

    setEmail(value);

    // Set validation states (optional)
    setEmailError(
      !isValid ? "Please enter a valid email address (max 50 characters)" : ""
    );

    return isValid;
  };

  const rememberCardDetails = async (isChecked) => {
    // Check if checkbox is checked and card details exist
    if (isChecked && cardDetails) {
      setIsLoading(true);

      try {
        // Sanitize card details
        const sanitizedCardDetails = {
          cardNumber: cardDetails.cardNumber
            ? cardDetails.cardNumber.replace(/\D/g, "").slice(0, 16)
            : "",
          expiryDate: cardDetails.expiryDate
            ? cardDetails.expiryDate.replace(/[^\d/]/g, "").slice(0, 5)
            : "",
          cvv: cardDetails.cvv
            ? cardDetails.cvv.replace(/\D/g, "").slice(0, 4)
            : "",
          cardHolder: cardDetails.cardName
            ? cardDetails.cardName.replace(/[^a-zA-Z\s]/g, "").trim()
            : "",
          rememberCard: true,
          paymentType: "card",
        };

        // Validate required fields
        if (
          !sanitizedCardDetails.cardNumber ||
          sanitizedCardDetails.cardNumber.length < 16
        ) {
          //throw new Error("Invalid card number");
          alert("Invalid card number");
        }

        if (
          !sanitizedCardDetails.expiryDate ||
          !/^\d{2}\/\d{2}$/.test(sanitizedCardDetails.expiryDate)
        ) {
          throw new Error("Invalid expiry date format (MM/YY required)");
        }

        if (!sanitizedCardDetails.cvv || sanitizedCardDetails.cvv.length < 3) {
          throw new Error("Invalid CVV");
        }

        if (!sanitizedCardDetails.cardHolder) {
          throw new Error("Card holder name is required");
        }

        // Make POST request
        const response = await axios.put(
          `${API_BASE}/card-details`,
          sanitizedCardDetails,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200 || response.status === 201) {
          showSnackbar("Card details saved successfully");
          //setonCardSaved(response.data.cardData);
          handleNext();
        } else if (
          response.status === 400 ||
          response.status === 401 ||
          response.status === 404
        ) {
          showSnackbar("Error Saving Card details, error");
        }
      } catch (error) {
        showSnackbar(`Error saving card details: ${error.message}`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      showSnackbar("Remember card option not selected");
      return null;
    }
  };

  const rememberCardDetails_list = async (isChecked) => {
    // Check if checkbox is checked and card details exist
    if (isChecked && cardDetails) {
      setIsLoading(true);

      // Sanitize card details
      const sanitizedCardDetails = {
        cardNumber: cardDetails.cardNumber
          ? cardDetails.cardNumber.replace(/\D/g, "").slice(0, 16)
          : "",
        expiryDate: cardDetails.expiryDate
          ? cardDetails.expiryDate.replace(/[^\d/]/g, "").slice(0, 5)
          : "",
        cvv: cardDetails.cvv
          ? cardDetails.cvv.replace(/\D/g, "").slice(0, 4)
          : "",
        cardHolder: cardDetails.cardName
          ? cardDetails.cardName.replace(/[^a-zA-Z\s]/g, "").trim()
          : "",
        rememberCard: isChecked,
        paymentType: "card",
      };

      // Validate required fields
      if (
        !sanitizedCardDetails.cardNumber ||
        sanitizedCardDetails.cardNumber.length < 16
      ) {
        //throw new Error("Invalid card number");
        alert("Invalid card number");
        return;
      }

      if (
        !sanitizedCardDetails.expiryDate ||
        !/^\d{2}\/\d{2}$/.test(sanitizedCardDetails.expiryDate)
      ) {
        throw new Error("Invalid expiry date format (MM/YY required)");
      }

      if (!sanitizedCardDetails.cvv || sanitizedCardDetails.cvv.length < 3) {
        throw new Error("Invalid CVV");
      }

      if (!sanitizedCardDetails.cardHolder) {
        throw new Error("Card holder name is required");
      }

      if (sanitizedCardDetails) {
        showSnackbar("Card details saved successfully");

        setonCardSaved(sanitizedCardDetails);
        //setonCardSaved(response.data.cardData);
        handleNext();
      } else {
        showSnackbar("Error Saving Card details, error");
      }
    }
  };

  const rememberPayPalDetails = async () => {
    const ispaypal = "paypal";
    if (assignemail && ispaypal) {
      email = assignemail;

      try {
        const response = await axios.post(
          `${API_BASE}/paypal`,
          {
            email: assignemail,
            payment_type: ispaypal,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 || response.status === 201) {
          showSnackbar("Paypal details saved successfully");
          //setonCardSaved(response.data.cardData);
          handleNext();
          return email;
        } else if (
          response.status === 400 ||
          response.status === 401 ||
          response.status === 404
        ) {
          showSnackbar("Error Saving paypal details, error");
        }
      } catch (error) {
        showSnackbar("Error", `${error}`);
      }
    } else {
      showSnackbar("Error Saving paypal details, error");
    }
  };

  const add_paypal_Address = async () => {
    if (!validateAddress()) {
      showSnackbar("Please fix the errors in the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      const { firstName, lastName, address, city, postcode, country } =
        billingAddress;

      const response = await fetch(`${API_BASE}/add/pay-pal-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          address: address,
          city: city,
          postcode: postcode,
          country: country,
        }),
        credentials: "include", // Equivalent to axios' withCredentials: true
      });

      // Parse the response JSON
      const data = await response.json();

      // Check for successful response
      if (response.ok && data.status === 200) {
        showSnackbar("Address successfully added", "success");

        console.log("Created address:", data.address_data);
        handleNext();
      } else {
        // Handle cases where status is not 200
        const errorMsg = data?.error || "Address could not be entered";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      // Improved error handling
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        // Network error
        showSnackbar("Network error: Please check your connection", "error");
      } else {
        // Other errors
        showSnackbar(`Error: ${error.message}`, "error");
      }
      console.error("Add address error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const add_bank_Address = async () => {
    if (!validateAddress()) {
      showSnackbar("Please fix the errors in the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      const { firstName, lastName, address, city, postcode, country } =
        billingAddress;

      const response = await fetch(`${API_BASE}/add/bank-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          address: address,
          city: city,
          postcode: postcode,
          country: country,
        }),
        credentials: "include", // Equivalent to axios' withCredentials: true
      });

      // Parse the response JSON
      const data = await response.json();

      // Check for successful response
      if (response.ok && data.status === 200) {
        showSnackbar("Address successfully added", "success");
        console.log("Created address:", data.address_data);
        handleNext();
      } else {
        // Handle cases where status is not 200
        const errorMsg = data?.error || "Address could not be entered";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      // Improved error handling
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        // Network error
        showSnackbar("Network error: Please check your connection", "error");
      } else {
        // Other errors
        showSnackbar(`Error: ${error.message}`, "error");
      }
      console.error("Add address error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const rememberBankDetails = async () => {
    const isbanktransfer = "bank";
    const address =
      "Bank Transfer Details, Account Name: DocRevisor Ltd, Sort Code: 12-34-56, Account Number: 12345678";

    if (assignemail && isbanktransfer && address) {
      try {
        const response = await axios.post(
          `${API_BASE}/bank`,
          {
            address: address,
            email: assignemail,
            payment_type: isbanktransfer,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 || response.status === 201) {
          showSnackbar("Bank details saved successfully");
          //setonCardSaved(response.data.cardData);
          handleNext();
        } else if (
          response.status === 400 ||
          response.status === 401 ||
          response.status === 404
        ) {
          showSnackbar("Error Saving details, error");
        }
      } catch (error) {
        showSnackbar("Error", `${error}`);
      }
    } else {
      showSnackbar("Error Saving details, error");
    }
  };

  const add_card_payment = async (address__id) => {
    // Sanitize card details
    const sanitizedCardDetails = {
      cardNumber: cardDetails.cardNumber
        ? cardDetails.cardNumber.replace(/\D/g, "").slice(0, 16)
        : "",
      expiryDate: cardDetails.expiryDate
        ? cardDetails.expiryDate.replace(/[^\d/]/g, "").slice(0, 5)
        : "",
      cvv: cardDetails.cvv
        ? cardDetails.cvv.replace(/\D/g, "").slice(0, 4)
        : "",
      cardHolder: cardDetails.cardName
        ? cardDetails.cardName.replace(/[^a-zA-Z\s]/g, "").trim()
        : "",
      rememberCard: true,
      paymentType: "card",
      // FIX: Get the ID from the address object, not the entire object
      address_id: address__id, // Use optional chaining and get the ID
      subscription_id: selectedPlan.id,
    };

    // Validate required fields
    if (
      !sanitizedCardDetails.cardNumber ||
      sanitizedCardDetails.cardNumber.length < 16
    ) {
      showSnackbar("Invalid card number");
      window.location.href = "/payment";
      return;
    }

    if (
      !sanitizedCardDetails.expiryDate ||
      !/^\d{2}\/\d{2}$/.test(sanitizedCardDetails.expiryDate)
    ) {
      showSnackbar("Invalid expiry date format (MM/YY required)");
      return;
    }

    if (!sanitizedCardDetails.cvv || sanitizedCardDetails.cvv.length < 3) {
      showSnackbar("Invalid CVV");
      return;
    }

    if (!sanitizedCardDetails.cardHolder) {
      showSnackbar("Card holder name is required");
      return;
    }

    // Validate the additional required fields
    if (!sanitizedCardDetails.address_id) {
      showSnackbar(`Please select an address first ${address__id}`);
      return;
    }

    if (!sanitizedCardDetails.subscription_id) {
      showSnackbar(
        `Please select a subscription plan first, ${sanitizedCardDetails.subscription_id}`
      );
      return;
    }

    // Debug: Check what you're sending
    console.log("Sending to backend:", {
      ...sanitizedCardDetails,
      cardNumber: "***" + sanitizedCardDetails.cardNumber.slice(-4), // Mask card number for logging
    });

    try {
      const response = await axios.post(
        `${API_BASE}/add/card-payment`,
        sanitizedCardDetails,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSnackbar("Card details saved successfully");
        //handleNext();
      } else if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 404
      ) {
        showSnackbar("Error Saving details");
        setActiveStep(1);

        return;
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showSnackbar(error.response?.data?.error || "Error saving card details");
      window.location.href = `/payment`;
      setActiveStep(1);
    }
  };






  // Handle PayPal success
  const handlePayPalSuccess = useCallback(
    async (paymentDetails) => {
      try {
        console.log("PayPal payment successful:", paymentDetails);

        // Show processing message
        showSnackbar("Processing your PayPal payment...", "info");

        // Send verification to your backend
        const response = await axios.post(
          `${API_BASE}/payments/verify`,
          {
            orderID: paymentDetails.verification.orderID,
            payerID: paymentDetails.verification.payerID,
            amount: selectedPlan.price,
            custom_id: `subscription_${selectedPlan.id}`,
            planId: selectedPlan.id,
            userEmail: assignemail,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 || response.status === 201) {
          showSnackbar(
            "Payment verified and subscription activated!",
            "success"
          );
          setShowPayPalModal(false);
          handleNext(); // Move to confirmation step
        }
      } catch (error) {
        console.error("PayPal verification error:", error);
        showSnackbar("Error verifying PayPal payment", "error");
      }
    },
    [selectedPlan, assignemail]
  );
















  const validateAddress = () => {
    const errors = {};

    if (billingAddress.firstName.trim().length <= 1) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (billingAddress.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (billingAddress.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters";
    }

    if (billingAddress.city.trim().length < 3) {
      errors.city = "City must be at least 3 characters";
    }

    if (billingAddress.postcode.trim().length < 3) {
      errors.postcode = "Postcode must be at least 3 characters";
    }

    if (billingAddress.country.trim().length < 3) {
      errors.country = "Please select a valid country";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addAddress = async () => {
    if (!validateAddress()) {
      showSnackbar("Please fix the errors in the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      const { firstName, lastName, address, city, postcode, country } =
        billingAddress;

      const response = await fetch(`${API_BASE}/add/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          address: address,
          city: city,
          postcode: postcode,
          country: country,
        }),
        credentials: "include", // Equivalent to axios' withCredentials: true
      });

      // Parse the response JSON
      const data = await response.json();

      console.log("API Response - data.address:", data.address);
      console.log("Type of data.address:", typeof data.address);
      console.log("Is array?", Array.isArray(data.address));

      // Check for successful response
      if (response.ok && data.status === 200) {
        setSaveAddress(data.address);
        address__id = data.address.id;
        //alert(address__id);
        //handleNext();
        showSnackbar("Address and Card details successfully added", "success");
        console.log("Created address:", data.address);
        const a = add_card_payment(address__id);
        if (a.status === 200 || a.status === 201) {
          showSnackbar("Card details saved successfully");
        } else {
          showSnackbar(`${response.message}`);

          return;
        }
      } else {
        // Handle cases where status is not 200
        const errorMsg = data?.error || "Address could not be entered";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      // Improved error handling
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        // Network error
        showSnackbar("Network error: Please check your connection", "error");
      } else {
        // Other errors
        showSnackbar(`Error: ${error.message}`, "error");
      }
      console.error("Add address error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paypal_create_payment = async () => {
    const response = await axios.post(
      `${API_BASE}/paypal/create-payment`,
      {
        plan_name: selectedPlan.name,
        amount: selectedPlan.price,
        currency: "GBP",
        description: selectedPlan.description,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200 || response.status === 201) {
      showSnackbar("Paypal payment subscription created successfully");
      payment__id = response.data.paymentID;
      let payer = response.data.payer.payer_id;
      let amount = response.data.amount.total;
      let currency = response.data.amount.currency;
      let approvalUrl = response.data.approvalUrl;
      alert(payment__id);
      alert(payer);
      let paymentID = payment__id;
      let token = paymentID;
      //window.location.href = `https://www.paypal.com/checkoutnow?token=${paymentID}`;
      //window.location.href = `https://sandbox.paypal.com`;
      // Redirect user to PayPal
      const a = paypal_payment(paymentID);
      if (a.status === 200 || a.status === 201) {
        return a;
      }
    } else {
      const error = response.error;
      showSnackbar(`Paypal payment subscription error ${error}`);
    }
  };

  const paypal_payment = async (paymentID) => {
    const response = await axios.get(
      `${API_BASE}/paypal/payment-status/paymentId=${paymentID}`,
      {
        withCredentials: true,
      }
    );

    if (response.status === 200 || response.status === 201) {
      showSnackbar("Paypal payment subscription created successfully");
      payment__id = response.data.paymentID;
      let payer = response.data.payer;
      //let amount = response.data.amount.total;
      //let currency = response.data.amount.currency;
      //let approvalUrl = response.data.approvalUrl;
      alert(payment__id);
      alert(payer);
      let paymentID = payment__id;
      let token = paymentID;
      //window.location.href = `https://www.paypal.com/checkoutnow?token=${paymentID}`;
      //window.location.href = `https://sandbox.paypal.com`;
      // Redirect user to PayPal
      const a = execute_payment_route(paymentID, payer);
      if (a.status === 200 || a.status === 201) {
        //window.location.href = approvalUrl;
      }
    } else {
      const error = response.error;
      showSnackbar(`Paypal payment subscription error ${error}`);
    }
  };

  const execute_payment_route = async (paymentID, payer) => {
    try {
      const response = await axios.post(
        `${API_BASE}/paypal/execute-payment`,
        {
          paymentId: paymentID,
          payerId: payer, // This should come from the PayPal redirect
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSnackbar("PayPal payment subscription confirmed");
        return response.data; // Return the response data for further processing
      } else {
        const error = response.data.error;
        showSnackbar(
          `PayPal payment subscription confirmation error: ${error}`
        );
        throw new Error(error);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error.message;
      showSnackbar(
        `PayPal payment subscription confirmation error: ${errorMessage}`
      );
      throw error; // Re-throw to allow calling code to handle the error
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handlePaymentSuccess = (paymentDetails) => {
    console.log("Payment successful:", paymentDetails);
    // Handle successful payment (redirect, show confirmation, etc.)
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails({
      ...cardDetails,
      cardNumber: formattedValue,
    });
  };

  if (!selectedPlan && !show && !active) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f7f9",
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={3} style={{ padding: "40px", textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              No Plan Selected
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Please select a plan before proceeding to payment
            </Typography>
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/features")}
              size="large"
            >
              Back to Plans
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

      {active && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f7f9",
          }}
        >
          <Button
            disabled={isLoading}
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{
              padding: "15px 30px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            onClick={() => {
              getSessionDebugData();
            }}
          >
            {isLoading ? "Loading..." : "Load Payment"}
          </Button>
        </div>
      )}

      {show && selectedPlan && (
        <div
          style={{
            minHeight: "100vh",
            padding: "20px 0",
            backgroundColor: "#f5f7f9",
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              style={{ padding: "30px", borderRadius: "12px" }}
            >
              {/* Header */}
              <Box textAlign="center" mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Complete Your Purchase
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Secure payment processed with encryption
                </Typography>
              </Box>

              <Box mb={4}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box sx={{ mb: 3, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Selected Plan: {selectedPlan.name}
                </Typography>
                <Typography variant="body1">
                  Price: £{selectedPlan.price} / {selectedPlan.billing_cycle}
                </Typography>
              </Box>

              {/* Payment Method Step */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Payment Method
                  </Typography>

                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <MenuItem value="card">
                          <Box display="flex" alignItems="center">
                            <CreditCard sx={{ mr: 1 }} />
                            Credit/Debit Card
                          </Box>
                        </MenuItem>
                        <MenuItem value="paypal">
                          <Box display="flex" alignItems="center">
                            PayPal
                          </Box>
                        </MenuItem>
                        <MenuItem value="bank">
                          <Box display="flex" alignItems="center">
                            <AccountBalance sx={{ mr: 1 }} />
                            Bank Transfer
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {paymentMethod === "card" && (
                      <Box mt={3}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          inputProps={{ maxLength: 19 }}
                          required
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Name on Card"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={(e) => handleCardChange(e)}
                          margin="normal"
                          required
                        />
                        <Box display="flex" gap={2} mt={2}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={(e) => handleCardChange(e)}
                            placeholder="MM/YY"
                            required
                          />
                          <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardChange(e)}
                            placeholder="123"
                            inputProps={{ maxLength: 4 }}
                            required
                          />
                        </Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="rememberCard"
                              checked={cardDetails.rememberCard}
                              onChange={(e) => {
                                handleCardChange(e);
                                rememberCardDetails_list(
                                  cardDetails.rememberCard
                                );
                              }}
                            />
                          }
                          label="Remember this card for future payments"
                          sx={{ mt: 2 }}
                        />
                      </Box>
                    )}

                    {paymentMethod === "paypal" && (
                      <Box mt={3}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="paypalEmail"
                          value={assignemail !== "" ? assignemail : ""}
                          onChange={(e) => {
                            handleEmailChange(e);
                          }}
                          placeholder="john.doe@yahoo.co.uk"
                          inputProps={{ maxLength: 50 }}
                          required
                          margin="normal"
                        />

                        <Box mt={3} textAlign="center">
                          <Typography variant="body1">
                            You will be redirected to PayPal to complete your
                            payment
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {paymentMethod === "bank" && (
                      <Box mt={3}>
                        <Typography variant="body1" gutterBottom>
                          Bank Transfer Details:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Account Name: DocRevisor Ltd.
                          <br />
                          Sort Code: 12-34-56
                          <br />
                          Account Number: 12345678
                          <br />
                          <Box mt={3}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="paypalEmail"
                              value={assignemail !== "" ? assignemail : ""}
                              onChange={(e) => {
                                handleBankTransferEmailChange(e);
                              }}
                              placeholder="john.doe@yahoo.co.uk"
                              inputProps={{ maxLength: 50 }}
                              required
                              margin="normal"
                            />
                            Reference: Your email address : {assignemail}
                          </Box>
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={() => (window.location.href = "/features")}
                    >
                      Back to Plans
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (paymentMethod === "card") {
                          rememberCardDetails_list(false);
                          handleNext();
                        } else if (paymentMethod === "bank") {
                          rememberBankDetails();
                          handleNext();
                        }
                      }}
                    >
                      {paymentMethod === "paypal" && selectedPlan ? (
                        <div onClick={() => setShowPayPalModal(true)}>
                          Pay With PayPal
                        </div>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

              {showPayPalModal === true && (
                <PayPalPayment
                  amount={selectedPlan.price.toString()}
                  currency="GBP"
                  productName={selectedPlan.name}
                  productDescription={selectedPlan.description}
                  onPaymentSuccess={handlePayPalSuccess}
                  customId={`sub_${selectedPlan.id}_${Date.now()}`}
                  userEmail={assignemail} // Pass the email
                  planId={selectedPlan.id} // Pass the plan ID
                  isOpen={showPayPalModal}
                  onClose={() => setShowPayPalModal(false)}
                />
              )}

              {/* Review & Payment Step */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Review Your Order
                  </Typography>

                  <Box
                    sx={{ mb: 4, p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}
                  >
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body1">Plan:</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedPlan.name} - £{selectedPlan.price}/
                        {selectedPlan.billing_cycle}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body1">Billing Cycle:</Typography>
                      <Typography variant="body1">
                        {selectedPlan.billing_cycle}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        £{selectedPlan.price}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                      Billing Address
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={billingAddress.firstName}
                          onChange={handleAddressChange}
                          error={!!addressErrors.firstName}
                          helperText={addressErrors.firstName}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={billingAddress.lastName}
                          onChange={handleAddressChange}
                          error={!!addressErrors.lastName}
                          helperText={addressErrors.lastName}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={billingAddress.address}
                          onChange={handleAddressChange}
                          error={!!addressErrors.address}
                          helperText={addressErrors.address}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={billingAddress.city}
                          onChange={handleAddressChange}
                          error={!!addressErrors.city}
                          helperText={addressErrors.city}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          name="postcode"
                          value={billingAddress.postcode.replace(" ", "")}
                          onChange={handleAddressChange}
                          error={!!addressErrors.postcode}
                          helperText={addressErrors.postcode}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Country"
                          name="country"
                          value={billingAddress.country}
                          onChange={handleAddressChange}
                          error={!!addressErrors.country}
                          helperText={addressErrors.country}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box mt={3}>
                    <Alert severity="info" icon={<Lock />}>
                      Your payment information is encrypted and secure. We do
                      not store your card details.
                    </Alert>
                  </Box>

                  <Box mt={4} display="flex" justifyContent="space-between">
                    <Button startIcon={<ArrowBack />} onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        addAddress();
                        handleNext();
                      }}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      {isLoading ? "Processing..." : "Pay Now"}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Confirmation Step */}
              {activeStep === 2 && (
                <Box textAlign="center">
                  <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h4" gutterBottom color="primary">
                    Payment Successful!
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Thank you for your purchase
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Your {selectedPlan.name} has been activated. You will
                    receive a confirmation email shortly.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => (window.location.href = "/signup")}
                  >
                    Go to Application
                  </Button>
                </Box>
              )}
            </Paper>
          </Container>
        </div>
      )}
    </>
  );
};

export default PaymentPage;
