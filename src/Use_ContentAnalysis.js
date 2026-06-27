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
  Tabs,
  Tab,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Description,
  AutoFixHigh,
  Search,
  Download,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  BarChart,
  PieChart,
  TableChart,
  FilterList,
  Timeline,
  Analytics,
  SmartToy,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const ContentAnalysis = () => {
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

  const [activeTab, setActiveTab] = useState(0);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [analysisType, setAnalysisType] = useState("comprehensive");

  // Check permissions for features
  const canUseAdvancedAI = hasPermission("ai_analysis");
  const canExportReports = hasPermission("export_reports");

  // Fetch user data from localStorage or API
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

    // Simulate fetching analysis results
    setLoading(true);
    setTimeout(() => {
      setAnalysisResults([
        {
          id: 1,
          documentName: "Project_Requirements_v2.pdf",
          analysisDate: "2024-01-15",
          complianceScore: 92,
          accessibilityScore: 85,
          aiConfidence: 89,
          issues: 3,
          status: "compliant",
        },
        {
          id: 2,
          documentName: "User_Manual.docx",
          analysisDate: "2024-01-14",
          complianceScore: 78,
          accessibilityScore: 65,
          aiConfidence: 76,
          issues: 8,
          status: "needs_attention",
        },
        {
          id: 3,
          documentName: "Technical_Specifications.pdf",
          analysisDate: "2024-01-13",
          complianceScore: 45,
          accessibilityScore: 52,
          aiConfidence: 91,
          issues: 15,
          status: "non_compliant",
        },
        {
          id: 4,
          documentName: "Meeting_Minutes.docx",
          analysisDate: "2024-01-12",
          complianceScore: 95,
          accessibilityScore: 88,
          aiConfidence: 94,
          issues: 1,
          status: "compliant",
        },
        {
          id: 5,
          documentName: "API_Documentation.pdf",
          analysisDate: "2024-01-11",
          complianceScore: 82,
          accessibilityScore: 79,
          aiConfidence: 87,
          issues: 5,
          status: "compliant",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const analysisTypes = [
    { value: "comprehensive", label: "Comprehensive Analysis" },
    { value: "accessibility", label: "Accessibility Check" },
    { value: "compliance", label: "Regulatory Compliance" },
    { value: "content_quality", label: "Content Quality" },
    { value: "seo", label: "SEO Optimization" },
  ];

  const documents = [
    "Project_Requirements_v2.pdf",
    "User_Manual.docx",
    "Technical_Specifications.pdf",
    "Meeting_Minutes.docx",
    "API_Documentation.pdf",
    "Design_Guidelines.pdf",
    "Training_Material.docx",
  ];

  const handleAnalyze = () => {
    if (!selectedDocument) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Analysis started for: ${selectedDocument}`);
      // In real app, you would update analysisResults here
    }, 1500);
  };

  const handleExportReport = (id) => {
    // In real app, this would trigger a report download
    alert(`Exporting report for analysis ID: ${id}`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "compliant":
        return <Chip icon={<CheckCircle />} label="Compliant" color="success" size="small" />;
      case "needs_attention":
        return <Chip icon={<Warning />} label="Needs Attention" color="warning" size="small" />;
      case "non_compliant":
        return <Chip icon={<Error />} label="Non-Compliant" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#4caf50";
    if (score >= 70) return "#ff9800";
    return "#f44336";
  };

  const AnalysisCard = ({ icon, title, value, unit = "", description }) => (
    <Card className="feature-card">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: `${userPlanData.planId === "basic" ? "#757575" :
                    userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
            mb: 1,
          }}
        >
          {value}{unit}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const UsageMeter = ({ label, value, max = 100, unit = "%" }) => (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {value}/{max} {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(value / max) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: getScoreColor(value),
          },
        }}
      />
    </Box>
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
            backgroundColor: `${userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)"}`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                AI Content Analysis
              </Typography>
              <Chip
                label={userPlanData.planId === "basic" ? "Begin Plan" :
                       userPlanData.planId === "standard" ? "Standard Plan" : "Premium Plan"}
                sx={{
                  backgroundColor: `${userPlanData.planId === "basic" ? "#757575" :
                                   userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  AI-powered document analysis for {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<AutoFixHigh />}
                onClick={() => (window.location.href = "/ai/remediation")}
              >
                AI Remediation
              </Button>
              {!canUseAdvancedAI && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: `${userPlanData.planId === "basic" ? "#757575" :
                                     userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                  }}
                  onClick={() => (window.location.href = "/features")}
                >
                  Upgrade for AI
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              },
              "& .Mui-selected": {
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"} !important`,
              },
            }}
          >
            <Tab icon={<Search />} label="New Analysis" />
            <Tab icon={<BarChart />} label="Analysis Results" />
            <Tab icon={<Analytics />} label="Analytics Dashboard" />
            <Tab icon={<Timeline />} label="Trend Analysis" />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <>
            {/* New Analysis Form */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: `${userPlanData.planId === "basic" ? "#757575" :
                         userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                }}
              >
                Start New Analysis
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Select Document"
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    {documents.map((doc) => (
                      <MenuItem key={doc} value={doc}>
                        {doc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Analysis Type"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    {analysisTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Box display="flex" gap={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SmartToy />}
                  onClick={handleAnalyze}
                  disabled={!selectedDocument || loading || !canUseAdvancedAI}
                  sx={{
                    backgroundColor: `${userPlanData.planId === "basic" ? "#757575" :
                                     userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                  }}
                >
                  {loading ? "Analyzing..." : "Start AI Analysis"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    setSelectedDocument("");
                    setAnalysisType("comprehensive");
                  }}
                >
                  Reset
                </Button>
              </Box>

              {!canUseAdvancedAI && (
                <Typography variant="caption" color="error" sx={{ mt: 2, display: "block" }}>
                  Advanced AI analysis requires Premium plan. Upgrade to use this feature.
                </Typography>
              )}
            </Paper>

            {/* Analysis Features */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              }}
            >
              Analysis Capabilities
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  icon={<SmartToy sx={{ color: `${userPlanData.planId === "basic" ? "#757575" :
                                                userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }} />}
                  title="AI Confidence"
                  value="94"
                  unit="%"
                  description="AI model accuracy for document analysis"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  icon={<CheckCircle sx={{ color: `${userPlanData.planId === "basic" ? "#757575" :
                                                   userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }} />}
                  title="Avg. Compliance"
                  value="87"
                  unit="%"
                  description="Average compliance score across documents"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  icon={<Warning sx={{ color: `${userPlanData.planId === "basic" ? "#757575" :
                                               userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }} />}
                  title="Issues Found"
                  value="32"
                  description="Total issues identified in last 30 days"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  icon={<Description sx={{ color: `${userPlanData.planId === "basic" ? "#757575" :
                                                   userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}` }} />}
                  title="Documents Analyzed"
                  value="156"
                  description="Total documents processed this month"
                />
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            {/* Analysis Results Table */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    color: `${userPlanData.planId === "basic" ? "#757575" :
                           userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                  }}
                >
                  Recent Analysis Results
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    size="small"
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    size="small"
                    onClick={() => setLoading(true)}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Name</TableCell>
                        <TableCell align="center">Analysis Date</TableCell>
                        <TableCell align="center">Compliance Score</TableCell>
                        <TableCell align="center">Accessibility Score</TableCell>
                        <TableCell align="center">AI Confidence</TableCell>
                        <TableCell align="center">Issues</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysisResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Description sx={{ mr: 1, color: "text.secondary" }} />
                              {result.documentName}
                            </Box>
                          </TableCell>
                          <TableCell align="center">{result.analysisDate}</TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <CircularProgress
                                variant="determinate"
                                value={result.complianceScore}
                                size={40}
                                thickness={4}
                                sx={{ color: getScoreColor(result.complianceScore), mr: 1 }}
                              />
                              <Typography variant="body2">{result.complianceScore}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <CircularProgress
                                variant="determinate"
                                value={result.accessibilityScore}
                                size={40}
                                thickness={4}
                                sx={{ color: getScoreColor(result.accessibilityScore), mr: 1 }}
                              />
                              <Typography variant="body2">{result.accessibilityScore}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">{result.aiConfidence}%</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={result.issues}
                              size="small"
                              color={result.issues > 10 ? "error" : result.issues > 5 ? "warning" : "success"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {getStatusChip(result.status)}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1} justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => handleExportReport(result.id)}
                                disabled={!canExportReports}
                              >
                                <Download />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => alert(`Viewing details for ${result.documentName}`)}
                              >
                                <Search />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Score Distribution */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: `${userPlanData.planId === "basic" ? "#757575" :
                         userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                }}
              >
                Score Distribution
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <UsageMeter
                    label="Overall Compliance"
                    value={85}
                    max={100}
                  />
                  <UsageMeter
                    label="Accessibility Score"
                    value={78}
                    max={100}
                  />
                  <UsageMeter
                    label="Content Quality"
                    value={92}
                    max={100}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    AI Content Analysis provides comprehensive evaluation of your documents including:
                  </Typography>
                  <ul style={{ marginLeft: '16px', color: 'text.secondary' }}>
                    <li><Typography variant="body2">Regulatory compliance checks</Typography></li>
                    <li><Typography variant="body2">Accessibility standards (WCAG, ADA)</Typography></li>
                    <li><Typography variant="body2">Content quality and readability</Typography></li>
                    <li><Typography variant="body2">SEO optimization suggestions</Typography></li>
                    <li><Typography variant="body2">Automated issue detection</Typography></li>
                  </ul>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: `${userPlanData.planId === "basic" ? "#757575" :
                     userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                backgroundColor: `${userPlanData.planId === "basic" ? "#757575" :
                                 userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              }}
              onClick={() => setActiveTab(0)}
            >
              New Analysis
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${userPlanData.planId === "basic" ? "#757575" :
                             userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              }}
              onClick={() => (window.location.href = "/ai/remediation")}
            >
              AI Remediation
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${userPlanData.planId === "basic" ? "#757575" :
                             userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              }}
              disabled={!canExportReports}
              onClick={() => alert("Exporting all reports...")}
            >
              Export All Reports
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${userPlanData.planId === "basic" ? "#757575" :
                             userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
                color: `${userPlanData.planId === "basic" ? "#757575" :
                       userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
              }}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          {/* Upgrade hint if user doesn't have permission for advanced features */}
          {(!canUseAdvancedAI || !canExportReports) && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium for advanced AI analysis and report export features.
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ContentAnalysis;