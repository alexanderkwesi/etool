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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Security,
  Description,
  CheckCircle,
  Warning,
  Error,
  History,
  Download,
  Upload,
  FilterList,
  Search,
  Visibility,
  Edit,
  Delete,
  Refresh,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const DocumentCompliance = () => {
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

  const [complianceDocs, setComplianceDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Check permissions for features
  const canUseAdvancedFeatures = hasPermission("advanced_compliance");
  const canExportReports = hasPermission("export_reports");
  const canBulkProcess = hasPermission("bulk_processing");

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

    // Load mock compliance data
    loadComplianceData();
  }, []);

  // Plan details matching Dashboard
  const planDetails = {
    basic: {
      name: "Begin Plan",
      complianceChecks: 10,
      storage: 1024,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      complianceChecks: 50,
      storage: 2560,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      complianceChecks: 200,
      storage: 5120,
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  const loadComplianceData = () => {
    // Mock compliance document data
    const mockData = [
      {
        id: 1,
        name: "Engineering_Specifications.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploaded: "2023-10-15",
        status: "compliant",
        issues: 0,
        lastScan: "2023-10-20",
        standards: ["ISO 9001", "ANSI Y14.5"],
      },
      {
        id: 2,
        name: "Project_Requirements.docx",
        type: "DOCX",
        size: "1.8 MB",
        uploaded: "2023-10-12",
        status: "non-compliant",
        issues: 3,
        lastScan: "2023-10-19",
        standards: ["ISO 9001"],
      },
      {
        id: 3,
        name: "Safety_Protocols.pdf",
        type: "PDF",
        size: "3.2 MB",
        uploaded: "2023-10-10",
        status: "warning",
        issues: 1,
        lastScan: "2023-10-18",
        standards: ["OSHA", "ISO 45001"],
      },
      {
        id: 4,
        name: "CAD_Design.step",
        type: "STEP",
        size: "5.6 MB",
        uploaded: "2023-10-08",
        status: "compliant",
        issues: 0,
        lastScan: "2023-10-17",
        standards: ["ISO 10303"],
      },
      {
        id: 5,
        name: "Quality_Report.xlsx",
        type: "XLSX",
        size: "1.2 MB",
        uploaded: "2023-10-05",
        status: "pending",
        issues: null,
        lastScan: "Pending",
        standards: ["ISO 9001"],
      },
    ];
    setComplianceDocs(mockData);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = complianceDocs.map((doc) => doc.id);
      setSelectedDocs(newSelected);
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (id) => {
    const selectedIndex = selectedDocs.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedDocs, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedDocs.slice(1));
    } else if (selectedIndex === selectedDocs.length - 1) {
      newSelected = newSelected.concat(selectedDocs.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedDocs.slice(0, selectedIndex),
        selectedDocs.slice(selectedIndex + 1)
      );
    }

    setSelectedDocs(newSelected);
  };

  const handleScanDocuments = () => {
    setScanInProgress(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanInProgress(false);
          
          // Update document statuses after scan
          const updatedDocs = complianceDocs.map(doc => {
            if (doc.status === "pending") {
              return {
                ...doc,
                status: Math.random() > 0.5 ? "compliant" : "non-compliant",
                issues: Math.floor(Math.random() * 4),
                lastScan: new Date().toISOString().split('T')[0]
              };
            }
            return doc;
          });
          setComplianceDocs(updatedDocs);
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleGenerateReport = (doc) => {
    setSelectedReport(doc);
    setOpenReportDialog(true);
  };

  const handleExportReport = () => {
    // Mock export functionality
    alert(`Exporting compliance report for ${selectedDocs.length} selected documents`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "#4caf50";
      case "non-compliant":
        return "#f44336";
      case "warning":
        return "#ff9800";
      case "pending":
        return "#757575";
      default:
        return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "compliant":
        return <CheckCircle sx={{ color: "#4caf50" }} />;
      case "non-compliant":
        return <Error sx={{ color: "#f44336" }} />;
      case "warning":
        return <Warning sx={{ color: "#ff9800" }} />;
      case "pending":
        return <History sx={{ color: "#757575" }} />;
      default:
        return <History sx={{ color: "#757575" }} />;
    }
  };

  const filteredDocs = complianceDocs.filter((doc) => {
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: complianceDocs.length,
    compliant: complianceDocs.filter(d => d.status === "compliant").length,
    nonCompliant: complianceDocs.filter(d => d.status === "non-compliant").length,
    warning: complianceDocs.filter(d => d.status === "warning").length,
    pending: complianceDocs.filter(d => d.status === "pending").length,
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
                Document Compliance
              </Typography>
              <Chip
                label={currentPlan.name}
                sx={{
                  backgroundColor: `${currentPlan.color}`,
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
                Security
              </Button>
              {userPlanData.planId === "basic" && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: currentPlan.color,
                    "&:hover": {
                      backgroundColor: currentPlan.color,
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => (window.location.href = "/features")}
                >
                  Upgrade Plan
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description
                sx={{
                  fontSize: 40,
                  color: currentPlan.color,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Documents
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: currentPlan.color,
                }}
              >
                {stats.total}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CheckCircle
                sx={{
                  fontSize: 40,
                  color: "#4caf50",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Compliant
              </Typography>
              <Typography variant="h4" sx={{ color: "#4caf50" }}>
                {stats.compliant}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Error
                sx={{
                  fontSize: 40,
                  color: "#f44336",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Non-Compliant
              </Typography>
              <Typography variant="h4" sx={{ color: "#f44336" }}>
                {stats.nonCompliant}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Warning
                sx={{
                  fontSize: 40,
                  color: "#ff9800",
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Needs Attention
              </Typography>
              <Typography variant="h4" sx={{ color: "#ff9800" }}>
                {stats.warning + stats.pending}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Controls Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h5"
              sx={{
                color: currentPlan.color,
              }}
            >
              Compliance Controls
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              {scanInProgress && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Scanning...</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={scanProgress}
                    sx={{ width: 100 }}
                  />
                </Box>
              )}
              <Button
                variant="contained"
                startIcon={scanInProgress ? <Refresh /> : <Upload />}
                onClick={handleScanDocuments}
                disabled={scanInProgress || userPlanData.planId === "basic"}
                sx={{
                  backgroundColor: currentPlan.color,
                  "&:hover": {
                    backgroundColor: currentPlan.color,
                    opacity: 0.9,
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                {scanInProgress ? "Scanning..." : "Scan New Documents"}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filter by Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="compliant">Compliant</MenuItem>
                  <MenuItem value="non-compliant">Non-Compliant</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportReport}
                  disabled={selectedDocs.length === 0 || !canExportReports}
                  sx={{
                    borderColor: currentPlan.color,
                    color: currentPlan.color,
                  }}
                >
                  Export Selected ({selectedDocs.length})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => alert("Advanced filters coming soon!")}
                  sx={{
                    borderColor: currentPlan.color,
                    color: currentPlan.color,
                  }}
                >
                  Advanced Filters
                </Button>
              </Box>
            </Grid>
          </Grid>

          {userPlanData.planId === "basic" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Upgrade to Standard or Premium plan to access document scanning and advanced compliance features.
            </Alert>
          )}
        </Paper>

        {/* Documents Table */}
        <Paper elevation={2} sx={{ mb: 4 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography
              variant="h6"
              sx={{
                color: currentPlan.color,
              }}
            >
              Document Compliance Status
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedDocs.length > 0 && selectedDocs.length < complianceDocs.length}
                      checked={complianceDocs.length > 0 && selectedDocs.length === complianceDocs.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Issues</TableCell>
                  <TableCell>Standards</TableCell>
                  <TableCell>Last Scan</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id} hover selected={selectedDocs.indexOf(doc.id) !== -1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedDocs.indexOf(doc.id) !== -1}
                        onChange={() => handleSelectDoc(doc.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Description sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2">{doc.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={doc.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(doc.status)}
                        <Typography
                          variant="body2"
                          sx={{ color: getStatusColor(doc.status) }}
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {doc.issues !== null ? (
                        <Chip
                          label={`${doc.issues} issue${doc.issues !== 1 ? 's' : ''}`}
                          size="small"
                          color={doc.issues === 0 ? "success" : "error"}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {doc.standards.map((standard, index) => (
                          <Chip
                            key={index}
                            label={standard}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.08)",
                              fontSize: "0.7rem",
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{doc.lastScan}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => handleGenerateReport(doc)}
                          title="View Report"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => alert(`Edit ${doc.name}`)}
                          disabled={!canUseAdvancedFeatures}
                          title="Edit Compliance"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => alert(`Delete ${doc.name}`)}
                          disabled={!canUseAdvancedFeatures}
                          title="Delete"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Compliance Standards */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: currentPlan.color,
            }}
          >
            Supported Compliance Standards
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  ISO Standards
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • ISO 9001: Quality Management
                  <br />• ISO 14001: Environmental Management
                  <br />• ISO 45001: Occupational Health & Safety
                  <br />• ISO 27001: Information Security
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Engineering Standards
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • ANSI Y14.5: Dimensioning & Tolerancing
                  <br />• ISO 10303: STEP Standards
                  <br />• ASME Y14.100: Engineering Drawing Practices
                  <br />• MIL-STD-31000: Technical Documentation
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Industry Specific
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • FDA 21 CFR Part 11: Electronic Records
                  <br />• GDPR: Data Protection
                  <br />• HIPAA: Healthcare Information
                  <br />• SOX: Financial Reporting
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: currentPlan.color,
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                backgroundColor: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/remediation/compliance")}
            >
              Run Compliance Check
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/templates")}
            >
              Use Compliance Templates
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/remediation/history")}
            >
              View Compliance History
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/help/compliance")}
            >
              Compliance Help Center
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Report Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Compliance Report: {selectedReport?.name}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Document Information
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedReport.name}
                    <br />
                    Type: {selectedReport.type}
                    <br />
                    Size: {selectedReport.size}
                    <br />
                    Uploaded: {selectedReport.uploaded}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Compliance Status
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getStatusIcon(selectedReport.status)}
                    <Typography
                      variant="body1"
                      sx={{ color: getStatusColor(selectedReport.status) }}
                    >
                      {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Issues Found: {selectedReport.issues || 0}
                    <br />
                    Last Scan: {selectedReport.lastScan}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Compliance Details
              </Typography>
              <Typography variant="body2">
                This document has been checked against the following standards:
                <br />
                {selectedReport.standards.join(", ")}
                <br />
                <br />
                {selectedReport.status === "compliant" 
                  ? "All checks passed successfully. Document meets all compliance requirements."
                  : selectedReport.status === "non-compliant"
                  ? "Critical compliance issues detected. Please review and remediate the document."
                  : "Minor issues detected that require attention but do not prevent compliance."}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              alert("Report downloaded!");
              setOpenReportDialog(false);
            }}
            sx={{
              backgroundColor: currentPlan.color,
            }}
          >
            Download Full Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentCompliance;