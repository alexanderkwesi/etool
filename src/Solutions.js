import React, { useState } from "react";
import "./Solutions.css";
import Logo from "./image/favicon-png.png";
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
  Tab,
  Tabs,
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
  HealthAndSafety,
  AccountBalance,
  LocalShipping,
  School,
  AttachMoney,
  Gavel,
  PrecisionManufacturing,
} from "@mui/icons-material";

const Solutions = () => {
  const [language, setLanguage] = useState("en");
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeSolution, setActiveSolution] = useState(0);

  const translations = {
    en: {
      pageTitle: "Enterprise Solutions",
      pageSubtitle: "Industry-Specific Document Intelligence Platforms",
      heroTitle: "Tailored Document AI Solutions for Regulated Industries",
      heroDesc:
        "Deploy purpose-built document processing solutions that address the unique compliance, security, and operational requirements of your industry.",
      ctaButton: "Schedule Industry Consultation",
      solutions: "Solutions by Industry",
      capabilities: "Platform Capabilities",
      caseStudies: "Success Stories",
      roi: "Industry-Specific ROI",
    },
    de: {
      pageTitle: "Unternehmenslösungen",
      pageSubtitle: "Branchenspezifische Dokumentenintelligenz-Plattformen",
      heroTitle:
        "Maßgeschneiderte Dokumenten-KI-Lösungen für regulierte Branchen",
      heroDesc:
        "Implementieren Sie zweckgebundene Dokumentenverarbeitungslösungen, die die einzigartigen Compliance-, Sicherheits- und Betriebsanforderungen Ihrer Branche erfüllen.",
      ctaButton: "Branchenberatung planen",
      solutions: "Lösungen nach Branche",
      capabilities: "Plattformfähigkeiten",
      caseStudies: "Erfolgsgeschichten",
      roi: "Branchenspezifischer ROI",
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

  // Industry Solutions
  const industrySolutions = [
    {
      id: "financial",
      icon: <AccountBalance sx={{ fontSize: 48 }} />,
      title: "Financial Services & Banking",
      description:
        "Automated mortgage processing, loan document verification, and regulatory compliance reporting for financial institutions.",
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      color: "#1565c0",
      features: [
        "Mortgage & Loan Processing",
        "KYC/AML Compliance Automation",
        "Fraud Detection & Verification",
        "Regulatory Reporting (Basel III, Dodd-Frank)",
        "Trade Finance Document Processing",
        "Audit Trail & Compliance Tracking",
      ],
      roi: {
        metric: "65%",
        label: "Cost Reduction",
        description: "In document processing operations",
      },
      caseStudy: {
        client: "Top 10 Global Bank",
        result: "$12M annual savings, 90% faster loan approvals",
      },
    },
    {
      id: "healthcare",
      icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
      title: "Healthcare & Life Sciences",
      description:
        "HIPAA-compliant medical record processing, claims automation, and clinical trial document management.",
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      color: "#2e7d32",
      features: [
        "Medical Records Digitization",
        "Claims Processing Automation",
        "Clinical Trial Documentation",
        "HIPAA Compliance Validation",
        "Patient Intake Automation",
        "Pharmaceutical Regulatory Submissions",
      ],
      roi: {
        metric: "75%",
        label: "Faster Claims",
        description: "Reduction in claims processing time",
      },
      caseStudy: {
        client: "National Healthcare Provider",
        result: "500K+ hours saved annually, 99.9% HIPAA compliance",
      },
    },
    {
      id: "legal",
      icon: <Gavel sx={{ fontSize: 48 }} />,
      title: "Legal & Professional Services",
      description:
        "Contract analysis, e-discovery, and due diligence automation for law firms and corporate legal departments.",
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
      color: "#6a0dad",
      features: [
        "Contract Review & Analysis",
        "E-Discovery Processing",
        "Due Diligence Automation",
        "Legal Research Enhancement",
        "Compliance Document Management",
        "Intellectual Property Documentation",
      ],
      roi: {
        metric: "80%",
        label: "Time Savings",
        description: "Reduction in document review time",
      },
      caseStudy: {
        client: "Global Law Firm (AmLaw 50)",
        result: "$8M annual efficiency gains, 3x faster case preparation",
      },
    },
    {
      id: "manufacturing",
      icon: <PrecisionManufacturing sx={{ fontSize: 48 }} />,
      title: "Manufacturing & Supply Chain",
      description:
        "Supply chain documentation, quality control records, and compliance document automation.",
      gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
      color: "#ed6c02",
      features: [
        "Supply Chain Documentation",
        "Quality Control Records",
        "ISO Compliance Management",
        "Equipment Maintenance Logs",
        "Vendor Document Processing",
        "Shipping & Logistics Documents",
      ],
      roi: {
        metric: "55%",
        label: "Efficiency Gain",
        description: "Supply chain document processing",
      },
      caseStudy: {
        client: "Fortune 500 Manufacturer",
        result: "40% faster vendor onboarding, $5M annual savings",
      },
    },
    {
      id: "insurance",
      icon: <Verified sx={{ fontSize: 48 }} />,
      title: "Insurance",
      description:
        "Claims processing automation, policy administration, and underwriting document intelligence.",
      gradient: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
      color: "#c62828",
      features: [
        "Claims Document Processing",
        "Policy Administration",
        "Underwriting Automation",
        "Fraud Detection",
        "Customer Onboarding",
        "Regulatory Compliance",
      ],
      roi: {
        metric: "70%",
        label: "Faster Claims",
        description: "Claims processing acceleration",
      },
      caseStudy: {
        client: "Major Insurance Carrier",
        result: "85% reduction in claims processing time, $15M savings",
      },
    },
    {
      id: "government",
      icon: <BusinessCenter sx={{ fontSize: 48 }} />,
      title: "Public Sector & Government",
      description:
        "Citizen services automation, records management, and compliance documentation.",
      gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      color: "#0284c7",
      features: [
        "Citizen Service Automation",
        "Records Management",
        "FOIA Request Processing",
        "Grant Management",
        "Regulatory Compliance",
        "Digital Transformation",
      ],
      roi: {
        metric: "60%",
        label: "Cost Savings",
        description: "Administrative cost reduction",
      },
      caseStudy: {
        client: "Federal Government Agency",
        result: "2M+ citizen documents processed annually, 95% automation rate",
      },
    },
  ];

  // Platform Capabilities
  const platformCapabilities = [
    {
      category: "AI & Machine Learning",
      icon: <AiPowerIcon />,
      capabilities: [
        "Intelligent Document Classification",
        "Entity Extraction & Recognition",
        "Sentiment Analysis",
        "Predictive Document Routing",
        "Anomaly Detection",
        "Continuous Learning Models",
      ],
      color: "#6a0dad",
    },
    {
      category: "Security & Compliance",
      icon: <Shield />,
      capabilities: [
        "End-to-End Encryption",
        "Role-Based Access Control",
        "Audit Logging",
        "Data Sovereignty Controls",
        "Compliance Automation",
        "Zero-Trust Architecture",
      ],
      color: "#2e7d32",
    },
    {
      category: "Integration & Workflow",
      icon: <IntegrationInstructions />,
      capabilities: [
        "Pre-built CRM Connectors",
        "REST API Access",
        "Workflow Automation",
        "Legacy System Integration",
        "Cloud Storage Connectors",
        "Custom Webhook Support",
      ],
      color: "#1565c0",
    },
    {
      category: "Analytics & Reporting",
      icon: <Analytics />,
      capabilities: [
        "Real-time Processing Metrics",
        "Custom Report Builder",
        "Predictive Analytics",
        "ROI Tracking Dashboard",
        "Trend Analysis",
        "Operational Intelligence",
      ],
      color: "#ed6c02",
    },
  ];

  // Success Stories
  const successStories = [
    {
      client: "Global Investment Bank",
      industry: "Financial Services",
      challenge: "Manual processing of 50,000+ loan documents monthly",
      solution:
        "AI-powered document processing with automated compliance checks",
      result: "98% automation rate, 85% faster processing, $18M annual savings",
      image: "/api/placeholder/400/200",
    },
    {
      client: "National Health System",
      industry: "Healthcare",
      challenge: "Legacy paper-based patient record management",
      solution: "HIPAA-compliant document digitization platform",
      result: "100% digital records, 70% reduced administrative costs",
      image: "/api/placeholder/400/200",
    },
    {
      client: "Global Law Firm",
      industry: "Legal",
      challenge: "Inefficient contract review and due diligence",
      solution: "AI contract analysis and e-discovery automation",
      result: "80% faster contract review, 300% increase in case volume",
      image: "/api/placeholder/400/200",
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
                    cursor: "pointer",
                  }}
                  onClick={() => (window.location.href = "/")}
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
                    color: item[0] === "Solutions" ? "#6a0dad" : "#333",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    borderBottom:
                      item[0] === "Solutions" ? "2px solid #6a0dad" : "none",
                    pb: 0.5,
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

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "45%",
            height: "100%",
            background: `
              linear-gradient(145deg, 
                rgba(106, 13, 173, 0.08) 0%, 
                rgba(138, 43, 226, 0.12) 30%,
                rgba(180, 70, 255, 0.05) 70%,
                transparent 100%
              ),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 15px,
                rgba(106, 13, 173, 0.04) 15px,
                rgba(106, 13, 173, 0.04) 16px
              )
            `,
            clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 25% 0%)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Industry-Specific Solutions"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  backgroundColor: "rgba(106, 13, 173, 0.1)",
                  color: "#6a0dad",
                }}
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
                  fontSize: { xs: "2.5rem", md: "3.2rem" },
                  lineHeight: 1.2,
                }}
              >
                {t.heroTitle}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: "1.2rem",
                }}
              >
                {t.heroDesc}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                  endIcon={<ArrowForward />}
                >
                  {t.ctaButton}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  boxShadow: "0 20px 60px rgba(106, 13, 173, 0.15)",
                  background: "white",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 3, color: "#6a0dad" }}
                >
                  Trusted by Industry Leaders
                </Typography>
                <Grid container spacing={2}>
                  {[
                    "JPMorgan",
                    "Pfizer",
                    "Google",
                    "Microsoft",
                    "Goldman Sachs",
                    "AWS",
                  ].map((company, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Paper
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          backgroundColor: "#f8f9ff",
                          borderRadius: "10px",
                          color: "#333",
                          fontWeight: "500",
                        }}
                      >
                        {company}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Industry Solutions */}
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
            {t.solutions}
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
            Purpose-built document intelligence solutions for your industry
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeIndustry}
              onChange={(e, val) => setActiveIndustry(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  minWidth: "180px",
                  color: "#666",
                  "&.Mui-selected": {
                    color: "#6a0dad",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#6a0dad",
                  height: "3px",
                },
              }}
            >
              {industrySolutions.map((industry, index) => (
                <Tab
                  key={index}
                  label={industry.title.split(" ")[0]}
                  icon={React.cloneElement(industry.icon, {
                    sx: { fontSize: 24, color: industry.color },
                  })}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          <Grid container spacing={4}>
            {industrySolutions.map((industry, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    background: industry.gradient,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(106, 13, 173, 0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 16px 60px ${industry.color}20`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                        color: industry.color,
                      }}
                    >
                      {React.cloneElement(industry.icon, {
                        sx: { fontSize: 40, color: industry.color },
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: industry.color,
                      }}
                    >
                      {industry.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mb: 3, lineHeight: 1.6 }}
                  >
                    {industry.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1, color: industry.color }}
                    >
                      Key Features:
                    </Typography>
                    <List dense>
                      {industry.features.slice(0, 4).map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: "24px" }}>
                            <Verified
                              sx={{ fontSize: 14, color: industry.color }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#666", display: "block", mb: 0.5 }}
                    >
                      Industry ROI
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline" }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: industry.color,
                          mr: 1,
                        }}
                      >
                        {industry.roi.metric}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {industry.roi.label}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      {industry.roi.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Capabilities */}
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
            {t.capabilities}
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
            Enterprise-grade capabilities powering industry solutions
          </Typography>

          <Grid container spacing={4}>
            {platformCapabilities.map((capability, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
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
                      boxShadow: `0 12px 50px ${capability.color}20`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${capability.color}15`,
                      borderRadius: "16px",
                      p: 2,
                      display: "inline-block",
                      mb: 3,
                    }}
                  >
                    {React.cloneElement(capability.icon, {
                      sx: { fontSize: 40, color: capability.color },
                    })}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: capability.color,
                    }}
                  >
                    {capability.category}
                  </Typography>

                  <List dense>
                    {capability.capabilities.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "24px" }}>
                          <Verified
                            sx={{ fontSize: 16, color: capability.color }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
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

      {/* Success Stories */}
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
            {t.caseStudies}
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
            Real results from enterprise deployments
          </Typography>

          <Grid container spacing={4}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 60px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: "140px",
                      background: `linear-gradient(135deg, ${index === 0 ? "#1565c0" : index === 1 ? "#2e7d32" : "#6a0dad"}20, white)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index === 0 ? (
                      <AccountBalance
                        sx={{ fontSize: 60, color: "#1565c0", opacity: 0.5 }}
                      />
                    ) : index === 1 ? (
                      <HealthAndSafety
                        sx={{ fontSize: 60, color: "#2e7d32", opacity: 0.5 }}
                      />
                    ) : (
                      <Gavel
                        sx={{ fontSize: 60, color: "#6a0dad", opacity: 0.5 }}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {story.client}
                    </Typography>
                    <Chip
                      label={story.industry}
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: `${index === 0 ? "#1565c0" : index === 1 ? "#2e7d32" : "#6a0dad"}15`,
                        color:
                          index === 0
                            ? "#1565c0"
                            : index === 1
                              ? "#2e7d32"
                              : "#6a0dad",
                        fontWeight: "500",
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      <strong>Challenge:</strong> {story.challenge}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                      <strong>Solution:</strong> {story.solution}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          index === 0
                            ? "#1565c0"
                            : index === 1
                              ? "#2e7d32"
                              : "#6a0dad",
                        fontWeight: "bold",
                      }}
                    >
                      Result: {story.result}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: "#f8f9ff" }}>
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
              Ready to Transform Your Industry?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Schedule a personalized industry consultation with our solution
              architects
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
              endIcon={<ArrowForward />}
            >
              Schedule Industry Consultation
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
                Solutions by Industry
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                Financial Services • Healthcare • Legal
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                Manufacturing • Insurance • Public Sector
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                Enterprise • SMB • Global Organizations
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

export default Solutions;
