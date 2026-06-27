import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, CreditCard, Edit, Add } from "@mui/icons-material";

const PaymentEditDialog = ({ open, onClose, planColor }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "**** **** **** 4321",
    expiryDate: "12/25",
    cvv: "",
    cardholderName: "John Doe",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Simulate saving payment details
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Payment Methods</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage your payment methods and billing information
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            label="Payment Method"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="card">Credit/Debit Card</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="bank">Bank Transfer</MenuItem>
          </Select>
        </FormControl>

        {paymentMethod === "card" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={
                  isEditing ? cardDetails.cardNumber : "**** **** **** 4321"
                }
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <CreditCard sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={isEditing ? cardDetails.expiryDate : "12/25"}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                disabled={!isEditing}
                placeholder="MM/YY"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                type="password"
                value={isEditing ? cardDetails.cvv : "***"}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                disabled={!isEditing}
                placeholder="123"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={isEditing ? cardDetails.cardholderName : "John Doe"}
                onChange={(e) =>
                  handleInputChange("cardholderName", e.target.value)
                }
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        )}

        {paymentMethod === "paypal" && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body1" gutterBottom>
              You will be redirected to PayPal to complete your payment setup.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: planColor,
                color: planColor,
              }}
            >
              Connect PayPal Account
            </Button>
          </Box>
        )}

        {paymentMethod === "bank" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Holder Name"
                defaultValue="John Doe"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IBAN"
                defaultValue="GB29 NWBK 6016 1331 9268 19"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="BIC/SWIFT"
                defaultValue="ABCDGB2L"
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Billing Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                defaultValue="123 Engineering St"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                defaultValue="London"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Postal Code"
                defaultValue="SW1A 1AA"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                defaultValue="United Kingdom"
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {!isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outlined"
              startIcon={<Edit />}
              sx={{
                borderColor: planColor,
                color: planColor,
              }}
            >
              Edit Payment Method
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              sx={{
                borderColor: planColor,
                color: planColor,
              }}
            >
              Add New Card
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(false)} variant="outlined">
              Cancel Edit
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                backgroundColor: planColor,
                "&:hover": { backgroundColor: planColor },
              }}
            >
              Save Changes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentEditDialog;
