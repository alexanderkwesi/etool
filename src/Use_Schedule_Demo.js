import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  Person,
  Email,
  Phone,
  WhatsApp,
  ContentCopy,
  CheckCircle,
  ArrowForward,
  Schedule,
  EventAvailable,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Logo from "./image/favicon-png.png";

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

const CalendarCard = styled(Card)(({ theme }) => ({
  borderRadius: "24px",
  padding: theme.spacing(4),
  boxShadow: "0 12px 40px rgba(106,13,173,0.08)",
  border: "1px solid rgba(106, 13, 173, 0.1)",
  margin: "0 auto",
  maxWidth: "100%",
}));

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5),
  border: selected ? "2px solid #6a0dad" : "1px solid rgba(106, 13, 173, 0.2)",
  backgroundColor: selected ? "rgba(106, 13, 173, 0.04)" : "transparent",
  color: selected ? "#6a0dad" : "#333",
  "&:hover": {
    border: "2px solid #6a0dad",
    backgroundColor: "rgba(106, 13, 173, 0.04)",
  },
}));

const ScheduleDemo = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "investment",
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Available time slots
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Generate next 7 days
  const getNext7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      });
    }
    return dates;
  };

  const availableDates = getNext7Days();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const generateBookingMessage = () => {
    return (
      `*DocRevisor Demo Booking Confirmation*%0A%0A` +
      `📅 Date: ${new Date(selectedDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}%0A` +
      `⏰ Time: ${selectedTime}%0A` +
      `👤 Name: ${formData.name}%0A` +
      `📧 Email: ${formData.email}%0A` +
      `📞 Phone: ${formData.phone}%0A` +
      `🏢 Company: ${formData.company || "Not provided"}%0A` +
      `💼 Interest: ${formData.interest === "investment" ? "Investment (SEIS)" : "Enterprise Customer"}%0A%0A` +
      `_Thank you for booking a demo with DocRevisor. We look forward to speaking with you!_`
    );
  };

  const handleBookAppointment = () => {
    const booking = {
      date: selectedDate,
      time: selectedTime,
      ...formData,
      bookingId: `DR-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    setBookingDetails(booking);
    setStep(3);
  };

  const handleSendWhatsApp = () => {
    const message = generateBookingMessage();
    const whatsappUrl = `https://wa.me/447342262203?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyDetails = () => {
    const details = generateBookingMessage().replace(/%0A/g, "\n");
    navigator.clipboard.writeText(details);
    setSnackbarMessage("Booking details copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleEmailCopy = () => {
    const subject = "DocRevisor Demo Booking Confirmation";
    const body = generateBookingMessage().replace(/%0A/g, "\n");
    const mailtoUrl = `mailto:seankwesi24@googlemaail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleNextStep = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (
      step === 2 &&
      formData.name &&
      formData.email &&
      formData.phone
    ) {
      handleBookAppointment();
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fafbff", minHeight: "100vh" }}>
      {/* Enterprise Header - LEFT ALONE */}
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
                src={Logo}
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
              label="10-Minute Demo • SEIS Investment Opportunity"
              sx={{
                mb: 3,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #6a0dad15, #8a2be215)",
                color: "#6a0dad",
                border: "1px solid rgba(106, 13, 173, 0.2)",
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
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Schedule a Demo
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}
            >
              See how DocRevisor transforms unstructured data into accessible
              CRM intelligence. 10 minutes is all we need.
            </Typography>
          </Box>
        </Container>
      </CenteredSection>

      {/* Booking Progress - CENTERED */}
      <CenteredSection sx={{ py: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<EventAvailable />}
                label="Step 1: Select Time"
                color={step >= 1 ? "secondary" : "default"}
                sx={{
                  bgcolor: step >= 1 ? "#6a0dad" : "transparent",
                  color: step >= 1 ? "white" : "#666",
                  border: "1px solid rgba(106, 13, 173, 0.2)",
                }}
              />
              <ArrowForward sx={{ color: "#ccc" }} />
              <Chip
                icon={<Person />}
                label="Step 2: Your Details"
                color={step >= 2 ? "secondary" : "default"}
                sx={{
                  bgcolor: step >= 2 ? "#6a0dad" : "transparent",
                  color: step >= 2 ? "white" : "#666",
                  border: "1px solid rgba(106, 13, 173, 0.2)",
                }}
              />
              <ArrowForward sx={{ color: "#ccc" }} />
              <Chip
                icon={<CheckCircle />}
                label="Step 3: Confirmation"
                color={step >= 3 ? "secondary" : "default"}
                sx={{
                  bgcolor: step >= 3 ? "#6a0dad" : "transparent",
                  color: step >= 3 ? "white" : "#666",
                  border: "1px solid rgba(106, 13, 173, 0.2)",
                }}
              />
            </Stack>
          </Box>
        </Container>
      </CenteredSection>

      {/* Booking Calendar - CENTERED */}
      <CenteredSection sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <CalendarCard>
            {step === 1 && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 4,
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  Select Your Preferred Date & Time
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                  {/* Date Selection */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", mb: 2, textAlign: "center" }}
                    >
                      <CalendarMonth sx={{ mr: 1, verticalAlign: "middle" }} />
                      Available Dates
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                      {availableDates.map((date) => (
                        <Grid item xs={6} sm={4} key={date.value}>
                          <Button
                            fullWidth
                            variant={
                              selectedDate === date.value
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => handleDateSelect(date.value)}
                            sx={{
                              borderRadius: "12px",
                              py: 1.5,
                              borderColor: "rgba(106, 13, 173, 0.3)",
                              backgroundColor:
                                selectedDate === date.value
                                  ? "#6a0dad"
                                  : "transparent",
                              color:
                                selectedDate === date.value ? "white" : "#333",
                              "&:hover": {
                                backgroundColor:
                                  selectedDate === date.value
                                    ? "#5a0cad"
                                    : "rgba(106, 13, 173, 0.04)",
                              },
                            }}
                          >
                            {date.display}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Time Selection */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", mb: 2, textAlign: "center" }}
                    >
                      <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                      Available Times (UK Time)
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                      {timeSlots.map((time) => (
                        <Grid item xs={4} sm={3} key={time}>
                          <TimeSlotButton
                            fullWidth
                            selected={selectedTime === time}
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </TimeSlotButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNextStep}
                    sx={{
                      background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                      borderRadius: "25px",
                      px: 6,
                      py: 1.5,
                      fontSize: "1.1rem",
                    }}
                  >
                    Continue to Your Details
                  </Button>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 4,
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  Tell Us About Yourself
                </Typography>

                <Box sx={{ maxWidth: "500px", mx: "auto" }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Company (Optional)"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>I'm interested as...</InputLabel>
                      <Select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        label="I'm interested as..."
                        sx={{ borderRadius: "12px" }}
                      >
                        <MenuItem value="investment">Investor (SEIS)</MenuItem>
                        <MenuItem value="enterprise">
                          Enterprise Customer
                        </MenuItem>
                        <MenuItem value="partner">Partner/Reseller</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setStep(1)}
                        sx={{
                          borderColor: "#6a0dad",
                          color: "#6a0dad",
                          borderRadius: "25px",
                          px: 4,
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        disabled={
                          !formData.name || !formData.email || !formData.phone
                        }
                        onClick={handleNextStep}
                        sx={{
                          background:
                            "linear-gradient(45deg, #6a0dad, #8a2be2)",
                          borderRadius: "25px",
                          px: 4,
                        }}
                      >
                        Book Demo
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            )}

            {step === 3 && bookingDetails && (
              <Box>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <CheckCircle sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                  >
                    Booking Confirmed!
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    Your demo is scheduled. Please save or share these details:
                  </Typography>
                </Box>

                <Card
                  sx={{
                    maxWidth: "500px",
                    mx: "auto",
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "#f8f9ff",
                    border: "1px solid rgba(106, 13, 173, 0.1)",
                    mb: 4,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 1 }}>
                    Booking Reference: {bookingDetails.bookingId}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarMonth sx={{ color: "#6a0dad", mr: 2 }} />
                      <Typography>
                        {new Date(bookingDetails.date).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime sx={{ color: "#6a0dad", mr: 2 }} />
                      <Typography>{bookingDetails.time} (UK Time)</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person sx={{ color: "#6a0dad", mr: 2 }} />
                      <Typography>{bookingDetails.name}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email sx={{ color: "#6a0dad", mr: 2 }} />
                      <Typography>{bookingDetails.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone sx={{ color: "#6a0dad", mr: 2 }} />
                      <Typography>{bookingDetails.phone}</Typography>
                    </Box>
                  </Stack>
                </Card>

                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", mb: 3, color: "#333" }}
                >
                  Share or Save Your Booking
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    onClick={handleSendWhatsApp}
                    sx={{
                      backgroundColor: "#25D366",
                      borderRadius: "25px",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#128C7E",
                      },
                    }}
                  >
                    Send via WhatsApp
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Email />}
                    onClick={handleEmailCopy}
                    sx={{
                      backgroundColor: "#6a0dad",
                      borderRadius: "25px",
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Send via Email
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyDetails}
                    sx={{
                      borderColor: "#6a0dad",
                      color: "#6a0dad",
                      borderRadius: "25px",
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Copy Details
                  </Button>
                </Stack>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    A confirmation has been sent to our team. We'll contact you
                    shortly.
                  </Typography>
                </Box>
              </Box>
            )}
          </CalendarCard>
        </Container>
      </CenteredSection>

      {/* Footer - LEFT ALONE */}
      <footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "60px 0 30px",
          marginTop: "60px",
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduleDemo;
