import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Alert,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Storage,
  Description,
  Security,
  Group,
  Download,
  Compare,
  Visibility,
  SwapHoriz,
  History,
  AccountCircle,
  Payment,
  Help,
  SupportAgent,
  Announcement,
  Update,
  Email,
  Phone,
  Chat,
  Info,
  Warning,
  Refresh,
  Delete,
} from "@mui/icons-material";

import { useSecurity } from "./Use_Security";
import LogoutDialog from "./Use_LogOutDialog";
import { STORAGE_KEYS } from "./hooks/Use_Storekey";
// FIX: Import both the hook and the static utils
import { useLocalStorage, localStorageUtils } from "./hooks/Use_LocalStorage";
import "./Use_App.css";
import useLoginWindowLocalStorage from "../src/Login_Window_LocalStorage";

const API = "http://127.0.0.1:5000/api";
const POLL_INTERVAL = 100_000; // 100 seconds

// ── shared fetch helper ───────────────────────────────────────────────────────
const apiFetch = (path) =>
  fetch(`${API}${path}`, { credentials: "include" }).then((r) => r.json());

// ── plan config ───────────────────────────────────────────────────────────────
const planDetails = {
  basic: {
    name: "Begin Plan",
    fileLimit: 5,
    fileSizeLimit: 10,
    storage: 1024,
    color: "#757575",
  },
  standard: {
    name: "Standard Plan",
    fileLimit: 10,
    fileSizeLimit: 20,
    storage: 2560,
    color: "#2196f3",
  },
  premium: {
    name: "Premium Plan",
    fileLimit: 50,
    fileSizeLimit: 50,
    storage: 5120,
    color: "#ff6f00",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isAuthenticated, user, logout, hasPermission } = useSecurity();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // localStorage (set during login)
  const [storedPlanId] = useLoginWindowLocalStorage("userPlanId", "");
  const [storedEmail] = useLoginWindowLocalStorage("userEmail", "");
  const [storedUserData] = useLoginWindowLocalStorage("userData", {});

  // plan + stats state
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  const [userPlan, setUserPlan] = useState("basic");
  const [usageStats, setUsageStats] = useState({
    filesUsed: 0,
    storageUsed: 0,
    conversionsThisMonth: 0,
    fileLimit: 5,
    storageLimit: 1024,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [permissions, setPermissions] = useState({
    team_access: false,
    admin_features: false,
  });

  const canUseTeamFeatures =
    hasPermission("team_access") || permissions.team_access;
  const canUseAdminFeatures =
    hasPermission("admin_features") || permissions.admin_features;

  const currentPlan = planDetails[userPlan] || planDetails.basic;

  const [announcements] = useState([
    {
      id: 1,
      title: "New File Format Support",
      message: "We now support DWFX format conversions",
      date: "2024-01-15",
      type: "info",
    },
    {
      id: 2,
      title: "Scheduled Maintenance",
      message: "System maintenance scheduled for next weekend",
      date: "2024-01-20",
      type: "warning",
    },
  ]);

  // ── redirect if not logged in ─────────────────────────────────────────────
  useEffect(() => {
    if (!storedEmail) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [storedEmail]);

  // ── fetch stats + activity from server ────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        apiFetch("/dashboard/stats"),
        apiFetch("/dashboard/activity?limit=10"),
      ]);

      if (statsRes.status === 200) {
        const { stats, plan, permissions: perms } = statsRes;

        setUsageStats({
          filesUsed: stats.filesUsed ?? 0,
          storageUsed: stats.storageUsed ?? 0,
          conversionsThisMonth: stats.conversionsThisMonth ?? 0,
          fileLimit: stats.fileLimit ?? 5,
          storageLimit: stats.storageLimit ?? 1024,
        });

        if (plan) {
          const planKey = plan.planId || plan.key || "basic";
          setUserPlan(planKey);
          setUserPlanData({
            planId: planKey,
            planName: plan.planName || plan.name || "Begin Plan",
            monthlyPrice: plan.monthlyPrice ?? 0,
            annualPrice: plan.annualPrice ?? 0,
            billingCycle: plan.billingCycle || "monthly",
          });
        }

        if (perms) setPermissions(perms);
        setShowMessage(stats.filesUsed > 0);
        setLastUpdated(new Date());
      }

      if (activityRes.status === 200) {
        setRecentActivity(activityRes.activity || []);
      }
    } catch (err) {
      console.warn("Stats fetch failed:", err);
    }
  }, []);

  // ── initial fetch + 100s polling ─────────────────────────────────────────
  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchStats]);

  // ── also read localStorage plan data as fallback ──────────────────────────
  useEffect(() => {
    // FIX: Use localStorageUtils.getItem instead of useLocalStorage.getItem
    const stored = localStorageUtils.getItem("User_Plan_Data");
    if (stored && stored.planId) {
      setUserPlan(stored.planId);
      setUserPlanData(stored);
    }
  }, []);

  // ── sub-components ────────────────────────────────────────────────────────
  const FeatureCard = ({
    icon,
    title,
    description,
    available = true,
    limit,
  }) => (
    <Card className="feature-card" sx={{ opacity: available ? 1 : 0.6 }}>
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
        {limit && (
          <Chip
            label={limit}
            size="small"
            sx={{ mt: 1, backgroundColor: currentPlan.color, color: "white" }}
          />
        )}
      </CardContent>
    </Card>
  );

  const UsageMeter = ({ label, used, total, unit = "MB" }) => (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {used}/{total} {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={total > 0 ? Math.min((used / total) * 100, 100) : 0}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": { backgroundColor: currentPlan.color },
        }}
      />
      {used >= total * 0.8 && used > 0 && (
        <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
          <Typography variant="caption">
            Approaching {label.toLowerCase()} limit
          </Typography>
        </Alert>
      )}
    </Box>
  );

  const SupportDialog = () => (
    <Dialog
      open={showSupportDialog}
      onClose={() => setShowSupportDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <SupportAgent sx={{ mr: 1, color: currentPlan.color }} />
          Support Options
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: currentPlan.color }}
            >
              Contact Support
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary="support@docrevisor.com"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary="+44 (800) 123-REVISE"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Chat color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Live Chat"
                  secondary="Available 9AM-6PM EST"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: currentPlan.color }}
            >
              Resources
            </Typography>
            <List>
              <ListItem button onClick={() => window.open("/faq", "_blank")}>
                <ListItemIcon>
                  <Help color="primary" />
                </ListItemIcon>
                <ListItemText primary="FAQ & Knowledge Base" />
              </ListItem>
              <ListItem
                button
                onClick={() => window.open("/documentation/1", "_blank")}
              >
                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>
                <ListItemText primary="Documentation" />
              </ListItem>
              <ListItem
                button
                onClick={() => window.open("/tutorials", "_blank")}
              >
                <ListItemIcon>
                  <Visibility color="primary" />
                </ListItemIcon>
                <ListItemText primary="Video Tutorials" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSupportDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Announcements */}
        {announcements.length > 0 && (
          <Paper
            elevation={1}
            sx={{ mb: 3, p: 2, backgroundColor: (t) => t.palette.grey[100] }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Announcement color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Announcements</Typography>
            </Box>
            <List dense>
              {announcements.map((a) => (
                <ListItem key={a.id}>
                  <ListItemIcon>
                    {a.type === "warning" ? (
                      <Warning color="warning" />
                    ) : (
                      <Info color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={a.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {a.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          Posted: {a.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor:
              userPlanData.planId === "basic"
                ? "rgba(117,117,117,0.3)"
                : userPlanData.planId === "standard"
                  ? "rgba(33,150,243,0.3)"
                  : "rgba(255,111,0,0.3)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Engineering File Management Tool
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
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Welcome, {user.email || storedEmail}
                </Typography>
              )}
              {lastUpdated && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  Stats updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchStats}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<Help />}
                onClick={() => setShowSupportDialog(true)}
              >
                Support
              </Button>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => (window.location.href = "/security")}
              >
                Security
              </Button>
              {isAuthenticated && (
                <Button
                  onClick={() => setShowLogoutDialog(true)}
                  color="inherit"
                >
                  Logout
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Welcome (new user) */}
        {usageStats.filesUsed === 0 && showMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to DocRevisor!
            </Typography>
            <Typography variant="body2">
              Get started by converting your first engineering file.{" "}
              <Link href="/tutorials" underline="hover">
                Getting started guide
              </Link>{" "}
              or{" "}
              <Link
                href="#"
                onClick={() => setShowSupportDialog(true)}
                underline="hover"
              >
                contact support
              </Link>
              .
            </Typography>
          </Alert>
        )}

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Files Processed
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.filesUsed}/
                {usageStats.fileLimit || currentPlan.fileLimit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
              {usageStats.filesUsed >=
                (usageStats.fileLimit || currentPlan.fileLimit) * 0.8 &&
                usageStats.filesUsed > 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Approaching file limit
                  </Alert>
                )}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Storage sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Storage Used
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.storageUsed}MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {usageStats.storageLimit || currentPlan.storage}MB
              </Typography>
              {usageStats.storageUsed >=
                (usageStats.storageLimit || currentPlan.storage) * 0.8 &&
                usageStats.storageUsed > 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Storage almost full
                  </Alert>
                )}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SwapHoriz sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Conversions
              </Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.conversionsThisMonth}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* ── Recent Activity ──────────────────────────────────────────────── */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" sx={{ color: currentPlan.color }}>
              Recent Activity
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                Auto-refreshes every 100s
              </Typography>
            )}
          </Box>
          {recentActivity.length > 0 ? (
            <List dense>
              {recentActivity.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    {item.action === "converted" ? (
                      <SwapHoriz color="success" />
                    ) : item.action === "downloaded" ? (
                      <Download color="primary" />
                    ) : item.action === "deleted" ? (
                      <Delete color="error" />
                    ) : (
                      <Description sx={{ color: currentPlan.color }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.description}
                    secondary={
                      <Box
                        display="flex"
                        gap={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        {item.original_format && (
                          <Chip
                            label={item.original_format.toUpperCase()}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {item.target_format && (
                          <>
                            <SwapHoriz fontSize="small" />
                            <Chip
                              label={item.target_format.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: currentPlan.color,
                                color: "white",
                              }}
                            />
                          </>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleString()
                            : ""}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : showMessage ? (
            <Typography variant="body2" color="text.secondary">
              Your recent file conversions and activities will appear here.
            </Typography>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                No recent activity.{" "}
                <Link href="/convert" underline="hover">
                  Convert your first file
                </Link>{" "}
                to get started!
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* ── Storage Usage Details ─────────────────────────────────────────── */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            Storage Usage Details
          </Typography>
          <UsageMeter
            label="Total Storage"
            used={usageStats.storageUsed}
            total={usageStats.storageLimit || currentPlan.storage}
          />
          <UsageMeter
            label="File Conversions"
            used={usageStats.conversionsThisMonth}
            total={usageStats.fileLimit || currentPlan.fileLimit}
            unit="files"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your storage resets at the beginning of each billing cycle.
          </Typography>
        </Paper>

        {/* ── Support & Resources ───────────────────────────────────────────── */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            Support & Resources
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Need Help?
              </Typography>
              <List>
                <ListItem button onClick={() => window.open("/faq", "_blank")}>
                  <ListItemIcon>
                    <Help color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="FAQ & Knowledge Base"
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={() => window.open("/documentation/1", "_blank")}
                >
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="User Documentation"
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={() => window.open("/tutorials", "_blank")}
                >
                  <ListItemIcon>
                    <Visibility color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="Video Tutorials"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Get Support
              </Typography>
              <List>
                <ListItem button onClick={() => setShowSupportDialog(true)}>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="Email Support"
                    secondary="support@docrevisor.com"
                  />
                </ListItem>
                <ListItem button onClick={() => setShowSupportDialog(true)}>
                  <ListItemIcon>
                    <Chat color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="Live Chat +44 (800) 123-REVISE"
                    secondary="Available 9AM-6PM EST"
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={() => window.open("/community", "_blank")}
                >
                  <ListItemIcon>
                    <Group color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary="Community Forum"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
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
              onClick={() => (window.location.href = "/convert")}
            >
              Convert File
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              onClick={() => (window.location.href = "/view")}
            >
              View Files
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              disabled={!canUseAdminFeatures}
              onClick={() => (window.location.href = "/compare")}
            >
              Compare Files
            </Button>
            {canUseTeamFeatures && (
              <Button
                variant="outlined"
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => (window.location.href = "/team/members")}
              >
                Team Settings
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => setShowSupportDialog(true)}
            >
              Get Help
            </Button>
          </Box>
          {!canUseAdminFeatures && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium for advanced features like file comparison.
            </Typography>
          )}
        </Paper>

        <SupportDialog />

        {/* Logout Dialog — only mount when security context is ready */}
        {isAuthenticated && (
          <LogoutDialog
            open={showLogoutDialog}
            onClose={() => setShowLogoutDialog(false)}
            onConfirm={logout}
          />
        )}
      </Container>
    </div>
  );
};

export default Dashboard;