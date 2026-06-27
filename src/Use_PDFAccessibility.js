import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import {
  PictureAsPdf,
  Accessibility,
  TextFormat,
  Tag,
  Link,
  TableChart,
  Visibility,
  Download,
  Delete,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  CloudUpload,
  History,
  Info,
  Upload,
  Compare,
  Security,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

// Import missing Settings icon
import { Settings } from "@mui/icons-material";

const PdfAccessibilityRemediation = () => {
  // Use the security context hook
  const { isAuthenticated, user, hasPermission } = useSecurity();

  // Use localStorage for user plan data
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  const [usageStats, setUsageStats] = useState({
    pdfsProcessed: 0,
    accessibilityScore: 0,
    issuesFixed: 0,
  });

  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [remediationHistory, setRemediationHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check permissions for features
  const canUseAdvancedFeatures = hasPermission("advanced_features");
  const canUseBulkProcessing = hasPermission("bulk_processing");

  // Remediation settings
  const [remediationSettings, setRemediationSettings] = useState({
    addTags: true,
    addAltText: true,
    setLanguage: true,
    fixReadingOrder: true,
    addBookmarks: true,
    fixColorContrast: true,
    addTableHeaders: true,
    generateAccessibilityReport: true,
    preserveOriginalFormatting: true,
  });

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Simulate initial data
    const initialFiles = [
      {
        id: 1,
        name: "technical_manual.pdf",
        size: "2.4 MB",
        uploadDate: "2024-01-15",
        status: "pending",
        accessibilityScore: 45,
        issues: [
          "Missing document title",
          "No tags structure",
          "Images without alt text",
          "Incorrect reading order",
          "No bookmarks",
          "Low color contrast",
        ],
      },
      {
        id: 2,
        name: "project_report.pdf",
        size: "1.8 MB",
        uploadDate: "2024-01-14",
        status: "completed",
        accessibilityScore: 95,
        remediatedDate: "2024-01-14",
        issues: ["Fixed: Added tags", "Fixed: Set language", "Fixed: Added alt text"],
        downloadUrl: "#",
      },
      {
        id: 3,
        name: "user_guide.pdf",
        size: "3.2 MB",
        uploadDate: "2024-01-13",
        status: "failed",
        accessibilityScore: 30,
        error: "Complex table structure could not be fixed",
        issues: ["Complex tables", "Missing headings", "No document structure"],
      },
    ];

    const initialHistory = [
      {
        id: 1,
        fileName: "annual_report.pdf",
        date: "2024-01-14",
        beforeScore: 40,
        afterScore: 92,
        issuesFixed: 8,
        status: "success",
      },
      {
        id: 2,
        fileName: "product_spec.pdf",
        date: "2024-01-13",
        beforeScore: 35,
        afterScore: 88,
        issuesFixed: 7,
        status: "success",
      },
    ];

    setPdfFiles(initialFiles);
    setRemediationHistory(initialHistory);
    setUsageStats({
      pdfsProcessed: 15,
      accessibilityScore: 78,
      issuesFixed: 120,
    });
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPdfs = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "pending",
      accessibilityScore: Math.floor(Math.random() * 40) + 10,
      issues: ["Analyzing accessibility issues..."],
      file: file,
    }));

    setPdfFiles([...pdfFiles, ...newPdfs]);
    showSnackbar(`Uploaded ${files.length} PDF file(s)`, "success");
  };

  const handleRemediatePdf = (pdf) => {
    setSelectedPdf(pdf);
    setLoading(true);

    // Simulate remediation process
    setTimeout(() => {
      const newScore = Math.min(100, pdf.accessibilityScore + 40 + Math.floor(Math.random() * 20));
      const issuesFixed = Math.floor(Math.random() * pdf.issues.length) + 1;
      
      const updatedFiles = pdfFiles.map(f =>
        f.id === pdf.id ? {
          ...f,
          status: "completed",
          accessibilityScore: newScore,
          remediatedDate: new Date().toISOString().split("T")[0],
          downloadUrl: "#",
        } : f
      );

      const historyEntry = {
        id: Date.now(),
        fileName: pdf.name,
        date: new Date().toISOString().split("T")[0],
        beforeScore: pdf.accessibilityScore,
        afterScore: newScore,
        issuesFixed: issuesFixed,
        status: "success",
      };

      setPdfFiles(updatedFiles);
      setRemediationHistory([historyEntry, ...remediationHistory]);
      setUsageStats(prev => ({
        ...prev,
        pdfsProcessed: prev.pdfsProcessed + 1,
        issuesFixed: prev.issuesFixed + issuesFixed,
        accessibilityScore: Math.round((prev.accessibilityScore * prev.pdfsProcessed + newScore) / (prev.pdfsProcessed + 1)),
      }));
      
      setLoading(false);
      showSnackbar(`Successfully remediated ${pdf.name}`, "success");
    }, 3000);
  };

  const handleBulkRemediate = () => {
    setOpenDialog(true);
  };

  const handleConfirmBulkRemediate = () => {
    setOpenDialog(false);
    setLoading(true);

    setTimeout(() => {
      const pendingFiles = pdfFiles.filter(f => f.status === "pending");
      let totalIssuesFixed = 0;

      const updatedFiles = pdfFiles.map(f => {
        if (f.status === "pending") {
          const newScore = Math.min(100, f.accessibilityScore + 30 + Math.floor(Math.random() * 25));
          const issuesFixed = Math.floor(Math.random() * 5) + 1;
          totalIssuesFixed += issuesFixed;
          
          return {
            ...f,
            status: "completed",
            accessibilityScore: newScore,
            remediatedDate: new Date().toISOString().split("T")[0],
            downloadUrl: "#",
          };
        }
        return f;
      });

      setPdfFiles(updatedFiles);
      setUsageStats(prev => ({
        ...prev,
        pdfsProcessed: prev.pdfsProcessed + pendingFiles.length,
        issuesFixed: prev.issuesFixed + totalIssuesFixed,
      }));
      
      setLoading(false);
      showSnackbar(`Remediated ${pendingFiles.length} PDF file(s)`, "success");
    }, 4000);
  };

  const handleDownload = (pdf) => {
    if (pdf.downloadUrl) {
      showSnackbar(`Downloading ${pdf.name}...`, "info");
      // In a real app, this would trigger the download
    } else {
      showSnackbar("File not available for download", "warning");
    }
  };

  const handleDelete = (id) => {
    setPdfFiles(pdfFiles.filter(f => f.id !== id));
    showSnackbar("PDF file removed", "info");
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle color="success" />;
      case "failed":
        return <Error color="error" />;
      case "pending":
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  };

  const getAccessibilityColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const AccessibilityScoreDisplay = ({ score }) => (
    <Box sx={{ position: "relative", display: "inline-flex", mr: 2 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: getAccessibilityColor(score),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {score}
      </Box>
      <Typography variant="caption" sx={{ position: "absolute", bottom: -20 }}>
        Score
      </Typography>
    </Box>
  );

  const RemediationFeatureCard = ({ title, description, enabled, toggleSetting }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={() => toggleSetting()}
                color="primary"
              />
            }
            label=""
          />
        </Box>
      </CardContent>
    </Card>
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
            backgroundColor: `${
              userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)"
            }`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                PDF Accessibility Remediation
              </Typography>
              <Box display="flex" alignItems="center">
                <Chip
                  label={userPlanData.planName}
                  sx={{
                    backgroundColor: `${
                      userPlanData.planId === "basic"
                        ? "#757575"
                        : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00"
                    }`,
                    color: "white",
                    fontSize: "1rem",
                    padding: "4px 12px",
                  }}
                />
                {isAuthenticated && user && (
                  <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
                    Welcome, {user.email}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => (window.location.href = "/security")}
              >
                Security
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
                startIcon={<CloudUpload />}
                component="label"
              >
                Upload PDFs
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Usage Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <PictureAsPdf
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                PDFs Processed
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
              >
                {usageStats.pdfsProcessed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Documents
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Accessibility
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Avg. Accessibility
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: getAccessibilityColor(usageStats.accessibilityScore),
                }}
              >
                {usageStats.accessibilityScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CheckCircle
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Issues Fixed
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                }}
              >
                {usageStats.issuesFixed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Resolved
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different sections */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "medium",
              },
            }}
          >
            <Tab label="PDF Files" icon={<PictureAsPdf />} iconPosition="start" />
            <Tab label="Remediation Settings" icon={<Settings />} iconPosition="start" />
            <Tab label="History" icon={<History />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Content based on active tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Left: PDF List */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    PDF Files ({pdfFiles.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleBulkRemediate}
                    disabled={!canUseBulkProcessing || pdfFiles.filter(f => f.status === "pending").length === 0}
                  >
                    Remediate All
                  </Button>
                </Box>

                {loading && <LinearProgress sx={{ mb: 2 }} />}

                <List>
                  {pdfFiles.map((pdf) => (
                    <React.Fragment key={pdf.id}>
                      <ListItem
                        sx={{
                          backgroundColor: selectedPdf?.id === pdf.id ? "action.selected" : "transparent",
                          "&:hover": { backgroundColor: "action.hover" },
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedPdf(pdf)}
                      >
                        <ListItemIcon>
                          {getStatusIcon(pdf.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Typography variant="subtitle1">
                                {pdf.name}
                              </Typography>
                              <AccessibilityScoreDisplay score={pdf.accessibilityScore} />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {pdf.size} • Uploaded: {pdf.uploadDate}
                              </Typography>
                              {pdf.status === "completed" && (
                                <Typography variant="caption" color="success.main">
                                  Remediated: {pdf.remediatedDate}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Remediate">
                              <IconButton
                                size="small"
                                onClick={() => handleRemediatePdf(pdf)}
                                disabled={pdf.status === "completed" || loading}
                                color="primary"
                              >
                                <Accessibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => handleDownload(pdf)}
                                disabled={pdf.status !== "completed"}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(pdf.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>

                {pdfFiles.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <PictureAsPdf sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No PDF files uploaded yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Upload PDFs to start accessibility remediation
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Right: PDF Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                {selectedPdf ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {selectedPdf.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={3}>
                      <AccessibilityScoreDisplay score={selectedPdf.accessibilityScore} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status: {selectedPdf.status.charAt(0).toUpperCase() + selectedPdf.status.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {selectedPdf.size}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Accessibility Issues:
                    </Typography>
                    <List dense>
                      {selectedPdf.issues.map((issue, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning fontSize="small" color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>

                    {selectedPdf.status === "completed" && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        This PDF has been successfully remediated and is now accessible.
                      </Alert>
                    )}

                    {selectedPdf.status === "pending" && (
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: 2,
                          backgroundColor: `${
                            userPlanData.planId === "basic"
                              ? "#757575"
                              : userPlanData.planId === "standard"
                                ? "#2196f3"
                                : "#ff6f00"
                          }`,
                        }}
                        onClick={() => handleRemediatePdf(selectedPdf)}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Start Remediation"}
                      </Button>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Info sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Select a PDF file to view details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Click on any PDF in the list to see its accessibility issues
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Remediation Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure which accessibility features to apply during PDF remediation.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RemediationFeatureCard
                  title="Add Document Tags"
                  description="Create proper tag structure for screen readers"
                  enabled={remediationSettings.addTags}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    addTags: !prev.addTags 
                  }))}
                />
                <RemediationFeatureCard
                  title="Add Alternative Text"
                  description="Add alt text to images and graphics"
                  enabled={remediationSettings.addAltText}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    addAltText: !prev.addAltText 
                  }))}
                />
                <RemediationFeatureCard
                  title="Set Document Language"
                  description="Define the primary language for the document"
                  enabled={remediationSettings.setLanguage}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    setLanguage: !prev.setLanguage 
                  }))}
                />
                <RemediationFeatureCard
                  title="Fix Reading Order"
                  description="Ensure logical reading order for screen readers"
                  enabled={remediationSettings.fixReadingOrder}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    fixReadingOrder: !prev.fixReadingOrder 
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RemediationFeatureCard
                  title="Add Bookmarks"
                  description="Create navigation bookmarks for large documents"
                  enabled={remediationSettings.addBookmarks}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    addBookmarks: !prev.addBookmarks 
                  }))}
                />
                <RemediationFeatureCard
                  title="Fix Color Contrast"
                  description="Ensure sufficient color contrast for readability"
                  enabled={remediationSettings.fixColorContrast}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    fixColorContrast: !prev.fixColorContrast 
                  }))}
                />
                <RemediationFeatureCard
                  title="Add Table Headers"
                  description="Properly tag table headers for screen readers"
                  enabled={remediationSettings.addTableHeaders}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    addTableHeaders: !prev.addTableHeaders 
                  }))}
                />
                <RemediationFeatureCard
                  title="Generate Report"
                  description="Create accessibility compliance report"
                  enabled={remediationSettings.generateAccessibilityReport}
                  toggleSetting={() => setRemediationSettings(prev => ({ 
                    ...prev, 
                    generateAccessibilityReport: !prev.generateAccessibilityReport 
                  }))}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> More features are available in higher plans. 
                Upgrade to access advanced remediation options.
              </Typography>
            </Alert>
          </Paper>
        )}

        {activeTab === 2 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Remediation History
            </Typography>
            
            <List>
              {remediationHistory.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemIcon>
                      {item.status === "success" ? 
                        <CheckCircle color="success" /> : 
                        <Error color="error" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={item.fileName}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Date: {item.date} • Issues Fixed: {item.issuesFixed}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Score: {item.beforeScore} → {item.afterScore} 
                            ({item.afterScore - item.beforeScore > 0 ? "+" : ""}{item.afterScore - item.beforeScore})
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Download Report">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            {remediationHistory.length === 0 && (
              <Box textAlign="center" py={4}>
                <History sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No remediation history yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Remediate PDF files to see history here
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: `${
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
              }`,
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                backgroundColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              startIcon={<CloudUpload />}
              component="label"
            >
              Upload PDFs
              <input
                type="file"
                hidden
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              startIcon={<Compare />}
              onClick={() => (window.location.href = "/compare")}
            >
              Compare Accessibility
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              startIcon={<Visibility />}
              onClick={() => (window.location.href = "/preview")}
            >
              Preview Remediated
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              startIcon={<TextFormat />}
              onClick={() => (window.location.href = "/standards")}
            >
              Accessibility Standards
            </Button>
          </Box>
          
          {!canUseAdvancedFeatures && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium for bulk processing and advanced remediation features.
            </Typography>
          )}
        </Paper>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Bulk Remediation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remediate all {pdfFiles.filter(f => f.status === "pending").length} pending PDF files?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This process may take several minutes depending on file sizes and complexity.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmBulkRemediate} variant="contained" color="primary">
            Start Remediation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PdfAccessibilityRemediation;