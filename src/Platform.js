import React, { useState } from "react";
import "./Platform.css";
import Logo from "./image/favicon-png.png";
import  Stack  from "@mui/material/Stack";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Container,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Avatar,
  Paper,
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
  Speed as SpeedIcon,
  PrecisionManufacturing as PrecisionIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
  WorkspacePremium as PremiumIcon,
  CheckCircle,
  Settings,
  DataUsage,
  Timeline,
} from "@mui/icons-material";

const API_BASE = "http://127.0.0.1:5000/api";

const PlatformPage = () => {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState(0);

  const translations = {
    en: {
      pageTitle: "Enterprise Document Intelligence Platform",
      pageSubtitle:
        "A unified AI-powered ecosystem for comprehensive document lifecycle management",

      // Architecture Overview
      archTitle: "Platform Architecture",
      archDesc:
        "Enterprise-grade infrastructure built for scale, security, and seamless integration",

      // Core Modules
      modulesTitle: "Integrated Platform Modules",
      modulesDesc: "Six core engines powering end-to-end document intelligence",

      // Technical Specifications
      techSpecs: "Technical Specifications",

      // Enterprise Features
      enterpriseFeatures: "Enterprise Capabilities",

      // Integration
      integrationTitle: "Seamless Enterprise Integration",
      integrationDesc:
        "Connect with your existing tech stack through our robust API ecosystem",

      // Security & Compliance
      securityTitle: "Enterprise Security & Compliance",
      securityDesc:
        "Bank-grade security with comprehensive compliance certifications",

      // Performance Metrics
      performanceTitle: "Platform Performance Metrics",

      ctaTitle: "Deploy the Platform in Your Enterprise",
      ctaDesc:
        "Get a customized deployment plan tailored to your organization's needs",
      ctaButton: "Request Deployment Consultation",
    },
    de: {
      pageTitle: "Enterprise Document Intelligence Plattform",
      pageSubtitle:
        "Ein einheitliches KI-gestütztes Ökosystem für umfassendes Dokumenten-Lebenszyklusmanagement",

      archTitle: "Plattformarchitektur",
      archDesc:
        "Unternehmensgerechte Infrastruktur für Skalierbarkeit, Sicherheit und nahtlose Integration",

      modulesTitle: "Integrierte Plattformmodule",
      modulesDesc: "Sechs Kern-Engines für durchgängige Dokumentenintelligenz",

      techSpecs: "Technische Spezifikationen",
      enterpriseFeatures: "Enterprise-Funktionen",

      integrationTitle: "Nahtlose Enterprise-Integration",
      integrationDesc:
        "Verbinden Sie sich mit Ihrem bestehenden Tech-Stack durch unser robustes API-Ökosystem",

      securityTitle: "Enterprise-Sicherheit & Compliance",
      securityDesc:
        "Banken-Sicherheit mit umfassenden Compliance-Zertifizierungen",

      performanceTitle: "Plattform-Leistungsmetriken",

      ctaTitle: "Implementieren Sie die Plattform in Ihrem Unternehmen",
      ctaDesc:
        "Erhalten Sie einen maßgeschneiderten Implementierungsplan für Ihre Organisation",
      ctaButton: "Implementierungsberatung anfordern",
    },
  };

  const t = translations[language] || translations.en;

  const login = () => {
    window.location.href = "/signup";
  };

  // Platform Architecture Layers
  const architectureLayers = [
    {
      layer: "Data Ingestion Layer",
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      description: "Multi-channel document capture and ingestion engine",
      components: [
        "REST APIs",
        "Webhooks",
        "Batch Processing",
        "Real-time Streaming",
      ],
      color: "#6a0dad",
    },
    {
      layer: "Processing Engine",
      icon: <PrecisionIcon sx={{ fontSize: 40 }} />,
      description: "AI-powered document processing and analysis core",
      components: [
        "OCR Engine",
        "NLP Pipeline",
        "ML Classification",
        "Entity Extraction",
      ],
      color: "#2e7d32",
    },
    {
      layer: "Intelligence Layer",
      icon: <AiPowerIcon sx={{ fontSize: 40 }} />,
      description: "Advanced document intelligence and insights generation",
      components: [
        "Pattern Recognition",
        "Predictive Analytics",
        "Smart Tagging",
        "Content Analysis",
      ],
      color: "#1565c0",
    },
    {
      layer: "Integration Fabric",
      icon: <ApiIcon sx={{ fontSize: 40 }} />,
      description: "Enterprise system connectivity and data synchronization",
      components: [
        "CRM Connectors",
        "ERP Integration",
        "Cloud Storage",
        "Custom APIs",
      ],
      color: "#ed6c02",
    },
    {
      layer: "Security & Compliance",
      icon: <Shield sx={{ fontSize: 40 }} />,
      description: "End-to-end security and regulatory compliance framework",
      components: [
        "Encryption",
        "Access Control",
        "Audit Trails",
        "Compliance Checks",
      ],
      color: "#c62828",
    },
    {
      layer: "Analytics & Reporting",
      icon: <Analytics sx={{ fontSize: 40 }} />,
      description: "Comprehensive analytics and business intelligence",
      components: [
        "Dashboards",
        "Custom Reports",
        "ROI Tracking",
        "Trend Analysis",
      ],
      color: "#9c27b0",
    },
  ];

  // Platform Modules with detailed specs
  const platformModules = [
    {
      name: "Intelligent Document Processing (IDP)",
      icon: <AiPowerIcon sx={{ fontSize: 48, color: "#6a0dad" }} />,
      description: "AI-powered document understanding with 99.8% accuracy",
      features: [
        "Multi-language document processing",
        "Handwritten text recognition",
        "Table and form extraction",
        "Document classification",
        "Key-value pair extraction",
        "Signature detection",
      ],
      metrics: {
        throughput: "1M+ documents/day",
        latency: "< 2 seconds",
        accuracy: "99.8%",
      },
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      name: "Document Remediation Engine",
      icon: <Build sx={{ fontSize: 48, color: "#2e7d32" }} />,
      description: "Automated accessibility and compliance remediation",
      features: [
        "PDF/UA compliance",
        "WCAG 2.1 remediation",
        "Section 508 validation",
        "Structure correction",
        "Alt-text generation",
        "Reading order optimization",
      ],
      metrics: {
        throughput: "500K+ documents/day",
        latency: "< 5 seconds",
        accuracy: "99.5%",
      },
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    },
    {
      name: "Document Transformation Hub",
      icon: <ConvertIcon sx={{ fontSize: 48, color: "#1565c0" }} />,
      description: "Universal document conversion and normalization",
      features: [
        "200+ format support",
        "Batch conversion",
        "Metadata preservation",
        "Quality optimization",
        "Font embedding",
        "Color space management",
      ],
      metrics: {
        throughput: "750K+ documents/day",
        latency: "< 3 seconds",
        accuracy: "99.9%",
      },
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    },
    {
      name: "Universal Design Platform",
      icon: <Verified sx={{ fontSize: 48, color: "#ed6c02" }} />,
      description: "Accessible document creation and validation",
      features: [
        "Accessible PDF generation",
        "EPUB conversion",
        "DAISY format support",
        "Braille ready output",
        "Large print formatting",
        "Screen reader optimization",
      ],
      metrics: {
        throughput: "300K+ documents/day",
        latency: "< 4 seconds",
        accuracy: "99.7%",
      },
      gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    },
    {
      name: "CRM Intelligence Engine",
      icon: <IntegrationInstructions sx={{ fontSize: 48, color: "#6a1b9a" }} />,
      description: "Deep document intelligence for CRM systems",
      features: [
        "Salesforce native integration",
        "HubSpot synchronization",
        "Microsoft Dynamics connector",
        "Contact enrichment",
        "Deal intelligence",
        "Activity tracking",
      ],
      metrics: {
        throughput: "100K+ syncs/day",
        latency: "< 1 second",
        accuracy: "99.9%",
      },
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      name: "Business Intelligence Suite",
      icon: <Analytics sx={{ fontSize: 48, color: "#c62828" }} />,
      description: "Advanced analytics and predictive insights",
      features: [
        "Real-time dashboards",
        "Predictive modeling",
        "Trend analysis",
        "ROI calculator",
        "Performance benchmarking",
        "Custom report builder",
      ],
      metrics: {
        throughput: "10K+ reports/day",
        latency: "< 10 seconds",
        accuracy: "99.6%",
      },
      gradient: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
    },
  ];

  // Integration Partners
  const integrations = [
    { name: "Salesforce", logo: "SF", color: "#00a1e0" },
    { name: "HubSpot", logo: "HS", color: "#ff7a59" },
    { name: "Microsoft", logo: "MS", color: "#00a4ef" },
    { name: "Google Cloud", logo: "GC", color: "#4285f4" },
    { name: "Amazon Web Services", logo: "AWS", color: "#ff9900" },
    { name: "Oracle", logo: "OR", color: "#f80000" },
    { name: "SAP", logo: "SAP", color: "#0faa5c" },
    { name: "Adobe", logo: "AD", color: "#ff0000" },
  ];

  // Security Certifications
  const certifications = [
    { name: "SOC 2 Type II", status: "Certified", icon: <Shield /> },
    { name: "ISO 27001", status: "Certified", icon: <SecurityIcon /> },
    { name: "GDPR", status: "Compliant", icon: <Verified /> },
    { name: "HIPAA", status: "Compliant", icon: <Verified /> },
    { name: "PCI DSS", status: "Level 1", icon: <Shield /> },
    { name: "FedRAMP", status: "In Progress", icon: <Timeline /> },
  ];

  // Performance Metrics
  const performanceMetrics = [
    {
      metric: "99.99%",
      label: "Uptime SLA",
      description: "Enterprise availability",
      icon: <Verified />,
    },
    {
      metric: "<100ms",
      label: "API Latency",
      description: "P95 response time",
      icon: <SpeedIcon />,
    },
    {
      metric: "1M+",
      label: "Daily Documents",
      description: "Processing capacity",
      icon: <DataUsage />,
    },
    {
      metric: "200+",
      label: "File Formats",
      description: "Supported formats",
      icon: <StorageIcon />,
    },
    {
      metric: "15+",
      label: "Patents Pending",
      description: "Proprietary technology",
      icon: <Science />,
    },
    {
      metric: "99.8%",
      label: "Accuracy Rate",
      description: "AI processing",
      icon: <PrecisionIcon />,
    },
  ];

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
                ["ROI Calculator", "/roi"],
                ["Investor Relations", "/investors"],
              ].map((item) => (
                <Typography
                  key={item[0]}
                  sx={{
                    color: item[0] === "Platform" ? "#6a0dad" : "#333",
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
              onClick={() => (window.location.href = "/signup")}
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
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
            <Chip
              label="Enterprise Platform v2.0"
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
              {t.pageTitle}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {t.pageSubtitle}
            </Typography>

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
                onClick={() => (window.location.href = "/features")}
                endIcon={<ArrowForward />}
              >
                Explore Platform Features
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
                onClick={() => (window.location.href = "/enterprise-demo")}
              >
                Schedule Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Platform Architecture Section */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
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
            {t.archTitle}
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
            {t.archDesc}
          </Typography>

          <Grid container spacing={3}>
            {architectureLayers.map((layer, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    border: "1px solid #f0f0f0",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 40px ${layer.color}20`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${layer.color}15`,
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(layer.icon, {
                        sx: { fontSize: 32, color: layer.color },
                      })}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: layer.color }}
                      >
                        {layer.layer}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                    {layer.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {layer.components.map((component, idx) => (
                      <Chip
                        key={idx}
                        label={component}
                        size="small"
                        sx={{
                          backgroundColor: `${layer.color}10`,
                          color: layer.color,
                          fontSize: "0.7rem",
                        }}
                      />
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            {t.modulesTitle}
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
            {t.modulesDesc}
          </Typography>

          <Grid container spacing={4}>
            {platformModules.map((module, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    background: module.gradient,
                    borderRadius: "20px",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(106, 13, 173, 0.1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 16px 40px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}
                  >
                    {module.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {module.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", mt: 0.5 }}
                      >
                        {module.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.entries(module.metrics).map(([key, value]) => (
                      <Grid item xs={4} key={key}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#6a0dad" }}
                          >
                            {value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666", textTransform: "capitalize" }}
                          >
                            {key}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <List dense>
                    {module.features.slice(0, 4).map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <CheckCircle
                            sx={{ fontSize: 16, color: "#6a0dad" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
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

      {/* Performance Metrics */}
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
            {t.performanceTitle}
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
            Enterprise-grade performance backed by real-world metrics
          </Typography>

          <Grid container spacing={4}>
            {performanceMetrics.map((metric, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(106, 13, 173, 0.12)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#f3e5f5",
                      borderRadius: "50%",
                      width: 60,
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(metric.icon, {
                      sx: { fontSize: 30, color: "#6a0dad" },
                    })}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad", mb: 1 }}
                  >
                    {metric.metric}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "600", color: "#333", mb: 0.5 }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {metric.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Integrations Section */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
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
            {t.integrationTitle}
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
            {t.integrationDesc}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {integrations.map((integration, index) => (
              <Card
                key={index}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 120,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${integration.color}30`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: integration.color,
                    width: 50,
                    height: 50,
                    mb: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {integration.logo}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", textAlign: "center" }}
                >
                  {integration.name}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Security & Compliance */}
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
            {t.securityTitle}
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
            {t.securityDesc}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {certifications.map((cert, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#f8f9fa",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f3e5f5",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        cert.status === "Certified" ||
                        cert.status === "Compliant"
                          ? "#4caf50"
                          : "#ff9800",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(cert.icon, {
                      sx: { fontSize: 20, color: "white" },
                    })}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "600", fontSize: "1rem" }}
                    >
                      {cert.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          cert.status === "Certified" ||
                          cert.status === "Compliant"
                            ? "#4caf50"
                            : "#ff9800",
                      }}
                    >
                      {cert.status}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
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
              {t.ctaTitle}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {t.ctaDesc}
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
              onClick={() => (window.location.href = "/enterprise-demo")}
              endIcon={<ArrowForward />}
            >
              {t.ctaButton}
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
                Platform Support
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 platform@docrevisor.info
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📞 +44 123 456 789 (Platform Operations)
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

export default PlatformPage;
