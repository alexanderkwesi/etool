import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  Avatar,
  CardHeader,
} from "@mui/material";
import {
  TrendingUp,
  ArrowForward,
  Security,
  Verified,
  Speed,
  Group,
  MonetizationOn,
  BusinessCenter,
  LocationOn,
  Flag,
  EmojiEvents,
  Visibility,
  Lock,
  CloudOff,
  CheckCircle,
  Cancel,
  Warning,
  GitHub,
  LinkedIn,
  Email,
  Phone,
  Timeline,
  BarChart,
  PieChart,
  Storage,
  IntegrationInstructions,
  Accessibility,
  DataUsage,
  CloudQueue,
  Compare,
  Assessment,
  AccountBalance,
  ShowChart,
  Euro,
  Person,
  Business,
  Work,
  School,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "20px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  overflow: "hidden",
  margin: "0 auto",
  maxWidth: "100%",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid rgba(106, 13, 173, 0.1)",
  },
  "& .MuiTableCell-head": {
    backgroundColor: "#f8f9ff",
    fontWeight: "bold",
    color: "#333",
  },
}));

const CompetitiveAdvantageCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  padding: theme.spacing(3),
  height: "100%",
  transition: "all 0.3s ease",
  border: "1px solid rgba(106, 13, 173, 0.1)",
  margin: "0 auto",
  maxWidth: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 16px 60px rgba(106, 13, 173, 0.15)",
  },
}));

const CenteredSection = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& .MuiContainer-root": {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
}));

