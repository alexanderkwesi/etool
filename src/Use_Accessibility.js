// DeviceAccessibilityMessage.js
// React component for accessible device status announcements
// Supports: Screen readers, Braille displays, VoiceOver, NVDA, JAWS, TalkBack
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tooltip,
  Badge,
  Zoom,
  Fade,
  Slide,
  Grow,
} from "@mui/material";
import {
  VolumeUp as VolumeUpIcon,
  Accessibility as AccessibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Announcement as AnnouncementIcon,
  Hearing as HearingIcon,
  RecordVoiceOver as VoiceOverIcon,
  SettingsVoice as SettingsVoiceIcon,
  TextFields as TextFieldsIcon,
  // ✅ FIXED: Renamed MUI import to avoid conflict with custom BrailleIcon
  Braille as MuiBrailleIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  PriorityHigh as PriorityHighIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  VolumeOff as VolumeOffIcon,
  VolumeMute as VolumeMuteIcon,
  Speaker as SpeakerIcon,
  Headset as HeadsetIcon,
  PhonelinkSetup as PhonelinkSetupIcon,
  DeveloperMode as DeveloperModeIcon,
} from "@mui/icons-material";

// ✅ FIXED: Import custom BrailleIcon correctly
import {CustomBrailleIcon} from "./Braille_Icon.js";

// ============================================================================
// ACCESSIBILITY ANNOUNCEMENT ENGINE
// ============================================================================

/**
 * Screen Reader Announcer - Manages ARIA live regions for assistive technology
 * This is the core engine that makes dynamic content accessible to screen readers and Braille displays
 */
class ScreenReaderAnnouncer {
  constructor() {
    this.announcerPolite = null;
    this.announcerAssertive = null;
    this.statusRegion = null;
    this.initialized = false;
    this.announcementQueue = [];
    this.isProcessing = false;
    this.lastAnnouncement = null;
  }

  /**
   * Initialize ARIA live regions in the DOM
   * These regions are invisible to sighted users but detected by screen readers
   */
  initialize() {
    if (this.initialized) return;

    // Check if we're in a browser environment
    if (typeof document === "undefined") return;

    // Remove any existing announcers to prevent duplicates
    this.removeExistingAnnouncers();

    // Create polite announcer - for non-critical updates
    this.announcerPolite = document.createElement("div");
    this.announcerPolite.setAttribute("aria-live", "polite");
    this.announcerPolite.setAttribute("aria-atomic", "true");
    this.announcerPolite.setAttribute("role", "status");
    this.announcerPolite.id = "screen-reader-announcer-polite";
    this.announcerPolite.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;

    // Create assertive announcer - for urgent/critical updates
    this.announcerAssertive = document.createElement("div");
    this.announcerAssertive.setAttribute("aria-live", "assertive");
    this.announcerAssertive.setAttribute("aria-atomic", "true");
    this.announcerAssertive.setAttribute("role", "alert");
    this.announcerAssertive.id = "screen-reader-announcer-assertive";
    this.announcerAssertive.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;

    // Create status region for persistent status messages
    this.statusRegion = document.createElement("div");
    this.statusRegion.setAttribute("role", "status");
    this.statusRegion.setAttribute("aria-live", "polite");
    this.statusRegion.id = "screen-reader-status-region";
    this.statusRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;

    // Append to body
    document.body.appendChild(this.announcerPolite);
    document.body.appendChild(this.announcerAssertive);
    document.body.appendChild(this.statusRegion);

    this.initialized = true;

    // Announce initialization for screen readers
    this.announce("Screen reader announcements enabled", "polite");
  }

  /**
   * Remove existing announcers to prevent duplicates
   */
  removeExistingAnnouncers() {
    const existingPolite = document.getElementById(
      "screen-reader-announcer-polite",
    );
    const existingAssertive = document.getElementById(
      "screen-reader-announcer-assertive",
    );
    const existingStatus = document.getElementById(
      "screen-reader-status-region",
    );

    if (existingPolite) existingPolite.remove();
    if (existingAssertive) existingAssertive.remove();
    if (existingStatus) existingStatus.remove();
  }

