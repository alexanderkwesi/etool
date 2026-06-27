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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  Description,
  Download,
  CalendarToday,
  FilterList,
  Refresh,
  Share,
  Print,
  Visibility,
  Storage,
  SwapHoriz,
  Group,
  Timeline,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const AnalyticsPage = () => {
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

  const [timeRange, setTimeRange] = useState("month");
  const [reportType, setReportType] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {},
    charts: {},
    tables: {},
  });

  // Check permissions for features
  const canExportReports = hasPermission("export_reports");
  const canViewAdvancedAnalytics = hasPermission("advanced_analytics");

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

    // Load analytics data
    loadAnalyticsData();
  }, [timeRange, reportType]);

  const loadAnalyticsData = () => {
    // Mock analytics data - in real app, this would come from API
    const mockMetrics = {
      totalFiles: 42,
      totalStorage: 1843,
      totalConversions: 28,
      activeUsers: userPlanData.planId === "premium" ? 15 : 1,
      avgFileSize: 24.5,
      conversionRate: 92.3,
      storageGrowth: 12.5,
      fileGrowth: 8.2,
    };

    // Mock chart data
    const mockChartData = {
      monthlyUsage: [
        { month: "Jan", files: 12, storage: 420, conversions: 8 },
        { month: "Feb", files: 18, storage: 560, conversions: 12 },
        { month: "Mar", files: 15, storage: 490, conversions: 10 },
        { month: "Apr", files: 22, storage: 620, conversions: 15 },
        { month: "May", files: 25, storage: 710, conversions: 18 },
        { month: "Jun", files: 28, storage: 820, conversions: 21 },
      ],
      fileTypes: [
        { name: "CAD", value: 35, color: "#0088FE" },
        { name: "STEP", value: 25, color: "#00C49F" },
        { name: "DWP", value: 20, color: "#FFBB28" },
        { name: "PDF", value: 15, color: "#FF8042" },
        { name: "Other", value: 5, color: "#8884D8" },
      ],
      conversionSuccess: [
        { name: "Successful", value: 92, color: "#4CAF50" },
        { name: "Failed", value: 5, color: "#F44336" },
        { name: "Partial", value: 3, color: "#FF9800" },
      ],
    };

    // Mock table data
    const mockTableData = [
      { id: 1, fileName: "Project_Design.dwg", type: "CAD", size: "24.5MB", conversions: 3, lastAccessed: "2024-01-15" },
      { id: 2, fileName: "Mechanical_Part.step", type: "STEP", size: "18.2MB", conversions: 2, lastAccessed: "2024-01-14" },
      { id: 3, fileName: "Assembly_Model.dwp", type: "DWP", size: "32.1MB", conversions: 1, lastAccessed: "2024-01-12" },
      { id: 4, fileName: "Technical_Specs.pdf", type: "PDF", size: "8.7MB", conversions: 0, lastAccessed: "2024-01-10" },
      { id: 5, fileName: "Electrical_Diagram.dwg", type: "CAD", size: "15.3MB", conversions: 2, lastAccessed: "2024-01-08" },
    ];

    setAnalyticsData({
      metrics: mockMetrics,
      charts: mockChartData,
      tables: { files: mockTableData },
    });
  };

  const MetricCard = ({ icon, title, value, change, subtitle, unit = "" }) => (
    <Card sx={{ textAlign: "center", p: 2, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
          color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {value}{unit}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      {change !== undefined && (
        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
          {change >= 0 ? (
            <TrendingUp sx={{ color: "#4CAF50", fontSize: 16, mr: 0.5 }} />
          ) : (
            <TrendingDown sx={{ color: "#F44336", fontSize: 16, mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: change >= 0 ? "#4CAF50" : "#F44336",
              fontWeight: "medium",
            }}
          >
            {change >= 0 ? "+" : ""}{change}%
          </Typography>
        </Box>
      )}
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Card>
  );

  const ChartCard = ({ title, children, action }) => (
    <Card sx={{ p: 2, height: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          sx={{
            color: `${userPlanData.planId === "basic" ? "#757575" : userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00"}`,
          }}
        >
          {title}
        </Typography>
        {action && (
          <IconButton size="small" onClick={action}>
            {action}
          </IconButton>
        )}
      </Box>
      <Box sx={{ height: 300 }}>
        {children}
      </Box>
    </Card>
  );

  const getPlanColor = () => {
    return userPlanData.planId === "basic"
      ? "#757575"
      : userPlanData.planId === "standard"
        ? "#2196f3"
        : "#ff6f00";
  };

  const handleExportReport = () => {
    if (canExportReports) {
      alert("Exporting report...");
      // In real app, this would trigger report generation
    } else {
      alert("Upgrade to Premium to export reports");
    }
  };

  const handleRefreshData = () => {
    loadAnalyticsData();
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
            backgroundColor: `${userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(255, 111, 0, 0.3)"
              }`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Analytics & Reports
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
                  backgroundColor: getPlanColor(),
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {/* Show user email if authenticated */}
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Analytics for {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="usage">Usage Analytics</MenuItem>
                  <MenuItem value="storage">Storage Analysis</MenuItem>
                  {userPlanData.planId !== "basic" && (
                    <MenuItem value="performance">Performance</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefreshData}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportReport}
                disabled={!canExportReports}
                sx={{
                  backgroundColor: getPlanColor(),
                }}
              >
                Export Report
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Search and Filter Bar */}
        <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search analytics..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={() => setTimeRange("month")}
                >
                  Custom Date Range
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => alert("Share report")}
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Key Metrics */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: getPlanColor(),
            mb: 3,
          }}
        >
          Key Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<Description sx={{ fontSize: 40 }} />}
              title="Total Files"
              value={analyticsData.metrics.totalFiles || 0}
              change={analyticsData.metrics.fileGrowth}
              subtitle="All processed files"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<Storage sx={{ fontSize: 40 }} />}
              title="Storage Used"
              value={analyticsData.metrics.totalStorage || 0}
              unit="MB"
              change={analyticsData.metrics.storageGrowth}
              subtitle={`of ${userPlanData.planId === "basic" ? "1024" : userPlanData.planId === "standard" ? "2560" : "5120"} MB`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<SwapHoriz sx={{ fontSize: 40 }} />}
              title="Conversions"
              value={analyticsData.metrics.totalConversions || 0}
              change={8.5}
              subtitle="Successful conversions"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<Group sx={{ fontSize: 40 }} />}
              title="Active Users"
              value={analyticsData.metrics.activeUsers || 0}
              change={userPlanData.planId === "premium" ? 15 : 0}
              subtitle={userPlanData.planId === "basic" ? "Single user" : "Team members"}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <ChartCard title="Monthly Usage Trends" action={<BarChartIcon />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.charts.monthlyUsage || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="files" fill="#8884d8" name="Files Processed" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                  <Bar dataKey="storage" fill="#ffc658" name="Storage (MB)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="File Type Distribution" action={<PieChartIcon />}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.charts.fileTypes || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(analyticsData.charts.fileTypes || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Additional Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <ChartCard title="Conversion Success Rate" action={<TrendingUp />}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.charts.conversionSuccess || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(analyticsData.charts.conversionSuccess || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard title="Performance Trends" action={<Timeline />}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.charts.monthlyUsage || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="files"
                    stroke="#8884d8"
                    name="Files Processed"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#82ca9d"
                    name="Conversions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* File Analytics Table */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h6"
              sx={{
                color: getPlanColor(),
              }}
            >
              File Analytics
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => alert("View all files")}
            >
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Conversions</TableCell>
                  <TableCell>Last Accessed</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(analyticsData.tables.files || []).map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Typography variant="body2">{file.fileName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={file.type}
                        size="small"
                        sx={{
                          backgroundColor: getPlanColor(),
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2">{file.conversions}</Typography>
                        {file.conversions > 0 && (
                          <TrendingUp sx={{ color: "#4CAF50", fontSize: 16, ml: 1 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{file.lastAccessed}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => alert(`View details for ${file.fileName}`)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Storage Analysis */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: getPlanColor(),
            }}
          >
            Storage Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">Total Storage Used</Typography>
                  <Typography variant="body2">
                    {analyticsData.metrics.totalStorage || 0}/
                    {userPlanData.planId === "basic" ? "1024" : userPlanData.planId === "standard" ? "2560" : "5120"} MB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(analyticsData.metrics.totalStorage || 0) /
                    (userPlanData.planId === "basic" ? 1024 : userPlanData.planId === "standard" ? 2560 : 5120) * 100}
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
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Storage distribution by file type:
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {analyticsData.charts.fileTypes?.map((type, index) => (
                    <Grid item xs={6} key={index}>
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: type.color,
                            mr: 1,
                            borderRadius: 1,
                          }}
                        />
                        <Typography variant="caption">{type.name}: {type.value}%</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Storage Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {analyticsData.metrics.totalStorage > 800
                    ? "Consider cleaning up old files or upgrading your storage plan."
                    : "Your storage usage is within optimal range."}
                </Typography>
                {analyticsData.metrics.totalStorage > 800 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => (window.location.href = "/storage")}
                    sx={{
                      borderColor: getPlanColor(),
                      color: getPlanColor(),
                    }}
                  >
                    Manage Storage
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: getPlanColor(),
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                backgroundColor: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={handleExportReport}
              disabled={!canExportReports}
            >
              Generate Custom Report
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/convert")}
            >
              View Conversion Logs
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: getPlanColor(),
                color: getPlanColor(),
              }}
              onClick={() => (window.location.href = "/team/analytics")}
              disabled={!canViewAdvancedAnalytics}
            >
              Team Analytics
            </Button>
          </Box>
          {/* Show upgrade hint if user doesn't have permission for a feature */}
          {!canExportReports && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium to export detailed reports and access advanced analytics.
            </Typography>
          )}
        </Paper>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Analytics sx={{ fontSize: 40, color: getPlanColor(), mb: 1 }} />
              <Typography variant="h6">Data Accuracy</Typography>
              <Typography variant="h4" sx={{ color: getPlanColor() }}>
                99.8%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on last 30 days
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Timeline sx={{ fontSize: 40, color: getPlanColor(), mb: 1 }} />
              <Typography variant="h6">Uptime</Typography>
              <Typography variant="h4" sx={{ color: getPlanColor() }}>
                99.9%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Service reliability
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign:"center" }}>
              <TrendingUp sx={{ fontSize: 40, color: getPlanColor(), mb: 1 }} />
              <Typography variant="h6">Growth Rate</Typography>
              <Typography variant="h4" sx={{ color: getPlanColor() }}>
                +{analyticsData.metrics.fileGrowth || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly file processing growth
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AnalyticsPage;

