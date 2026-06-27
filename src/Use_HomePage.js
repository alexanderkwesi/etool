import React, { useState } from "react";
import "./Use_HomePagae.css";
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
  EmojiPeople,
  Assessment,
  Flag,
  LocationOn,
  School,
  AccountTree,
  Timeline,
} from "@mui/icons-material";

const InvestorSEISPage = () => {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      // Hero
      tagline: "SEIS Investment Opportunity: Pre-Seed (£50k)",
      valueProp: "Intelligent Document Processing for CRM Ecosystems",
      founderTag: "Founder: Alexander Oluwaseun Kwesi | Graduate Visa → Innovator Founder",
      tryNow: "Request Pitch Deck",
      getStarted: "View Financial Projections",
      trustedBy: "Warrington Tech Ecosystem • North West Startup Pipeline",
      
      // Metrics
      arrMetric: "£72k",
      arrLabel: "Year 1 ARR (Projected)",
      usersMetric: "5,000+",
      usersLabel: "Users in 24 Months",
      accuracyMetric: "99.8%",
      accuracyLabel: "AI Accuracy",
      tamMetric: "£40B+",
      tamLabel: "Global TAM",
      
      // Investment Thesis
      thesisTitle: "SEIS-Ready • Graduate Visa • Innovator Founder Roadmap",
      thesisDesc: "Pre-seed £50k raise to disrupt AWS & Google in Intelligent Document Processing. Prototype ready, enterprise pilot pipeline in progress.",
      
      // Problem
      problemTitle: "Unstructured Data = £Billions in Lost Productivity",
      problemDesc: "CRM ecosystems are flooded with PDFs, scanned images, and unlabeled documents. Enterprises waste 80% of sales time on manual data entry. Existing IDP solutions are expensive, rigid, and don't natively integrate into CRMs.",
      
      // Solution
      solutionTitle: "DocRevisor Intelligence: CRM-Native IDP",
      solutionDesc: "We embed directly into Salesforce, HubSpot, and Dynamics. One click transforms a PDF attachment into structured, accessible, compliant CRM data. No exports. No middleware. No training data required.",
      
      // Competitive Edge
      competitiveTitle: "Why We Beat AWS & Google",
      competitiveDesc: "Their IDP is a horizontal feature. Ours is a CRM-native vertical solution. 10x faster implementation. 5x lower total cost of ownership. Built for Universal Design compliance from day one.",
      
      // Founder
      founderTitle: "Founder Market Fit",
      founderName: "Alexander Oluwaseun Kwesi",
      founderVisa: "Graduate Visa → Innovator Founder (2024)",
      founderLocation: "Warrington, UK • North West Tech Ecosystem",
      founderExp: "Built prototype solo. Closed 3 pre-pilot enterprise discussions. SEIS Advance Assurance in progress.",
      
      // Use of Funds
      fundsTitle: "£50,000 Use of Funds",
      fundsDev: "Product Development (MVP to Beta)",
      fundsDevPercent: "60%",
      fundsSales: "Enterprise Pilots & Sales Dev",
      fundsSalesPercent: "25%",
      fundsLegal: "SEIS / Legal / Compliance",
      fundsLegalPercent: "10%",
      fundsOps: "Operations & Infrastructure",
      fundsOpsPercent: "5%",
      
      // Footer
      contact: "seankwesi24@googlemaail.com",
      phone: "+44 7342 2622033",
      location: "Warrington, UK • Available in Manchester",
      copyright: "© 2024 Revise Tech. All rights reserved. SEIS application in progress.",
    },
    de: {
      tagline: "SEIS-Investitionsmöglichkeit: Pre-Seed (£50k)",
      valueProp: "Intelligente Dokumentenverarbeitung für CRM-Ökosysteme",
      founderTag: "Gründer: Alexander Oluwaseun Kwesi | Graduate Visa → Innovator Founder",
      tryNow: "Pitch Deck anfordern",
      getStarted: "Finanzprognosen anzeigen",
      trustedBy: "Warrington Tech Ökosystem • North West Startup Pipeline",
      
      arrMetric: "£72k",
      arrLabel: "Jahr 1 ARR (prognostiziert)",
      usersMetric: "5.000+",
      usersLabel: "Nutzer in 24 Monaten",
      accuracyMetric: "99,8%",
      accuracyLabel: "KI-Genauigkeit",
      tamMetric: "£40B+",
      tamLabel: "Globaler TAM",
      
      thesisTitle: "SEIS-ready • Graduate Visa • Innovator Founder Roadmap",
      thesisDesc: "Pre-Seed-Kapitalaufnahme von £50k zur Disruption von AWS & Google bei intelligenter Dokumentenverarbeitung. Prototyp fertig, Enterprise-Pilot-Pipeline in Arbeit.",
      
      problemTitle: "Unstrukturierte Daten = £Milliarden an Produktivitätsverlust",
      problemDesc: "CRM-Ökosysteme sind überflutet mit PDFs, gescannten Bildern und unbeschrifteten Dokumenten. Unternehmen verschwenden 80% der Vertriebszeit mit manueller Dateneingabe. Existierende IDP-Lösungen sind teuer, starr und nicht nativ in CRMs integriert.",
      
      solutionTitle: "DocRevisor Intelligence: CRM-natives IDP",
      solutionDesc: "Wir integrieren direkt in Salesforce, HubSpot und Dynamics. Ein Klick verwandelt einen PDF-Anhang in strukturierte, zugängliche, konforme CRM-Daten. Kein Export. Keine Middleware. Keine Trainingsdaten erforderlich.",
      
      competitiveTitle: "Warum wir AWS & Google schlagen",
      competitiveDesc: "Ihr IDP ist ein horizontales Feature. Unseres ist eine CRM-native vertikale Lösung. 10x schnellere Implementierung. 5x niedrigere Gesamtbetriebskosten. Von Anfang an für Universal Design Compliance entwickelt.",
      
      founderTitle: "Gründer-Markt-Passung",
      founderName: "Alexander Oluwaseun Kwesi",
      founderVisa: "Graduate Visa → Innovator Founder (2024)",
      founderLocation: "Warrington, UK • North West Tech Ökosystem",
      founderExp: "Prototyp allein entwickelt. 3 Pre-Pilot-Enterprise-Gespräche geführt. SEIS Advance Assurance in Bearbeitung.",
      
      fundsTitle: "Verwendung der £50.000",
      fundsDev: "Produktentwicklung (MVP zu Beta)",
      fundsDevPercent: "60%",
      fundsSales: "Enterprise Piloten & Vertriebsentwicklung",
      fundsSalesPercent: "25%",
      fundsLegal: "SEIS / Recht / Compliance",
      fundsLegalPercent: "10%",
      fundsOps: "Betrieb & Infrastruktur",
      fundsOpsPercent: "5%",
      
      contact: "seankwesi24@googlemaail.com",
      phone: "+44 7342 2622033",
      location: "Warrington, UK • Verfügbar in Manchester",
      copyright: "© 2024 Revise Tech. Alle Rechte vorbehalten. SEIS-Antrag in Bearbeitung.",
    },
  };

  const t = translations[language] || translations.en;

  const login = () => {
    window.location.href = "/signup";
  };

  const requestDeck = () => {
    window.location.href = "/deck";
  };

  const viewFinancials = () => {
    window.location.href = "/projections";
  };

  // SEIS Metrics for Investors
  const seisMetrics = [
    {
      metric: t.arrMetric,
      label: t.arrLabel,
      description: "Year 1 projection, post-MVP",
      icon: <MonetizationOn sx={{ color: "#4caf50" }} />,
    },
    {
      metric: t.usersMetric,
      label: t.usersLabel,
      description: "Organic growth + enterprise pilots",
      icon: <Group sx={{ color: "#2196f3" }} />,
    },
    {
      metric: t.accuracyMetric,
      label: t.accuracyLabel,
      description: "On proprietary document types",
      icon: <Science sx={{ color: "#ff9800" }} />,
    },
    {
      metric: t.tamMetric,
      label: t.tamLabel,
      description: "IDP + CRM integration layer",
      icon: <AccountTree sx={{ color: "#9c27b0" }} />,
    },
  ];

  // Use of Funds allocation
  const fundAllocation = [
    { name: t.fundsDev, percent: 60, color: "#6a0dad" },
    { name: t.fundsSales, percent: 25, color: "#2e7d32" },
    { name: t.fundsLegal, percent: 10, color: "#1565c0" },
    { name: t.fundsOps, percent: 5, color: "#ed6c02" },
  ];

  // Competitive advantages
  const competitiveAdvantages = [
    {
      title: "CRM-Native Architecture",
      desc: "Not a bolt-on. We live inside Salesforce, HubSpot, Dynamics.",
      icon: <IntegrationInstructions sx={{ fontSize: 40 }} />,
    },
    {
      title: "Universal Design by Default",
      desc: "WCAG 2.1, Section 508 compliance auto-generated. No remediation step.",
      icon: <Verified sx={{ fontSize: 40 }} />,
    },
    {
      title: "Zero-Training Deployment",
      desc: "No ML engineers. No data labeling. Works out of the box.",
      icon: <Rocket sx={{ fontSize: 40 }} />,
    },
    {
      title: "5x Lower TCO",
      desc: "70% less than AWS Textract + custom integration costs.",
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
    },
  ];

  const InvestorChartSection = () => (
    <Box
      sx={{
        py: 8,
        backgroundColor: "#fafbff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Patterned Gradient Background (same styling as original) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "110%",
          transform: "translateZ(-50px) rotateY(-5deg) skewY(-2deg)",
          transformStyle: "preserve-3d",
          perspective: "1000px",
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
          clipPath: "polygon(100% -10%, 100% 110%, -10% 110%, 40% -10%)",
          zIndex: 0,
        }}
      />

      {/* ARR Growth Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          right: "55%",
          width: "35%",
          zIndex: 1,
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
            <Timeline sx={{ fontSize: 18, color: "#6a0dad", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#6a0dad" }}
            >
              ARR Trajectory (£k)
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              height: "180px",
              gap: 2,
              mb: 2,
            }}
          >
            {[0, 72, 240, 580, 1250].map((value, idx) => (
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
                  {["Y0", "Y1", "Y2", "Y3", "Y4"][idx]}
                </Typography>
                <Box
                  sx={{
                    width: "80%",
                    height: `${value / 8}px`,
                    minHeight: value > 0 ? "20px" : "4px",
                    background:
                      idx >= 1
                        ? "linear-gradient(to top, #6a0dad, #8a2be2)"
                        : "rgba(106, 13, 173, 0.2)",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                {value > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.65rem", mt: 0.5, fontWeight: "bold" }}
                  >
                    £{value}k
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", textAlign: "center" }}
          >
            £72k ARR in Year 1 • 10x growth by Year 4
          </Typography>
        </Card>
      </Box>

      {/* User Growth Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          right: "28%",
          width: "30%",
          zIndex: 1,
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
            <Group sx={{ fontSize: 18, color: "#2e7d32", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#2e7d32" }}
            >
              User Adoption
            </Typography>
          </Box>
          <Box sx={{ position: "relative", height: "100px", mb: 1 }}>
            {/* User growth line */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "10%",
                right: "10%",
                height: "2px",
                backgroundColor: "rgba(46, 125, 50, 0.2)",
                transform: "translateY(-50%)",
              }}
            />
            {[
              { month: "Launch", users: 100 },
              { month: "M6", users: 800 },
              { month: "M12", users: 2500 },
              { month: "M18", users: 5000 },
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
                    width: idx === 3 ? "14px" : "10px",
                    height: idx === 3 ? "14px" : "10px",
                    borderRadius: "50%",
                    background:
                      idx === 3
                        ? "linear-gradient(135deg, #2e7d32, #4caf50)"
                        : "rgba(46, 125, 50, 0.6)",
                    border: idx === 3 ? "2px solid white" : "none",
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.65rem", fontWeight: idx === 3 ? "bold" : "normal" }}
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
                  {point.users.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", textAlign: "center" }}
          >
            5,000+ users within 24 months of launch
          </Typography>
        </Card>
      </Box>

      {/* Fund Allocation Chart */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          bottom: "5%",
          right: "5%",
          width: "35%",
          zIndex: 1,
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <BusinessCenter sx={{ fontSize: 18, color: "#1565c0", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#1565c0" }}
            >
              Use of Funds: £50,000
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            {fundAllocation.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: "medium" }}>
                    {item.name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, mx: 2 }}>
                  <Box
                    sx={{
                      height: "8px",
                      width: "100%",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {item.percent}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", textAlign: "center" }}
          >
            18-month runway • Beta launch in Q3 2024
          </Typography>
        </Card>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, top: "-100px" }}
      >
        {/* This container maintains layout consistency */}
      </Container>
    </Box>
  );

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Header - Matches original styling */}
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
                  SEIS • Pre-Seed • £50k
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[
                ["Deck", "/deck"],
                ["Financials", "/financials"],
                ["SEIS", "/seis"],
                ["Visa Roadmap", "/visa"],
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
              Founder Login
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section - SEIS Focused */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
            <Chip
              label="SEIS Advance Assurance in Progress"
              color="primary"
              sx={{ mb: 3, fontWeight: "bold", backgroundColor: "#6a0dad", color: "white" }}
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
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.2,
              }}
            >
              {t.valueProp}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#444",
                mb: 2,
                lineHeight: 1.5,
                fontWeight: "500",
              }}
            >
              {t.tagline}
            </Typography>
            
            <Typography
              variant="subtitle1"
              sx={{
                color: "#666",
                mb: 4,
                fontStyle: "italic",
                borderTop: "1px solid #e0e0e0",
                borderBottom: "1px solid #e0e0e0",
                py: 2,
                display: "inline-block",
                px: 3,
              }}
            >
              {t.founderTag}
            </Typography>

            {/* SEIS Metrics */}
            <Grid container spacing={3} sx={{ mb: 6, mt: 2 }}>
              {seisMetrics.map((metric, index) => (
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
                onClick={requestDeck}
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
                onClick={viewFinancials}
              >
                {t.getStarted}
              </Button>
            </Stack>
            
            <Typography
              variant="body2"
              sx={{ color: "#888", mt: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
            >
              <LocationOn sx={{ fontSize: 16 }} /> {t.trustedBy}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Problem & Solution Section */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  height: "100%",
                  background: "linear-gradient(135deg, #fff9f9 0%, #fff0f0 100%)",
                  border: "1px solid rgba(244, 67, 54, 0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      borderRadius: "12px",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Flag sx={{ fontSize: 36, color: "#d32f2f" }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {t.problemTitle}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#555", fontSize: "1.1rem", lineHeight: 1.7 }}>
                  {t.problemDesc}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  height: "100%",
                  background: "linear-gradient(135deg, #f1f9f0 0%, #e6f3e5 100%)",
                  border: "1px solid rgba(46, 125, 50, 0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(46, 125, 50, 0.1)",
                      borderRadius: "12px",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Rocket sx={{ fontSize: 36, color: "#2e7d32" }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                    {t.solutionTitle}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#555", fontSize: "1.1rem", lineHeight: 1.7 }}>
                  {t.solutionDesc}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Competitive Edge */}
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
            {t.competitiveTitle}
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
            {t.competitiveDesc}
          </Typography>
          
          <Grid container spacing={4}>
            {competitiveAdvantages.map((advantage, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 40px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "#6a0dad",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {advantage.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {advantage.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {advantage.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Charts Section Title */}
      <Box
        sx={{
          mx: 4,
          mt: 4,
          mb: 0,
          backgroundColor: "#fafbff",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#170723",
            mx: 2,
            pt: 4,
          }}
        >
          Financial Projections & Fund Allocation
        </Typography>
        <hr />
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "16px",
            fontWeight: "light",
            color: "#170723",
            mx: 2,
            pb: 2,
          }}
        >
          £72k ARR in Year 1 • £50k pre-seed use of funds • 5,000+ users by M24
        </Typography>
      </Box>

      {/* Investor Charts */}
      <InvestorChartSection />

      {/* Founder Section */}
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
              <EmojiPeople sx={{ fontSize: 300 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
              {t.founderTitle}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#b39ddb" }}>
                  {t.founderName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <School sx={{ mr: 1, color: "#9c27b0" }} />
                  <Typography variant="body1">{t.founderVisa}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: "#f44336" }} />
                  <Typography variant="body1">{t.founderLocation}</Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic", opacity: 0.9 }}>
                  "{t.founderExp}"
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    p: 4,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#e1bee7" }}>
                    Innovator Founder Roadmap
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Verified sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary="Graduate Visa (Current)" secondary="Full working rights until 2026" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Timeline sx={{ color: "#ff9800" }} />
                      </ListItemIcon>
                      <ListItemText primary="SEIS Advance Assurance (Q2 2024)" secondary="Application in progress" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Rocket sx={{ color: "#2196f3" }} />
                      </ListItemIcon>
                      <ListItemText primary="Innovator Founder Endorsement (Q3 2024)" secondary="Clear pathway to settlement" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessCenter sx={{ color: "#9c27b0" }} />
                      </ListItemIcon>
                      <ListItemText primary="Long-term commitment" secondary="North West tech ecosystem" />
                    </ListItem>
                  </List>
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
              Ready to discuss the SEIS round?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              10-minute intro call • Coffee in Warrington/Manchester
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
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
                onClick={requestDeck}
                endIcon={<ArrowForward />}
              >
                Request Deck
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                onClick={() => window.location.href = "/coffee-meetup"}
              >
                Contact Founder
              </Button>
            </Stack>
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
                Intelligent Document Processing for CRM ecosystems. 
                SEIS-ready. Prototype complete. Enterprise pilots in discussion.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Contact Founder
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 {t.contact}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📞 {t.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                🔗 linkedin.com/in/alexanderoluwaseunkwesi
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mt: 2 }}>
                {t.location}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                SEIS / Region
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
                <option value="en">English (UK)</option>
                <option value="de">Deutsch</option>
              </select>
              <Typography variant="body2" sx={{ color: "#ccc", mt: 2 }}>
                SEIS Advance Assurance in progress • Graduate Visa • Innovator Founder pipeline
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
              Warrington, UK • Available for coffee in Manchester • £50k pre-seed SEIS round
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default InvestorSEISPage;