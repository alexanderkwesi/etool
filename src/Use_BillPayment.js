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
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import {
  Payment,
  CreditCard,
  CalendarToday,
  Receipt,
  Edit,
  History,
  ArrowBack,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const BillPayment = () => {
  const { isAuthenticated, user } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    cardHolder: "John Doe",
  });
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;  
      setUserPlanData(planData);
      setBillingCycle(storedPlanData.billingCycle || "monthly");
    }

    // Simulate fetching billing history
    const mockBillingHistory = [
      {
        id: 1,
        date: "2023-10-15",
        amount:
          userPlanData.planId === "basic"
            ? "£" + 0
            : userPlanData.planId === "standard"
            ? "£" + 9.99
            : "£" + 19.99,
        plan:
          userPlanData.planId === "basic"
            ? "Begin Plan"
            : userPlanData.planId === "standard"
            ? "Standard Plan"
            : "Premium Plan",
        status: "Paid",
        cycle:
          userPlanData.planId === "basic"
            ? userPlanData.monthlyPrice
            : userPlanData.planId === "standard"
            ? userPlanData.monthlyPrice
            : userPlanData.monthlyPrice || userPlanData.planId === "basic"
            ? userPlanData.annualPrice
            : userPlanData.planId === "standard"
            ? userPlanData.annualPrice
            : userPlanData.annualPrice,
      },
      {
        id: 2,
        date: "2023-09-15",
        amount:
          userPlanData.planId === "basic"
            ? "£" + 0
            : userPlanData.planId === "standard"
            ? "£" + 9.99
            : "£" + 19.99,
        plan:
          userPlanData.planId === "basic"
            ? "Begin Plan"
            : userPlanData.planId === "standard"
            ? "Standard Plan"
            : "Premium Plan",
        status: "Paid",
        cycle:
          userPlanData.planId === "basic"
            ? userPlanData.monthlyPrice
            : userPlanData.planId === "standard"
            ? userPlanData.monthlyPrice
            : userPlanData.monthlyPrice || userPlanData.planId === "basic"
            ? userPlanData.annualPrice
            : userPlanData.planId === "standard"
            ? userPlanData.annualPrice
            : userPlanData.annualPrice,
      },
      {
        id: 3,
        date: "2023-08-15",
        amount:
          userPlanData.planId === "basic"
            ? "£" + 0
            : userPlanData.planId === "standard"
            ? "£" + 9.99
            : "£" + 19.99,
        plan:
          userPlanData.planId === "basic"
            ? "Begin Plan"
            : userPlanData.planId === "standard"
            ? "Standard Plan"
            : "Premium Plan",
        status: "Paid",
        cycle:
          userPlanData.planId === "basic"
            ? userPlanData.monthlyPrice
            : userPlanData.planId === "standard"
            ? userPlanData.monthlyPrice
            : userPlanData.monthlyPrice || userPlanData.planId === "basic"
            ? userPlanData.annualPrice
            : userPlanData.planId === "standard"
            ? userPlanData.annualPrice
            : userPlanData.annualPrice,
      },
    ];
    setBillingHistory(mockBillingHistory);
  }, [userPlanData.annualPrice, userPlanData.monthlyPrice, userPlanData.planId]);

  const handleBillingCycleChange = (event) => {
    setBillingCycle(event.target.value);
  };

  const handleEditPayment = () => {
    setEditDialogOpen(true);
  };

  const handleSavePayment = () => {
    // In a real app, this would save to a backend
    setPaymentMethod({
      cardNumber: `**** **** **** ${cardDetails.number.slice(-4)}`,
      expiryDate: cardDetails.expiry,
      cardHolder: cardDetails.name,
    });
    setEditDialogOpen(false);
    setAlert({
      open: true,
      message: "Payment method updated successfully!",
      severity: "success",
    });
  };

  const handleProcessPayment = () => {
    // In a real app, this would process the payment through a payment gateway
    const amount =
      billingCycle === "monthly"
        ? userPlanData.monthlyPrice
        : userPlanData.annualPrice;

    // Add to billing history
    const newBill = {
      id: billingHistory.length + 1,
      date: new Date().toISOString().split("T")[0],
      amount: amount,
      plan: userPlanData.planName,
      status: "Paid",
    };

    setBillingHistory([newBill, ...billingHistory]);
    setPaymentDialogOpen(false);

    setAlert({
      open: true,
      message: `Payment of £${amount} processed successfully!`,
      severity: "success",
    });
  };

  const handleUpgradePlan = () => {
    window.location.href = "/features";
  };

  const getPlanColor = () => {
    return userPlanData.planId === "basic"
      ? "#757575"
      : userPlanData.planId === "standard"
      ? "#2196f3"
      : "#ff6f00";
  };

  const getNextBillingDate = () => {
    const today = new Date();
    if (billingCycle === "monthly") {
      return new Date(
        today.setMonth(today.getMonth() + 1)
      ).toLocaleDateString();
    } else {
      return new Date(
        today.setFullYear(today.getFullYear() + 1)
      ).toLocaleDateString();
    }
  };

  const getBillingAmount = () => {
    return billingCycle === "monthly"
      ? userPlanData.monthlyPrice
      : userPlanData.annualPrice;
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
              <Button
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
              >
                Back to Dashboard
              </Button>
              <Typography variant="h4" gutterBottom sx={{ mt: 1 }}>
                Billing & Payments
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
                      ? "#757575"
                      : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                  } `,
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Account: {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={() => (window.location.href = "/billing/history")}
              >
                Billing History
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: getPlanColor() }}
                onClick={handleUpgradePlan}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        {alert.open && (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Current Plan & Billing */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: getPlanColor() }}
              >
                Current Plan
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">{userPlanData.planName}</Typography>
                <Chip
                  label={userPlanData.planId === "basic" ? "Free" : "Paid"}
                  color={
                    userPlanData.planId === "basic" ? "default" : "primary"
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControl component="fieldset">
                <FormLabel component="legend">Billing Cycle</FormLabel>
                <RadioGroup
                  value={billingCycle}
                  onChange={handleBillingCycleChange}
                  row
                >
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label={`Monthly (${
                     userPlanData.planId === "basic"
                        ? "£" + 0
                        : userPlanData.planId === "standard"
                        ? "£" + 9.99
                        : "£" + 19.99
                    }/month)`}
                    disabled={
                      false
                    }
                  />

                  <FormControlLabel
                    value="annual"
                    control={<Radio />}
                    label={`Annual (${
                      userPlanData.planId === "basic"
                        ? "£" + 0
                        : userPlanData.planId === "standard"
                        ? "£" + 120
                        : "£" + 240
                    }}/year)`}
                    disabled={
                    false
                    }
                  />
                </RadioGroup>
              </FormControl>

              <Box mt={2}>
                <Typography variant="body2">
                  Next billing date: {getNextBillingDate()}
                </Typography>
              </Box>

              {userPlanData.planId !== "basic" && (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, backgroundColor: getPlanColor() }}
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  Pay ${getBillingAmount()} Now
                </Button>
              )}
            </Card>
          </Grid>

          {/* Payment Method */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" sx={{ color: getPlanColor() }}>
                  Payment Method
                </Typography>
                <IconButton onClick={handleEditPayment}>
                  <Edit />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <CreditCard
                  sx={{ fontSize: 40, mr: 2, color: getPlanColor() }}
                />
                <Box>
                  <Typography variant="body1">
                    {paymentMethod.cardNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expires: {paymentMethod.expiryDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethod.cardHolder}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Your next payment of ${getBillingAmount()} will be processed on{" "}
                {getNextBillingDate()}
              </Typography>
            </Card>
          </Grid>

          {/* Billing History */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: getPlanColor() }}
              >
                Recent Billing History
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Receipt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billingHistory.slice(0, 5).map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{bill.date}</TableCell>
                        <TableCell>{bill.plan}</TableCell>
                        <TableCell align="right">{bill.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={bill.status}
                            color={
                              bill.status === "Paid" ? "success" : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Receipt />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box textAlign="center" mt={2}>
                <Button
                  onClick={() => (window.location.href = "/billing/history")}
                >
                  View Full History
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Payment Method Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Payment Method</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Card Number"
            value={cardDetails.number}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, number: e.target.value })
            }
            margin="normal"
            placeholder="1234 5678 9012 3456"
          />
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Expiry Date"
              value={cardDetails.expiry}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, expiry: e.target.value })
              }
              margin="normal"
              placeholder="MM/YY"
            />
            <TextField
              fullWidth
              label="CVV"
              value={cardDetails.cvv}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cvv: e.target.value })
              }
              margin="normal"
              placeholder="123"
            />
          </Box>
          <TextField
            fullWidth
            label="Cardholder Name"
            value={cardDetails.name}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, name: e.target.value })
            }
            margin="normal"
            placeholder="John Doe"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSavePayment}
            variant="contained"
            sx={{ backgroundColor: getPlanColor() }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to process a payment for your {userPlanData.planName}.
          </Typography>
          <Box bgcolor="grey.100" p={2} borderRadius={1} mt={2}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: getPlanColor() }}
            >
              Payment Details
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Plan:</Typography>
              <Typography variant="body1">{userPlanData.planName}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Billing Cycle:</Typography>
              <Typography variant="body1">
                {billingCycle === "monthly" ? "Monthly" : "Annual"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Amount:</Typography>
              <Typography variant="body1">${getBillingAmount()}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Payment Method:</Typography>
              <Typography variant="body1">
                {paymentMethod.cardNumber}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleProcessPayment}
            variant="contained"
            sx={{ backgroundColor: getPlanColor() }}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillPayment;
