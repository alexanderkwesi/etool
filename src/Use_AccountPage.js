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
  TextField,
  Button,
  Paper,
  Avatar,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  AccountCircle,
  Security,
  Payment,
  History,
  Notifications,
  Language,
  Delete,
  Person,
  Lock,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import { format, parseISO } from "date-fns";
import "./Use_App.css";
import PaymentDialog from './Use_PaymentDialog';

const AccountPage = () => {
  const { isAuthenticated, user, hasPermission, updateUser } = useSecurity();
   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false); 

  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [uuerData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    emailNotifications: true,
    securityAlerts: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    fileConversions: true,
    storageWarnings: true,
    newFeatures: false,
    promotional: false,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const [memberSince, setMemberSince] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [userPlan, setUserPlan] = useState("basic");

  // Fetch user data from localStorage or API
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;
      setUserPlan(planData.planId);
      setUserPlanData(planData);
    }

    // Simulate fetching user data
    if (user) {
      setUserData({
        firstName: user.firstName || "John",
        lastName: user.lastName || "Doe",
        email: user.email || "user@example.com",
        company: user.company || "ACME Corp",
        jobTitle: user.jobTitle || "Engineer",
      });

      // Set dates - in a real app, these would come from the user object
      setMemberSince(format(new Date(2023, 0, 15), "MMMM d, yyyy")); // January 15, 2023
      setLastLogin(format(new Date(), "MMMM d, yyyy 'at' HH:mm")); // Current date and time
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (setting, value) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveProfile = () => {
    // Simulate API call to update user profile
    setTimeout(() => {
      if (updateUser) {
        updateUser(userPlan);
      }
      setSaveStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 3000);
    }, 500);
  };

  const handleSaveSettings = () => {
    // Simulate API call to update settings
    setTimeout(() => {
      setSaveStatus({
        type: "success",
        message: "Settings updated successfully!",
      });
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 3000);
    }, 500);
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
      // In a real app, this would redirect to logout or homepage
      setSaveStatus({
        type: "info",
        message:
          "Account deletion requested. You will receive a confirmation email.",
      });
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 5000);
    }, 1000);
  };

  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileLimit: 5,
      fileSizeLimit: 10,
      storage: 1024,
      price: 0,
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      fileLimit: 10,
      fileSizeLimit: 20,
      storage: 2560,
      price: 9.99,
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      fileLimit: 50,
      fileSizeLimit: 50,
      storage: 5120,
      price: 19.99,
      color: "#ff6f00",
    },
  };

  const currentPlan = planDetails[userPlanData.planId];

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
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: `${
                    userPlanData.planId === "basic"
                      ? "rgba(117, 117, 117, 1)"
                      : userPlanData.planId === "standard"
                      ? "rgba(33, 150, 243, 1)"
                      : "rgba(255, 111, 0, 1)"
                  }`,
                  mr: 2,
                }}
              >
                {uuerData.firstName}
                {uuerData.lastName}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Account Management
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
                    backgroundColor: `${
                      userPlanData.planId === "basic"
                        ? "rgba(117, 117, 117, 1)"
                        : userPlanData.planId === "standard"
                        ? "rgba(33, 150, 243, 1)"
                        : "rgba(255, 111, 0, 1)"
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
            </Box>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "rgba(117, 117, 117, 1)"
                    : userPlanData.planId === "standard"
                    ? "rgba(33, 150, 243, 1)"
                    : "rgba(255, 111, 0, 1)"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "rgba(117, 117, 117, 1)"
                    : userPlanData.planId === "standard"
                    ? "rgba(33, 150, 243, 1)"
                    : "rgba(255, 111, 0, 1)"
                }`,
              }}
              onClick={() => (window.location.href = "/features")}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Paper>

        {saveStatus.message && (
          <Alert severity={saveStatus.type || "info"} sx={{ mb: 3 }}>
            {saveStatus.message}
          </Alert>
        )}

        <Paper elevation={2} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { py: 2 },
              "& .Mui-selected": {
                color: `${
                  userPlanData.planId === "basic"
                    ? "rgba(117, 117, 117, 0.1)"
                    : userPlanData.planId === "standard"
                    ? "rgba(33, 150, 243, 1)"
                    : "rgba(255, 111, 0, 1)"
                }`,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: `${
                  userPlanData.planId === "basic"
                    ? "rgba(117, 117, 117, 0.3)"
                    : userPlanData.planId === "standard"
                    ? "rgba(33, 150, 243, 0.3)"
                    : "rgba(255, 111, 0, 0.3)"
                }`,
              },
            }}
          >
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Payment />} label="Billing" />
          </Tabs>

          <Divider />

          <Box sx={{ p: 3 }}>
            {/* Profile Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Personal Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={uuerData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={uuerData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={uuerData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Professional Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Company"
                    value={uuerData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={uuerData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    margin="normal"
                    variant="outlined"
                  />

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      <strong>Member since:</strong> {memberSince}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last login:</strong> {lastLogin}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    sx={{
                      backgroundColor: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 0.3)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 0.3)"
                          : "rgba(255, 111, 0, 0.3)"
                      }`,
                      "&:hover": {
                        backgroundColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 0.1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 0.1)"
                            : "rgba(255, 111, 0, 0.1)"
                        }`,
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* Security Tab */}
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Security Settings
                  </Typography>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Two-Factor Authentication
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Add an extra layer of security to your account
                          </Typography>
                        </Box>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) =>
                            handleSettingChange(
                              "twoFactorAuth",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Email Notifications
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive important account notifications via email
                          </Typography>
                        </Box>
                        <Switch
                          checked={securitySettings.emailNotifications}
                          onChange={(e) =>
                            handleSettingChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Security Alerts
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Get notified about suspicious login attempts
                          </Typography>
                        </Box>
                        <Switch
                          checked={securitySettings.securityAlerts}
                          onChange={(e) =>
                            handleSettingChange(
                              "securityAlerts",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Lock />}
                      sx={{
                        mr: 2,
                        borderColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 1)"
                            : "rgba(255, 111, 0, 1)"
                        }`,
                        color: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 0.3)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 0.3)"
                            : "rgba(255, 111, 0, 0.3)"
                        }`,
                      }}
                    >
                      Change Password
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Language />}
                      sx={{
                        borderColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 1)"
                            : "rgba(255, 111, 0, 1)"
                        }`,
                        color: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 0.3)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 0.3)"
                            : "rgba(255, 111, 0, 0.3)"
                        }`,
                      }}
                    >
                      Manage Active Sessions
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSettings}
                    sx={{
                      backgroundColor: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 0.3)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 0.3)"
                          : "rgba(255, 111, 0, 0.3)"
                      }`,
                      "&:hover": {
                        backgroundColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 0.1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 0.1)"
                            : "rgba(255, 111, 0, 0.1)"
                        }`,
                      },
                    }}
                  >
                    Save Security Settings
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* Notifications Tab */}
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Notification Preferences
                  </Typography>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            File Conversion Complete
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Get notified when your file conversions are complete
                          </Typography>
                        </Box>
                        <Switch
                          checked={notificationSettings.fileConversions}
                          onChange={(e) =>
                            handleNotificationChange(
                              "fileConversions",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Storage Warnings
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive alerts when your storage is nearing capacity
                          </Typography>
                        </Box>
                        <Switch
                          checked={notificationSettings.storageWarnings}
                          onChange={(e) =>
                            handleNotificationChange(
                              "storageWarnings",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            New Features
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Learn about new features and improvements
                          </Typography>
                        </Box>
                        <Switch
                          checked={notificationSettings.newFeatures}
                          onChange={(e) =>
                            handleNotificationChange(
                              "newFeatures",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Promotional Offers
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive occasional offers and discounts
                          </Typography>
                        </Box>
                        <Switch
                          checked={notificationSettings.promotional}
                          onChange={(e) =>
                            handleNotificationChange(
                              "promotional",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSettings}
                    sx={{
                      backgroundColor: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 0.3)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 0.3)"
                          : "rgba(255, 111, 0, 0.3)"
                      }`,
                      "&:hover": {
                        backgroundColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 0.1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 0.1)"
                            : "rgba(255, 111, 0, 0.1)"
                        }`,
                      },
                    }}
                  >
                    Save Notification Preferences
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* Billing Tab */}
            {activeTab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Current Plan
                  </Typography>

                  <Card
                    sx={{
                      p: 2,
                      mb: 3,
                      border: `2px solid ${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
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
                      <Typography variant="h6">
                        {userPlanData.planId === "basic"
                          ? "Begin Plan"
                          : userPlanData.planId === "standard"
                          ? "Standard Plan"
                          : "Premium Plan"}
                      </Typography>
                      <Chip
                        label={
                          planDetails.basic.price === 0 ||
                          planDetails.standard.price === 9.99 ||
                          planDetails.premium.price === 19.99
                            ? "Monthly"
                            : "Annual"
                        }
                        sx={{
                          backgroundColor: `${
                            userPlanData.planId === "basic"
                              ? "rgba(117, 117, 117, 1)"
                              : userPlanData.planId === "standard"
                              ? "rgba(33, 150, 243, 1)"
                              : "rgba(255, 111, 0, 1)"
                          }`,
                          color: "white",
                        }}
                      />
                    </Box>

                    <Typography variant="h4" sx={{ my: 2 }}>
                      £
                      {userPlanData.billingCycle === "monthly"
                        ? userPlanData.monthlyPrice
                        : userPlanData.annualPrice}
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.secondary"
                      >
                        /
                        {userPlanData.billingCycle === "monthly"
                          ? "month"
                          : "year"}
                      </Typography>
                    </Typography>

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 1)"
                            : "rgba(255, 111, 0, 1)"
                        }`,
                        color: `${
                          userPlanData.planId === "basic"
                            ? "rgba(117, 117, 117, 1)"
                            : userPlanData.planId === "standard"
                            ? "rgba(33, 150, 243, 1)"
                            : "rgba(255, 111, 0, 1)"
                        }`,
                      }}
                      onClick={() => (window.location.href = "/features")}
                    >
                      {userPlanData.planId === "basic" ||
                      userPlanData.planId === "standard" ||
                      userPlanData.planId === "premium"
                        ? "Upgrade Plan"
                        : "Change Plan"}
                    </Button>
                  </Card>

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                      mt: 3,
                    }}
                  >
                    Payment Method
                  </Typography>

                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center">
                        <Payment sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography>Visa ending in 4321</Typography>
                      </Box>
                      <Button
                        size="small"
                        sx={{
                          color: `${
                            userPlanData.planId === "basic"
                              ? "rgba(117, 117, 117, 1)"
                              : userPlanData.planId === "standard"
                              ? "rgba(33, 150, 243, 1)"
                              : "rgba(255, 111, 0, 1)"
                          }`,
                        }}
                        onClick={() => {setIsPaymentDialogOpen(true)}}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} style={{ width: "55%" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    Billing History
                  </Typography>

                  <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">January 2023</Typography>
                      <Typography variant="body2">
                        £
                        {(userPlanData.planId === planDetails.planId) ===
                        "basic"
                          ? planDetails.basic.price
                          : (userPlanData.planId === planDetails.planId) ===
                            "standard"
                          ? planDetails.standard.price
                          : planDetails.premium.price}
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: `${
                            userPlanData.planId === "basic"
                              ? "rgba(117, 117, 117, 1)"
                              : userPlanData.planId === "standard"
                              ? "rgba(33, 150, 243, 1)"
                              : "rgba(255, 111, 0, 1)"
                          }`,
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Card>

                  <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">December 2022</Typography>
                      <Typography variant="body2">
                        £
                        {(userPlanData.planId === planDetails.planId) ===
                        "basic"
                          ? planDetails.basic.price
                          : (userPlanData.planId === planDetails.planId) ===
                            "standard"
                          ? planDetails.standard.price
                          : planDetails.premium.price}
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: `${
                            userPlanData.planId === "basic"
                              ? "rgba(117, 117, 117, 1)"
                              : userPlanData.planId === "standard"
                              ? "rgba(33, 150, 243, 1)"
                              : "rgba(255, 111, 0, 1)"
                          }`,
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Card>

                  <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">November 2022</Typography>
                      <Typography variant="body2">
                        £
                        {(userPlanData.planId === planDetails.planId) ===
                        "basic"
                          ? planDetails.basic.price
                          : (userPlanData.planId === planDetails.planId) ===
                            "standard"
                          ? planDetails.standard.price
                          : planDetails.premium.price}
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: `${
                            userPlanData.planId === "basic"
                              ? "rgba(117, 117, 117, 1)"
                              : userPlanData.planId === "standard"
                              ? "rgba(33, 150, 243, 1)"
                              : "rgba(255, 111, 0, 1)"
                          }`,
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Card>

                  <Button
                    variant="text"
                    startIcon={<History />}
                    sx={{
                      color: `${
                        userPlanData.planId === "basic"
                          ? "rgba(117, 117, 117, 1)"
                          : userPlanData.planId === "standard"
                          ? "rgba(33, 150, 243, 1)"
                          : "rgba(255, 111, 0, 1)"
                      }`,
                    }}
                  >
                    View all billing history
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>

        {/* Danger Zone */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Once you delete your account, there is no going back. Please be
            certain.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Paper>
      </Container>

      {/* Delete Account Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone. All your data will be permanently removed from our systems.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Edit Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        planColor={`${
          userPlanData.planId === "basic"
            ? "rgba(117, 117, 117, 1)"
            : userPlanData.planId === "standard"
            ? "rgba(33, 150, 243, 1)"
            : "rgba(255, 111, 0, 1)"
        }`}
      />
    </div>
  );
};

export default AccountPage;