  /**
   * Announce a message to screen readers and Braille displays
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   * @param {Object} options - Additional options
   */
  announce(message, priority = "polite", options = {}) {
    if (!this.initialized) {
      this.initialize();
    }

    if (!message || message.trim() === "") return;

    // Clean the message - remove extra spaces, special characters if needed
    const cleanMessage = this.cleanMessage(message);

    // Don't repeat the exact same message immediately
    if (this.lastAnnouncement === cleanMessage && !options.force) {
      return;
    }

    // Add to queue
    this.announcementQueue.push({
      message: cleanMessage,
      priority,
      timestamp: Date.now(),
      options,
    });

    this.lastAnnouncement = cleanMessage;
    this.processQueue();
  }

  /**
   * Clean message for screen reader consumption
   */
  cleanMessage(message) {
    return message
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[<>]/g, "") // Remove HTML tags
      .trim();
  }

  /**
   * Process the announcement queue
   */
  async processQueue() {
    if (this.isProcessing || this.announcementQueue.length === 0) return;

    this.isProcessing = true;

    while (this.announcementQueue.length > 0) {
      const item = this.announcementQueue.shift();
      const announcer =
        item.priority === "assertive"
          ? this.announcerAssertive
          : this.announcerPolite;

      if (announcer) {
        // Clear the region
        announcer.textContent = "";

        // Small delay to ensure screen readers detect the change
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Set the new message
        announcer.textContent = item.message;

        // Also update status region for persistent devices
        if (this.statusRegion) {
          this.statusRegion.textContent = item.message;
        }

        // Wait before next announcement
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    this.isProcessing = false;
  }

  /**
   * Announce device connection status
   */
  announceDeviceConnection(deviceName, status = "connected") {
    const message =
      status === "connected"
        ? `Braille display connected successfully. Device: ${deviceName}. Ready for use.`
        : `Braille display disconnected. Device: ${deviceName}.`;

    this.announce(message, "assertive");
  }

  /**
   * Announce error messages
   */
  announceError(error, context = "") {
    let message = `Error: ${error}`;
    if (context) {
      message = `${context}: ${error}`;
    }
    this.announce(message, "assertive");
  }

  /**
   * Announce status updates
   */
  announceStatus(status, details = "") {
    let message = status;
    if (details) {
      message = `${status}. ${details}`;
    }
    this.announce(message, "polite");
  }

  /**
   * Clean up announcers
   */
  destroy() {
    this.removeExistingAnnouncers();
    this.initialized = false;
    this.announcementQueue = [];
    this.isProcessing = false;
  }
}

// ============================================================================
// BRAILLE DISPLAY MESSAGE FORMATTER
// ============================================================================

/**
 * BrailleMessageFormatter - Formats messages specifically for Braille displays
 * Braille displays have limited cells (usually 20-80) and need optimized text
 */
class BrailleMessageFormatter {
  /**
   * Format message for Braille display with optimal cell usage
   */
  static formatForBraille(message, maxCells = 40, options = {}) {
    if (!message) return "";

    const {
      showStatus = true,
      showTimestamp = false,
      truncateToFit = true,
      priority = "normal",
    } = options;

    let formatted = message;

    // Remove redundant information for Braille displays
    formatted = this.optimizeForBraille(formatted);

    // Add status indicator if requested
    if (showStatus) {
      formatted = this.addStatusIndicator(formatted, priority);
    }

    // Add timestamp if requested
    if (showTimestamp) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      formatted = `${time} ${formatted}`;
    }

    // Truncate to fit Braille display cell count
    if (truncateToFit && formatted.length > maxCells) {
      formatted = this.truncateMessage(formatted, maxCells);
    }

    return formatted;
  }

  /**
   * Optimize text for Braille display (remove filler words, shorten common phrases)
   */
  static optimizeForBraille(message) {
    let optimized = message
      .replace(/connected successfully/g, "connected")
      .replace(/disconnected/g, "disc")
      .replace(/Braille display/g, "display")
      .replace(/screen reader/g, "reader")
      .replace(/announcement/g, "msg")
      .replace(/notification/g, "notif")
      .replace(/configuration/g, "config")
      .replace(/accessibility/g, "a11y")
      .replace(/ please /g, " ")
      .replace(/ thank you/g, "")
      .replace(/ you can /g, " ")
      .replace(/ would you like to /g, " ");

    // Remove extra spaces
    optimized = optimized.replace(/\s+/g, " ").trim();

    return optimized;
  }

  /**
   * Add status indicator for Braille display
   */
  static addStatusIndicator(message, priority) {
    let indicator = "";

    switch (priority) {
      case "critical":
        indicator = "!!! ";
        break;
      case "high":
        indicator = "!! ";
        break;
      case "normal":
        indicator = "• ";
        break;
      case "low":
        indicator = "  ";
        break;
      default:
        indicator = "• ";
    }

    return `${indicator}${message}`;
  }

  /**
   * Truncate message to fit Braille display cells
   */
  static truncateMessage(message, maxCells) {
    if (message.length <= maxCells) return message;

    // Keep beginning and end for context
    const keepStart = Math.floor(maxCells * 0.6);
    const keepEnd = Math.floor(maxCells * 0.3);
    const truncateMarker = "…";

    const start = message.substring(0, keepStart);
    const end = message.substring(message.length - keepEnd);

    return `${start}${truncateMarker}${end}`;
  }

  /**
   * Format device status for Braille display
   */
  static formatDeviceStatus(deviceName, status, cellCount) {
    let statusSymbol = "";
    switch (status) {
      case "connected":
        statusSymbol = "✓";
        break;
      case "connecting":
        statusSymbol = "⋯";
        break;
      case "disconnected":
        statusSymbol = "✗";
        break;
      case "error":
        statusSymbol = "⚠";
        break;
      default:
        statusSymbol = "?";
    }

    return `${statusSymbol} ${deviceName} (${cellCount})`;
  }
}

