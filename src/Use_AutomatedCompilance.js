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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Alert,
  Snackbar,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Security,
  Description,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  AutoFixHigh,
  Download,
  Refresh,
  History,
  Search,
  FilterList,
  CloudUpload,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const AutomatedCompliance = () => {
  // Use the security context hook
  const { isAuthenticated, user, hasPermission } = useSecurity();

  // Use localStorage for user plan data
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    billingCycle: "monthly",
  });

  // State for compliance checks
  const [complianceChecks, setComplianceChecks] = useState([
    {
      id: 1,
      name: "PDF/A Compliance",
      description: "Ensures PDF files meet archival standards",
      status: "passed",
      lastRun: "2024-01-15",
      nextRun: "2024-02-15",
      severity: "low",
      autoFix: true,
    },
    {
      id: 2,
      name: "WCAG 2.1 AA",
      description: "Web Content Accessibility Guidelines compliance",
      status: "warning",
      lastRun: "2024-01-10",
      nextRun: "2024-02-10",
      severity: "medium",
      autoFix: false,
    },
    {
      id: 3,
      name: "Section 508",
      description: "U.S. federal accessibility requirements",
      status: "failed",
      lastRun: "2024-01-05",
      nextRun: "2024-02-05",
      severity: "high",
      autoFix: true,
    },
    {
      id: 4,
      name: "GDPR Compliance",
      description: "General Data Protection Regulation",
      status: "passed",
      lastRun: "2024-01-18",
      nextRun: "2024-02-18",
      severity: "high",
      autoFix: false,
    },
    {
      id: 5,
      name: "HIPAA Compliance",
      description: "Health Insurance Portability and Accountability Act",
      status: "warning",
      lastRun: "2024-01-12",
      nextRun: "2024-02-12",
      severity: "high",
      autoFix: true,
    },
    {
      id: 6,
      name: "SOX Compliance",
      description: "Sarbanes-Oxley Act requirements",
      status: "passed",
      lastRun: "2024-01-20",
      nextRun: "2024-02-20",
      severity: "medium",
      autoFix: false,
    },
  ]);

  const [selectedChecks, setSelectedChecks] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [scanSchedule, setScanSchedule] = useState("weekly");

  // Check permissions for features
  const canUseAdvancedCompliance = hasPermission("advanced_compliance");
  const canAutoFix = hasPermission("compliance_autofix");
  const canExportReports = hasPermission("export_reports");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;
      setUserPlanData({
        planId: planData.planId,
        planName: planData.planName,
        billingCycle: planData.billingCycle,
      });
    }

    // Load saved scan results
    const savedResults = useLocalStorage.getItem("compliance_scan_results");
    if (savedResults) {
      setScanResults(savedResults);
    }
  }, []);

  // Plan details matching Dashboard
  const planDetails = {
    basic: {
      name: "Begin Plan",
      complianceChecks: 3,
      autoFix: false,
      scheduledScans: false,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      complianceChecks: 10,
      autoFix: true,
      scheduledScans: true,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      complianceChecks: "Unlimited",
      autoFix: true,
      scheduledScans: true,
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircle sx={{ color: "#4caf50" }} />;
      case "warning":
        return <Warning sx={{ color: "#ff9800" }} />;
      case "failed":
        return <Error sx={{ color: "#f44336" }} />;
      default:
        return <Schedule sx={{ color: "#9e9e9e" }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedChecks((prev) =>
      prev.includes(id)
        ? prev.filter((checkId) => checkId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedChecks.length === complianceChecks.length) {
      setSelectedChecks([]);
    } else {
      setSelectedChecks(complianceChecks.map((check) => check.id));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setNotification({
        open: true,
        message: `File "${file.name}" uploaded successfully`,
        severity: "success",
      });
    }
  };

  const runComplianceScan = () => {
    if (!uploadedFile && selectedChecks.length === 0) {
      setNotification({
        open: true,
        message: "Please upload a file or select compliance checks to run",
        severity: "warning",
      });
      return;
    }

    setIsScanning(true);
    setScanStatus("scanning");

    // Simulate scan process
    setTimeout(() => {
      const newResults = [
        {
          id: Date.now(),
          fileName: uploadedFile?.name || "Manual Compliance Check",
          timestamp: new Date().toISOString(),
          checksRun: selectedChecks.length || complianceChecks.length,
          issuesFound: Math.floor(Math.random() * 5),
          autoFixed: canAutoFix ? Math.floor(Math.random() * 3) : 0,
          status: Math.random() > 0.3 ? "completed" : "failed",
        },
        ...scanResults,
      ];

      setScanResults(newResults.slice(0, 10)); // Keep only last 10 results
      useLocalStorage.setItem("compliance_scan_results", newResults.slice(0, 10));
      
      setIsScanning(false);
      setScanStatus("completed");
      setNotification({
        open: true,
        message: "Compliance scan completed successfully",
        severity: "success",
      });
    }, 2000);
  };

  const handleAutoFix = (checkId) => {
    if (!canAutoFix) {
      setNotification({
        open: true,
        message: "Auto-fix feature requires Standard or Premium plan",
        severity: "warning",
      });
      return;
    }

    setComplianceChecks((prev) =>
      prev.map((check) =>
        check.id === checkId ? { ...check, status: "passed", autoFix: true } : check
      )
    );

    setNotification({
      open: true,
      message: `Auto-fix applied to selected compliance check`,
      severity: "success",
    });
  };

  const handleExportReport = () => {
    if (!canExportReports) {
      setNotification({
        open: true,
        message: "Export feature requires Standard or Premium plan",
        severity: "warning",
      });
      return;
    }

    // Simulate export process
    setNotification({
      open: true,
      message: "Compliance report exported successfully",
      severity: "success",
    });
  };

  const filteredChecks = complianceChecks.filter((check) => {
    if (filterStatus === "all") return true;
    return check.status === filterStatus;
  });

  const FeatureCard = ({ icon, title, description, available = true }) => (
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
                Automated Compliance Scanner
              </Typography>
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
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Welcome, {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => (window.location.href = "/security")}
              >
                Security Settings
              </Button>
              {userPlanData.planId === "basic" && (
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
                  onClick={() => (window.location.href = "/features")}
                >
                  Upgrade for Advanced Features
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Security
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
                Active Checks
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
                {complianceChecks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {currentPlan.complianceChecks} available
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                Passed Checks
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
                {complianceChecks.filter((c) => c.status === "passed").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <AutoFixHigh
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
                Auto-fixed Issues
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
                {complianceChecks.filter((c) => c.autoFix).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {canAutoFix ? "Enabled" : "Upgrade required"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Schedule
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
                Next Scheduled Scan
              </Typography>
              <Typography
                variant="h5"
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
                {currentPlan.scheduledScans ? "Tomorrow" : "Not scheduled"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {autoScanEnabled ? "Auto-scan on" : "Auto-scan off"}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* File Upload and Scan Control */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
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
              Document Scan
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Document for Compliance Check
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.400",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: "grey.500", mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Drag and drop your document here, or
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: `${
                        userPlanData.planId === "basic"
                          ? "#757575"
                          : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00"
                      }`,
                    }}
                  >
                    Browse Files
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
                {uploadedFile && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Selected file: <strong>{uploadedFile.name}</strong>
                  </Alert>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Scan Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Scan Schedule"
                      value={scanSchedule}
                      onChange={(e) => setScanSchedule(e.target.value)}
                      disabled={!currentPlan.scheduledScans}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoScanEnabled}
                          onChange={(e) => setAutoScanEnabled(e.target.checked)}
                          disabled={!currentPlan.scheduledScans}
                        />
                      }
                      label="Enable Auto-scan"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={isScanning ? <Refresh sx={{ animation: "spin 2s linear infinite" }} /> : <Search />}
                onClick={runComplianceScan}
                disabled={isScanning}
                sx={{
                  backgroundColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                  }`,
                  py: 1.5,
                }}
              >
                {isScanning ? "Scanning..." : "Run Compliance Scan"}
              </Button>
            </Paper>
          </Grid>

          {/* Compliance Checks */}
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                variant="h5"
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
                Compliance Checks
              </Typography>
              <Button
                startIcon={<FilterList />}
                onClick={() => setFilterStatus(filterStatus === "all" ? "failed" : "all")}
              >
                {filterStatus === "all" ? "Show Failed Only" : "Show All"}
              </Button>
            </Box>
            <Paper elevation={2}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedChecks.length === complianceChecks.length}
                          indeterminate={
                            selectedChecks.length > 0 &&
                            selectedChecks.length < complianceChecks.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Check Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredChecks.map((check) => (
                      <TableRow
                        key={check.id}
                        hover
                        sx={{
                          backgroundColor:
                            check.status === "failed" ? "rgba(244, 67, 54, 0.08)" : "inherit",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedChecks.includes(check.id)}
                            onChange={() => handleCheckboxChange(check.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {check.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {check.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getStatusIcon(check.status)}
                            <Chip
                              label={check.status.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor:
                                  check.status === "passed"
                                    ? "rgba(76, 175, 80, 0.1)"
                                    : check.status === "warning"
                                    ? "rgba(255, 152, 0, 0.1)"
                                    : "rgba(244, 67, 54, 0.1)",
                                color:
                                  check.status === "passed"
                                    ? "#4caf50"
                                    : check.status === "warning"
                                    ? "#ff9800"
                                    : "#f44336",
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={check.severity.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: getSeverityColor(check.severity) + "20",
                              color: getSeverityColor(check.severity),
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<AutoFixHigh />}
                            onClick={() => handleAutoFix(check.id)}
                            disabled={!canAutoFix || check.status === "passed"}
                          >
                            Auto-fix
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Scan History */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
                }`,
                mt: 2,
              }}
            >
              Scan History
            </Typography>
            <Paper elevation={2}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="center">Checks Run</TableCell>
                      <TableCell align="center">Issues Found</TableCell>
                      <TableCell align="center">Auto-fixed</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scanResults.map((result) => (
                      <TableRow key={result.id} hover>
                        <TableCell>{result.fileName}</TableCell>
                        <TableCell>
                          {new Date(result.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">{result.checksRun}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={result.issuesFound}
                            size="small"
                            color={result.issuesFound > 0 ? "error" : "success"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={result.autoFixed}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={result.status.toUpperCase()}
                            size="small"
                            color={result.status === "completed" ? "success" : "error"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<Description />}
                            onClick={() => setNotification({
                              open: true,
                              message: "Detailed report opened",
                              severity: "info",
                            })}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {scanResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No scan history yet. Run your first compliance scan!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Features Grid */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
                }`,
                mt: 2,
              }}
            >
              Compliance Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <AutoFixHigh
                      sx={{
                        color: `${
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                            ? "#2196f3"
                            : "#ff6f00"
                        }`,
                      }}
                    />
                  }
                  title="Auto-fix Issues"
                  description="Automatically fix common compliance issues"
                  available={canAutoFix}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <Schedule
                      sx={{
                        color: `${
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                            ? "#2196f3"
                            : "#ff6f00"
                        }`,
                      }}
                    />
                  }
                  title="Scheduled Scans"
                  description="Automatically scan documents on schedule"
                  available={currentPlan.scheduledScans}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <Download
                      sx={{
                        color: `${
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                            ? "#2196f3"
                            : "#ff6f00"
                        }`,
                      }}
                    />
                  }
                  title="Export Reports"
                  description="Generate compliance reports for audits"
                  available={canExportReports}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <History
                      sx={{
                        color: `${
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                            ? "#2196f3"
                            : "#ff6f00"
                        }`,
                      }}
                    />
                  }
                  title="Audit Trail"
                  description="Complete history of all compliance scans"
                  available={true}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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
              onClick={runComplianceScan}
              disabled={isScanning}
            >
              Run Quick Scan
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
              onClick={handleExportReport}
              disabled={!canExportReports}
            >
              Export Report
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
              onClick={() => setSelectedChecks(complianceChecks.filter(c => c.status === "failed").map(c => c.id))}
            >
              Select Failed Checks
            </Button>
            {userPlanData.planId === "basic" && (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#ff6f00",
                  color: "#ff6f00",
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade for Auto-fix
              </Button>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* CSS for spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AutomatedCompliance;