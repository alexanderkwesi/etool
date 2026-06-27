import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  LinearProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Compare as CompareIcon,
  SwapHoriz as ConvertIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Group as TeamIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  AccountCircle as AccountIcon,
  Description as PlanIcon,
  Edit as EditIcon,
  AutoFixHigh as RemediationIcon,
  Description as DocIcon,
  Image as ImageIcon,
  ContactMail as CRMIcon,
  SmartToy as AiIcon,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import Logo from "./image/favicon-png.png";

const API           = "http://127.0.0.1:5000/api";
const POLL_INTERVAL = 100_000; // 100 s — matches dashboard

// ── safe localStorage helpers (avoids shadowing window.localStorage) ─────────
const lsGet = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// ── plan config ───────────────────────────────────────────────────────────────
const planDetails = {
  basic:    { name: "Begin Plan",    fileLimit: 5,  fileSizeLimit: 10, storage: 1024,  color: "#757575" },
  standard: { name: "Standard Plan", fileLimit: 10, fileSizeLimit: 20, storage: 2560,  color: "#2196f3" },
  premium:  { name: "Premium Plan",  fileLimit: 50, fileSizeLimit: 50, storage: 5120,  color: "#ff6f00" },
};

// ── Braille dot icon (SVG-based, style not sx) ────────────────────────────────
const BrailleIcon = ({ color = "currentColor", size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <circle cx="8"  cy="8"  r="2" fill={color} />
    <circle cx="16" cy="8"  r="2" fill={color} />
    <circle cx="8"  cy="16" r="2" fill={color} />
    <circle cx="16" cy="16" r="2" fill={color} />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ open, onClose }) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ── collapse state for each expandable section ───────────────────────────
  const [featuresOpen,  setFeaturesOpen]  = useState(false);
  const [teamOpen,      setTeamOpen]      = useState(false);
  const [billingOpen,   setBillingOpen]   = useState(false);
  const [documentOpen,  setDocumentOpen]  = useState(false);
  const [aiOpen,        setAiOpen]        = useState(false);
  const [ocrOpen,       setOcrOpen]       = useState(false);
  const [crmOpen,       setCrmOpen]       = useState(false);

  // ── plan + stats ──────────────────────────────────────────────────────────
  const [userPlan,    setUserPlan]    = useState("basic");
  const [usageStats,  setUsageStats]  = useState({
    filesUsed: 0, storageUsed: 0, conversionsThisMonth: 0,
    fileLimit: 5, storageLimit: 1024,
  });

  const currentPlan = planDetails[userPlan] || planDetails.basic;

  // ── fetch stats from server (same endpoint as dashboard) ─────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/dashboard/stats`, { credentials: "include" });
      const data = await res.json();
      if (data.status === 200) {
        const { stats, plan } = data;

        setUsageStats({
          filesUsed:            stats.filesUsed            ?? 0,
          storageUsed:          stats.storageUsed          ?? 0,
          conversionsThisMonth: stats.conversionsThisMonth ?? 0,
          fileLimit:            stats.fileLimit            ?? 5,
          storageLimit:         stats.storageLimit         ?? 1024,
        });

        if (plan) {
          const key = plan.planId || plan.key || "basic";
          setUserPlan(key);
          // keep localStorage in sync for other pages
          try {
            window.localStorage.setItem("User_Plan_Data", JSON.stringify({
              planId: key, planName: plan.planName || plan.name,
              monthlyPrice: plan.monthlyPrice ?? 0,
              annualPrice:  plan.annualPrice  ?? 0,
              billingCycle: plan.billingCycle || "monthly",
            }));
          } catch (_) {}
        }
      }
    } catch (_) {
      // fallback: read from localStorage if server unreachable
      const stored = lsGet("User_Plan_Data");
      if (stored?.planId) setUserPlan(stored.planId);
    }
  }, []);

  // initial fetch + 100 s polling
  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchStats]);

  // ── navigation ────────────────────────────────────────────────────────────
  const handleNavigation = (path, e) => {
    e.preventDefault();
    if (path && path !== "#") {
      window.location.href = path;
      if (isMobile) onClose?.();
    }
  };

  // ── toggle collapse — simply flips the boolean, no setTimeout, no name check
  const handleToggle = (setter) => (e) => {
    e.preventDefault();
    setter(prev => !prev);
  };

  // ── menu structure ────────────────────────────────────────────────────────
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "App",
      icon: <DashboardIcon />,
      path: "/app",
    },
    {
      text: "Document Editor",
      icon: <EditIcon />,
      path: "/editor",
    },
    {
      text: "Document Remediation",
      icon: <RemediationIcon />,
      path: "#",
      state: documentOpen,
      toggle: handleToggle(setDocumentOpen),
      subItems: [
        { text: "Basic Remediation",        icon: <DocIcon />,      path: "/remediation/basic" },
        { text: "PDF Accessibility",        icon: <DocIcon />,      path: "/remediation/pdf-accessibility" },
        { text: "Braille & Screen Reader",  icon: <BrailleIcon />,  path: "/remediation/braille-screen-reader" },
        { text: "Document Compliance",      icon: <SecurityIcon />, path: "/remediation/compliance" },
        { text: "Tag & Structure",          icon: <EditIcon />,     path: "/remediation/tag-structure" },
      ],
    },
    {
      text: "Intelligent Remediation (AI)",
      icon: <AiIcon />,
      path: "#",
      state: aiOpen,
      toggle: handleToggle(setAiOpen),
      subItems: [
        { text: "AI-Powered Fixes",      icon: <AiIcon />,      path: "/ai/remediation" },
        { text: "Smart Tagging",         icon: <AiIcon />,      path: "/ai/tagging" },
        { text: "Content Analysis",      icon: <AiIcon />,      path: "/ai/analysis" },
        { text: "Automated Compliance",  icon: <SecurityIcon />, path: "/ai/compliance" },
      ],
    },
    {
      text: "OCR & Scanning",
      icon: <ImageIcon />,
      path: "#",
      state: ocrOpen,
      toggle: handleToggle(setOcrOpen),
      subItems: [
        { text: "Document Scanning",  icon: <ImageIcon />,  path: "/ocr/scan" },
        { text: "Text Recognition",   icon: <ImageIcon />,  path: "/ocr/text-recognition" },
        { text: "Image to Text",      icon: <ConvertIcon />, path: "/ocr/image-to-text" },
        { text: "Batch Processing",   icon: <DownloadIcon />, path: "/ocr/batch" },
      ],
    },
    {
      text: "CRM Integration",
      icon: <CRMIcon />,
      path: "#",
      state: crmOpen,
      toggle: handleToggle(setCrmOpen),
      disabled: userPlan === "basic",
      subItems: [
        {
          text: "Contact Management",
          icon: <CRMIcon />,
          path: "/crm/contacts",
          disabled: userPlan === "basic",
          description: userPlan === "standard" ? "Up to 100 contacts" : "Unlimited contacts",
        },
        {
          text: "Document Tracking",
          icon: <DocIcon />,
          path: "/crm/document-tracking",
          disabled: userPlan === "basic",
          description: "Track document workflows",
        },
        {
          text: "Client Portal",
          icon: <AccountIcon />,
          path: "/crm/client-portal",
          disabled: userPlan === "basic",
          description: userPlan === "standard" ? "Basic portal" : "Advanced portal",
        },
        {
          text: "Reports & Analytics",
          icon: <DashboardIcon />,
          path: "/crm/analytics",
          disabled: userPlan === "basic",
          description: "CRM performance metrics",
        },
      ],
    },
    {
      text: "Features",
      icon: <PlanIcon />,
      path: "#",
      state: featuresOpen,
      toggle: handleToggle(setFeaturesOpen),
      subItems: [
        { text: "File Conversion", icon: <ConvertIcon />,  path: "/convert" },
        { text: "File Comparison", icon: <CompareIcon />,  path: "/compare" , disabled: userPlan ? "basic" : "standard"},
        { text: "File Viewing",    icon: <ViewIcon />,     path: "/view" },
        { text: "Download Files",  icon: <DownloadIcon />, path: "/downloads" },
      ],
    },
    {
      text: "Security",
      icon: <SecurityIcon />,
      path: "/security",
    },
    {
      text: "Storage",
      icon: <StorageIcon />,
      path: "/storage",
    },
    {
      text: "Team Management",
      icon: <TeamIcon />,
      path: "#",
      state: teamOpen,
      toggle: handleToggle(setTeamOpen),
      disabled: userPlan === "basic",
      subItems: [
        {
          text: "Team Members",
          icon: <TeamIcon />,
          path: "/team/members",
          disabled: userPlan === "basic",
          description: userPlan === "standard" ? "Up to 5 members" : "Unlimited members",
        },
        {
          text: "Role Management",
          icon: <AccountIcon />,
          path: "/team/roles",
          disabled: userPlan === "basic",
          description: userPlan === "standard" ? "Basic role management" : "Advanced role management",
        },
      ],
    },
    {
      text: "Billing & Payments",
      icon: <PaymentIcon />,
      path: "#",
      state: billingOpen,
      toggle: handleToggle(setBillingOpen),
      disabled: userPlan === "basic",
      subItems: [
        { text: "Billing History",  icon: <HistoryIcon />,  path: "/billing/history", disabled: userPlan === "basic" },
        { text: "Payment Details",  icon: <PaymentIcon />,  path: "/billing/payment", disabled: userPlan === "basic" },
        { text: "Upgrade Plan",     icon: <PlanIcon />,     path: "/features",        disabled: false },
      ],
    },
    {
      text: "Account",
      icon: <AccountIcon />,
      path: "/account",
    },
  ];

  // ── usage bar percentages ─────────────────────────────────────────────────
  const filesPct    = Math.min(100, usageStats.fileLimit    > 0 ? (usageStats.filesUsed            / usageStats.fileLimit)    * 100 : 0);
  const storagePct  = Math.min(100, usageStats.storageLimit > 0 ? (usageStats.storageUsed          / usageStats.storageLimit) * 100 : 0);

  // ── drawer content ────────────────────────────────────────────────────────
  const drawerContent = (
    <Box sx={{ width: 280, height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <Box sx={{ p: 2, backgroundColor: "white", color: "black" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" justifyContent='center' sx={{ width: '250px' }}>
            <img src={Logo} alt="Company Logo" width="40px" height="40px" />
          </Box>
          {isMobile && (
            <IconButton onClick={onClose} aria-label="Close menu">
              <ChevronLeft />
            </IconButton>
          )}
        </Box>

        <Chip
          label={currentPlan.name}
          size="small"
          sx={{ mt: 1, backgroundColor: currentPlan.color, color: "white", fontSize: "0.75rem" }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
          {userPlan === "basic"
            ? "5 files/month · 10MB/file · 1GB storage"
            : userPlan === "standard"
              ? "10 files/month · 20MB/file · 2.5GB storage"
              : "50 files/month · 50MB/file · 5GB storage"}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.subItems ? (
              <>
                {/* Expandable parent */}
                <ListItemButton
                  onClick={item.toggle}
                  disabled={item.disabled}
                  aria-expanded={item.state}
                >
                  <ListItemIcon sx={{
                    color: item.disabled ? theme.palette.text.disabled : "inherit",
                    minWidth: 40,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: item.disabled ? theme.palette.text.disabled : "inherit" }}
                  />
                  {item.state ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={item.state} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((sub) => (
                      <ListItemButton
                        key={sub.text}
                        sx={{ pl: 4 }}
                        disabled={sub.disabled}
                        onClick={(e) => {
                          handleNavigation(sub.path, e);
                        }}
                      >
                        <ListItemIcon sx={{
                          color: sub.disabled ? theme.palette.text.disabled : "inherit",
                          minWidth: 36,
                        }}>
                          {sub.icon}
                        </ListItemIcon>
                        <Box sx={{ flex: 1 }}>
                          <ListItemText
                            primary={sub.text}
                            sx={{ color: sub.disabled ? theme.palette.text.disabled : "inherit" }}
                          />
                          {sub.description && (
                            <Typography variant="caption" sx={{ display: "block", opacity: 0.7 }}>
                              {sub.description}
                            </Typography>
                          )}
                        </Box>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              /* Leaf item */
              <ListItemButton
                disabled={item.disabled}
                onClick={(e) => handleNavigation(item.path, e)}
              >
                <ListItemIcon sx={{
                  color: item.disabled ? theme.palette.text.disabled : "inherit",
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: item.disabled ? theme.palette.text.disabled : "inherit" }}
                />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* Plan usage summary */}
      <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
        <Typography variant="subtitle2" gutterBottom>Plan Usage</Typography>

        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
          Files: {usageStats.filesUsed}/{usageStats.fileLimit}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={filesPct}
          sx={{
            mb: 1, height: 4, borderRadius: 2,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": { backgroundColor: currentPlan.color },
          }}
        />

        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
          Storage: {usageStats.storageUsed.toFixed(1)}MB / {usageStats.storageLimit}MB
        </Typography>
        <LinearProgress
          variant="determinate"
          value={storagePct}
          sx={{
            mb: 1, height: 4, borderRadius: 2,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": { backgroundColor: currentPlan.color },
          }}
        />

        <Typography variant="caption" display="block">
          File size limit: {currentPlan.fileSizeLimit}MB
        </Typography>
      </Box>

      {/* Upgrade prompt (basic only) */}
      {userPlan === "basic" && (
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="body2" gutterBottom>
            Upgrade to access all features
          </Typography>
          <ListItemButton
            onClick={(e) => handleNavigation("/features", e)}
            sx={{
              mt: 1,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: 1,
              justifyContent: "center",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <Typography>Upgrade Plan</Typography>
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            width: 280,
            flexShrink: 0,
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, position: "relative" },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