// ============================================================================
// ACCESSIBILITY PREFERENCES MANAGER
// ============================================================================

/**
 * AccessibilityPreferences - Manages user preferences for assistive technology
 */
class AccessibilityPreferences {
  static STORAGE_KEY = "accessibility_preferences";

  static getPreferences() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load accessibility preferences:", error);
    }

    return this.getDefaultPreferences();
  }

  static getDefaultPreferences() {
    return {
      screenReader: {
        enabled: true,
        volume: 80,
        rate: 1,
        pitch: 1,
        voice: "default",
        announceDynamicContent: true,
        announcePageChanges: true,
        announceFocus: true,
      },
      braille: {
        enabled: true,
        grade: 2,
        contracted: true,
        cellCount: 40,
        autoAdvance: true,
        showStatusIndicators: true,
      },
      announcements: {
        politeTimeout: 300,
        assertiveTimeout: 50,
        queueEnabled: true,
        deduplicate: true,
      },
      visual: {
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        showAnnouncements: true,
      },
    };
  }

  static savePreferences(preferences) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error("Failed to save accessibility preferences:", error);
      return false;
    }
  }

  static updatePreferences(updates) {
    const current = this.getPreferences();
    const updated = this.deepMerge(current, updates);
    this.savePreferences(updated);
    return updated;
  }

  static deepMerge(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }
}

// ============================================================================
// MAIN ACCESSIBILITY MESSAGE COMPONENT
// ============================================================================

/**
 * DeviceAccessibilityMessage - React component for accessible device status messaging
 *
 * This component provides:
 * 1. Screen reader announcements via ARIA live regions
 * 2. Braille-optimized messages for Braille displays
 * 3. Visual status indicators for sighted users
 * 4. Device connection status announcements
 * 5. Error and warning messages with proper accessibility
 */
