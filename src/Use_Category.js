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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Use_Category.css";
import useLoginWindowLocalStorage from "../src/Login_Window_LocalStorage";
import axios from "axios";

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

const API_BASE = "http://127.0.0.1:5000/api";

const UserCategorization = () => {
  const [userType, setUserType] = useState("");

  // FIXED: Proper hook usage - store plan ID in localStorage
  const [storedPlanId, setStoredPlanId] = useLoginWindowLocalStorage(
    "userPlanId",
    ""
  );

  // FIXED: Store user category data in localStorage
  const [storedCategory, setStoredCategory] = useLoginWindowLocalStorage(
    "userCategory",
    {}
  );

  // FIXED: Store member email in localStorage
  const [storedEmail, setStoredEmail] = useLoginWindowLocalStorage(
    "userEmail",
    ""
  );

  const [purpose, setPurpose] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [jobType, setJobType] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [company, setCompany] = useState("");
  const [msg, setMsg] = useState({ message: "", severity: "info" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hasPremiumPlan, setHasPremiumPlan] = useState(false);
  const [hasValidMember, setHasValidMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug useEffect to monitor memberData changes
  useEffect(() => {
    console.log("memberData updated:", memberData);
    if (memberData && Object.keys(memberData).length > 0) {
      console.log("memberData values:", {
        id: memberData.id,
        email: memberData.email,
        first_name: memberData.first_name,
        subscription_plan_id: memberData.subscription_plan_id,
      });

      // FIXED: Store member data in localStorage when available
      if (memberData.subscription_plan_id) {
        setStoredPlanId(memberData.subscription_plan_id);
      }
      if (memberData.email) {
        setStoredEmail(memberData.email);
      }
    }
  }, [memberData, setStoredPlanId, setStoredEmail]);

  // FIXED: Show stored data on component mount (for debugging)
  useEffect(() => {
    console.log("Stored Plan ID:", storedPlanId);
    console.log("Stored Email:", storedEmail);
    console.log("Stored Category:", storedCategory);
  }, []);

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  const showMessage = (message, severity = "info") => {
    setMsg({ message, severity });
    setOpenSnackbar(true);
  };

  const get_verified_member = async () => {
    try {
      const response = await axios.get(`${API_BASE}/get-verified-member`, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        if (result && result.user) {
          setMemberData(result.user);

          // FIXED: Store email in localStorage
          if (result.user?.email) {
            setStoredEmail(result.user.email);
          }

          showMessage("Member data retrieved successfully", "success");

          // Proceed to category after getting member data
          const ok = await category(result.user);
          if (ok) {
            return ok;
          } else {
            showMessage("Category data error, try again", "error");
            return false;
          }
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to get member data";
      showMessage(errorMsg, "error");
      return false;
    }
  };

  const category = async (memberDataToUse = memberData) => {
    try {
      setIsSubmitting(true);

      const currentMemberData = memberDataToUse || memberData;

      if (!currentMemberData) {
        showMessage("No member data available", "error");
        setIsSubmitting(false);
        return false;
      }

      // Safe property access with fallbacks
      const memberEmail = storedEmail || currentMemberData?.email || "";
      const memberId = currentMemberData?.id || 0;

      // Check if we have the minimum required data
      if (!memberId) {
        showMessage("Member ID not found", "error");
        setIsSubmitting(false);
        return false;
      }

      // FIXED: Store category data in localStorage before sending to API
      const categoryDataToStore = {
        userType: userType,
        purpose: purpose,
        jobType: jobType,
        company: company,
        teamSize: teamSize,
        memberId: memberId,
        memberEmail: memberEmail,
      };
      setStoredCategory(categoryDataToStore);

      // Prepare data for backend based on user type requirements
      const categoryData = {
        company_name: company,
        job_title: jobType,
        userType: userType,
        purpose: purpose,
        teamSize: teamSize ? teamSize : 0,
        member_id: memberId,
        member_firstname: currentMemberData?.first_name || "",
        member_lastname: currentMemberData?.last_name || "",
        member_email: memberEmail,
        google_member_id: currentMemberData?.user_google_member_id || 0,
        google_name: currentMemberData?.name || "",
        google_email: currentMemberData?.google_email || "",
        is_email_verified: currentMemberData?.is_email_verified || false,
        is_active: currentMemberData?.is_active || true,
        created_at: currentMemberData?.created_at,
        updated_at: currentMemberData?.updated_at,
      };

      const response = await axios.post(`${API_BASE}/category`, categoryData, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        showMessage("Category successfully stored", "success");

        const subscriptionPlan = currentMemberData?.subscription_plan_id || "";
        setHasPremiumPlan(subscriptionPlan === "Premium Plan");
        setHasValidMember(!!currentMemberData?.id);

        // Store category data in localStorage for app to access
        localStorage.setItem(
          "user_category_data",
          JSON.stringify(result.category)
        );
        localStorage.setItem("category_id", result.category_id);

        // FIXED: Store final data in localStorage before redirect
        setStoredPlanId(currentMemberData?.subscription_plan_id || "");

        // Show stored data before redirect (for debugging)
        console.log("Final stored data:", {
          planId: storedPlanId,
          email: storedEmail,
          category: storedCategory,
        });

        // Redirect to app after successful submission
        setTimeout(() => {
          window.location.href = "/app";
        }, 1000);

        return true;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to store category";
      showMessage(errorMsg, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    // Validate required fields based on user type
    if (userType === "admin") {
      if (!company || !purpose || !teamSize || !jobType) {
        showMessage(
          "Please fill all required fields for administrator",
          "warning"
        );
        return;
      }
    } else if (userType === "regular") {
      if (!purpose || !jobType) {
        showMessage("Please fill all required fields", "warning");
        return;
      }
    } else {
      showMessage("Please select user type", "warning");
      return;
    }

    get_verified_member();
  };

  return (
    <div className="user-categorization-container">
      <StyledPaper elevation={8}>
        <GradientText variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </GradientText>

        <Typography variant="body1" align="center" paragraph sx={{ mb: 3 }}>
          Help us personalize your experience by telling us more about yourself
        </Typography>

        {/* FIXED: Debug info - show stored data */}
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Stored Plan ID: {storedPlanId || "None"}
        </Typography>

        <form onSubmit={handleFormSubmit}>
          {/* User Type Selection */}
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
              <MenuItem value="regular">Regular User</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>

          {/* Show additional fields only for admin users */}
          {userType === "admin" && (
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
                  <MenuItem value="1-5">1-5 team members</MenuItem>
                  <MenuItem value="6-10">6-10 team members</MenuItem>
                  <MenuItem value="11-20">11-20 team members</MenuItem>
                  <MenuItem value="20+">20+ team members</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="company-name-label">Company Name</InputLabel>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={company}
                    onChange={handleCompanyChange}
                    placeholder="Enter your company name"
                    required
                    margin="normal"
                  />
                </Box>
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
          )}

          {/* Show basic fields for regular users */}
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
            disabled={isSubmitting}
            sx={{
              mt: 2,
              background: "linear-gradient(45deg, #6a0dad, #8a2be2)",
              borderRadius: "10px",
              py: 1.5,
              fontSize: "1.1rem",
              "&:disabled": {
                background: "#cccccc",
              },
            }}
          >
            {isSubmitting ? "Processing..." : "Continue to Dashboard"}
          </Button>
        </form>

        {/* Display current plan information */}
        {hasValidMember && (
          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Current Plan: {hasPremiumPlan ? "Premium Plan" : "Standard Plan"}
          </Typography>
        )}
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
