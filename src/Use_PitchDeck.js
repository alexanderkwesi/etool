import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Paper,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Verified,
  Visibility,
  DataUsage,
  Gavel,
  Storage,
  Update,
  CodeOff,
  Public,
  CheckCircle,
  RemoveCircle,
  Remove,
  Check,
  FlashOn,
  Groups,
  Security,
  WorkspacePremium,
} from "@mui/icons-material";

// ---------------------------------------------
// Design System matches Use_LandingPage.js
// Colors: #6a0dad (primary purple), #2e7d32 (green), #1565c0 (blue), #ed6c02 (orange)
// Gradients, card shadows, subtle patterns
// ---------------------------------------------

const CompetitiveEdgeSlide = () => {
  // Matrix data for quick comparison
  const competitorMatrix = [
    {
      feature: "Accuracy",
      largeOCR: <Check sx={{ color: "#4caf50" }} />,
      legacyIDP: <Check sx={{ color: "#4caf50" }} />,
      startup: <Check sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Accessibility (WCAG 2.1)",
      largeOCR: <RemoveCircle sx={{ color: "#d32f2f" }} />,
      legacyIDP: <Remove sx={{ color: "#ff9800" }} />, // Basic
      startup: <CheckCircle sx={{ color: "#6a0dad" }} />, // Native/Full
    },
    {
      feature: "Native CRM CRUD",
      largeOCR: "Requires Devs",
      legacyIDP: "Complex API",
      startup: (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CheckCircle sx={{ color: "#6a0dad", fontSize: 18 }} />
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            No-Code
          </Typography>
        </Stack>
      ),
    },
    {
      feature: "Setup Cost",
      largeOCR: "Low",
      legacyIDP: "Very High",
      startup: "Low (SaaS)",
    },
    {
      feature: "UK Data Residency",
      largeOCR: <RemoveCircle sx={{ color: "#d32f2f" }} />,
      legacyIDP: <RemoveCircle sx={{ color: "#d32f2f" }} />,
      startup: <CheckCircle sx={{ color: "#6a0dad" }} />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fafbff",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern - similar to ChartsSection in LandingPage */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "35%",
          height: "100%",
          background: `linear-gradient(145deg, rgba(106,13,173,0.05) 0%, rgba(138,43,226,0.05) 100%),
                       repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(106,13,173,0.02) 15px, rgba(106,13,173,0.02) 16px)`,
          clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 30% 0%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Section Header - matches Enterprise tone */}
        <Box sx={{ mb: 6 }}>
          <Chip
            label="Competitive Moat & Investor Thesis"
            sx={{
              backgroundColor: "rgba(106,13,173,0.1)",
              color: "#6a0dad",
              fontWeight: "bold",
              mb: 2,
              borderRadius: "16px",
              border: "1px solid rgba(106,13,173,0.2)",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
            }}
          >
            Competitive Edge – Why We Win
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#666", maxWidth: "900px", lineHeight: 1.5 }}
          >
            Not "another OCR tool." We are the specialized document intelligence
            platform for accessibility-first compliance and native CRM sync.
          </Typography>
        </Box>

        {/* The Problem Statement - Card with subtle gradient */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fff4e5 0%, #ffe8d9 100%)",
                borderRadius: "20px",
                p: 3,
                border: "1px solid rgba(237,108,2,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                boxShadow: "0 8px 20px rgba(237,108,2,0.1)",
              }}
            >
              <Avatar sx={{ bgcolor: "#ed6c02", width: 48, height: 48 }}>
                <Gavel sx={{ color: "white" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#ed6c02" }}
                >
                  The "Black Box" Problem
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  Most IDP tools are built for developers, not enterprises. They
                  ignore accessibility regulations and require expensive
                  middleware to "talk" to a CRM.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* 3-Pillar Advantage - Blue Ocean / CRM Sync / Data Security */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "#333",
            borderLeft: "6px solid #6a0dad",
            pl: 2,
          }}
        >
          Our Strategic Moats
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Pillar 1: Accessibility-First */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                borderRadius: "24px",
                p: 3,
                border: "1px solid rgba(106,13,173,0.2)",
                boxShadow: "0 12px 30px rgba(106,13,173,0.12)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#6a0dad", mr: 2 }}>
                  <Visibility />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#4a0072" }}
                >
                  Blue Ocean
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
              >
                Accessibility-First Architecture
              </Typography>
              <Typography variant="body2" sx={{ color: "#444", mb: 2 }}>
                Built from the ground up for screen-readers and keyboard-only
                navigation.
              </Typography>
              <Stack spacing={1}>
                <Chip
                  icon={<WorkspacePremium sx={{ fontSize: 16 }} />}
                  label="WCAG 2.1 / Section 508"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(106,13,173,0.1)",
                    color: "#6a0dad",
                    justifyContent: "flex-start",
                  }}
                />
                <Chip
                  icon={<Gavel sx={{ fontSize: 16 }} />}
                  label="UK Equality Act 2010"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(106,13,173,0.1)",
                    color: "#6a0dad",
                    justifyContent: "flex-start",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#6a0dad", fontWeight: "bold", mt: 1 }}
                >
                  Value: Meet Public Sector Accessibility Regulations
                </Typography>
              </Stack>
            </Card>
          </Grid>

          {/* Pillar 2: Native CRM CRUD */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                borderRadius: "24px",
                p: 3,
                border: "1px solid rgba(46,125,50,0.2)",
                boxShadow: "0 12px 30px rgba(46,125,50,0.12)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                  <DataUsage />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#1b5e20" }}
                >
                  Native Sync
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
              >
                CRM CRUD (No-Code)
              </Typography>
              <Typography variant="body2" sx={{ color: "#444", mb: 2 }}>
                Create, Read, Update, Delete directly inside Salesforce,
                HubSpot, Dynamics 365.
              </Typography>
              <Stack spacing={1}>
                <Chip
                  icon={<CodeOff sx={{ fontSize: 16 }} />}
                  label="Zero middleware (No Zapier)"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(46,125,50,0.1)",
                    color: "#2e7d32",
                  }}
                />
                <Chip
                  icon={<Update sx={{ fontSize: 16 }} />}
                  label="Deployment: Weeks → Hours"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(46,125,50,0.1)",
                    color: "#2e7d32",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#2e7d32", fontWeight: "bold", mt: 1 }}
                >
                  Value: Eliminate expensive middleware
                </Typography>
              </Stack>
            </Card>
          </Grid>

          {/* Pillar 3: Localized UK Data Security */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                borderRadius: "24px",
                p: 3,
                border: "1px solid rgba(21,101,192,0.2)",
                boxShadow: "0 12px 30px rgba(21,101,192,0.12)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#1565c0", mr: 2 }}>
                  <Security />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#0a2e4e" }}
                >
                  Data Sovereignty
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
              >
                Manchester Data Residency
              </Typography>
              <Typography variant="body2" sx={{ color: "#444", mb: 2 }}>
                Localized UK data processing + Human-in-the-loop for UK
                invoices, CIS vouchers.
              </Typography>
              <Stack spacing={1}>
                <Chip
                  icon={<Storage sx={{ fontSize: 16 }} />}
                  label="GDPR / UK Data Sovereignty"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(21,101,192,0.1)",
                    color: "#1565c0",
                  }}
                />
                <Chip
                  icon={<Groups sx={{ fontSize: 16 }} />}
                  label="Human-in-the-loop verification"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(21,101,192,0.1)",
                    color: "#1565c0",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#1565c0", fontWeight: "bold", mt: 1 }}
                >
                  Value: Essential for UK legal/financial firms
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Competitive Matrix */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "#333",
            borderLeft: "6px solid #ed6c02",
            pl: 2,
          }}
        >
          Competitive Matrix
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "24px",
            boxShadow: "0 16px 50px rgba(0,0,0,0.08)",
            border: "1px solid rgba(106,13,173,0.1)",
            mb: 4,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f0fa" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1.1rem", py: 2 }}
                >
                  Feature
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#555" }}
                >
                  Large Scale OCR (AWS/Google)
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#555" }}
                >
                  Legacy IDP (ABBYY)
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#6a0dad",
                    backgroundColor: "rgba(106,13,173,0.06)",
                  }}
                >
                  <FlashOn
                    sx={{ fontSize: 20, verticalAlign: "middle", mr: 0.5 }}
                  />
                  DocRevisor (Startup)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitorMatrix.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: 600 }}
                  >
                    {row.feature}
                  </TableCell>
                  <TableCell align="center">{row.largeOCR}</TableCell>
                  <TableCell align="center">{row.legacyIDP}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "rgba(106,13,173,0.02)",
                      fontWeight: 500,
                    }}
                  >
                    {row.startup}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary / Investment Thesis */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
                borderRadius: "28px",
                p: 4,
                color: "white",
                border: "1px solid #6a0dad",
                boxShadow: "0 20px 40px rgba(106,13,173,0.3)",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    Underserved $50B+ Market: Accessibility + CRM
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                    While competitors chase accuracy, we dominate the "usability
                    compliance" and CRM-native integration niche. UK enterprises
                    are legally mandated to comply with accessibility — we are
                    the only solution built for this.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      icon={<Verified />}
                      label="WCAG 2.1 Native"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                      }}
                    />
                    <Chip
                      icon={<DataUsage />}
                      label="CRM CRUD No-Code"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                      }}
                    />
                    <Chip
                      icon={<Security />}
                      label="UK Data Residency"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", color: "#8a2be2" }}
                    >
                      3x
                    </Typography>
                    <Typography variant="body2">Faster Deployment</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      vs. legacy IDP
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom spacer to match landing page rhythm */}
        <Divider sx={{ my: 6, borderColor: "rgba(106,13,173,0.1)" }} />
        <Typography
          variant="caption"
          sx={{ color: "#888", display: "block", textAlign: "center" }}
        >
          Investor Thesis: Defensible moat through regulation + CRM workflow
          lock-in.
        </Typography>
      </Container>
    </Box>
  );
};

export default CompetitiveEdgeSlide;
