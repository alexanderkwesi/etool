import React, { useState, useEffect } from "react";
import { Dialog, Box, IconButton, Typography, Fade, Zoom, Chip } from "@mui/material";
import {
  Close,
  ArrowUpward,
  ArrowDownward,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const CarouselContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  background: "rgba(250,240,250,0.95)",
  backdropFilter: "blur(10px)",
}));

const ThumbnailColumn = styled(Box)(({ theme }) => ({
  width: 120,
  overflowY: "auto",
  padding: theme.spacing(2),
  "&::-webkit-scrollbar": {
    width: 4,
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255,255,255,0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.3)",
    borderRadius: 4,
  },
}));

const Thumbnail = styled(Box)(({ active }) => ({
  height: 80,
  marginBottom: 8,
  borderRadius: 8,
  overflow: "hidden",
  cursor: "pointer",
  border: active ? "3px solid #667eea" : "2px solid transparent",
  opacity: active ? 1 : 0.6,
  transition: "all 0.3s ease",
  "&:hover": {
    opacity: 1,
    transform: "scale(1.05)",
  },
}));

const MainSlideContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
}));

const SlideWrapper = styled(Box)(({ theme }) => ({
  width: "80%",
  maxWidth: 1000,
  height: "70vh",
  background: "white",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
  transform: "perspective(1200px) rotateX(0deg)",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "perspective(1200px) rotateX(1deg) scale(1.02)",
  },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 40,
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
  color: "white",
  width: 56,
  height: 56,
  "&:hover": {
    background: "rgba(255,255,255,0.3)",
    transform: "scale(1.1)",
  },
  transition: "all 0.3s ease",
  zIndex: 10,
}));

const VerticalCarousel = ({ open, onClose, slides, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fullscreen, setFullscreen] = useState(false);
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection("down");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection("up");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") handlePrev();
    if (e.key === "ArrowDown") handleNext();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const getSlideStyle = (index) => {
    if (index === currentIndex) return { opacity: 1, transform: "scale(1)" };
    if (index === currentIndex - 1)
      return { opacity: 0.3, transform: "scale(0.9) translateY(-30px)" };
    if (index === currentIndex + 1)
      return { opacity: 0.3, transform: "scale(0.9) translateY(30px)" };
    return { opacity: 0, transform: "scale(0.8)" };
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      transitionDuration={500}
      PaperProps={{
        sx: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <CarouselContainer>
        {/* Thumbnail Column */}
        <ThumbnailColumn>
          {slides.map((slide, idx) => (
            <Thumbnail
              key={idx}
              active={idx === currentIndex}
              onClick={() => setCurrentIndex(idx)}
            >
              <Box
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${
                    idx === currentIndex ? "#667eea" : "#71849c"
                  }, ${idx === currentIndex ? "#764ba2" : "#8b93a7"})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {idx + 1}
              </Box>
            </Thumbnail>
          ))}
        </ThumbnailColumn>

        {/* Main Slide Area */}
        <MainSlideContainer>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <NavButton onClick={handlePrev} sx={{ top: "10%" }}>
                <ArrowUpward />
              </NavButton>
            )}

            {currentIndex < slides.length - 1 && (
              <NavButton onClick={handleNext} sx={{ bottom: "10%" }}>
                <ArrowDownward />
              </NavButton>
            )}

            {/* Slide Display */}
            <SlideWrapper>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Slide Header */}
                <Box
                  sx={{
                    height: 80,
                    background: `linear-gradient(135deg, #0a1a3f, #1a2f5f)`,
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    {slides[currentIndex].title}
                  </Typography>
                  <Chip
                    label={`${currentIndex + 1}/${slides.length}`}
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Slide Content */}
                <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>
                  {slides[currentIndex].subtitle && (
                    <Typography
                      variant="h6"
                      sx={{ color: "#667eea", fontWeight: 600, mb: 3 }}
                    >
                      {slides[currentIndex].subtitle}
                    </Typography>
                  )}

                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                    {slides[currentIndex].points.map((point, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          background: "#f8f9fa",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "#edf2f7",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        <Typography
                          sx={{ color: "#667eea", fontWeight: "bold" }}
                        >
                          {i + 1}.
                        </Typography>
                        <Typography sx={{ color: "#2d3748" }}>
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Visual Hint */}
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: 3,
                      border: "1px dashed #667eea",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#4a5568", fontStyle: "italic" }}
                    >
                      🎨 Visual:{" "}
                      {slides[currentIndex].visualHint ||
                        "Standard presentation layout"}
                    </Typography>
                  </Box>
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    height: 50,
                    background: "#f8f9fa",
                    borderTop: "1px solid #e2e8f0",
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#718096" }}>
                    © 2024 IDP Direct | Warrington | SEIS Ready
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                    Slide {currentIndex + 1} of {slides.length}
                  </Typography>
                </Box>
              </Box>
            </SlideWrapper>

            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                "&:hover": {
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <Close />
            </IconButton>

            {/* Fullscreen Toggle */}
            <IconButton
              onClick={() => setFullscreen(!fullscreen)}
              sx={{
                position: "absolute",
                top: 20,
                right: 80,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                "&:hover": {
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
        </MainSlideContainer>
      </CarouselContainer>
    </Dialog>
  );
};

export default VerticalCarousel;
