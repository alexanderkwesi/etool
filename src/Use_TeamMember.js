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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Group,
  Add,
  MoreVert,
  Edit,
  Delete,
  PersonAdd,
  Email,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const TeamMembers = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member",
  });

  // Check permissions for team features
  const canUseTeamFeatures = hasPermission("team_access");
  const isAdmin = hasPermission("admin_features");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Load team members from localStorage (in a real app, this would come from an API)
    const storedMembers = useLocalStorage.getItem("Use_Team_Members") || [];
    setTeamMembers(storedMembers);
  }, []);

  // Save team members to localStorage whenever they change
  useEffect(() => {
    useLocalStorage.setItem("Use_Team_Members", teamMembers);
  }, [teamMembers]);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // Check if email already exists
    if (teamMembers.some((member) => member.email === newMember.email)) {
      setSnackbar({
        open: true,
        message: "A member with this email already exists",
        severity: "error",
      });
      return;
    }

    if (editingMember) {
      // Update existing member
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id
            ? { ...newMember, id: editingMember.id }
            : member
        )
      );
      setSnackbar({
        open: true,
        message: "Team member updated successfully",
        severity: "success",
      });
    } else {
      // Add new member
      const member = {
        ...newMember,
        id: Date.now(),
        status: "pending",
        joinedDate: new Date().toISOString(),
      };
      setTeamMembers((prev) => [...prev, member]);
      setSnackbar({
        open: true,
        message: "Team member added successfully",
        severity: "success",
      });
    }

    setNewMember({ name: "", email: "", role: "member" });
    setEditingMember(null);
    setOpenDialog(false);
  };

  const handleEditMember = (member) => {
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
    });
    setEditingMember(member);
    setOpenDialog(true);
    setOpenMenu(null);
  };

  const handleDeleteMember = (member) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
    setSnackbar({
      open: true,
      message: "Team member removed",
      severity: "success",
    });
    setOpenMenu(null);
  };

  const handleResendInvite = (member) => {
    // In a real app, this would send an email invitation
    setSnackbar({
      open: true,
      message: `Invitation sent to ${member.email}`,
      severity: "success",
    });
    setOpenMenu(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMember({ name: "", email: "", role: "member" });
    setEditingMember(null);
  };

  const handleMenuOpen = (event, member) => {
    setOpenMenu(event.currentTarget);
    setEditingMember(member);
  };

  const handleMenuClose = () => {
    setOpenMenu(null);
    setEditingMember(null);
  };

  const getMemberLimit = () => {
    if (userPlanData.planId === "standard") return 5;
    if (userPlanData.planId === "premium") return "Unlimited";
    return 0;
  };

  const canAddMoreMembers = () => {
    if (userPlanData.planId === "premium") return true;
    if (userPlanData.planId === "standard") return teamMembers.length < 5;
    return false;
  };

  if (!isAdmin || !canUseTeamFeatures) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You need to be an administrator with team access privileges to
            manage team members.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/features")}
          >
            Upgrade Plan
          </Button>
        </Paper>
      </Container>
    );
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
            <Box>
              <Typography variant="h4" gutterBottom>
                Team Management
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
                  }`,
                  color: "white",
                  fontSize: "1rem",
                  padding: "4px 12px",
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {teamMembers.length} of {getMemberLimit()} team members
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              disabled={!canAddMoreMembers()}
              onClick={() => setOpenDialog(true)}
              sx={{
                backgroundColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
                }`,
              }}
            >
              Add Team Member
            </Button>
          </Box>
        </Paper>

        {userPlanData.planId === "basic" && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Team features are not available in the Basic plan. Upgrade to
            Standard or Premium to add team members.
          </Alert>
        )}

        {userPlanData.planId === "standard" && teamMembers.length >= 5 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You've reached the maximum number of team members for the Standard
            plan (5 members). Upgrade to Premium for unlimited team members.
          </Alert>
        )}

        {/* Team Members Table */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>

          {teamMembers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Group sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No team members yet. Add your first team member to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          color={
                            member.role === "admin" ? "primary" : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          size="small"
                          color={
                            member.status === "active" ? "success" : "default"
                          }
                          variant={
                            member.status === "pending" ? "outlined" : "filled"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, member)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Add/Edit Member Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingMember ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              fullWidth
              variant="outlined"
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddMember}
              variant="contained"
              sx={{
                backgroundColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
                }`,
              }}
            >
              {editingMember ? "Update Member" : "Add Member"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={openMenu}
          open={Boolean(openMenu)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleEditMember(editingMember)}>
            <Edit sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => handleResendInvite(editingMember)}>
            <Email sx={{ mr: 1 }} /> Resend Invite
          </MenuItem>
          <MenuItem onClick={() => handleDeleteMember(editingMember)}>
            <Delete sx={{ mr: 1 }} /> Remove
          </MenuItem>
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default TeamMembers;
