import React, { useEffect, useState } from "react";
import "./Use_FeaturesPlan.css";
//import { useLocalStorage } from "./hooks/Use_LocalStorage";
import axios from "axios";
import { exit } from "process";
import { Select } from "@mui/material";

const API_BASE = "http://127.0.0.1:5000/api";

const FeaturesPage = () => {
  let price_ = 0;
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [storePlanData, setStorePlanData] = useState([]);
  const [storeSubscription, setSubscription] = useState([]);
  //let storeLocalSorage = [];

  const pricingPlans = [
    {
      id: "basic",
      name: "Begin Plan",
      price: { monthly: 0, annual: 0 },
      description:
        "Perfect for individuals getting started with engineering files",
      features: {
        fileLimit: "5 files per month",
        fileSize: "10 MB per file",
        storage: "1 GB storage",
        conversion: true,
        comparison: true,
        viewing: true,
        download: true,
        encryption: "Date of birth encryption",
        saveFiles: true,
        localstorage: true,
        teamMembers: "Not available",
        roleManagement: false,
        billingHistory: false,
        accountDetails: "Basic",
        paymentDetails: "Not available",
        memoryAllocation: "1 GB",
      },
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      id: "standard",
      name: "Standard Plan",
      price: { monthly: 2.99, annual: 26.99 },
      description: "Ideal for small and regular engineering file work",
      features: {
        fileLimit: "10 files per month",
        fileSize: "20 MB per file",
        storage: "2.5 GB storage",
        conversion: true,
        comparison: true,
        viewing: true,
        download: true,
        encryption: "Date of birth encryption",
        saveFiles: true,
        localstorage: true,
        teamMembers: "Up to 5 members",
        roleManagement: "Basic role management",
        billingHistory: true,
        accountDetails: "Full details",
        paymentDetails: "Save payment methods",
        memoryAllocation: "2.5 GB",
      },
      buttonText: "Choose Plan",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: { monthly: 5.99, annual: 50.99 },
      description:
        "For large teams and enterprise-grade engineering file management",
      features: {
        fileLimit: "50 files per month",
        fileSize: "50 MB per file",
        storage: "5 GB storage",
        conversion: true,
        comparison: true,
        viewing: true,
        download: true,
        encryption: "Date of birth encryption",
        saveFiles: true,
        localstorage: true,
        teamMembers: "Unlimited members",
        roleManagement: "Advanced role management",
        billingHistory: true,
        accountDetails: "Full details with organization",
        paymentDetails: "Multiple payment methods",
        memoryAllocation: "5 GB",
      },
      buttonText: "Choose Plan",
      popular: false,
    },
  ];

  const featureLabels = {
    fileLimit: "Monthly File Limit",
    fileSize: "Max File Size",
    storage: "Storage Allocation",
    conversion: "File Conversion",
    comparison: "File Comparison",
    viewing: "File Viewing",
    download: "Download Files",
    encryption: "Encryption/Decryption",
    saveFiles: "Save Files",
    localstorage: "Local Storage",
    teamMembers: "Team Members",
    roleManagement: "Role Management",
    billingHistory: "Billing History",
    accountDetails: "Account Details",
    paymentDetails: "Payment Details",
    memoryAllocation: "Memory Allocation",
  };

  const selectedPlanData = pricingPlans.find(
    (plan) => plan.id === selectedPlan
  );

 

    useEffect(() => {
      if (selectedPlanData) {
        const priceData = {
          planId: selectedPlanData.id,
          planName: selectedPlanData.name,
          monthlyPrice: selectedPlanData.price.monthly,
          annualPrice: selectedPlanData.price.annual,
          billingCycle: billingCycle,
          price:
            billingCycle === "monthly"
              ? selectedPlanData.price.monthly
              : selectedPlanData.price.annual,
        };
      setBillingCycle(priceData.billingCycle);
      }
    }, [selectedPlan, billingCycle, selectedPlanData]);





 const kickinfreetrial = () => {
   let planid = 'basic';
   let plan_name = "Begin Plan";
   let price = 0;

   
    const ok = handleGetSubscription(planid, plan_name, price);
    if (ok.status === 400 || ok.status === 401 || ok.status === 404) {
      const okay = handlePlanSelection(planid);
      return okay;
    }
 };







  const subscribe = (planid, plan_name, price_monthly, price_annually) => {

    let price = billingCycle === 'monthly'   ? price_monthly : price_annually;

    if (price) {
      //alert(
      //  `Monthly/Annually: £${price}`
     // );
    } else {
      //alert("No price selected");
    }

   
    const okay = handleGetSubscription(planid, plan_name, price);
    if ( okay
    ) {
      handlePlanSelection(planid);
    }

  }; 





  const GetSelectedPlan_______ = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get-created-subscription/basic`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // HTTP status
      const status = response.status;
      // JSON payload
      const data = response.data;

      if (status === 200 || status === 201) {
        if (data.subscription) {
          setSubscription(data.subscription);
          console.log("Subscription Selected!");
          window.location.href = "/signup";
          return data;
        }
      }
    } catch (error) {
      const errStatus = error.response?.status;
        if(errStatus)
        {
          const ok = await SelectedPlan();

        if (ok?.data.status === 200  || ok?.status === 200) {
          // safe: ok could be undefined
          console.log("Plan selected successfully");
        } else {
          console.log("Plan not selected or failed");
        }
        }
    }
  };







const GetSelectedPlan = async () => {
  // Fallback function to call on error
  const handleError = async () => {
    console.log("Attempting fallback plan selection...");
    const fallback = await SelectedPlan(); // your retry function
    return fallback || { status: 500, error: "Fallback failed" };
  };

  try {
    const response = await axios.get(
      `${API_BASE}/get-created-subscription/basic`,
      {
        withCredentials: true,
        timeout: 5000,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Safe HTTP status check
    if (response.status === 200 || response.status === 201) {
      if (response.data.subscription) {
        setSubscription(response.data.subscription);
        console.log("Subscription Selected!");
        setTimeout(() => (window.location.href = "/signup"), 100);
      }
      return response.data;
    } else {
      // Non-2xx response, call fallback
      const fallback = await handleError();
      return fallback;
    }
  } catch (error) {
    console.error("GetSelectedPlan error:", error);

    // Call fallback function safely
    const fallback = await handleError();

    // Optional: alert user
    if (fallback.error) alert(fallback.error);

    return fallback;
  }
};








  const SelectedPlan = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/created-subscription/basic`,
        {
          plan_name: "Begin Plan",
        },
        {
          withCredentials: true,
          timeout: 5000,

          headers: { "Content-Type": "application/json" },
        }
      );
          if(response.data.status === 200)
          {
            setSubscription(response.data.subscription);

            console.log("Subscription Selected!");
            setTimeout(() => (window.location.href = "/signup"), 100);
      // Always return an object
          }
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error("SelectedPlan error:", error);

      // Always return a fallback object
     return {
       status: error.response?.status || 500,
       error: error.response?.data?.error || error.message || "Unknown error",
       subscription: error.response?.data?.subscription || null,
     };
    }
  };



  

  
  const GetSelectedPlan____ = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get-created-subscription/basic`, // Empty data object (or your actual payload)
        {
          // Config object as third parameter
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // other headers...
          },
        }
      );

      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        if (data.subscription) {
          setSubscription(data.subscription);

          console.log("Subscription Selected!");
          window.location.href = "/signup";
        }
      } else if(
        response.status === 404 ||
        response.status === 400 ||
        response.status === 401
      ) {
        const ok = SelectedPlan();
        if(ok.status === 200 || ok.status === 201)
        {
          return ok;
        }
      }
    } catch (error) {
      if ( 
         error.response.status === 404
      ) {
        //alert(error.response?.error);
        const ok = SelectedPlan();
        if (ok.status === 200 || ok.status === 201) {
          return ok;
        }
      }
      else{
        alert(error.response?.error);
      }
    }
  };





  const SelectedPlan___ = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/created-subscription/basic`,
        {
          plan_name: "Begin Plan",
        }, // Empty data object (or your actual payload)
        {
          // Config object as third parameter
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // other headers...
          },
        }
      );

      // Check if response is OK (status 200-299)
      //if (response.status !== 200 || response.status !== 201) {
       // alert(`HTTP error! status: ${response.status}`);
      //}

      const data = response.data;
      //alert(
      //`Plan: ${data.subscription.name}\n` +
      // `Price: $${data.subscription.price}\n` +
      //`Billing: ${data.subscription.billing_cycle}\n` +
      // `Features: ${data.subscription.total_features} features`
      //);
      // Check if data is valid
      //alert('Subscription Selected');
      if (response.status === 200 || response.status === 201) {
        if (data.subscription) {
          setSubscription(data.subscription);

          console.log("Subscription Selected!");
          window.location.href = "/signup";
        }
      }
    } catch (error) {
      if (error.response.status) {
        alert("Subscription failed!");
      }
    }
  };




  
  
  const handleGetSubscription = async (planid, plan_name, price) => {
    try {
      // Check if plan exists before accessing its properties
      // const planData = pricingPlans.find((plan) => plan.id === planId);

      const response = await axios.get(`${API_BASE}/get-subscription`, {
        params: {
          name: plan_name,
          price: price,
        },

        withCredentials: true,
      });

      

      if (response.status === 201 || response.status === 200) {
        setStorePlanData(response.data.subscription);
        planid === "basic"
          ? (window.location.href = "/signup")
          : (window.location.href = "/payment");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      const status = error.response?.status || 500;
      return status;
    }
  };






  const handlePlanSelection = async (planId) => {
    setIsLoading(true);
    try {
      const planData = pricingPlans.find((plan) => plan.id === planId);


      const response = await axios.post(
        `${API_BASE}/create-insert-subscription`,
        {
          plan_id: planId,
          plan_name: planData.name,
          description: planData.description,
          price:
            planData.price.monthly === "monthly"
              ? planData.price.monthly
              : planData.price.annual,
          billingCycle: billingCycle,
          features: planData.features,
        },
        {
              headers: {
                        'Content-Type': 'application/json',
                        'Accept':'application/jason'
          },
            withCredentials: true,
        }
      );

      if (
        response.status === 401 ||
        response.status === 400 ||
        response.status === 404
      ) {
        console.log("Subscription not created:", response.data);
        // response.data will contain the actual error message from server
      }

      if (response.status === 201 || response.status === 200) {
         setStorePlanData(response.data.subscription);

        console.log("Subscription created:", storePlanData);

       // alert("Choosen Subscription Seleted");

        if (planId === "basic") {
          window.location.href = "/signup";
        } else {
          window.location.href = "/payment";
        }
      }
      
    } catch (error) {
      console.error("Error creating subscription:", error);

    } finally {
      setIsLoading(false);
    }
  };






  return (
    <div className="features-page">
      <div className="container">
        <h1>Choose Your Plan</h1>
        <p className="page-description">
          Select the plan that best fits your engineering file conversion needs.
          All plans include our core functionality with varying limits and
          additional features.
        </p>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span
            className={billingCycle === "monthly" ? "active" : ""}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </span>
          <div
            className="toggle-switch"
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
          >
            <div
              className={`switch ${billingCycle === "annual" ? "annual" : ""}`}
            ></div>
          </div>
          <span
            className={billingCycle === "annual" ? "active" : ""}
            onClick={() => setBillingCycle("annual")}
          >
            Annual Billing (Save 17%)
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""} ${
                plan.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedPlan(plan.id);
                setSelectedPrice(plan.price);
              }}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <h3>{plan.name}</h3>
              <div className="price">
                £
                {billingCycle === "monthly"
                  ? plan.price.monthly
                  : plan.price.annual}
                <span>/{billingCycle === "monthly" ? "month" : "year"}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
              <button
                className={`select-button ${
                  (plan.id && plan.price.monthly) ||
                  (plan.id && plan.price.annual)
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  if(plan.id === 'basic' )
                  {
                      GetSelectedPlan();
                      SelectedPlan();
                  }
                  else{
                  subscribe(
                    plan.id,
                    plan.name,
                    plan.price.monthly,
                    plan.price.annual
                  );
                }
                }}
                disabled={isLoading}
              >
                {isLoading && selectedPlan === plan.id ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Plan Comparison Table */}
        <div className="features-comparison">
          <h2>Plan Comparison</h2>
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-column">Feature</div>
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="plan-column">
                  {plan.name}
                </div>
              ))}
            </div>

            {Object.keys(featureLabels).map((featureKey) => (
              <div key={featureKey} className="table-row">
                <div className="feature-column">
                  {featureLabels[featureKey]}
                </div>
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="plan-column">
                    {typeof plan.features[featureKey] === "boolean"
                      ? plan.features[featureKey]
                        ? "✓"
                        : "✗"
                      : plan.features[featureKey]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Plan Details */}
        <div className="selected-plan-details">
          <h2>{selectedPlanData.plan_name} Details</h2>
          <div className="plan-features-grid">
            {Object.keys(selectedPlanData.features).map((featureKey) => (
              <div key={featureKey} className="feature-item">
                <div className="feature-icon">
                  {typeof selectedPlanData.features[featureKey] === "boolean"
                    ? selectedPlanData.features[featureKey]
                      ? "✓"
                      : "✗"
                    : "✓"}
                </div>
                <div className="feature-content">
                  <h4>{featureLabels[featureKey]}</h4>
                  <p>
                    {typeof selectedPlanData.features[featureKey] === "boolean"
                      ? selectedPlanData.features[featureKey]
                        ? "Included"
                        : "Not included"
                      : selectedPlanData.features[featureKey]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to get started?</h2>
          <p>
            Join thousands of engineers who trust DocRevisor for their file
            conversion needs
          </p>
          <button className="cta-button" onClick={() => kickinfreetrial()}>
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
