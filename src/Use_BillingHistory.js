import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Receipt,
  Download,
  Payment,
  History,
  ArrowBack,
} from "@mui/icons-material";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import { useSecurity } from "./Use_Security";
import "./Use_App.css";

const BillingHistory = () => {
  const { isAuthenticated, user } = useSecurity();
  const [userPlanData, setUserPlanData] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);

  // Fetch user plan data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = JSON.parse(storedPlanData);
      setUserPlanData(planData);

      // Generate mock billing history based on plan
      generateBillingHistory(planData);
    }
  }, []);

  // Generate mock billing data based on user's plan
  const generateBillingHistory = (planData) => {
    const history = [];
    const currentDate = new Date();
    const planPrice =
      planData.billingCycle === "monthly"
        ? planData.monthlyPrice
        : planData.annualPrice;

    // For basic plan (free), show no charges but usage history
    if (planData.planId === "basic") {
      for (let i = 0; i < 6; i++) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);

        history.push({
          id: `INV-${1000 + i}`,
          date: date.toISOString().split("T")[0],
          description: `${planData.planName} - Usage`,
          amount: 0,
          status: "Paid",
          period: `${date.toLocaleString("default", {
            month: "long",
          })} ${date.getFullYear()}`,
          filesProcessed: Math.floor(Math.random() * 5) + 1,
          storageUsed: `${Math.floor(Math.random() * 200) + 50}MB`,
        });
      }
    }
    // For paid plans, generate invoice history
    else {
      const cycles = planData.billingCycle === "monthly" ? 12 : 3;

      for (let i = 0; i < cycles; i++) {
        const date = new Date(currentDate);
        if (planData.billingCycle === "monthly") {
          date.setMonth(date.getMonth() - i);
        } else {
          date.setFullYear(date.getFullYear() - i);
        }

        history.push({
          id: `INV-${2000 + i}`,
          date: date.toISOString().split("T")[0],
          description: `${planData.planName} - ${
            planData.billingCycle === "monthly" ? "Monthly" : "Annual"
          } subscription`,
          amount: planPrice,
          status: "Paid",
          period:
            planData.billingCycle === "monthly"
              ? `${date.toLocaleString("default", {
                  month: "long",
                })} ${date.getFullYear()}`
              : `Year ${date.getFullYear()}`,
        });
      }
    }

    setBillingHistory(history);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const handleDownloadInvoice = (invoiceId) => {
    // In a real application, this would download the actual invoice
    alert(`Downloading invoice: ${invoiceId}`);
  };

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: userPlanData
              ? userPlanData.planId === "basic"
                ? "rgba(117, 117, 117, 0.3)"
                : userPlanData.planId === "standard"
                ? "rgba(33, 150, 243, 0.3)"
                : "rgba(255, 111, 0, 0.3)"
              : "rgba(117, 117, 117, 0.3)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Billing History
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {userPlanData && (
                  <Chip
                    label={
                      userPlanData.planId === "basic"
                        ? "Begin Plan"
                        : userPlanData.planId === "standard"
                        ? "Standard Plan"
                        : "Premium Plan"
                    }
                    sx={{
                      backgroundColor:
                        userPlanData.planId === "basic"
                          ? "#757575"
                          : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00",
                      color: "white",
                    }}
                  />
                )}
                {userPlanData && userPlanData.billingCycle && (
                  <Chip
                    label={
                      userPlanData.billingCycle === "monthly"
                        ? "Monthly Billing"
                        : "Annual Billing"
                    }
                    variant="outlined"
                  />
                )}
              </Box>
              {user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {user.email}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Billing Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Payment sx={{ mr: 1 }} />
                  <Typography variant="h6">Billing Summary</Typography>
                </Box>

                {userPlanData ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Plan
                      </Typography>
                      <Typography variant="h6">
                        {userPlanData.planName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Billing Cycle
                      </Typography>
                      <Typography variant="h6">
                        {userPlanData.billingCycle === "monthly"
                          ? "Monthly"
                          : "Annual"}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Rate
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(
                          userPlanData.billingCycle === "monthly"
                            ? userPlanData.monthlyPrice
                            : userPlanData.annualPrice
                        )}
                        {userPlanData.billingCycle === "monthly"
                          ? "/month"
                          : "/year"}
                      </Typography>
                    </Box>

                    {userPlanData.planId !== "basic" && (
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => (window.location.href = "/features")}
                      >
                        Change Plan
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">
                    Loading plan information...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Billing History */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <History sx={{ mr: 1 }} />
                <Typography variant="h6">Invoice History</Typography>
              </Box>

              {billingHistory.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Period</TableCell>
                        {userPlanData && userPlanData.planId === "basic" && (
                          <>
                            <TableCell>Files Processed</TableCell>
                            <TableCell>Storage Used</TableCell>
                          </>
                        )}
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingHistory.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            {new Date(invoice.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell>{invoice.period}</TableCell>
                          {userPlanData && userPlanData.planId === "basic" && (
                            <>
                              <TableCell>{invoice.filesProcessed}</TableCell>
                              <TableCell>{invoice.storageUsed}</TableCell>
                            </>
                          )}
                          <TableCell align="right">
                            {invoice.amount > 0
                              ? formatCurrency(invoice.amount)
                              : "Free"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              startIcon={<Download />}
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Receipt
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No billing history found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {userPlanData && userPlanData.planId === "basic"
                      ? "Your usage history will appear here"
                      : "Your invoice history will appear here"}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Additional Information */}
            {userPlanData && userPlanData.planId === "basic" && (
              <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Free Plan Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your Begin Plan is completely free. This section shows your
                  monthly usage history rather than invoices. Upgrade to a paid
                  plan to access advanced features and get detailed invoices.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default BillingHistory;
