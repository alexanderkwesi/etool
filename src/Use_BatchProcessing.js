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
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  Delete,
  MoreVert,
  PlayArrow,
  Pause,
  Stop,
  Download,
  Visibility,
  SwapHoriz,
  Schedule,
  CheckCircle,
  Error,
  HourglassEmpty,
  Refresh,
  Search,
  FilterList,
  Sort,
  Storage,
  Security,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const BatchProcessing = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [batchJobs, setBatchJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    targetFormat: "PDF",
    preserveQuality: true,
    optimizeSize: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check permissions
  const canUseBatchProcessing = hasPermission("batch_processing");
  const canUseAdvancedFeatures = hasPermission("advanced_features");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Load sample batch jobs (in real app, this would come from backend)
    const sampleJobs = [
      {
        id: 1,
        name: "Q1 Reports Conversion",
        status: "completed",
        fileCount: 25,
        completed: 25,
        totalSize: "245 MB",
        createdAt: "2024-01-15 10:30",
        completedAt: "2024-01-15 11:45",
        sourceFormat: "DOCX",
        targetFormat: "PDF",
      },
      {
        id: 2,
        name: "Client Contracts",
        status: "processing",
        fileCount: 12,
        completed: 8,
        totalSize: "156 MB",
        createdAt: "2024-01-16 09:15",
        sourceFormat: "PDF",
        targetFormat: "DOCX",
      },
      {
        id: 3,
        name: "Marketing Materials",
        status: "pending",
        fileCount: 8,
        completed: 0,
        totalSize: "89 MB",
        createdAt: "2024-01-16 14:20",
        sourceFormat: "PPTX",
        targetFormat: "PDF",
      },
      {
        id: 4,
        name: "Legal Documents",
        status: "failed",
        fileCount: 5,
        completed: 3,
        totalSize: "120 MB",
        createdAt: "2024-01-15 16:45",
        sourceFormat: "DOC",
        targetFormat: "PDF",
        errorMessage: "File size exceeded limit",
      },
      {
        id: 5,
        name: "Product Manuals",
        status: "completed",
        fileCount: 15,
        completed: 15,
        totalSize: "320 MB",
        createdAt: "2024-01-14 11:00",
        completedAt: "2024-01-14 12:30",
        sourceFormat: "PDF",
        targetFormat: "HTML",
      },
    ];
    setBatchJobs(sampleJobs);
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadStep(1);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFiles([...uploadedFiles]);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleMenuOpen = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };

  const handleStartProcessing = () => {
    if (selectedFiles.length === 0) {
      setNotification({
        open: true,
        message: "Please select files to process",
        severity: "warning",
      });
      return;
    }

    const newJob = {
      id: batchJobs.length + 1,
      name: `Batch ${batchJobs.length + 1}`,
      status: "processing",
      fileCount: selectedFiles.length,
      completed: 0,
      totalSize: `${Math.round(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024)} MB`,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      sourceFormat: "Multiple",
      targetFormat: conversionSettings.targetFormat,
    };

    setBatchJobs([newJob, ...batchJobs]);
    setActiveJob(newJob.id);
    setSelectedFiles([]);
    setUploadDialogOpen(false);
    setUploadStep(0);
    setUploadedFiles([]);

    // Simulate processing
    simulateProcessing(newJob.id);
  };

  const simulateProcessing = (jobId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setBatchJobs((prev) =>
        prev.map((job) => {
          if (job.id === jobId) {
            const completedFiles = Math.floor((progress / 100) * job.fileCount);
            if (progress >= 100) {
              clearInterval(interval);
              return {
                ...job,
                status: "completed",
                completed: job.fileCount,
                completedAt: new Date()
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " "),
              };
            }
            return {
              ...job,
              completed: completedFiles,
            };
          }
          return job;
        }),
      );
    }, 100);
  };

  const handleDeleteJob = (jobId) => {
    setBatchJobs(batchJobs.filter((job) => job.id !== jobId));
    handleMenuClose();
  };

  const handleRetryJob = (jobId) => {
    setBatchJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          return { ...job, status: "processing", errorMessage: null };
        }
        return job;
      }),
    );
    simulateProcessing(jobId);
    handleMenuClose();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle sx={{ color: "#4caf50" }} />;
      case "processing":
        return <CircularProgress size={20} />;
      case "failed":
        return <Error sx={{ color: "#f44336" }} />;
      case "pending":
        return <HourglassEmpty sx={{ color: "#ff9800" }} />;
      default:
        return <Schedule sx={{ color: "#757575" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "processing":
        return "#2196f3";
      case "failed":
        return "#f44336";
      case "pending":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const filteredJobs = batchJobs.filter((job) => {
    const matchesSearch = job.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatOptions = [
    "PDF",
    "DOCX",
    "DOC",
    "PPTX",
    "PPT",
    "XLSX",
    "XLS",
    "HTML",
    "TXT",
    "JPG",
    "PNG",
  ];

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
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Batch Processing
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
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              disabled={!canUseBatchProcessing}
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
              New Batch Job
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
                Total Jobs
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
                {batchJobs.length}
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
                Completed
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
                {batchJobs.filter((job) => job.status === "completed").length}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SwapHoriz
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
                Files Processed
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
                {batchJobs.reduce((acc, job) => acc + job.completed, 0)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Storage
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
                Total Size
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
                {batchJobs
                  .reduce((acc, job) => {
                    const size = parseFloat(job.totalSize);
                    return isNaN(size) ? acc : acc + size;
                  }, 0)
                  .toFixed(0)}{" "}
                MB
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Batch Jobs Table */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
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
              Batch Jobs
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                size="small"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<FilterList />}
                onClick={() =>
                  setFilterStatus(filterStatus === "all" ? "processing" : "all")
                }
              >
                Filter
              </Button>
              <Button startIcon={<Sort />}>Sort</Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Source → Target</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {job.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(job.status)}
                        <Chip
                          label={
                            job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)
                          }
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(job.status),
                            color: "white",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: "100%" }}>
                        <LinearProgress
                          variant="determinate"
                          value={(job.completed / job.fileCount) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getStatusColor(job.status),
                            },
                          }}
                        />
                        <Typography variant="caption">
                          {job.completed}/{job.fileCount} files
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{job.fileCount}</TableCell>
                    <TableCell>{job.totalSize}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${job.sourceFormat} → ${job.targetFormat}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{job.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, job.id)}
                      >
                        <MoreVert />
                      </IconButton>
                      {job.status === "completed" && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            (window.location.href = `/download/${job.id}`)
                          }
                        >
                          <Download />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredJobs.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No batch jobs found
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3 }}>
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
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
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
              Upload Files
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh Jobs
            </Button>
            <Button
              variant="outlined"
              startIcon={<Storage />}
              onClick={() => (window.location.href = "/storage")}
            >
              Storage Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={() => (window.location.href = "/security")}
            >
              Security Settings
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Batch Job</DialogTitle>
        <DialogContent>
          <Stepper activeStep={uploadStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Select Files</StepLabel>
            </Step>
            <Step>
              <StepLabel>Configure Settings</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review & Start</StepLabel>
            </Step>
          </Stepper>

          {uploadStep === 0 && (
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  }`,
                },
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload multiple files for batch processing
              </Typography>
              <input
                id="file-upload"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </Box>
          )}

          {uploadStep === 1 && uploadedFiles.length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Selected Files ({selectedFiles.length}/{uploadedFiles.length})
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedFiles.length === uploadedFiles.length
                            }
                            indeterminate={
                              selectedFiles.length > 0 &&
                              selectedFiles.length < uploadedFiles.length
                            }
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>File Name</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadedFiles.map((file, index) => (
                        <TableRow key={index} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedFiles.includes(file)}
                              onChange={() => handleSelectFile(file)}
                            />
                          </TableCell>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
                          <TableCell>{file.type || "Unknown"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Conversion Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Target Format"
                      value={conversionSettings.targetFormat}
                      onChange={(e) =>
                        setConversionSettings({
                          ...conversionSettings,
                          targetFormat: e.target.value,
                        })
                      }
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {formatOptions.map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" gap={2}>
                      <Checkbox
                        checked={conversionSettings.preserveQuality}
                        onChange={(e) =>
                          setConversionSettings({
                            ...conversionSettings,
                            preserveQuality: e.target.checked,
                          })
                        }
                      />
                      <Typography variant="body2">Preserve Quality</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {uploadStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Batch Job
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Ready to process {selectedFiles.length} files to{" "}
                {conversionSettings.targetFormat} format.
              </Alert>
              <Box
                sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
              >
                <Typography variant="body2">
                  Total Files: {selectedFiles.length}
                </Typography>
                <Typography variant="body2">
                  Total Size:{" "}
                  {(
                    selectedFiles.reduce((acc, file) => acc + file.size, 0) /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </Typography>
                <Typography variant="body2">
                  Target Format: {conversionSettings.targetFormat}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          {uploadStep > 0 && (
            <Button onClick={() => setUploadStep(uploadStep - 1)}>Back</Button>
          )}
          {uploadStep < 2 ? (
            <Button
              variant="contained"
              onClick={() => setUploadStep(uploadStep + 1)}
              disabled={uploadStep === 1 && selectedFiles.length === 0}
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
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleStartProcessing}
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
              Start Processing
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleRetryJob(selectedJobId)}>
          <PlayArrow fontSize="small" sx={{ mr: 1 }} />
          Retry Job
        </MenuItem>
        <MenuItem
          onClick={() => (window.location.href = `/jobs/${selectedJobId}`)}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => (window.location.href = `/download/${selectedJobId}`)}
        >
          <Download fontSize="small" sx={{ mr: 1 }} />
          Download Results
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleDeleteJob(selectedJobId)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Job
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BatchProcessing;
