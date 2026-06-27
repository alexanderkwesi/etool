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
  Slider,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Gavel,
  MonetizationOn,
  Verified,
  ArrowForward,
  CheckCircle,
  AccountBalance,
  Receipt,
  TrendingUp,
  Security,
} from "@mui/icons-material";

const SEIS = () => {
  const [investment, setInvestment] = useState(50000);
  const maxInvestment = 100000;

  const taxRelief = investment * 0.5;
  const cgtExemption = investment * 0.5; // Simplified CGT deferral
  const effectiveCost = investment - taxRelief;

  return (
    <Box sx={{ backgroundColor: "#fafbff", minHeight: "100vh" }}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box component="img" src="./image/favicon-png.png" width="50px" height="50px" />
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
            label="50% Income Tax Relief"
            sx={{ bgcolor: "#4caf50", color: "white", fontWeight: "bold", mb: 2 }}
          />
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
            SEIS Qualified Investment
          </Typography>
          <Typography variant="h5" sx={{ color: "#666", maxWidth: "700px", mx: "auto" }}>
            Pre-seed round eligible for the UK’s most tax-advantaged venture scheme.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Left: SEIS Benefits */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, borderRadius: "28px", height: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center" }}>
                <Gavel sx={{ mr: 1, color: "#6a0dad" }} /> Investor Advantages
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#4caf50" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="50% Income Tax Relief"
                    secondary="Reduce your tax bill by 50% of the investment amount"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#4caf50" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capital Gains Tax Exemption"
                    secondary="No CGT on disposal of shares held for 3+ years"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#4caf50" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Loss Relief"
                    secondary="Relief at your marginal rate if shares are sold at a loss"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#4caf50" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="CGT Deferral"
                    secondary="Defer capital gains on any asset when reinvested into SEIS"
                  />
                </ListItem>
              </List>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ color: "#666" }}>
                <strong>Status:</strong> Advance Assurance application in progress.
                Expected completion Q2 2024.
              </Typography>
            </Card>
          </Grid>

          {/* Right: Interactive Tax Calculator */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                borderRadius: "28px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                color: "white",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                <MonetizationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                SEIS Tax Relief Calculator
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>
                Move the slider to estimate your net investment after relief.
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Your Investment: £{investment.toLocaleString()}
              </Typography>
              <Slider
                value={investment}
                onChange={(e, val) => setInvestment(val)}
                min={1000}
                max={100000}
                step={1000}
                sx={{
                  mt: 2,
                  color: "#8a2be2",
                  "& .MuiSlider-thumb": { backgroundColor: "white" },
                }}
              />
              <Stack spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Income Tax Relief (50%)</Typography>
                  <Typography sx={{ fontWeight: "bold", color: "#4caf50" }}>
                    £{taxRelief.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>CGT Deferral (est.)</Typography>
                  <Typography sx={{ fontWeight: "bold", color: "#ffb74d" }}>
                    £{cgtExemption.toLocaleString()}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Effective Cost</Typography>
                  <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: "bold" }}>
                    £{effectiveCost.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  bgcolor: "white",
                  color: "#6a0dad",
                  borderRadius: "25px",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
                endIcon={<ArrowForward />}
              >
                Request SEIS Investor Pack
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* SEIS Eligibility Criteria */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
            Why Revise Tech Qualifies
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: "20px" }}>
                <Receipt sx={{ fontSize: 40, color: "#6a0dad", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Trading &lt; 2 Years
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Prototype stage, pre-revenue, eligible for maximum relief.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: "20px" }}>
                <AccountBalance sx={{ fontSize: 40, color: "#6a0dad", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Gross Assets &lt; £15M
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Bootstrapped, no institutional capital raised.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: "20px" }}>
                <TrendingUp sx={{ fontSize: 40, color: "#6a0dad", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Permanent UK Establishment
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Warrington HQ, UK tax resident.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Card sx={{ mt: 8, p: 5, borderRadius: "32px", bgcolor: "#f3e5f5", textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#4a148c" }}>
            SEIS Advance Assurance — Pending
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#4a148c" }}>
            We expect full HMRC approval within 30 days. Early investors can reserve
            allocation now.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#6a0dad",
              color: "white",
              borderRadius: "25px",
              px: 5,
              py: 1.5,
              "&:hover": { bgcolor: "#5a0cad" },
            }}
          >
            Reserve SEIS Allocation
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default SEIS;