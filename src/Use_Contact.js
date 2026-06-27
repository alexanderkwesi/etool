import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Stack,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  LinkedIn,
  AccessTime,
  CalendarToday,
  ArrowForward,
  Verified,
  WhatsApp,
  Groups,
  Assessment,
  Lightbulb,
  Rocket,
  Security,
  IntegrationInstructions,
  Dashboard,
  History,
  BarChart,
} from "@mui/icons-material";

// ==============================================
// Founder Contact Page Component
// ==============================================
export const FounderContact = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(`${label} copied to clipboard`);
    setSnackbarOpen(true);
  };

  const contactMethods = [
    {
      icon: <Phone sx={{ fontSize: 28 }} />,
      label: "Phone (UK)",
      value: "+44 7342 2622033",
      action: "tel:+447342622033",
      color: "#6a0dad",
    },
    {
      icon: <Email sx={{ fontSize: 28 }} />,
      label: "Email",
      value: "seankwesi24@googlemaail.com",
      action: "mailto:seankwesi24@googlemaail.com",
      color: "#2e7d32",
    },
    {
      icon: <LinkedIn sx={{ fontSize: 28 }} />,
      label: "LinkedIn",
      value: "Alexander Oluwaseun Kwesi",
      action: "https://www.linkedin.com/in/alexanderoluwaseunkwesi",
      color: "#1565c0",
    },
    {
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      label: "Location",
      value: "Warrington, UK (North West Tech Hub)",
      action: null,
      color: "#ed6c02",
    },
  ];

  const investmentHighlights = [
    {
      metric: "£72k",
      label: "ARR (Year 1 Forecast)",
      icon: <BarChart sx={{ color: "#4caf50" }} />,
    },
    {
      metric: "5,000",
      label: "Users by Month 24",
      icon: <Groups sx={{ color: "#2196f3" }} />,
    },
    {
      metric: "£50k",
      label: "Pre-Seed Raise",
      icon: <Rocket sx={{ color: "#ff9800" }} />,
    },
    {
      metric: "SEIS",
      label: "Advance Assurance in Progress",
      icon: <Verified sx={{ color: "#9c27b0" }} />,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fafbff", minHeight: "100vh", py: 8 }}>
      {/* Patterned Background (matching landing page style) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)",
          backgroundImage: `
            linear-gradient(135deg, rgba(106, 13, 173, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(106, 13, 173, 0.03) 10px, rgba(106, 13, 173, 0.03) 20px)
          `,
          clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 30% 0%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header with Founder Identity */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            borderRadius: "30px",
            p: { xs: 4, md: 6 },
            mb: 6,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", right: 0, top: 0, opacity: 0.1 }}>
            <Rocket sx={{ fontSize: 300 }} />
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label="Founder-Led • SEIS Eligible"
                sx={{
                  backgroundColor: "rgba(106, 13, 173, 0.2)",
                  color: "white",
                  mb: 3,
                  fontWeight: "bold",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  background: "linear-gradient(45deg, #ffffff, #e0b0ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Alexander Oluwaseun Kwesi
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                Founder & CEO, Revise Tech
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, opacity: 0.8, maxWidth: "600px" }}
              >
                Graduate Visa → Innovator Founder route. Committed to building
                the North West's leading Intelligent Document Processing
                platform.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<LinkedIn />}
                  href="https://www.linkedin.com/in/alexanderoluwaseunkwesi"
                  target="_blank"
                  sx={{
                    background: "linear-gradient(45deg, #0a66c2, #0e7ad0)",
                    borderRadius: "25px",
                    px: 3,
                    "&:hover": {
                      background: "linear-gradient(45deg, #095aa8, #0c6bb5)",
                    },
                  }}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  href="https://wa.me/447342622033"
                  target="_blank"
                  sx={{
                    borderColor: "#25D366",
                    color: "#25D366",
                    borderRadius: "25px",
                    px: 3,
                    "&:hover": {
                      borderColor: "#128C7E",
                      color: "#128C7E",
                      backgroundColor: "rgba(37, 211, 102, 0.04)",
                    },
                  }}
                >
                  WhatsApp
                </Button>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Avatar
                sx={{
                  width: 180,
                  height: 180,
                  border: "4px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 32px rgba(106, 13, 173, 0.3)",
                  bgcolor: "#6a0dad",
                  fontSize: "64px",
                }}
              >
                AK
              </Avatar>
            </Grid>
          </Grid>
        </Card>

        {/* Investment Highlights - matching ROI metrics style */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {investmentHighlights.map((item, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(106, 13, 173, 0.08)",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 48px rgba(106, 13, 173, 0.12)",
                  },
                }}
              >
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#6a0dad" }}
                >
                  {item.metric}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Contact Methods - Cards */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "#333",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: 0,
              width: 60,
              height: 4,
              background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
              borderRadius: 2,
            },
          }}
        >
          Direct Contact
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {contactMethods.map((method, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  background: method.action
                    ? "white"
                    : "linear-gradient(135deg, #f8f9ff, #ffffff)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  border: "1px solid #f0f0f0",
                  "&:hover": method.action
                    ? {
                        transform: "translateY(-8px)",
                        boxShadow: `0 16px 60px ${method.color}20`,
                      }
                    : {},
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: method.color,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${method.color}15`,
                        borderRadius: "12px",
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {method.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {method.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#333",
                      fontWeight: method.action ? "600" : "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {method.value}
                  </Typography>
                </CardContent>
                {method.action && (
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => handleCopy(method.value, method.label)}
                      sx={{ color: method.color, fontWeight: "600" }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      href={method.action}
                      target={
                        method.action.startsWith("http") ? "_blank" : "_self"
                      }
                      sx={{ color: method.color, fontWeight: "600" }}
                    >
                      {method.action.startsWith("http") ? "Open" : "Call"}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Coffee/Intro Call CTA - matches landing page CTA style */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)",
            borderRadius: "30px",
            p: { xs: 4, md: 6 },
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Coffee or Call in Warrington/Manchester?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Open for introductions next week. Let's discuss the vision.
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
              onClick={() => (window.location.href = "/schedule-call")}
              endIcon={<ArrowForward />}
            >
              Schedule a Call
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
                  border: "2px solid white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              href="mailto:seankwesi24@googlemaail.com?subject=SEIS Investment Opportunity: £72k ARR IDP Startup (Manchester)"
            >
              Reply via Email
            </Button>
          </Stack>
        </Card>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

// ==============================================
// Schedule a Call Page Component
// ==============================================
export const ScheduleCall = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend - just simulate success
    setSubmitted(true);
    setSnackbarOpen(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  const timeSlots = [
    "09:00 - 09:30",
    "10:00 - 10:30",
    "11:00 - 11:30",
    "13:00 - 13:30",
    "14:00 - 14:30",
    "15:00 - 15:30",
  ];

  // Generate next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left Column - Info & Founder Bio */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Chip
                label="10-Minute Intro Call"
                sx={{
                  backgroundColor: "#6a0dad",
                  color: "white",
                  fontWeight: "bold",
                  mb: 3,
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#333",
                }}
              >
                Let's Connect in Person or Virtually
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                Coffee in Warrington/Manchester, or a quick call. I'm keen to
                share our vision for revolutionizing document intelligence in
                the UK.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{ bgcolor: "#6a0dad", mr: 2, width: 56, height: 56 }}
                >
                  AK
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Alexander Oluwaseun Kwesi
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Founder, Revise Tech
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6a0dad" }}>
                    Graduate Visa → Innovator Founder
                  </Typography>
                </Box>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Verified sx={{ color: "#2e7d32" }} />
                  </ListItemIcon>
                  <ListItemText primary="SEIS Advance Assurance in progress" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Verified sx={{ color: "#2e7d32" }} />
                  </ListItemIcon>
                  <ListItemText primary="£72k ARR forecast (Year 1)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Verified sx={{ color: "#2e7d32" }} />
                  </ListItemIcon>
                  <ListItemText primary="5,000 users projected (24 months)" />
                </ListItem>
              </List>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "#f8f9ff",
                  borderRadius: "16px",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  📍 Warrington, UK
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Open for coffee in Warrington or Manchester city centre next
                  week. I'll confirm venue within 24h.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Scheduling Form */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: "24px",
                boxShadow: "0 12px 48px rgba(106, 13, 173, 0.12)",
                p: { xs: 3, md: 5 },
              }}
            >
              {submitted ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Verified sx={{ fontSize: 80, color: "#4caf50", mb: 3 }} />
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                    Request Sent!
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                    Thank you. Alexander will confirm your slot within 2 hours.
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6a0dad" }}>
                    Redirecting to home page...
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Schedule a 10-Minute Call or Coffee
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Select Date
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: "wrap", gap: 1 }}
                      >
                        {getDates().map((date, idx) => {
                          const dateStr = date.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          });
                          return (
                            <Chip
                              key={idx}
                              label={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              sx={{
                                p: 2,
                                fontWeight:
                                  selectedDate === dateStr ? "bold" : "normal",
                                backgroundColor:
                                  selectedDate === dateStr
                                    ? "#6a0dad"
                                    : "transparent",
                                color:
                                  selectedDate === dateStr ? "white" : "#333",
                                border:
                                  selectedDate === dateStr
                                    ? "none"
                                    : "1px solid #ddd",
                                "&:hover": {
                                  backgroundColor:
                                    selectedDate === dateStr
                                      ? "#5a0cad"
                                      : "#f5f5f5",
                                },
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Select Time (GMT)
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: "wrap", gap: 1 }}
                      >
                        {timeSlots.map((slot, idx) => (
                          <Chip
                            key={idx}
                            label={slot}
                            onClick={() => setSelectedTime(slot)}
                            sx={{
                              p: 2,
                              fontWeight:
                                selectedTime === slot ? "bold" : "normal",
                              backgroundColor:
                                selectedTime === slot
                                  ? "#2e7d32"
                                  : "transparent",
                              color: selectedTime === slot ? "white" : "#333",
                              border:
                                selectedTime === slot
                                  ? "none"
                                  : "1px solid #ddd",
                              "&:hover": {
                                backgroundColor:
                                  selectedTime === slot ? "#1e6b2e" : "#f5f5f5",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Business Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company / Firm"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message (optional)"
                        name="message"
                        multiline
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="e.g., I'd prefer coffee in Manchester near Spinningfields..."
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        disabled={!selectedDate || !selectedTime}
                        sx={{
                          background:
                            "linear-gradient(45deg, #6a0dad, #8a2be2)",
                          borderRadius: "25px",
                          py: 1.8,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          textTransform: "none",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #5a0cad, #7a2ad2)",
                          },
                        }}
                        endIcon={<ArrowForward />}
                      >
                        Confirm Meeting Request
                      </Button>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#999",
                          display: "block",
                          textAlign: "center",
                          mt: 2,
                        }}
                      >
                        No login required. Founder will respond within 2 hours.
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Meeting request sent! Alexander will confirm shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ==============================================
// Pitch Deck Page - Centered Cards with Slide Numbers
// ==============================================
export const PitchDeck = () => {
  const deckSlides = [
    {
      number: "01",
      title: "Executive Summary",
      content: `IDP meets Universal Design. We are a B2B SaaS platform combining Intelligent Document Processing with Document Remediation, natively integrated into CRMs.`,
      tags: ["£72k ARR", "Prototype Phase", "Warrington, UK"],
      icon: <Lightbulb sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    },
    {
      number: "02",
      title: "The Problem",
      content: `Businesses are "data-rich but insight-poor." Millions of hours wasted on manual data extraction from non-accessible PDFs, scans, and emails. Legal risks due to non-compliance with UK accessibility laws (Equality Act 2010).`,
      tags: ["Unstructured Data", "Accessibility Risk", "Manual Work"],
      icon: <History sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
    },
    {
      number: "03",
      title: "The Solution",
      content: `AI-powered platform that extracts, transforms, and remediates documents. Outputs fully accessible files and pushes structured data directly into Salesforce, HubSpot, and Dynamics 365 with no-code CRUD operations.`,
      tags: ["AI Extraction", "Auto-Remediation", "CRM Native"],
      icon: <IntegrationInstructions sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    },
    {
      number: "04",
      title: "Competitive Edge",
      content: `1) Accessibility-First Architecture (WCAG 2.1, Section 508). 2) Native CRM CRUD – no middleware. 3) UK-first data residency & human-in-the-loop verification.`,
      tags: ["Blue Ocean", "No-Code CRM", "UK Data Sovereignty"],
      icon: <Security sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    },
    {
      number: "05",
      title: "Competitive Matrix",
      content: `AWS/Google: High accuracy, poor accessibility, requires devs. ABBYY: High accuracy, basic accessibility, complex API. Us: High accuracy, native WCAG, built-in CRM CRUD, low setup cost.`,
      tags: ["vs Giants", "Accessibility Win", "CRM Native"],
      icon: <Assessment sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    },
    {
      number: "06",
      title: "Traction & Forecast",
      content: `Prototype MVP complete. £72,000 ARR forecast in Year 1. 5,000 users within 24 months of launch. Proven product-market fit with pilot customers.`,
      tags: ["£72k ARR", "5k Users (24m)", "MVP Ready"],
      icon: <BarChart sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
    },
    {
      number: "07",
      title: "Market Opportunity",
      content: `$50B document processing market. UK accessibility regulations tightening. AI adoption at all-time high. We bridge the gap between "unstructured mess" and business intelligence.`,
      tags: ["$50B TAM", "Regulatory Tailwind", "AI Revolution"],
      icon: <Rocket sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)",
    },
    {
      number: "08",
      title: "Investment & Use of Funds",
      content: `£50,000 pre-seed raise. SEIS eligible (50% tax relief). Funds: 60% Product Dev, 25% Sales/Marketing, 15% Legal & SEIS costs. 18-month runway.`,
      tags: ["£50k Raise", "SEIS", "18mo Runway"],
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fafbff", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip
            label="Confidential Pitch Deck • SEIS Investment Opportunity"
            sx={{
              backgroundColor: "#6a0dad",
              color: "white",
              fontWeight: "bold",
              mb: 3,
              px: 2,
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
              backgroundClip: "text",
            }}
          >
            Revise Tech
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#666", maxWidth: "800px", mx: "auto" }}
          >
            Intelligent Document Processing • Universal Design • CRM Native
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {deckSlides.map((slide) => (
            <Grid item xs={12} md={6} lg={4.5} key={slide.number}>
              <Card
                sx={{
                  background: slide.gradient,
                  borderRadius: "24px",
                  boxShadow: "0 12px 40px rgba(106, 13, 173, 0.08)",
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(106, 13, 173, 0.1)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 60px rgba(106, 13, 173, 0.15)",
                  },
                }}
              >
                {/* Slide Number at Top Right */}
                <Typography
                  variant="h1"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 24,
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "rgba(106, 13, 173, 0.15)",
                    lineHeight: 1,
                  }}
                >
                  {slide.number}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(106, 13, 173, 0.1)",
                      borderRadius: "16px",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(slide.icon, {
                      sx: { fontSize: 36, color: "#6a0dad" },
                    })}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#333", pr: 6 }}
                  >
                    {slide.title}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#444",
                    lineHeight: 1.7,
                    mb: 4,
                    flexGrow: 1,
                    fontSize: "1rem",
                  }}
                >
                  {slide.content}
                </Typography>

                <Box sx={{ mt: "auto" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}
                  >
                    {slide.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(106, 13, 173, 0.08)",
                          color: "#6a0dad",
                          fontWeight: "600",
                          borderRadius: "12px",
                        }}
                      />
                    ))}
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* Slide Number Footer */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#999", fontWeight: "500" }}
                    >
                      Slide {slide.number}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6a0dad", fontWeight: "bold" }}
                    >
                      Confidential
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer CTA */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #1a1a1a, #2a2a2a)",
              borderRadius: "25px",
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #2a2a2a, #3a3a3a)",
              },
            }}
            onClick={() => (window.location.href = "/contact-founder")}
            endIcon={<ArrowForward />}
          >
            Request Full Pitch Deck & Financials
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// ==============================================
// Main Export for Routing
// ==============================================
const ContactFounderPage = () => {
  return <FounderContact />;
};

export default ContactFounderPage;
