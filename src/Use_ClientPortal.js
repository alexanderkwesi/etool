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
  Avatar,
  Badge,
} from "@mui/material";
import {
  Group,
  Email,
  Phone,
  Business,
  CalendarToday,
  Description,
  Visibility,
  Download,
  Edit,
  Delete,
  Search,
  FilterList,
  Add,
  CheckCircle,
  Cancel,
  MoreVert,
  PersonAdd,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const ClientPortal = () => {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  // Check permissions
  const canManageClients = hasPermission("manage_clients");
  const canViewAllClients = hasPermission("view_all_clients");

  // Mock client data - in a real app, this would come from an API
  const mockClients = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      company: "Tech Solutions Inc.",
      phone: "+1 (555) 123-4567",
      status: "active",
      lastActivity: "2024-01-15",
      documents: 5,
      avatarColor: "#2196f3",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      company: "Engineering Corp",
      phone: "+1 (555) 987-6543",
      status: "active",
      lastActivity: "2024-01-14",
      documents: 8,
      avatarColor: "#ff6f00",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@example.com",
      company: "Design Studios",
      phone: "+1 (555) 456-7890",
      status: "inactive",
      lastActivity: "2023-12-20",
      documents: 3,
      avatarColor: "#757575",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.w@example.com",
      company: "Architecture Partners",
      phone: "+1 (555) 234-5678",
      status: "active",
      lastActivity: "2024-01-10",
      documents: 12,
      avatarColor: "#4caf50",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "rbrown@example.com",
      company: "Construction Ltd",
      phone: "+1 (555) 876-5432",
      status: "pending",
      lastActivity: "2024-01-05",
      documents: 2,
      avatarColor: "#9c27b0",
    },
  ];

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      const planData = storedPlanData;
      setUserPlanData({
        planId: planData.planId,
        planName: planData.planName,
        monthlyPrice: planData.monthlyPrice,
        annualPrice: planData.annualPrice,
        billingCycle: planData.billingCycle,
      });
    }

    // Load client data
    setClients(mockClients);
    setFilteredClients(mockClients);
  }, []);

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "inactive":
        return "#f44336";
      case "pending":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle sx={{ color: "#4caf50", fontSize: 16 }} />;
      case "inactive":
        return <Cancel sx={{ color: "#f44336", fontSize: 16 }} />;
      case "pending":
        return <FilterList sx={{ color: "#ff9800", fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const handleAddClient = () => {
    // In a real app, this would open a modal or navigate to a form
    alert("Add Client functionality would open a form here");
  };

  const handleViewClient = (clientId) => {
    // Navigate to client details page
    window.location.href = `/client/${clientId}`;
  };

  const handleEditClient = (clientId) => {
    // In a real app, this would open an edit form
    alert(`Edit client ${clientId}`);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((client) => client.id !== clientId));
    }
  };

  const StatsCard = ({ icon, title, value, subtitle }) => (
    <Card sx={{ textAlign: "center", p: 2, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
          color: `${
            userPlanData.planId === "basic"
              ? "#757575"
              : userPlanData.planId === "standard"
                ? "#2196f3"
                : "#ff6f00"
          }`,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Card>
  );

  const ClientCard = ({ client }) => (
    <Card className="feature-card">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: client.avatarColor,
              width: 50,
              height: 50,
              mr: 2,
            }}
          >
            {client.name.charAt(0)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6">{client.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {client.company}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              {getStatusIcon(client.status)}
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  color: getStatusColor(client.status),
                  fontWeight: "medium",
                }}
              >
                {client.status.toUpperCase()}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Email sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="body2">{client.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Phone sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="body2">{client.phone}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last Activity
            </Typography>
            <Typography variant="body2">{client.lastActivity}</Typography>
          </Box>
          <Badge
            badgeContent={client.documents}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              },
            }}
          >
            <Description />
          </Badge>
        </Box>

        <Box display="flex" gap={1} mt={2}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => handleViewClient(client.id)}
            sx={{
              borderColor: `${
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
              }`,
              color: `${
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
              }`,
              flex: 1,
            }}
          >
            View
          </Button>
          {canManageClients && (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => handleEditClient(client.id)}
                sx={{
                  borderColor: "#757575",
                  color: "#757575",
                  flex: 1,
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Delete />}
                onClick={() => handleDeleteClient(client.id)}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  flex: 1,
                }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );

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
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Client Portal
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
              {/* Show user email if authenticated */}
              {isAuthenticated && user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Managing clients for {user.email}
                </Typography>
              )}
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <TextField
                placeholder="Search clients..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ width: 250 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => alert("Filter functionality")}
              >
                Filter
              </Button>
              {canManageClients && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleAddClient}
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
                  Add Client
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Group sx={{ fontSize: 40 }} />}
              title="Total Clients"
              value={clients.length}
              subtitle="All registered clients"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CheckCircle sx={{ fontSize: 40 }} />}
              title="Active"
              value={clients.filter((c) => c.status === "active").length}
              subtitle="Currently active"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Description sx={{ fontSize: 40 }} />}
              title="Documents"
              value={clients.reduce((sum, client) => sum + client.documents, 0)}
              subtitle="Total shared documents"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Business sx={{ fontSize: 40 }} />}
              title="Companies"
              value={new Set(clients.map((c) => c.company)).size}
              subtitle="Unique companies"
            />
          </Grid>
        </Grid>

        {/* Client List Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              color: `${
                userPlanData.planId === "basic"
                  ? "#757575"
                  : userPlanData.planId === "standard"
                    ? "#2196f3"
                    : "#ff6f00"
              }`,
            }}
          >
            Client Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredClients.length} of {clients.length} clients
          </Typography>
        </Box>

        {/* Client Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {filteredClients.map((client) => (
            <Grid item xs={12} sm={6} md={4} key={client.id}>
              <ClientCard client={client} />
            </Grid>
          ))}
        </Grid>

        {filteredClients.length === 0 && (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Group sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No clients found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? `No clients match "${searchQuery}"`
                : "No clients have been added yet"}
            </Typography>
            {canManageClients && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddClient}
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
                Add Your First Client
              </Button>
            )}
          </Paper>
        )}

        {/* Recent Activity Table */}
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
              }`,
            }}
          >
            Recent Client Activity
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Activity Type</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#2196f3",
                          width: 32,
                          height: 32,
                          mr: 1,
                        }}
                      >
                        J
                      </Avatar>
                      <Typography variant="body2">John Smith</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Document Viewed"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        color: "#2196f3",
                      }}
                    />
                  </TableCell>
                  <TableCell>Project_Specifications.pdf</TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => alert("View details")}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#ff6f00",
                          width: 32,
                          height: 32,
                          mr: 1,
                        }}
                      >
                        S
                      </Avatar>
                      <Typography variant="body2">Sarah Johnson</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Document Downloaded"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        color: "#4caf50",
                      }}
                    />
                  </TableCell>
                  <TableCell>Design_Blueprint.dwg</TableCell>
                  <TableCell>2024-01-14</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => alert("View details")}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Quick Actions */}
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
              }`,
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
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
              onClick={() => (window.location.href = "/crm/contacts")}
            >
              Manage Contacts
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              onClick={() => (window.location.href = "/crm/document-tracking")}
            >
              Document Tracking
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
                color: `${
                  userPlanData.planId === "basic"
                    ? "#757575"
                    : userPlanData.planId === "standard"
                      ? "#2196f3"
                      : "#ff6f00"
                }`,
              }}
              onClick={() => (window.location.href = "/crm/analytics")}
            >
              View Analytics
            </Button>
            {canManageClients && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddClient}
              >
                Add New Client
              </Button>
            )}
          </Box>
          {/* Show permission hint if user doesn't have full access */}
          {!canManageClients && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium for full client management capabilities.
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ClientPortal;
