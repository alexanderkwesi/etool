// File: src/components/FileManager/Use_FileManager.js
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Storage,
  Description,
  Edit,
  Delete,
  Visibility,
  Upload,
  Folder,
  InsertDriveFile,
  CloudUpload,
  CloudDownload,
  Security,
  Download,
  Compare,
  SwapHoriz,
} from "@mui/icons-material";
import { useConvertLocalStorage } from "./hooks/Use_ConvertLocalStorage";
import { STORAGE_KEYS } from "./hooks/Use_Storekey";
import fileStorage from "./utils/Use_fileStorage";
import "./Use_FileManager.css";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 1024,
    percentage: 0,
  });
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Use the conversion localStorage hook for file management
  const {
    conversions: storedFiles,
    addConversion,
    removeConversion,
    updateConversionStatus,
  } = useConvertLocalStorage(STORAGE_KEYS.FILES);

  // Load user plan data from localStorage
  useEffect(() => {
    const loadUserPlan = () => {
      try {
        const planData = localStorage.getItem("User_Plan_Data");
        if (planData) {
          const parsedPlan = JSON.parse(planData);
          setUserPlanData(parsedPlan);

          // Update storage limits based on plan
          const storageLimit =
            parsedPlan.planId === "standard"
              ? 2.5 * 1024 * 1024 // 2.5GB in bytes
              : parsedPlan.planId === "premium"
              ? 5 * 1024 * 1024 // 5GB in bytes
              : 1 * 1024 * 1024; // 1GB in bytes for basic

          setStorageStats((prev) => ({
            ...prev,
            total: storageLimit,
          }));
        }
      } catch (error) {
        console.error("Error loading user plan:", error);
        showSnackbar("Error loading your plan information", "error");
      }
    };

    loadUserPlan();
  }, []);

  // Initialize files from localStorage
  useEffect(() => {
    if (storedFiles && storedFiles.length > 0) {
      setFiles(storedFiles);
    } else {
      // Initialize with sample files if none exist
      const initialFiles = [
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: "Use_App.js",
          content: "// React application code",
          type: "js",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          size: 1024,
          status: "completed",
          synced: false,
        },
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: "Use_FeaturesPlan.js",
          content: "// Features and pricing plan code",
          type: "js",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          size: 2048,
          status: "completed",
          synced: false,
        },
        {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: "Use_Security.js",
          content: "// Security implementation code",
          type: "js",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          size: 3072,
          status: "completed",
          synced: false,
        },
      ];

      // Add each file to localStorage
      initialFiles.forEach((file) => {
        addConversion(file, file.content, "file");
      });

      setFiles(initialFiles);
    }

    // Calculate storage stats
    updateStorageStats();
  }, [storedFiles, addConversion]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const updateStorageStats = () => {
    const used = files.reduce((total, file) => total + (file.size || 0), 0);
    const total = storageStats.total;
    const percentage = Math.min(100, (used / total) * 100);

    setStorageStats({
      used,
      total,
      percentage,
    });
  };

  const handleEdit = (file) => {
    setEditingFile(file);
    setNewFileName(file.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingFile || !newFileName.trim()) return;

    const updatedFiles = files.map((file) => {
      if (file.id === editingFile.id) {
        const updatedFile = {
          ...file,
          name: newFileName.replace(/[^a-zA-Z0-9._-]/g, "_"),
          updatedAt: new Date().toISOString(),
          synced: false, // Mark as unsynced after edit
        };

        // Update the file in localStorage
        updateConversionStatus(editingFile.id, "updated", updatedFile);

        return updatedFile;
      }
      return file;
    });

    setFiles(updatedFiles);
    setIsEditModalOpen(false);
    setEditingFile(null);
    setNewFileName("");

    // Update storage stats
    updateStorageStats();

    showSnackbar("File renamed successfully", "success");
  };

  const handleDelete = (fileId) => {
    const fileToDelete = files.find((file) => file.id === fileId);
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);
    removeConversion(fileId);

    // Update storage stats
    updateStorageStats();

    showSnackbar(`"${fileToDelete.name}" deleted successfully`, "success");
  };

  const handleView = (file) => {
    // Update last accessed time
    const updatedFile = {
      ...file,
      lastAccessed: new Date().toISOString(),
    };

    updateConversionStatus(file.id, "accessed", updatedFile);

    // In a real application, this would open a file viewer
    console.log("Viewing file:", file.name);
    alert(
      `Viewing file: ${file.name}\n\nContent preview:\n${file.content.substring(
        0,
        100
      )}...`
    );
  };

  // Check if user can upload based on their plan
  const canUploadFile = (fileSize) => {
    const usedStorage = files.reduce(
      (total, file) => total + (file.size || 0),
      0
    );
    const maxStorage =
      userPlanData.planId === "standard"
        ? 2.5 * 1024 * 1024
        : userPlanData.planId === "premium"
        ? 5 * 1024 * 1024
        : 1 * 1024 * 1024;

    const maxFileSize =
      userPlanData.planId === "standard"
        ? 20 * 1024 * 1024
        : userPlanData.planId === "premium"
        ? 50 * 1024 * 1024
        : 10 * 1024 * 1024;

    return usedStorage + fileSize <= maxStorage && fileSize <= maxFileSize;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check plan limitations
    if (!canUploadFile(file.size)) {
      showSnackbar("File exceeds your plan's storage or size limits", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      // Add file to localStorage using the conversion hook
      addConversion(file, content, "file");

      // Update local state
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        content: content,
        type: file.name.split(".").pop(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        size: file.size,
        status: "completed",
        synced: false,
      };

      setFiles((prev) => [...prev, newFile]);

      // Update storage stats
      updateStorageStats();

      showSnackbar(`"${file.name}" uploaded successfully`, "success");
    };
    reader.readAsText(file);
  };

  // Simulate saving files to database
  const saveToDatabase = async (file) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update file as synced
      const updatedFile = { ...file, synced: true };
      updateConversionStatus(file.id, "synced", updatedFile);

      setFiles((prev) => prev.map((f) => (f.id === file.id ? updatedFile : f)));
      return true;
    } catch (error) {
      console.error("Error saving to database:", error);
      return false;
    }
  };

  // Simulate loading files from database
  const loadFromDatabase = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // This would be actual database data in a real application
      const dbFiles = files.filter((file) => file.synced);
      showSnackbar("Files loaded from database", "success");
      return dbFiles;
    } catch (error) {
      console.error("Error loading from database:", error);
      showSnackbar("Error loading files from database", "error");
      return [];
    }
  };

  // Sync all files to database
  const syncAllToDatabase = async () => {
    const unsyncedFiles = files.filter((file) => !file.synced);
    if (unsyncedFiles.length === 0) {
      showSnackbar("All files are already synced", "info");
      return;
    }

    showSnackbar(
      `Syncing ${unsyncedFiles.length} files to database...`,
      "info"
    );

    for (const file of unsyncedFiles) {
      const success = await saveToDatabase(file);
      if (!success) {
        showSnackbar(`Failed to sync "${file.name}"`, "error");
        break;
      }
    }

    showSnackbar("All files synced successfully", "success");
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "js":
        return <InsertDriveFile sx={{ color: "#f5de19" }} />;
      case "css":
        return <InsertDriveFile sx={{ color: "#264de4" }} />;
      case "html":
        return <InsertDriveFile sx={{ color: "#e34f26" }} />;
      default:
        return <InsertDriveFile />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const UsageMeter = ({ label, used, total, unit = "MB" }) => (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {formatFileSize(used)}/{formatFileSize(total)} {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(used / total) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: userPlanData.planId === "basic"
              ? "#757575"
              : userPlanData.planId === "standard"
              ? "#2196f3"
              : "#ff6f00",
          },
        }}
      />
    </Box>
  );

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
              backgroundColor: userPlanData.planId === "basic"
                ? "#757575"
                : userPlanData.planId === "standard"
                ? "#2196f3"
                : "#ff6f00",
              color: "white",
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="file-manager">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor:
              userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)",

            width: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ width: "97%" }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                File Storage Manager
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
                  backgroundColor:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
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
                variant="outlined"
                sx={{
                  borderColor:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Usage Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description
                sx={{
                  fontSize: 40,
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Files
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              >
                {files.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {files.filter((f) => !f.synced).length} unsynced
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Storage
                sx={{
                  fontSize: 40,
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Storage Used
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              >
                {formatFileSize(storageStats.used)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {formatFileSize(storageStats.total)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SwapHoriz
                sx={{
                  fontSize: 40,
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                File Operations
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              >
                {files.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* File Operations */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
              }}
            >
              File Management
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Visibility
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="File Viewing"
                  description="View file contents and details in your storage"
                  available={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Edit
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="File Editing"
                  description="Rename and manage your stored files"
                  available={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Download
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="File Download"
                  description="Download files from your local storage"
                  available={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Upload
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="File Upload"
                  description="Upload new files to your storage"
                  available={true}
                  limit={
                    userPlanData.planId === "basic"
                      ? "10MB max"
                      : userPlanData.planId === "standard"
                        ? "20MB max"
                        : "50MB max"
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Storage & Sync Features */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
              }}
            >
              Storage & Sync
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Storage
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="Local Storage"
                  description="All files are stored locally in your browser"
                  available={true}
                  limit={
                    userPlanData.planId === "basic"
                      ? "1GB total"
                      : userPlanData.planId === "standard"
                        ? "2.5GB total"
                        : "5GB total"
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <CloudUpload
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="Cloud Sync"
                  description="Sync files to cloud database for backup"
                  available={userPlanData.planId !== "basic"}
                  limit={
                    userPlanData.planId === "standard" ? "Standard" : "Premium"
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <CloudDownload
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="Cloud Restore"
                  description="Restore files from cloud database"
                  available={userPlanData.planId !== "basic"}
                  limit={
                    userPlanData.planId === "standard" ? "Standard" : "Premium"
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FeatureCard
                  icon={
                    <Security
                      sx={{
                        color:
                          userPlanData.planId === "basic"
                            ? "#757575"
                            : userPlanData.planId === "standard"
                              ? "#2196f3"
                              : "#ff6f00",
                      }}
                    />
                  }
                  title="File Security"
                  description="Secure encryption for your stored files"
                  available={true}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Storage Usage Details */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color:
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00",
            }}
          >
            Storage Usage Details
          </Typography>
          <UsageMeter
            label="Total Storage"
            used={storageStats.used}
            total={storageStats.total}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your storage allocation is based on your current plan. Upgrade for
            more space.
          </Typography>
        </Paper>

        {/* Files List */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mt: 4,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h6"
              sx={{
                color:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
              }}
            >
              Your Files
            </Typography>
            <Chip
              label={`${files.filter((f) => f.synced).length}/${
                files.length
              } synced`}
              color={
                files.filter((f) => f.synced).length === files.length
                  ? "success"
                  : "warning"
              }
              variant="outlined"
            />
          </Box>

          {files.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                
              }}
            >
              <Folder sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No files found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload some files to get started
              </Typography>
              <input
                type="file"
                id="file-upload-empty"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload-empty">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<Upload />}
                  sx={{
                    backgroundColor:
                      userPlanData.planId === "basic"
                        ? "#757575"
                        : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00",
                  }}
                >
                  Upload Your First File
                </Button>
              </label>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {files.map((file) => (
                <Grid item xs={12} key={file.id}>
                  <Card
                    sx={{
                      border: file.synced
                        ? "2px solid #4caf50"
                        : "2px solid #ff9800",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" flexGrow={1}>
                          {getFileIcon(file.type)}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="h6">{file.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(file.size || 0)} •{" "}
                              {formatDate(file.updatedAt)}
                              {file.synced && " • Synced"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleView(file)}
                            title="View file"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(file)}
                            title="Rename file"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => !file.synced && saveToDatabase(file)}
                            title={
                              file.synced
                                ? "Already synced"
                                : "Sync to database"
                            }
                            disabled={
                              file.synced || userPlanData.planId === "basic"
                            }
                            color={file.synced ? "success" : "primary"}
                          >
                            <CloudUpload />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(file.id)}
                            title="Delete file"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color:
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00",
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <input
              type="file"
              id="file-upload-action"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload-action">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                sx={{
                  backgroundColor:
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00",
                }}
              >
                Upload File
              </Button>
            </label>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={syncAllToDatabase}
              disabled={userPlanData.planId === "basic"}
              sx={{
                borderColor:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
                color:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
              }}
            >
              Sync All to DB
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={loadFromDatabase}
              disabled={userPlanData.planId === "basic"}
              sx={{
                borderColor:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
                color:
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00",
              }}
            >
              Load from DB
            </Button>
          </Box>
          {userPlanData.planId === "basic" && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Standard or Premium for cloud sync features.
            </Typography>
          )}
        </Paper>

        {/* Edit File Dialog */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="File Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default FileManager;