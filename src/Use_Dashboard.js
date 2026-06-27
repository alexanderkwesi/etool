import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Grid, Card, CardContent, Typography, Box, Chip, Divider,
  LinearProgress, Button, Paper, Alert, List, ListItem, ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Storage, Description, Security, Group, Download, Compare, Visibility,
  SwapHoriz, History, AccountCircle, Payment, Refresh,
} from "@mui/icons-material";

import { useSecurity } from "./Use_Security";
import LogoutDialog from "./Use_LogOutDialog";
import { STORAGE_KEYS } from "./hooks/Use_Storekey";
// FIX: Import both the hook and the static utils
import { useLocalStorage, localStorageUtils } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const API           = "http://127.0.0.1:5000/api";
const POLL_INTERVAL = 100_000; // 100 seconds

// ── API fetch helper ─────────────────────────────────────────────────────────
const apiFetch = async (path) => {
  const token = localStorageUtils.getItem("auth_token");
  return fetch(`${API}${path}`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());
};

// ── plan config ───────────────────────────────────────────────────────────────
const planDetails = {
  basic:    { name: "Begin Plan",    fileLimit: 5,  fileSizeLimit: 10, storage: 1024,  color: "#757575" },
  standard: { name: "Standard Plan", fileLimit: 10, fileSizeLimit: 20, storage: 2560,  color: "#2196f3" },
  premium:  { name: "Premium Plan",  fileLimit: 50, fileSizeLimit: 50, storage: 5120,  color: "#ff6f00" },
};

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isAuthenticated, user, hasPermission, logout } = useSecurity();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Use the localStorage hook
  const { getItem, setItem } = useLocalStorage();

  // plan + stats
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic", planName: "Begin Plan",
    monthlyPrice: 0, annualPrice: 0, billingCycle: "monthly",
  });
  const [userPlan,       setUserPlan]       = useState("basic");
  const [usageStats,     setUsageStats]     = useState({
    filesUsed: 0, storageUsed: 0, conversionsThisMonth: 0,
    fileLimit: 5, storageLimit: 1024,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [permissions,    setPermissions]    = useState({ team_access: false, admin_features: false });
  const [lastUpdated,    setLastUpdated]    = useState(null);

  const canUseTeamFeatures  = hasPermission("team_access")   || permissions.team_access;
  const canUseAdminFeatures = hasPermission("admin_features") || permissions.admin_features;
  const currentPlan = planDetails[userPlan] || planDetails.basic;

  // ── fetch from server ─────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        apiFetch("/dashboard/stats"),
        apiFetch("/dashboard/activity?limit=10"),
      ]);

      if (statsRes.status === 200) {
        const { stats, plan, permissions: perms } = statsRes;

        setUsageStats({
          filesUsed:            stats.filesUsed            ?? 0,
          storageUsed:          stats.storageUsed          ?? 0,
          conversionsThisMonth: stats.conversionsThisMonth ?? 0,
          fileLimit:            stats.fileLimit            ?? 5,
          storageLimit:         stats.storageLimit         ?? 1024,
        });

        if (plan) {
          const planKey = plan.planId || plan.key || "basic";
          setUserPlan(planKey);
          setUserPlanData({
            planId:       planKey,
            planName:     plan.planName || plan.name || "Begin Plan",
            monthlyPrice: plan.monthlyPrice ?? 0,
            annualPrice:  plan.annualPrice  ?? 0,
            billingCycle: plan.billingCycle || "monthly",
          });
          // sync to localStorage so FileConversion page picks it up
          try {
            setItem("User_Plan_Data", {
              planId: planKey,
              planName: plan.planName || plan.name,
              monthlyPrice: plan.monthlyPrice ?? 0,
              annualPrice: plan.annualPrice ?? 0,
              billingCycle: plan.billingCycle || "monthly",
            });
          } catch (_) {}
        }

        if (perms) setPermissions(perms);
        setLastUpdated(new Date());
      }

      if (activityRes.status === 200) {
        setRecentActivity(activityRes.activity || []);
      }
    } catch (err) {
      console.warn("Dashboard stats poll failed:", err);
    }
  }, [setItem]);

  // ── initial fetch + 100s interval ────────────────────────────────────────
  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchStats]);

  // ── localStorage fallback ─────────────────────────────────────────────────
  useEffect(() => {
    // FIX: Use getItem from the hook instead of useLocalStorage.getItem
    const stored = getItem("User_Plan_Data");
    if (stored && stored.planId) {
      setUserPlan(stored.planId);
      setUserPlanData(stored);
    }
  }, [getItem]);

  // ── sub-components ────────────────────────────────────────────────────────
  const planColor = (id) =>
    id === "basic" ? "#757575" : id === "standard" ? "#2196f3" : "#ff6f00";

  const FeatureCard = ({ icon, title, description, available = true, limit }) => (
    <Card className="feature-card" sx={{ opacity: available ? 1 : 0.6 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        {limit && (
          <Chip label={limit} size="small"
            sx={{ mt: 1, backgroundColor: currentPlan.color, color: "white" }} />
        )}
      </CardContent>
    </Card>
  );

  const UsageMeter = ({ label, used, total, unit = "MB" }) => (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">{used}/{total} {unit}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={total > 0 ? Math.min((used / total) * 100, 100) : 0}
        sx={{
          height: 8, borderRadius: 4, backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor:
              userPlanData.planId === "basic" ? "#757575" :
              userPlanData.planId === "standard" ? "#2196f3" : "#ff6f00",
          },
        }}
      />
    </Box>
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
              <Typography variant="h4" gutterBottom>Engineering Tool Dashboard</Typography>
              <Chip
                label={
                  userPlanData.planId === "basic"    ? "Begin Plan"    :
                  userPlanData.planId === "standard" ? "Standard Plan" : "Premium Plan"
                }
                sx={{ backgroundColor: planColor(userPlanData.planId), color: "white", fontSize: "1rem", padding: "4px 12px" }}
              />
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>Welcome, {user.email}</Typography>
              )}
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Stats updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 100s
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchStats} size="small">
                Refresh Now
              </Button>
              <Button variant="outlined" startIcon={<Security />}
                onClick={() => window.location.href = "/security"}>Security</Button>
              {isAuthenticated && (
                <Button variant="outlined" color="error"
                  onClick={() => setShowLogoutDialog(true)}>Logout</Button>
              )}
              <Button variant="outlined"
                sx={{ borderColor: planColor(userPlanData.planId), color: planColor(userPlanData.planId) }}
                onClick={() => window.location.href = "/features"}>Upgrade Plan</Button>
            </Box>
          </Box>
        </Paper>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Files Processed</Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.filesUsed}/
                {usageStats.fileLimit || (
                  userPlanData.planId === "basic"    ? planDetails.basic.fileLimit    :
                  userPlanData.planId === "standard" ? planDetails.standard.fileLimit :
                                                       planDetails.premium.fileLimit
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Storage sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Storage Used</Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.storageUsed}MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {usageStats.storageLimit || currentPlan.storage}MB
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <SwapHoriz sx={{ fontSize: 40, color: currentPlan.color }} />
              <Typography variant="h6" sx={{ mt: 1 }}>Conversions</Typography>
              <Typography variant="h4" sx={{ color: currentPlan.color }}>
                {usageStats.conversionsThisMonth}
              </Typography>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* ── Feature Cards ────────────────────────────────────────────────── */}
        <Grid container spacing={3}>
          {/* File Operations */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: currentPlan.color }}>File Operations</Typography>
            <Grid container spacing={2}>
              {[
                { icon: <SwapHoriz sx={{ color: currentPlan.color }} />, title: "File Conversion", desc: "Convert between CAD, STEP, DWG and other engineering formats", avail: true },
                { icon: <Compare sx={{ color: currentPlan.color }} />,   title: "File Comparison", desc: "Compare different versions of engineering files", avail: canUseAdminFeatures },
                { icon: <Visibility sx={{ color: currentPlan.color }} />, title: "File Viewing",   desc: "View engineering files online without specialised software", avail: true },
                { icon: <Download sx={{ color: currentPlan.color }} />,  title: "Download Files", desc: "Download converted, viewed, and compared files", avail: true },
              ].map(({ icon, title, desc, avail }) => (
                <Grid item xs={12} sm={6} key={title}>
                  <FeatureCard icon={icon} title={title} description={desc} available={avail} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Security & Storage */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: currentPlan.color }}>Security & Storage</Typography>
            <Grid container spacing={2}>
              {[
                { icon: <Security sx={{ color: currentPlan.color }} />,  title: "Encryption/Decryption", desc: "Secure your files with date of birth encryption", avail: true, limit: null },
                { icon: <Storage sx={{ color: currentPlan.color }} />,   title: "Local Storage",         desc: "All converted files stay in local storage",   avail: true, limit: null },
                { icon: <Description sx={{ color: currentPlan.color }} />, title: "File Size Limit",    desc: "Maximum size for each uploaded file",           avail: true,
                  limit: (userPlanData.planId === "basic" ? planDetails.basic.fileSizeLimit :
                          userPlanData.planId === "standard" ? planDetails.standard.fileSizeLimit :
                          planDetails.premium.fileSizeLimit) + "MB" },
                { icon: <Storage sx={{ color: currentPlan.color }} />,   title: "Total Storage",         desc: "Total storage allocation for your account",    avail: true,
                  limit: (userPlanData.planId === "basic" ? planDetails.basic.storage :
                          userPlanData.planId === "standard" ? planDetails.standard.storage :
                          planDetails.premium.storage) + "MB" },
              ].map(({ icon, title, desc, avail, limit }) => (
                <Grid item xs={12} sm={6} key={title}>
                  <FeatureCard icon={icon} title={title} description={desc} available={avail} limit={limit} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Team & Account */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ color: currentPlan.color, mt: 2 }}>
              Team & Account Management
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: <Group sx={{ color: currentPlan.color }} />,       title: "Team Members",    desc: userPlan === "basic" ? "Not available in Basic plan" : "Collaborate with team members", avail: canUseTeamFeatures, limit: userPlan === "standard" ? "Up to 5 members" : "Unlimited" },
                { icon: <Group sx={{ color: currentPlan.color }} />,       title: "Role Management", desc: userPlan === "basic" ? "Not available in Basic plan" : "Manage team roles and permissions", avail: canUseTeamFeatures, limit: userPlan === "standard" ? "Basic" : "Advanced" },
                { icon: <History sx={{ color: currentPlan.color }} />,     title: "Billing History", desc: userPlan === "basic" ? "Not available in Basic plan" : "View your billing history and invoices", avail: userPlan !== "basic", limit: null },
                { icon: <Payment sx={{ color: currentPlan.color }} />,     title: "Payment Details", desc: userPlan === "basic" ? "Not available in Basic plan" : "Manage your payment methods", avail: userPlan !== "basic", limit: null },
              ].map(({ icon, title, desc, avail, limit }) => (
                <Grid item xs={12} sm={6} md={3} key={title}>
                  <FeatureCard icon={icon} title={title} description={desc} available={avail} limit={limit} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* ── Recent Activity ──────────────────────────────────────────────── */}
        {recentActivity.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: currentPlan.color }}>Recent Activity</Typography>
              <Typography variant="caption" color="text.secondary">Auto-refreshes every 100s</Typography>
            </Box>
            <List dense>
              {recentActivity.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    {item.action === "converted" ? <SwapHoriz color="success" /> :
                     item.action === "downloaded" ? <Download color="primary" /> :
                     <Description sx={{ color: currentPlan.color }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.description}
                    secondary={
                      <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        {item.original_format && (
                          <Chip label={item.original_format.toUpperCase()} size="small" variant="outlined" />
                        )}
                        {item.target_format && (<>
                          <SwapHoriz fontSize="small" />
                          <Chip label={item.target_format.toUpperCase()} size="small"
                            sx={{ backgroundColor: currentPlan.color, color: "white" }} />
                        </>)}
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* ── Storage Usage Details ─────────────────────────────────────────── */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>
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
            Your storage will reset at the beginning of each billing cycle.
          </Typography>
        </Paper>

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: currentPlan.color }}>Quick Actions</Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" sx={{ backgroundColor: currentPlan.color }}
              onClick={() => window.location.href = "/convert"}>Convert File</Button>
            <Button variant="outlined" sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              onClick={() => window.location.href = "/view"}>View Files</Button>
            <Button variant="outlined" sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
              disabled={!canUseAdminFeatures}
              onClick={() => window.location.href = "/compare"}>Compare Files</Button>
            {canUseTeamFeatures && (
              <Button variant="outlined" sx={{ borderColor: currentPlan.color, color: currentPlan.color }}
                onClick={() => window.location.href = "/team/members"}>Manage Team</Button>
            )}
          </Box>
          {!canUseAdminFeatures && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              Upgrade to Premium for advanced features like file comparison.
            </Typography>
          )}
        </Paper>

      </Container>

      {isAuthenticated && (
        <LogoutDialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={logout}
        />
      )}
    </div>
  );
};

export default Dashboard;