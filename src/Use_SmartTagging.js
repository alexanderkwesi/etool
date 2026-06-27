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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  SmartToy,
  Tag,
  AutoFixHigh,
  Upload,
  Download,
  Delete,
  Edit,
  CheckCircle,
  Cancel,
  Refresh,
  Add,
  Search,
  Visibility,
  Security,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const SmartTagging = () => {
  // Use the security context hook
  const { isAuthenticated, user, hasPermission } = useSecurity();

  // State for user plan data
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  // State for documents and tags
  const [documents, setDocuments] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [taggingMode, setTaggingMode] = useState("auto"); // auto, semi-auto, manual
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // AI model settings
  const [aiSettings, setAiSettings] = useState({
    confidenceThreshold: 0.8,
    autoApply: true,
    suggestCategories: true,
    tagHierarchy: true,
  });

  // Check permissions for features
  const canUseAITagging = hasPermission("ai_features");
  const canUseBulkTagging = hasPermission("bulk_operations");
  const canUseAdvancedAI = hasPermission("advanced_ai");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Simulate loading documents and tags
    loadSampleData();
  }, []);

  // Load sample data
  const loadSampleData = () => {
    // Sample documents
    const sampleDocuments = [
      {
        id: 1,
        name: "Project_Requirements_v2.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploaded: "2024-01-15",
        status: "processed",
        tags: ["requirements", "project", "v2"],
        aiConfidence: 0.92,
      },
      {
        id: 2,
        name: "Design_Specifications.docx",
        type: "DOCX",
        size: "1.8 MB",
        uploaded: "2024-01-14",
        status: "pending",
        tags: ["design", "specs"],
        aiConfidence: 0.78,
      },
      {
        id: 3,
        name: "Meeting_Minutes_Jan.pdf",
        type: "PDF",
        size: "3.1 MB",
        uploaded: "2024-01-13",
        status: "processed",
        tags: ["meeting", "minutes", "january"],
        aiConfidence: 0.85,
      },
      {
        id: 4,
        name: "Code_Review_Checklist.xlsx",
        type: "XLSX",
        size: "4.2 MB",
        uploaded: "2024-01-12",
        status: "processing",
        tags: ["code", "review", "checklist"],
        aiConfidence: null,
      },
      {
        id: 5,
        name: "API_Documentation.md",
        type: "MD",
        size: "0.8 MB",
        uploaded: "2024-01-11",
        status: "processed",
        tags: ["api", "documentation", "technical"],
        aiConfidence: 0.95,
      },
    ];

    // Sample tags with categories
    const sampleTags = [
      { id: 1, name: "requirements", category: "Document Type", count: 12 },
      { id: 2, name: "design", category: "Document Type", count: 8 },
      { id: 3, name: "meeting", category: "Event Type", count: 15 },
      { id: 4, name: "code", category: "Technical", count: 22 },
      { id: 5, name: "api", category: "Technical", count: 18 },
      { id: 6, name: "urgent", category: "Priority", count: 5 },
      { id: 7, name: "review", category: "Process", count: 10 },
      { id: 8, name: "specifications", category: "Document Type", count: 7 },
    ];

    setDocuments(sampleDocuments);
    setTags(sampleTags);
  };

  // Plan details
  const planDetails = {
    basic: {
      name: "Begin Plan",
      aiTagging: false,
      maxDocuments: 10,
      maxTagsPerDoc: 5,
      autoTagging: false,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      aiTagging: true,
      maxDocuments: 50,
      maxTagsPerDoc: 10,
      autoTagging: true,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      aiTagging: true,
      maxDocuments: 200,
      maxTagsPerDoc: 25,
      autoTagging: true,
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  // Handle document selection
  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
  };

  // Handle AI tagging
  const handleAITagging = () => {
    if (!canUseAITagging && userPlanData.planId === "basic") {
      setSnackbar({
        open: true,
        message: "AI Tagging requires Standard or Premium plan",
        severity: "warning",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const updatedDocs = documents.map((doc) => {
        if (doc.id === selectedDocument?.id) {
          const newTags = [...doc.tags, "ai-tagged", "automated"];
          return {
            ...doc,
            tags: newTags,
            aiConfidence: Math.random() * 0.2 + 0.8, // Random confidence between 0.8-1.0
            status: "processed",
          };
        }
        return doc;
      });

      setDocuments(updatedDocs);
      if (selectedDocument) {
        setSelectedDocument(
          updatedDocs.find((doc) => doc.id === selectedDocument.id),
        );
      }
      setIsProcessing(false);
      setSnackbar({
        open: true,
        message: "AI tagging completed successfully",
        severity: "success",
      });
    }, 1500);
  };

  // Handle bulk tagging
  const handleBulkTagging = () => {
    if (!canUseBulkTagging && userPlanData.planId === "basic") {
      setSnackbar({
        open: true,
        message: "Bulk operations require Standard or Premium plan",
        severity: "warning",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate bulk processing
    setTimeout(() => {
      const updatedDocs = documents.map((doc) => ({
        ...doc,
        tags: [...doc.tags, "bulk-processed"],
        status: "processed",
      }));

      setDocuments(updatedDocs);
      setIsProcessing(false);
      setSnackbar({
        open: true,
        message: "Bulk tagging completed for all documents",
        severity: "success",
      });
    }, 2000);
  };

  // Handle tag addition
  const handleAddTag = (tagName) => {
    if (selectedDocument) {
      const updatedDocs = documents.map((doc) => {
        if (doc.id === selectedDocument.id && !doc.tags.includes(tagName)) {
          return {
            ...doc,
            tags: [...doc.tags, tagName],
          };
        }
        return doc;
      });

      setDocuments(updatedDocs);
      setSelectedDocument(
        updatedDocs.find((doc) => doc.id === selectedDocument.id),
      );
    }
  };

  // Handle tag removal
  const handleRemoveTag = (docId, tagName) => {
    const updatedDocs = documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          tags: doc.tags.filter((tag) => tag !== tagName),
        };
      }
      return doc;
    });

    setDocuments(updatedDocs);
    if (selectedDocument?.id === docId) {
      setSelectedDocument(updatedDocs.find((doc) => doc.id === docId));
    }
  };

  // Handle AI settings change
  const handleAISettingsChange = (setting, value) => {
    setAiSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Feature Card Component (same style as Dashboard)
  const FeatureCard = ({
    icon,
    title,
    description,
    available = true,
    action,
  }) => (
    <Card
      className="feature-card"
      sx={{ opacity: available ? 1 : 0.6, height: "100%" }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {action && <Box sx={{ mt: "auto" }}>{action}</Box>}
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Intelligent Document Tagging (AI)
              </Typography>
              <Chip
                label={currentPlan.name}
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
                Security
              </Button>
              {userPlanData.planId === "basic" && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2196f3",
                    "&:hover": { backgroundColor: "#1976d2" },
                  }}
                  onClick={() => (window.location.href = "/features")}
                >
                  Upgrade for AI Features
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* AI Tagging Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SmartToy
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
                AI-Tagged Documents
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
                {documents.filter((d) => d.aiConfidence > 0.7).length}/
                {documents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Confidence Tags
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Tag
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
                Total Unique Tags
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
                {tags.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all categories
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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
                Auto-Tagging Accuracy
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
                94%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on user feedback
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Document List */}
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
              Documents
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>AI Confidence</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow
                      key={doc.id}
                      hover
                      selected={selectedDocument?.id === doc.id}
                      onClick={() => handleSelectDocument(doc)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.type} • {doc.size}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {doc.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              onDelete={() => handleRemoveTag(doc.id, tag)}
                              deleteIcon={<Cancel />}
                              sx={{
                                backgroundColor: `${
                                  userPlanData.planId === "basic"
                                    ? "#757575"
                                    : userPlanData.planId === "standard"
                                      ? "#2196f3"
                                      : "#ff6f00"
                                }`,
                                color: "white",
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {doc.aiConfidence ? (
                          <Chip
                            label={`${(doc.aiConfidence * 100).toFixed(0)}%`}
                            size="small"
                            color={
                              doc.aiConfidence > 0.8
                                ? "success"
                                : doc.aiConfidence > 0.6
                                  ? "warning"
                                  : "error"
                            }
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not processed
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDocument(doc);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Tagging Interface */}
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
              Tagging Interface
            </Typography>
            <Card sx={{ p: 3 }}>
              {selectedDocument ? (
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6">
                      {selectedDocument.name}
                    </Typography>
                    <Chip
                      label={selectedDocument.status}
                      color={
                        selectedDocument.status === "processed"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Apply intelligent tags to this document using AI analysis
                  </Typography>

                  <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Tags
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {selectedDocument.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() =>
                            handleRemoveTag(selectedDocument.id, tag)
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
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Suggested Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {["technical", "urgent", "review", "final", "draft"].map(
                        (tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onClick={() => handleAddTag(tag)}
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
                          />
                        ),
                      )}
                    </Box>
                  </Box>

                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<SmartToy />}
                      disabled={isProcessing || !canUseAITagging}
                      onClick={handleAITagging}
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
                      {isProcessing ? "Processing..." : "Apply AI Tags"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => {
                        const newTag = prompt("Enter new tag:");
                        if (newTag) handleAddTag(newTag);
                      }}
                    >
                      Add Custom Tag
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <SmartToy
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Select a document to start tagging
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Click on any document from the list to begin AI-powered
                    tagging
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* AI Settings & Features */}
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
              AI Tagging Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <SmartToy
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
                  title="Auto-Tagging"
                  description="Automatically apply tags based on content analysis"
                  available={currentPlan.autoTagging}
                  action={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.autoApply}
                          onChange={(e) =>
                            handleAISettingsChange(
                              "autoApply",
                              e.target.checked,
                            )
                          }
                          disabled={!currentPlan.autoTagging}
                          color="primary"
                        />
                      }
                      label="Enabled"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <Tag
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
                  title="Tag Hierarchy"
                  description="Organize tags in hierarchical structure"
                  available={canUseAdvancedAI}
                  action={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.tagHierarchy}
                          onChange={(e) =>
                            handleAISettingsChange(
                              "tagHierarchy",
                              e.target.checked,
                            )
                          }
                          disabled={!canUseAdvancedAI}
                          color="primary"
                        />
                      }
                      label="Enabled"
                    />
                  }
                />
              </Grid>
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
                  title="Bulk Processing"
                  description="Tag multiple documents simultaneously"
                  available={canUseBulkTagging}
                  action={
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={handleBulkTagging}
                      disabled={!canUseBulkTagging || isProcessing}
                      fullWidth
                    >
                      Process All
                    </Button>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={
                    <Search
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
                  title="Smart Suggestions"
                  description="AI-powered tag recommendations"
                  available={canUseAITagging}
                  action={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.suggestCategories}
                          onChange={(e) =>
                            handleAISettingsChange(
                              "suggestCategories",
                              e.target.checked,
                            )
                          }
                          disabled={!canUseAITagging}
                          color="primary"
                        />
                      }
                      label="Enabled"
                    />
                  }
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
              startIcon={<Upload />}
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
              Upload Documents
            </Button>
            <Button
              variant="outlined"
              startIcon={<SmartToy />}
              disabled={!canUseAITagging}
              onClick={handleBulkTagging}
            >
              Batch AI Tagging
            </Button>
            <Button variant="outlined" startIcon={<Download />}>
              Export Tags
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => (window.location.href = "/ai/tagging/stats")}
            >
              View Analytics
            </Button>
          </Box>

          {!canUseAITagging && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Standard or Premium plan to unlock AI-powered
              intelligent tagging features.
            </Typography>
          )}
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SmartTagging;
