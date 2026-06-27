import React from "react";
import { Box, Paper, Typography, Chip, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Paper)(({ theme }) => ({
  height: 400,
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
}));

const SlideCard = ({ slide, index, onClick }) => {
  if (!slide) {
    return (
      <StyledCard>
        <Box
          sx={{
            height: 80,
            background: "linear-gradient(90deg, #f44336, #d32f2f)",
          }}
        />
        <Box sx={{ p: 3 }}>
          <Typography color="error">Error Loading Slide</Typography>
        </Box>
      </StyledCard>
    );
  }

  const getSlideType = (title) => {
    const t = title.toLowerCase();
    if (t.includes("vision") || t.includes("close"))
      return { label: "Vision", color: "#9c27b0" };
    if (t.includes("problem")) return { label: "Challenge", color: "#f44336" };
    if (t.includes("solution")) return { label: "Solution", color: "#4caf50" };
    if (t.includes("market")) return { label: "Market", color: "#2196f3" };
    if (t.includes("traction")) return { label: "Traction", color: "#ff9800" };
    if (t.includes("ask")) return { label: "Investment", color: "#6a0dad" };
    return { label: "Slide", color: "#607d8b" };
  };

  const slideType = getSlideType(slide.title);

  return (
    <Zoom in timeout={300 + index * 50}>
      <StyledCard onClick={onClick}>
        {/* Header */}
        <Box
          sx={{
            height: 80,
            background: `linear-gradient(135deg, ${slideType.color}, ${slideType.color}dd)`,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={slideType.label}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              {index + 1}/10
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {slide.title}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          {slide.subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: slideType.color,
                fontWeight: 600,
                mb: 1,
                display: "block",
              }}
            >
              {slide.subtitle}
            </Typography>
          )}

          <Box sx={{ flex: 1 }}>
            {slide.points &&
              slide.points.slice(0, 3).map((point, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{
                      color: slideType.color,
                      fontSize: "1.2rem",
                      lineHeight: 1.2,
                    }}
                  >
                    •
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4a5568", lineHeight: 1.3 }}
                  >
                    {point.length > 60 ? `${point.substring(0, 60)}...` : point}
                  </Typography>
                </Box>
              ))}
            {slide.points && slide.points.length > 3 && (
              <Typography
                variant="caption"
                sx={{ color: "#999", mt: 1, display: "block" }}
              >
                +{slide.points.length - 3} more points
              </Typography>
            )}
          </Box>

          {/* Visual Hint */}
          <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid #eee" }}>
            <Typography
              variant="caption"
              sx={{ color: "#aaa", fontStyle: "italic" }}
            >
              🎨 {slide.visualHint || "Standard layout"}
            </Typography>
          </Box>
        </Box>
      </StyledCard>
    </Zoom>
  );
};

export default SlideCard;
