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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete,
  Visibility,
  Download,
  Upload,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  CloudUpload,
  Description,
  FileCopy,
  Storage,
  Compare,
  SwapHoriz,
  Security,
} from "@mui/icons-material";
import "./Use_App.css";

// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";

const FileRemediationPage = () => {
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

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [remediationResults, setRemediationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [remediationSettings, setRemediationSettings] = useState({
    fixCommonIssues: true,
    optimizeFileSize: true,
    validateStructure: true,
    removeUnusedElements: true,
    standardizeUnits: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch user plan data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }
  }, []);

  // Simulated initial files for demonstration
  useEffect(() => {
    const initialFiles = [
      {
        id: 1,
        name: "assembly_v1.stp",
        type: "STEP",
        size: "2.4 MB",
        status: "pending",
        issues: ["Missing metadata", "Large file size", "Inconsistent units"],
        uploadDate: "2024-01-15",
      },
      {
        id: 2,
        name: "bracket_import.dwg",
        type: "DWG",
        size: "1.8 MB",
        status: "completed",
        issues: ["Unsupported layer types", "Outdated version"],
        uploadDate: "2024-01-14",
        remediationDate: "2024-01-14",
      },
      {
        id: 3,
        name: "mechanical_part.iges",
        type: "IGES",
        size: "3.2 MB",
        status: "failed",
        issues: ["Corrupt file structure", "Missing geometry"],
        uploadDate: "2024-01-13",
        error: "File structure corruption detected",
      },
    ];
    setFiles(initialFiles);
  }, []);

  const getPlanColor = () => {
    return userPlanData.planId === "basic"
      ? "#757575"
      : userPlanData.planId === "standard"
        ? "#2196f3"
        : "#ff6f00";
  };

  const getPlanBackground = () => {
    return userPlanData.planId === "basic"
      ? "rgba(117, 117, 117, 0.3)"
      : userPlanData.planId === "standard"
        ? "rgba(33, 150, 243, 0.3)"
        : "rgba(255, 111, 0, 0.3)";
  };

  const handleFileUpload = (event) => {
    const uploaded = Array.from(event.target.files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.name.split(".").pop().toUpperCase(),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "pending",
      file: file,
      issues: [],
      uploadDate: new Date().toISOString().split("T")[0],
    }));
    setUploadedFiles([...uploadedFiles, ...uploaded]);
    setSnackbar({
      open: true,
      message: `Uploaded ${uploaded.length} file(s)`,
      severity: "success",
    });
  };

  const handleRemediateFile = (file) => {
    setSelectedFile(file);
    setLoading(true);

    // Simulate remediation process
    setTimeout(() => {
      const result = {
        fileId: file.id,
        fileName: file.name,
        timestamp: new Date().toISOString(),
        originalSize: file.size,
        remediatedSize: `${(parseFloat(file.size) * 0.8).toFixed(1)} MB`,
        issuesFixed: Math.floor(Math.random() * file.issues.length) + 1,
        totalIssues: file.issues.length,
        status: Math.random() > 0.2 ? "success" : "failed",
        details: [
          "✓ Fixed missing metadata",
          "✓ Optimized file structure",
          "✓ Standardized units to metric",
          "✓ Removed unused layers",
          "✓ Compressed file size",
        ],
      };

      setRemediationResults([result, ...remediationResults]);

      // Update file status
      const updatedFiles = files.map((f) =>
        f.id === file.id ? { ...f, status: result.status } : f,
      );
      setFiles(updatedFiles);

      setLoading(false);
      setSnackbar({
        open: true,
        message: `Remediation ${result.status === "success" ? "completed" : "failed"} for ${file.name}`,
        severity: result.status === "success" ? "success" : "error",
      });
    }, 2000);
  };

  const handleRemediateAll = () => {
    setOpenDialog(true);
  };

  const handleConfirmRemediateAll = () => {
    setOpenDialog(false);
    setLoading(true);

    // Simulate bulk remediation
    setTimeout(() => {
      const pendingFiles = files.filter((f) => f.status === "pending");
      const newResults = pendingFiles.map((file) => ({
        fileId: file.id,
        fileName: file.name,
        timestamp: new Date().toISOString(),
        originalSize: file.size,
        remediatedSize: `${(parseFloat(file.size) * (0.7 + Math.random() * 0.2)).toFixed(1)} MB`,
        issuesFixed: Math.floor(Math.random() * file.issues.length) + 1,
        totalIssues: file.issues.length,
        status: Math.random() > 0.15 ? "success" : "failed",
      }));

      setRemediationResults([...newResults, ...remediationResults]);

      const updatedFiles = files.map((f) => {
        const result = newResults.find((r) => r.fileId === f.id);
        return result ? { ...f, status: result.status } : f;
      });
      setFiles(updatedFiles);

      setLoading(false);
      setSnackbar({
        open: true,
        message: `Remediated ${pendingFiles.length} file(s)`,
        severity: "success",
      });
    }, 3000);
  };

  const handleDownload = (file) => {
    // Simulate download
    setSnackbar({
      open: true,
      message: `Downloading ${file.name}...`,
      severity: "info",
    });
  };

  const handleDelete = (fileId) => {
    setFiles(files.filter((f) => f.id !== fileId));
    setSnackbar({
      open: true,
      message: "File removed",
      severity: "info",
    });
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
        return <Warning color="action" />;
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      completed: "success",
      failed: "error",
      pending: "warning",
    };

    return (
      <Chip
        icon={getStatusIcon(status)}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        color={colors[status]}
        variant="outlined"
        sx={{
          borderColor: getPlanColor(),
          color: getPlanColor(),
        }}
      />
    );
  };

  const FeatureCard = ({ icon, title, description, available = true }) => (
    <Card
      className="feature-card"
      sx={{
        opacity: available ? 1 : 0.6,
        height: "100%",
        border: `1px solid ${getPlanColor()}20`,
      }}
    >
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
    <div className="remediation-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: getPlanBackground(),
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                File Remediation Dashboard
              </Typography>
              <Chip
                label={
                  userPlanData.planId === "basic"
                    ? "Begin Plan"
                    : userPlanData.planId === "standard"
                      ? "Standard Plan"
                      : "Premium Plan"
                }
                sx={{
                  backgroundColor: getPlanColor(),
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {/* Show user email if authenticated */}
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
                sx={{
                  borderColor: getPlanColor(),
                  color: getPlanColor(),
                }}
              >
                Security
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                component="label"
                sx={{
                  backgroundColor: getPlanColor(),
                  "&:hover": {
                    backgroundColor: getPlanColor(),
                    opacity: 0.9,
                  },
                }}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".stp,.step,.dwg,.dxf,.iges,.igs,.sat,.sldprt,.prt"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description
                sx={{
                  fontSize: 40,
                  color: getPlanColor(),
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Files Processed
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: getPlanColor(),
                }}
              >
                {remediationResults.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Remediations
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CheckCircle
                sx={{
                  fontSize: 40,
                  color: getPlanColor(),
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Success Rate
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: getPlanColor(),
                }}
              >
                {remediationResults.length > 0
                  ? `${Math.round(
                      (remediationResults.filter((r) => r.status === "success")
                        .length /
                        remediationResults.length) *
                        100,
                    )}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful Fixes
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Warning
                sx={{
                  fontSize: 40,
                  color: getPlanColor(),
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Issues Fixed
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: getPlanColor(),
                }}
              >
                {remediationResults.reduce((sum, r) => sum + r.issuesFixed, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Issues Resolved
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Left Column: File List */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: getPlanColor(),
                  }}
                >
                  Files Needing Remediation
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRemediateAll}
                  disabled={
                    files.filter((f) => f.status === "pending").length === 0
                  }
                  sx={{
                    borderColor: getPlanColor(),
                    color: getPlanColor(),
                  }}
                >
                  Remediate All
                </Button>
              </Box>

              {loading && <LinearProgress sx={{ mb: 2 }} />}

              <List>
                {files.map((file) => (
                  <React.Fragment key={file.id}>
                    <ListItem
                      sx={{
                        backgroundColor:
                          selectedFile?.id === file.id
                            ? getPlanColor() + "10"
                            : "transparent",
                        "&:hover": { backgroundColor: getPlanColor() + "08" },
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ mr: 2 }}>{getStatusIcon(file.status)}</Box>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {file.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              Type: {file.type} | Size: {file.size}
                            </Typography>
                            <Box
                              display="flex"
                              flexWrap="wrap"
                              gap={0.5}
                              mt={0.5}
                            >
                              {file.issues.map((issue, idx) => (
                                <Chip
                                  key={idx}
                                  label={issue}
                                  size="small"
                                  sx={{
                                    backgroundColor: getPlanColor() + "20",
                                    color: getPlanColor(),
                                    borderColor: getPlanColor(),
                                  }}
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" gap={1}>
                          {getStatusChip(file.status)}
                          <IconButton
                            size="small"
                            onClick={() => handleRemediateFile(file)}
                            disabled={file.status === "completed" || loading}
                            sx={{ color: getPlanColor() }}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(file)}
                            sx={{ color: getPlanColor() }}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(file.id)}
                            sx={{ color: "#f44336" }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {files.indexOf(file) < files.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {files.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Description
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    No files uploaded yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Upload engineering files to begin remediation
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Remediation Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: getPlanColor(),
                }}
              >
                Remediation Results
              </Typography>

              {selectedFile && (
                <Box
                  mb={3}
                  p={2}
                  sx={{
                    backgroundColor: getPlanColor() + "08",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Selected File: {selectedFile.name}
                  </Typography>
                  <Alert
                    severity="info"
                    sx={{ mb: 2, borderColor: getPlanColor() }}
                  >
                    {selectedFile.issues.length} issue(s) detected
                  </Alert>

                  <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                      Remediation Actions:
                    </Typography>
                    <List dense>
                      {selectedFile.issues.map((issue, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={issue} />
                          <CheckCircle
                            fontSize="small"
                            sx={{ color: getPlanColor() }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Recent Remediation History:
              </Typography>

              <List dense>
                {remediationResults.slice(0, 5).map((result, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "action.hover" : "transparent",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ mr: 2 }}>
                        {result.status === "success" ? (
                          <CheckCircle
                            sx={{ color: getPlanColor() }}
                            fontSize="small"
                          />
                        ) : (
                          <Error color="error" fontSize="small" />
                        )}
                      </Box>
                      <ListItemText
                        primary={result.fileName}
                        secondary={
                          <Typography variant="caption">
                            {result.issuesFixed}/{result.totalIssues} issues
                            fixed | Size: {result.originalSize} →{" "}
                            {result.remediatedSize}
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(result)}
                        sx={{ color: getPlanColor() }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </ListItem>
                    {index < Math.min(4, remediationResults.length - 1) && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </List>

              {remediationResults.length === 0 && (
                <Box textAlign="center" py={4}>
                  <FileCopy
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    No remediation history yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Remediate files to see results here
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Remediation Features */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: getPlanColor(),
            }}
          >
            Remediation Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<SwapHoriz sx={{ color: getPlanColor() }} />}
                title="Fix Common Issues"
                description="Automatically fix missing metadata, inconsistent units, and other common problems"
                available={remediationSettings.fixCommonIssues}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<Storage sx={{ color: getPlanColor() }} />}
                title="Optimize File Size"
                description="Reduce file size while maintaining quality and integrity"
                available={remediationSettings.optimizeFileSize}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<Compare sx={{ color: getPlanColor() }} />}
                title="Validate Structure"
                description="Check and repair corrupt or incomplete file structures"
                available={remediationSettings.validateStructure}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<Delete sx={{ color: getPlanColor() }} />}
                title="Remove Unused Elements"
                description="Clean up unused layers, blocks, and other elements"
                available={remediationSettings.removeUnusedElements}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<Description sx={{ color: getPlanColor() }} />}
                title="Standardize Units"
                description="Convert all measurements to consistent units (metric/imperial)"
                available={remediationSettings.standardizeUnits}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={<Security sx={{ color: getPlanColor() }} />}
                title="Security Validation"
                description="Check for security vulnerabilities and potential threats"
                available={true}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: getPlanColor(),
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                backgroundColor: getPlanColor(),
              }}
              startIcon={<CloudUpload />}
              component="label"
            >
              Upload Files
              <input
                type="file"
                hidden
                multiple
                accept=".stp,.step,.dwg,.dxf,.iges,.igs,.sat,.sldprt,.prt"
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/convert")}
            >
              File Conversion
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/view")}
            >
              View Files
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Remediate All Files</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remediate all{" "}
            {files.filter((f) => f.status === "pending").length} pending files?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This process may take several minutes depending on file sizes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmRemediateAll}
            variant="contained"
            sx={{
              backgroundColor: getPlanColor(),
            }}
          >
            Start Remediation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            backgroundColor:
              snackbar.severity === "success"
                ? getPlanColor() + "20"
                : undefined,
            borderColor: getPlanColor(),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FileRemediationPage;
