import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
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
  OutlinedInput,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Save,
  Download,
  Lock,
  LockOpen,
  ArrowBack,
  Description,
  Security,
  History,
  Info,
} from "@mui/icons-material";

import { STORAGE_KEYS } from "./hooks/Use_Storekey";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import { useSecurity } from "./Use_Security";

const FileViewerEditor = () => {
  const {
    user,
    isAuthenticated,
    userPlan,
    hasPermission,
    encryptData,
    decryptData,
    secureSaveFile,
    logSecurityEvent,
  } = useSecurity();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [confirmEncryptionKey, setConfirmEncryptionKey] = useState("");
  const [showEncryptionDialog, setShowEncryptionDialog] = useState(false);
  const [saveAfterEncrypt, setSaveAfterEncrypt] = useState(false); // trigger save immediately after encrypt
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const fileInputRef = useRef(null);

  // Use the custom localStorage utility for stored files
  const [storedFiles, setStoredFiles] = useState([]);

  // Load stored files from localStorage on component mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.FILES);
    const files = raw ? JSON.parse(raw) : [];
    setStoredFiles(files);
  }, []);

  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileLimit: 5,
      fileSizeLimit: 10,
      viewing: true,
      encryption: "Date of birth encryption",
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      fileLimit: 10,
      fileSizeLimit: 20,
      viewing: true,
      encryption: "Date of birth encryption",
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      fileLimit: 50,
      fileSizeLimit: 50,
      viewing: true,
      encryption: "Date of birth encryption",
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlan] || planDetails.basic;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size limits based on plan
    if (file.size > currentPlan.fileSizeLimit * 1024 * 1024) {
      alert(
        `File exceeds your plan's ${currentPlan.fileSizeLimit}MB limit. Please upgrade to process larger files.`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFile(file);
      setFileContent(e.target.result);
      setOriginalContent(e.target.result);
      setIsEditing(false);
      setIsEncrypted(false);
      // All files must be encrypted — prompt immediately on open
      setSaveAfterEncrypt(false);
      setEncryptionKey("");
      setConfirmEncryptionKey("");
      setShowEncryptionDialog(true);
      logSecurityEvent("file_opened", `Opened file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleEncryptDecrypt = () => {
    if (!fileContent) return;

    if (isEncrypted) {
      // Decrypt for viewing/editing — re-encryption required before save
      try {
        const decryptedContent = decryptData(fileContent, encryptionKey);
        setFileContent(decryptedContent);
        setIsEncrypted(false);
        setEncryptionKey("");
        setConfirmEncryptionKey("");
        logSecurityEvent("file_decrypted", "File decrypted successfully");
      } catch (error) {
        alert("Decryption failed. Please check your encryption key.");
        logSecurityEvent(
          "file_decryption_failed",
          "Failed to decrypt file",
          "error",
        );
      }
    } else {
      // Re-encrypt after viewing/editing
      setSaveAfterEncrypt(false);
      setEncryptionKey("");
      setConfirmEncryptionKey("");
      setShowEncryptionDialog(true);
    }
  };

  const handleEncrypt = () => {
    if (!encryptionKey) {
      alert("Please enter an encryption key");
      return;
    }
    if (encryptionKey !== confirmEncryptionKey) {
      alert("Encryption keys do not match. Please re-enter.");
      return;
    }

    try {
      const encryptedContent = encryptData(fileContent, encryptionKey);
      setFileContent(encryptedContent);
      setIsEncrypted(true);
      setShowEncryptionDialog(false);
      logSecurityEvent("file_encrypted", "File encrypted successfully");

      // If encryption was triggered by Save, proceed to save now
      if (saveAfterEncrypt) {
        setSaveAfterEncrypt(false);
        setTimeout(() => executeSave(encryptedContent, true, encryptionKey), 0);
      }
    } catch (error) {
      alert("Encryption failed. Please try again.");
      setSaveAfterEncrypt(false);
      logSecurityEvent(
        "file_encryption_failed",
        "Failed to encrypt file",
        "error",
      );
    }
  };

  // executeSave does the actual localStorage write.
  // contentOverride / encryptedOverride let handleEncrypt pass the just-encrypted
  // values before React state has flushed.
  const executeSave = (contentOverride = null, encryptedOverride = null, keyOverride = null) => {
    if (!selectedFile) return;
    setSaveStatus("saving");

    const contentToSave   = contentOverride  !== null ? contentOverride  : fileContent;
    const encryptedToSave = encryptedOverride !== null ? encryptedOverride : isEncrypted;
    const keyToUse        = keyOverride       !== null ? keyOverride       : encryptionKey;

    setTimeout(() => {
      try {
        const fileData = {
          id: Date.now(),
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          content: contentToSave,
          isEncrypted: encryptedToSave,
          lastModified: new Date().toISOString(),
        };

        const saveSuccess = secureSaveFile(fileData, keyToUse);

        if (saveSuccess) {
          const updatedFiles = [...storedFiles, fileData];
          setStoredFiles(updatedFiles);
          localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updatedFiles));
          setSaveStatus("saved");
          logSecurityEvent("file_saved", `Saved file: ${selectedFile.name}`);
        } else {
          setSaveStatus("error");
          logSecurityEvent("file_save_error", "Failed to save file", "error");
        }
      } catch (error) {
        console.error("Error saving file:", error);
        setSaveStatus("error");
        logSecurityEvent("file_save_error", `Error: ${error.message}`, "error");
      }
    }, 1500);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    if (!isEncrypted) {
      // File must be encrypted before saving — show dialog, then auto-save
      setSaveAfterEncrypt(true);
      setEncryptionKey("");
      setConfirmEncryptionKey("");
      setShowEncryptionDialog(true);
      return;
    }

    executeSave();
  };

  const handleLoadFile = (file) => {
    setSelectedFile(file);
    setFileContent(file.content);
    setOriginalContent(file.content);
    setIsEncrypted(file.isEncrypted || false);
    setIsEditing(false);

    logSecurityEvent("file_loaded", `Loaded stored file: ${file.name}`);
  };

  const handleEditToggle = () => {
    if (isEncrypted) {
      alert("Please decrypt the file before editing");
      return;
    }
    setIsEditing(!isEditing);
    logSecurityEvent(
      "edit_mode_toggled",
      isEditing ? "Exited edit mode" : "Entered edit mode",
    );
  };

  const handleContentChange = (e) => {
    setFileContent(e.target.value);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileContent("");
    setOriginalContent("");
    setIsEditing(false);
    setIsEncrypted(false);
    setEncryptionKey("");
    setConfirmEncryptionKey("");
    setSaveStatus("idle");
    setSaveAfterEncrypt(false);
  };

  const handleDownload = () => {
    if (!selectedFile || !fileContent) return;
    if (!isEncrypted) {
      alert("Please encrypt the file before downloading.");
      return;
    }
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
    logSecurityEvent(
      "file_downloaded",
      `Downloaded file: ${selectedFile.name}`,
    );
  };

  const handleReloadFiles = () => {
    const raw = localStorage.getItem(STORAGE_KEYS.FILES);
    const files = raw ? JSON.parse(raw) : [];
    setStoredFiles(files);
  };

  const EncryptionDialog = () => (
    <Dialog
      open={showEncryptionDialog}
      onClose={() => { setShowEncryptionDialog(false); setSaveAfterEncrypt(false); }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Lock sx={{ mr: 1, color: currentPlan.color }} />
          {saveAfterEncrypt ? "Encrypt File to Save" : "Encrypt File"}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {saveAfterEncrypt
            ? "All files must be encrypted before saving. Enter an encryption key — you'll need this exact key to decrypt the file later."
            : "Enter an encryption key to encrypt this file. You'll need this exact key to decrypt it later."}
        </Typography>

        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel htmlFor="encryption-key">Encryption Key</InputLabel>
          <OutlinedInput
            id="encryption-key"
            type="password"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            label="Encryption Key"
            autoComplete="new-password"
          />
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="encryption-key-confirm">Confirm Encryption Key</InputLabel>
          <OutlinedInput
            id="encryption-key-confirm"
            type="password"
            value={confirmEncryptionKey}
            onChange={(e) => setConfirmEncryptionKey(e.target.value)}
            label="Confirm Encryption Key"
            autoComplete="new-password"
            error={confirmEncryptionKey.length > 0 && encryptionKey !== confirmEncryptionKey}
          />
        </FormControl>

        {confirmEncryptionKey.length > 0 && encryptionKey !== confirmEncryptionKey && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
            Keys do not match
          </Typography>
        )}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Store your key somewhere safe. Without it, you won't be able to decrypt this file. We do not store your encryption keys.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setShowEncryptionDialog(false); setSaveAfterEncrypt(false); setEncryptionKey(""); setConfirmEncryptionKey(""); }}>
          Cancel
        </Button>
        <Button
          onClick={handleEncrypt}
          variant="contained"
          disabled={!encryptionKey || encryptionKey !== confirmEncryptionKey}
          sx={{ backgroundColor: currentPlan.color }}
        >
          Encrypt
        </Button>
      </DialogActions>
    </Dialog>
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
            // background: `linear-gradient(135deg, ${currentPlan.color}20 0%, ${currentPlan.color}10 100%)`,
            backgroundColor:
              currentPlan.name === "Begin Plan"
                ? "rgba(117, 117, 117, 0.3)"
                : currentPlan.name === "Standard Plan"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)",
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
                File Viewer & Editor
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View, edit, and encrypt engineering files with secure storage
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
            </Box>
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={handleReloadFiles}
            >
              Reload Files
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* File Selection & Storage */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                {selectedFile ? "File Operations" : "Select File"}
              </Typography>

              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    accept=".dwg,.dxf,.dgn,.step,.iges,.stl,.obj,.pdf,.svg,.png,.jpg,.dwf,.dwfx,.rvt,.txt,.xml"
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Description />}
                    onClick={() => fileInputRef.current.click()}
                    sx={{ mb: 2, py: 2 }}
                  >
                    Open File
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Maximum file size: {currentPlan.fileSizeLimit}MB
                  </Typography>
                </>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current File: {selectedFile.name}
                    </Typography>
                    <Chip
                      label={isEncrypted ? "Encrypted" : "Not Encrypted"}
                      color={isEncrypted ? "success" : "default"}
                      size="small"
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={isEditing ? <Visibility /> : <Edit />}
                      onClick={handleEditToggle}
                      disabled={isEncrypted}
                    >
                      {isEditing ? "Preview Mode" : "Edit Mode"}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={isEncrypted ? <LockOpen /> : <Lock />}
                      onClick={handleEncryptDecrypt}
                    >
                      {isEncrypted ? "Decrypt File" : "Encrypt File"}
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={!fileContent}
                      sx={{ backgroundColor: currentPlan.color }}
                    >
                      Save File
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownload}
                      disabled={!fileContent}
                    >
                      Download File
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={handleReset}
                    >
                      Open Different File
                    </Button>
                  </Box>

                  {saveStatus === "saving" && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="caption">Saving file...</Typography>
                    </Box>
                  )}

                  {saveStatus === "saved" && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      File saved successfully!
                    </Alert>
                  )}

                  {saveStatus === "error" && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Error saving file. Please try again.
                    </Alert>
                  )}
                </>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: currentPlan.color }}
              >
                Stored Files
              </Typography>

              {storedFiles.length > 0 ? (
                <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
                  {storedFiles.map((file, index) => (
                    <ListItem
                      key={file.id}
                      button
                      onClick={() => handleLoadFile(file)}
                      selected={selectedFile && selectedFile.name === file.name}
                    >
                      <ListItemIcon>
                        <Description sx={{ color: currentPlan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                            <Typography variant="caption" display="block">
                              {new Date(file.lastModified).toLocaleDateString()}
                            </Typography>
                            {file.isEncrypted && (
                              <Chip
                                label="Encrypted"
                                size="small"
                                color="success"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No files stored yet. Open and save files to see them here.
                </Typography>
              )}
            </Card>
          </Grid>

          {/* File Content Viewer/Editor */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" sx={{ color: currentPlan.color }}>
                  {selectedFile ? selectedFile.name : "File Content"}
                </Typography>
                {selectedFile && (
                  <Chip
                    label={isEditing ? "Editing" : "Viewing"}
                    color={isEditing ? "primary" : "default"}
                  />
                )}
              </Box>

              {!selectedFile ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: 400, textAlign: "center" }}
                >
                  <Description sx={{ fontSize: 64, color: "#e0e0e0", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No file selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a file to view or edit its content
                  </Typography>
                </Box>
              ) : isEncrypted ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: 400, textAlign: "center" }}
                >
                  <Lock
                    sx={{ fontSize: 64, color: currentPlan.color, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    File is Encrypted
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    This file is encrypted for security. Click the decrypt
                    button to view its content.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<LockOpen />}
                    onClick={handleEncryptDecrypt}
                    sx={{ backgroundColor: currentPlan.color }}
                  >
                    Decrypt File
                  </Button>
                </Box>
              ) : isEditing ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={15}
                  maxRows={20}
                  value={fileContent}
                  onChange={handleContentChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: 500,
                    overflow: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#fafafa",
                  }}
                >
                  {fileContent.split("\n").map((line, i) => (
                    <Box key={i} display="flex" sx={{ lineHeight: 1.6 }}>
                      <Box
                        component="span"
                        sx={{
                          minWidth: 40,
                          color: "#aaa",
                          userSelect: "none",
                          textAlign: "right",
                          pr: 2,
                          borderRight: "1px solid #e0e0e0",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Box
                        component="span"
                        sx={{ flex: 1, wordBreak: "break-all" }}
                      >
                        {line || "\u00a0"}
                      </Box>
                    </Box>
                  ))}
                </Paper>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Encryption Information */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            <Security sx={{ mr: 1, verticalAlign: "bottom" }} />
            Encryption Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Your {currentPlan.name} includes{" "}
            {currentPlan.encryption.toLowerCase()}. Files are encrypted using a
            key of your choice.
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Important:</strong> Remember your encryption key.
              Without it, you won't be able to decrypt your files. We
              don't store your encryption keys on our servers.
            </Typography>
          </Alert>
        </Paper>

        <EncryptionDialog />
      </Container>
    </div>
  );
};

export default FileViewerEditor;