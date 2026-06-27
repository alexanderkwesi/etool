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
  LinearProgress,
  Button,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Tag,
  Category,
  Checklist,
  AutoFixHigh,
  ExpandMore,
  Edit,
  Delete,
  Add,
  Save,
  Refresh,
  History,
  Description,
  Security,
  Download,
} from "@mui/icons-material";
// Import the useSecurity hook from your security context
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const TagStructurePage = () => {
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

  // State for tags and structure
  const [tags, setTags] = useState([]);
  const [structure, setStructure] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newStructureItem, setNewStructureItem] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [autoTaggingEnabled, setAutoTaggingEnabled] = useState(false);
  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    taggedDocuments: 0,
    structuredDocuments: 0,
    untaggedDocuments: 0,
  });

  // Check permissions for features
  const canUseAdvancedFeatures = hasPermission("advanced_tagging");
  const canUseBulkOperations = hasPermission("bulk_operations");

  // Fetch user data from localStorage or API
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

      // Simulate initial data - in real app, this would come from backend
      setTags([
        { id: 1, name: "Engineering", color: "#2196f3", count: 12 },
        { id: 2, name: "Compliance", color: "#4caf50", count: 8 },
        { id: 3, name: "Draft", color: "#ff9800", count: 5 },
        { id: 4, name: "Final", color: "#9c27b0", count: 15 },
        { id: 5, name: "Review Needed", color: "#f44336", count: 3 },
      ]);

      setStructure([
        { id: 1, level: "Chapter", name: "Introduction", required: true },
        { id: 2, level: "Section", name: "Executive Summary", required: true },
        { id: 3, level: "Subsection", name: "Methodology", required: false },
        { id: 4, level: "Appendix", name: "References", required: false },
        { id: 5, level: "Attachment", name: "Supporting Documents", required: false },
      ]);

      setDocumentStats({
        totalDocuments: 25,
        taggedDocuments: 18,
        structuredDocuments: 15,
        untaggedDocuments: 7,
      });
    }
  }, []);

  // Plan details
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

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  // Handler functions
  const handleAddTag = () => {
    if (newTag.trim() && tags.length < (userPlanData.planId === "basic" ? 10 : userPlanData.planId === "standard" ? 25 : 50)) {
      const newTagObj = {
        id: tags.length + 1,
        name: newTag,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        count: 0,
      };
      setTags([...tags, newTagObj]);
      setNewTag("");
    }
  };

  const handleAddStructureItem = () => {
    if (newStructureItem.trim()) {
      const newStructureObj = {
        id: structure.length + 1,
        level: "Section",
        name: newStructureItem,
        required: false,
      };
      setStructure([...structure, newStructureObj]);
      setNewStructureItem("");
    }
  };

  const handleDeleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const handleDeleteStructureItem = (id) => {
    setStructure(structure.filter(item => item.id !== id));
  };

  const handleTagToggle = (id) => {
    setSelectedTags(prev =>
      prev.includes(id)
        ? prev.filter(tagId => tagId !== id)
        : [...prev, id]
    );
  };

  const handleApplyTagsToAll = () => {
    if (selectedTags.length > 0) {
      // Simulate applying tags to all documents
      const updatedTags = tags.map(tag =>
        selectedTags.includes(tag.id)
          ? { ...tag, count: tag.count + documentStats.untaggedDocuments }
          : tag
      );
      setTags(updatedTags);
      
      setDocumentStats(prev => ({
        ...prev,
        taggedDocuments: prev.totalDocuments,
        untaggedDocuments: 0,
      }));
      
      setSelectedTags([]);
    }
  };

  const runAutoTagging = () => {
    // Simulate auto-tagging process
    setDocumentStats(prev => ({
      ...prev,
      taggedDocuments: prev.totalDocuments,
      untaggedDocuments: 0,
    }));
  };

  const FeatureCard = ({ icon, title, description, available = true, action }) => (
    <Card className="feature-card" sx={{ opacity: available ? 1 : 0.6, height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {action && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: currentPlan.color,
              color: currentPlan.color,
            }}
            onClick={action}
            disabled={!available}
          >
            {title.includes("Apply") ? "Apply Now" : "Use Feature"}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const UsageMeter = ({ label, used, total, unit = "documents" }) => (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {used}/{total} {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(used / total) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: currentPlan.color,
          },
        }}
      />
    </Box>
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
            backgroundColor: `rgba(${parseInt(currentPlan.color.slice(1, 3), 16)}, ${parseInt(currentPlan.color.slice(3, 5), 16)}, ${parseInt(currentPlan.color.slice(5, 7), 16)}, 0.3)`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Tag & Structure Management
              </Typography>
              <Chip
                label={currentPlan.name}
                sx={{
                  backgroundColor: currentPlan.color,
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
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => (window.location.href = "/security")}
              >
                Security
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => (window.location.href = "/features")}
              >
                Upgrade Plan
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Document Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Description
                sx={{
                  fontSize: 40,
                  color: currentPlan.color,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Documents
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: currentPlan.color,
                }}
              >
                {documentStats.totalDocuments}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Tag
                sx={{
                  fontSize: 40,
                  color: currentPlan.color,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Tagged Documents
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: currentPlan.color,
                }}
              >
                {documentStats.taggedDocuments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((documentStats.taggedDocuments / documentStats.totalDocuments) * 100)}% Complete
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Category
                sx={{
                  fontSize: 40,
                  color: currentPlan.color,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Structured
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: currentPlan.color,
                }}
              >
                {documentStats.structuredDocuments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Properly organized
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Checklist
                sx={{
                  fontSize: 40,
                  color: currentPlan.color,
                }}
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Untagged
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: currentPlan.color,
                }}
              >
                {documentStats.untaggedDocuments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need attention
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Tag Management */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: currentPlan.color,
                }}
              >
                Tag Management
                <Chip
                  label={`${tags.length} tags`}
                  size="small"
                  sx={{ ml: 2, backgroundColor: currentPlan.color, color: "white" }}
                />
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" gap={1} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add new tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || (userPlanData.planId === "basic" && tags.length >= 10)}
                    sx={{
                      backgroundColor: currentPlan.color,
                    }}
                  >
                    Add
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {userPlanData.planId === "basic" 
                    ? `Basic plan: ${tags.length}/10 tags used` 
                    : userPlanData.planId === "standard" 
                      ? `Standard plan: ${tags.length}/25 tags used`
                      : `Premium plan: ${tags.length}/50 tags used`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                {tags.map((tag) => (
                  <ListItem
                    key={tag.id}
                    secondaryAction={
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDeleteTag(tag.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Tag sx={{ color: tag.color }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>{tag.name}</Typography>
                          <Chip
                            label={`${tag.count} docs`}
                            size="small"
                            sx={{ backgroundColor: tag.color, color: "white" }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Document Structure */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: currentPlan.color,
                }}
              >
                Document Structure Template
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" gap={1} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add new structure element..."
                    value={newStructureItem}
                    onChange={(e) => setNewStructureItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStructureItem()}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddStructureItem}
                    sx={{
                      backgroundColor: currentPlan.color,
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                {structure.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Box>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={item.required}
                              onChange={() => {
                                const updated = structure.map(s =>
                                  s.id === item.id ? { ...s, required: !s.required } : s
                                );
                                setStructure(updated);
                              }}
                            />
                          }
                          label="Required"
                          labelPlacement="start"
                        />
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDeleteStructureItem(item.id)} sx={{ ml: 1 }}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Category sx={{ color: currentPlan.color }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip
                            label={item.level}
                            size="small"
                            sx={{ backgroundColor: currentPlan.color, color: "white" }}
                          />
                          <Typography>{item.name}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Features & Actions */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: currentPlan.color,
                mt: 2,
              }}
            >
              Features & Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Checklist sx={{ color: currentPlan.color }} />}
                  title="Bulk Tagging"
                  description="Apply selected tags to multiple documents at once"
                  available={canUseBulkOperations}
                  action={() => handleApplyTagsToAll()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<AutoFixHigh sx={{ color: currentPlan.color }} />}
                  title="Auto-Tagging"
                  description="Automatically tag documents based on content analysis"
                  available={canUseAdvancedFeatures}
                  action={() => runAutoTagging()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Refresh sx={{ color: currentPlan.color }} />}
                  title="Structure Validation"
                  description="Validate document structure against template"
                  available={true}
                  action={() => alert("Validating structure...")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Download sx={{ color: currentPlan.color }} />}
                  title="Export Configuration"
                  description="Export tag and structure configuration"
                  available={userPlanData.planId !== "basic"}
                  action={() => alert("Exporting configuration...")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Tag Selection & Application */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: currentPlan.color,
            }}
          >
            Tag Selection & Application
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Select Tags to Apply
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                {tags.map((tag) => (
                  <FormControlLabel
                    key={tag.id}
                    control={
                      <Checkbox
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        sx={{
                          color: tag.color,
                          '&.Mui-checked': {
                            color: tag.color,
                          },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: tag.color, borderRadius: '50%' }} />
                        <Typography>{tag.name}</Typography>
                        <Chip label={tag.count} size="small" variant="outlined" />
                      </Box>
                    }
                  />
                ))}
              </Box>
              
              <Box display="flex" gap={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Checklist />}
                  onClick={handleApplyTagsToAll}
                  disabled={selectedTags.length === 0}
                  sx={{
                    backgroundColor: currentPlan.color,
                  }}
                >
                  Apply to All Documents
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => setSelectedTags([])}
                  sx={{
                    borderColor: currentPlan.color,
                    color: currentPlan.color,
                  }}
                >
                  Clear Selection
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Auto-Tagging Settings</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoTaggingEnabled}
                      onChange={(e) => setAutoTaggingEnabled(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: currentPlan.color,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: currentPlan.color,
                        },
                      }}
                    />
                  }
                  label="Enable Auto-Tagging"
                />
              </Box>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Advanced Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    Configure automatic tagging rules, content analysis parameters, and structure validation settings.
                    {userPlanData.planId === "basic" && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, color: currentPlan.color }}>
                        Upgrade to Standard or Premium for advanced configuration options.
                      </Typography>
                    )}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Paper>

        {/* Progress & Usage */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: currentPlan.color,
            }}
          >
            Progress & Usage
          </Typography>
          <UsageMeter
            label="Tagging Progress"
            used={documentStats.taggedDocuments}
            total={documentStats.totalDocuments}
          />
          <UsageMeter
            label="Structure Compliance"
            used={documentStats.structuredDocuments}
            total={documentStats.totalDocuments}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Auto-tagging features require Standard or Premium plan. Basic plan supports manual tagging only.
          </Typography>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: currentPlan.color,
            }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Checklist />}
              sx={{
                backgroundColor: currentPlan.color,
              }}
              onClick={() => alert("Starting bulk tagging...")}
            >
              Bulk Tag Documents
            </Button>
            <Button
              variant="outlined"
              startIcon={<AutoFixHigh />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              disabled={!autoTaggingEnabled}
              onClick={runAutoTagging}
            >
              Run Auto-Tagging
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => alert("Saving configuration...")}
            >
              Save Configuration
            </Button>
            <Button
              variant="outlined"
              startIcon={<History />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => (window.location.href = "/remediation/history")}
            >
              View History
            </Button>
          </Box>
          
          {/* Show upgrade hint if user doesn't have permission for a feature */}
          {!canUseAdvancedFeatures && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Upgrade to Premium for advanced features like auto-tagging and bulk operations.
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default TagStructurePage;