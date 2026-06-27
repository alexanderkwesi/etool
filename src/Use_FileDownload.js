import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Download,
  Delete,
  Info,
  CloudDownload,
  Storage,
  Description,
  CheckCircle,
} from "@mui/icons-material";

import { STORAGE_KEYS } from "./hooks/Use_Storekey";
import { useLocalStorage, useLocalStorageNew } from "./hooks/Use_LocalStorage";
import { useConvertLocalStorage } from "./hooks/Use_ConvertLocalStorage";

const DownloadInfoDialog = ({ open, onClose, currentPlan }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Box display="flex" alignItems="center">
        <Info sx={{ mr: 1, color: currentPlan.color }} />
        Download Information
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1" gutterBottom>
        Your {currentPlan.name} includes file download functionality with the
        following limits:
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="File Size Limit"
            secondary={`Up to ${currentPlan.fileSizeLimit}MB per file`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Storage Files"
            secondary="Files saved to your browser's local storage"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Database Files"
            secondary="Files stored securely on our servers"
          />
        </ListItem>
      </List>
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Note: Local storage files are specific to this browser and device.
          Database files are accessible from any device when you're logged in.
        </Typography>
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const FileDownload = () => {
  // Use localStorage for user plan data
  const [userPlanData, setUserPlanData] = useLocalStorageNew("User_Plan_Data", {
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  // Use the conversion localStorage hook for download history
  const {
    conversions: downloadHistory,
    addConversion: addDownloadRecord,
    removeConversion: removeDownloadRecord,
    getRecentConversions: getRecentDownloads,
    updateConversionStatus: updateDownloadStatus,
  } = useConvertLocalStorage(STORAGE_KEYS.DOWNLOAD_HISTORY, []);

  const [databaseFiles, setDatabaseFiles] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle, downloading, completed, error
  const [selectedSource, setSelectedSource] = useState("local");
  const [showDownloadInfo, setShowDownloadInfo] = useState(false);

  // Use the custom localStorage hook for stored files
  const [storedFiles, setStoredFiles] = useLocalStorageNew(
    STORAGE_KEYS.FILES,
    []
  );

  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileLimit: 5,
      fileSizeLimit: 10,
      download: true,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      fileLimit: 10,
      fileSizeLimit: 20,
      download: true,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      fileLimit: 50,
      fileSizeLimit: 50,
      download: true,
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  // Check if user has download permission based on plan
  const canDownload = currentPlan.download;

  // Simulate loading files from database
  useEffect(() => {
    loadDatabaseFiles();
    loadStoredFiles();
  }, []);

  const loadDatabaseFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files/db-list", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setDatabaseFiles(data.files || []);
    } catch (err) {
      console.error("Failed to load database files:", err);
      setDatabaseFiles([]);
    }
  };

  const loadStoredFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files/stored", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        // Merge server files with any local-only files not yet synced
        setStoredFiles((prev) => {
          const serverIds = new Set(data.files.map((f) => String(f.id)));
          const localOnly = prev.filter((f) => !serverIds.has(String(f.id)));
          return [...data.files, ...localOnly];
        });
      }
    } catch (err) {
      console.error("Failed to load stored files from server:", err);
      // Fall back to whatever is already in localStorage via useLocalStorageNew
    }
  };

  const handleDownload = (file, source) => {
    // Note: database downloads are async internally
    if (!canDownload) {
      alert(
        "File download is not available on your current plan. Please upgrade to access this feature."
      );
      return;
    }

    if (file.isEncrypted) {
      alert("This file is encrypted. Please decrypt it in the File Viewer before downloading.");
      return;
    }

    setDownloadStatus("downloading");

    setTimeout(() => {
      try {
        if (source === "local") {
          downloadLocalFile(file);
        } else {
          downloadDatabaseFile(file);
        }

        setDownloadStatus("completed");

        // Store record with shape the history UI expects (originalFile field)
        addDownloadRecord(
          { name: file.name, size: file.size },
          { name: file.name },
          "download"
        );

        setTimeout(() => setDownloadStatus("idle"), 2000);
      } catch (error) {
        setDownloadStatus("error");
        console.error("Download error:", error);
        setTimeout(() => setDownloadStatus("idle"), 2000);
      }
    }, 1500);
  };

  const downloadLocalFile = (file) => {
    try {
      // Create a blob from the file content
      const blob = new Blob([file.content || "Simulated file content"], {
        type: file.type || "application/octet-stream",
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading local file:", error);
      throw error;
    }
  };

  const downloadDatabaseFile = async (file) => {
    if (!file.download_url) {
      throw new Error("No download URL available for this file.");
    }
    // Stream directly from the server — the endpoint sends the file as an attachment
    const fullUrl = file.download_url.startsWith("http")
      ? file.download_url
      : `http://localhost:5000${file.download_url}`;

    const res = await fetch(fullUrl, { credentials: "include" });
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleDeleteLocalFile = async (fileId) => {
    const updatedFiles = storedFiles.filter((file) => file.id !== fileId);
    setStoredFiles(updatedFiles);
    // Also remove from server if it was synced there
    try {
      await fetch(`http://localhost:5000/api/files/stored/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Could not delete file from server:", err);
    }
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
           // background: `linear-gradient(135deg, ${currentPlan.color}20 0%, ${currentPlan.color}10 100%)`,
           backgroundColor:`${
              userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)" // #757575 in RGB with 0.5 opacity
                : userPlanData.planId === "standard"
                ? "rgba(33, 150, 243, 0.3)" // #2196f3 in RGB with 0.5 opacity
                : "rgba(255, 111, 0, 0.3)" // #ff6f00 in RGB with 0.5 opacity
            }`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                File Download
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Download your files from local storage or database
              </Typography>
              <Chip
                label={`${userPlanData.planName}`}
                sx={{
                  mt: 1,
                  backgroundColor: currentPlan.color,
                  color: "white",
                }}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={() => setShowDownloadInfo(true)}
            >
              Download Info
            </Button>
          </Box>
        </Paper>

        {/* Source Selection */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            Select File Source
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>File Source</InputLabel>
            <Select
              value={selectedSource}
              label="File Source"
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <MenuItem value="local">
                <Storage sx={{ mr: 1 }} />
                Local Storage Files
              </MenuItem>
              <MenuItem value="database">
                <CloudDownload sx={{ mr: 1 }} />
                Database Files
              </MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {selectedSource === "local"
              ? "Files stored in your browser's local storage (device-specific)"
              : "Files stored on our servers (accessible from any device)"}
          </Typography>
        </Paper>

        {/* File List */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Available Files -{" "}
                {selectedSource === "local" ? "Local Storage" : "Database"}
              </Typography>

              {downloadStatus === "downloading" && (
                <Box sx={{ textAlign: "center", my: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Preparing download...
                  </Typography>
                  <LinearProgress sx={{ my: 2 }} />
                </Box>
              )}

              {downloadStatus === "completed" && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Download completed successfully!
                </Alert>
              )}

              {downloadStatus === "error" && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Download failed. Please try again.
                </Alert>
              )}

              {(selectedSource === "local" ? storedFiles : databaseFiles)
                .length > 0 ? (
                <List>
                  {(selectedSource === "local"
                    ? storedFiles
                    : databaseFiles
                  ).map((file, index) => (
                    <React.Fragment key={file.id || index}>
                      <ListItem
                        secondaryAction={
                          selectedSource === "local" ? (
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteLocalFile(file.id)}
                            >
                              <Delete />
                            </IconButton>
                          ) : null
                        }
                      >
                        <ListItemIcon>
                          <Description sx={{ color: currentPlan.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                              {file.lastModified && (
                                <Typography variant="caption" display="block">
                                  Modified:{" "}
                                  {new Date(
                                    file.lastModified
                                  ).toLocaleDateString()}
                                </Typography>
                              )}
                              {file.uploadDate && (
                                <Typography variant="caption" display="block">
                                  Uploaded:{" "}
                                  {new Date(
                                    file.uploadDate
                                  ).toLocaleDateString()}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={() => handleDownload(file, selectedSource)}
                          disabled={!canDownload}
                          sx={{
                            ml: 2,
                            backgroundColor: currentPlan.color,
                            "&:hover": {
                              backgroundColor: currentPlan.color,
                              opacity: 0.9,
                            },
                          }}
                        >
                          Download
                        </Button>
                      </ListItem>
                      {index <
                        (selectedSource === "local"
                          ? storedFiles
                          : databaseFiles
                        ).length -
                          1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    {selectedSource === "local"
                      ? "No files found in your local storage. Save files after conversion or editing to see them here."
                      : "No files found in your database storage. Upload files to see them here."}
                  </Typography>
                </Alert>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Download History */}
        {downloadHistory.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircle sx={{ mr: 1, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ color: currentPlan.color }}>
                Recent Downloads ({downloadHistory.length})
              </Typography>
            </Box>

            <List>
              {downloadHistory.slice(0, 5).map((download) => (
                <ListItem key={download.id} divider>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Downloaded ${download?.originalFile?.name ?? download?.convertedFile?.name ?? "file"}`}
                    secondary={new Date(download.timestamp).toLocaleString()}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      // Option to view details of this download
                      console.log("View download details:", download);
                    }}
                  >
                    Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Plan Limitations Notice */}
        {!canDownload && (
          <Alert severity="warning" sx={{ mt: 4 }}>
            <Typography variant="body2">
              File download is not available on your current plan. Upgrade to
              access this feature.
            </Typography>
          </Alert>
        )}

        <DownloadInfoDialog open={showDownloadInfo} onClose={() => setShowDownloadInfo(false)} currentPlan={currentPlan} />
      </Container>
    </div>
  );
};

export default FileDownload;