import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Use_Category.css";
import useLoginWindowLocalStorage from "./Login_Window_LocalStorage";
import axios from "axios";
import { API_BASE } from "./apiConfig";

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "75%",
  margin: "40px auto",
  padding: theme.spacing(4),
  border: "3px solid #6a0dad",
  borderRadius: "20px",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "100px",
    height: "100px",
    background: "transparent",
    zIndex: 2,
  },
  "&::before": {
    top: "-50px",
    left: "-50px",
    borderRadius: "50%",
    boxShadow: "0px 50px 0px 0px #f5f5f5",
  },
  "&::after": {
    bottom: "-50px",
    right: "-50px",
    borderRadius: "50%",
    boxShadow: "0px -50px 0px 0px #f5f5f5",
  },
}));

const GradientText = styled(Typography)({
  background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textFillColor: "transparent",
  fontWeight: "bold",
  marginBottom: "20px",
});

const PLAN_TO_TYPE = {
  1: "regular",
  basic: "regular",
  2: "standard",
  3: "standard",
  4: "admin",
  5: "admin",
};

const UserCategorization = () => {
  const [purpose, setPurpose] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [jobType, setJobType] = useState("");
  const [company, setCompany] = useState("");

  const [memberData, setMemberData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [msg, setMsg] = useState({ message: "", severity: "info" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [storedPlanId] = useLoginWindowLocalStorage("userPlanId", "");
  const [storedEmail] = useLoginWindowLocalStorage("userEmail", "");
  const [storedUserData] = useLoginWindowLocalStorage("userData", {});
  const [storedCategory, setStoredCategory] = useLoginWindowLocalStorage(
    "userCategory",
    {},
  );

  // Derive userType directly from plan — no separate show/hide booleans needed
  const [userType, setUserType] = useState(
    () => PLAN_TO_TYPE[String(storedPlanId)] || "regular",
  );

  useEffect(() => {
    if (!storedEmail) {
      showMessage("Please login first", "warning");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [storedEmail]);

  // Keep userType in sync if storedPlanId loads asynchronously
  useEffect(() => {
    if (storedPlanId) {
      setUserType(PLAN_TO_TYPE[String(storedPlanId)] || "regular");
    }
  }, [storedPlanId]);

  const showMessage = (message, severity = "info") => {
    setMsg({ message, severity });
    setOpenSnackbar(true);
  };

  const getVerifiedMember = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/get-verified-member`, {
        withCredentials: true,
      });
      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        if (result && result.user) {
          setMemberData(result.user);
          return result.user;
        }
      }
    } catch (_) {
      // fall through to localStorage fallback
    } finally {
      setIsLoading(false);
    }

    if (storedUserData && (storedUserData.id || storedUserData.email)) {
      const fallback = {
        id: storedUserData.id,
        email: storedUserData.email || storedEmail,
        first_name: storedUserData.firstName || storedUserData.first_name || "",
        last_name: storedUserData.lastName || storedUserData.last_name || "",
        subscription_plan_id:
          storedPlanId || storedUserData.subscription_plan_id,
        is_active: true,
        is_email_verified: storedUserData.is_verified || false,
      };
      setMemberData(fallback);
      return fallback;
    }

    return null;
  };

  const submitCategory = async () => {
    setIsSubmitting(true);
    try {
      const currentMemberData = memberData || (await getVerifiedMember());
      if (!currentMemberData) {
        showMessage("No member data available. Please log in again.", "error");
        return false;
      }

      const apiCategoryData = {
        company_name: company,
        job_title: jobType,
        userType,
        purpose,
        teamSize: teamSize ? parseInt(teamSize) : 0,
        member_id: currentMemberData.id,
        member_firstname: currentMemberData.first_name || "",
        member_lastname: currentMemberData.last_name || "",
        member_email: storedEmail || currentMemberData.email || "",
        subscription_id: storedPlanId || currentMemberData.subscription_plan_id,
        is_email_verified: currentMemberData.is_email_verified || false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${API_BASE}/user/category-setup`,
        apiCategoryData,
        { withCredentials: true },
      );

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        setStoredCategory({
          userType,
          purpose,
          jobType,
          company,
          teamSize,
          memberId: currentMemberData.id,
          memberEmail: storedEmail || currentMemberData.email,
          subscriptionPlanId: storedPlanId,
          categoryId: result.category_id,
          backendData: result.category,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "user_category_data",
          JSON.stringify(result.category),
        );
        localStorage.setItem("category_id", result.category_id);
        showMessage("Profile completed successfully!", "success");
        setTimeout(() => {
          window.location.href = "/app";
        }, 1500);
        return true;
      }
    } catch (error) {
      showMessage(
        error.response?.data?.error ||
          error.message ||
          "Failed to save category",
        "error",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const missingFields = [];
    if (userType === "admin" || userType === "standard") {
      if (!company) missingFields.push("Company Name");
      if (!purpose) missingFields.push("Intended Purpose");
      if (!teamSize) missingFields.push("Team Size");
      if (!jobType) missingFields.push("Job Title");
    } else if (userType === "regular") {
      if (!purpose) missingFields.push("Intended Purpose");
      if (!jobType) missingFields.push("Current Role");
    } else {
      showMessage("Please select user type", "warning");
      return;
    }

    if (missingFields.length > 0) {
      showMessage(`Please fill in: ${missingFields.join(", ")}`, "warning");
      return;
    }

    submitCategory();
  };

  const planLabel = {
    regular: "Begin Plan",
    standard: "Standard Plan",
    admin: "Premium Plan",
  };

  // Shared fields for standard + admin
  const ProfessionalFields = () => (
    <>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="purpose-label">Intended Purpose</InputLabel>
        <Select
          labelId="purpose-label"
          value={purpose}
          label="Intended Purpose"
          onChange={(e) => setPurpose(e.target.value)}
          required
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="design">Engineering Design</MenuItem>
          <MenuItem value="collaboration">Team Collaboration</MenuItem>
          <MenuItem value="documentation">Document Management</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="team-size-label">Team Size</InputLabel>
        <Select
          labelId="team-size-label"
          value={teamSize}
          label="Team Size"
          onChange={(e) => setTeamSize(e.target.value)}
          required
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="1-5">1–5 team members</MenuItem>
          <MenuItem value="6-10">6–10 team members</MenuItem>
          <MenuItem value="11-20">11–20 team members</MenuItem>
          <MenuItem value="20+">20+ team members</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter your company name"
          required
          sx={{ borderRadius: "10px" }}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="job-title-label">Job Title</InputLabel>
        <Select
          labelId="job-title-label"
          value={jobType}
          label="Job Title"
          onChange={(e) => setJobType(e.target.value)}
          required
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="entry">Entry Engineer</MenuItem>
          <MenuItem value="graduate">Graduate Engineer</MenuItem>
          <MenuItem value="junior">Junior Engineer</MenuItem>
          <MenuItem value="senior">Senior Engineer</MenuItem>
          <MenuItem value="manager">Engineering Manager</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  return (
    <div className="user-categorization-container">
      <StyledPaper elevation={8}>
        <GradientText variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </GradientText>

        <Typography variant="body1" align="center" paragraph sx={{ mb: 3 }}>
          Help us personalize your experience by telling us more about yourself
        </Typography>

        <form onSubmit={handleFormSubmit}>
          {/* User Type — read-only display driven by plan */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="user-type-label">I am a...</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              label="I am a..."
              onChange={(e) => setUserType(e.target.value)}
              required
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="regular">Begin Plan User</MenuItem>
              <MenuItem value="standard">Standard Plan User</MenuItem>
              <MenuItem value="admin">Premium Plan User</MenuItem>
            </Select>
          </FormControl>

          {/* Fields shown by userType — no extra boolean needed */}
          {(userType === "standard" || userType === "admin") && (
            <ProfessionalFields />
          )}

          {userType === "regular" && (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="purpose-label">Intended Purpose</InputLabel>
                <Select
                  labelId="purpose-label"
                  value={purpose}
                  label="Intended Purpose"
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="design">Engineering Design</MenuItem>
                  <MenuItem value="learning">Learning</MenuItem>
                  <MenuItem value="personal">Personal Projects</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="job-title-label">Current Role</InputLabel>
                <Select
                  labelId="job-title-label"
                  value={jobType}
                  label="Current Role"
                  onChange={(e) => setJobType(e.target.value)}
                  required
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="entry">Entry Level Engineer</MenuItem>
                  <MenuItem value="hobbyist">Hobbyist</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting || isLoading}
            sx={{
              mt: 2,
              background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
              borderRadius: "10px",
              py: 1.5,
              fontSize: "1.1rem",
              "&:disabled": { background: "#cccccc" },
            }}
          >
            {isSubmitting || isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Complete Profile & Continue to Dashboard"
            )}
          </Button>
        </form>
      </StyledPaper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={msg.severity}
          sx={{ width: "100%" }}
        >
          {msg.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserCategorization;
