import React, { useState, useRef, useEffect } from "react";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button, Paper,
  Alert, LinearProgress, Chip, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
} from "@mui/material";
import {
  CloudUpload, SwapHoriz, Download, Delete, Info,
  CheckCircle, History, Description, ErrorOutline,
} from "@mui/icons-material";

import { STORAGE_KEYS } from "./hooks/Use_Storekey";
import { useConvertLocalStorage } from "./hooks/Use_ConvertLocalStorage";
// FIX: Import the correct localStorage hook
import { useLocalStorageNew, localStorageUtils } from "./hooks/Use_LocalStorage";
import "./Use_App.css";
import Modal from "./Use_FileConversionDetailsModal";

const API = "http://127.0.0.1:5000/api";

// ─── plan config (mirrors server PLAN_FILE_LIMITS) ────────────────────────────
const planDetails = {
  basic:    { name: "Begin Plan",    fileLimit: 5,  fileSizeLimit: 10, storage: 1024,  color: "#757575" },
  standard: { name: "Standard Plan", fileLimit: 10, fileSizeLimit: 20, storage: 2560,  color: "#2196f3" },
  premium:  { name: "Premium Plan",  fileLimit: 50, fileSizeLimit: 50, storage: 5120,  color: "#ff6f00" },
};

// ─── supported format list (mirrors server /api/files/formats) ────────────────
const supportedFormats = {
  cad:         [
    { value: "dwg",  label: "DWG (AutoCAD)",               icon: "📐" },
    { value: "dxf",  label: "DXF (Drawing Exchange Format)", icon: "📊" },
    { value: "dgn",  label: "DGN (MicroStation)",           icon: "🏗️" },
  ],
  "3d":        [
    { value: "step", label: "STEP (3D Model)",  icon: "🔧" },
    { value: "iges", label: "IGES (3D Model)",  icon: "📦" },
    { value: "stl",  label: "STL (3D Printing)", icon: "🖨️" },
    { value: "obj",  label: "OBJ (3D Model)",   icon: "🎯" },
  ],
  "2d":        [
    { value: "pdf",  label: "PDF (Portable Document)", icon: "📄" },
    { value: "svg",  label: "SVG (Scalable Vector)",   icon: "🖼️" },
    { value: "png",  label: "PNG (Raster Image)",      icon: "🖼️" },
    { value: "jpg",  label: "JPG (Raster Image)",      icon: "🖼️" },
  ],
  proprietary: [
    { value: "dwf",  label: "DWF (Design Web Format)",   icon: "🌐" },
    { value: "dwfx", label: "DWFX (Design Web Format X)", icon: "🌐" },
    { value: "rvt",  label: "RVT (Revit)",               icon: "🏢" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
const FileConversion = () => {
  // Plan data from localStorage (set during login by Use_Dashboard)
  // FIX: use localStorageUtils for reading initial data
  const [userPlanData, setUserPlanData] = useLocalStorageNew("User_Plan_Data", {
    planId: "basic", planName: "Begin Plan",
    monthlyPrice: 0, annualPrice: 0, billingCycle: "monthly",
  });

  // Conversion history hook (localStorage)
  const {
    conversions, addConversion, updateConversionStatus,
  } = useConvertLocalStorage(STORAGE_KEYS.CONVERSION_HISTORY, []);

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  // ── state ──────────────────────────────────────────────────────────────────
  const [selectedFiles,    setSelectedFiles]    = useState([]);   // File objects
  const [uploadedMeta,     setUploadedMeta]     = useState([]);   // server upload metadata
  const [targetFormat,     setTargetFormat]     = useState("");
  const [conversionStatus, setConversionStatus] = useState("idle"); // idle|uploading|converting|completed|error
  const [convertedFiles,   setConvertedFiles]   = useState([]);   // server conversion records
  const [serverDocs,       setServerDocs]       = useState([]);   // /api/files/documents
  const [showFormatInfo,   setShowFormatInfo]   = useState(false);
  const [modal,            setModal]            = useState(null);
  const [selectedConversion, setSelectedConversion] = useState(null);
  const [snack,            setSnack]            = useState({ open: false, msg: "", severity: "info" });
  const [error,            setError]            = useState("");

  const fileInputRef = useRef(null);

  const toast  = (msg, severity = "success") => setSnack({ open: true, msg, severity });
  const openModal  = (type, data) => { setSelectedConversion(data); setModal(type); };
  const closeModal = () => { setModal(null); setSelectedConversion(null); };

  // ── fetch server document history on mount ─────────────────────────────────
  useEffect(() => {
    fetchServerDocs();
  }, []);

  const fetchServerDocs = async () => {
    try {
      // FIX: Use localStorageUtils for token
      const token = localStorageUtils.getItem("auth_token");
      const res  = await fetch(`${API}/files/documents`, { 
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.status === 200) setServerDocs(data.documents || []);
    } catch (_) { /* not critical */ }
  };

  // ── file select (client-side validation) ──────────────────────────────────
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    const oversized = files.filter(f => f.size > currentPlan.fileSizeLimit * 1024 * 1024);
    if (oversized.length > 0) {
      toast(`Some files exceed your ${currentPlan.fileSizeLimit}MB limit.`, "warning");
    }

    if (selectedFiles.length + files.length > currentPlan.fileLimit) {
      toast(`Your plan allows max ${currentPlan.fileLimit} files per conversion.`, "warning");
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    // reset input so the same file can be re-selected
    event.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedMeta(prev => prev.filter((_, i) => i !== index));
  };

  // ── Step 1: upload files to server ────────────────────────────────────────
  const uploadFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append("files[]", f));

    const token = localStorageUtils.getItem("auth_token");
    const res  = await fetch(`${API}/files/upload`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();

    if (data.status !== 200) {
      throw new Error(data.error || "Upload failed");
    }
    return data.uploaded; // [{file_id, document_id, original_name, extension, size_mb}]
  };

  // ── Step 2: convert uploaded files ────────────────────────────────────────
  const convertFiles = async (uploaded) => {
    const payload = {
      files: uploaded.map(u => ({
        file_id:       u.file_id,
        original_name: u.original_name,
        document_id:   u.document_id,
      })),
      target_format: targetFormat,
    };

    const token = localStorageUtils.getItem("auth_token");
    const res  = await fetch(`${API}/files/convert`, {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.status !== 200) {
      throw new Error(data.error || "Conversion failed");
    }
    return data.converted; // [{id, converted_id, converted_name, download_url, ...}]
  };

  // ── main convert handler ───────────────────────────────────────────────────
  const handleConvert = async () => {
    if (selectedFiles.length === 0 || !targetFormat) {
      toast("Please select files and a target format", "warning");
      return;
    }

    setError("");
    setConversionStatus("uploading");

    try {
      // 1. Upload
      const uploaded = await uploadFiles();
      setUploadedMeta(uploaded);

      // 2. Convert
      setConversionStatus("converting");
      const converted = await convertFiles(uploaded);

      // 3. Update UI
      setConvertedFiles(converted);
      setConversionStatus("completed");

      // 4. Persist to localStorage history (for useConvertLocalStorage hook)
      converted.forEach(c => {
        addConversion(
          {
            name: c.original_name,
            originalName:  c.original_name,
            convertedName: c.converted_name,
            originalFormat: c.original_format,
            targetFormat:  c.target_format,
            conversionType: c.target_format,
            size:          (c.size_mb || 0) * 1024 * 1024,
            downloadUrl:   `${API}${c.download_url}`,
            convertedAt:   c.converted_at,
          },
          "converted",
          c.target_format,
        );
      });

      // 5. Refresh server document list
      await fetchServerDocs();
      toast(`${converted.length} file(s) converted successfully!`);

    } catch (err) {
      setError(err.message);
      setConversionStatus("error");
      toast(err.message, "error");
    }
  };

  // ── download handler ───────────────────────────────────────────────────────
  const handleDownload = async (file) => {
    try {
      const url = file.downloadUrl.startsWith("http")
        ? file.downloadUrl
        : `${API}${file.download_url || ""}`;

      const token = localStorageUtils.getItem("auth_token");
      const res  = await fetch(url, { 
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Download failed");

      const blob     = await res.blob();
      const objUrl   = URL.createObjectURL(blob);
      const link     = document.createElement("a");
      link.href      = objUrl;
      link.download  = file.convertedName || file.converted_name || "converted_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objUrl);

      // Mark downloaded in localStorage history
      if (file.id) updateConversionStatus(file.id, "downloaded");

      toast("Download started");
      await fetchServerDocs();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  // ── delete server document ─────────────────────────────────────────────────
  const handleDeleteDoc = async (docId) => {
    try {
      const token = localStorageUtils.getItem("auth_token");
      const res  = await fetch(`${API}/files/documents/${docId}`, {
        method: "DELETE",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.status === 200) {
        setServerDocs(prev => prev.filter(d => d.id !== docId));
        toast("Document deleted");
      } else {
        toast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setUploadedMeta([]);
    setTargetFormat("");
    setConvertedFiles([]);
    setConversionStatus("idle");
    setError("");
  };

  // ── status helpers ─────────────────────────────────────────────────────────
  const isProcessing = conversionStatus === "uploading" || conversionStatus === "converting";

  const statusLabel = {
    uploading:  "Uploading files…",
    converting: `Converting ${selectedFiles.length} file(s)…`,
  }[conversionStatus];

  // ── FormatInfoDialog ───────────────────────────────────────────────────────
  const FormatInfoDialog = () => (
    <Dialog open={showFormatInfo} onClose={() => setShowFormatInfo(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Info sx={{ mr: 1, color: currentPlan.color }} />
          Supported File Formats
        </Box>
      </DialogTitle>
      <DialogContent>
        {[
          { label: "CAD Formats",         key: "cad" },
          { label: "3D Model Formats",    key: "3d" },
          { label: "2D & Image Formats",  key: "2d" },
          { label: "Proprietary Formats", key: "proprietary" },
        ].map(({ label, key }) => (
          <Box key={key}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, color: currentPlan.color }}>
              {label}
            </Typography>
            <List>
              {supportedFormats[key].map(f => (
                <ListItem key={f.value}>
                  <ListItemText
                    primary={`${f.icon} ${f.label}`}
                    secondary={`Convert to/from .${f.value}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowFormatInfo(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Paper elevation={2} sx={{
          p: 3, mb: 4,
          backgroundColor:
            userPlanData.planId === "basic"    ? "rgba(117,117,117,0.3)" :
            userPlanData.planId === "standard" ? "rgba(33,150,243,0.3)"  :
                                                 "rgba(255,111,0,0.3)",
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box>
              <Typography variant="h4" gutterBottom>File Conversion</Typography>
              <Typography variant="body1" color="text.secondary">
                Convert between engineering file formats with precision
              </Typography>
              <Chip
                label={userPlanData.planName}
                sx={{ mt: 1, backgroundColor: currentPlan.color, color: "white" }}
              />
            </Box>
            <Button variant="outlined" startIcon={<Info />} onClick={() => setShowFormatInfo(true)}>
              Supported Formats
            </Button>
          </Box>
        </Paper>

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* ── Conversion Interface ─────────────────────────────────────────── */}
        <Grid container spacing={4}>

          {/* File Selection */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                Select Files to Convert
              </Typography>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: "none" }}
                accept=".dwg,.dxf,.dgn,.step,.iges,.stl,.obj,.pdf,.svg,.png,.jpg,.dwf,.dwfx,.rvt"
              />

              <Button
                variant="outlined"
                fullWidth
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current.click()}
                disabled={isProcessing}
                sx={{ mb: 2, py: 2 }}
              >
                Upload Files
              </Button>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Maximum file size: {currentPlan.fileSizeLimit}MB per file
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Files remaining: {currentPlan.fileLimit - selectedFiles.length} of {currentPlan.fileLimit}
              </Typography>

              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files ({selectedFiles.length})
                  </Typography>
                  <List dense>
                    {selectedFiles.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFile(index)}
                            disabled={isProcessing}
                          >
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Description sx={{ color: currentPlan.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Conversion Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                Conversion Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Convert to Format</InputLabel>
                <Select
                  value={targetFormat}
                  label="Convert to Format"
                  onChange={e => setTargetFormat(e.target.value)}
                  disabled={isProcessing}
                >
                  <MenuItem value=""><em>Select target format</em></MenuItem>

                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: currentPlan.color }}>
                    CAD Formats
                  </Typography>
                  {supportedFormats.cad.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.icon} {f.label} (.{f.value})</MenuItem>
                  ))}

                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: currentPlan.color }}>
                    3D Model Formats
                  </Typography>
                  {supportedFormats["3d"].map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.icon} {f.label} (.{f.value})</MenuItem>
                  ))}

                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: currentPlan.color }}>
                    2D & Image Formats
                  </Typography>
                  {supportedFormats["2d"].map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.icon} {f.label} (.{f.value})</MenuItem>
                  ))}

                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: currentPlan.color }}>
                    Proprietary Formats
                  </Typography>
                  {supportedFormats.proprietary.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.icon} {f.label} (.{f.value})</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Idle — show Convert button */}
              {conversionStatus === "idle" && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<SwapHoriz />}
                  onClick={handleConvert}
                  disabled={selectedFiles.length === 0 || !targetFormat}
                  sx={{
                    py: 1.5,
                    backgroundColor: currentPlan.color,
                    "&:hover": { backgroundColor: currentPlan.color, opacity: 0.9 },
                  }}
                >
                  Convert Files
                </Button>
              )}

              {/* Uploading / Converting — progress bar */}
              {isProcessing && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body1" gutterBottom>{statusLabel}</Typography>
                  <LinearProgress sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    This may take a few moments
                  </Typography>
                </Box>
              )}

              {/* Completed */}
              {conversionStatus === "completed" && (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Conversion completed successfully!
                  </Alert>
                  <Button variant="outlined" fullWidth onClick={handleReset} sx={{ mb: 2 }}>
                    Convert More Files
                  </Button>
                </Box>
              )}

              {/* Error */}
              {conversionStatus === "error" && (
                <Box>
                  <Button variant="outlined" fullWidth onClick={handleReset}>
                    Try Again
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* ── Converted Files (current session) ───────────────────────────── */}
        {convertedFiles.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
              Converted Files
            </Typography>
            <Grid container spacing={2}>
              {convertedFiles.map((file, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" noWrap>
                          {file.converted_name || file.convertedName}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Chip
                          label={(file.original_format || file.originalFormat || "").toUpperCase()}
                          size="small" variant="outlined"
                        />
                        <SwapHoriz fontSize="small" />
                        <Chip
                          label={(file.target_format || file.targetFormat || "").toUpperCase()}
                          size="small"
                          sx={{ backgroundColor: currentPlan.color, color: "white" }}
                        />
                      </Box>

                      <Typography variant="caption" display="block" color="text.secondary">
                        {((file.size_mb || 0)).toFixed(2)} MB
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Download />}
                        onClick={() => handleDownload({
                          ...file,
                          downloadUrl:   `${API}${file.download_url}`,
                          convertedName: file.converted_name,
                        })}
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: currentPlan.color,
                          "&:hover": { backgroundColor: currentPlan.color, opacity: 0.9 },
                        }}
                      >
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* ── Conversion History (localStorage) ───────────────────────────── */}
        {conversions.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <History sx={{ mr: 1, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ color: currentPlan.color }}>
                Recent Conversions ({conversions.length})
              </Typography>
            </Box>
            <List>
              {conversions.slice(0, 5).map(conversion => (
                <ListItem key={conversion.id} divider>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
                        <Typography component="span">Converted</Typography>
                        <Chip
                          label={(conversion.originalFormat || "").toUpperCase()}
                          size="small" variant="outlined"
                        />
                        <Typography component="span">→</Typography>
                        <Chip
                          label={(conversion.conversionType || "").toUpperCase() || "UNKNOWN"}
                          size="small"
                          sx={{ backgroundColor: currentPlan.color, color: "white" }}
                        />
                      </Box>
                    }
                    secondary={`${conversion.originalName || ""} • ${new Date(conversion.timestamp).toLocaleString()}`}
                  />
                  <Button
                    size="small"
                    onClick={() => openModal("details", conversion)}
                  >
                    Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* ── Server Document History ──────────────────────────────────────── */}
        {serverDocs.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Description sx={{ mr: 1, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ color: currentPlan.color }}>
                All Documents ({serverDocs.length})
              </Typography>
            </Box>
            <List>
              {serverDocs.slice(0, 10).map(doc => (
                <ListItem
                  key={doc.id}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteDoc(doc.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {doc.action === "converted"
                      ? <CheckCircle color="success" />
                      : <Description sx={{ color: currentPlan.color }} />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {doc.document_name}
                        </Typography>
                        {doc.modified_document_type && (
                          <>
                            <SwapHoriz fontSize="small" />
                            <Chip
                              label={doc.modified_document_type.toUpperCase()}
                              size="small"
                              sx={{ backgroundColor: currentPlan.color, color: "white" }}
                            />
                          </>
                        )}
                        <Chip
                          label={doc.action}
                          size="small"
                          variant="outlined"
                          color={
                            doc.action === "converted"  ? "success" :
                            doc.action === "downloaded" ? "primary" : "default"
                          }
                        />
                      </Box>
                    }
                    secondary={
                      `${(doc.document_size || 0).toFixed(2)} MB` +
                      (doc.modified_document_size ? ` → ${doc.modified_document_size.toFixed(2)} MB` : "") +
                      ` • ${doc.date_initialised ? new Date(doc.date_initialised).toLocaleString() : ""}`
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* ── Details Modal ────────────────────────────────────────────────── */}
        {modal === "details" && (
          <Modal
            isOpen
            onClose={closeModal}
            title="Conversion Details"
          >
            {selectedConversion && (
              <Box sx={{ p: 2 }}>
                <Typography><strong>File:</strong> {selectedConversion.originalName}</Typography>
                <Typography><strong>Converted to:</strong> {selectedConversion.conversionType?.toUpperCase()}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedConversion.timestamp).toLocaleString()}</Typography>
                <Typography><strong>Status:</strong> {selectedConversion.status || "completed"}</Typography>
              </Box>
            )}
          </Modal>
        )}

        {/* ── Plan notice ──────────────────────────────────────────────────── */}
        {userPlanData.planId === "basic" && (
          <Alert severity="info" sx={{ mt: 4 }}>
            You're on the <strong>{currentPlan.name}</strong>. Upgrade to convert more than{" "}
            {currentPlan.fileLimit} files and process files larger than {currentPlan.fileSizeLimit}MB.
          </Alert>
        )}

        <FormatInfoDialog />
      </Container>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FileConversion;
