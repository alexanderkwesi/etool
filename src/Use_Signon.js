import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
} from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import "./Use_Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useLoginWindowLocalStorage from "../src/Login_Window_LocalStorage";

import { API_BASE, apiFetch, authApi, userApi, plansApi, paypalApi } from "./apiConfig";


const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Custom localStorage hooks
  const [storedPlanId, setStoredPlanId] = useLoginWindowLocalStorage(
    "userPlanId",
    "",
  );
  const [storedEmail, setStoredEmail] = useLoginWindowLocalStorage(
    "userEmail",
    "",
  );
  const [storedUserData, setStoredUserData] = useLoginWindowLocalStorage(
    "userData",
    {},
  );

  // Snackbar helper
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Debug stored values
  useEffect(() => {
    console.log("Stored User Data:", {
      planId: storedPlanId,
      email: storedEmail,
      userData: storedUserData,
    });
  }, [storedPlanId, storedEmail, storedUserData]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  }, [formData, isLogin]);

  // Authentication functions
const login = async () => {
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showSnackbar("Please fix form errors", "warning");
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.post(
      `${API_BASE}/login`,
      {
        email: formData.email.trim(),
        password: formData.password,
      },
      {
        withCredentials: true,
      },
    );

    const result = response.data;

    if (result.status && result.user) {
      // Store user data in localStorage
      setStoredPlanId(result.user.subscription_plan_id || "");
      setStoredEmail(result.user.email || "");
      setStoredUserData({
        id: result.user.id,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        email: result.user.email,
        subscriptionPlanId: result.user.subscription_plan_id,
        isVerified: result.user.is_verified,
      });

      showSnackbar("Login successful! Redirecting...", "success");

      // Simple redirect - let the user-setup page handle verification
      setTimeout(() => {
        navigate("/user-setup");
      }, 1500);
    } else {
      showSnackbar(result.error || "Login failed", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again.";
    showSnackbar(errorMessage, "error");
  } finally {
    setIsLoading(false);
  }
};

  const signup = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar("Please fix form errors", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/signup`,
        {
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      if (response.status === 200 || response.status === 201) {
        // Store basic user data
        setStoredEmail(formData.email.trim());
        setStoredUserData({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        });

        showSnackbar(
          "Account created successfully! Redirecting to login...",
          "success",
        );

        // Redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Google authentication
  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch Google user info:", error);
      throw new Error("Failed to retrieve user information from Google");
    }
  };

  const authenticateWithBackend = async (accessToken, isLogin) => {
    try {
      const response = await fetch(`${API_BASE}/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
          is_login: isLogin,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Backend authentication error:", error);
      throw new Error("Network error. Please try again.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

        if (!userInfo.email) {
          throw new Error("No email received from Google");
        }

        const response = await authenticateWithBackend(
          tokenResponse.access_token,
          isLogin,
        );

        if (response.success) {
          // Store user data from Google
          if (response.user) {
            setStoredPlanId(response.user.subscription_plan_id || "");
            setStoredEmail(response.user.email || "");
            setStoredUserData({
              id: response.user.id,
              firstName: response.user.first_name,
              lastName: response.user.last_name,
              email: response.user.email,
              subscriptionPlanId: response.user.subscription_plan_id,
              isGoogleUser: true,
            });
          }

          showSnackbar(
            isLogin ? "Google login successful!" : "Google signup successful!",
            "success",
          );

          // Redirect based on action
          if (response.action === "signup" || !isLogin) {
            navigate("/user-setup");
          } else {
            navigate("/user-setup");
          }
        } else {
          showSnackbar(response.message || "Authentication failed", "error");
        }
      } catch (error) {
        console.error("Google authentication error:", error);
        showSnackbar(
          error.message || "Google authentication failed. Please try again.",
          "error",
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      if (error.error !== "popup_closed_by_user") {
        showSnackbar(
          "Google authentication was cancelled or failed",
          "warning",
        );
      }
    },
    flow: "implicit",
    scope: "email profile openid",
  });

 const handleSubmit = (e) => {
   e.preventDefault();

   // Prevent multiple submissions while loading
   if (isLoading) return;
   isLogin === true ? login() : signup();
 };

  const verify_category_setup = async () => {
    try {
      const response = await axios.get(`${API_BASE}/verify-category-setup`, {
        withCredentials: true,
      });

      const result = response.data;

      if (result.status === 200 || response.status === 200 || result.success) {
        window.location.href = "/app";
      }
    } catch (error) {
      if (error.response.status === 400) {
        window.location.href = "/user-setup";
      } else {
        window.location.href = "/login";
        alert(error);
      }
    }
  };

  return (
    <div className="auth-page">
      <Container maxWidth="sm">
        <Paper elevation={6} className="auth-paper">
          <Box className="auth-header">
            <Typography variant="h3" component="h1" className="auth-title">
              {isLogin ? "Welcome Back" : "Create Account"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {isLogin
                ? "Sign in to your account"
                : "Join thousands of engineers using DocRevisor"}
            </Typography>
          </Box>

          {/* Google Sign In Button */}
          <Button
            fullWidth
            variant="outlined"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: "#ddd",
              color: "#333",
              "&:hover": {
                borderColor: "#ccc",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {googleLoading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Google sx={{ mr: 1, color: "#DB4437" }} />
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </>
            )}
          </Button>

          <Divider sx={{ mb: 3 }}>or</Divider>

          <Box component="form" className="auth-form">
            {!isLogin && (
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!isLogin && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {isLogin && (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  color="primary"
                  size="small"
                  onClick={() =>
                    showSnackbar(
                      "Password reset functionality would go here",
                      "info",
                    )
                  }
                >
                  Forgot password?
                </Button>
              </Box>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className="auth-submit-btn"
              onClick={() => (isLogin ? login() : signup())} // Arrow function wrapper
              sx={{
                py: 1.5,
                backgroundColor: "#6a0dad",
                "&:hover": {
                  backgroundColor: "#5a0ca8",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => navigate(isLogin ? "/signup" : "/login")}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            {isLogin
              ? "Use your registered email and password to login"
              : "Fill in the form with your information to create an account"}
          </Alert>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};;

export default AuthPage;
