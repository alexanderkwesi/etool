import React, { useState } from "react";
import SlideCard from "./SlideCard";
import VerticalCarousel from "./VerticalCarousel";
import { INITIAL_DECK_DATA } from "./constants";
import { generatePptx } from "./pptxGenerator";
import Logo from "./image/favicon-png.png";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Stack,
  IconButton,
  Avatar,
  Divider,
  Fade,
  Grow,
  Zoom,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  MonetizationOn,
  Group,
  Timeline,
  Shield,
  PictureAsPdf,
  Visibility,
  Share,
  MenuBook,
  School,
  Verified,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  border: "1px solid rgba(106, 13, 173, 0.1)",
  boxShadow: "0 8px 32px rgba(106, 13, 173, 0.1)",
}));

const BeveledBackground = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(145deg, #f8f9ff 0%, #432f52 20%, #dfd6e8 80%, #f8f9ff 100%)",
    transform: "skewY(-3deg) scale(1.1)",
    transformOrigin: "top left",
    zIndex: -1,
  },
}));

const ParentComponent = () => {
  const [deckData, setDeckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [filter, setFilter] = useState("all");
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    // Simulate async data fetch
    setTimeout(() => {
      setDeckData(INITIAL_DECK_DATA);
      setLoading(false);
    }, 800);
  }, []);

  // Filter slides based on category
  const getFilteredSlides = () => {
    if (!deckData) return [];
    if (filter === "all") return deckData.slides;

    const categoryMap = {
      financial: [0, 3, 4, 5, 8],
      market: [2, 3],
      team: [6, 7],
      investment: [4, 5, 8],
    };

    return deckData.slides.filter((_, index) =>
      categoryMap[filter]?.includes(index),
    );
  };

  const handleDownload = async () => {
    if (!deckData) return;

    setDownloadLoading(true);
    try {
      await generatePptx(deckData);
      setSnackbar({
        open: true,
        message: "Presentation downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error downloading presentation. Please try again.",
        severity: "error",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePreview = (index) => {
    setSelectedSlideIndex(index);
    setCarouselOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading Skeleton with animation
  if (loading) {
    return (
      <BeveledBackground>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated background particles */}
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                borderRadius: "50%",
                background: "rgba(106, 13, 173, 0.1)",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s linear infinite`,
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-20px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            />
          ))}

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: "center", color: "#6a0dad", mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  Loading Presentation...
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.8, color: "#8a2be2" }}
                >
                  Preparing your investment pitch deck
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={3} justifyContent="center">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <Grow in timeout={500 + index * 100} key={item}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      sx={{
                        height: 300,
                        background: "rgba(106, 13, 173, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid rgba(106, 13, 173, 0.1)",
                        animation: "pulse 2s ease-in-out infinite",
                        "@keyframes pulse": {
                          "0%": { opacity: 0.6, transform: "scale(1)" },
                          "50%": { opacity: 1, transform: "scale(1.02)" },
                          "100%": { opacity: 0.6, transform: "scale(1)" },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 70,
                          background:
                            "linear-gradient(90deg, #6a0dad, #8a2be2)",
                        }}
                      />
                      <Box sx={{ p: 3 }}>
                        <Box
                          sx={{
                            height: 20,
                            width: "70%",
                            background: "rgba(106, 13, 173, 0.2)",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <Box
                          sx={{
                            height: 20,
                            width: "50%",
                            background: "rgba(106, 13, 173, 0.2)",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <Box
                          sx={{
                            height: 20,
                            width: "90%",
                            background: "rgba(106, 13, 173, 0.2)",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </Container>
        </Box>
      </BeveledBackground>
    );
  }

  if (!deckData || !deckData.slides) {
    return (
      <BeveledBackground>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zoom in timeout={500}>
            <Paper
              sx={{
                p: 6,
                borderRadius: 4,
                textAlign: "center",
                maxWidth: 500,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: "5rem",
                  mb: 2,
                  animation: "bounce 2s infinite",
                }}
              >
                📄
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 2, color: "#6a0dad" }}
              >
                No Slides Available
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                Unable to load the presentation data. Please try again.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.reload()}
                sx={{
                  background: "linear-gradient(45deg, #bf95dc, #d8d2de)",
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    background: "linear-gradient(45deg, #b8a7ca, #846b9f)",
                  },
                }}
              >
                Try Again
              </Button>
            </Paper>
          </Zoom>
        </Box>
      </BeveledBackground>
    );
  }

  const filteredSlides = getFilteredSlides();

  return (
    <BeveledBackground>
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          py: 4,
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(106,13,173,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(138,43,226,0.2) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "pulse 10s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          {/* Header Section */}
                {/* Header - Matches original styling */}
                <header
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 40px rgba(106, 13, 173, 0.08)",
                    borderBottom: "1px solid #f8f9fa",
                    position: "fixed",
                    top: 0,
                    left:0,
                    margin:"auto auto 0px 0px",
                    zIndex: 1000,
                    width:"100%",

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
                          alt="DocRevisor"
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
                            }}
                          >
                            DocRevisor
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            SEIS • Pre-Seed • £50k
                          </Typography>
                        </Box>
                      </Box>
          
                      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                        {[
                          ["Financials", "/financials"],
                          ["SEIS", "/seis"],
                          ["Visa Roadmap", "/visa"],
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
                            onClick={() => (window.location.href = item[1])}
                          >
                            {item[0]}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Container>
                </header>
          <GlassCard elevation={24} sx={{ m: 8 }}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #644474 0%, #c8b3de 100%)",
                p: 4,
                color: "white",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Chip
                    label="🚀 SEIS READY INVESTMENT OPPORTUNITY"
                    sx={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(5px)",
                    }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {deckData.companyName}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
                    {deckData.tagline}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                  >
                    <Chip
                      icon={<MonetizationOn />}
                      label="£72k ARR"
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                    <Chip
                      icon={<Group />}
                      label="5,000+ Users"
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                    <Chip
                      icon={<LocationOn />}
                      label="Warrington, UK"
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                    <Chip
                      icon={<School />}
                      label="Graduate Visa → Innovator Founder"
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ textAlign: { xs: "left", md: "right" } }}
                >
                  <Stack
                    direction={{ xs: "row", md: "column" }}
                    spacing={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PictureAsPdf />}
                      onClick={handleDownload}
                      disabled={downloadLoading}
                      sx={{
                        background: "white",
                        color: "#6a0dad",
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 700,
                        "&:hover": {
                          background: "#f0f0f0",
                        },
                        "&:disabled": {
                          opacity: 0.7,
                        },
                      }}
                    >
                      {downloadLoading ? "Generating..." : "Download Deck"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Visibility />}
                      onClick={() => handlePreview(0)}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "white",
                          background: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Preview
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Stats Bar */}
            <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
              <Grid container spacing={3}>
                <Grid item xs={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#6a0dad" }}
                  >
                    {deckData.slides.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Total Slides
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#6a0dad" }}
                  >
                    £50k
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    SEIS Round
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#6a0dad" }}
                  >
                    50%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Tax Relief
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "#6a0dad" }}
                  >
                    18m
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Runway
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Navigation Tabs */}
            <Box
              sx={{
                p: 2,
                background: "#f8f9fa",
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="All Slides"
                onClick={() => setFilter("all")}
                color={filter === "all" ? "primary" : "default"}
                sx={{ fontWeight: 600, cursor: "pointer" }}
              />
              <Chip
                label="Financials"
                onClick={() => setFilter("financial")}
                color={filter === "financial" ? "primary" : "default"}
                sx={{ fontWeight: 600, cursor: "pointer" }}
              />
              <Chip
                label="Market"
                onClick={() => setFilter("market")}
                color={filter === "market" ? "primary" : "default"}
                sx={{ fontWeight: 600, cursor: "pointer" }}
              />
              <Chip
                label="Team"
                onClick={() => setFilter("team")}
                color={filter === "team" ? "primary" : "default"}
                sx={{ fontWeight: 600, cursor: "pointer" }}
              />
              <Chip
                label="Investment"
                onClick={() => setFilter("investment")}
                color={filter === "investment" ? "primary" : "default"}
                sx={{ fontWeight: 600, cursor: "pointer" }}
              />
            </Box>
          </GlassCard>

          {/* Pitch Deck Title */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "white",
                textShadow: "2px 2px 4px rgba(106,13,173,0.3)",
                mb: 1,
              }}
            >
              Pitch Deck Preview
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {filter === "all"
                ? "Review the complete investment presentation"
                : `Viewing ${filter} slides`}
            </Typography>
            <Divider
              sx={{
                width: 100,
                mx: "auto",
                mt: 2,
                borderColor: "rgba(255,255,255,0.3)",
                borderWidth: 2,
              }}
            />
          </Box>

          {/* Slides Grid */}
          <Grid container spacing={3} justifyContent="center">
            {filteredSlides.map((slide, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    transform: "perspective(1000px) rotateX(0deg)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform:
                        "perspective(1000px) rotateX(2deg) translateY(-12px) scale(1.02)",
                    },
                  }}
                  onMouseEnter={() => setActiveSlide(index)}
                  onMouseLeave={() => setActiveSlide(0)}
                >
                  <SlideCard
                    slide={slide}
                    index={index}
                    onClick={() => handlePreview(index)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Slide Numbers Indicator */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {filteredSlides.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  const element = document.getElementById(`slide-${index}`);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    index === activeSlide
                      ? "linear-gradient(135deg, #6a0dad, #8a2be2)"
                      : "rgba(106,13,173,0.2)",
                  color:
                    index === activeSlide ? "white" : "rgba(106,13,173,0.8)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  fontWeight: 600,
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(106,13,173,0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a0dad, #8a2be2)",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {index + 1}
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <GlassCard sx={{ mt: 6, p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: "linear-gradient(135deg, #6a0dad, #8a2be2)",
                      mr: 2,
                    }}
                  >
                    AK
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#6a0dad" }}
                    >
                      Alexander Oluwaseun Kwesi
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Founder & CEO
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 20, color: "#6a0dad" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      seankwesi24@googlemail.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone sx={{ fontSize: 20, color: "#6a0dad" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      +44 7342 622033
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ fontSize: 20, color: "#6a0dad" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Warrington, UK
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#6a0dad", mb: 2 }}
                >
                  Investment Details
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Verified sx={{ fontSize: 20, color: "#4caf50" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      SEIS Advance Assurance in Progress
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MonetizationOn sx={{ fontSize: 20, color: "#4caf50" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      £50,000 Pre-seed Round
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Shield sx={{ fontSize: 20, color: "#4caf50" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      50% Tax Relief Available
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Timeline sx={{ fontSize: 20, color: "#4caf50" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      18-Month Runway
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#6a0dad", mb: 2 }}
                >
                  Connect & Share
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <IconButton
                    sx={{
                      background: "#0077b5",
                      color: "white",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        background: "#005582",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    href="https://linkedin.com/in/alexanderoluwaseunkwesi"
                    target="_blank"
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton
                    sx={{
                      background: "linear-gradient(135deg, #6a0dad, #8a2be2)",
                      color: "white",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a0cad, #7a2ad2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    href="mailto:seankwesi24@googlemail.com"
                  >
                    <Email />
                  </IconButton>
                  <IconButton
                    sx={{
                      background: "#25D366",
                      color: "white",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        background: "#128C7E",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setSnackbar({
                        open: true,
                        message: "Link copied to clipboard!",
                        severity: "success",
                      });
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    sx={{
                      background: "linear-gradient(135deg, #6a0dad, #8a2be2)",
                      color: "white",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a0cad, #7a2ad2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handlePreview(0)}
                  >
                    <MenuBook />
                  </IconButton>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: "#999", display: "block" }}
                >
                  © 2024 {deckData.companyName}. All rights reserved.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#999", display: "block", mt: 0.5 }}
                >
                  Built with ❤️ in Warrington, UK
                </Typography>
              </Grid>
            </Grid>
          </GlassCard>
        </Container>

        {/* Vertical Carousel */}
        <VerticalCarousel
          open={carouselOpen}
          onClose={() => setCarouselOpen(false)}
          slides={deckData.slides}
          initialIndex={selectedSlideIndex}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(106,13,173,0.1)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </BeveledBackground>
  );
};

export default ParentComponent;