const DeviceAccessibilityMessage = ({
  // Device information
  deviceType = "braille", // 'braille', 'screenReader', 'both'
  deviceName = "",
  deviceStatus = "disconnected", // 'connected', 'connecting', 'disconnected', 'error'
  deviceDetails = {},

  // Message content
  title = "",
  message = "",
  priority = "normal", // 'critical', 'high', 'normal', 'low'
  type = "info", // 'info', 'success', 'warning', 'error'

  // Accessibility options
  announceToScreenReader = true,
  formatForBraille = true,
  showVisualIndicator = true,
  persistMessage = false,
  autoDismiss = true,
  dismissAfter = 5000,

  // Callbacks
  onAnnounce = null,
  onDismiss = null,
  onAction = null,

  // Customization
  actions = [],
  className = "",
  sx = {},
}) => {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [isVisible, setIsVisible] = useState(true);
  const [isAnnounced, setIsAnnounced] = useState(false);
  const [brailleFormattedMessage, setBrailleFormattedMessage] = useState("");
  const [announcementId] = useState(
    () =>
      `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  );

  const announcerRef = useRef(null);
  const timeoutRef = useRef(null);
  const messageRef = useRef(null);

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  useEffect(() => {
    // Initialize screen reader announcer
    announcerRef.current = new ScreenReaderAnnouncer();
    announcerRef.current.initialize();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  /**
   * Format message for Braille display when content changes
   */
  useEffect(() => {
    if (formatForBraille && message) {
      const formatted = BrailleMessageFormatter.formatForBraille(
        message,
        deviceDetails.cellCount || 40,
        {
          showStatus: true,
          priority: priority,
        },
      );
      setBrailleFormattedMessage(formatted);
    }
  }, [message, formatForBraille, deviceDetails.cellCount, priority]);

  /**
   * Announce message to screen readers when content changes
   */
  useEffect(() => {
    if (announceToScreenReader && message && !isAnnounced) {
      announceToAssistiveTechnology();
      setIsAnnounced(true);
    }
  }, [message, announceToScreenReader, isAnnounced]);

  /**
   * Handle auto-dismiss
   */
  useEffect(() => {
    if (
      autoDismiss &&
      isVisible &&
      dismissAfter > 0 &&
      persistMessage === false
    ) {
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, dismissAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoDismiss, dismissAfter, isVisible, persistMessage]);

  /**
   * Announce device status changes
   */
  useEffect(() => {
    if (deviceName && announceToScreenReader) {
      switch (deviceStatus) {
        case "connected":
          announcerRef.current?.announceDeviceConnection(
            deviceName,
            "connected",
          );
          break;
        case "disconnected":
          announcerRef.current?.announceDeviceConnection(
            deviceName,
            "disconnected",
          );
          break;
        case "error":
          announcerRef.current?.announceError(
            message || "Device error",
            deviceName,
          );
          break;
      }
    }
  }, [deviceStatus, deviceName, announceToScreenReader]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Announce message to screen readers and Braille displays
   */
  const announceToAssistiveTechnology = useCallback(() => {
    if (!announcerRef.current || !message) return;

    // Build complete announcement
    let announcement = "";

    if (title) {
      announcement += `${title}. `;
    }

    announcement += message;

    if (deviceName && deviceStatus === "connected") {
      announcement += ` Device: ${deviceName}.`;
    }

    // Determine priority for screen reader
    const announcePriority =
      priority === "critical" || type === "error" ? "assertive" : "polite";

    // Announce to screen reader
    announcerRef.current.announce(announcement, announcePriority);

    // Callback
    if (onAnnounce) {
      onAnnounce({
        message: announcement,
        priority: announcePriority,
        deviceType,
        timestamp: new Date().toISOString(),
      });
    }

    // Also update Braille display through ARIA
    if (messageRef.current) {
      messageRef.current.setAttribute("aria-label", announcement);
    }
  }, [
    message,
    title,
    deviceName,
    deviceStatus,
    priority,
    type,
    onAnnounce,
    deviceType,
  ]);

  /**
   * Handle dismiss action
   */
  const handleDismiss = useCallback(() => {
    setIsVisible(false);

    if (onDismiss) {
      onDismiss({
        messageId: announcementId,
        timestamp: new Date().toISOString(),
      });
    }
  }, [onDismiss, announcementId]);

  /**
   * Handle action button click
   */
  const handleAction = useCallback(
    (action) => {
      if (onAction) {
        onAction(action);
      }

      // Announce action to screen reader
      announcerRef.current?.announce(
        `Activated: ${action.label || "action"}`,
        "polite",
      );
    },
    [onAction],
  );

  /**
   * Re-announce message (for refresh button)
   */
  const handleReannounce = useCallback(() => {
    setIsAnnounced(false);
    announceToAssistiveTechnology();
  }, [announceToAssistiveTechnology]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Get icon based on message type
   */
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon />;
      case "warning":
        return <WarningIcon />;
      case "error":
        return <ErrorIcon />;
      case "info":
      default:
        return <InfoIcon />;
    }
  };

  /**
   * Get severity for MUI Alert
   */
  const getSeverity = () => {
    switch (type) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "info":
      default:
        return "info";
    }
  };

  /**
   * Get priority indicator
   */
  const getPriorityIndicator = () => {
    switch (priority) {
      case "critical":
        return {
          icon: <PriorityHighIcon />,
          color: "error",
          label: "Critical",
        };
      case "high":
        return {
          icon: <NotificationsActiveIcon />,
          color: "warning",
          label: "High",
        };
      case "normal":
        return {
          icon: <NotificationsActiveIcon />,
          color: "info",
          label: "Normal",
        };
      case "low":
        return {
          icon: <NotificationsOffIcon />,
          color: "default",
          label: "Low",
        };
      default:
        return { icon: <InfoIcon />, color: "info", label: "Info" };
    }
  };

  /**
   * ✅ FIXED: Get device icon - uses CustomBrailleIcon instead of MUI icon
   */
  const getDeviceIcon = () => {
    if (deviceType === "braille" || deviceType === "both") {
      return <CustomBrailleIcon />;
    }
    if (deviceType === "screenReader") {
      return <VolumeUpIcon />;
    }
    return <AccessibilityIcon />;
  };

  /**
   * Get device status chip
   */
  const getDeviceStatusChip = () => {
    let color = "default";
    let label = deviceStatus;

    switch (deviceStatus) {
      case "connected":
        color = "success";
        label = "Connected";
        break;
      case "connecting":
        color = "info";
        label = "Connecting...";
        break;
      case "disconnected":
        color = "default";
        label = "Disconnected";
        break;
      case "error":
        color = "error";
        label = "Error";
        break;
    }

    return (
      <Chip
        size="small"
        color={color}
        label={label}
        icon={deviceStatus === "connected" ? <CheckCircleIcon /> : undefined}
        sx={{ ml: 1 }}
      />
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!isVisible || !message) {
    return null;
  }

  const priorityIndicator = getPriorityIndicator();

  return (
    <Fade in={isVisible} timeout={300}>
      <Paper
        elevation={3}
        className={className}
        sx={{
          position: "relative",
          mb: 2,
          overflow: "hidden",
          borderLeft: `4px solid ${type === "error" ? "#f44336" : type === "warning" ? "#ff9800" : type === "success" ? "#4caf50" : "#2196f3"}`,
          ...sx,
        }}
        role="region"
        aria-label={`${type} announcement for ${deviceType} device`}
      >
        {/* Hidden ARIA live region for Braille display */}
        <div
          ref={messageRef}
          id={`braille-message-${announcementId}`}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {brailleFormattedMessage || message}
        </div>

        {/* Main Alert */}
        <Alert
          severity={getSeverity()}
          icon={getIcon()}
          sx={{
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* Re-announce button for screen readers */}
              <Tooltip title="Re-announce to screen reader">
                <IconButton
                  size="small"
                  onClick={handleReannounce}
                  aria-label="Re-announce this message"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Dismiss button */}
              <IconButton
                size="small"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          <AlertTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* ✅ FIXED: Now renders custom Braille icon properly */}
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getDeviceIcon()}
            </Box>

            {/* Title */}
            <Typography variant="subtitle2" component="span">
              {title ||
                `${deviceType === "braille" ? "Braille Display" : "Screen Reader"} Announcement`}
            </Typography>

            {/* Device status chip */}
            {deviceName && getDeviceStatusChip()}

            {/* Priority chip */}
            <Chip
              size="small"
              color={priorityIndicator.color}
              label={priorityIndicator.label}
              icon={priorityIndicator.icon}
              sx={{ ml: 1 }}
            />
          </AlertTitle>

          {/* Main message */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            {message}
          </Typography>

          {/* Device details */}
          {deviceName && deviceStatus === "connected" && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                component="div"
              >
                <strong>Device:</strong> {deviceName}
                {deviceDetails.cellCount &&
                  ` • ${deviceDetails.cellCount} cells`}
                {deviceDetails.connectionType &&
                  ` • ${deviceDetails.connectionType}`}
                {deviceDetails.brailleGrade &&
                  ` • Grade ${deviceDetails.brailleGrade}`}
              </Typography>
            </Box>
          )}

          {/* Braille-formatted preview (for sighted users) */}
          {formatForBraille &&
            brailleFormattedMessage &&
            brailleFormattedMessage !== message && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  border: "1px dashed #ccc",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                >
                  <strong>Braille display preview:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                    color: "#333",
                  }}
                >
                  {brailleFormattedMessage}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {brailleFormattedMessage.length} /{" "}
                  {deviceDetails.cellCount || 40} cells
                </Typography>
              </Box>
            )}

          {/* Action buttons */}
          {actions.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="small"
                  variant={action.variant || "contained"}
                  color={action.color || "primary"}
                  startIcon={action.icon}
                  onClick={() => handleAction(action)}
                  aria-label={action.ariaLabel || action.label}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          )}
        </Alert>
      </Paper>
    </Fade>
  );
};

// ============================================================================
// PROP TYPES
// ============================================================================

DeviceAccessibilityMessage.propTypes = {
  // Device information
  deviceType: PropTypes.oneOf(["braille", "screenReader", "both", "none"]),
  deviceName: PropTypes.string,
  deviceStatus: PropTypes.oneOf([
    "connected",
    "connecting",
    "disconnected",
    "error",
    "idle",
  ]),
  deviceDetails: PropTypes.shape({
    cellCount: PropTypes.number,
    connectionType: PropTypes.string,
    brailleGrade: PropTypes.number,
    firmwareVersion: PropTypes.string,
  }),

  // Message content
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  priority: PropTypes.oneOf(["critical", "high", "normal", "low"]),
  type: PropTypes.oneOf(["info", "success", "warning", "error"]),

  // Accessibility options
  announceToScreenReader: PropTypes.bool,
  formatForBraille: PropTypes.bool,
  showVisualIndicator: PropTypes.bool,
  persistMessage: PropTypes.bool,
  autoDismiss: PropTypes.bool,
  dismissAfter: PropTypes.number,

  // Callbacks
  onAnnounce: PropTypes.func,
  onDismiss: PropTypes.func,
  onAction: PropTypes.func,

  // Customization
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
      variant: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.node,
      ariaLabel: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
  sx: PropTypes.object,
};

// ============================================================================
// ACCESSIBILITY STATUS BAR COMPONENT
// ============================================================================

/**
 * AccessibilityStatusBar - Persistent status bar for assistive technology
 * Shows current device connection status and announces changes
 */
export const AccessibilityStatusBar = ({
  brailleConnected = false,
  screenReaderActive = false,
  brailleDeviceName = "",
  screenReaderName = "",
  cellCount = 40,
  onConnect = null,
  onDisconnect = null,
  onSettings = null,
}) => {
  const announcerRef = useRef(null);

  useEffect(() => {
    announcerRef.current = new ScreenReaderAnnouncer();
    announcerRef.current.initialize();

    return () => {
      announcerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (brailleConnected && brailleDeviceName) {
      announcerRef.current?.announce(
        `Braille display ${brailleDeviceName} is connected and ready`,
        "polite",
      );
    }
  }, [brailleConnected, brailleDeviceName]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1.5,
        mb: 2,
        bgcolor: brailleConnected || screenReaderActive ? "#e8f5e9" : "#fff3e0",
        borderBottom: "1px solid",
        borderColor:
          brailleConnected || screenReaderActive ? "#4caf50" : "#ff9800",
        borderRadius: 0,
      }}
      role="region"
      aria-label="Accessibility status bar"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Braille status - ✅ FIXED: Uses CustomBrailleIcon */}
          <Badge
            color={brailleConnected ? "success" : "error"}
            variant="dot"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Tooltip
              title={
                brailleConnected
                  ? "Braille display connected"
                  : "No Braille display"
              }
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CustomBrailleIcon
                  sx={{ color: brailleConnected ? "#4caf50" : "#9e9e9e" }}
                />
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Braille:{" "}
                  {brailleConnected
                    ? brailleDeviceName || "Connected"
                    : "Not connected"}
                </Typography>
              </Box>
            </Tooltip>
          </Badge>

          {/* Screen reader status - ✅ FIXED: Uses MuiBrailleIcon for generic icon */}
          <Badge
            color={screenReaderActive ? "success" : "warning"}
            variant="dot"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Tooltip
              title={
                screenReaderActive
                  ? "Screen reader detected"
                  : "No screen reader detected"
              }
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VolumeUpIcon
                  sx={{ color: screenReaderActive ? "#4caf50" : "#ff9800" }}
                />
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Reader:{" "}
                  {screenReaderActive
                    ? screenReaderName || "Active"
                    : "Inactive"}
                </Typography>
              </Box>
            </Tooltip>
          </Badge>

          {/* Cell count if connected */}
          {brailleConnected && cellCount && (
            <Chip
              size="small"
              label={`${cellCount} cells`}
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {!brailleConnected && onConnect && (
            <Button
              size="small"
              // ✅ FIXED: Uses CustomBrailleIcon for connect button
              startIcon={<CustomBrailleIcon />}
              onClick={onConnect}
            >
              Connect Braille
            </Button>
          )}

          {brailleConnected && onDisconnect && (
            <Button size="small" color="error" onClick={onDisconnect}>
              Disconnect
            </Button>
          )}

          {onSettings && (
            <Button size="small" onClick={onSettings}>
              Settings
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

AccessibilityStatusBar.propTypes = {
  brailleConnected: PropTypes.bool,
  screenReaderActive: PropTypes.bool,
  brailleDeviceName: PropTypes.string,
  screenReaderName: PropTypes.string,
  cellCount: PropTypes.number,
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  onSettings: PropTypes.func,
};

// ============================================================================
// ACCESSIBILITY ANNOUNCEMENT PROVIDER
// ============================================================================

/**
 * AccessibilityAnnouncementProvider - Context provider for app-wide accessibility announcements
 */
export const AccessibilityAnnouncementContext = React.createContext({});

export const AccessibilityAnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [preferences, setPreferences] = useState(
    AccessibilityPreferences.getPreferences(),
  );
  const announcerRef = useRef(null);

  useEffect(() => {
    announcerRef.current = new ScreenReaderAnnouncer();
    announcerRef.current.initialize();

    return () => {
      announcerRef.current?.destroy();
    };
  }, []);

  const announce = useCallback(
    (message, options = {}) => {
      const {
        priority = "normal",
        type = "info",
        title = "",
        deviceType = "both",
        persist = false,
      } = options;

      // Add to announcements list
      const announcement = {
        id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message,
        priority,
        type,
        title,
        deviceType,
        timestamp: new Date().toISOString(),
        persist,
      };

      setAnnouncements((prev) => [...prev, announcement]);

      // Announce to screen reader
      if (preferences.screenReader.enabled) {
        announcerRef.current?.announce(
          message,
          priority === "critical" ? "assertive" : "polite",
        );
      }

      return announcement.id;
    },
    [preferences.screenReader.enabled],
  );

  const dismissAnnouncement = useCallback((id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAllAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  const updatePreferences = useCallback((updates) => {
    const updated = AccessibilityPreferences.updatePreferences(updates);
    setPreferences(updated);
  }, []);

  const value = {
    announcements,
    announce,
    dismissAnnouncement,
    clearAllAnnouncements,
    preferences,
    updatePreferences,
  };

  return (
    <AccessibilityAnnouncementContext.Provider value={value}>
      {/* Render active announcements */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          left: 16,
          zIndex: 9999,
          maxWidth: 600,
          margin: "0 auto",
          pointerEvents: "none",
        }}
      >
        {announcements
          .filter((a) => a.persist || !a.dismissed)
          .map((announcement, index) => (
            <Box key={announcement.id} sx={{ pointerEvents: "auto" }}>
              <DeviceAccessibilityMessage
                {...announcement}
                autoDismiss={!announcement.persist}
                onDismiss={() => dismissAnnouncement(announcement.id)}
              />
            </Box>
          ))}
      </Box>

      {children}
    </AccessibilityAnnouncementContext.Provider>
  );
};

// ============================================================================
// HOOK FOR USING ACCESSIBILITY ANNOUNCEMENTS
// ============================================================================

export const useAccessibilityAnnouncement = () => {
  const context = React.useContext(AccessibilityAnnouncementContext);

  if (!context) {
    throw new Error(
      "useAccessibilityAnnouncement must be used within an AccessibilityAnnouncementProvider",
    );
  }

  return context;
};

// ============================================================================
// EXAMPLE USAGE COMPONENT
// ============================================================================

export const DeviceAccessibilityExample = () => {
  const { announce } = useAccessibilityAnnouncement();
  const [brailleConnected, setBrailleConnected] = useState(false);
  const [brailleDeviceName, setBrailleDeviceName] = useState("");

  const handleConnectBraille = () => {
    setBrailleConnected(true);
    setBrailleDeviceName("Focus 40 Blue");

    announce("Braille display connected successfully", {
      type: "success",
      priority: "high",
      title: "Device Connected",
      deviceType: "braille",
      persist: false,
    });
  };

  const handleDisconnectBraille = () => {
    setBrailleConnected(false);
    setBrailleDeviceName("");

    announce("Braille display disconnected", {
      type: "warning",
      priority: "normal",
      title: "Device Disconnected",
      deviceType: "braille",
      persist: false,
    });
  };

  const handleTestAnnouncement = () => {
    announce(
      "This is a test announcement for screen readers and Braille displays",
      {
        type: "info",
        priority: "normal",
        title: "Test Announcement",
        deviceType: "both",
        persist: true,
      },
    );
  };

  const handleError = () => {
    announce(
      "Failed to connect to Braille display. Please check USB connection.",
      {
        type: "error",
        priority: "critical",
        title: "Connection Error",
        deviceType: "braille",
        persist: true,
      },
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <AccessibilityStatusBar
        brailleConnected={brailleConnected}
        screenReaderActive={true}
        brailleDeviceName={brailleDeviceName}
        cellCount={40}
        onConnect={handleConnectBraille}
        onDisconnect={handleDisconnectBraille}
        onSettings={() => announce("Opening accessibility settings")}
      />

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Device Accessibility Messaging Demo
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          This component demonstrates accessible announcements for:
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              {/* ✅ FIXED: Uses custom Braille icon in demo */}
              <CustomBrailleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Braille Displays"
              secondary="Optimized messages with cell limit awareness"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VolumeUpIcon />
            </ListItemIcon>
            <ListItemText
              primary="Screen Readers"
              secondary="ARIA live regions with polite/assertive priorities"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessibilityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Visual Indicators"
              secondary="Color-coded alerts with device status"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            // ✅ FIXED: Uses custom Braille icon
            startIcon={<CustomBrailleIcon />}
            onClick={handleConnectBraille}
            disabled={brailleConnected}
          >
            Simulate Braille Connect
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDisconnectBraille}
            disabled={!brailleConnected}
          >
            Disconnect Braille
          </Button>

          <Button
            variant="outlined"
            startIcon={<AnnouncementIcon />}
            onClick={handleTestAnnouncement}
          >
            Test Announcement
          </Button>

          <Button variant="outlined" color="error" onClick={handleError}>
            Simulate Error
          </Button>
        </Box>

        {brailleConnected && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>Braille Display Active</AlertTitle>
            <Typography variant="body2">
              {brailleDeviceName} is connected. All announcements will be
              formatted for 40-cell display.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default DeviceAccessibilityMessage;
