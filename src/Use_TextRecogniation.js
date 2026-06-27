import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Image as ImageIcon,
  Upload,
  Download,
  CheckCircle,
  Error,
  Visibility,
  Delete,
  Description,
  AutoFixHigh,
  SwapHoriz,
  Refresh,
  History,
  Help,
} from "@mui/icons-material";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import { useSecurity } from "./Use_Security";
import "./Use_App.css";

const TextRecognition = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const fileInputRef = useRef(null);
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileLimit: 5,
      fileSizeLimit: 10,
      storage: 1024,
      price: 0,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      fileLimit: 10,
      fileSizeLimit: 20,
      storage: 2560,
      price: 9.99,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      fileLimit: 50,
      fileSizeLimit: 50,
      storage: 5120,
      price: 19.99,
      color: "#ff6f00",
    },
  };

  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Load recognition history from localStorage
    const history = useLocalStorage.getItem("OCR_History") || [];
    setRecognitionHistory(history.slice(0, 10)); // Keep last 10 items
  }, []);

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (batchMode) {
      if (files.length + batchFiles.length > 5) {
        alert(`Batch processing limit is 5 files in ${currentPlan.name}`);
        return;
      }
      setBatchFiles([...batchFiles, ...files]);
    } else {
      if (files.length > 0) {
        const file = files[0];
        if (file.size > currentPlan.fileSizeLimit * 1024 * 1024) {
          alert(`File size exceeds limit for ${currentPlan.name} (${currentPlan.fileSizeLimit}MB)`);
          return;
        }
        setSelectedFile(file);
      }
    }
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simulate recognition result
          const mockText = `Extracted Text from ${selectedFile?.name || "Image"}:
          
Document Title: Sample Engineering Document
Date: ${new Date().toLocaleDateString()}
Reference: DOC-2024-001

Section 1: Introduction
This document contains technical specifications for the proposed engineering solution.
The following sections detail the requirements and implementation guidelines.

Section 2: Technical Specifications
- Material: Aluminum 6061-T6
- Dimensions: 150mm x 200mm x 50mm
- Tolerance: ±0.1mm
- Surface Finish: 3.2 μm Ra

Section 3: Requirements
1. Must withstand operational temperature of -20°C to 80°C
2. Corrosion resistance to industrial environments
3. Load capacity: 500N minimum
4. Service life: 10 years minimum

End of Document`;

          const result = {
            id: Date.now(),
            fileName: selectedFile?.name || "batch_processing",
            fileSize: selectedFile?.size || 0,
            processedAt: new Date().toISOString(),
            confidence: Math.random() * 20 + 80, // 80-100%
            language: "English",
            textLength: mockText.length,
          };

          setRecognitionResult(result);
          setExtractedText(mockText);

          // Save to history
          const newHistory = [result, ...recognitionHistory].slice(0, 10);
          setRecognitionHistory(newHistory);
          useLocalStorage.setItem("OCR_History", newHistory);

          return 100;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 200);
  };

  const handleProcessFile = () => {
    if (!selectedFile && batchFiles.length === 0) {
      alert("Please select a file to process");
      return;
    }

    if (recognitionHistory.length >= currentPlan.fileLimit) {
      alert(`You have reached the file limit for ${currentPlan.name}`);
      return;
    }

    simulateProcessing();
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setRecognitionResult(null);
    setExtractedText("");
  };

  const handleClearBatch = () => {
    setBatchFiles([]);
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted_text_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleViewResult = () => {
    // In a real app, this would open a viewer
    alert("Text preview available in the text area below");
  };

  const FeatureCard = ({ icon, title, description, available = true, limit }) => (
    <Card className="feature-card" sx={{ opacity: available ? 1 : 0.6, height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {limit && (
          <Chip
            label={limit}
            size="small"
            sx={{ 
              mt: 1, 
              backgroundColor: userPlanData.planId === "basic" ? "#757575" :
                userPlanData.planId === 'standard' ? "#2196f3" : "#ff6f00",
              color: "white" 
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  const getPlanColor = () => {
    return userPlanData.planId === "basic" ? "#757575" :
           userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00";
  };

  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: userPlanData.planId === "basic" 
              ? "rgba(117, 117, 117, 0.3)" 
              : userPlanData.planId === "standard"
                ? "rgba(33, 150, 243, 0.3)"
                : "rgba(255, 111, 0, 0.3)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Text Recognition (OCR)
              </Typography>
              <Chip
                label={userPlanData.planId === "basic" ? "Begin Plan" :
                       userPlanData.planId === "standard" ? "Standard Plan" : "Premium Plan"}
                sx={{
                  backgroundColor: getPlanColor(),
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Welcome, {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Help />}
                onClick={() => setShowHelpDialog(true)}
              >
                Help
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: getPlanColor(),
                  color: getPlanColor(),
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - File Upload & Processing */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: getPlanColor() }}>
              Upload & Process
            </Typography>

            {/* Mode Selection */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant={!batchMode ? "contained" : "outlined"}
                onClick={() => setBatchMode(false)}
                sx={{ mr: 1, backgroundColor: !batchMode ? getPlanColor() : undefined }}
              >
                Single File
              </Button>
              <Button
                variant={batchMode ? "contained" : "outlined"}
                onClick={() => setBatchMode(true)}
                sx={{ backgroundColor: batchMode ? getPlanColor() : undefined }}
                disabled={userPlanData.planId === "basic"}
              >
                Batch Processing
                {userPlanData.planId === "basic" && " (Premium)"}
              </Button>
            </Box>

            {/* Upload Area */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                border: "2px dashed",
                borderColor: getPlanColor(),
                backgroundColor: "rgba(0,0,0,0.02)",
                textAlign: "center",
              }}
            >
              <ImageIcon sx={{ fontSize: 48, color: getPlanColor(), mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {batchMode ? "Drop multiple image files here" : "Drop an image file here"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Supported formats: PNG, JPG, JPEG, BMP, TIFF, PDF
                <br />
                Max file size: {currentPlan.fileSizeLimit}MB per file
              </Typography>
              
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.bmp,.tiff,.pdf"
                onChange={handleFileSelect}
                ref={fileInputRef}
                multiple={batchMode}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current.click()}
                sx={{ backgroundColor: getPlanColor(), mb: 2 }}
              >
                Choose {batchMode ? "Files" : "File"}
              </Button>

              {batchMode ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Selected: {batchFiles.length} file(s)
                  </Typography>
                  {batchFiles.length > 0 && (
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={handleClearBatch}
                      sx={{ mt: 1 }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>
              ) : (
                selectedFile && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={selectedFile.name}
                      onDelete={handleClearSelection}
                      sx={{ backgroundColor: getPlanColor(), color: "white" }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                    </Typography>
                  </Box>
                )
              )}
            </Paper>

            {/* Processing Controls */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={isProcessing ? <Refresh /> : <AutoFixHigh />}
                onClick={handleProcessFile}
                disabled={isProcessing || (!selectedFile && batchFiles.length === 0)}
                sx={{
                  backgroundColor: getPlanColor(),
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
              
              {isProcessing && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={processingProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getPlanColor(),
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Processing... {processingProgress.toFixed(0)}%
                  </Typography>
                </Box>
              )}
            </Box>

            {/* OCR Features */}
            <Typography variant="h6" gutterBottom sx={{ color: getPlanColor(), mt: 4 }}>
              OCR Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<SwapHoriz sx={{ color: getPlanColor() }} />}
                  title="Multi-Language"
                  description="Support for 100+ languages including technical terminology"
                  available={userPlanData.planId !== "basic"}
                  limit={userPlanData.planId === "standard" ? "5 languages" : "Unlimited"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={<AutoFixHigh sx={{ color: getPlanColor() }} />}
                  title="AI Enhancement"
                  description="AI-powered text correction and formatting"
                  available={userPlanData.planId === "premium"}
                  limit="Premium Only"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column - Results & History */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: getPlanColor() }}>
              Results & History
            </Typography>

            {/* Current Result */}
            {recognitionResult && (
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Extracted Text
                  </Typography>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${recognitionResult.confidence.toFixed(1)}% Confidence`}
                    color="success"
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    File: {recognitionResult.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Processed: {new Date(recognitionResult.processedAt).toLocaleString()}
                  </Typography>
                </Box>

                <TextField
                  multiline
                  rows={8}
                  value={extractedText}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleDownloadText}
                    sx={{ backgroundColor: getPlanColor() }}
                  >
                    Download Text
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={handleViewResult}
                    sx={{ borderColor: getPlanColor(), color: getPlanColor() }}
                  >
                    Preview
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Recent History */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: getPlanColor() }}>
                Recent Recognition History
              </Typography>
              
              {recognitionHistory.length > 0 ? (
                <List>
                  {recognitionHistory.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="view">
                            <Visibility />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Description sx={{ color: getPlanColor() }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.fileName}
                          secondary={
                            <>
                              {new Date(item.processedAt).toLocaleDateString()}
                              <Chip
                                label={`${item.confidence.toFixed(0)}%`}
                                size="small"
                                sx={{ ml: 1, height: 20 }}
                                color={item.confidence > 90 ? "success" : item.confidence > 70 ? "warning" : "error"}
                              />
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recognition history yet. Process your first file to see results here.
                </Typography>
              )}
              
              <Button
                startIcon={<History />}
                onClick={() => window.location.href = "/ocr/history"}
                sx={{ mt: 2, color: getPlanColor() }}
              >
                View Full History
              </Button>
            </Paper>

            {/* Usage Stats */}
            <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: getPlanColor() }}>
                Usage Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">Files Processed This Month</Typography>
                  <Typography variant="body2">
                    {recognitionHistory.length}/{currentPlan.fileLimit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(recognitionHistory.length / currentPlan.fileLimit) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getPlanColor(),
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Resets at the beginning of each billing cycle
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: getPlanColor() }}>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{ backgroundColor: getPlanColor() }}
              onClick={() => window.location.href = "/ocr/scan"}
            >
              Document Scanning
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: getPlanColor(), color: getPlanColor() }}
              onClick={() => window.location.href = "/ocr/image-to-text"}
            >
              Image to Text
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: getPlanColor(), color: getPlanColor() }}
              onClick={() => window.location.href = "/ocr/batch"}
            >
              Batch Processing
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: getPlanColor(), color: getPlanColor() }}
              onClick={() => window.location.href = "/dashboard"}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onClose={() => setShowHelpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: getPlanColor() }}>
          Text Recognition Help
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            <strong>How to use Text Recognition:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Upload image files containing text (PNG, JPG, PDF, etc.)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Click 'Extract Text' to process the file" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="View and download the extracted text" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Use batch processing for multiple files (Premium feature)" />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Plan Limitations:</strong><br />
              • Begin Plan: {planDetails.basic.fileLimit} files/month, {planDetails.basic.fileSizeLimit}MB max file size<br />
              • Standard Plan: {planDetails.standard.fileLimit} files/month, {planDetails.standard.fileSizeLimit}MB max file size<br />
              • Premium Plan: {planDetails.premium.fileLimit} files/month, {planDetails.premium.fileSizeLimit}MB max file size
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelpDialog(false)} sx={{ color: getPlanColor() }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TextRecognition;