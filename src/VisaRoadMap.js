import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Avatar,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/material";
import {
  VerifiedUser,
  FlightTakeoff,
  BusinessCenter,
  LocationOn,
  Flag,
  Schedule,
  CheckCircle,
  ArrowForward,
  Gavel,
} from "@mui/icons-material";

const VisaRoadmap = () => {
  // Founder visa journey steps
  const visaSteps = [
    {
      label: "Graduate Visa (Current)",
      date: "2023 - 2025",
      description:
        "Currently on Graduate Visa. Full right to work, building prototype and engaging with early customers.",
      status: "active",
    },
    {
      label: "SEIS Advance Assurance",
      date: "Q2 2024",
      description:
        "Obtain HMRC Advance Assurance to validate SEIS eligibility for investors.",
      status: "pending",
    },
    {
      label: "Pre-Seed Raise (£50k)",
      date: "Q3 2024",
      description:
        "Close SEIS round, secure Innovator Founder endorsement from approved body.",
      status: "pending",
    },
    {
      label: "Innovator Founder Visa Application",
      date: "Q4 2024",
      description:
        "Switch to Innovator Founder route. Requires £50k funding and business endorsement.",
      status: "pending",
    },
    {
      label: "Full Commercial Launch",
      date: "Q1 2025",
      description:
        "MVP to market, first £72k ARR, 500+ users, pathway to settlement.",
      status: "pending",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
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
            label="Graduate Visa → Innovator Founder"
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
            Long-Term Commitment to the UK
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#666", maxWidth: "800px", mx: "auto" }}
          >
            Alexander Oluwaseun Kwesi — North West Tech Ecosystem
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Left: Stepper Timeline */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "28px",
                backgroundColor: "#fafbff",
                border: "1px solid #f0f0f0",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Schedule sx={{ mr: 1, color: "#6a0dad" }} /> Visa & Fundraising
                Timeline
              </Typography>
              <Stepper orientation="vertical" activeStep={0} nonLinear>
                {visaSteps.map((step, index) => (
                  <Step
                    key={index}
                    active={step.status === "active"}
                    completed={step.status === "completed"}
                  >
                    <StepLabel
                      StepIconComponent={() =>
                        step.status === "active" ? (
                          <Avatar
                            sx={{ bgcolor: "#6a0dad", width: 32, height: 32 }}
                          >
                            <CheckCircle sx={{ fontSize: 20 }} />
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{ bgcolor: "#e0e0e0", width: 32, height: 32 }}
                          >
                            <Schedule sx={{ fontSize: 20, color: "#666" }} />
                          </Avatar>
                        )
                      }
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6a0dad", display: "block" }}
                      >
                        {step.date}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          {/* Right: Founder Commitment Card */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                p: 4,
                borderRadius: "28px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <BusinessCenter sx={{ fontSize: 48, color: "#8a2be2", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Why the North West?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                “Warrington is our global HQ. Manchester is our talent pool. I
                am personally committed to building a lasting, UK-headquartered
                enterprise software company.”
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: "#ff9800", mr: 1 }} />
                <Typography variant="body2">Warrington, UK (HQ)</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Flag sx={{ color: "#4caf50", mr: 1 }} />
                <Typography variant="body2">
                  Settlement pathway: 5-year Innovator Founder route
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 3 }} />
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                Endorsement Readiness
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Working with endorsed body (awaiting SEIS completion). Meets
                Innovator Founder criteria: innovative, viable, scalable.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "white",
                  color: "#6a0dad",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
                endIcon={<ArrowForward />}
              >
                View Founder LinkedIn
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* SEIS-Visa Connection */}
        <Card sx={{ mt: 6, p: 4, borderRadius: "28px", bgcolor: "#f3e5f5" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4a148c", mb: 1 }}
              >
                £50k Raise = Innovator Founder Eligibility
              </Typography>
              <Typography variant="body2" sx={{ color: "#4a148c" }}>
                The SEIS pre-seed round satisfies the Innovator Founder funding
                requirement. Investor capital directly enables visa progression
                and 5+ year founder commitment.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
              <Chip
                icon={<Gavel />}
                label="SEIS + Visa Linked"
                sx={{ bgcolor: "#6a0dad", color: "white", fontWeight: "bold" }}
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default VisaRoadmap;
