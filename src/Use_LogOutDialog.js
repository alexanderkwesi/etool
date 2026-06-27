import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * LogoutDialog
 *
 * Props:
 *   open      {boolean}   — controls dialog visibility
 *   onClose   {Function}  — called when user cancels
 *   onConfirm {Function}  — called when user confirms logout
 *                           (pass `logout` from useSecurity() at the parent level,
 *                           as Use_App.js already does: onConfirm={logout})
 */
const LogoutDialog = ({ open, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    if (onConfirm) onConfirm();navigate('/login');
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to log out?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
