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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  PersonAdd,
  Edit,
  Delete,
  Email,
  Phone,
  LocationOn,
  Business,
  Group,
  Search,
  FilterList,
  Download,
  Upload,
  ContactMail,
  Visibility,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const ContactManagement = () => {
  // Use the security context hook
  const { isAuthenticated, user, hasPermission } = useSecurity();

  // Use localStorage for user plan data
  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    billingCycle: "monthly",
  });

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    status: "active",
    department: "",
    notes: "",
    lastContacted: "",
  });

  const [usageStats, setUsageStats] = useState({
    contactsUsed: 0,
    contactsLimit: 100,
  });

  // Check permissions for features
  const canUseCRMFeatures = hasPermission("crm_access");
  const canUseTeamFeatures = hasPermission("team_access");

  // Fetch user data from localStorage or API
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;

      // Update state with the new plan data
      setUserPlanData({
        planId: planData.planId,
        planName: planData.planName,
        monthlyPrice: planData.monthlyPrice,
        annualPrice: planData.annualPrice,
        billingCycle: planData.billingCycle,
      });

      // Set contact limits based on plan
      const contactsLimit =
        planData.planId === "standard"
          ? 100
          : planData.planId === "premium"
            ? 9999
            : 0;
      setUsageStats((prev) => ({
        ...prev,
        contactsLimit,
      }));
    }
  }, []);

  // Load contacts from localStorage
  useEffect(() => {
    const storedContacts = useLocalStorage.getItem("CRM_Contacts");
    if (storedContacts) {
      setContacts(storedContacts);
      setFilteredContacts(storedContacts);
      setUsageStats((prev) => ({
        ...prev,
        contactsUsed: storedContacts.length,
      }));
    } else {
      // Mock data for demonstration
      const mockContacts = [
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          company: "TechCorp Inc.",
          title: "Engineering Manager",
          status: "active",
          department: "Engineering",
          notes: "Interested in CAD conversion services",
          lastContacted: "2024-01-15",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@designstudio.com",
          phone: "+1 (555) 987-6543",
          company: "Design Studio LLC",
          title: "Lead Designer",
          status: "active",
          department: "Design",
          notes: "Regular customer, needs monthly conversions",
          lastContacted: "2024-01-20",
        },
        {
          id: 3,
          name: "Michael Chen",
          email: "mchen@manufacturing.com",
          phone: "+1 (555) 456-7890",
          company: "Precision Manufacturing",
          title: "Operations Director",
          status: "inactive",
          department: "Operations",
          notes: "On hold until Q2 budget approval",
          lastContacted: "2023-12-10",
        },
        {
          id: 4,
          name: "Emily Rodriguez",
          email: "emily.rodriguez@construction.com",
          phone: "+1 (555) 234-5678",
          company: "Urban Construction Group",
          title: "Project Manager",
          status: "active",
          department: "Project Management",
          notes: "New client, needs training on file comparison",
          lastContacted: "2024-01-25",
        },
      ];

      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      setUsageStats((prev) => ({
        ...prev,
        contactsUsed: mockContacts.length,
      }));
      useLocalStorage.setItem("CRM_Contacts", mockContacts);
    }
  }, []);

  // Filter contacts based on search and status
  useEffect(() => {
    let result = contacts;

    if (searchTerm) {
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((contact) => contact.status === filterStatus);
    }

    setFilteredContacts(result);
  }, [searchTerm, filterStatus, contacts]);

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setCurrentContact(contact);
      setEditMode(true);
    } else {
      setCurrentContact({
        id: contacts.length + 1,
        name: "",
        email: "",
        phone: "",
        company: "",
        title: "",
        status: "active",
        department: "",
        notes: "",
        lastContacted: new Date().toISOString().split("T")[0],
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentContact({
      id: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      status: "active",
      department: "",
      notes: "",
      lastContacted: "",
    });
  };

  const handleSaveContact = () => {
    let updatedContacts;

    if (editMode) {
      updatedContacts = contacts.map((contact) =>
        contact.id === currentContact.id ? currentContact : contact,
      );
    } else {
      updatedContacts = [...contacts, currentContact];
    }

    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    useLocalStorage.setItem("CRM_Contacts", updatedContacts);
    setUsageStats((prev) => ({
      ...prev,
      contactsUsed: updatedContacts.length,
    }));
    handleCloseDialog();
  };

  const handleDeleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    useLocalStorage.setItem("CRM_Contacts", updatedContacts);
    setUsageStats((prev) => ({
      ...prev,
      contactsUsed: updatedContacts.length,
    }));
  };

  const handleExportContacts = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const planDetails = {
    basic: {
      name: "Begin Plan",
      color: "#757575",
    },
    standard: {
      name: "Standard Plan",
      color: "#2196f3",
    },
    premium: {
      name: "Premium Plan",
      color: "#ff6f00",
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "inactive":
        return "#f44336";
      case "prospect":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDepartmentColor = (department) => {
    const colors = {
      Engineering: "#2196f3",
      Design: "#9c27b0",
      Operations: "#ff9800",
      "Project Management": "#4caf50",
      Sales: "#f44336",
      Marketing: "#e91e63",
      Finance: "#673ab7",
      HR: "#00bcd4",
    };
    return colors[department] || "#757575";
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
                Contact Management
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Manage your CRM contacts and communication history
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
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ContactMail />}
                onClick={() => (window.location.href = "/crm")}
              >
                CRM Dashboard
              </Button>
              {userPlanData.planId !== "basic" && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{
                    backgroundColor: `${
                      userPlanData.planId === "basic"
                        ? "#757575"
                        : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00"
                    } `,
                  }}
                  onClick={() => handleOpenDialog()}
                  disabled={usageStats.contactsUsed >= usageStats.contactsLimit}
                >
                  Add Contact
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* CRM Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Group
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Contacts
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              >
                {usageStats.contactsUsed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userPlanData.planId === "standard"
                  ? `Limit: ${usageStats.contactsLimit} contacts`
                  : userPlanData.planId === "premium"
                    ? "Unlimited contacts"
                    : "Not available in Basic Plan"}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Email
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Active Contacts
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              >
                {contacts.filter((c) => c.status === "active").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently engaged
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Business
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Companies
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              >
                {[...new Set(contacts.map((c) => c.company))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique organizations
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Visibility
                sx={{
                  fontSize: 40,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Recent Activity
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
              >
                {
                  contacts.filter((c) => {
                    const lastContacted = new Date(c.lastContacted);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return lastContacted >= thirtyDaysAgo;
                  }).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Contact Usage Progress */}
        {userPlanData.planId !== "basic" && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                } `,
              }}
            >
              Contact Usage
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">Contacts Used</Typography>
                <Typography variant="body2">
                  {usageStats.contactsUsed}/{usageStats.contactsLimit}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  (usageStats.contactsUsed / usageStats.contactsLimit) * 100
                }
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: `${
                      userPlanData.planId === "basic"
                        ? "#757575"
                        : userPlanData.planId === "standard"
                          ? "#2196f3"
                          : "#ff6f00"
                    } `,
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {usageStats.contactsUsed >= usageStats.contactsLimit
                ? "You have reached your contact limit. Upgrade to Premium for unlimited contacts."
                : `You have ${usageStats.contactsLimit - usageStats.contactsUsed} contacts remaining in your plan.`}
            </Typography>
          </Paper>
        )}

        {/* Search and Filter Bar */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search contacts by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <FilterList sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              >
                <MenuItem value="all">All Contacts</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="prospect">Prospect</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportContacts}
                  disabled={userPlanData.planId === "basic"}
                  fullWidth
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  disabled={userPlanData.planId === "basic"}
                  fullWidth
                >
                  Import
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Contacts Table */}
        <Paper elevation={2}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6">
              Contacts ({filteredContacts.length})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contact</TableCell>
                  <TableCell>Company & Title</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Contacted</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: getDepartmentColor(contact.department),
                            mr: 2,
                          }}
                        >
                          {getInitials(contact.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {contact.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {contact.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{contact.company}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center">
                          <Email sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {contact.email}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Phone sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {contact.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.department}
                        size="small"
                        sx={{
                          backgroundColor: getDepartmentColor(
                            contact.department,
                          ),
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          contact.status.charAt(0).toUpperCase() +
                          contact.status.slice(1)
                        }
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(contact.status),
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(contact.lastContacted).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(contact)}
                        disabled={userPlanData.planId === "basic"}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteContact(contact.id)}
                        disabled={userPlanData.planId === "basic"}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredContacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No contacts found.{" "}
                        {userPlanData.planId === "basic"
                          ? "Upgrade your plan to add contacts."
                          : "Click 'Add Contact' to create your first contact."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Plan Limitations Notice */}
        {userPlanData.planId === "basic" && (
          <Paper elevation={2} sx={{ p: 3, mt: 4, backgroundColor: "#fff3e0" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#e65100" }}>
              Plan Limitations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact Management is not available in the Basic Plan. Upgrade to
              Standard or Premium to access CRM features, including:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Store and manage client contacts
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Track communication history
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Import/export contact data
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Advanced filtering and search
                </Typography>
              </li>
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => (window.location.href = "/features")}
            >
              Upgrade Plan
            </Button>
          </Paper>
        )}

        {/* Quick Actions */}
        {userPlanData.planId !== "basic" && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                } `,
              }}
            >
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{
                  backgroundColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
                onClick={() => handleOpenDialog()}
                disabled={usageStats.contactsUsed >= usageStats.contactsLimit}
              >
                Add New Contact
              </Button>
              <Button
                variant="outlined"
                startIcon={<Email />}
                sx={{
                  borderColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
                onClick={() => (window.location.href = "/crm/email")}
              >
                Send Email
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
                onClick={handleExportContacts}
              >
                Export Contacts
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContactMail />}
                sx={{
                  borderColor: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                  color: `${
                    userPlanData.planId === "basic"
                      ? "#757575"
                      : userPlanData.planId === "standard"
                        ? "#2196f3"
                        : "#ff6f00"
                  } `,
                }}
                onClick={() =>
                  (window.location.href = "/crm/document-tracking")
                }
              >
                Document Tracking
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Contact" : "Add New Contact"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={currentContact.name}
                onChange={(e) =>
                  setCurrentContact({ ...currentContact, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={currentContact.email}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    email: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={currentContact.phone}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    phone: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                value={currentContact.company}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    company: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={currentContact.title}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    title: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={currentContact.status}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="prospect">Prospect</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={currentContact.department}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    department: e.target.value,
                  })
                }
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Project Management">
                  Project Management
                </MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="HR">Human Resources</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Contacted"
                type="date"
                value={currentContact.lastContacted}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    lastContacted: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={currentContact.notes}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    notes: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveContact}
            variant="contained"
            disabled={!currentContact.name || !currentContact.email}
          >
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactManagement;
