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
  Select,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  AutoFixHigh,
  CheckCircle,
  Error,
  Warning,
  Info,
  Upload,
  Download,
  Visibility,
  History,
  Refresh,
  SmartToy,
  Security,
  Description,
  ExpandMore,
  ExpandLess,
  Star,
  StarBorder,
  Speed,
  Psychology,
  AutoAwesome,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const AiPoweredFixes = () => {
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

  const [usageStats, setUsageStats] = useState({
    aiCreditsUsed: 0,
    aiCreditsRemaining: 0,
    documentsFixed: 0,
  });

  // AI Fixes State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileType, setFileType] = useState("");
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [fixingPriority, setFixingPriority] = useState("balanced");
  const [fixMode, setFixMode] = useState("automatic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fixHistory, setFixHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check permissions for AI features
  const canUseAiFeatures = hasPermission("ai_access");
  const canUseAdvancedAi = hasPermission("advanced_ai");

  // Fetch user data from localStorage or API
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;

      // Update state with the new plan data
      setUserPlanData({
        planId: planData.planId,
        planName: planData.planName,
        monthlyPrice: planData.monthlyPrice,
        annualPrice: planData.annualPrice,
        billingCycle: planData.billingCycle,
      });

      // Set AI credits based on plan
      const aiCredits = {
        basic: 10,
        standard: 50,
        premium: 200,
      };

      // Simulate usage data
      setUsageStats({
        aiCreditsUsed: Math.floor(Math.random() * aiCredits[planData.planId]),
        aiCreditsRemaining: aiCredits[planData.planId],
        documentsFixed: Math.floor(Math.random() * 20),
      });

      // Load fix history from localStorage
      const savedHistory = useLocalStorage.getItem("AI_Fix_History") || [];
      setFixHistory(savedHistory);
    }
  }, []);

  const planDetails = {
    basic: {
      name: "Begin Plan",
      aiCredits: 10,
      fileSizeLimit: 10,
      color: "#757575",
      supports: [
        "Basic issue detection",
        "Auto-fix common issues",
        "PDF accessibility fixes",
      ],
    },
    standard: {
      name: "Standard Plan",
      aiCredits: 50,
      fileSizeLimit: 20,
      color: "#2196f3",
      supports: [
        "Advanced issue detection",
        "Smart suggestions",
        "Batch processing",
        "Priority fixes",
      ],
    },
    premium: {
      name: "Premium Plan",
      aiCredits: 200,
      fileSizeLimit: 50,
      color: "#ff6f00",
      supports: [
        "All AI features",
        "Custom fix rules",
        "Real-time collaboration",
        "API access",
        "Priority support",
      ],
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size limit
    const maxSizeMB = currentPlan.fileSizeLimit;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
      alert(
        `File size exceeds ${maxSizeMB}MB limit for your ${currentPlan.name}`,
      );
      return;
    }

    setUploadedFile(file);
    setFileType(file.type);

    // Simulate file preview for documents
    if (
      file.type.includes("pdf") ||
      file.type.includes("text") ||
      file.name.endsWith(".docx")
    ) {
      setFilePreview(file.name);
    }

    // Start analysis
    analyzeDocument(file);
  };

  const analyzeDocument = (file) => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockIssues = [
        {
          id: 1,
          type: "accessibility",
          severity: "high",
          description: "Missing alternative text for images",
          fix: "Add descriptive alt text",
          confidence: 0.95,
        },
        {
          id: 2,
          type: "structure",
          severity: "medium",
          description: "Incorrect heading hierarchy",
          fix: "Restructure heading levels",
          confidence: 0.88,
        },
        {
          id: 3,
          type: "compliance",
          severity: "high",
          description: "WCAG 2.1 AA compliance issues",
          fix: "Apply WCAG fixes",
          confidence: 0.92,
        },
        {
          id: 4,
          type: "readability",
          severity: "low",
          description: "Complex sentences detected",
          fix: "Simplify sentence structure",
          confidence: 0.76,
        },
        {
          id: 5,
          type: "metadata",
          severity: "medium",
          description: "Missing document metadata",
          fix: "Add title, author, keywords",
          confidence: 0.85,
        },
        {
          id: 6,
          type: "security",
          severity: "high",
          description: "Sensitive data detected",
          fix: "Apply redaction or encryption",
          confidence: 0.91,
        },
      ];

      setDetectedIssues(mockIssues);
      setSelectedIssues(mockIssues.map((issue) => issue.id));

      setAnalysisResult({
        documentName: file.name,
        totalIssues: mockIssues.length,
        criticalIssues: mockIssues.filter((i) => i.severity === "high").length,
        estimatedFixTime: "2-5 minutes",
        confidenceScore: 0.89,
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const handleIssueSelection = (issueId) => {
    setSelectedIssues((prev) => {
      if (prev.includes(issueId)) {
        return prev.filter((id) => id !== issueId);
      } else {
        return [...prev, issueId];
      }
    });
  };

  const applyAiFixes = () => {
    if (!uploadedFile || selectedIssues.length === 0) {
      alert("Please upload a document and select issues to fix");
      return;
    }

    if (usageStats.aiCreditsUsed >= usageStats.aiCreditsRemaining) {
      alert("You have no AI credits remaining. Please upgrade your plan.");
      return;
    }

    setIsFixing(true);

    // Simulate AI fixing process
    setTimeout(() => {
      const fixedIssues = detectedIssues.filter((issue) =>
        selectedIssues.includes(issue.id),
      );

      const fixResult = {
        id: Date.now(),
        documentName: uploadedFile.name,
        originalIssues: detectedIssues.length,
        fixedIssues: fixedIssues.length,
        timestamp: new Date().toISOString(),
        fixMode: fixMode,
        priority: fixingPriority,
        successRate: 0.95,
        downloadUrl: "#",
      };

      // Update history
      const newHistory = [fixResult, ...fixHistory.slice(0, 9)];
      setFixHistory(newHistory);
      useLocalStorage.setItem("AI_Fix_History", newHistory);

      // Update usage stats
      setUsageStats((prev) => ({
        ...prev,
        aiCreditsUsed: prev.aiCreditsUsed + 1,
        documentsFixed: prev.documentsFixed + 1,
      }));

      setIsFixing(false);

      // Show success message
      alert(
        `Successfully fixed ${fixedIssues.length} issues in "${uploadedFile.name}"`,
      );
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <Error sx={{ color: "#f44336" }} />;
      case "medium":
        return <Warning sx={{ color: "#ff9800" }} />;
      case "low":
        return <Info sx={{ color: "#4caf50" }} />;
      default:
        return <Info />;
    }
  };

  const FeatureCard = ({ icon, title, description, available = true }) => (
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
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const IssueCard = ({ issue }) => (
    <Card
      sx={{
        mb: 1,
        borderLeft: `4px solid ${getSeverityColor(issue.severity)}`,
      }}
    >
      <CardContent sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton
              size="small"
              onClick={() => handleIssueSelection(issue.id)}
              sx={{ mr: 1 }}
            >
              {selectedIssues.includes(issue.id) ? (
                <CheckCircle sx={{ color: currentPlan.color }} />
              ) : (
                <CheckCircle sx={{ color: "#e0e0e0" }} />
              )}
            </IconButton>
            {getSeverityIcon(issue.severity)}
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
              {issue.description}
            </Typography>
          </Box>
          <Chip
            label={`${Math.round(issue.confidence * 100)}% confidence`}
            size="small"
            sx={{ backgroundColor: currentPlan.color, color: "white" }}
          />
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 6, display: "block" }}
        >
          Suggested fix: {issue.fix}
        </Typography>
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
            backgroundColor: `rgba(${
              userPlanData.planId === "basic"
                ? "117, 117, 117"
                : userPlanData.planId === "standard"
                  ? "33, 150, 243"
                  : "255, 111, 0"
            }, 0.3)`,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                <SmartToy sx={{ mr: 1, verticalAlign: "middle" }} />
                AI-Powered Document Fixes
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
                startIcon={<History />}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Hide Advanced" : "Advanced Options"}
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: currentPlan.color }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Automatically detect and fix document issues using advanced AI
            algorithms. Improve accessibility, compliance, readability, and
            security of your documents.
          </Typography>
        </Paper>

        {/* AI Usage Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <AutoFixHigh sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                AI Credits Used
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.aiCreditsUsed}/{usageStats.aiCreditsRemaining}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Credits reset monthly
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  (usageStats.aiCreditsUsed / usageStats.aiCreditsRemaining) *
                  100
                }
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: currentPlan.color,
                  },
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Documents Fixed
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.documentsFixed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Speed sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Average Fix Time
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                3.2 min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per document
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Document Upload & Analysis */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: currentPlan.color }}
            >
              Document Upload & Analysis
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <input
                  accept=".pdf,.doc,.docx,.txt,.rtf,.html"
                  style={{ display: "none" }}
                  id="document-upload"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={!canUseAiFeatures}
                />
                <label htmlFor="document-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<Upload />}
                    disabled={!canUseAiFeatures}
                    sx={{ backgroundColor: currentPlan.color, mb: 2 }}
                  >
                    Upload Document
                  </Button>
                </label>
                {!canUseAiFeatures && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    AI features are not available in your current plan. Please
                    upgrade.
                  </Alert>
                )}

                {uploadedFile && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="subtitle2">
                      Uploaded: {uploadedFile.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                    <Typography variant="caption" display="block">
                      Type: {fileType}
                    </Typography>
                  </Box>
                )}
              </Box>

              {isAnalyzing && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress sx={{ color: currentPlan.color }} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    AI is analyzing your document...
                  </Typography>
                </Box>
              )}

              {analysisResult && (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "success.light",
                    color: "success.contrastText",
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Analysis Complete
                  </Typography>
                  <Typography variant="body2">
                    Found {analysisResult.totalIssues} issues (
                    {analysisResult.criticalIssues} critical) • Estimated fix
                    time: {analysisResult.estimatedFixTime}• Confidence:{" "}
                    {Math.round(analysisResult.confidenceScore * 100)}%
                  </Typography>
                </Paper>
              )}

              {/* Advanced Options */}
              <Collapse in={showAdvanced}>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Fix Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Fix Priority</InputLabel>
                        <Select
                          value={fixingPriority}
                          label="Fix Priority"
                          onChange={(e) => setFixingPriority(e.target.value)}
                        >
                          <MenuItem value="speed">Speed (Fastest)</MenuItem>
                          <MenuItem value="balanced">Balanced</MenuItem>
                          <MenuItem value="quality">
                            Quality (Most Accurate)
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <ToggleButtonGroup
                          value={fixMode}
                          exclusive
                          onChange={(e, value) => value && setFixMode(value)}
                          size="small"
                          fullWidth
                        >
                          <ToggleButton value="automatic" sx={{ py: 0.5 }}>
                            <AutoAwesome sx={{ mr: 1, fontSize: 16 }} />
                            Automatic
                          </ToggleButton>
                          <ToggleButton
                            value="manual"
                            sx={{ py: 0.5 }}
                            disabled={!canUseAdvancedAi}
                          >
                            <Psychology sx={{ mr: 1, fontSize: 16 }} />
                            Manual Review
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Paper>
          </Grid>

          {/* Detected Issues */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: currentPlan.color }}
            >
              Detected Issues
            </Typography>
            <Paper
              elevation={2}
              sx={{ p: 3, maxHeight: 400, overflow: "auto" }}
            >
              {detectedIssues.length > 0 ? (
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="subtitle2">
                      Select issues to fix ({selectedIssues.length}/
                      {detectedIssues.length} selected)
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setSelectedIssues(detectedIssues.map((i) => i.id))
                      }
                    >
                      <CheckCircle />
                    </IconButton>
                  </Box>
                  {detectedIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={
                      isFixing ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AutoFixHigh />
                      )
                    }
                    onClick={applyAiFixes}
                    disabled={
                      isFixing ||
                      selectedIssues.length === 0 ||
                      !canUseAiFeatures
                    }
                    sx={{ mt: 2, backgroundColor: currentPlan.color }}
                  >
                    {isFixing
                      ? "Applying AI Fixes..."
                      : `Apply AI Fixes (${selectedIssues.length} issues)`}
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <AutoFixHigh
                    sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Upload a document to detect issues
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    Supports PDF, DOC, DOCX, TXT, RTF, HTML
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* AI Features */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: currentPlan.color, mt: 2 }}
            >
              AI-Powered Capabilities
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Security sx={{ color: currentPlan.color }} />}
                  title="Accessibility Fixes"
                  description="Automatically fix WCAG compliance issues, add alt text, improve navigation"
                  available={canUseAiFeatures}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Description sx={{ color: currentPlan.color }} />}
                  title="Document Structure"
                  description="Fix heading hierarchy, table structures, list formatting, and document flow"
                  available={canUseAiFeatures}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<AutoFixHigh sx={{ color: currentPlan.color }} />}
                  title="Content Optimization"
                  description="Improve readability, fix grammar, simplify complex sentences, enhance clarity"
                  available={canUseAdvancedAi}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<SmartToy sx={{ color: currentPlan.color }} />}
                  title="Smart Redaction"
                  description="Automatically detect and redact sensitive information (PII, financial data)"
                  available={canUseAdvancedAi}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Fix History */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: currentPlan.color, mt: 2 }}
            >
              Recent Fix History
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
              {fixHistory.length > 0 ? (
                <List>
                  {fixHistory.map((fix) => (
                    <ListItem
                      key={fix.id}
                      divider
                      secondaryAction={
                        <Button
                          size="small"
                          startIcon={<Download />}
                          sx={{ color: currentPlan.color }}
                        >
                          Download
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <CheckCircle sx={{ color: currentPlan.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={fix.documentName}
                        secondary={`Fixed ${fix.fixedIssues}/${fix.originalIssues} issues • ${new Date(fix.timestamp).toLocaleDateString()} • ${fix.successRate * 100}% success`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <History sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No fix history yet
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    Fix your first document to see history here
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Plan Comparison */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: currentPlan.color, mt: 2 }}
            >
              AI Features by Plan
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {Object.entries(planDetails).map(([planId, plan]) => (
                  <Grid item xs={12} md={4} key={planId}>
                    <Card
                      sx={{
                        border:
                          userPlanData.planId === planId
                            ? `2px solid ${plan.color}`
                            : "1px solid #e0e0e0",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      {userPlanData.planId === planId && (
                        <Chip
                          label="Current Plan"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: 10,
                            backgroundColor: plan.color,
                            color: "white",
                          }}
                        />
                      )}
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: plan.color }}
                        >
                          {plan.name}
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          {planId === "basic"
                            ? "Free"
                            : `$${planId === "standard" ? "9.99" : "19.99"}/mo`}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          AI Credits: {plan.aiCredits}/month
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Max File Size: {plan.fileSizeLimit}MB
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Includes:
                        </Typography>
                        {plan.supports.map((feature, index) => (
                          <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Star
                              sx={{ fontSize: 16, color: plan.color, mr: 1 }}
                            />
                            <Typography variant="caption">{feature}</Typography>
                          </Box>
                        ))}
                        {userPlanData.planId !== planId && (
                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                              mt: 2,
                              borderColor: plan.color,
                              color: plan.color,
                            }}
                            onClick={() => (window.location.href = "/features")}
                          >
                            {planId === "basic" ? "Start Free" : "Upgrade"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{ backgroundColor: currentPlan.color }}
              onClick={() => document.getElementById("document-upload").click()}
              disabled={!canUseAiFeatures}
            >
              Upload & Analyze
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/ai/tagging")}
            >
              Smart Tagging
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/ai/analysis")}
            >
              Content Analysis
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/ai/compliance")}
            >
              Compliance Check
            </Button>
          </Box>
          {!canUseAiFeatures && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to access AI-powered document fixes.
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default AiPoweredFixes;
