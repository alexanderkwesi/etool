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
  InputAdornment,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  LocationOn,
  Coffee,
  AccessTime,
  Person,
  Email,
  Phone,
  WhatsApp,
  ContentCopy,
  CheckCircle,
  Star,
  Map,
  Directions,
  Schedule,
  CalendarMonth,
  LocalCafe,
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

const CoffeeSpotCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  padding: theme.spacing(3),
  boxShadow: "0 8px 40px rgba(106,13,173,0.08)",
  border: "1px solid rgba(106, 13, 173, 0.1)",
  height: "100%",
  transition: "all 0.3s ease",
  margin: "0 auto",
  maxWidth: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 16px 60px rgba(106,13,173,0.15)",
  },
}));

const CoffeeMeetUp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Coffee spots database
  const coffeeSpots = [
    {
      id: 1,
      name: "Foundation Coffee House",
      location: "Manchester City Centre",
      address: "Sevendale House, Lever St, Manchester M1 1JB",
      distance: "0.2 miles from Manchester Piccadilly",
      rating: 4.8,
      reviews: 324,
      vibe: "Creative • Co-working friendly",
      wifi: true,
      outdoor: true,
      parking: false,
      image: "☕",
      coordinates: { lat: 53.4809, lng: -2.2374 },
      description: "Popular with tech startups and remote workers. Great coffee and plenty of power outlets.",
    },
    {
      id: 2,
      name: "Takk",
      location: "Manchester Northern Quarter",
      address: "6 Tariff St, Manchester M1 2FF",
      distance: "0.3 miles from Manchester Piccadilly",
      rating: 4.9,
      reviews: 256,
      vibe: "Minimalist • High-end coffee",
      wifi: true,
      outdoor: true,
      parking: false,
      image: "☕",
      coordinates: { lat: 53.4812, lng: -2.2368 },
      description: "Nordic-inspired coffee shop. Perfect for investor meetings.",
    },
    {
      id: 3,
      name: "Idle Hands",
      location: "Manchester Northern Quarter",
      address: "51-53 Thomas St, Manchester M4 1NA",
      distance: "0.4 miles from Manchester Piccadilly",
      rating: 4.7,
      reviews: 189,
      vibe: "Vintage • Artsy",
      wifi: true,
      outdoor: false,
      parking: false,
      image: "☕",
      coordinates: { lat: 53.4831, lng: -2.2381 },
      description: "Unique atmosphere, great for creative conversations.",
    },
    {
      id: 4,
      name: "Fig & Sparrow",
      location: "Warrington Town Centre",
      address: "76 Bridge St, Warrington WA1 2RJ",
      distance: "0.1 miles from Warrington Central",
      rating: 4.6,
      reviews: 145,
      vibe: "Cosy • Independent",
      wifi: true,
      outdoor: true,
      parking: true,
      image: "☕",
      coordinates: { lat: 53.3901, lng: -2.5950 },
      description: "Independent coffee shop with great pastries. Quiet atmosphere for meetings.",
    },
    {
      id: 5,
      name: "Costa Coffee (Gateway)",
      location: "Warrington",
      address: "Cockhedge Way, Warrington WA1 2AZ",
      distance: "0.3 miles from Warrington Central",
      rating: 4.2,
      reviews: 234,
      vibe: "Reliable • Consistent",
      wifi: true,
      outdoor: true,
      parking: true,
      image: "☕",
      coordinates: { lat: 53.3928, lng: -2.5960 },
      description: "Convenient location in the shopping centre. Plenty of space.",
    },
    {
      id: 6,
      name: "Caffè Nero",
      location: "Stockton Heath, Warrington",
      address: "19 London Rd, Stockton Heath, Warrington WA4 6HN",
      distance: "2.5 miles from Warrington Central",
      rating: 4.4,
      reviews: 167,
      vibe: "Suburban • Relaxed",
      wifi: true,
      outdoor: true,
      parking: true,
      image: "☕",
      coordinates: { lat: 53.3714, lng: -2.5847 },
      description: "Popular village location with street parking available.",
    },
    {
      id: 7,
      name: "Ezra & Gil",
      location: "Manchester",
      address: "20 Hilton St, Manchester M1 1EL",
      distance: "0.3 miles from Manchester Piccadilly",
      rating: 4.8,
      reviews: 212,
      vibe: "Modern • Instagrammable",
      wifi: true,
      outdoor: true,
      parking: false,
      image: "☕",
      coordinates: { lat: 53.4805, lng: -2.2380 },
      description: "Stylish coffee shop with excellent brunch options.",
    },
    {
      id: 8,
      name: "Pot Kettle Black",
      location: "Manchester",
      address: "48 Barton Arcade, Manchester M3 2BH",
      distance: "0.8 miles from Manchester Piccadilly",
      rating: 4.7,
      reviews: 178,
      vibe: "Arcade setting • Unique",
      wifi: true,
      outdoor: false,
      parking: false,
      image: "☕",
      coordinates: { lat: 53.4825, lng: -2.2445 },
      description: "Beautiful setting in the Barton Arcade. Impressive for investor meetings.",
    },
    {
      id: 9,
      name: "The Apothecary",
      location: "Warrington",
      address: "17 Winwick St, Warrington WA2 7TT",
      distance: "0.4 miles from Warrington Central",
      rating: 4.5,
      reviews: 98,
      vibe: "Quirky • Independent",
      wifi: true,
      outdoor: true,
      parking: true,
      image: "☕",
      coordinates: { lat: 53.3941, lng: -2.5972 },
      description: "Hidden gem with character. Great for casual meetings.",
    },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  const getNext7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-GB', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const availableDates = getNext7Days();

  const filteredSpots = coffeeSpots.filter((spot) => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "warrington") {
      return matchesSearch && spot.location.includes("Warrington");
    } else if (filterType === "manchester") {
      return matchesSearch && spot.location.includes("Manchester");
    }
    return matchesSearch;
  });

  const handleBookSpot = (spot) => {
    setSelectedSpot(spot);
    setBookingDialogOpen(true);
    setBookingConfirmed(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarOpen(true);
      return;
    }

    const booking = {
      id: `CM-${Date.now().toString().slice(-6)}`,
      spot: selectedSpot,
      date: selectedDate,
      time: selectedTime,
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    setBookingDetails(booking);
    setBookingConfirmed(true);
  };

  const generateBookingMessage = () => {
    if (!bookingDetails) return "";
    
    return `*Coffee Meetup with DocRevisor Founder*%0A%0A` +
      `📍 Location: ${bookingDetails.spot.name}%0A` +
      `📋 Address: ${bookingDetails.spot.address}%0A` +
      `📅 Date: ${new Date(bookingDetails.date).toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}%0A` +
      `⏰ Time: ${bookingDetails.time}%0A` +
      `👤 Your Name: ${bookingDetails.name}%0A` +
      `📧 Email: ${bookingDetails.email}%0A` +
      `📞 Phone: ${bookingDetails.phone}%0A` +
      `📝 Notes: ${bookingDetails.notes || 'No additional notes'}%0A%0A` +
      `_Looking forward to meeting you for coffee!_`;
  };

  const handleSendWhatsApp = () => {
    const message = generateBookingMessage();
    const whatsappUrl = `https://wa.me/447342262203?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyDetails = () => {
    const details = generateBookingMessage().replace(/%0A/g, '\n');
    navigator.clipboard.writeText(details);
    setSnackbarMessage("Booking details copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleEmailCopy = () => {
    const subject = "Coffee Meetup with DocRevisor Founder";
    const body = generateBookingMessage().replace(/%0A/g, '\n');
    const mailtoUrl = `mailto:seankwesi24@googlemaail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleGetDirections = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const resetBooking = () => {
    setSelectedSpot(null);
    setBookingDialogOpen(false);
    setBookingConfirmed(false);
    setSelectedDate("");
    setSelectedTime("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: "",
    });
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
              icon={<LocalCafe />}
              label="Coffee with the Founder • Warrington to Manchester"
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
              Coffee & Conversation
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}
            >
              Choose a coffee spot between Warrington and Manchester. Let's
              discuss how DocRevisor is transforming document intelligence.
            </Typography>
          </Box>
        </Container>
      </CenteredSection>

      {/* Search and Filter - CENTERED */}
      <CenteredSection sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "24px",
              backgroundColor: "white",
              border: "1px solid rgba(106, 13, 173, 0.1)",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  placeholder="Search coffee spots by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#6a0dad" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: "12px" }}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="warrington">Warrington Area</MenuItem>
                    <MenuItem value="manchester">Manchester Area</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </CenteredSection>

      {/* Coffee Spots Grid - CENTERED */}
      <CenteredSection sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            sx={{ textAlign: "center", mb: 4, color: "#333" }}
          >
            Found {filteredSpots.length} coffee spots
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {filteredSpots.map((spot) => (
              <Grid item xs={12} md={6} lg={4} key={spot.id}>
                <CoffeeSpotCard>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        backgroundColor: "rgba(106, 13, 173, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        mr: 2,
                      }}
                    >
                      {spot.image}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                        {spot.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {spot.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn sx={{ fontSize: 18, color: "#6a0dad", mr: 1 }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {spot.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Map sx={{ fontSize: 18, color: "#6a0dad", mr: 1 }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {spot.distance}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ fontSize: 18, color: "#ff9800", mr: 1 }} />
                      <Rating value={spot.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: "#666" }}>
                        ({spot.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mb: 2, fontStyle: "italic" }}
                  >
                    "{spot.description}"
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={spot.vibe}
                      size="small"
                      sx={{
                        mr: 1,
                        backgroundColor: "rgba(106, 13, 173, 0.1)",
                        color: "#6a0dad",
                      }}
                    />
                    {spot.wifi && (
                      <Chip
                        label="WiFi"
                        size="small"
                        sx={{
                          mr: 1,
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          color: "#4caf50",
                        }}
                      />
                    )}
                    {spot.outdoor && (
                      <Chip
                        label="Outdoor"
                        size="small"
                        sx={{
                          backgroundColor: "rgba(33, 150, 243, 0.1)",
                          color: "#2196f3",
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Directions />}
                      onClick={() => handleGetDirections(spot.address)}
                      sx={{
                        borderColor: "#6a0dad",
                        color: "#6a0dad",
                        borderRadius: "12px",
                      }}
                    >
                      Directions
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Coffee />}
                      onClick={() => handleBookSpot(spot)}
                      sx={{
                        background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                        borderRadius: "12px",
                      }}
                    >
                      Book Meet
                    </Button>
                  </Box>
                </CoffeeSpotCard>
              </Grid>
            ))}
          </Grid>

          {filteredSpots.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <LocalCafe sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#666" }}>
                No coffee spots found matching your search
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                sx={{ mt: 2, borderColor: "#6a0dad", color: "#6a0dad" }}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </Container>
      </CenteredSection>

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={() => !bookingConfirmed && setBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 2,
          },
        }}
      >
        {!bookingConfirmed ? (
          <>
            <DialogTitle>
              <Box sx={{ textAlign: "center" }}>
                <LocalCafe sx={{ fontSize: 48, color: "#6a0dad", mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                  Book Coffee with Alexander
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#666" }}>
                  at {selectedSpot?.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
                    Select Date
                  </Typography>
                  <Grid container spacing={1}>
                    {availableDates.map((date) => (
                      <Grid item xs={4} key={date.value}>
                        <Button
                          fullWidth
                          variant={selectedDate === date.value ? "contained" : "outlined"}
                          onClick={() => setSelectedDate(date.value)}
                          sx={{
                            borderRadius: "8px",
                            borderColor: "rgba(106, 13, 173, 0.3)",
                            backgroundColor: selectedDate === date.value ? "#6a0dad" : "transparent",
                            color: selectedDate === date.value ? "white" : "#333",
                          }}
                        >
                          {date.display}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
                    Select Time
                  </Typography>
                  <Grid container spacing={1}>
                    {timeSlots.map((time) => (
                      <Grid item xs={4} key={time}>
                        <Button
                          fullWidth
                          variant={selectedTime === time ? "contained" : "outlined"}
                          onClick={() => setSelectedTime(time)}
                          sx={{
                            borderRadius: "8px",
                            borderColor: "rgba(106, 13, 173, 0.3)",
                            backgroundColor: selectedTime === time ? "#6a0dad" : "transparent",
                            color: selectedTime === time ? "white" : "#333",
                          }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider />

                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <TextField
                  fullWidth
                  label="Anything you'd like to discuss? (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setBookingDialogOpen(false)}
                sx={{
                  borderColor: "#6a0dad",
                  color: "#6a0dad",
                  borderRadius: "20px",
                  px: 4,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmBooking}
                sx={{
                  background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                  borderRadius: "20px",
                  px: 4,
                }}
              >
                Confirm Booking
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              <Box sx={{ textAlign: "center" }}>
                <CheckCircle sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                  Coffee Meetup Confirmed!
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Reference: {bookingDetails?.id}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Card sx={{ p: 3, backgroundColor: "#f8f9ff", borderRadius: "16px", mb: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn sx={{ color: "#6a0dad", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {bookingDetails?.spot.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {bookingDetails?.spot.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarMonth sx={{ color: "#6a0dad", mr: 2 }} />
                    <Typography>
                      {new Date(bookingDetails?.date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTime sx={{ color: "#6a0dad", mr: 2 }} />
                    <Typography>{bookingDetails?.time}</Typography>
                  </Box>
                </Stack>
              </Card>

              <Typography
                variant="h6"
                sx={{ textAlign: "center", mb: 2, color: "#333" }}
              >
                Share or Save Your Booking
              </Typography>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={handleSendWhatsApp}
                  sx={{
                    backgroundColor: "#25D366",
                    borderRadius: "12px",
                    py: 1.5,
                    "&:hover": { backgroundColor: "#128C7E" },
                  }}
                >
                  Send via WhatsApp
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Email />}
                  onClick={handleEmailCopy}
                  sx={{
                    backgroundColor: "#6a0dad",
                    borderRadius: "12px",
                    py: 1.5,
                  }}
                >
                  Send via Email
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyDetails}
                  sx={{
                    borderColor: "#6a0dad",
                    color: "#6a0dad",
                    borderRadius: "12px",
                    py: 1.5,
                  }}
                >
                  Copy Details
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="outlined"
                onClick={resetBooking}
                sx={{
                  borderColor: "#6a0dad",
                  color: "#6a0dad",
                  borderRadius: "20px",
                  px: 4,
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => handleGetDirections(bookingDetails?.spot.address)}
                sx={{
                  background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
                  borderRadius: "20px",
                  px: 4,
                }}
              >
                Get Directions
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default CoffeeMeetUp;