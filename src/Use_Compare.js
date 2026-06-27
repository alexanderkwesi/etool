import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Container, Paper, Typography, Box, Button, Grid, Card, CardContent,
  List, ListItem, ListItemText, ListItemIcon, Divider, Alert, IconButton,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload, CompareArrows, Download, Delete, Info,
  CheckCircle, Error as ErrorIcon, Description, Refresh,
} from "@mui/icons-material";

import { useSecurity } from "./Use_Security";
import { useLocalStorageNew } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const API = "http://127.0.0.1:5000/api";

// ── plan config ───────────────────────────────────────────────────────────────
const planDetails = {
  basic:    { name: "Begin Plan",    fileLimit: 5,  fileSizeLimit: 10, color: "#757575" },
  standard: { name: "Standard Plan", fileLimit: 10, fileSizeLimit: 20, color: "#2196f3" },
  premium:  { name: "Premium Plan",  fileLimit: 50, fileSizeLimit: 50, color: "#ff6f00" },
};

// ─────────────────────────────────────────────────────────────────────────────
const FileComparison = () => {
  const { hasPermission } = useSecurity();

  // Read plan from localStorage (written by dashboard on login)
  const [userPlanData] = useLocalStorageNew("User_Plan_Data", {
    planId: "basic", planName: "Begin Plan",
  });

  const planKey    = userPlanData.planId || "basic";
  const currentPlan = planDetails[planKey] || planDetails.basic;

  // Premium gate — comparison is an admin/premium feature
  const canCompareFiles = hasPermission("admin_features") || planKey === "premium";

  // ── state ──────────────────────────────────────────────────────────────────
  const [selectedFiles,         setSelectedFiles]         = useState([]);   // File objects (new upload)
  const [serverDocs,            setServerDocs]            = useState([]);   // documents from /api/files/documents
  const [selectedServerDocIds,  setSelectedServerDocIds]  = useState([]);   // doc ids chosen for comparison
  const [comparisonResults,     setComparisonResults]     = useState([]);
  const [comparisonStatus,      setComparisonStatus]      = useState("idle"); // idle|uploading|comparing|completed|error
  const [showDetails,           setShowDetails]           = useState(false);
  const [errorMsg,              setErrorMsg]              = useState("");
  const [loadingDocs,           setLoadingDocs]           = useState(false);

  const fileInputRef = useRef(null);

  // ── fetch server documents to compare against ─────────────────────────────
  const fetchServerDocs = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const res  = await fetch(`${API}/files/documents?limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.status === 200) {
        // Only show converted documents — these are the ones meaningful to compare
        setServerDocs(data.documents || []);
      }
    } catch (err) {
      console.warn("Could not load server documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => { fetchServerDocs(); }, [fetchServerDocs]);

  // ── file select ───────────────────────────────────────────────────────────
  const handleFileSelect = (event) => {
    if (!canCompareFiles) {
      alert("File comparison requires the Premium plan. Please upgrade.");
      return;
    }
    const files = Array.from(event.target.files);
    const oversized = files.filter(f => f.size > currentPlan.fileSizeLimit * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`Some files exceed your ${currentPlan.fileSizeLimit}MB limit.`);
      return;
    }
    setSelectedFiles(prev => [...prev, ...files]);
    event.target.value = "";
  };

  const handleRemoveFile   = (i) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));

  // ── toggle which server doc to compare against ────────────────────────────
  const toggleServerDoc = (id) => {
    setSelectedServerDocIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ── compare ───────────────────────────────────────────────────────────────
  const handleCompare = async () => {
    if (!canCompareFiles) {
      alert("File comparison requires the Premium plan. Please upgrade.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to compare.");
      return;
    }
    if (serverDocs.length === 0 && selectedServerDocIds.length === 0) {
      alert("No stored documents to compare against. Convert some files first.");
      return;
    }

    setErrorMsg("");
    setComparisonStatus("uploading");

    try {
      // 1. Upload the new files first
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append("files[]", f));

      const uploadRes  = await fetch(`${API}/files/upload`, {
        method: "POST", credentials: "include", body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.status !== 200) throw new Error(uploadData.error || "Upload failed");

      const uploaded = uploadData.uploaded; // [{file_id, original_name, document_id, extension, size_mb}]

      setComparisonStatus("comparing");

      // 2. Build comparison against selected server docs (or all if none selected)
      const docsToCompare = selectedServerDocIds.length > 0
        ? serverDocs.filter(d => selectedServerDocIds.includes(d.id))
        : serverDocs;

      // 3. Client-side comparison: match by base name or extension
      const results = uploaded.map(upFile => {
        const baseName = upFile.original_name.replace(/\.[^.]+$/, "").toLowerCase();

        // Try to find a match in server docs
        const match = docsToCompare.find(doc => {
          const docBase = (doc.document_name || "").replace(/\.[^.]+$/, "").toLowerCase();
          return docBase === baseName || doc.document_type === upFile.extension;
        }) || docsToCompare[0]; // fallback: compare against first available doc

        const sizeDiffMb    = match
          ? Math.abs((upFile.size_mb || 0) - (match.document_size || 0))
          : null;
        const sameType      = match && match.document_type === upFile.extension;
        const sameConverted = match && match.modified_document_type === upFile.extension;

        const differences = [];
        if (match) {
          if (sizeDiffMb > 0.001)
            differences.push({ type: "size",   message: `Size difference: ${sizeDiffMb.toFixed(3)} MB` });
          if (!sameType && !sameConverted)
            differences.push({ type: "format", message: `Different format: ${upFile.extension} vs ${match.document_type}` });
          if (match.modified_document_type && match.modified_document_type !== upFile.extension)
            differences.push({ type: "converted_format", message: `Server doc converted to: ${match.modified_document_type}` });
          if (differences.length === 0)
            differences.push({ type: "identical", message: "Files appear identical in metadata" });
        } else {
          differences.push({ type: "missing", message: "No matching document found in storage" });
        }

        // Score: 100 − 10 per difference, floored at 0; boost if names match
        const nameBonus     = match && (match.document_name || "").replace(/\.[^.]+$/, "").toLowerCase() === baseName ? 20 : 0;
        const similarityScore = match
          ? Math.min(100, Math.max(0, 100 - differences.length * 15 + nameBonus))
          : 0;

        return {
          uploadedFile:    upFile,
          matchedDoc:      match || null,
          differences,
          similarityScore,
        };
      });

      setComparisonResults(results);
      setComparisonStatus("completed");

      // 4. Refresh server docs list
      await fetchServerDocs();

    } catch (err) {
      setErrorMsg(err.message);
      setComparisonStatus("error");
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setSelectedServerDocIds([]);
    setComparisonResults([]);
    setComparisonStatus("idle");
    setErrorMsg("");
  };

  const isProcessing = comparisonStatus === "uploading" || comparisonStatus === "comparing";

  // ── ComparisonDetailsDialog ───────────────────────────────────────────────
  const ComparisonDetailsDialog = () => (
    <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Info sx={{ mr: 1, color: currentPlan.color }} />
          Detailed Comparison Results
        </Box>
      </DialogTitle>
      <DialogContent>
        {comparisonResults.map((result, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {result.uploadedFile.original_name}
            </Typography>

            {result.matchedDoc ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Compared with: <strong>{result.matchedDoc.document_name}</strong>
                    {result.matchedDoc.modified_document_name && (
                      <> → <strong>{result.matchedDoc.modified_document_name}</strong></>
                    )}
                  </Typography>
                  <Chip
                    label={`${Math.round(result.similarityScore)}% Similar`}
                    color={result.similarityScore >= 80 ? "success" : result.similarityScore >= 50 ? "warning" : "error"}
                    size="small"
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">Uploaded</Typography>
                      <Typography variant="body2"><strong>{result.uploadedFile.original_name}</strong></Typography>
                      <Typography variant="caption">{result.uploadedFile.extension?.toUpperCase()} · {(result.uploadedFile.size_mb || 0).toFixed(2)} MB</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">Stored Document</Typography>
                      <Typography variant="body2"><strong>{result.matchedDoc.document_name}</strong></Typography>
                      <Typography variant="caption">
                        {result.matchedDoc.document_type?.toUpperCase()} · {(result.matchedDoc.document_size || 0).toFixed(2)} MB
                        {result.matchedDoc.modified_document_type && (
                          <> · Converted: {result.matchedDoc.modified_document_type.toUpperCase()}</>
                        )}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" gutterBottom>Differences Found:</Typography>
                <List dense>
                  {result.differences.map((diff, idx) => (
                    <ListItem key={idx} sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        {diff.type === "identical"
                          ? <CheckCircle fontSize="small" color="success" />
                          : <ErrorIcon   fontSize="small" color="warning" />}
                      </ListItemIcon>
                      <ListItemText primary={diff.message} />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Alert severity="info">No matching document found in storage</Alert>
            )}

            {index < comparisonResults.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDetails(false)}>Close</Button>
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
            planKey === "basic"    ? "rgba(117,117,117,0.3)" :
            planKey === "standard" ? "rgba(33,150,243,0.3)"  :
                                     "rgba(255,111,0,0.3)",
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box>
              <Typography variant="h4" gutterBottom>File Comparison</Typography>
              <Typography variant="body1" color="text.secondary">
                Compare engineering files to identify differences and changes
              </Typography>
              <Chip
                label={currentPlan.name}
                sx={{ mt: 1, backgroundColor: currentPlan.color, color: "white", fontSize: "1rem", padding: "4px 12px" }}
              />
            </Box>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchServerDocs} disabled={loadingDocs}>
              {loadingDocs ? "Loading…" : "Reload Stored Files"}
            </Button>
          </Box>
        </Paper>

        {/* ── Premium gate ─────────────────────────────────────────────────── */}
        {!canCompareFiles && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            File comparison is available on the <strong>Premium Plan</strong> only.{" "}
            <Button size="small" variant="outlined" onClick={() => window.location.href = "/features"} sx={{ ml: 1 }}>
              Upgrade
            </Button>
          </Alert>
        )}

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg("")}>{errorMsg}</Alert>
        )}

        {/* ── Comparison Interface ─────────────────────────────────────────── */}
        <Grid container spacing={4}>

          {/* Upload new file for comparison */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                Upload File to Compare
              </Typography>

              <input
                type="file" multiple ref={fileInputRef}
                onChange={handleFileSelect} style={{ display: "none" }}
                accept=".dwg,.dxf,.dgn,.step,.iges,.stl,.obj,.pdf,.svg,.png,.jpg,.dwf,.dwfx,.rvt"
              />

              <Button
                variant="outlined" fullWidth startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current.click()}
                disabled={!canCompareFiles || isProcessing}
                sx={{ mb: 2, py: 2 }}
              >
                Upload Files
              </Button>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Max file size: {currentPlan.fileSizeLimit}MB per file
              </Typography>

              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Files to compare ({selectedFiles.length})
                  </Typography>
                  <List dense>
                    {selectedFiles.map((file, i) => (
                      <ListItem key={i}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveFile(i)} disabled={isProcessing}>
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemIcon><Description sx={{ color: currentPlan.color }} /></ListItemIcon>
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

          {/* Stored docs + Compare button */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
                Compare Against
              </Typography>

              {loadingDocs ? (
                <Box display="flex" justifyContent="center" py={3}><CircularProgress size={28} /></Box>
              ) : serverDocs.length > 0 ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {serverDocs.length} document(s) in your storage.
                    {selectedServerDocIds.length > 0
                      ? ` ${selectedServerDocIds.length} selected.`
                      : " (Comparing against all — click to select specific ones)"}
                  </Typography>
                  <List dense sx={{ maxHeight: 220, overflow: "auto" }}>
                    {serverDocs.map((doc) => {
                      const selected = selectedServerDocIds.includes(doc.id);
                      return (
                        <ListItem
                          key={doc.id}
                          button
                          onClick={() => toggleServerDoc(doc.id)}
                          sx={{
                            borderRadius: 1, mb: 0.5,
                            backgroundColor: selected ? `${currentPlan.color}22` : "transparent",
                            border: selected ? `1px solid ${currentPlan.color}` : "1px solid transparent",
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {selected
                              ? <CheckCircle sx={{ color: currentPlan.color }} fontSize="small" />
                              : <Description fontSize="small" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.document_name}
                            secondary={
                              `${doc.document_type?.toUpperCase() || ""}` +
                              (doc.modified_document_type ? ` → ${doc.modified_document_type.toUpperCase()}` : "") +
                              ` · ${(doc.document_size || 0).toFixed(2)} MB · ${doc.action}`
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No documents in storage yet.{" "}
                  <Button size="small" onClick={() => window.location.href = "/convert"}>Convert a file</Button>{" "}
                  to create documents for comparison.
                </Alert>
              )}

              {/* Compare button */}
              {comparisonStatus === "idle" && (
                <Button
                  variant="contained" fullWidth size="large"
                  startIcon={<CompareArrows />}
                  onClick={handleCompare}
                  disabled={!canCompareFiles || selectedFiles.length === 0 || serverDocs.length === 0}
                  sx={{
                    mt: 2, py: 1.5,
                    backgroundColor: currentPlan.color,
                    "&:hover": { backgroundColor: currentPlan.color, opacity: 0.9 },
                  }}
                >
                  Compare Files
                </Button>
              )}

              {/* Progress */}
              {isProcessing && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    {comparisonStatus === "uploading" ? "Uploading files…" : `Comparing ${selectedFiles.length} file(s)…`}
                  </Typography>
                  <LinearProgress sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">Analysing differences</Typography>
                </Box>
              )}

              {/* Completed */}
              {comparisonStatus === "completed" && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" sx={{ mb: 2 }}>Comparison completed!</Alert>
                  <Button variant="outlined" fullWidth onClick={() => setShowDetails(true)} sx={{ mb: 1 }}>
                    View Detailed Results
                  </Button>
                  <Button variant="outlined" fullWidth onClick={handleReset}>
                    Compare More Files
                  </Button>
                </Box>
              )}

              {/* Error */}
              {comparisonStatus === "error" && (
                <Button variant="outlined" fullWidth onClick={handleReset} sx={{ mt: 2 }}>
                  Try Again
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* ── Summary Cards ────────────────────────────────────────────────── */}
        {comparisonResults.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
              Comparison Summary
            </Typography>
            <Grid container spacing={2}>
              {comparisonResults.map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        {result.matchedDoc
                          ? <CheckCircle color="success" sx={{ mr: 1 }} />
                          : <ErrorIcon   color="error"   sx={{ mr: 1 }} />}
                        <Typography variant="subtitle2" noWrap>
                          {result.uploadedFile.original_name}
                        </Typography>
                      </Box>

                      {result.matchedDoc ? (
                        <>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            vs. {result.matchedDoc.document_name}
                          </Typography>
                          <Chip
                            label={`${Math.round(result.similarityScore)}% Similar`}
                            color={result.similarityScore >= 80 ? "success" : result.similarityScore >= 50 ? "warning" : "error"}
                            size="small"
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {result.differences.length} difference(s) found
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="error">
                          No matching document found
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        <ComparisonDetailsDialog />
      </Container>
    </div>
  );
};

export default FileComparison;
