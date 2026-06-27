import React, { useState } from "react";
import "./Use_HomePagae.css";
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
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  BarChart,
  ShowChart,
  PieChart,
  MonetizationOn,
  Group,
  Science,
  AccountTree,
  Timeline,
  BusinessCenter,
  CalendarToday,
  AttachMoney,
  Percent,
  Speed,
  Savings,
  ArrowUpward,
  ArrowDownward,
  Info,
  CheckCircle,
  Warning,
  Assessment,
  DateRange,
  People,
  CloudUpload,
  Store,
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
  School,
  Verified,
  Rocket,
  ArrowForward,
  Download,
  Print,
  Share,
  ExpandMore,
} from "@mui/icons-material";

const FinancialProjectionsPage = () => {
  const [language, setLanguage] = useState("en");
  const [expandedSection, setExpandedSection] = useState(null);

  const translations = {
    en: {
      pageTitle: "Financial Projections & Fund Allocation",
      pageSubtitle:
        "Detailed breakdown of £50,000 SEIS pre-seed round and 5-year financial forecast",
      lastUpdated: "Last Updated: March 2024",
      confidenceLevel: "High Confidence",

      // Executive Summary
      execSummary: "Executive Summary",
      execDesc:
        "DocRevisor Intelligence is seeking £50,000 in SEIS-qualifying pre-seed funding to complete MVP development, launch enterprise pilots, and achieve initial ARR of £72k in Year 1. With a clear path to 10x growth by Year 4 and a capital-efficient approach, this investment offers significant upside with SEIS tax benefits.",

      // Key Metrics
      keyMetrics: "Key Financial Metrics",
      preMoneyValuation: "Pre-money Valuation",
      preMoneyValue: "£750,000",
      investmentAmount: "Investment Amount",
      investmentValue: "£50,000",
      postMoneyValuation: "Post-money Valuation",
      postMoneyValue: "£800,000",
      equityOffered: "Equity Offered",
      equityValue: "6.25%",
      impliedSeisValue: "Implied SEIS Value",
      seisValue: "£41,500",

      // ARR Growth
      arrGrowth: "ARR Growth Trajectory (5-Year)",
      arrGrowthDesc:
        "Conservative projection based on enterprise pilot conversions and organic growth",
      year0: "Y0 (Current)",
      year1: "Y1 (2024)",
      year2: "Y2 (2025)",
      year3: "Y3 (2026)",
      year4: "Y4 (2027)",
      year5: "Y5 (2028)",
      arr0: "£0",
      arr1: "£72k",
      arr2: "£240k",
      arr3: "£580k",
      arr4: "£1.25M",
      arr5: "£2.8M",
      cagr: "CAGR (Y1-Y5)",
      cagrValue: "148%",

      // Revenue Breakdown
      revenueBreakdown: "Revenue Breakdown by Year",
      revenueBreakdownDesc:
        "Diversified revenue streams across pricing tiers and enterprise contracts",
      subscription: "Subscription (SaaS)",
      implementation: "Implementation & Training",
      enterprise: "Enterprise Contracts",
      premium: "Premium Features",
      total: "Total",

      // User Growth
      userGrowth: "User Adoption Forecast",
      userGrowthDesc:
        "Projected user growth across individual users and enterprise seats",
      individualUsers: "Individual Users",
      enterpriseSeats: "Enterprise Seats",
      totalUsers: "Total Users",

      // Use of Funds
      useOfFunds: "Use of Funds: £50,000",
      useOfFundsDesc:
        "Detailed allocation of pre-seed investment across key business areas",
      productDev: "Product Development (MVP to Beta)",
      productDevDesc:
        "Frontend/backend development, AI model training, testing, and deployment",
      productDevPercent: "60%",
      productDevAmount: "£30,000",
      productDevBreakdown: [
        "Senior Developer (3 months @ £4k/month) - £12,000",
        "AI/ML Engineer (2 months @ £5k/month) - £10,000",
        "Cloud Infrastructure & Hosting - £4,000",
        "Third-party APIs & Tools - £2,500",
        "Testing & QA - £1,500",
      ],

      salesDev: "Enterprise Pilots & Sales Development",
      salesDevDesc:
        "Sales enablement, pilot programs, and business development",
      salesDevPercent: "25%",
      salesDevAmount: "£12,500",
      salesDevBreakdown: [
        "Sales materials & pitch deck refinement - £1,500",
        "Pilot program incentives (3 enterprises) - £6,000",
        "CRM & sales tools - £2,000",
        "Travel & meetings (Warrington/Manchester) - £1,500",
        "Sales training & resources - £1,500",
      ],

      legalCompliance: "SEIS / Legal / Compliance",
      legalComplianceDesc:
        "Legal fees, SEIS assurance, and regulatory compliance",
      legalCompliancePercent: "10%",
      legalComplianceAmount: "£5,000",
      legalComplianceBreakdown: [
        "SEIS Advance Assurance filing - £1,500",
        "Legal fees (incorporation, IP, contracts) - £2,500",
        "Accounting & tax advisory - £1,000",
      ],

      operations: "Operations & Infrastructure",
      operationsDesc: "General operations, tools, and administrative costs",
      operationsPercent: "5%",
      operationsAmount: "£2,500",
      operationsBreakdown: [
        "Productivity tools & software - £800",
        "Website & domain - £400",
        "Banking & payment processing - £500",
        "Miscellaneous expenses - £800",
      ],

      // Monthly Burn
      monthlyBurn: "Monthly Burn Rate & Runway",
      monthlyBurnDesc: "Projected monthly expenses and runway analysis",
      avgMonthlyBurn: "Average Monthly Burn",
      avgMonthlyBurnValue: "£2,800",
      runwayMonths: "Runway (Months)",
      runwayMonthsValue: "18",
      breakEvenMonth: "Projected Break-even",
      breakEvenMonthValue: "Month 16",

      // Financial Assumptions
      financialAssumptions: "Key Financial Assumptions",
      assumptions: [
        {
          metric: "Customer Acquisition Cost (CAC)",
          value: "£450",
          note: "Based on enterprise sales cycle",
        },
        {
          metric: "Lifetime Value (LTV)",
          value: "£8,400",
          note: "Average customer lifetime 3.5 years",
        },
        {
          metric: "LTV/CAC Ratio",
          value: "18.7x",
          note: "Highly efficient unit economics",
        },
        {
          metric: "Gross Margin",
          value: "82%",
          note: "Post-scale, excluding initial dev costs",
        },
        {
          metric: "Monthly Recurring Revenue (MRR) Target",
          value: "£6,000",
          note: "By end of Year 1",
        },
        {
          metric: "Enterprise Deal Size",
          value: "£12k-25k",
          note: "Annual contracts",
        },
        {
          metric: "Sales Cycle",
          value: "3-4 months",
          note: "Enterprise pilot to paid contract",
        },
        {
          metric: "Churn Rate",
          value: "<5%",
          note: "Annual, enterprise-focused",
        },
      ],

      // Milestones
      milestones: "Fund-Linked Milestones",
      milestone1: "Q3 2024: Beta launch with 3 enterprise pilots",
      milestone2: "Q4 2024: First paid enterprise customer (£15k ARR)",
      milestone3: "Q1 2025: 10 enterprise customers (£150k ARR)",
      milestone4: "Q2 2025: Salesforce AppExchange listing",
      milestone5: "Q3 2025: Series A readiness (£500k+ ARR)",

      // Risk Factors
      riskFactors: "Risk Factors & Mitigations",
      risks: [
        {
          factor: "Enterprise sales cycle length",
          mitigation: "Pilot program with fast conversion incentives",
        },
        {
          factor: "Technical development delays",
          mitigation: "MVP already functional; agile methodology",
        },
        {
          factor: "Competition from AWS/GCP",
          mitigation: "CRM-native vertical focus; 5x lower TCO",
        },
        {
          factor: "Visa/immigration uncertainty",
          mitigation:
            "Graduate Visa until 2026; Innovator Founder pathway clear",
        },
        {
          factor: "Market adoption",
          mitigation: "Free pilot to first 3 enterprises; case studies",
        },
      ],

      // SEIS Benefits
      seisBenefits: "SEIS Investor Benefits",
      seisBenefit1: "50% Income Tax Relief on £50,000 investment",
      seisBenefit2: "Capital Gains Tax exemption on disposal",
      seisBenefit3: "Capital Gains Tax reinvestment relief",
      seisBenefit4: "Loss relief (if shares sold at a loss)",

      // CTA
      requestDeck: "Request Full Pitch Deck",
      scheduleCall: "Schedule Investor Call",
      downloadPDF: "Download PDF Summary",

      // Footer
      contact: "seankwesi24@googlemail.com",
      phone: "+44 7342 2622033",
      location: "Warrington, UK • Available in Manchester",
      copyright:
        "© 2024 Revise Tech. All rights reserved. SEIS application in progress.",
    },
    de: {
      pageTitle: "Finanzprognosen & Mittelverwendung",
      pageSubtitle:
        "Detaillierte Aufschlüsselung der £50.000 SEIS Pre-Seed-Runde und 5-Jahres-Finanzprognose",
      lastUpdated: "Letzte Aktualisierung: März 2024",
      confidenceLevel: "Hohe Vertrauenswürdigkeit",

      execSummary: "Zusammenfassung",
      execDesc:
        "DocRevisor Intelligence sucht £50.000 in SEIS-qualifizierter Pre-Seed-Finanzierung, um die MVP-Entwicklung abzuschließen, Enterprise-Piloten zu starten und im ersten Jahr einen ARR von £72k zu erreichen. Mit einem klaren Weg zu 10-fachem Wachstum bis Jahr 4 und einem kapital-effizienten Ansatz bietet diese Investition erhebliches Potenzial mit SEIS-Steuervorteilen.",

      keyMetrics: "Wichtige Finanzkennzahlen",
      preMoneyValuation: "Pre-money Bewertung",
      preMoneyValue: "£750.000",
      investmentAmount: "Investitionsbetrag",
      investmentValue: "£50.000",
      postMoneyValuation: "Post-money Bewertung",
      postMoneyValue: "£800.000",
      equityOffered: "Anteilsangebot",
      equityValue: "6,25%",
      impliedSeisValue: "Implizierter SEIS-Wert",
      seisValue: "£41.500",

      arrGrowth: "ARR-Wachstumspfad (5 Jahre)",
      arrGrowthDesc:
        "Konservative Prognose basierend auf Enterprise-Pilot-Konversionen und organischem Wachstum",
      year0: "J0 (Aktuell)",
      year1: "J1 (2024)",
      year2: "J2 (2025)",
      year3: "J3 (2026)",
      year4: "J4 (2027)",
      year5: "J5 (2028)",
      arr0: "£0",
      arr1: "£72k",
      arr2: "£240k",
      arr3: "£580k",
      arr4: "£1,25M",
      arr5: "£2,8M",
      cagr: "CAGR (J1-J5)",
      cagrValue: "148%",

      revenueBreakdown: "Umsatzaufschlüsselung nach Jahren",
      revenueBreakdownDesc:
        "Diversifizierte Einnahmequellen über Preismodelle und Unternehmensverträge",
      subscription: "Abonnement (SaaS)",
      implementation: "Implementierung & Schulung",
      enterprise: "Unternehmensverträge",
      premium: "Premium-Funktionen",
      total: "Gesamt",

      userGrowth: "Nutzerwachstumsprognose",
      userGrowthDesc:
        "Prognostiziertes Nutzerwachstum bei Einzelnutzern und Unternehmenslizenzen",
      individualUsers: "Einzelnutzer",
      enterpriseSeats: "Unternehmenslizenzen",
      totalUsers: "Gesamtnutzer",

      useOfFunds: "Mittelverwendung: £50.000",
      useOfFundsDesc:
        "Detaillierte Aufteilung der Pre-Seed-Investition auf wichtige Geschäftsbereiche",
      productDev: "Produktentwicklung (MVP zu Beta)",
      productDevDesc:
        "Frontend/Backend-Entwicklung, KI-Modell-Training, Test und Bereitstellung",
      productDevPercent: "60%",
      productDevAmount: "£30.000",
      productDevBreakdown: [
        "Senior-Entwickler (3 Monate @ £4k/Monat) - £12.000",
        "KI/ML-Ingenieur (2 Monate @ £5k/Monat) - £10.000",
        "Cloud-Infrastruktur & Hosting - £4.000",
        "Drittanbieter-APIs & Tools - £2.500",
        "Tests & Qualitätssicherung - £1.500",
      ],

      salesDev: "Enterprise-Piloten & Vertriebsentwicklung",
      salesDevDesc:
        "Vertriebsunterstützung, Pilotprogramme und Geschäftsentwicklung",
      salesDevPercent: "25%",
      salesDevAmount: "£12.500",
      salesDevBreakdown: [
        "Vertriebsmaterialien & Pitch-Deck-Verfeinerung - £1.500",
        "Pilotprogramm-Anreize (3 Unternehmen) - £6.000",
        "CRM & Vertriebstools - £2.000",
        "Reisen & Treffen (Warrington/Manchester) - £1.500",
        "Vertriebstraining & Ressourcen - £1.500",
      ],

      legalCompliance: "SEIS / Recht / Compliance",
      legalComplianceDesc:
        "Rechtsgebühren, SEIS-Zusicherung und regulatorische Compliance",
      legalCompliancePercent: "10%",
      legalComplianceAmount: "£5.000",
      legalComplianceBreakdown: [
        "SEIS Advance Assurance Einreichung - £1.500",
        "Rechtsgebühren (Gründung, IP, Verträge) - £2.500",
        "Buchhaltung & Steuerberatung - £1.000",
      ],

      operations: "Betrieb & Infrastruktur",
      operationsDesc: "Allgemeiner Betrieb, Tools und Verwaltungskosten",
      operationsPercent: "5%",
      operationsAmount: "£2.500",
      operationsBreakdown: [
        "Produktivitätstools & Software - £800",
        "Website & Domain - £400",
        "Banking & Zahlungsabwicklung - £500",
        "Sonstige Ausgaben - £800",
      ],

      monthlyBurn: "Monatliche Burn-Rate & Runway",
      monthlyBurnDesc: "Prognostizierte monatliche Ausgaben und Runway-Analyse",
      avgMonthlyBurn: "Durchschnittlicher monatlicher Burn",
      avgMonthlyBurnValue: "£2.800",
      runwayMonths: "Runway (Monate)",
      runwayMonthsValue: "18",
      breakEvenMonth: "Voraussichtlicher Break-even",
      breakEvenMonthValue: "Monat 16",

      financialAssumptions: "Wichtige finanzielle Annahmen",
      assumptions: [
        {
          metric: "Kundenakquisitionskosten (CAC)",
          value: "£450",
          note: "Basiert auf Enterprise-Vertriebszyklus",
        },
        {
          metric: "Kundenlebenszeitwert (LTV)",
          value: "£8.400",
          note: "Durchschnittliche Kundenlebensdauer 3,5 Jahre",
        },
        {
          metric: "LTV/CAC-Verhältnis",
          value: "18,7x",
          note: "Hocheffiziente Unit-Ökonomie",
        },
        {
          metric: "Bruttomarge",
          value: "82%",
          note: "Nach Skalierung, exkl. anfänglicher Entwicklungskosten",
        },
        {
          metric: "Monatlich wiederkehrende Umsätze (MRR)",
          value: "£6.000",
          note: "Bis Ende Jahr 1",
        },
        {
          metric: "Enterprise-Deal-Größe",
          value: "£12k-25k",
          note: "Jahresverträge",
        },
        {
          metric: "Vertriebszyklus",
          value: "3-4 Monate",
          note: "Enterprise-Pilot zu bezahltem Vertrag",
        },
        {
          metric: "Abwanderungsrate",
          value: "<5%",
          note: "Jährlich, enterprise-fokussiert",
        },
      ],

      milestones: "Finanzierungs-Meilensteine",
      milestone1: "Q3 2024: Beta-Start mit 3 Enterprise-Piloten",
      milestone2: "Q4 2024: Erster zahlender Enterprise-Kunde (£15k ARR)",
      milestone3: "Q1 2025: 10 Enterprise-Kunden (£150k ARR)",
      milestone4: "Q2 2025: Salesforce AppExchange-Listung",
      milestone5: "Q3 2025: Series-A-Bereitschaft (£500k+ ARR)",

      riskFactors: "Risikofaktoren & Absicherungen",
      risks: [
        {
          factor: "Länge des Enterprise-Vertriebszyklus",
          mitigation: "Pilotprogramm mit schnellen Konversionsanreizen",
        },
        {
          factor: "Technische Entwicklungsverzögerungen",
          mitigation: "MVP bereits funktionsfähig; agile Methodik",
        },
        {
          factor: "Konkurrenz durch AWS/GCP",
          mitigation: "CRM-nativer vertikaler Fokus; 5x niedrigere TCO",
        },
        {
          factor: "Visum/Einwanderungsunsicherheit",
          mitigation: "Graduate Visa bis 2026; Innovator Founder-Weg klar",
        },
        {
          factor: "Marktakzeptanz",
          mitigation: "Kostenloser Pilot für erste 3 Unternehmen; Fallstudien",
        },
      ],

      seisBenefits: "SEIS-Investorenvorteile",
      seisBenefit1: "50% Einkommensteuerermäßigung auf £50.000 Investition",
      seisBenefit2: "Befreiung von der Kapitalertragsteuer bei Veräußerung",
      seisBenefit3: "Kapitalertragsteuer-Wiederanlageerleichterung",
      seisBenefit4: "Verlustausgleich (bei Verkauf mit Verlust)",

      requestDeck: "Vollständiges Pitch Deck anfordern",
      scheduleCall: "Investorengespräch vereinbaren",
      downloadPDF: "PDF-Zusammenfassung herunterladen",

      contact: "seankwesi24@googlemail.com",
      phone: "+44 7342 2622033",
      location: "Warrington, UK • Verfügbar in Manchester",
      copyright:
        "© 2024 Revise Tech. Alle Rechte vorbehalten. SEIS-Antrag in Bearbeitung.",
    },
  };

  const t = translations[language] || translations.en;

  // ARR Growth Data
  const arrData = [
    { year: t.year0, value: 0, display: t.arr0 },
    { year: t.year1, value: 72, display: t.arr1 },
    { year: t.year2, value: 240, display: t.arr2 },
    { year: t.year3, value: 580, display: t.arr3 },
    { year: t.year4, value: 1250, display: t.arr4 },
    { year: t.year5, value: 2800, display: t.arr5 },
  ];

  // Revenue Breakdown Data
  const revenueData = [
    {
      year: "Y1",
      subscription: 45,
      implementation: 15,
      enterprise: 12,
      premium: 0,
      total: 72,
    },
    {
      year: "Y2",
      subscription: 130,
      implementation: 40,
      enterprise: 60,
      premium: 10,
      total: 240,
    },
    {
      year: "Y3",
      subscription: 280,
      implementation: 80,
      enterprise: 190,
      premium: 30,
      total: 580,
    },
    {
      year: "Y4",
      subscription: 550,
      implementation: 150,
      enterprise: 450,
      premium: 100,
      total: 1250,
    },
    {
      year: "Y5",
      subscription: 1100,
      implementation: 300,
      enterprise: 1100,
      premium: 300,
      total: 2800,
    },
  ];

  // User Growth Data
  const userData = [
    { month: "Launch", individual: 50, enterprise: 50, total: 100 },
    { month: "M6", individual: 400, enterprise: 400, total: 800 },
    { month: "M12", individual: 1200, enterprise: 1300, total: 2500 },
    { month: "M18", individual: 2200, enterprise: 2800, total: 5000 },
    { month: "M24", individual: 3500, enterprise: 5000, total: 8500 },
    { month: "M36", individual: 6000, enterprise: 12000, total: 18000 },
  ];

  // Fund allocation data
  const fundAllocation = [
    {
      name: t.productDev,
      percent: 60,
      amount: "£30,000",
      color: "#6a0dad",
      icon: <Rocket />,
    },
    {
      name: t.salesDev,
      percent: 25,
      amount: "£12,500",
      color: "#2e7d32",
      icon: <Group />,
    },
    {
      name: t.legalCompliance,
      percent: 10,
      amount: "£5,000",
      color: "#1565c0",
      icon: <Verified />,
    },
    {
      name: t.operations,
      percent: 5,
      amount: "£2,500",
      color: "#ed6c02",
      icon: <BusinessCenter />,
    },
  ];

  // Monthly burn data
  const monthlyBurnData = [
    { category: "Development", amount: 1500, percentage: 54 },
    { category: "Sales & Marketing", amount: 600, percentage: 21 },
    { category: "Infrastructure", amount: 400, percentage: 14 },
    { category: "Operations", amount: 300, percentage: 11 },
  ];

  const maxARRValue = Math.max(...arrData.map((d) => d.value));

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Header - Same as original */}
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
              <img src={Logo} alt="DocRevisor" width="50px" height="50px" />
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
                  Financial Projections • SEIS • £50k
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {[
                /* ["Use of Funds", "/funds"],
                ["Download PDF", "#"],*/
                ["Overview", "/financials"],
                ["Projections", "/projections"],
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
                  onClick={() =>
                    item[1].startsWith("/")
                      ? (window.location.href = item[1])
                      : null
                  }
                >
                  {item[0]}
                </Typography>
              ))}
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  border: "1px solid #6a0dad",
                  borderRadius: "20px",
                  color: "#6a0dad",
                  minWidth: "40px",
                  "&:hover": {
                    backgroundColor: "rgba(106, 13, 173, 0.04)",
                  },
                }}
                onClick={() => window.print()}
              >
                <Print fontSize="small" />
              </Button>
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
              >
                Investor Login
              </Button>
            </Stack>
          </Box>
        </Container>
      </header>

      {/* Page Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: 6,
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(106, 13, 173, 0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Chip
                label="SEIS Advance Assurance in Progress"
                sx={{
                  backgroundColor: "#6a0dad",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Chip
                label={t.confidenceLevel}
                icon={<CheckCircle />}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Stack>

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
                fontSize: { xs: "2.2rem", md: "3rem" },
                lineHeight: 1.2,
              }}
            >
              {t.pageTitle}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#444",
                mb: 3,
                lineHeight: 1.6,
                fontWeight: "400",
              }}
            >
              {t.pageSubtitle}
            </Typography>

            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              sx={{ color: "#666" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday fontSize="small" />
                <Typography variant="body2">{t.lastUpdated}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Assessment fontSize="small" />
                <Typography variant="body2">Confidence: High</Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Executive Summary Card */}
      <Container maxWidth="lg" sx={{ mt: -4, position: "relative", zIndex: 2 }}>
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 12px 40px rgba(106, 13, 173, 0.15)",
            border: "1px solid rgba(106, 13, 173, 0.1)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #f9f5ff 0%, #ffffff 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Assessment sx={{ fontSize: 32, color: "#6a0dad", mr: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {t.execSummary}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#555", fontSize: "1.1rem", lineHeight: 1.7, mb: 3 }}
            >
              {t.execDesc}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={6} md={2.4}>
                <Box sx={{ textAlign: "center", p: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", display: "block" }}
                  >
                    Pre-money
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    {t.preMoneyValue}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={2.4}>
                <Box sx={{ textAlign: "center", p: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", display: "block" }}
                  >
                    Investment
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    {t.investmentValue}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={2.4}>
                <Box sx={{ textAlign: "center", p: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", display: "block" }}
                  >
                    Post-money
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#1565c0" }}
                  >
                    {t.postMoneyValue}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={2.4}>
                <Box sx={{ textAlign: "center", p: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", display: "block" }}
                  >
                    Equity
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#ed6c02" }}
                  >
                    {t.equityValue}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#b8860b", display: "block" }}
                  >
                    SEIS Relief
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#b8860b" }}
                  >
                    {t.seisValue}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>

      {/* ARR Growth Chart - Enhanced */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
        <Container maxWidth="lg">
          <Card
            sx={{
              p: 4,
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(106, 13, 173, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp sx={{ fontSize: 32, color: "#6a0dad", mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {t.arrGrowth}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {t.arrGrowthDesc}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${t.cagr}: ${t.cagrValue}`}
                sx={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: "bold",
                }}
              />
            </Box>

            {/* ARR Bar Chart */}
            <Box
              sx={{
                height: "300px",
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                mb: 4,
                mt: 4,
              }}
            >
              {arrData.map((item, idx) => (
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
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: idx === 0 ? "#999" : "#333",
                    }}
                  >
                    {item.display}
                  </Typography>
                  <Tooltip title={`${item.year}: ${item.display}`} arrow>
                    <Box
                      sx={{
                        width: "70%",
                        height: `${(item.value / maxARRValue) * 220}px`,
                        minHeight: item.value > 0 ? "30px" : "10px",
                        background:
                          idx === 0
                            ? "rgba(106, 13, 173, 0.2)"
                            : "linear-gradient(to top, #6a0dad, #8a2be2)",
                        borderRadius: "8px 8px 0 0",
                        transition: "height 0.3s ease",
                        cursor: "pointer",
                        position: "relative",
                        "&:hover": {
                          opacity: 0.9,
                          boxShadow: "0 0 20px rgba(106, 13, 173, 0.4)",
                        },
                      }}
                    />
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, fontWeight: idx === 0 ? "normal" : "bold" }}
                  >
                    {item.year}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Growth Summary */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 1 }}>
                    Year 1 Target
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    £72,000
                  </Typography>
                  <Typography variant="caption">
                    Initial ARR from enterprise pilots
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 1 }}>
                    Year 3 Projection
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    £580,000
                  </Typography>
                  <Typography variant="caption">
                    8x growth from Year 1
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 1 }}>
                    Year 5 Projection
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    £2,800,000
                  </Typography>
                  <Typography variant="caption">
                    39x growth from Year 1
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* Revenue Breakdown Table */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Card sx={{ p: 4, borderRadius: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PieChart sx={{ fontSize: 32, color: "#6a0dad", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {t.revenueBreakdown}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {t.revenueBreakdownDesc}
                </Typography>
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: "12px" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>
                      <strong>Revenue Stream (£k)</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Y1</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Y2</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Y3</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Y4</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Y5</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>CAGR</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t.subscription}</TableCell>
                    <TableCell align="right">£45k</TableCell>
                    <TableCell align="right">£130k</TableCell>
                    <TableCell align="right">£280k</TableCell>
                    <TableCell align="right">£550k</TableCell>
                    <TableCell align="right">£1,100k</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      89%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t.implementation}</TableCell>
                    <TableCell align="right">£15k</TableCell>
                    <TableCell align="right">£40k</TableCell>
                    <TableCell align="right">£80k</TableCell>
                    <TableCell align="right">£150k</TableCell>
                    <TableCell align="right">£300k</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      82%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t.enterprise}</TableCell>
                    <TableCell align="right">£12k</TableCell>
                    <TableCell align="right">£60k</TableCell>
                    <TableCell align="right">£190k</TableCell>
                    <TableCell align="right">£450k</TableCell>
                    <TableCell align="right">£1,100k</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      147%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t.premium}</TableCell>
                    <TableCell align="right">£0</TableCell>
                    <TableCell align="right">£10k</TableCell>
                    <TableCell align="right">£30k</TableCell>
                    <TableCell align="right">£100k</TableCell>
                    <TableCell align="right">£300k</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      210%
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#f9f5ff" }}>
                    <TableCell>
                      <strong>{t.total}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>£72k</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>£240k</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>£580k</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>£1,250k</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>£2,800k</strong>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#6a0dad", fontWeight: "bold" }}
                    >
                      148%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>

      {/* User Growth Chart */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
        <Container maxWidth="lg">
          <Card sx={{ p: 4, borderRadius: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Group sx={{ fontSize: 32, color: "#2e7d32", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {t.userGrowth}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {t.userGrowthDesc}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: "250px", position: "relative", mb: 4 }}>
              {/* Line Chart Background */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      left: `${i * 20}%`,
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                ))}
              </Box>

              {/* Data Points */}
              {userData.map((point, idx) => {
                const maxUsers = 18000;
                const left = `${(idx / (userData.length - 1)) * 100}%`;
                const bottomIndividual = (point.individual / maxUsers) * 100;
                const bottomEnterprise = (point.enterprise / maxUsers) * 100;
                const bottomTotal = (point.total / maxUsers) * 100;

                return (
                  <Box key={idx}>
                    {/* Individual Users Point */}
                    <Tooltip
                      title={`Individual: ${point.individual.toLocaleString()} users`}
                      arrow
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left,
                          bottom: `${bottomIndividual}%`,
                          transform: "translate(-50%, 50%)",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#2196f3",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
                          zIndex: 3,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>

                    {/* Enterprise Users Point */}
                    <Tooltip
                      title={`Enterprise: ${point.enterprise.toLocaleString()} seats`}
                      arrow
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left,
                          bottom: `${bottomEnterprise}%`,
                          transform: "translate(-50%, 50%)",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#ff9800",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(255, 152, 0, 0.3)",
                          zIndex: 3,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>

                    {/* Total Users Point */}
                    <Tooltip
                      title={`Total: ${point.total.toLocaleString()} users`}
                      arrow
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left,
                          bottom: `${bottomTotal}%`,
                          transform: "translate(-50%, 50%)",
                          width: idx === userData.length - 1 ? 16 : 14,
                          height: idx === userData.length - 1 ? 16 : 14,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #6a0dad, #8a2be2)",
                          border: "3px solid white",
                          boxShadow: "0 4px 12px rgba(106, 13, 173, 0.4)",
                          zIndex: 4,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>

                    {/* Month Label */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        left,
                        bottom: -30,
                        transform: "translateX(-50%)",
                        fontWeight:
                          idx === userData.length - 1 ? "bold" : "normal",
                        color: idx === userData.length - 1 ? "#6a0dad" : "#666",
                      }}
                    >
                      {point.month}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Legend */}
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#2196f3",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{t.individualUsers}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#ff9800",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{t.enterpriseSeats}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6a0dad, #8a2be2)",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{t.totalUsers}</Typography>
              </Box>
            </Stack>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 3, color: "#666" }}
            >
              Projecting 18,000+ total users by Month 36, with enterprise
              adoption accelerating after Year 2
            </Typography>
          </Card>
        </Container>
      </Box>

      {/* Use of Funds - Enhanced with detailed breakdown */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Card
            sx={{
              p: 4,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f9f5ff 0%, #ffffff 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <BusinessCenter sx={{ fontSize: 32, color: "#1565c0", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {t.useOfFunds}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {t.useOfFundsDesc}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={4}>
              {/* Fund Allocation Chart */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    {fundAllocation.map((item, idx) => (
                      <Box key={idx} sx={{ mb: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ color: item.color, mr: 1 }}>
                              {item.icon}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: item.color }}
                            >
                              {item.percent}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ flex: 1, mr: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={item.percent}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#f0f0f0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: item.color,
                                  borderRadius: 5,
                                },
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", minWidth: "70px" }}
                          >
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Donut Chart Visualization */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Box sx={{ position: "relative", width: 150, height: 150 }}>
                      <svg
                        viewBox="0 0 100 100"
                        style={{ transform: "rotate(-90deg)" }}
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="15"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#6a0dad"
                          strokeWidth="15"
                          strokeDasharray={`${(60 / 100) * 251.2} 251.2`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#2e7d32"
                          strokeWidth="15"
                          strokeDasharray={`${(25 / 100) * 251.2} 251.2`}
                          strokeDashoffset={`${-(60 / 100) * 251.2}`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#1565c0"
                          strokeWidth="15"
                          strokeDasharray={`${(10 / 100) * 251.2} 251.2`}
                          strokeDashoffset={`${-((60 + 25) / 100) * 251.2}`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ed6c02"
                          strokeWidth="15"
                          strokeDasharray={`${(5 / 100) * 251.2} 251.2`}
                          strokeDashoffset={`${-((60 + 25 + 10) / 100) * 251.2}`}
                        />
                      </svg>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          £50k
                        </Typography>
                        <Typography variant="caption">Total</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Detailed Breakdown */}
              <Grid item xs={12} md={7}>
                <Box>
                  {fundAllocation.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          border: `1px solid ${item.color}30`,
                          backgroundColor: `${item.color}08`,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: `${item.color}15`,
                            transform: "translateX(5px)",
                          },
                        }}
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === idx ? null : idx,
                          )
                        }
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: item.color,
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: item.color,
                                mr: 2,
                              }}
                            >
                              {item.amount} ({item.percent}%)
                            </Typography>
                            <ExpandMore
                              sx={{
                                transform:
                                  expandedSection === idx
                                    ? "rotate(180deg)"
                                    : "none",
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            mt: 0.5,
                            mb: expandedSection === idx ? 2 : 0,
                          }}
                        >
                          {item.name === t.productDev && t.productDevDesc}
                          {item.name === t.salesDev && t.salesDevDesc}
                          {item.name === t.legalCompliance &&
                            t.legalComplianceDesc}
                          {item.name === t.operations && t.operationsDesc}
                        </Typography>

                        {expandedSection === idx && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${item.color}30`,
                            }}
                          >
                            <List dense>
                              {item.name === t.productDev &&
                                t.productDevBreakdown.map((line, i) => (
                                  <ListItem key={i} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircle
                                        sx={{ fontSize: 16, color: item.color }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={line} />
                                  </ListItem>
                                ))}
                              {item.name === t.salesDev &&
                                t.salesDevBreakdown.map((line, i) => (
                                  <ListItem key={i} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircle
                                        sx={{ fontSize: 16, color: item.color }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={line} />
                                  </ListItem>
                                ))}
                              {item.name === t.legalCompliance &&
                                t.legalComplianceBreakdown.map((line, i) => (
                                  <ListItem key={i} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircle
                                        sx={{ fontSize: 16, color: item.color }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={line} />
                                  </ListItem>
                                ))}
                              {item.name === t.operations &&
                                t.operationsBreakdown.map((line, i) => (
                                  <ListItem key={i} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircle
                                        sx={{ fontSize: 16, color: item.color }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={line} />
                                  </ListItem>
                                ))}
                            </List>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Runway Summary */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: "16px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {t.avgMonthlyBurn}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      {t.avgMonthlyBurnValue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {t.runwayMonths}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#2e7d32" }}
                    >
                      {t.runwayMonthsValue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {t.breakEvenMonth}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#1565c0" }}
                    >
                      {t.breakEvenMonthValue}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Monthly Burn Breakdown */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Monthly Burn Breakdown
                </Typography>
                {monthlyBurnData.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption">{item.category}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        £{item.amount} ({item.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          background:
                            "linear-gradient(90deg, #6a0dad, #8a2be2)",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Financial Assumptions & Risk Factors */}
      <Box sx={{ py: 8, backgroundColor: "#fafbff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Assumptions */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: "20px", height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Assessment sx={{ fontSize: 28, color: "#6a0dad", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {t.financialAssumptions}
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {t.assumptions.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ borderBottom: "1px solid #f0f0f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Info
                                sx={{ fontSize: 16, color: "#999", mr: 1 }}
                              />
                              <Typography variant="body2">
                                {item.metric}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ borderBottom: "1px solid #f0f0f0" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.value}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #f0f0f0" }}>
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {item.note}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Risk Factors */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  height: "100%",
                  backgroundColor: "#fff9f9",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Warning sx={{ fontSize: 28, color: "#d32f2f", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {t.riskFactors}
                  </Typography>
                </Box>
                <List>
                  {t.risks.map((risk, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ px: 0, alignItems: "flex-start" }}
                    >
                      <ListItemIcon sx={{ minWidth: 30, mt: 0.5 }}>
                        <ArrowRight sx={{ color: "#d32f2f" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {risk.factor}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {risk.mitigation}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Milestones & SEIS Benefits */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Milestones */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Timeline sx={{ fontSize: 28, color: "#6a0dad", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Fund-Linked Milestones
                  </Typography>
                </Box>
                <List>
                  {[
                    t.milestone1,
                    t.milestone2,
                    t.milestone3,
                    t.milestone4,
                    t.milestone5,
                  ].map((milestone, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: idx === 0 ? "#6a0dad" : "#e1bee7",
                            color: idx === 0 ? "white" : "#6a0dad",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {idx + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary={milestone} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>

            {/* SEIS Benefits */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Verified sx={{ fontSize: 28, color: "#b8860b", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    SEIS Investor Benefits
                  </Typography>
                </Box>
                <List>
                  {[
                    t.seisBenefit1,
                    t.seisBenefit2,
                    t.seisBenefit3,
                    t.seisBenefit4,
                  ].map((benefit, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "rgba(184, 134, 11, 0.1)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#b8860b", fontStyle: "italic" }}
                  >
                    Based on £50,000 investment, eligible investors could
                    receive up to £25,000 in income tax relief immediately.
                  </Typography>
                </Box>
              </Card>
            </Grid>
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
              Ready to review the full financial model?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Detailed Excel model available with all assumptions and scenarios
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
              >
                {t.requestDeck}
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
              >
                {t.downloadPDF}
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Footer - Same as original */}
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
                <img src={Logo} alt="DocRevisor" width="40px" height="40px" />
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
                Intelligent Document Processing for CRM ecosystems. SEIS-ready.
                Prototype complete. Enterprise pilots in discussion.
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
                SEIS Advance Assurance in progress • Graduate Visa • Innovator
                Founder pipeline
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
              Warrington, UK • Available for coffee in Manchester • £50k
              pre-seed SEIS round
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

// Helper component for ArrowRight (not imported)
const ArrowRight = (props) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 17L15 12L10 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FinancialProjectionsPage;
