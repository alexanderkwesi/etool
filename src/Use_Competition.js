import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Security,
  Verified,
  Code,
  Storage,
  CloudQueue,
  Build,
  Speed,
  Assessment,
  CheckCircle,
  Cancel,
  RemoveCircle,
  Star,
  ArrowForward,
} from "@mui/icons-material";

const Competition = () => {
  // Competitive Matrix
  const competitorData = [
    {
      feature: "Accuracy (OCR/IDP)",
      aws: "High",
      abbyy: "High",
      us: "High",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "WCAG 2.1 Accessibility",
      aws: "Poor / None",
      abbyy: "Basic",
      us: "Native / Full",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Native CRM CRUD",
      aws: "Requires Devs",
      abbyy: "Complex API",
      us: "Built-in / No-Code",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Setup Cost",
      aws: "Low",
      abbyy: "Very High",
      us: "Low (SaaS)",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "UK Data Residency",
      aws: "Cross-border",
      abbyy: "Cross-border",
      us: "Localized (UK)",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
    {
      feature: "Human-in-the-Loop",
      aws: "Limited",
      abbyy: "Yes",
      us: "Optimised for UK docs",
      usIcon: <CheckCircle sx={{ color: "#4caf50" }} />,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Header (copy from Overview) */}
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
                alt="DocRevisor"
                width="50px"
                height="50px"
              />
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
            </Box>
          </Box>
        </Container>
      </header>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            label="Why We Win"
            sx={{
              bgcolor: "#6a0dad",
              color: "white",
              fontWeight: "bold",
              mb: 2,
            }}
          />
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
          >
            Our Competitive Edge and Not Just Another OCR Tool
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#666", maxWidth: "800px", mx: "auto" }}
          >
            Accessibility-first architecture + Native CRM sync = A{" "}
            <span style={{ color: "#6a0dad", fontWeight: "bold" }}>
              Blue Ocean
            </span>{" "}
            in the $50B IDP market.
          </Typography>
        </Box>

        {/* 3 Moat Cards */}
        <Grid container spacing={4} sx={{ mb: 8, flexDirection:"row", justifyContent:"center", alignItems:"center" , display:"flex" }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
              }}
            >
              <Verified sx={{ fontSize: 48, color: "#6a0dad", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Accessibility-First
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a148c", mb: 2 }}>
                Built for screen-readers, keyboard-only navigation, and WCAG 2.1
                compliance from day one.
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#4a148c" }}
              >
                UK Equality Act 2010 • Public Sector Bodies Regulations
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              }}
            >
              <Code sx={{ fontSize: 48, color: "#2e7d32", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Native CRM CRUD
              </Typography>
              <Typography variant="body2" sx={{ color: "#1b5e20", mb: 2 }}>
                No middleware. No JSON mapping. Direct Create, Read, Update,
                Delete inside Salesforce, HubSpot, Dynamics 365.
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#1b5e20" }}
              >
                Deployment: Weeks → Hours
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: "24px",
                height: "100%",
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              }}
            >
              <Security sx={{ fontSize: 48, color: "#1565c0", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                UK Data Sovereignty
              </Typography>
              <Typography variant="body2" sx={{ color: "#0d47a1", mb: 2 }}>
                Localized UK residency. Human-in-the-loop optimised for British
                invoices, CIS vouchers, and legal documents.
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#0d47a1" }}
              >
                GDPR • UK Data Protection
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Competitive Matrix Table */}
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center", color: "#333" }}
        >
          Competitive Matrix
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "24px",
            boxShadow: "0 12px 50px rgba(106,13,173,0.08)",
            mb: 6,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbff" }}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  Feature
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  AWS / Google
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  ABBYY / Legacy IDP
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#6a0dad",
                    bgcolor: "#f3e5f5",
                  }}
                >
                  Revise Tech (Us)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitorData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "500" }}
                  >
                    {row.feature}
                  </TableCell>
                  <TableCell align="center">
                    {row.feature === "Accuracy (OCR/IDP)" ? (
                      row.aws
                    ) : (
                      <Cancel sx={{ color: "#d32f2f" }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.feature === "Accuracy (OCR/IDP)" ||
                    row.feature === "Human-in-the-Loop" ? (
                      row.abbyy
                    ) : row.feature === "Setup Cost" ? (
                      row.abbyy
                    ) : row.feature === "UK Data Residency" ? (
                      row.abbyy
                    ) : row.abbyy === "Basic" ? (
                      <Box>
                        <RemoveCircle sx={{ color: "#ff9800" }} /> Basic
                      </Box>
                    ) : (
                      <Cancel sx={{ color: "#d32f2f" }} />
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ bgcolor: "#fafbff" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {row.usIcon}
                      <Typography
                        sx={{ ml: 1, fontWeight: "bold", color: "#2e7d32" }}
                      >
                        {row.us}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Defence Strategy */}
        <Card
          sx={{
            p: 6,
            borderRadius: "32px",
            background: "#1a1a1a",
            color: "white",
            mt: 4,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Defending the Moat
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                Giants like AWS and Google compete on raw volume. We win on
                compliance, accessibility, and CRM-native workflows — the exact
                requirements of UK enterprise and public sector.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#ffb74d" }} />
                  </ListItemIcon>
                  <ListItemText primary="15+ patents pending in accessible IDP" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#ffb74d" }} />
                  </ListItemIcon>
                  <ListItemText primary="First-to-market with native WCAG 2.1 remediation + CRM sync" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#6a0dad",
                  borderRadius: "25px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
                endIcon={<ArrowForward />}
                onClick={() => (window.location.href = "/seis")}
              >
                Invest in the Edge
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* Footer (copy from Overview) */}
    </Box>
  );
};

export default Competition;