const FinancialPage = () => {
  const [language] = useState("en");

  // Financial Projections
  const financialProjections = {
    year1: {
      revenue: 72000,
      arr: 72000,
      customers: 25,
      users: 1200,
      growth: "Base",
    },
    year2: {
      revenue: 360000,
      arr: 360000,
      customers: 85,
      users: 5000,
      growth: "400%",
    },
    year3: {
      revenue: 1200000,
      arr: 1200000,
      customers: 200,
      users: 15000,
      growth: "233%",
    },
  };

  // SEIS Investment Details
  const investmentDetails = {
    raise: 50000,
    valuation: 850000,
    equity: 5.88,
    seiSTaxRelief: 50,
    seiSCgtExemption: 10,
  };

  // Competitive Matrix
  const competitiveMatrix = [
    {
      feature: "Accuracy",
      aws: "High",
      legacy: "High",
      startup: "High",
      awsIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
      legacyIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
      startupIcon: <CheckCircle sx={{ color: "#6a0dad" }} />,
    },
    {
      feature: "Accessibility (WCAG 2.1)",
      aws: "Poor / None",
      legacy: "Basic",
      startup: "Native / Full",
      awsIcon: <Cancel sx={{ color: "#f44336" }} />,
      legacyIcon: <Warning sx={{ color: "#ff9800" }} />,
      startupIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Native CRM CRUD",
      aws: "Requires Devs",
      legacy: "Complex API",
      startup: "Built-in / No-Code",
      awsIcon: <Cancel sx={{ color: "#f44336" }} />,
      legacyIcon: <Warning sx={{ color: "#ff9800" }} />,
      startupIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Setup Cost",
      aws: "Low",
      legacy: "Very High",
      startup: "Low (SaaS)",
      awsIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
      legacyIcon: <Cancel sx={{ color: "#f44336" }} />,
      startupIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "UK Data Sovereignty",
      aws: "Cross-border",
      legacy: "Variable",
      startup: "Localized UK",
      awsIcon: <Warning sx={{ color: "#ff9800" }} />,
      legacyIcon: <Warning sx={{ color: "#ff9800" }} />,
      startupIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "UK Document Formats",
      aws: "Generic",
      legacy: "Generic",
      startup: "Specialized",
      awsIcon: <Cancel sx={{ color: "#f44336" }} />,
      legacyIcon: <Cancel sx={{ color: "#f44336" }} />,
      startupIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
  ];

  // Market Opportunity
  const marketOpportunity = {
    tam: 50000000000, // $50B
    sam: 5000000000, // $5B - UK/EU CRM-integrated IDP
    som: 150000000, // $150M - Accessible IDP niche
  };

  // Competitive Advantages - Detailed
  const competitiveAdvantages = [
    {
      title: "Accessibility-First Architecture",
      subtitle: "The Blue Ocean Strategy",
      icon: <Accessibility sx={{ fontSize: 48, color: "#6a0dad" }} />,
      description:
        "Built from the ground up for screen-reader compatibility and keyboard-only navigation. This isn't an afterthought—it's our foundation.",
      valueProposition:
        "Enables UK firms to meet Public Sector Bodies Accessibility Regulations and the Equality Act 2010 when deploying automation.",
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
      features: [
        "Screen-reader optimized interface",
        "Full keyboard navigation",
        "WCAG 2.1 AA compliance",
        "Section 508 ready",
      ],
    },
    {
      title: "Native CRUD CRM Synchronisation",
      subtitle: "No-Code Integration",
      icon: <IntegrationInstructions sx={{ fontSize: 48, color: "#2e7d32" }} />,
      description:
        "Direct Create, Read, Update, Delete operations within Salesforce, HubSpot, and Dynamics 365. No JSON exports. No middleware.",
      valueProposition:
        "Reduces deployment time from weeks to hours and eliminates expensive 'Zapier' style middleware costs.",
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      features: [
        "One-click CRM sync",
        "Real-time bidirectional updates",
        "No development required",
        "Custom field mapping",
      ],
    },
    {
      title: "Localized UK Data Security",
      subtitle: "Sovereignty & Compliance",
      icon: <Lock sx={{ fontSize: 48, color: "#1565c0" }} />,
      description:
        "UK-based data residency with human-in-the-loop verification, optimized for British document formats including UK Invoices and CIS vouchers.",
      valueProposition:
        "Essential for UK legal and financial firms sensitive to GDPR and data sovereignty concerns.",
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      features: [
        "100% UK data residency",
        "GDPR by design",
        "CIS voucher optimized",
        "Human-in-the-loop review",
      ],
    },
  ];

  // Founder Profile
  const founderProfile = {
    name: "Alexander Oluwaseun Kwesi",
    role: "Founder | Revise Tech",
    visaStatus: "Graduate Visa → Innovator Founder Route",
    location: "Warrington, Manchester",
    commitment: "Long-term commitment to North West tech ecosystem",
    linkedin: "alexanderoluwaseunkwesi",
    email: "seankwesi24@googlemaail.com",
    phone: "+447342622033",
    achievements: [
      "Prototype developed with competitive edge against AWS/Google",
      "Clear roadmap to £72k ARR in year 1",
      "SEIS Advance Assurance in progress",
      "Graduate Visa with clear Innovator Founder pathway",
    ],
  };

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatGBP = (value) => {
    return `£${value.toLocaleString()}`;
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Enterprise Header - Consistent with Landing Page - LEFT ALONE */}
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
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "linear-gradient(45deg, #ffffff, #ffffff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                <img src={Logo} alt="DocRevisor" width="50px" height="50px" />
              </Box>
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
                  SEIS Investment Opportunity
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[
                ["Overview", "/overview"],
                ["Financials", "/financials"],
                ["Competition", "/competition"],
                ["Deck", "/deck"],
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
                },
              }}
              onClick={() => (window.location.href = "/contact")}
            >
              Request Deck
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section - SEIS Investment - CENTERED */}
      <CenteredSection
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
              label="SEIS Advance Assurance in Progress"
              sx={{
                mb: 3,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #6a0dad15, #8a2be215)",
                color: "#6a0dad",
                border: "1px solid rgba(106, 13, 173, 0.2)",
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
              }}
            >
              £72k ARR Pre-Seed Investment Opportunity
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Intelligent Document Processing for the Accessibility-First Era.
              Competing with AWS & Google through specialized CRM integration
              and UK data sovereignty.
            </Typography>

            {/* Investment Highlights - CENTERED */}
            <Grid
              container
              spacing={3}
              sx={{ mb: 6, justifyContent: "center" }}
            >
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    £72k
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "600" }}>
                    Year 1 ARR
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Forecasted Revenue
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    £50k
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "600" }}>
                    Pre-Seed Raise
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    SEIS Eligible
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    5,000
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "600" }}>
                    Users
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Within 24 Months
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    50%
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "600" }}>
                    SEIS Tax Relief
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    For Investors
                  </Typography>
                </Box>
              </Grid>
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
                  },
                }}
                endIcon={<ArrowForward />}
                onClick={() => (window.location.href = "/schedule-demo")}
              >
                Schedule 10-Minute Call
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
                endIcon={<LocationOn />}
                onClick={() => window.location.href="/coffee-meetup"}
              >
                Coffee in Warrington/Manchester
              </Button>
            </Stack>

            {/* Founder Quick Bio - CENTERED */}
            <Box
              sx={{
                mt: 5,
                pt: 3,
                borderTop: "1px solid rgba(106, 13, 173, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<School sx={{ color: "#6a0dad" }} />}
                label="Graduate Visa → Innovator Founder"
                variant="outlined"
                sx={{ borderColor: "rgba(106, 13, 173, 0.3)" }}
              />
              <Chip
                icon={<Business sx={{ color: "#6a0dad" }} />}
                label="Warrington, UK"
                variant="outlined"
                sx={{ borderColor: "rgba(106, 13, 173, 0.3)" }}
              />
              <Chip
                icon={<Flag sx={{ color: "#6a0dad" }} />}
                label="North West Tech Ecosystem"
                variant="outlined"
                sx={{ borderColor: "rgba(106, 13, 173, 0.3)" }}
              />
            </Box>
          </Box>
        </Container>
      </CenteredSection>

      {/* Founder Profile Section - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: "30px",
                  background:
                    "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
                  p: 4,
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  mx: "auto",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(106, 13, 173, 0.03)",
                  }}
                />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "transparent",
                      border: "3px solid #6a0dad",
                      mb: 3,
                      mx: "auto",
                    }}
                  >
                    <Person sx={{ fontSize: 60, color: "#6a0dad" }} />
                  </Avatar>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {founderProfile.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6a0dad",
                      mb: 2,
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {founderProfile.role}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666",
                      mb: 3,
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    {founderProfile.commitment}
                  </Typography>
                  <List dense sx={{ width: "100%", mx: "auto" }}>
                    {founderProfile.achievements.map((achievement, idx) => (
                      <ListItem
                        key={idx}
                        sx={{ px: 0, py: 0.5, justifyContent: "center" }}
                      >
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <CheckCircle
                            sx={{ fontSize: 16, color: "#4caf50" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={achievement}
                          sx={{ textAlign: "left" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkedIn />}
                      sx={{
                        borderColor: "#6a0dad",
                        color: "#6a0dad",
                        borderRadius: "20px",
                        "&:hover": {
                          borderColor: "#5a0cad",
                          backgroundColor: "rgba(106, 13, 173, 0.04)",
                        },
                      }}
                      href={`https://linkedin.com/in/${founderProfile.linkedin}`}
                      target="_blank"
                    >
                      LinkedIn
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Email />}
                      sx={{
                        borderColor: "#6a0dad",
                        color: "#6a0dad",
                        borderRadius: "20px",
                        "&:hover": {
                          borderColor: "#5a0cad",
                          backgroundColor: "rgba(106, 13, 173, 0.04)",
                        },
                      }}
                      href={`mailto:${founderProfile.email}`}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Phone />}
                      sx={{
                        borderColor: "#6a0dad",
                        color: "#6a0dad",
                        borderRadius: "20px",
                        "&:hover": {
                          borderColor: "#5a0cad",
                          backgroundColor: "rgba(106, 13, 173, 0.04)",
                        },
                      }}
                      href={`tel:${founderProfile.phone}`}
                    >
                      Call
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#333",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Why Invest in Revise Tech?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 4,
                  lineHeight: 1.6,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                We're not building "another OCR tool." We're building the first
                accessibility-native, CRM-integrated IDP platform optimized for
                the UK market.
              </Typography>
              <Grid
                container
                spacing={3}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "rgba(106, 13, 173, 0.1)",
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <EmojiEvents sx={{ color: "#6a0dad" }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        SEIS Advance Assurance
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        50% income tax relief for investors
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "rgba(46, 125, 50, 0.1)",
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <Verified sx={{ color: "#2e7d32" }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Clear Visa Roadmap
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Graduate → Innovator Founder
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "rgba(21, 101, 192, 0.1)",
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <LocationOn sx={{ color: "#1565c0" }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        North West Commitment
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Warrington/Manchester HQ
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "rgba(237, 108, 2, 0.1)",
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <Speed sx={{ color: "#ed6c02" }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Competitive Prototype
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Ready to take on AWS/Google
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </CenteredSection>

      {/* Competitive Advantages - Detailed - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "#fafbff" }}>
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
            Our Competitive Edge
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
            Three strategic advantages that create an unassailable moat against
            AWS, Google, and legacy IDP providers
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {competitiveAdvantages.map((advantage, index) => (
              <Grid item xs={12} md={4} key={index}>
                <CompetitiveAdvantageCard
                  sx={{ background: advantage.gradient }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    {advantage.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      mb: 1,
                      color: "#333",
                    }}
                  >
                    {advantage.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                      color: "#6a0dad",
                      fontWeight: "600",
                      mb: 2,
                    }}
                  >
                    {advantage.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 3,
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    {advantage.description}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.7)",
                      borderRadius: "12px",
                      p: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        mb: 1,
                        textAlign: "center",
                      }}
                    >
                      Value Proposition:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", textAlign: "center" }}
                    >
                      {advantage.valueProposition}
                    </Typography>
                  </Box>
                  <List dense sx={{ width: "100%", mx: "auto" }}>
                    {advantage.features.map((feature, idx) => (
                      <ListItem
                        key={idx}
                        sx={{ px: 0, py: 0.5, justifyContent: "center" }}
                      >
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <Verified sx={{ fontSize: 16, color: "#6a0dad" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          sx={{ textAlign: "left" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CompetitiveAdvantageCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </CenteredSection>

      {/* Competitive Matrix - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "white" }}>
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
            Competitive Matrix
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
            How we stack up against the industry giants
          </Typography>

          <StyledTableContainer component={Paper} sx={{ mx: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    Feature
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    AWS Textract / Google
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    Legacy IDP (ABBYY)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#6a0dad",
                      backgroundColor: "rgba(106, 13, 173, 0.04)",
                    }}
                  >
                    Revise Tech
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {competitiveMatrix.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      {row.feature}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {row.awsIcon}
                        <Typography variant="body2">{row.aws}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {row.legacyIcon}
                        <Typography variant="body2">{row.legacy}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "rgba(106, 13, 173, 0.04)",
                        fontWeight: "bold",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {row.startupIcon}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#6a0dad" }}
                        >
                          {row.startup}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: "#f8f9ff",
              borderRadius: "16px",
              border: "1px solid rgba(106, 13, 173, 0.1)",
              textAlign: "center",
              mx: "auto",
              maxWidth: "100%",
            }}
          >
            <Typography variant="body1" sx={{ color: "#333" }}>
              <strong>The "Blue Ocean" Strategy:</strong> While competitors race
              to improve accuracy by 0.1%, we've captured an underserved market
              of organizations that need{" "}
              <strong>accessibility-compliant</strong> document processing with{" "}
              <strong>native CRM integration</strong>. This is our moat.
            </Typography>
          </Box>
        </Container>
      </CenteredSection>

      {/* Financial Projections - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "#fafbff" }}>
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
            Financial Projections
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
            Conservative forecasts showing clear path to £1.2M ARR within 36
            months
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {Object.entries(financialProjections).map(([year, data], index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    p: 4,
                    height: "100%",
                    background:
                      year === "year1"
                        ? "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)"
                        : year === "year2"
                          ? "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)"
                          : "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                    border: "1px solid rgba(106, 13, 173, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    mx: "auto",
                    maxWidth: "100%",
                  }}
                >
                  {year === "year1" && (
                    <Chip
                      label="SEIS Investment Year"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#6a0dad",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#6a0dad",
                      fontWeight: "bold",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {year.replace("year", "Year ")}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {formatGBP(data.revenue)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mb: 3, textAlign: "center" }}
                  >
                    ARR: {formatGBP(data.arr)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <List dense sx={{ width: "100%", mx: "auto" }}>
                    <ListItem sx={{ px: 0, justifyContent: "center" }}>
                      <ListItemText
                        primary="Enterprise Customers"
                        secondary={data.customers}
                        sx={{ textAlign: "center" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, justifyContent: "center" }}>
                      <ListItemText
                        primary="Platform Users"
                        secondary={`${data.users.toLocaleString()}+`}
                        sx={{ textAlign: "center" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, justifyContent: "center" }}>
                      <ListItemText
                        primary="YoY Growth"
                        secondary={data.growth}
                        sx={{ textAlign: "center" }}
                      />
                    </ListItem>
                  </List>

                  {year === "year1" && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6a0dad", fontWeight: "bold" }}
                      >
                        * £72k ARR achieved with minimal marketing
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Investment Terms - CENTERED */}
          <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "20px",
                  p: 4,
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                  color: "white",
                  mx: "auto",
                  maxWidth: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountBalance sx={{ mr: 1, color: "#6a0dad" }} />
                  SEIS Investment Terms
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Investment Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {formatGBP(investmentDetails.raise)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Pre-Money Valuation
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {formatGBP(investmentDetails.valuation)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      Equity Offered
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {investmentDetails.equity}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      SEIS Tax Relief
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#4caf50" }}
                    >
                      {investmentDetails.seiSTaxRelief}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    pt: 3,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                    <strong>Tax Efficiency Example:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    £50,000 investment → £25,000 immediate income tax relief +{" "}
                    {investmentDetails.seiSCgtExemption}% CGT exemption
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "20px",
                  p: 4,
                  background: "white",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                  height: "100%",
                  mx: "auto",
                  maxWidth: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#333",
                  }}
                >
                  <ShowChart sx={{ mr: 1, color: "#6a0dad" }} />
                  Market Opportunity
                </Typography>

                <Box sx={{ mb: 4, width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      TAM: Global Document Processing
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(marketOpportunity.tam)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(106, 13, 173, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#6a0dad",
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      SAM: CRM-Integrated IDP (UK/EU)
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(marketOpportunity.sam)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={10}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(106, 13, 173, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#8a2be2",
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      SOM: Accessible IDP (Our Niche)
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "#6a0dad" }}
                    >
                      {formatCurrency(marketOpportunity.som)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={3}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(106, 13, 173, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#9c27b0",
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  We only need 0.3% of our SAM to achieve our 3-year revenue
                  targets
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </CenteredSection>

      {/* Call to Action - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="md">
          <Card
            sx={{
              background: "linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)",
              borderRadius: "30px",
              p: 6,
              textAlign: "center",
              color: "white",
              mx: "auto",
              maxWidth: "100%",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Ready to Join Our SEIS Round?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Coffee in Warrington/Manchester? 10-minute intro call? Let's
              discuss how we're revolutionizing document intelligence.
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
                onClick={() =>
                  (window.location.href = "mailto:seankwesi24@googlemaail.com")
                }
              >
                Schedule Coffee/Call
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  border: "2px solid white",
                  color: "white",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    border: "2px solid white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                onClick={() => (window.location.href = "/deck")}
              >
                View Investment Deck
              </Button>
            </Stack>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 3, opacity: 0.8 }}
            >
              SEIS Advance Assurance in progress • UK Data Residency • Innovator
              Founder Route
            </Typography>
          </Card>
        </Container>
      </CenteredSection>

      {/* Footer - CENTERED */}
      <footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "60px 0 30px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "20px",
                    mr: 1,
                  }}
                >
                  <img src={Logo} alt="DocRevisor" width="50px" height="50px" />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", ml: 1, color: "white" }}
                >
                  DocRevisor
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  lineHeight: 1.6,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Transforming unstructured data into accessible business
                intelligence through AI-powered document processing.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#999",
                  display: "block",
                  mt: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                SEIS Advance Assurance in Progress
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Contact Founder
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                📧 {founderProfile.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                📞 {founderProfile.phone}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", textAlign: { xs: "center", md: "left" } }}
              >
                📍 {founderProfile.location}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <LinkedIn
                  sx={{ color: "#ccc", fontSize: 20, cursor: "pointer" }}
                />
                <GitHub
                  sx={{ color: "#ccc", fontSize: 20, cursor: "pointer" }}
                />
                <Email
                  sx={{ color: "#ccc", fontSize: 20, cursor: "pointer" }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Investment Status
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Chip
                  label="SEIS Advance Assurance in Progress"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    mb: 2,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <strong>Raise:</strong> {formatGBP(investmentDetails.raise)}{" "}
                Pre-Seed
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <strong>Valuation:</strong>{" "}
                {formatGBP(investmentDetails.valuation)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", textAlign: { xs: "center", md: "left" } }}
              >
                <strong>Year 1 ARR:</strong>{" "}
                {formatGBP(financialProjections.year1.revenue)}
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
              © 2024 Revise Tech. All rights reserved.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#666", display: "block", mt: 1 }}
            >
              Intelligent Document Processing • Accessibility-First Architecture
              • Native CRM Integration • UK Data Sovereignty
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default FinancialPage;
