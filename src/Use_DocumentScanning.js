
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Button,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
} from "@mui/material";
import {
  CloudUpload,
  Scanner,
  Image,
  PictureAsPdf,
  TextFields,
  Delete,
  CheckCircle,
  Error,
  Download,
  Visibility,
  Refresh,
  Settings,
  FolderOpen,
  UploadFile,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const DocumentScanning = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const fileInputRef = useRef(null);
  
  // User plan data
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  // Scanning states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [scanSettings, setScanSettings] = useState({
    ocrEnabled: true,
    extractText: true,
    detectTables: false,
    detectLayout: true,
    language: "eng",
    outputFormat: "pdf",
    imageQuality: "high",
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Check permissions
  const canUseAdvancedOCR = hasPermission("advanced_ocr");
  const canUseBatchProcessing = hasPermission("batch_processing");

  // Fetch user data from localStorage
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

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  // Plan-based limitations
  const getPlanLimitations = () => {
    const plan = userPlanData.planId;
    if (plan === "basic") {
      return {
        maxFiles: 3,
        maxFileSize: 10, // MB
        supportedFormats: ["jpg", "png", "pdf"],
        ocrLanguages: ["eng"],
      };
    } else if (plan === "standard") {
      return {
        maxFiles: 10,
        maxFileSize: 20, // MB
        supportedFormats: ["jpg", "png", "pdf", "tiff", "bmp"],
        ocrLanguages: ["eng", "spa", "fra", "deu"],
      };
    } else {
      return {
        maxFiles: 50,
        maxFileSize: 50, // MB
        supportedFormats: ["jpg", "png", "pdf", "tiff", "bmp", "gif", "webp"],
        ocrLanguages: ["eng", "spa", "fra", "deu", "ita", "por", "rus", "chi_sim"],
      };
    }
  };

  const planLimitations = getPlanLimitations();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const limitations = planLimitations;
    
    // Check file count limit
    if (selectedFiles.length + files.length > limitations.maxFiles) {
      setNotification({
        open: true,
        message: `You can only scan up to ${limitations.maxFiles} files at once in your current plan.`,
        severity: "warning",
      });
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileSizeMB = file.size / (1024 * 1024);

      // Check file format
      if (!limitations.supportedFormats.includes(fileExtension)) {
        invalidFiles.push(`${file.name} - Format not supported`);
        return;
      }

      // Check file size
      if (fileSizeMB > limitations.maxFileSize) {
        invalidFiles.push(`${file.name} - Exceeds ${limitations.maxFileSize}MB limit`);
        return;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: fileSizeMB.toFixed(2),
        format: fileExtension,
        status: "pending",
        progress: 0,
      });
    });

    if (invalidFiles.length > 0) {
      setNotification({
        open: true,
        message: `Some files were rejected: ${invalidFiles.join(', ')}`,
        severity: "warning",
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setNotification({
        open: true,
        message: `Added ${validFiles.length} file(s) for scanning`,
        severity: "success",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = async () => {
    if (selectedFiles.length === 0) {
      setNotification({
        open: true,
        message: "Please select files to scan",
        severity: "warning",
      });
      return;
    }

    setIsScanning(true);
    setScanningProgress(0);
    setScanResults([]);

    // Simulate scanning process
    const scanPromises = selectedFiles.map((file, index) => {
      return new Promise((resolve) => {
        const scanTime = Math.random() * 3000 + 1000; // 1-4 seconds
        let progress = 0;
        
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress > 100) progress = 100;
          
          setSelectedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: Math.min(progress, 100), status: progress < 100 ? "scanning" : "completed" }
                : f
            )
          );
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Generate mock scan result
              const result = {
                id: file.id,
                name: file.name,
                scanDate: new Date().toLocaleString(),
                textLength: Math.floor(Math.random() * 5000) + 1000,
                confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
                pages: Math.floor(Math.random() * 10) + 1,
                hasTables: Math.random() > 0.7,
                hasImages: Math.random() > 0.5,
                downloadUrl: "#",
                previewUrl: "#",
              };
              resolve(result);
            }, 500);
          }
        }, scanTime / 20);
      });
    });

    // Update overall progress
    const progressInterval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 100);

    try {
      const results = await Promise.all(scanPromises);
      setScanResults(results);
      setNotification({
        open: true,
        message: `Successfully scanned ${results.length} document(s)`,
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Error during scanning process",
        severity: "error",
      });
    } finally {
      setIsScanning(false);
      clearInterval(progressInterval);
    }
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setScanResults([]);
    setScanningProgress(0);
  };

  const handleDownload = (resultId) => {
    // Simulate download
    setNotification({
      open: true,
      message: "Download started",
      severity: "info",
    });
    // In real app, this would trigger actual download
  };

  const handleSettingChange = (setting, value) => {
    setScanSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const FeatureCard = ({ icon, title, description, available = true, limit }) => (
    <Card className="feature-card" sx={{ opacity: available ? 1 : 0.6 }}>
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
              backgroundColor: currentPlan.color, 
              color: "white" 
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  const ScanProgress = ({ file }) => (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption">
          {file.name}
        </Typography>
        <Typography variant="caption">
          {file.status === "completed" ? "✓ Done" : `${Math.round(file.progress)}%`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={file.progress}
        sx={{
          height: 4,
          mt: 0.5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: file.status === "completed" ? "#4caf50" : currentPlan.color,
          },
        }}
      />
    </Box>
  );

  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: `rgba(${
              currentPlan.color === "#757575" ? "117, 117, 117" :
              currentPlan.color === "#2196f3" ? "33, 150, 243" :
              "255, 111, 0"
            }, 0.3)`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Document Scanning & OCR
              </Typography>
              <Chip
                label={currentPlan.name}
                sx={{
                  backgroundColor: currentPlan.color,
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
                startIcon={<Settings />}
                onClick={() => (window.location.href = "/ocr/settings")}
              >
                Settings
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - File Upload & Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                  Upload Documents
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: currentPlan.color,
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.02)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload sx={{ fontSize: 48, color: currentPlan.color, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drop files here or click to upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports: {planLimitations.supportedFormats.join(", ").toUpperCase()}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Max {planLimitations.maxFiles} files • Max {planLimitations.maxFileSize}MB per file
                  </Typography>
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  accept={planLimitations.supportedFormats.map(f => `.${f}`).join(",")}
                  onChange={handleFileSelect}
                />

                {selectedFiles.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        Selected Files ({selectedFiles.length}/{planLimitations.maxFiles})
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleClearAll}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <List>
                      {selectedFiles.map((file) => (
                        <ListItem
                          key={file.id}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor: file.status === "completed" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                          }}
                        >
                          <ListItemIcon>
                            {file.format === "pdf" ? <PictureAsPdf /> : <Image />}
                          </ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            secondary={`${file.size} MB • ${file.format.toUpperCase()}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleRemoveFile(file.id)}>
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Scan Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                  Scan Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Enable OCR</Typography>
                      <Switch
                        checked={scanSettings.ocrEnabled}
                        onChange={(e) => handleSettingChange("ocrEnabled", e.target.checked)}
                        color="primary"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Extract Text</Typography>
                      <Switch
                        checked={scanSettings.extractText}
                        onChange={(e) => handleSettingChange("extractText", e.target.checked)}
                        color="primary"
                        disabled={!scanSettings.ocrEnabled}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Detect Tables</Typography>
                      <Switch
                        checked={scanSettings.detectTables}
                        onChange={(e) => handleSettingChange("detectTables", e.target.checked)}
                        color="primary"
                        disabled={!canUseAdvancedOCR || !scanSettings.ocrEnabled}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Detect Layout</Typography>
                      <Switch
                        checked={scanSettings.detectLayout}
                        onChange={(e) => handleSettingChange("detectLayout", e.target.checked)}
                        color="primary"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Language"
                      value={scanSettings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      size="small"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {planLimitations.ocrLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang === "eng" ? "English" : 
                           lang === "spa" ? "Spanish" :
                           lang === "fra" ? "French" :
                           lang === "deu" ? "German" :
                           lang === "ita" ? "Italian" :
                           lang === "por" ? "Portuguese" :
                           lang === "rus" ? "Russian" : "Chinese"}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Output Format"
                      value={scanSettings.outputFormat}
                      onChange={(e) => handleSettingChange("outputFormat", e.target.value)}
                      size="small"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="pdf">PDF (Searchable)</option>
                      <option value="txt">Plain Text</option>
                      <option value="docx">Word Document</option>
                      <option value="json">JSON</option>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Scan & Results */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                  Scan Control
                </Typography>
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Scanner sx={{ fontSize: 64, color: currentPlan.color, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Ready to Scan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Click Start Scan to begin OCR processing of your uploaded documents
                  </Typography>
                  
                  {isScanning && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom>
                        Overall Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={scanningProgress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: currentPlan.color,
                          },
                        }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {Math.round(scanningProgress)}% complete
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={isScanning ? <CircularProgress size={20} color="inherit" /> : <Scanner />}
                    onClick={handleScan}
                    disabled={selectedFiles.length === 0 || isScanning}
                    sx={{
                      backgroundColor: currentPlan.color,
                      minWidth: 200,
                      "&:hover": {
                        backgroundColor: currentPlan.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {isScanning ? "Scanning..." : "Start Scan"}
                  </Button>

                  {isScanning && selectedFiles.map((file) => (
                    <ScanProgress key={file.id} file={file} />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Scan Results */}
            {scanResults.length > 0 && (
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ color: currentPlan.color }}>
                      Scan Results
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {scanResults.length} document(s)
                    </Typography>
                  </Box>
                  
                  <List>
                    {scanResults.map((result) => (
                      <ListItem
                        key={result.id}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          mb: 1,
                          backgroundColor: "rgba(0,0,0,0.02)",
                        }}
                      >
                        <ListItemIcon>
                          {result.confidence > 90 ? (
                            <CheckCircle color="success" />
                          ) : result.confidence > 70 ? (
                            <CheckCircle color="warning" />
                          ) : (
                            <Error color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={result.name}
                          secondary={
                            <>
                              <Box component="span" display="block">
                                Scanned: {result.scanDate}
                              </Box>
                              <Box component="span" display="block">
                                Confidence: {result.confidence}% • Pages: {result.pages}
                              </Box>
                              <Box component="span" display="block">
                                Text: {result.textLength} characters
                              </Box>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleDownload(result.id)}>
                            <Download />
                          </IconButton>
                          <IconButton edge="end" onClick={() => window.open(result.previewUrl, "_blank")}>
                            <Visibility />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      fullWidth
                      sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
                    >
                      Download All
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Refresh />}
                      fullWidth
                      sx={{ backgroundColor: currentPlan.color }}
                      onClick={handleClearAll}
                    >
                      New Scan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Features Grid */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
            OCR & Scanning Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<Image sx={{ color: currentPlan.color }} />}
                title="Multi-Format Support"
                description="Scan JPG, PNG, PDF, TIFF, and other image formats"
                available={true}
                limit={`${planLimitations.supportedFormats.length} formats`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<TextFields sx={{ color: currentPlan.color }} />}
                title="Text Recognition"
                description="Extract text from scanned documents with high accuracy"
                available={true}
                limit={`${planLimitations.ocrLanguages.length} languages`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<PictureAsPdf sx={{ color: currentPlan.color }} />}
                title="PDF Creation"
                description="Convert scans to searchable PDF documents"
                available={true}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<UploadFile sx={{ color: currentPlan.color }} />}
                title="Batch Processing"
                description="Process multiple documents simultaneously"
                available={canUseBatchProcessing}
                limit={userPlanData.planId === "standard" ? "Up to 10 files" : "Unlimited"}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<FolderOpen />}
              sx={{ backgroundColor: currentPlan.color }}
              onClick={() => fileInputRef.current?.click()}
            >
              Add More Files
            </Button>
            <Button
              variant="outlined"
              startIcon={<Scanner />}
              sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              onClick={handleScan}
              disabled={selectedFiles.length === 0 || isScanning}
            >
              {isScanning ? "Scanning..." : "Scan Documents"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              onClick={() => (window.location.href = "/ocr/pdf-tools")}
            >
              PDF Tools
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              onClick={() => (window.location.href = "/ocr/settings")}
            >
              Advanced Settings
            </Button>
          </Box>
        </Paper>

        {/* Plan Limitations Notice */}
        {userPlanData.planId === "basic" && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Plan Limitations:</strong> You are currently on the {currentPlan.name}. 
              Upgrade to unlock more features, including batch processing, advanced table detection, 
              and support for more languages and file formats.
            </Typography>
          </Alert>
        )}
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DocumentScanning;
