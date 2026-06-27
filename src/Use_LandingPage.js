import React, { useEffect, useState } from "react";
import "./Use_LandingPage.css";
import Logo from "./image/favicon-png.png";
import { FlashOn } from "@mui/icons-material";
import { Dns, Folder } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Container,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Line,
} from "@mui/material";
import {
  AutoFixHigh as AiIcon,
  Description as DocIcon,
  Security as SecurityIcon,
  SmartToy as AiPowerIcon,
  Compare as CompareIcon,
  SwapHoriz as ConvertIcon,
  CloudUpload,
  Group,
  TrendingUp,
  BarChart,
  Build,
  Verified,
  Rocket,
  ArrowForward,
  Shield,
  IntegrationInstructions,
  MonetizationOn,
  Science,
  Analytics,
  Visibility,
  Download,
  Edit,
  Image,
  ContactMail,
  History,
  Payment,
  BusinessCenter,
} from "@mui/icons-material";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5000/api";

const IntelligentDocumentPlatform = () => {
  const [language, setLanguage] = useState("en");
  const [storeSubscription, setSubscription] = useState([]);

  // Investor-friendly translations with industry terminology
  const translations = {
    en: {
      tagline: "Enterprise-Grade Intelligent Document Processing Platform",
      valueProp:
        "Transform Unstructured Data into Actionable Business Intelligence",
      tryNow: "Request Enterprise Demo",
      getStarted: "View Enterprise Pricing",
      trustedBy: "Trusted by Fortune 500 Companies & Regulated Industries",

      // Core Capabilities
      idpTitle: "Intelligent Document Processing (IDP)",
      idpDesc:
        "AI-powered document understanding that extracts, classifies, and processes unstructured data at scale with 99.8% accuracy.",

      remediationTitle: "Automated Document Remediation",
      remediationDesc:
        "Proactively identify and fix accessibility, compliance, and structural issues across millions of documents.",

      transformationTitle: "Smart Document Transformation",
      transformationDesc:
        "Convert, normalize, and enrich documents across 200+ formats while maintaining data integrity.",

      universalTitle: "Universal Design Platform",
      universalDesc:
        "Ensure WCAG 2.1, Section 508, and global compliance standards across all digital assets.",

      crmTitle: "CRM Intelligence Integration",
      crmDesc:
        "Inject document intelligence directly into your CRM ecosystem for enhanced customer insights and workflow automation.",

      // Investor Messaging
      investmentThesis: "Market Leadership in Document Intelligence",
      thesisDesc:
        "We're disrupting the $50B document processing market by combining AI-powered IDP with enterprise CRM integration.",

      roiTitle: "Proven Enterprise ROI",
      roiDesc:
        "Reduce document processing costs by 80%, accelerate compliance by 90%, and increase sales team productivity by 40%.",

      // Features
      aiRemediation: "AI-Powered Remediation",
      intelligentTagging: "Smart Tagging",
      contentAnalysis: "Content Analysis",
      automatedCompliance: "Automated Compliance",
      documentScanning: "Document Scanning",
      textRecognition: "Text Recognition",
      batchProcessing: "Batch Processing",
      contactManagement: "Contact Management",
      docTracking: "Document Tracking",
      clientPortal: "Client Portal",
      analytics: "Reports & Analytics",

      // Footer
      support: "Enterprise Support",
      contact: "Sales Contact",
      location: "Global Headquarters: Warrington, UK",
      copyright:
        "© 2023 DocRevisor Intelligence Platform. All rights reserved.",
    },
    de: {
      tagline:
        "Unternehmensfähige Intelligente Dokumentenverarbeitungsplattform",
      valueProp:
        "Transformieren Sie unstrukturierte Daten in umsetzbare Geschäftsintelligenz",
      tryNow: "Unternehmensdemo anfordern",
      getStarted: "Unternehmenspreise anzeigen",
      trustedBy: "Vertraut von Fortune 500 Unternehmen & regulierten Branchen",

      idpTitle: "Intelligente Dokumentenverarbeitung (IDP)",
      idpDesc:
        "KI-gestütztes Dokumentenverständnis, das unstrukturierte Daten im großen Maßstab mit 99,8% Genauigkeit extrahiert, klassifiziert und verarbeitet.",

      remediationTitle: "Automatisierte Dokumentensanierung",
      remediationDesc:
        "Proaktiv Zugänglichkeits-, Compliance- und Strukturprobleme über Millionen von Dokumenten identifizieren und beheben.",

      transformationTitle: "Intelligente Dokumententransformation",
      transformationDesc:
        "Konvertieren, normalisieren und bereichern Sie Dokumente über 200+ Formate hinweg bei gleichzeitiger Wahrung der Datenintegrität.",

      universalTitle: "Universelles Design-Platform",
      universalDesc:
        "Sicherstellung von WCAG 2.1, Section 508 und globalen Compliance-Standards für alle digitalen Assets.",

      crmTitle: "CRM-Intelligenzintegration",
      crmDesc:
        "Injizieren Sie Dokumentenintelligenz direkt in Ihr CRM-Ökosystem für verbesserte Kundeneinblicke und Workflow-Automatisierung.",

      investmentThesis: "Marktführerschaft in Dokumentenintelligenz",
      thesisDesc:
        "Wir disruptieren den 50 Mrd. USD Dokumentenverarbeitungsmarkt durch Kombination von KI-gestütztem IDP mit Enterprise-CRM-Integration.",

      roiTitle: "Bewiesene Enterprise-ROI",
      roiDesc:
        "Reduzieren Sie Dokumentenverarbeitungskosten um 80%, beschleunigen Sie Compliance um 90% und steigern Sie die Produktivität des Vertriebsteams um 40%.",

      aiRemediation: "KI-gestützte Sanierung",
      intelligentTagging: "Intelligentes Tagging",
      contentAnalysis: "Inhaltsanalyse",
      automatedCompliance: "Automatisierte Compliance",
      documentScanning: "Dokumentenscannen",
      textRecognition: "Texterkennung",
      batchProcessing: "Stapelverarbeitung",
      contactManagement: "Kontaktmanagement",
      docTracking: "Dokumentenverfolgung",
      clientPortal: "Kundenportal",
      analytics: "Berichte & Analysen",

      support: "Unternehmenssupport",
      contact: "Vertriebskontakt",
      location: "Globaler Hauptsitz: Warrington, UK",
      copyright:
        "© 2023 DocRevisor Intelligence Platform. Alle Rechte vorbehalten.",
    },
  };

  const t = translations[language] || translations.en;

  const translate = {
    en: { login: "Enterprise Login" },
    de: { login: "Unternehmenslogin" },
  };

  const tr = translate[language] || translate.en;

  const login = () => {
    window.location.href = "/signup";
  };

  const getStarted = () => {
    window.location.href = "/features";
  };

  // Core Platform Modules matching sidebar features
  const platformModules = [
    {
      icon: <AiPowerIcon sx={{ fontSize: 40, color: "#6a0dad" }} />,
      title: t.idpTitle,
      description: t.idpDesc,
      features: [
        "AI-Powered Document Understanding",
        "Natural Language Processing",
        "Machine Learning Classification",
        "Real-time Data Extraction",
      ],
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      icon: <Build sx={{ fontSize: 40, color: "#2e7d32" }} />,
      title: t.remediationTitle,
      description: t.remediationDesc,
      features: [
        "Accessibility Compliance",
        "PDF/UA Remediation",
        "Document Structure Fixes",
        "Automated Tagging",
      ],
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    },
    {
      icon: <ConvertIcon sx={{ fontSize: 40, color: "#1565c0" }} />,
      title: t.transformationTitle,
      description: t.transformationDesc,
      features: [
        "200+ Format Support",
        "Batch Processing",
        "Quality Preservation",
        "Metadata Enhancement",
      ],
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    },
    {
      icon: <Verified sx={{ fontSize: 40, color: "#ed6c02" }} />,
      title: t.universalTitle,
      description: t.universalDesc,
      features: [
        "WCAG 2.1 Compliance",
        "Section 508 Validation",
        "Global Standards",
        "Automated Testing",
      ],
      gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    },
    {
      icon: <IntegrationInstructions sx={{ fontSize: 40, color: "#6a1b9a" }} />,
      title: t.crmTitle,
      description: t.crmDesc,
      features: [
        "Salesforce Integration",
        "HubSpot Connectivity",
        "Microsoft Dynamics",
        "Custom API Endpoints",
      ],
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: "#c62828" }} />,
      title: "Business Intelligence Engine",
      description:
        "Transform document data into predictive insights and actionable intelligence.",
      features: [
        "Predictive Analytics",
        "Trend Analysis",
        "ROI Tracking",
        "Performance Metrics",
      ],
      gradient: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
    },
  ];

  // Feature Highlights from Sidebar
  const featureHighlights = [
    {
      category: "AI Remediation",
      icon: <AiIcon />,
      features: [
        { name: t.aiRemediation, path: "/ai/remediation" },
        { name: t.intelligentTagging, path: "/ai/tagging" },
        { name: t.contentAnalysis, path: "/ai/analysis" },
        { name: t.automatedCompliance, path: "/ai/compliance" },
      ],
      color: "#6a0dad",
    },
    {
      category: "Document Processing",
      icon: <DocIcon />,
      features: [
        { name: t.documentScanning, path: "/ocr/scan" },
        { name: t.textRecognition, path: "/ocr/text-recognition" },
        { name: "Image to Text", path: "/ocr/image-to-text" },
        { name: t.batchProcessing, path: "/ocr/batch" },
      ],
      color: "#2e7d32",
    },
    {
      category: "CRM Integration",
      icon: <ContactMail />,
      features: [
        { name: t.contactManagement, path: "/crm/contacts" },
        { name: t.docTracking, path: "/crm/document-tracking" },
        { name: t.clientPortal, path: "/crm/client-portal" },
        { name: t.analytics, path: "/crm/analytics" },
      ],
      color: "#1565c0",
    },
  ];

  // ROI Metrics for Investors
  const roiMetrics = [
    {
      metric: "80%",
      label: "Cost Reduction",
      description: "In document processing expenses",
      icon: <MonetizationOn sx={{ color: "#4caf50" }} />,
    },
    {
      metric: "90%",
      label: "Faster Compliance",
      description: "Accelerated regulatory compliance",
      icon: <Verified sx={{ color: "#2196f3" }} />,
    },
    {
      metric: "40%",
      label: "Productivity Gain",
      description: "Increased sales team efficiency",
      icon: <TrendingUp sx={{ color: "#ff9800" }} />,
    },
    {
      metric: "99.8%",
      label: "Accuracy Rate",
      description: "AI-powered processing accuracy",
      icon: <Science sx={{ color: "#9c27b0" }} />,
    },
  ];

  // API Functions
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
    }
  };

  const ChartsSection = () => (
    <Box
      sx={{
        py: 8,
        backgroundColor: "#fafbff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Patterned Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "110%", // Extended for parallax effect
          transform: "translateZ(-50px) rotateY(-5deg) skewY(-2deg)",
          transformStyle: "preserve-3d",
          perspective: "1000px",

          // Multi-layered gradient with quantum effects
          background: `
      linear-gradient(145deg, 
        rgba(106, 13, 173, 0.08) 0%, 
        rgba(138, 43, 226, 0.12) 30%,
        rgba(180, 70, 255, 0.05) 70%,
        transparent 100%
      ),
      radial-gradient(
        ellipse at 80% 20%,
        rgba(0, 255, 255, 0.03) 0%,
        transparent 50%
      )
    `,

          // Holographic grid overlay with depth
          backgroundImage: `
      linear-gradient(145deg, 
        rgba(106, 13, 173, 0.08) 0%, 
        rgba(138, 43, 226, 0.12) 30%,
        rgba(180, 70, 255, 0.05) 70%,
        transparent 100%
      ),
      radial-gradient(
        ellipse at 80% 20%,
        rgba(0, 255, 255, 0.03) 0%,
        transparent 50%
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 15px,
        rgba(106, 13, 173, 0.04) 15px,
        rgba(106, 13, 173, 0.04) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 20px,
        rgba(0, 255, 255, 0.02) 20px,
        rgba(0, 255, 255, 0.02) 21px
      )
    `,

          // Asymmetric polygonal clip with sharp angles
          clipPath: "polygon(100% -10%, 100% 110%, -10% 110%, 40% -10%)",

          // 3D "contusion" effect - indentation on z-axis
          "&::before": {
            content: '""',
            position: "absolute",
            top: "30%",
            left: "20%",
            width: "60%",
            height: "40%",
            background: "rgba(0, 255, 255, 0.03)",
            borderRadius: "5px",
            transform: "translateZ(-30px) rotateX(10deg)",
            filter: "blur(15px)",
            boxShadow: `
        inset 0 0 40px rgba(106, 13, 173, 0.1),
        inset 0 0 60px rgba(138, 43, 226, 0.05)
      `,
          },

          // Glitch/scanline effect overlay
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `
        repeating-linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.03) 0px,
          rgba(255, 255, 255, 0.03) 1px,
          transparent 1px,
          transparent 3px
        )
      `,
            opacity: 0.3,
            pointerEvents: "none",
          },

          zIndex: 0,

          // Futuristic animation
          animation: "hologramPulse 8s ease-in-out infinite",

          // Glowing edge effect
          boxShadow: `
      inset 0 0 80px rgba(106, 13, 173, 0.1),
      inset 0 0 40px rgba(138, 43, 226, 0.05),
      0 0 60px rgba(0, 255, 255, 0.05)
    `,

          // Glass-morphism effect
          backdropFilter: "blur(1px)",
          borderLeft: "1px solid rgba(138, 43, 226, 0.1)",

          // Define the animation keyframes
          "@keyframes hologramPulse": {
            "0%, 100%": {
              opacity: 1,
              transform: "translateZ(-50px) rotateY(-5deg) skewY(-2deg)",
            },
            "50%": {
              opacity: 0.95,
              transform: "translateZ(-55px) rotateY(-6deg) skewY(-3deg)",
            },
          },
        }}
      />

      {/* Market Opportunity Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          right: "55%",
          width: "35%",
          zIndex: 0,
          margin: "0px 29px auto auto",
        }}
      >
        <Card
          sx={{
            p: 2,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(106, 13, 173, 0.1)",
            border: "1px solid rgba(106, 13, 173, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrendingUp sx={{ fontSize: 18, color: "#6a0dad", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#6a0dad" }}
            >
              Market Growth
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "200px",
              gap: 4,
              mb: 6,
            }}
          >
            {[40, 60, 85, 120, 180, 250].map((height, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", color: "#666", mb: 0.5 }}
                >
                  {["'21", "'22", "'23", "'24", "'25", "'26"][idx]}
                </Typography>
                <Box
                  sx={{
                    width: "80%",
                    height: `${height / 3}px`,
                    background:
                      idx >= 4
                        ? "linear-gradient(to top, #6a0dad, #8a2be2)"
                        : "linear-gradient(to top, rgba(106, 13, 173, 0.3), rgba(106, 13, 173, 0.5))",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", textAlign: "center" }}
          >
            Document AI Market ($B)
          </Typography>
        </Card>
      </Box>

      {/* ROI Comparison Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          right: "28%",
          width: "30%",
          zIndex: 0,
        }}
      >
        <Card
          sx={{
            p: 2,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(46, 125, 50, 0.1)",
            border: "1px solid rgba(46, 125, 50, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <MonetizationOn sx={{ fontSize: 18, color: "#2e7d32", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#2e7d32" }}
            >
              ROI Comparison
            </Typography>
          </Box>
          <Box sx={{ height: "80px", position: "relative", mb: 1 }}>
            {/* Manual Processing */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                width: "40%",
                height: "24px",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                borderRadius: "4px",
                top: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#d32f2f" }}
              >
                15%
              </Typography>
            </Box>

            {/* DocRevisor Platform */}
            <Box
              sx={{
                position: "absolute",
                right: 0,
                width: "40%",
                height: "64px",
                background:
                  "linear-gradient(to right, rgba(46, 125, 50, 0.1), rgba(76, 175, 80, 0.2))",
                border: "1px solid rgba(46, 125, 50, 0.3)",
                borderRadius: "4px",
                top: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#2e7d32" }}
              >
                80%
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: "#d32f2f" }}>
              Manual
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#2e7d32", fontWeight: "bold" }}
            >
              DocRevisor
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Processing Volume Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          bottom: "5%",
          right: "5%",
          width: "35%",
          zIndex: 0,
        }}
      >
        <Card
          sx={{
            p: 2,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(21, 101, 192, 0.1)",
            border: "1px solid rgba(21, 101, 192, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <BarChart sx={{ fontSize: 18, color: "#1565c0", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#1565c0" }}
            >
              Processing Growth
            </Typography>
          </Box>
          <Box sx={{ position: "relative", height: "60px", mb: 1 }}>
            {/* Connecting line */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "10%",
                right: "10%",
                height: "2px",
                backgroundColor: "rgba(21, 101, 192, 0.2)",
                transform: "translateY(-50%)",
              }}
            />

            {/* Data points */}
            {[
              { month: "Q1", value: 100, label: "100K" },
              { month: "Q2", value: 250, label: "250K" },
              { month: "Q3", value: 500, label: "500K" },
              { month: "Q4", value: 1200, label: "1.2M" },
            ].map((point, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "absolute",
                  left: `${idx * 33}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: point.month === "Q4" ? "14px" : "10px",
                    height: point.month === "Q4" ? "14px" : "10px",
                    borderRadius: "50%",
                    background:
                      point.month === "Q4"
                        ? "linear-gradient(135deg, #1565c0, #2196f3)"
                        : "rgba(21, 101, 192, 0.6)",
                    border: point.month === "Q4" ? "2px solid white" : "none",
                    boxShadow:
                      point.month === "Q4"
                        ? "0 2px 8px rgba(21, 101, 192, 0.3)"
                        : "none",
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: point.month === "Q4" ? "bold" : "normal",
                  }}
                >
                  {point.month}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6rem",
                    color: "#666",
                    position: "absolute",
                    top: "-20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {point.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", textAlign: "center" }}
          >
            12x volume increase in 12 months
          </Typography>
        </Card>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, top: "-100px" }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "left",
            fontWeight: "bold",
            mb: 8,
            mx: 0,
            color: "#333",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 9,
            top: "-100px",
          }}
        >
          {/* Market Intelligence & Performance Metrics*/}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: "left",
            color: "#666",
            margin: "0px -369px auto 0px",
            maxWidth: "800px",
            mx: 4,
          }}
        >
          {/*Real-time analytics showcasing platform growth and enterprise impact*/}
        </Typography>
      </Container>
    </Box>
  );

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
                alt="DocRevisor"
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
                  DocRevisor
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
                ["ROI Calculator", "/roi"],
                ["Investor Relations", "/investors"],
              ].map((item) => (
                <Typography
                  key={item[0]}
                  sx={{
                    color: "#333",
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
              {tr.login}
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section with Investor Messaging */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
            <Chip
              label="Series B Funding Stage"
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
              {t.valueProp}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {t.tagline}
            </Typography>

            {/* Investor Metrics */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {roiMetrics.map((metric, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", color: "#6a0dad" }}
                    >
                      {metric.metric}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {metric.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(106, 13, 173, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a0cad, #7a2ad2)",
                    boxShadow: "0 6px 25px rgba(106, 13, 173, 0.4)",
                  },
                }}
                onClick={GetSelectedPlan}
                endIcon={<ArrowForward />}
              >
                {t.tryNow}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  border: "2px solid #6a0dad",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  color: "#6a0dad",
                  "&:hover": {
                    border: "2px solid #5a0cad",
                    backgroundColor: "rgba(106, 13, 173, 0.04)",
                  },
                }}
                onClick={getStarted}
              >
                {t.getStarted}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Platform Modules */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "#fafbff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Patterned Gradient Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)",
            backgroundImage: `
        linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%),
        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(106, 13, 173, 0.03) 10px, rgba(106, 13, 173, 0.03) 20px)
      `,
            clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 30% 0%)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 2,
              color: "#333",
            }}
          >
            Enterprise Document Intelligence Platform
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
            Six integrated modules that transform documents into strategic
            assets
          </Typography>

          <Grid container spacing={4}>
            {platformModules.map((module, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    background: module.gradient,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(106, 13, 173, 0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 60px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    {module.icon}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        ml: 2,
                        color: "#333",
                      }}
                    >
                      {module.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", mb: 3, lineHeight: 1.6 }}
                  >
                    {module.description}
                  </Typography>
                  <List dense>
                    {module.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <Verified sx={{ fontSize: 16, color: "#6a0dad" }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Charts Head Title */}
      <Box
        sx={{
          m: 4,
          backgroundColor: "#fafbff",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#170723",
            float: "top",
            mx: 2,
            display: "flex",
            alignItems: "start",
          }}
        >
          Market Intelligence and Performance Metrics
        </Typography>
        <hr></hr>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "16px",
            fontWeight: "light",
            color: "#170723",
            float: "bottom",
            mx: 2,
            display: "flex",
            alignItems: "start",
          }}
        >
          Real-time analytics showcasing platform growth and enterprise impact
        </Typography>
      </Box>

      {/* Charts Section */}
      <ChartsSection />

      {/* Feature Highlights from Sidebar */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 2,
              color: "#333",
            }}
          >
            Comprehensive Feature Suite
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
            Every feature from our enterprise sidebar, available in one unified
            platform
          </Typography>

          <Grid container spacing={4}>
            {featureHighlights.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid #f0f0f0",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 50px ${category.color}20`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
                    {category.features.map((feature, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          px: 0,
                          py: 1,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: `${category.color}08`,
                            borderRadius: "8px",
                          },
                        }}
                        onClick={() => {
                          if (feature.path) {
                            window.location.href = feature.path;
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <ArrowForward
                            sx={{ fontSize: 16, color: category.color }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
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

      {/* Investment Thesis */}
      <Box sx={{ py: 8, backgroundColor: "#f8f9ff" }}>
        <Container maxWidth="lg">
          <Card
            sx={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderRadius: "30px",
              p: 6,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "absolute", right: 0, top: 0, opacity: 0.1 }}>
              <TrendingUp sx={{ fontSize: 300 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              {t.investmentThesis}
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {t.thesisDesc}
            </Typography>

            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ mr: 2 }}>
                    <Rocket sx={{ fontSize: 40, color: "#6a0dad" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      $50B Total Addressable Market
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Document Processing & CRM Integration
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ mr: 2 }}>
                    <Shield sx={{ fontSize: 40, color: "#4caf50" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Enterprise-Grade Security
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      SOC 2 Type II, HIPAA, GDPR Compliant
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 2 }}>
                    <FlashOn sx={{ fontSize: 40, color: "#ff9800" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Proprietary AI Technology
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      15+ Patents Pending in Document AI
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 2 }}>
                    <Dns sx={{ fontSize: 40, color: "#2196f3" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Scalable Infrastructure
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Processes 1M+ Documents Daily
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="md">
          <Card
            sx={{
              background: "linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)",
              borderRadius: "30px",
              p: 6,
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Ready to Transform Your Document Intelligence?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Schedule a personalized enterprise demo and see the platform in
              action
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
              onClick={GetSelectedPlan}
              endIcon={<ArrowForward />}
            >
              Request Enterprise Demo
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
                  alt="DocRevisor"
                  width="40px"
                  height="40px"
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", ml: 1, color: "white" }}
                >
                  DocRevisor
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
                {t.support}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 enterprise@docrevisor.info
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📞 +44 123 456 789 (Enterprise Sales)
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                {t.location}
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
              {t.copyright}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#666", display: "block", mt: 1 }}
            >
              Intelligent Document Processing Platform • Document Remediation AI
              • CRM Integration Engine
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default IntelligentDocumentPlatform;
