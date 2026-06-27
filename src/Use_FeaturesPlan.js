import React, { useEffect, useState } from "react";
import "./Use_FeaturesPlan.css";
import Logo from "./image/favicon-png.png";
import axios from "axios";
import {
  Button,
  Typography,
  Box,
  Grid,
  Container,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Badge,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountIcon,
  CloudUpload as UploadIcon,
  CompareArrows as CompareIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Memory as MemoryIcon,
  ArrowForward as ArrowForwardIcon,
  Verified as VerifiedIcon,
  AutoFixHigh as AiIcon,
  WorkspacePremium as PremiumIcon,
  Edit as EditIcon,
  Description as DocIcon,
  ContactMail as CRMIcon,
  SmartToy as AiAssistantIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const API_BASE = "http://127.0.0.1:5000/api";

const FeaturesPageEnterprise = () => {
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [storePlanData, setStorePlanData] = useState([]);
  const [storeSubscription, setSubscription] = useState([]);
  const [language, setLanguage] = useState("en");

  // Enterprise Pricing Plans - Expanded with all features
  const pricingPlans = [
    {
      id: "basic",
      name: "Starter",
      subtitle: "For individual professionals",
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
        apiAccess: false,
        prioritySupport: false,
        sla: "Best effort",
        documentEditor: true,
        documentRemediation: false,
        pdfAccessibility: false,
        documentCompliance: false,
        tagStructure: false,
        aiRemediation: false,
        smartTagging: false,
        contentAnalysis: false,
        automatedCompliance: false,
        ocrScanning: false,
        textRecognition: false,
        imageToText: false,
        batchProcessing: false,
        crmIntegration: false,
        contactManagement: false,
        documentTracking: false,
        clientPortal: false,
        reportsAnalytics: false,
      },
      buttonText: "Get Started Free",
      popular: false,
      color: "#6a0dad",
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      id: "standard",
      name: "Professional",
      subtitle: "For growing teams",
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
        apiAccess: false,
        prioritySupport: false,
        sla: "Standard (48h)",
        documentEditor: true,
        documentRemediation: true,
        pdfAccessibility: true,
        documentCompliance: true,
        tagStructure: true,
        aiRemediation: false,
        smartTagging: false,
        contentAnalysis: false,
        automatedCompliance: false,
        ocrScanning: true,
        textRecognition: true,
        imageToText: true,
        batchProcessing: false,
        crmIntegration: true,
        contactManagement: "Up to 100 contacts",
        documentTracking: true,
        clientPortal: "Basic portal",
        reportsAnalytics: true,
      },
      buttonText: "Choose Plan",
      popular: true,
      color: "#2e7d32",
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    },
    {
      id: "premium",
      name: "Enterprise",
      subtitle: "For large organizations",
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
        apiAccess: true,
        prioritySupport: true,
        sla: "Premium (4h)",
        documentEditor: true,
        documentRemediation: true,
        pdfAccessibility: true,
        documentCompliance: true,
        tagStructure: true,
        aiRemediation: true,
        smartTagging: true,
        contentAnalysis: true,
        automatedCompliance: true,
        ocrScanning: true,
        textRecognition: true,
        imageToText: true,
        batchProcessing: true,
        crmIntegration: true,
        contactManagement: "Unlimited contacts",
        documentTracking: true,
        clientPortal: "Advanced portal",
        reportsAnalytics: true,
      },
      buttonText: "Choose Plan",
      popular: false,
      color: "#1565c0",
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
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
    apiAccess: "API Access",
    prioritySupport: "Priority Support",
    sla: "Service Level Agreement",
    documentEditor: "Document Editor",
    documentRemediation: "Document Remediation",
    pdfAccessibility: "PDF Accessibility",
    documentCompliance: "Document Compliance",
    tagStructure: "Tag & Structure",
    aiRemediation: "AI-Powered Fixes",
    smartTagging: "Smart Tagging",
    contentAnalysis: "Content Analysis",
    automatedCompliance: "Automated Compliance",
    ocrScanning: "OCR & Scanning",
    textRecognition: "Text Recognition",
    imageToText: "Image to Text",
    batchProcessing: "Batch Processing",
    crmIntegration: "CRM Integration",
    contactManagement: "Contact Management",
    documentTracking: "Document Tracking",
    clientPortal: "Client Portal",
    reportsAnalytics: "Reports & Analytics",
  };

  const featureCategories = [
    {
      category: "Document Processing",
      icon: <UploadIcon />,
      features: ["fileLimit", "fileSize", "storage", "memoryAllocation"],
      color: "#6a0dad",
    },
    {
      category: "Core Features",
      icon: <VerifiedIcon />,
      features: ["conversion", "comparison", "viewing", "download"],
      color: "#2e7d32",
    },
    {
      category: "Security & Privacy",
      icon: <SecurityIcon />,
      features: ["encryption", "saveFiles", "localstorage"],
      color: "#1565c0",
    },
    {
      category: "Document Editing",
      icon: <EditIcon />,
      features: [
        "documentEditor",
        "documentRemediation",
        "pdfAccessibility",
        "documentCompliance",
        "tagStructure",
      ],
      color: "#ed6c02",
    },
    {
      category: "AI-Powered Features",
      icon: <AiAssistantIcon />,
      features: [
        "aiRemediation",
        "smartTagging",
        "contentAnalysis",
        "automatedCompliance",
      ],
      color: "#9c27b0",
    },
    {
      category: "OCR & Scanning",
      icon: <ImageIcon />,
      features: [
        "ocrScanning",
        "textRecognition",
        "imageToText",
        "batchProcessing",
      ],
      color: "#c62828",
    },
    {
      category: "CRM Integration",
      icon: <CRMIcon />,
      features: [
        "crmIntegration",
        "contactManagement",
        "documentTracking",
        "clientPortal",
        "reportsAnalytics",
      ],
      color: "#2e7d32",
    },
    {
      category: "Team Collaboration",
      icon: <GroupIcon />,
      features: ["teamMembers", "roleManagement"],
      color: "#ed6c02",
    },
    {
      category: "Account & Billing",
      icon: <AccountIcon />,
      features: ["billingHistory", "accountDetails", "paymentDetails"],
      color: "#c62828",
    },
    {
      category: "Enterprise Features",
      icon: <PremiumIcon />,
      features: ["apiAccess", "prioritySupport", "sla"],
      color: "#9c27b0",
    },
  ];

  const selectedPlanData = pricingPlans.find(
    (plan) => plan.id === selectedPlan,
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

  const subscribe = (planid, plan_name, price_monthly, price_annually) => {
    let price = billingCycle === "monthly" ? price_monthly : price_annually;

    const okay = handleGetSubscription(planid, plan_name, price);
    if (okay) {
      handlePlanSelection(planid);
    }
  };

  const GetSelectedPlan = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/get-created-subscription/basic`,
        {
          withCredentials: true,
          timeout: 5000,
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200 || response.status === 201) {
        if (response.data.subscription) {
          setSubscription(response.data.subscription);
          console.log("Subscription Selected!");
          setTimeout(() => (window.location.href = "/signup"), 100);
        }
        return response.data;
      }
    } catch (error) {
      console.error("GetSelectedPlan error:", error);
      const fallback = await SelectedPlan();
      return fallback || { status: 500, error: "Fallback failed" };
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
        },
      );
      if (response.data.status === 200) {
        setSubscription(response.data.subscription);
        console.log("Subscription Selected!");
        setTimeout(() => (window.location.href = "/signup"), 100);
      }
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error("SelectedPlan error:", error);
      return {
        status: error.response?.status || 500,
        error: error.response?.data?.error || error.message || "Unknown error",
        subscription: error.response?.data?.subscription || null,
      };
    }
  };

  const handleGetSubscription = async (planid, plan_name, price) => {
    try {
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
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status === 201 || response.status === 200) {
        setStorePlanData(response.data.subscription);
        console.log("Subscription created:", storePlanData);

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

  const login = () => {
    window.location.href = "/signup";
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Enterprise Header */}
      <header
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 40px rgba(106, 13, 173, 0.08)",
          borderBottom: "1px solid #f8f9fa",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={Logo}
                alt="DocRevisor Intelligence Platform"
                width="50px"
                height="50px"
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg,#6a0dad, #8a2be2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DocRevisor Intelligence
                </Typography>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  Enterprise Document AI Platform
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[
                ["Platform", "/platform"],
                ["Solutions", "/solutions"],
                ["Pricing", "/features"],
                ["Investor Relations", "/investors"],
              ].map((item) => (
                <Typography
                  key={item[0]}
                  sx={{
                    color: item[0] === "Pricing" ? "#6a0dad" : "#333",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#6a0dad",
                    },
                  }}
                  onClick={() => (window.location.href = item[1])}
                >
                  {item[0]}
                </Typography>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: "600",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 20px rgba(106, 13, 173, 0.2)",
                "&:hover": {
                  background: "linear-gradient(45deg, #5a0cad, #7a2ad2)",
                  boxShadow: "0 6px 25px rgba(106, 13, 173, 0.3)",
                },
              }}
              onClick={login}
            >
              Enterprise Login
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
            <Chip
              label="Enterprise Pricing"
              color="primary"
              sx={{ mb: 3, fontWeight: "bold" }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 3,
                background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
              }}
            >
              Flexible Plans for Every Team
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Choose the perfect plan for your engineering document needs. All
              plans include core features with scalable limits.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Billing Toggle */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: billingCycle === "monthly" ? "bold" : "normal",
              color: billingCycle === "monthly" ? "#6a0dad" : "#666",
              cursor: "pointer",
            }}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly Billing
          </Typography>

          <Box
            sx={{
              width: 60,
              height: 30,
              backgroundColor: "#e0e0e0",
              borderRadius: 15,
              position: "relative",
              cursor: "pointer",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                backgroundColor: "#6a0dad",
                borderRadius: 13,
                position: "absolute",
                top: 2,
                left: billingCycle === "annual" ? 32 : 2,
                transition: "left 0.3s ease",
                boxShadow: "0 2px 4px rgba(106,13,173,0.3)",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: billingCycle === "annual" ? "bold" : "normal",
                color: billingCycle === "annual" ? "#6a0dad" : "#666",
                cursor: "pointer",
              }}
              onClick={() => setBillingCycle("annual")}
            >
              Annual Billing
            </Typography>
            <Chip
              label="Save 17%"
              size="small"
              sx={{
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {pricingPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  background: plan.gradient,
                  borderRadius: "24px",
                  p: 4,
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s ease",
                  border:
                    selectedPlan === plan.id
                      ? `3px solid ${plan.color}`
                      : "1px solid rgba(106, 13, 173, 0.1)",
                  boxShadow:
                    selectedPlan === plan.id
                      ? `0 16px 40px ${plan.color}30`
                      : "0 8px 20px rgba(0,0,0,0.08)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 50px ${plan.color}40`,
                  },
                }}
                onClick={() => {
                  setSelectedPlan(plan.id);
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: 24,
                      backgroundColor: "#ff9800",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(255,152,0,0.3)",
                    }}
                  >
                    MOST POPULAR
                  </Box>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "#666" }}>
                    {plan.subtitle}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold", color: plan.color }}
                  >
                    £
                    {billingCycle === "monthly"
                      ? plan.price.monthly
                      : plan.price.annual}
                    <Typography
                      component="span"
                      variant="subtitle2"
                      sx={{ color: "#666", ml: 1 }}
                    >
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </Typography>
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                  {plan.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ my: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
                  >
                    Key Features:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        <CheckIcon sx={{ fontSize: 18, color: plan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={plan.features.fileLimit}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        <CheckIcon sx={{ fontSize: 18, color: plan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={plan.features.fileSize}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        <CheckIcon sx={{ fontSize: 18, color: plan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={plan.features.storage}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        <CheckIcon sx={{ fontSize: 18, color: plan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={plan.features.teamMembers}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    {plan.id !== "basic" && (
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <CheckIcon sx={{ fontSize: 18, color: plan.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            plan.id === "standard"
                              ? "Document Remediation"
                              : "AI-Powered Remediation"
                          }
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Button
                  variant={plan.id === "basic" ? "outlined" : "contained"}
                  fullWidth
                  sx={{
                    mt: "auto",
                    ...(plan.id === "basic"
                      ? {
                          border: `2px solid ${plan.color}`,
                          color: plan.color,
                          borderRadius: "25px",
                          py: 1.5,
                          "&:hover": {
                            border: `2px solid ${plan.color}`,
                            backgroundColor: `${plan.color}10`,
                          },
                        }
                      : {
                          background: `linear-gradient(45deg, ${plan.color}, ${
                            plan.id === "standard" ? "#388e3c" : "#1976d2"
                          })`,
                          color: "white",
                          borderRadius: "25px",
                          py: 1.5,
                          boxShadow: `0 4px 12px ${plan.color}50`,
                          "&:hover": {
                            background: `linear-gradient(45deg, ${plan.color}, ${
                              plan.id === "standard" ? "#2e7d32" : "#1565c0"
                            })`,
                            boxShadow: `0 6px 16px ${plan.color}70`,
                          },
                        }),
                  }}
                  onClick={() => {
                    if (plan.id === "basic") {
                      GetSelectedPlan();
                      SelectedPlan();
                    } else {
                      subscribe(
                        plan.id,
                        plan.name,
                        plan.price.monthly,
                        plan.price.annual,
                      );
                    }
                  }}
                  disabled={isLoading}
                  endIcon={plan.id !== "basic" && <ArrowForwardIcon />}
                >
                  {isLoading && selectedPlan === plan.id
                    ? "Processing..."
                    : plan.buttonText}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Categories - Expanded */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 2,
              color: "#333",
            }}
          >
            Comprehensive Feature Set
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 6,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Every feature organized by category for easy comparison
          </Typography>

          <Grid container spacing={4}>
            {featureCategories.map((category, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "20px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 16px 40px ${category.color}20`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${category.color}15`,
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(category.icon, {
                        sx: { fontSize: 30, color: category.color },
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: category.color }}
                    >
                      {category.category}
                    </Typography>
                  </Box>

                  <List dense>
                    {category.features.map((featureKey, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <CheckIcon
                            sx={{ fontSize: 16, color: category.color }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={featureLabels[featureKey]}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Plan Comparison Table - Expanded */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 2,
            color: "#333",
          }}
        >
          Feature Comparison
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#666",
            mb: 6,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Detailed comparison across all plans
        </Typography>

        <Paper
          sx={{
            overflowX: "auto",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ minWidth: 1000 }}>
            {/* Table Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "250px repeat(3, 1fr)",
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <Box sx={{ p: 3, fontWeight: "bold", color: "#333" }}>
                Feature
              </Box>
              {pricingPlans.map((plan) => (
                <Box
                  key={plan.id}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderLeft: "1px solid #e0e0e0",
                    backgroundColor:
                      selectedPlan === plan.id
                        ? `${plan.color}10`
                        : "transparent",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: plan.color }}
                  >
                    {plan.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Feature Rows */}
            {Object.keys(featureLabels).map((featureKey, index) => (
              <Box
                key={featureKey}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "250px repeat(3, 1fr)",
                  borderBottom:
                    index < Object.keys(featureLabels).length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {featureLabels[featureKey]}
                </Box>
                {pricingPlans.map((plan) => (
                  <Box
                    key={plan.id}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderLeft: "1px solid #f0f0f0",
                      backgroundColor:
                        selectedPlan === plan.id
                          ? `${plan.color}05`
                          : "transparent",
                    }}
                  >
                    {typeof plan.features[featureKey] === "boolean" ? (
                      plan.features[featureKey] ? (
                        <CheckIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                      ) : (
                        <CancelIcon sx={{ color: "#f44336", fontSize: 24 }} />
                      )
                    ) : (
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {plan.features[featureKey]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>

      {/* Selected Plan Details */}
      {selectedPlanData && (
        <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {selectedPlanData.name} Plan Details
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
                  {selectedPlanData.description}
                </Typography>
              </Box>
              <Chip
                icon={<VerifiedIcon />}
                label="Currently Selected"
                sx={{
                  backgroundColor: `${selectedPlanData.color}15`,
                  color: selectedPlanData.color,
                  fontWeight: "bold",
                }}
              />
            </Box>

            <Grid container spacing={3}>
              {Object.keys(selectedPlanData.features).map((featureKey) => (
                <Grid item xs={12} md={6} lg={4} key={featureKey}>
                  <Card
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow: `0 8px 24px ${selectedPlanData.color}20`,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          backgroundColor: `${selectedPlanData.color}15`,
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        {typeof selectedPlanData.features[featureKey] ===
                        "boolean" ? (
                          selectedPlanData.features[featureKey] ? (
                            <CheckIcon sx={{ color: selectedPlanData.color }} />
                          ) : (
                            <CancelIcon sx={{ color: "#f44336" }} />
                          )
                        ) : (
                          <CheckIcon sx={{ color: selectedPlanData.color }} />
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          {featureLabels[featureKey]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {typeof selectedPlanData.features[featureKey] ===
                          "boolean"
                            ? selectedPlanData.features[featureKey]
                              ? "Included"
                              : "Not included"
                            : selectedPlanData.features[featureKey]}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Enterprise CTA */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="md">
          <Card
            sx={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderRadius: "30px",
              p: 6,
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "absolute", right: 0, top: 0, opacity: 0.1 }}>
              <PremiumIcon sx={{ fontSize: 200 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Need a Custom Enterprise Plan?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Contact our sales team for custom pricing, volume discounts, and
              tailored feature sets for your organization
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#6a0dad",
                borderRadius: "25px",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => (window.location.href = "/enterprise-sales")}
              endIcon={<ArrowForwardIcon />}
            >
              Contact Enterprise Sales
            </Button>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "60px 0 30px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src={Logo}
                  alt="DocRevisor Intelligence Platform"
                  width="40px"
                  height="40px"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", ml: 1, color: "white" }}
                >
                  DocRevisor Intelligence
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", lineHeight: 1.6 }}
              >
                Transforming unstructured data into actionable business
                intelligence through AI-powered document processing.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Sales & Support
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 sales@docrevisor.info
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📞 +44 123 456 789 (Enterprise Sales)
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                Global Headquarters: Warrington, UK
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Language / Region
              </Typography>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #444",
                  backgroundColor: "#2a2a2a",
                  color: "white",
                  width: "100%",
                  fontSize: "1rem",
                }}
              >
                <option value="en">English (Global)</option>
                <option value="de">Deutsch (Enterprise)</option>
              </select>
              <Typography variant="body2" sx={{ color: "#ccc", mt: 2 }}>
                ISO 27001 Certified • GDPR Compliant • SOC 2 Type II
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              pt: 3,
              borderTop: "1px solid #444",
            }}
          >
            <Typography variant="body2" sx={{ color: "#999" }}>
              © 2023 DocRevisor Intelligence Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default FeaturesPageEnterprise;
