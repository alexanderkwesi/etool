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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Group,
  Add,
  MoreVert,
  Edit,
  Delete,
  Security,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const RoleManagement = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      file_conversion: false,
      file_comparison: false,
      file_viewing: false,
      file_download: false,
      encryption: false,
      team_management: false,
      billing_access: false,
      admin_features: false,
    },
  });

  // Check permissions for role management
  const canManageRoles = hasPermission("admin_features");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData(storedPlanData);
    }

    // Load roles from localStorage
    const storedRoles = useLocalStorage.getItem("Use_Roles") || [
      {
        id: 1,
        name: "Administrator",
        description: "Full access to all features and settings",
        permissions: {
          file_conversion: true,
          file_comparison: true,
          file_viewing: true,
          file_download: true,
          encryption: true,
          team_management: true,
          billing_access: true,
          admin_features: true,
        },
        memberCount: 1,
        isDefault: true,
      },
      {
        id: 2,
        name: "Member",
        description: "Basic access to file operations",
        permissions: {
          file_conversion: true,
          file_comparison: false,
          file_viewing: true,
          file_download: true,
          encryption: true,
          team_management: false,
          billing_access: false,
          admin_features: false,
        },
        memberCount: 0,
        isDefault: true,
      },
      {
        id: 3,
        name: "Viewer",
        description: "Can only view files",
        permissions: {
          file_conversion: false,
          file_comparison: false,
          file_viewing: true,
          file_download: false,
          encryption: false,
          team_management: false,
          billing_access: false,
          admin_features: false,
        },
        memberCount: 0,
        isDefault: true,
      },
    ];
    setRoles(storedRoles);
  }, []);

  // Save roles to localStorage whenever they change
  useEffect(() => {
    useLocalStorage.setItem("Use_Roles", roles);
  }, [roles]);

  const handleAddRole = () => {
    if (!newRole.name) {
      setSnackbar({
        open: true,
        message: "Please enter a role name",
        severity: "error",
      });
      return;
    }

    // Check if role name already exists
    if (
      roles.some(
        (role) => role.name.toLowerCase() === newRole.name.toLowerCase()
      )
    ) {
      setSnackbar({
        open: true,
        message: "A role with this name already exists",
        severity: "error",
      });
      return;
    }

    if (editingRole) {
      // Update existing role
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id
            ? {
                ...newRole,
                id: editingRole.id,
                memberCount: editingRole.memberCount,
                isDefault: editingRole.isDefault,
              }
            : role
        )
      );
      setSnackbar({
        open: true,
        message: "Role updated successfully",
        severity: "success",
      });
    } else {
      // Add new role
      const role = {
        ...newRole,
        id: Date.now(),
        memberCount: 0,
        isDefault: false,
      };
      setRoles((prev) => [...prev, role]);
      setSnackbar({
        open: true,
        message: "Role added successfully",
        severity: "success",
      });
    }

    setNewRole({
      name: "",
      description: "",
      permissions: {
        file_conversion: false,
        file_comparison: false,
        file_viewing: false,
        file_download: false,
        encryption: false,
        team_management: false,
        billing_access: false,
        admin_features: false,
      },
    });
    setEditingRole(null);
    setOpenDialog(false);
  };

  const handleEditRole = (role) => {
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions },
    });
    setEditingRole(role);
    setOpenDialog(true);
    setOpenMenu(null);
  };

  const handleDeleteRole = (role) => {
    if (role.isDefault) {
      setSnackbar({
        open: true,
        message: "Default roles cannot be deleted",
        severity: "error",
      });
      return;
    }

    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    setSnackbar({
      open: true,
      message: "Role deleted successfully",
      severity: "success",
    });
    setOpenMenu(null);
  };

  const handlePermissionChange = (permission) => {
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [permission]: !newRole.permissions[permission],
      },
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRole({
      name: "",
      description: "",
      permissions: {
        file_conversion: false,
        file_comparison: false,
        file_viewing: false,
        file_download: false,
        encryption: false,
        team_management: false,
        billing_access: false,
        admin_features: false,
      },
    });
    setEditingRole(null);
  };

  const handleMenuOpen = (event, role) => {
    setOpenMenu(event.currentTarget);
    setEditingRole(role);
  };

  const handleMenuClose = () => {
    setOpenMenu(null);
    setEditingRole(null);
  };

  const getPermissionLabel = (key) => {
    const permissionLabels = {
      file_conversion: "File Conversion",
      file_comparison: "File Comparison",
      file_viewing: "File Viewing",
      file_download: "File Download",
      encryption: "Encryption/Decryption",
      team_management: "Team Management",
      billing_access: "Billing Access",
      admin_features: "Admin Features",
    };
    return permissionLabels[key] || key;
  };

  if (!canManageRoles) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You need administrator privileges to manage roles.
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
                Role Management
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
                {roles.length} roles defined
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
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
              Add New Role
            </Button>
          </Box>
        </Paper>

        {userPlanData.planId === "basic" && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Role management is not available in the Basic plan. Upgrade to
            Premium to manage custom roles.
          </Alert>
        )}

        {/* Roles List */}
        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} md={6} key={role.id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {role.name}
                        {role.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {role.description}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {role.memberCount} members assigned
                      </Typography>
                    </Box>
                    {!role.isDefault && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, role)}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Permissions:
                  </Typography>

                  <Grid container spacing={1}>
                    {Object.entries(role.permissions).map(
                      ([key, value]) =>
                        value && (
                          <Grid item xs={6} key={key}>
                            <Chip
                              label={getPermissionLabel(key)}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Grid>
                        )
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Role Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingRole ? "Edit Role" : "Add New Role"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Role Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" gutterBottom>
              Permissions:
            </Typography>

            <List>
              {Object.entries(newRole.permissions).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={getPermissionLabel(key)} />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={value}
                      onChange={() => handlePermissionChange(key)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddRole}
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
              {editingRole ? "Update Role" : "Add Role"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={openMenu}
          open={Boolean(openMenu)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleEditRole(editingRole)}>
            <Edit sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteRole(editingRole)}>
            <Delete sx={{ mr: 1 }} /> Delete
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

export default RoleManagement;
