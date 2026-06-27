import React, { useState } from "react";
import "./Investment.css";
import Logo from "./image/favicon-png.png";
import {
  Button,
  Card,
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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Group,
  TrendingUp,
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
  AccountBalance,
  Assessment,
  People,
  Speed,
  Timeline,
  PieChart,
  ShowChart,
  AttachMoney,
  Star,
  EmojiEvents,
  DocumentScanner,
  CheckCircle, // ✅ Added missing CheckCircle import
  Dns, // ✅ Added missing Dns import
} from "@mui/icons-material";

const InvestorRelations = () => {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      pageTitle: "Investor Relations",
      pageSubtitle: "Market Leadership in Document Intelligence",
      heroTitle: "Investing in the Future of Document Processing",
      heroDesc:
        "DocRevisor Intelligence is disrupting the $50B document processing market through AI-powered IDP and enterprise CRM integration.",
      ctaButton: "Download Investor Deck",
      marketOpportunity: "Market Opportunity",
      financialHighlights: "Financial Highlights",
      growthMetrics: "Growth Metrics",
      competitiveAdvantage: "Competitive Advantage",
      leadershipTeam: "Leadership Team",
      investors: "Our Investors",
      contactIR: "Contact Investor Relations",
    },
    de: {
      pageTitle: "Investor Relations",
      pageSubtitle: "Marktführerschaft in Dokumentenintelligenz",
      heroTitle: "Investition in die Zukunft der Dokumentenverarbeitung",
      heroDesc:
        "DocRevisor Intelligence revolutioniert den 50-Milliarden-Dollar-Markt für Dokumentenverarbeitung durch KI-gestütztes IDP und Enterprise-CRM-Integration.",
      ctaButton: "Investorenpräsentation herunterladen",
      marketOpportunity: "Marktchance",
      financialHighlights: "Finanzielle Höhepunkte",
      growthMetrics: "Wachstumskennzahlen",
      competitiveAdvantage: "Wettbewerbsvorteil",
      leadershipTeam: "Führungsteam",
      investors: "Unsere Investoren",
      contactIR: "Kontakt Investor Relations",
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

  // Market Data
  const marketData = {
    tam: "$50B",
    sam: "$18B",
    som: "$4.5B",
    cagr: "23.5%",
    competitors: 12,
    marketShare: "3.2%",
  };

  // Financial Projections
  const financialProjections = [
    {
      year: "2023",
      revenue: "$8.2M",
      growth: "+145%",
      margin: "68%",
      customers: 47,
    },
    {
      year: "2024",
      revenue: "$18.5M",
      growth: "+126%",
      margin: "72%",
      customers: 89,
    },
    {
      year: "2025",
      revenue: "$42.3M",
      growth: "+129%",
      margin: "75%",
      customers: 165,
    },
    {
      year: "2026",
      revenue: "$95.8M",
      growth: "+126%",
      margin: "78%",
      customers: 312,
    },
  ];

  // Growth Metrics
  const growthMetrics = [
    {
      metric: "Annual Recurring Revenue",
      value: "$18.5M",
      change: "+126%",
      icon: <AttachMoney sx={{ color: "#4caf50" }} />,
    },
    {
      metric: "Enterprise Customers",
      value: "89",
      change: "+89%",
      icon: <BusinessCenter sx={{ color: "#2196f3" }} />,
    },
    {
      metric: "Net Revenue Retention",
      value: "135%",
      change: "+15pts",
      icon: <TrendingUp sx={{ color: "#ff9800" }} />,
    },
    {
      metric: "Documents Processed",
      value: "125M",
      change: "+212%",
      icon: <DocumentScanner sx={{ color: "#9c27b0" }} />,
    },
  ];

  // Competitive Advantages
  const competitiveAdvantages = [
    {
      title: "Proprietary AI Technology",
      description: "15+ patents pending in document understanding and NLP",
      icon: <Science />,
      color: "#6a0dad",
    },
    {
      title: "Enterprise-Grade Security",
      description:
        "SOC 2 Type II, HIPAA, GDPR compliant with zero-trust architecture",
      icon: <Shield />,
      color: "#2e7d32",
    },
    {
      title: "CRM Integration Leadership",
      description:
        "Deep integrations with Salesforce, HubSpot, and Microsoft Dynamics",
      icon: <IntegrationInstructions />,
      color: "#1565c0",
    },
    {
      title: "Proven Enterprise ROI",
      description:
        "80% cost reduction, 90% faster compliance, 40% productivity gain",
      icon: <MonetizationOn />,
      color: "#ed6c02",
    },
    {
      title: "Scalable Infrastructure",
      description: "Processes 1M+ documents daily with 99.99% uptime",
      icon: <Dns />,
      color: "#c62828",
    },
    {
      title: "Strategic Partnerships",
      description: "Premier partnerships with AWS, Microsoft, and Salesforce",
      icon: <Group />,
      color: "#0284c7",
    },
  ];

  // Leadership Team
  const leadershipTeam = [
    {
      name: "Sarah Chen",
      title: "Chief Executive Officer",
      background:
        "Former SVP of Product at Adobe, 20+ years in enterprise software",
      education: "MBA, Stanford University",
      color: "#6a0dad",
    },
    {
      name: "Michael Rodriguez",
      title: "Chief Technology Officer",
      background: "Ex-Google AI Research, led document understanding teams",
      education: "PhD in Computer Science, MIT",
      color: "#2e7d32",
    },
    {
      name: "David Thompson",
      title: "Chief Revenue Officer",
      background: "Scaled 3 enterprise SaaS companies to $100M+ ARR",
      education: "MBA, Harvard Business School",
      color: "#1565c0",
    },
    {
      name: "Dr. Emily Watson",
      title: "Chief AI Officer",
      background: "15 years in NLP research, published 30+ papers",
      education: "PhD in AI, Carnegie Mellon",
      color: "#ed6c02",
    },
  ];

  // Investors
  const investors = [
    {
      name: "Sequoia Capital",
      stage: "Series A Lead",
      investment: "$15M",
      expertise: "Enterprise SaaS",
    },
    {
      name: "Accel Partners",
      stage: "Series B Lead",
      investment: "$35M",
      expertise: "AI/ML Companies",
    },
    {
      name: "Index Ventures",
      stage: "Series A Participant",
      investment: "$10M",
      expertise: "B2B Software",
    },
    {
      name: "Andreessen Horowitz",
      stage: "Series B Participant",
      investment: "$20M",
      expertise: "AI Infrastructure",
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
                    color:
                      item[0] === "Investor Relations" ? "#6a0dad" : "#333",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    borderBottom:
                      item[0] === "Investor Relations"
                        ? "2px solid #6a0dad"
                        : "none",
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
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: `
              radial-gradient(circle at 80% 50%, 
                rgba(106, 13, 173, 0.2) 0%, 
                rgba(138, 43, 226, 0.1) 30%,
                transparent 70%
              )
            `,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Series B Funded • $50M Raised"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color: "white",
                  fontSize: { xs: "2.5rem", md: "3.2rem" },
                  lineHeight: 1.2,
                }}
              >
                {t.heroTitle}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.8)",
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
                    backgroundColor: "white",
                    color: "#6a0dad",
                    borderRadius: "25px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  endIcon={<Download />}
                >
                  {t.ctaButton}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    border: "2px solid white",
                    borderRadius: "25px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    textTransform: "none",
                    color: "white",
                    "&:hover": {
                      border: "2px solid rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  endIcon={<ContactMail />}
                >
                  {t.contactIR}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
                >
                  Key Investment Highlights
                </Typography>
                <List dense>
                  {[
                    "$50B Total Addressable Market",
                    "135% Net Revenue Retention",
                    "89 Enterprise Customers",
                    "126% YoY Revenue Growth",
                    "15+ Patents Pending",
                    "Premier Partnerships: AWS, MSFT, Salesforce",
                  ].map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.8 }}>
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        <CheckCircle sx={{ fontSize: 18, color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: "500",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Market Opportunity */}
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
            {t.marketOpportunity}
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
            Large and growing market with significant share opportunity
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 4, color: "#6a0dad" }}
                >
                  Document Intelligence Market Growth
                </Typography>

                {/* Market Size Chart */}
                <Box sx={{ position: "relative", height: "200px", mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "150px",
                      gap: 4,
                    }}
                  >
                    {[
                      { label: "2023", value: 32, color: "#6a0dad60" },
                      { label: "2024", value: 40, color: "#6a0dad80" },
                      { label: "2025", value: 50, color: "#6a0dad" },
                      { label: "2026", value: 62, color: "#6a0dad" },
                      { label: "2027", value: 78, color: "#8a2be2" },
                      { label: "2028", value: 95, color: "#8a2be2" },
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "80%",
                            height: `${item.value}px`,
                            background: `linear-gradient(to top, ${item.color}, ${item.color}cc)`,
                            borderRadius: "8px 8px 0 0",
                            transition: "height 0.3s ease",
                            position: "relative",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              top: -20,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontWeight: "bold",
                              color: item.label === "2025" ? "#6a0dad" : "#666",
                            }}
                          >
                            ${item.value}B
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontWeight: "500" }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#6a0dad" }}
                      >
                        {marketData.tam}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        TAM
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        Total Addressable Market
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#6a0dad" }}
                      >
                        {marketData.sam}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        SAM
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        Serviceable Available
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#6a0dad" }}
                      >
                        {marketData.som}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        SOM
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        Serviceable Obtainable
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: "#f8f9ff",
                    borderRadius: "16px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    <strong>Market CAGR:</strong> {marketData.cagr} •
                    <strong> Key Drivers:</strong> Digital transformation,
                    regulatory compliance, AI adoption
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)",
                  color: "white",
                  height: "100%",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                  Competitive Landscape
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Market Share
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {marketData.marketShare}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Current market share, growing rapidly
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    Direct Competitors
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {marketData.competitors}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Established players in document AI
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  <strong>Competitive Moat:</strong> Proprietary AI, CRM
                  integrations, enterprise compliance
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Financial Highlights */}
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
            {t.financialHighlights}
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
            Strong financial performance with accelerating growth
          </Typography>

          {/* Growth Metrics */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {growthMetrics.map((metric, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 50px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${metric.icon.props.sx.color}15`,
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontWeight: "500" }}
                    >
                      {metric.metric}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Chip
                    label={metric.change}
                    size="small"
                    sx={{
                      backgroundColor: `${metric.icon.props.sx.color}15`,
                      color: metric.icon.props.sx.color,
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Financial Projections Table */}
          <Card
            sx={{
              p: 4,
              borderRadius: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 3, color: "#6a0dad" }}
            >
              Financial Projections
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8f9ff" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      YoY Growth
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Gross Margin
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Enterprise Customers
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialProjections.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.year}
                      </TableCell>
                      <TableCell>{row.revenue}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.growth}
                          size="small"
                          sx={{
                            backgroundColor: "#4caf5015",
                            color: "#4caf50",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.margin}</TableCell>
                      <TableCell>{row.customers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>

      {/* Competitive Advantage */}
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
            {t.competitiveAdvantage}
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
            Sustainable competitive advantages that create lasting value
          </Typography>

          <Grid container spacing={4}>
            {competitiveAdvantages.map((advantage, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: `1px solid ${advantage.color}20`,
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 50px ${advantage.color}30`,
                      borderColor: advantage.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${advantage.color}15`,
                      borderRadius: "16px",
                      p: 2,
                      display: "inline-block",
                      mb: 3,
                    }}
                  >
                    {React.cloneElement(advantage.icon, {
                      sx: { fontSize: 40, color: advantage.color },
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: advantage.color,
                    }}
                  >
                    {advantage.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    {advantage.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Leadership Team */}
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
            {t.leadershipTeam}
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
            Experienced leadership team with deep domain expertise
          </Typography>

          <Grid container spacing={4}>
            {leadershipTeam.map((leader, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${leader.color}15`,
                      borderRadius: "16px",
                      p: 2,
                    }}
                  >
                    <People sx={{ fontSize: 40, color: leader.color }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {leader.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: leader.color, fontWeight: "600", mb: 2 }}
                    >
                      {leader.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      {leader.background}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      {leader.education}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Investors */}
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
            {t.investors}
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
            Backed by world-class investors
          </Typography>

          <Grid container spacing={4}>
            {investors.map((investor, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 50px rgba(106, 13, 173, 0.15)",
                    },
                  }}
                >
                  <AccountBalance
                    sx={{ fontSize: 48, color: "#6a0dad", mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {investor.name}
                  </Typography>
                  <Chip
                    label={investor.stage}
                    size="small"
                    sx={{
                      backgroundColor: "#6a0dad15",
                      color: "#6a0dad",
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#6a0dad", mb: 1 }}
                  >
                    {investor.investment}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {investor.expertise}
                  </Typography>
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
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderRadius: "30px",
              p: 6,
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Join Us in Building the Future
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Contact our Investor Relations team for partnership opportunities
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
                endIcon={<Download />}
              >
                Download Investor Deck
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  border: "2px solid white",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  color: "white",
                  "&:hover": {
                    border: "2px solid rgba(255,255,255,0.8)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                endIcon={<ContactMail />}
              >
                Contact IR
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
                Investor Relations
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 ir@docrevisor.info
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📞 +1 (415) 555-0123
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

export default InvestorRelations;
