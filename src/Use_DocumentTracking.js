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
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Description,
  Visibility,
  Download,
  Edit,
  Delete,
  Share,
  Search,
  FilterList,
  Sort,
  MoreVert,
  CheckCircle,
  Pending,
  Error,
  Schedule,
  Assignment,
  Folder,
  Person,
  Group,
  DateRange,
  CloudDownload,
  CloudUpload,
  Lock,
  Public,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const DocumentTracking = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
  });
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Check permissions
  const canUseTeamFeatures = hasPermission("team_access");
  const canDeleteDocuments = hasPermission("delete_documents");
  const canEditAllDocuments = hasPermission("edit_all_documents");

  // Fetch user plan data
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData({
        planId: storedPlanData.planId,
        planName: storedPlanData.planName,
      });
    }
  }, []);

  // Sample documents data
  useEffect(() => {
    const sampleDocuments = [
      {
        id: 1,
        name: "Project_Requirements_Final.pdf",
        type: "PDF",
        size: "4.2 MB",
        status: "completed",
        uploadedBy: "John Doe",
        uploadedDate: "2024-01-15",
        modifiedDate: "2024-01-15",
        access: "team",
        teamMembers: ["John", "Sarah", "Mike"],
        downloadCount: 12,
      },
      {
        id: 2,
        name: "Design_Specifications.docx",
        type: "DOCX",
        size: "2.8 MB",
        status: "in_progress",
        uploadedBy: "Sarah Chen",
        uploadedDate: "2024-01-14",
        modifiedDate: "2024-01-15",
        access: "private",
        teamMembers: ["Sarah"],
        downloadCount: 5,
      },
      {
        id: 3,
        name: "Client_Presentation.pptx",
        type: "PPTX",
        size: "8.5 MB",
        status: "pending_review",
        uploadedBy: "Mike Johnson",
        uploadedDate: "2024-01-13",
        modifiedDate: "2024-01-14",
        access: "team",
        teamMembers: ["Mike", "John", "Sarah", "Emily"],
        downloadCount: 8,
      },
      {
        id: 4,
        name: "Technical_Drawings.dwg",
        type: "DWG",
        size: "12.3 MB",
        status: "completed",
        uploadedBy: "Emily Davis",
        uploadedDate: "2024-01-12",
        modifiedDate: "2024-01-12",
        access: "team",
        teamMembers: ["Emily", "John", "Mike"],
        downloadCount: 15,
      },
      {
        id: 5,
        name: "Budget_Spreadsheet.xlsx",
        type: "XLSX",
        size: "1.5 MB",
        status: "error",
        uploadedBy: "John Doe",
        uploadedDate: "2024-01-11",
        modifiedDate: "2024-01-11",
        access: "private",
        teamMembers: ["John"],
        downloadCount: 3,
      },
      {
        id: 6,
        name: "User_Manual.pdf",
        type: "PDF",
        size: "6.7 MB",
        status: "in_progress",
        uploadedBy: "Sarah Chen",
        uploadedDate: "2024-01-10",
        modifiedDate: "2024-01-14",
        access: "public",
        teamMembers: ["Sarah", "Mike"],
        downloadCount: 7,
      },
      {
        id: 7,
        name: "Code_Documentation.md",
        type: "MD",
        size: "0.8 MB",
        status: "completed",
        uploadedBy: "Mike Johnson",
        uploadedDate: "2024-01-09",
        modifiedDate: "2024-01-10",
        access: "team",
        teamMembers: ["Mike", "Emily"],
        downloadCount: 9,
      },
      {
        id: 8,
        name: "Marketing_Assets.zip",
        type: "ZIP",
        size: "25.4 MB",
        status: "pending_review",
        uploadedBy: "Emily Davis",
        uploadedDate: "2024-01-08",
        modifiedDate: "2024-01-09",
        access: "team",
        teamMembers: ["Emily", "Sarah", "John"],
        downloadCount: 4,
      },
    ];

    setDocuments(sampleDocuments);
    setFilteredDocuments(sampleDocuments);
  }, []);

  // Filter and sort documents
  useEffect(() => {
    let filtered = [...documents];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        case "date":
          return new Date(b.uploadedDate) - new Date(a.uploadedDate);
        case "downloads":
          return b.downloadCount - a.downloadCount;
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, typeFilter, sortBy, documents]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle sx={{ color: "#4caf50" }} />;
      case "in_progress":
        return <Pending sx={{ color: "#ff9800" }} />;
      case "pending_review":
        return <Schedule sx={{ color: "#2196f3" }} />;
      case "error":
        return <Error sx={{ color: "#f44336" }} />;
      default:
        return <Pending sx={{ color: "#757575" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in_progress":
        return "#ff9800";
      case "pending_review":
        return "#2196f3";
      case "error":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getAccessIcon = (access) => {
    switch (access) {
      case "private":
        return <Lock sx={{ color: "#757575", fontSize: 16 }} />;
      case "team":
        return <Group sx={{ color: "#2196f3", fontSize: 16 }} />;
      case "public":
        return <Public sx={{ color: "#4caf50", fontSize: 16 }} />;
      default:
        return <Lock sx={{ color: "#757575", fontSize: 16 }} />;
    }
  };

  const getPlanColor = () => {
    switch (userPlanData.planId) {
      case "basic":
        return "#757575";
      case "standard":
        return "#2196f3";
      case "premium":
        return "#ff6f00";
      default:
        return "#757575";
    }
  };

  const handleViewDocument = (id) => {
    // Navigate to document view page
    window.location.href = `/document/view/${id}`;
  };

  const handleDownloadDocument = (id) => {
    // Trigger download
    console.log(`Downloading document ${id}`);
  };

  const handleEditDocument = (id) => {
    // Navigate to edit page
    window.location.href = `/document/edit/${id}`;
  };

  const handleShareDocument = (id) => {
    // Open share dialog
    console.log(`Sharing document ${id}`);
  };

  const handleDeleteDocument = (id) => {
    if (canDeleteDocuments) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const StatsCard = ({ icon, title, value, subtitle }) => (
    <Card sx={{ textAlign: "center", p: 2, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ mt: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: getPlanColor(),
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
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
            backgroundColor: `rgba(${
              userPlanData.planId === "basic"
                ? "117, 117, 117"
                : userPlanData.planId === "standard"
                  ? "33, 150, 243"
                  : "255, 111, 0"
            }, 0.1)`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Document Tracking
              </Typography>
              <Chip
                label={userPlanData.planName}
                sx={{
                  backgroundColor: getPlanColor(),
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Track and manage your documents, {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                sx={{
                  backgroundColor: getPlanColor(),
                }}
                onClick={() => (window.location.href = "/upload")}
              >
                Upload Document
              </Button>
              {canUseTeamFeatures && (
                <Button
                  variant="outlined"
                  startIcon={<Group />}
                  onClick={() => (window.location.href = "/team/documents")}
                >
                  Team Documents
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={
                <Description sx={{ fontSize: 40, color: getPlanColor() }} />
              }
              title="Total Documents"
              value={documents.length}
              subtitle="All files"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={
                <CloudDownload sx={{ fontSize: 40, color: getPlanColor() }} />
              }
              title="Total Downloads"
              value={documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
              subtitle="All time"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={
                <CheckCircle sx={{ fontSize: 40, color: getPlanColor() }} />
              }
              title="Completed"
              value={
                documents.filter((doc) => doc.status === "completed").length
              }
              subtitle="Ready for use"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Group sx={{ fontSize: 40, color: getPlanColor() }} />}
              title="Team Members"
              value={new Set(documents.flatMap((doc) => doc.teamMembers)).size}
              subtitle="Active collaborators"
            />
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search documents or uploaders..."
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
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="pending_review">Pending Review</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Document Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="PDF">PDF</MenuItem>
                  <MenuItem value="DOCX">DOCX</MenuItem>
                  <MenuItem value="PPTX">PPTX</MenuItem>
                  <MenuItem value="XLSX">XLSX</MenuItem>
                  <MenuItem value="DWG">DWG</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">Upload Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="size">Size</MenuItem>
                  <MenuItem value="downloads">Downloads</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSortBy("date");
                }}
                sx={{
                  height: "56px",
                  borderColor: getPlanColor(),
                  color: getPlanColor(),
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Documents Table */}
        <Paper elevation={2} sx={{ mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Document Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Size
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Uploaded By
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Access
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Team
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Downloads
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Description
                            sx={{
                              mr: 2,
                              color: getPlanColor(),
                            }}
                          />
                          <Box>
                            <Typography variant="body1">{doc.name}</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(doc.uploadedDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.type}
                          size="small"
                          sx={{
                            backgroundColor: getPlanColor(),
                            color: "white",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{doc.size}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(doc.status)}
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: getStatusColor(doc.status) }}
                          >
                            {doc.status.replace("_", " ")}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Person sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {doc.uploadedBy}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={doc.access}>
                          {getAccessIcon(doc.access)}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <AvatarGroup
                          max={3}
                          sx={{ justifyContent: "flex-start" }}
                        >
                          {doc.teamMembers.map((member, index) => (
                            <Avatar
                              key={index}
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: "0.75rem",
                                bgcolor: getPlanColor(),
                              }}
                            >
                              {member.charAt(0)}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CloudDownload sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {doc.downloadCount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDocument(doc.id)}
                              sx={{ color: getPlanColor() }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadDocument(doc.id)}
                              sx={{ color: getPlanColor() }}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                          {(canEditAllDocuments ||
                            doc.uploadedBy === user?.name) && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditDocument(doc.id)}
                                sx={{ color: getPlanColor() }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Share">
                            <IconButton
                              size="small"
                              onClick={() => handleShareDocument(doc.id)}
                              sx={{ color: getPlanColor() }}
                            >
                              <Share />
                            </IconButton>
                          </Tooltip>
                          {canDeleteDocuments && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteDocument(doc.id)}
                                sx={{ color: "#f44336" }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Quick Actions and Summary */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: getPlanColor(),
                }}
              >
                Recent Activity
              </Typography>
              <Box>
                {documents.slice(0, 3).map((doc) => (
                  <Box
                    key={doc.id}
                    sx={{ mb: 2, pb: 2, borderBottom: "1px solid #eee" }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Uploaded by {doc.uploadedBy} • {doc.downloadCount}{" "}
                          downloads
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(doc.status)}
                        label={doc.status.replace("_", " ")}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(doc.status)}20`,
                          color: getStatusColor(doc.status),
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: getPlanColor(),
                }}
              >
                Storage Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">Documents Storage</Typography>
                  <Typography variant="body2">
                    {documents
                      .reduce((sum, doc) => {
                        const size = parseFloat(doc.size);
                        return sum + size;
                      }, 0)
                      .toFixed(1)}{" "}
                    MB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    (documents.reduce((sum, doc) => {
                      const size = parseFloat(doc.size);
                      return sum + size;
                    }, 0) /
                      1024) *
                      100,
                    100,
                  )}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getPlanColor(),
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Plan Limit:</strong>{" "}
                {userPlanData.planId === "basic"
                  ? "1 GB"
                  : userPlanData.planId === "standard"
                    ? "2.5 GB"
                    : "5 GB"}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: getPlanColor(),
                }}
                onClick={() => (window.location.href = "/storage")}
              >
                Manage Storage
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DocumentTracking;
