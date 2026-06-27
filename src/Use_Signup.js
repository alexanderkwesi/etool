import React, { useState, useCallback } from "react";
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

// ─── Backend URL — must match server.py port (5000) and be in CORS origins ───
const API_BASE = "http://127.0.0.1:5000/api";

// ─── Safe localStorage wrapper ────────────────────────────────────────────────
const store = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  },
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (_) {
      return fallback;
    }
  },
};

// ─── Human-readable error from an axios error ────────────────────────────────
function parseAxiosError(err) {
  if (err.response) {
    // Server replied with a non-2xx status
    return (
      err.response.data?.error ||
      err.response.data?.message ||
      `Server error ${err.response.status}`
    );
  }
  if (err.request) {
    // Request was made but no response received (CORS, server down, wrong port)
    return "Cannot reach the server. Make sure the backend is running on port 5000.";
  }
  return err.message || "An unexpected error occurred.";
}

// ─────────────────────────────────────────────────────────────────────────────
const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);
  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email is invalid";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!isLogin) {
      if (!formData.firstName.trim()) errs.firstName = "First name is required";
      if (!formData.lastName.trim()) errs.lastName = "Last name is required";
      if (!formData.confirmPassword) {
        errs.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
    }
    return errs;
  }, [formData, isLogin]);

  // ── LOGIN ───────────────────────────────────────────────────────────────────
  const login = useCallback(async () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showSnackbar("Please fix form errors", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE}/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { withCredentials: true },
      );

      if (data.status === 200 && data.user) {
        store.set("userData", data.user);
        store.set("userEmail", data.user.email);
        store.set("userPlanId", data.user.subscription_plan_id || "");

        showSnackbar("Login successful! Redirecting...", "success");
        navigate("/user-setup");
      
         // try
         // {

         //     const set = await axios.get(`${API_BASE}/verify-category-setup`, {
         //       withCredentials: true,
         //     });
            
          //  navigate(
         //     set.data?.category_setup_complete ? "/app" : "/user-setup",
          //  );
          
         // } catch {
         //   navigate("/user-setup");
         // }
       
      } else {
        showSnackbar(
          data.error || "Login failed. Check your credentials.",
          "error",
        );
      }
    } catch (err) {
      showSnackbar(parseAxiosError(err), "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, showSnackbar, navigate]);

  // ── SIGNUP ──────────────────────────────────────────────────────────────────
  // Calls POST /api/signup directly — no payment lookup needed for a free plan.
  const signup = useCallback(async () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showSnackbar("Please fix form errors", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const { data, status } = await axios.post(
        `${API_BASE}/signup`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
        { withCredentials: true, timeout: 15000 },
      );

      if (status === 200 || status === 201) {
        store.set("userData", data.user || {});
        store.set("userEmail", formData.email.trim().toLowerCase());

        showSnackbar("Account created! Redirecting to login...", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showSnackbar(data.error || "Signup failed. Please try again.", "error");
      }
    } catch (err) {
      showSnackbar(parseAxiosError(err), "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, showSnackbar, navigate]);

  // ── GOOGLE AUTH ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "email profile openid",

    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // 1. Fetch profile from Google
        const gRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        if (!gRes.ok) throw new Error(`Google API error: ${gRes.status}`);
        const userInfo = await gRes.json();
        if (!userInfo.email) throw new Error("No email received from Google");

        // 2. POST to server.py /api/auth/google/callback
        const { data } = await axios.post(
          `${API_BASE}/auth/google/callback`,
          {
            googleId: userInfo.sub,
            email: userInfo.email,
            firstName: userInfo.given_name || "",
            lastName: userInfo.family_name || "",
            displayName: userInfo.name || "",
            avatar: userInfo.picture || "",
          },
          { withCredentials: true },
        );

        if (data.success && data.user) {
          store.set("userData", data.user);
          store.set("userEmail", data.user.email);
          showSnackbar(
            isLogin ? "Google login successful!" : "Google signup successful!",
            "success",
          );
          setTimeout(() => navigate("/user-setup"), 1000);
        } else {
          showSnackbar(data.message || "Google authentication failed", "error");
        }
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          (err.request && !err.response
            ? "Cannot reach the server. Make sure the backend is running on port 5000."
            : err.message) ||
          "Google authentication failed. Please try again.";
        showSnackbar(msg, "error");
      } finally {
        setGoogleLoading(false);
      }
    },

    onError: (err) => {
      if (err.error !== "popup_closed_by_user") {
        showSnackbar(
          "Google authentication was cancelled or failed.",
          "warning",
        );
      }
    },
  });

  // ── Form submit — e.preventDefault() prevents full-page reload ──────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    isLogin ? login() : signup();
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
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

          {/* Google button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: "#ddd",
              color: "#333",
              "&:hover": { borderColor: "#ccc", backgroundColor: "#f5f5f5" },
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

          {/* Form — onSubmit handles Enter key and button click */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
                      onClick={() => setShowPassword((v) => !v)}
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
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <Button
                  color="primary"
                  size="small"
                  onClick={() =>
                    showSnackbar("Password reset not yet implemented.", "info")
                  }
                >
                  Forgot password?
                </Button>
              </Box>
            )}

            {/* type="submit" so pressing Enter also submits */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 1,
                py: 1.5,
                backgroundColor: "#6a0dad",
                "&:hover": { backgroundColor: "#5a0ca8" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
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

          <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
            {isLogin
              ? "Enter your registered email and password to sign in."
              : "Fill in the form above to create a free account."}
            <Box
              component="span"
              onClick={() => navigate("/falogin")}
              sx={{ display: "block", color: "navy", mt: 1, cursor: "pointer" }}
            >
              Try other ways to login
            </Box>
          </Alert>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AuthPage;
