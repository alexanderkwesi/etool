import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  TrendingUp,
  BusinessCenter,
  Gavel,
  CloudUpload,
  Verified,
  Speed,
  Security,
  Group,
  Rocket,
  ArrowForward,
  Lightbulb,
  Flag,
  LocationOn,
  Assessment,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const Overview = () => {
  // Key metrics for investor summary
  const keyMetrics = [
    {
      value: "£72k",
      label: "Year 1 ARR (Projected)",
      icon: <TrendingUp sx={{ color: "#4caf50", fontSize: 32 }} />,
    },
    {
      value: "5,000",
      label: "Users in 24 Months",
      icon: <Group sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      value: "£50k",
      label: "Pre-Seed Raise (SEIS)",
      icon: <Gavel sx={{ color: "#ff9800", fontSize: 32 }} />,
    },
    {
      value: "2024",
      label: "Prototype to Revenue",
      icon: <Rocket sx={{ color: "#6a0dad", fontSize: 32 }} />,
    },
  ];

  // Problem / Solution framing
  const problemSolution = [
    {
      problem: "Data-rich but insight-poor",
      problemDesc:
        "Millions of hours wasted manually extracting unstructured data from PDFs, scans, and emails into CRMs.",
      solution: "AI-powered extraction + native CRM sync",
      solutionDesc:
        "Automated IDP that writes directly into Salesforce, HubSpot, and Dynamics 365.",
      color: "#d32f2f",
    },
    {
      problem: "Inaccessible document workflows",
      problemDesc:
        "Most IDP tools fail WCAG 2.1, creating legal risk under UK Equality Act 2010.",
      solution: "Universal Design by default",
      solutionDesc:
        "Native screen-reader support, keyboard navigation, and automated PDF/UA remediation.",
      color: "#ed6c02",
    },
    {
      problem: "Expensive middleware & integration",
      problemDesc:
        "Legacy OCR outputs JSON/CSV – requires developers or Zapier to connect to CRM.",
      solution: "No-code CRUD operations",
      solutionDesc:
        "Built-in Create, Read, Update, Delete directly inside CRM interface.",
      color: "#2e7d32",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fafbff", minHeight: "100vh" }}>
      {/* Enterprise Header (matching LandingPage) - LEFT ALONE */}
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
                component="img"
                src="./image/favicon-png.png"
                alt="DocRevisor Intelligence"
                width="50px"
                height="50px"
                sx={{ borderRadius: "8px" }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg,#6a0dad, #8a2be2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  DocRevisor
                </Typography>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  SEIS Investment Memorandum
                </Typography>
              </Box>
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
              }}
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Founder
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section - CENTERED */}
      <CenteredSection
        sx={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          py: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
            <Chip
              label="Pre-Seed • SEIS Advanced Assurance Pending"
              color="secondary"
              sx={{
                mb: 3,
                fontWeight: "bold",
                bgcolor: "#6a0dad",
                color: "white",
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.2rem", md: "3.2rem" },
              }}
            >
              IDP + Universal Design
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "600", color: "#333", mb: 3 }}
            >
              Bridging Unstructured Data & Business Intelligence
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}
            >
              Warrington-based SaaS transforming document remediation into
              accessible CRM intelligence. £72k ARR forecast, 5,000 users by
              2026.
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
                }}
                endIcon={<ArrowForward />}
                onClick={() => (window.location.href = "/seis")}
              >
                View SEIS Opportunity
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  border: "2px solid #6a0dad",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  color: "#6a0dad",
                }}
                onClick={() => (window.location.href = "/competition")}
              >
                Competitive Edge
              </Button>
            </Stack>
          </Box>
        </Container>
      </CenteredSection>

      {/* Key Metrics Dashboard - CENTERED */}
      <CenteredSection sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {keyMetrics.map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                    textAlign: "center",
                    height: "100%",
                    transition: "0.3s",
                    mx: "auto",
                    maxWidth: "100%",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    {metric.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#6a0dad" }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {metric.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </CenteredSection>

      {/* Problem / Solution Grid - CENTERED */}
      <CenteredSection sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#333",
              textAlign: "center",
            }}
          >
            The Intelligence Gap
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 6,
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Enterprises are drowning in documents but starving for accessible,
            integrated data.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {problemSolution.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    boxShadow: "0 12px 40px rgba(106,13,173,0.08)",
                    height: "100%",
                    p: 3,
                    borderTop: `6px solid ${item.color}`,
                    mx: "auto",
                    maxWidth: "100%",
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="overline"
                      sx={{
                        color: item.color,
                        fontWeight: "bold",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      PROBLEM
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
                    >
                      {item.problem}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", mb: 3, textAlign: "center" }}
                    >
                      {item.problemDesc}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "#2e7d32",
                        fontWeight: "bold",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      SOLUTION
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: "#2e7d32",
                        textAlign: "center",
                      }}
                    >
                      {item.solution}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", textAlign: "center" }}
                    >
                      {item.solutionDesc}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </CenteredSection>

      {/* Why North West / Founder Commitment - CENTERED */}
      <CenteredSection sx={{ py: 8, backgroundColor: "white", mt: 6 }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                  borderRadius: "30px",
                  p: 4,
                  mx: "auto",
                  maxWidth: "100%",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 2, color: "#4a148c" }}
                >
                  🇬🇧 Founder: Alexander Oluwaseun Kwesi
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "#4a148c", fontWeight: "500" }}
                >
                  Graduate Visa → Innovator Founder Route
                </Typography>
                <Typography variant="body2" sx={{ color: "#6a1b9a", mb: 3 }}>
                  Long-term commitment to the North West tech ecosystem.
                  Warrington headquarters, Manchester network.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Chip
                    icon={<LocationOn />}
                    label="Warrington, UK • Global HQ"
                    sx={{
                      bgcolor: "white",
                      color: "#4a148c",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "24px",
                  bgcolor: "#1a1a1a",
                  color: "white",
                  mx: "auto",
                  maxWidth: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Assessment sx={{ mr: 1, color: "#8a2be2" }} /> Traction &
                  Scalability
                </Typography>
                <List dense sx={{ width: "100%", mx: "auto" }}>
                  <ListItem sx={{ justifyContent: "center" }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <Verified sx={{ color: "#4caf50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Prototype phase → MVP complete"
                      sx={{ textAlign: "left" }}
                    />
                  </ListItem>
                  <ListItem sx={{ justifyContent: "center" }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <Verified sx={{ color: "#4caf50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="£72k ARR forecast (Year 1) — proven product-market fit"
                      sx={{ textAlign: "left" }}
                    />
                  </ListItem>
                  <ListItem sx={{ justifyContent: "center" }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <Verified sx={{ color: "#4caf50" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="5,000 users within 24 months of launch"
                      sx={{ textAlign: "left" }}
                    />
                  </ListItem>
                  <ListItem sx={{ justifyContent: "center" }}>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <Verified sx={{ color: "#ff9800" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="SEIS Advance Assurance in progress"
                      sx={{ textAlign: "left" }}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </CenteredSection>

      {/* Footer - CENTERED */}
      <footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "60px 0 30px",
          marginTop: "40px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Revise Tech
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", textAlign: { xs: "center", md: "left" } }}
              >
                Transforming unstructured data into accessible business
                intelligence.
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
                Contact
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#ccc",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                📧 seankwesi24@googlemaail.com
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", textAlign: { xs: "center", md: "left" } }}
              >
                📞 +44 7342 262203
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
                SEIS Status
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccc", textAlign: { xs: "center", md: "left" } }}
              >
                Advance Assurance Pending • 50% Tax Relief
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
          </Box>
        </Container>
      </footer>
    </Box>
  );
};

export default Overview;
