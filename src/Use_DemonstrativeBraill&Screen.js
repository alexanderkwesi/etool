// Use_Braille_ScreenReader.js
// SIMPLIFIED WEB BROWSER VERSION
// Works with existing screen readers and Braille displays automatically
// No hardware drivers needed - uses browser's accessibility API

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

// ============================================================================
// SIMPLE BRAILLE TRANSLATION FOR VISUAL PREVIEW ONLY
// ============================================================================

const brailleMap = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛",
  h: "⠓", i: "⠊", j: "⠚", k: "⠅", l: "⠇", m: "⠍", n: "⠝",
  o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞", u: "⠥",
  v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵", " ": " ",
  "1": "⠼⠁", "2": "⠼⠃", "3": "⠼⠉", "4": "⠼⠙", "5": "⠼⠑",
  ".": "⠲", ",": "⠂", "?": "⠦", "!": "⠖"
};

const translateToBraille = (text) => {
  return text.toLowerCase().split("").map(char => 
    brailleMap[char] || char
  ).join("");
};

// ============================================================================
// MAIN COMPONENT - ACCESSIBLE WEB APP
// ============================================================================

const Use_Braille_ScreenReader = () => {
  const [inputText, setInputText] = useState("Hello world");
  const [brailleOutput, setBrailleOutput] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("medium");

  // Translate text to Braille for visual preview
  const handleTranslate = () => {
    setBrailleOutput(translateToBraille(inputText));
  };

  // ==========================================================================
  // RENDER - FULLY ACCESSIBLE
  // ==========================================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: highContrast ? "#000" : "#ffffff",
        color: highContrast ? "#ff0" : "inherit",
        p: 3,
      }}
    >
      <Container maxWidth="md">
        {/* Header - Proper heading for screen readers */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: fontSize === "large" ? "3rem" : "2rem",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <AccessibilityNewIcon sx={{ fontSize: 40 }} />
          Braille & Screen Reader Demo
        </Typography>

        {/* Accessibility Controls - Visible to all users */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: highContrast ? "#222" : "#f5f5f5",
            color: highContrast ? "#ff0" : "inherit"
          }}
        >
          <Typography variant="h6" gutterBottom>
            Accessibility Settings
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              }
              label="High Contrast"
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={fontSize}
                label="Font Size"
                onChange={(e) => setFontSize(e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Main Content - Semantic HTML for screen readers */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            bgcolor: highContrast ? "#222" : "white",
            color: highContrast ? "#ff0" : "inherit"
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "1.5rem", mb: 2 }}>
            Text to Braille Converter
          </Typography>

          {/* Input section with proper ARIA labels */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h3" 
              sx={{ fontSize: "1.1rem", mb: 1 }}
              id="input-label"
            >
              Enter your text:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-labelledby="input-label"
              inputProps={{
                style: { 
                  fontSize: fontSize === "large" ? "1.5rem" : "1rem",
                  fontFamily: "Arial"
                }
              }}
            />
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleTranslate}
            sx={{ mb: 3 }}
            aria-label="Convert text to Braille"
          >
            Convert to Braille
          </Button>

          {/* Braille output - Visual preview for sighted users */}
          {brailleOutput && (
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: highContrast ? "#000" : "#f0f0f0",
                borderRadius: 1
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ fontSize: "1.1rem", mb: 1 }}
                id="braille-output-label"
              >
                Braille Output (Visual Preview):
              </Typography>
              <Typography
                aria-labelledby="braille-output-label"
                sx={{
                  fontFamily: "monospace",
                  fontSize: fontSize === "large" ? "2.5rem" : "1.8rem",
                  letterSpacing: "4px",
                  lineHeight: 1.5,
                  wordBreak: "break-all",
                  p: 1,
                  border: highContrast ? "2px solid #ff0" : "1px solid #ccc",
                  borderRadius: 1,
                  bgcolor: highContrast ? "#000" : "white",
                }}
              >
                {brailleOutput}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ display: "block", mt: 1, color: highContrast ? "#ff0" : "#666" }}
              >
                Note: Braille display users will read this text through their device automatically.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* ======================================================================
            CRITICAL: THIS IS WHAT ACTUALLY WORKS WITH BRAILLE MONITORS
            ====================================================================== */}

        <Paper 
          sx={{ 
            p: 3, 
            bgcolor: highContrast ? "#222" : "#e3f2fd",
            border: highContrast ? "2px solid #ff0" : "none",
            color: highContrast ? "#ff0" : "inherit"
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "1.3rem", mb: 2 }}>
            ✅ How Braille Monitors Work With This Page
          </Typography>
          
          {/* THIS IS THE MAGIC - Semantic HTML that screen readers understand */}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 2 }}>
              1. Proper Heading Structure
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Screen readers announce headings and Braille displays show them.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 2 }}>
              2. Semantic HTML Elements
            </Typography>
            <Typography sx={{ mb: 1 }}>
              &lt;button&gt;, &lt;input&gt;, &lt;textarea&gt; - All natively accessible.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 2 }}>
              3. ARIA Labels When Needed
            </Typography>
            <Typography sx={{ mb: 1 }}>
              The text field above has aria-labelledby="input-label"
            </Typography>

            <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 2 }}>
              4. Focus Management
            </Typography>
            <Box 
              tabIndex={0}
              sx={{ 
                p: 2, 
                bgcolor: highContrast ? "#000" : "#fff", 
                border: "2px solid", 
                borderColor: "primary.main",
                borderRadius: 1,
                mt: 1,
                '&:focus': {
                  outline: '4px solid',
                  outlineColor: highContrast ? '#ff0' : 'primary.main'
                }
              }}
            >
              Press Tab to focus me - Braille displays will show this content!
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* CRITICAL INFORMATION FOR DEVELOPERS */}
          <Alert 
            severity="success"
            sx={{ 
              mt: 2,
              bgcolor: highContrast ? "#000" : undefined,
              color: highContrast ? "#ff0" : undefined,
              '& .MuiAlert-icon': {
                color: highContrast ? "#ff0" : undefined
              }
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              ⚡ This Actually Works With Braille Monitors
            </Typography>
            <Typography sx={{ mt: 1 }}>
              • A blind user connects their Braille display to their computer
            </Typography>
            <Typography>
              • Their screen reader (JAWS, NVDA, VoiceOver) detects the Braille display
            </Typography>
            <Typography>
              • The screen reader reads this webpage's semantic HTML
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              • The text automatically appears on their Braille display
            </Typography>
            <Typography sx={{ mt: 1, fontStyle: "italic" }}>
              No special code needed. No drivers. No hardware protocols.
              Just proper HTML and ARIA.
            </Typography>
          </Alert>
        </Paper>

        {/* Simple test area for Braille display users */}
        <Paper 
          sx={{ 
            p: 3, 
            mt: 3,
            bgcolor: highContrast ? "#222" : "#fff3e0",
            color: highContrast ? "#ff0" : "inherit"
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "1.3rem", mb: 2 }}>
            Test Your Braille Display
          </Typography>
          <Typography sx={{ mb: 2 }}>
            If you have a Braille display connected, you should feel this text:
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: highContrast ? "#000" : "#fff",
              border: "1px solid",
              borderColor: highContrast ? "#ff0" : "primary.main",
              borderRadius: 1
            }}
          >
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              🎉 Your Braille display is working! This text appears on your Braille monitor automatically.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: highContrast ? "#ff0" : "text.secondary" }}>
              Current text: {inputText || "Hello Braille user"}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Use_Braille_ScreenReader;