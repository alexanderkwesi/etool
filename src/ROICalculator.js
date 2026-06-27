import React, { useState } from "react";
import "./ROICalculator.css";
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
  Slider,
  TextField,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
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
  Calculate,
  Savings,
  Speed,
  CheckCircle,
} from "@mui/icons-material";

const ROICalculator = () => {
  const [language, setLanguage] = useState("en");
  const [industry, setIndustry] = useState("financial");
  const [documentsPerMonth, setDocumentsPerMonth] = useState(50000);
  const [employeeCost, setEmployeeCost] = useState(45000);
  const [processingTime, setProcessingTime] = useState(15);
  const [complianceCost, setComplianceCost] = useState(100000);
  const [errorRate, setErrorRate] = useState(8);
  const [showResults, setShowResults] = useState(false);

  const translations = {
    en: {
      pageTitle: "Enterprise ROI Calculator",
      pageSubtitle: "Quantify Your Document Processing Savings",
      heroTitle: "Calculate Your Enterprise Savings",
      heroDesc:
        "See how much your organization can save by implementing DocRevisor's AI-powered document intelligence platform.",
      ctaButton: "Calculate Your ROI",
      selectIndustry: "Select Your Industry",
      documentVolume: "Monthly Document Volume",
      employeeCost: "Average Annual Employee Cost",
      processingTime: "Average Processing Time per Document (minutes)",
      complianceCost: "Annual Compliance & Audit Costs",
      errorRate: "Current Error/Exception Rate (%)",
      calculate: "Calculate ROI",
      reset: "Reset",
      results: "Your Enterprise ROI Projection",
      annualSavings: "Annual Savings",
      roiPercentage: "ROI Percentage",
      paybackPeriod: "Payback Period",
      efficiencyGain: "Efficiency Gain",
      manual: "Manual Processing",
      automated: "With DocRevisor",
      downloadReport: "Download ROI Report",
      scheduleDemo: "Schedule Enterprise Demo",
    },
    de: {
      pageTitle: "Enterprise-ROI-Rechner",
      pageSubtitle: "Quantifizieren Sie Ihre Dokumenteneinsparungen",
      heroTitle: "Berechnen Sie Ihre Unternehmenseinsparungen",
      heroDesc:
        "Sehen Sie, wie viel Ihr Unternehmen durch die Implementierung der KI-gestützten Dokumentenintelligenz-Plattform von DocRevisor sparen kann.",
      ctaButton: "ROI berechnen",
      selectIndustry: "Wählen Sie Ihre Branche",
      documentVolume: "Monatliches Dokumentenvolumen",
      employeeCost: "Durchschnittliche jährliche Personalkosten",
      processingTime:
        "Durchschnittliche Bearbeitungszeit pro Dokument (Minuten)",
      complianceCost: "Jährliche Compliance- & Prüfungskosten",
      errorRate: "Aktuelle Fehler-/Ausnahmerate (%)",
      calculate: "ROI berechnen",
      reset: "Zurücksetzen",
      results: "Ihre Enterprise-ROI-Prognose",
      annualSavings: "Jährliche Einsparungen",
      roiPercentage: "ROI-Prozentsatz",
      paybackPeriod: "Amortisationszeit",
      efficiencyGain: "Effizienzgewinn",
      manual: "Manuelle Verarbeitung",
      automated: "Mit DocRevisor",
      downloadReport: "ROI-Bericht herunterladen",
      scheduleDemo: "Unternehmensdemo planen",
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

  // Industry benchmarks
  const industryBenchmarks = {
    financial: {
      name: "Financial Services",
      color: "#1565c0",
      automationRate: 0.85,
      accuracyImprovement: 0.95,
      complianceReduction: 0.75,
    },
    healthcare: {
      name: "Healthcare",
      color: "#2e7d32",
      automationRate: 0.8,
      accuracyImprovement: 0.9,
      complianceReduction: 0.7,
    },
    legal: {
      name: "Legal",
      color: "#6a0dad",
      automationRate: 0.75,
      accuracyImprovement: 0.85,
      complianceReduction: 0.8,
    },
    insurance: {
      name: "Insurance",
      color: "#c62828",
      automationRate: 0.82,
      accuracyImprovement: 0.92,
      complianceReduction: 0.78,
    },
    manufacturing: {
      name: "Manufacturing",
      color: "#ed6c02",
      automationRate: 0.78,
      accuracyImprovement: 0.88,
      complianceReduction: 0.72,
    },
  };

  const currentBenchmark =
    industryBenchmarks[industry] || industryBenchmarks.financial;

  // Calculate ROI
  const calculateROI = () => {
    const benchmark = currentBenchmark;

    // Manual processing costs
    const documentsPerYear = documentsPerMonth * 12;
    const hoursPerDocument = processingTime / 60;
    const employeeHourlyRate = employeeCost / 2080; // 2080 working hours per year
    const manualProcessingCost =
      documentsPerYear * hoursPerDocument * employeeHourlyRate;

    // Error costs
    const errorCostPerDocument = 25; // Average cost to fix an error
    const annualErrorCost =
      documentsPerYear * (errorRate / 100) * errorCostPerDocument;

    // Total manual cost
    const totalManualCost =
      manualProcessingCost + annualErrorCost + complianceCost;

    // Automated processing with DocRevisor
    const automationSavings = manualProcessingCost * benchmark.automationRate;
    const errorReduction = annualErrorCost * benchmark.accuracyImprovement;
    const complianceSavings = complianceCost * benchmark.complianceReduction;

    // Platform cost (estimated)
    const platformCost = documentsPerMonth * 0.15 * 12; // $0.15 per document

    // Total savings
    const totalSavings = automationSavings + errorReduction + complianceSavings;
    const netAnnualSavings = totalSavings - platformCost;
    const roiPercentage = (netAnnualSavings / platformCost) * 100;
    const paybackMonths = (platformCost / netAnnualSavings) * 12;

    return {
      manualCost: totalManualCost,
      automatedCost: platformCost,
      netSavings: netAnnualSavings,
      roi: roiPercentage,
      payback: paybackMonths,
      efficiency: benchmark.automationRate * 100,
    };
  };

  const roiResults = calculateROI();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatMonths = (months) => {
    if (months < 1) {
      return `${(months * 30).toFixed(0)} days`;
    }
    return `${months.toFixed(1)} months`;
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
                    color: item[0] === "ROI Calculator" ? "#6a0dad" : "#333",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    borderBottom:
                      item[0] === "ROI Calculator"
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
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 8, md: 10 },
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
          <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
            <Chip
              label="Enterprise ROI Calculator"
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
          </Box>
        </Container>
      </Box>

      {/* Calculator Section */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            {/* Input Form */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Calculate sx={{ fontSize: 32, color: "#6a0dad", mr: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Input Parameters
                  </Typography>
                </Box>

                {/* Industry Selection */}
                <FormControl component="fieldset" sx={{ mb: 4, width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
                  >
                    {t.selectIndustry}
                  </FormLabel>
                  <RadioGroup
                    row
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <Grid container spacing={2}>
                      {Object.entries(industryBenchmarks).map(
                        ([key, value]) => (
                          <Grid item xs={6} md={4} key={key}>
                            <FormControlLabel
                              value={key}
                              control={
                                <Radio
                                  sx={{
                                    color: value.color,
                                    "&.Mui-checked": { color: value.color },
                                  }}
                                />
                              }
                              label={value.name}
                              sx={{
                                width: "100%",
                                m: 0,
                                p: 1,
                                borderRadius: "8px",
                                backgroundColor:
                                  industry === key
                                    ? `${value.color}10`
                                    : "transparent",
                              }}
                            />
                          </Grid>
                        ),
                      )}
                    </Grid>
                  </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 3 }} />

                {/* Document Volume */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {t.documentVolume}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {documentsPerMonth.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={documentsPerMonth}
                    onChange={(e, val) => setDocumentsPerMonth(val)}
                    min={1000}
                    max={500000}
                    step={1000}
                    sx={{
                      color: currentBenchmark.color,
                      "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      1K
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      500K
                    </Typography>
                  </Box>
                </Box>

                {/* Employee Cost */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {t.employeeCost}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {formatCurrency(employeeCost)}
                    </Typography>
                  </Box>
                  <Slider
                    value={employeeCost}
                    onChange={(e, val) => setEmployeeCost(val)}
                    min={30000}
                    max={120000}
                    step={5000}
                    sx={{
                      color: currentBenchmark.color,
                      "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      $30K
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      $120K
                    </Typography>
                  </Box>
                </Box>

                {/* Processing Time */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {t.processingTime}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {processingTime} min
                    </Typography>
                  </Box>
                  <Slider
                    value={processingTime}
                    onChange={(e, val) => setProcessingTime(val)}
                    min={5}
                    max={60}
                    step={1}
                    sx={{
                      color: currentBenchmark.color,
                      "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      5 min
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      60 min
                    </Typography>
                  </Box>
                </Box>

                {/* Compliance Cost */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {t.complianceCost}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {formatCurrency(complianceCost)}
                    </Typography>
                  </Box>
                  <Slider
                    value={complianceCost}
                    onChange={(e, val) => setComplianceCost(val)}
                    min={25000}
                    max={500000}
                    step={5000}
                    sx={{
                      color: currentBenchmark.color,
                      "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      $25K
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      $500K
                    </Typography>
                  </Box>
                </Box>

                {/* Error Rate */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      {t.errorRate}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {errorRate}%
                    </Typography>
                  </Box>
                  <Slider
                    value={errorRate}
                    onChange={(e, val) => setErrorRate(val)}
                    min={1}
                    max={25}
                    step={1}
                    sx={{
                      color: currentBenchmark.color,
                      "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      1%
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      25%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                      borderRadius: "25px",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                      boxShadow: "0 4px 20px rgba(106, 13, 173, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #5a0cad, #7a2ad2)",
                        boxShadow: "0 6px 25px rgba(106, 13, 173, 0.4)",
                      },
                    }}
                    onClick={() => setShowResults(true)}
                    endIcon={<Calculate />}
                  >
                    {t.calculate}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      border: "2px solid #6a0dad",
                      borderRadius: "25px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                      color: "#6a0dad",
                      "&:hover": {
                        border: "2px solid #5a0cad",
                        backgroundColor: "rgba(106, 13, 173, 0.04)",
                      },
                    }}
                    onClick={() => {
                      setDocumentsPerMonth(50000);
                      setEmployeeCost(45000);
                      setProcessingTime(15);
                      setComplianceCost(100000);
                      setErrorRate(8);
                      setShowResults(false);
                    }}
                  >
                    {t.reset}
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} md={6}>
              {showResults ? (
                <Card
                  sx={{
                    p: 4,
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${currentBenchmark.color}08, white)`,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    border: `1px solid ${currentBenchmark.color}30`,
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <MonetizationOn
                      sx={{
                        fontSize: 32,
                        color: currentBenchmark.color,
                        mr: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: currentBenchmark.color }}
                    >
                      {t.results}
                    </Typography>
                  </Box>

                  {/* Key Metrics */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: `${currentBenchmark.color}08`,
                          borderRadius: "16px",
                          height: "100%",
                        }}
                      >
                        <Savings
                          sx={{
                            fontSize: 40,
                            color: currentBenchmark.color,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: currentBenchmark.color,
                          }}
                        >
                          {formatCurrency(roiResults.netSavings)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.annualSavings}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: `${currentBenchmark.color}08`,
                          borderRadius: "16px",
                          height: "100%",
                        }}
                      >
                        <TrendingUp
                          sx={{
                            fontSize: 40,
                            color: currentBenchmark.color,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: currentBenchmark.color,
                          }}
                        >
                          {formatPercent(roiResults.roi)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.roiPercentage}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: `${currentBenchmark.color}08`,
                          borderRadius: "16px",
                          height: "100%",
                        }}
                      >
                        <History
                          sx={{
                            fontSize: 40,
                            color: currentBenchmark.color,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: currentBenchmark.color,
                          }}
                        >
                          {formatMonths(roiResults.payback)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.paybackPeriod}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: `${currentBenchmark.color}08`,
                          borderRadius: "16px",
                          height: "100%",
                        }}
                      >
                        <Speed
                          sx={{
                            fontSize: 40,
                            color: currentBenchmark.color,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: currentBenchmark.color,
                          }}
                        >
                          {formatPercent(roiResults.efficiency)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.efficiencyGain}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Cost Comparison */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: currentBenchmark.color,
                      }}
                    >
                      Cost Comparison
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.manual}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {t.automated}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: "40px",
                          backgroundColor: "#f4433610",
                          borderRadius: "20px 0 0 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #f4433630",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#f44336" }}
                        >
                          {formatCurrency(roiResults.manualCost)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          height: "40px",
                          backgroundColor: `${currentBenchmark.color}10`,
                          borderRadius: "0 20px 20px 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${currentBenchmark.color}30`,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: currentBenchmark.color,
                          }}
                        >
                          {formatCurrency(roiResults.automatedCost)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* CTA Buttons */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                        borderRadius: "25px",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "600",
                        textTransform: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #5a0cad, #7a2ad2)",
                        },
                      }}
                      endIcon={<Download />}
                    >
                      {t.downloadReport}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      sx={{
                        border: "2px solid #6a0dad",
                        borderRadius: "25px",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "600",
                        textTransform: "none",
                        color: "#6a0dad",
                        "&:hover": {
                          border: "2px solid #5a0cad",
                          backgroundColor: "rgba(106, 13, 173, 0.04)",
                        },
                      }}
                      endIcon={<ArrowForward />}
                      onClick={() => (window.location.href = "/solutions")}
                    >
                      {t.scheduleDemo}
                    </Button>
                  </Box>

                  {/* Industry Benchmark Note */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      display: "block",
                      textAlign: "center",
                      mt: 3,
                    }}
                  >
                    *Based on {currentBenchmark.name} industry benchmarks and
                    historical customer data
                  </Typography>
                </Card>
              ) : (
                <Card
                  sx={{
                    p: 4,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #f8f9ff, white)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    border: "1px dashed #6a0dad",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "500px",
                  }}
                >
                  <Calculate sx={{ fontSize: 80, color: "#6a0dad20", mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#666", textAlign: "center", mb: 1 }}
                  >
                    Enter your parameters and click Calculate
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#999", textAlign: "center" }}
                  >
                    See your personalized enterprise ROI projection
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>
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
                Enterprise Support
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                📧 enterprise@docrevisor.info
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

export default ROICalculator;
