
import React, { useState, useEffect } from "react";
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
  Divider,
  Alert,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Image as ImageIcon,
  Upload,
  Download,
  Visibility,
  Delete,
  Refresh,
  TextFields,
  Language,
  FormatSize,
  AutoFixHigh,
  CheckCircle,
  Error,
  History,
  Info,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const ImageToText = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [textFormat, setTextFormat] = useState("plain");
  const [ocrHistory, setOcrHistory] = useState([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  const canUseAdvancedOCR = hasPermission("advanced_ocr");
  const canUseBatchProcessing = hasPermission("batch_processing");
  
  // Fetch user plan data
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;
      setUserPlanData({
        planId: planData.planId,
        planName: planData.planName,
        monthlyPrice: planData.monthlyPrice,
        annualPrice: planData.annualPrice,
        billingCycle: planData.billingCycle,
      });
      
      // Load OCR history from localStorage
      const history = useLocalStorage.getItem("ocr_history") || [];
      setOcrHistory(history);
    }
  }, []);
  
  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileLimit: 5,
      fileSizeLimit: 10,
      storage: 1024,
      price: 0,
      color: "#757575",
      ocrLanguages: ["eng"],
      maxPages: 1,
    },
    standard: {
      name: "Standard Plan",
      fileLimit: 10,
      fileSizeLimit: 20,
      storage: 2560,
      price: 9.99,
      color: "#2196f3",
      ocrLanguages: ["eng", "spa", "fra", "deu"],
      maxPages: 5,
    },
    premium: {
      name: "Premium Plan",
      fileLimit: 50,
      fileSizeLimit: 50,
      storage: 5120,
      price: 19.99,
      color: "#ff6f00",
      ocrLanguages: ["eng", "spa", "fra", "deu", "ita", "por", "rus", "ara", "chi_sim", "jpn"],
      maxPages: 50,
    },
  };
  
  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;
  
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const maxSize = currentPlan.fileSizeLimit * 1024 * 1024; // MB to bytes
      return file.size <= maxSize;
    });
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      if (!selectedFile) {
        setSelectedFile(validFiles[0]);
      }
    } else {
      alert(`File size exceeds limit of ${currentPlan.fileSizeLimit}MB for your plan`);
    }
  };
  
  const handleProcessImage = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate OCR processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simulate extracted text
          const mockText = `Extracted text from ${selectedFile.name}:\n\n` +
            "This is a simulated OCR result.\n" +
            "In a real application, this would be actual text extracted from the image.\n" +
            "The text can be edited, formatted, and downloaded in various formats.\n\n" +
            "OCR Features:\n" +
            "✓ Multiple language support\n" +
            "✓ Text formatting options\n" +
            "✓ Batch processing\n" +
            "✓ Historical tracking\n";
          
          setExtractedText(mockText);
          
          // Save to history
          const newHistoryItem = {
            id: Date.now(),
            fileName: selectedFile.name,
            timestamp: new Date().toISOString(),
            language: language,
            textLength: mockText.length,
          };
          
          const updatedHistory = [newHistoryItem, ...ocrHistory.slice(0, 9)];
          setOcrHistory(updatedHistory);
          useLocalStorage.setItem("ocr_history", updatedHistory);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleDownloadText = () => {
    if (!extractedText) {
      alert("No text to download");
      return;
    }
    
    let content = extractedText;
    let mimeType = "text/plain";
    let extension = "txt";
    
    if (textFormat === "json") {
      content = JSON.stringify({ text: extractedText, language: language, timestamp: new Date().toISOString() });
      mimeType = "application/json";
      extension = "json";
    } else if (textFormat === "html") {
      content = `<html><body><pre>${extractedText}</pre></body></html>`;
      mimeType = "text/html";
      extension = "html";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr_extracted_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleClearAll = () => {
    setUploadedFiles([]);
    setSelectedFile(null);
    setExtractedText("");
  };
  
  const handleRemoveFile = (fileName) => {
    const newFiles = uploadedFiles.filter(file => file.name !== fileName);
    setUploadedFiles(newFiles);
    if (selectedFile && selectedFile.name === fileName) {
      setSelectedFile(newFiles[0] || null);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  const getLanguageName = (code) => {
    const languages = {
      eng: "English",
      spa: "Spanish",
      fra: "French",
      deu: "German",
      ita: "Italian",
      por: "Portuguese",
      rus: "Russian",
      ara: "Arabic",
      chi_sim: "Chinese (Simplified)",
      jpn: "Japanese",
    };
    return languages[code] || code;
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
            backgroundColor: `${
              userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)"
            }`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Image to Text (OCR)
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={currentPlan.name}
                  sx={{
                    backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                    color: "white",
                  }}
                />
                <Chip
                  icon={<Info />}
                  label={`${currentPlan.fileSizeLimit}MB max file size`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={() => setShowHistoryDialog(true)}
              >
                View History
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                }}
                onClick={() => (window.location.href = "/ocr/batch")}
                disabled={!canUseBatchProcessing}
              >
                Batch Processing
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Upload & Settings */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Upload />
                  Upload Images
                </Typography>
                <input
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  id="image-upload"
                  multiple={canUseBatchProcessing}
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    sx={{
                      backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                      mb: 2,
                      py: 1.5,
                    }}
                  >
                    Select Images
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" display="block">
                  Supported formats: JPG, PNG, PDF, TIFF
                  {canUseBatchProcessing ? " (Multiple files allowed)" : " (Single file only)"}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AutoFixHigh />
                  OCR Settings
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Language
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {currentPlan.ocrLanguages.map((lang) => (
                      <Chip
                        key={lang}
                        label={getLanguageName(lang)}
                        onClick={() => setLanguage(lang)}
                        color={language === lang ? "primary" : "default"}
                        sx={{
                          backgroundColor: language === lang ? 
                            `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` : 
                            undefined,
                          color: language === lang ? "white" : undefined,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Output Format
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {["plain", "json", "html"].map((format) => (
                      <Chip
                        key={format}
                        label={format.toUpperCase()}
                        onClick={() => setTextFormat(format)}
                        color={textFormat === format ? "primary" : "default"}
                        sx={{
                          backgroundColor: textFormat === format ? 
                            `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` : 
                            undefined,
                          color: textFormat === format ? "white" : undefined,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                {!canUseAdvancedOCR && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Upgrade to Premium for advanced OCR features
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ImageIcon />
                    Uploaded Files ({uploadedFiles.length})
                  </Typography>
                  <List dense>
                    {uploadedFiles.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveFile(file.name)}>
                            <Delete />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: selectedFile?.name === file.name ? 
                            `${userPlanData.planId === "basic" ? "rgba(117, 117, 117, 0.1)" : userPlanData.planId === "standard" ? "rgba(33, 150, 243, 0.1)" : "rgba(255, 111, 0, 0.1)"}` : 
                            undefined,
                          borderRadius: 1,
                          mb: 1,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                        onClick={() => setSelectedFile(file)}
                      >
                        <ListItemIcon>
                          <ImageIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={formatFileSize(file.size)}
                        />
                        {selectedFile?.name === file.name && (
                          <CheckCircle sx={{ color: "success.main", ml: 1 }} />
                        )}
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    startIcon={<Delete />}
                    onClick={handleClearAll}
                    color="error"
                    variant="outlined"
                    fullWidth
                  >
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Preview & Results */}
          <Grid item xs={12} md={8}>
            {selectedFile ? (
              <>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Visibility />
                        Image Preview
                      </Typography>
                      <Chip
                        label={formatFileSize(selectedFile.size)}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Box
                      sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 2,
                        textAlign: "center",
                        minHeight: 200,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                      <Typography variant="body1">{selectedFile.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedFile.type}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        variant="contained"
                        startIcon={<TextFields />}
                        onClick={handleProcessImage}
                        disabled={isProcessing}
                        sx={{
                          backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                          flexGrow: 1,
                        }}
                      >
                        {isProcessing ? "Processing..." : "Extract Text"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => {
                          setSelectedFile(null);
                          setExtractedText("");
                        }}
                      >
                        Change Image
                      </Button>
                    </Box>
                    
                    {isProcessing && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={processingProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                          Extracting text... {processingProgress}%
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {extractedText && (
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextFields />
                          Extracted Text
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            icon={<Language />}
                            label={getLanguageName(language)}
                            size="small"
                          />
                          <Chip
                            icon={<FormatSize />}
                            label={`${extractedText.length} chars`}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <TextField
                        multiline
                        rows={12}
                        fullWidth
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                          },
                        }}
                      />
                      
                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={handleDownloadText}
                          sx={{
                            backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                          }}
                        >
                          Download as {textFormat.toUpperCase()}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setExtractedText("")}
                        >
                          Clear Text
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => navigator.clipboard.writeText(extractedText)}
                        >
                          Copy to Clipboard
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <ImageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Image Selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload an image to extract text using OCR
                  </Typography>
                  <input
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    id="image-upload-initial"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="image-upload-initial">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        backgroundColor: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                      }}
                    >
                      Upload First Image
                    </Button>
                  </label>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* OCR Statistics */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextFields />
            OCR Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" sx={{ color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }}>
                  {ocrHistory.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total OCR Operations
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" sx={{ color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }}>
                  {currentPlan.ocrLanguages.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Languages
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" sx={{ color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }}>
                  {currentPlan.fileSizeLimit}MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max File Size
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" sx={{ color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }}>
                  {canUseBatchProcessing ? "✓" : "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Batch Processing
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* History Dialog */}
      <Dialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <History />
            OCR History
          </Box>
        </DialogTitle>
        <DialogContent>
          {ocrHistory.length > 0 ? (
            <List>
              {ocrHistory.map((item) => (
                <ListItem
                  key={item.id}
                  divider
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <TextFields />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.fileName}
                    secondary={
                      <>
                        {new Date(item.timestamp).toLocaleString()}
                        <br />
                        Language: {getLanguageName(item.language)} • {item.textLength} characters
                      </>
                    }
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      // In a real app, this would reload the item
                      alert(`Loading OCR result for ${item.fileName}`);
                    }}
                  >
                    View
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No OCR history yet. Process some images to see history here.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
          <Button
            onClick={() => {
              setOcrHistory([]);
              useLocalStorage.setItem("ocr_history", []);
            }}
            color="error"
          >
            Clear History
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageToText;
