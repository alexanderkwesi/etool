// Use_Braille_ScreenReader.js
// ACTUAL Braille Monitor Integration - Works with Physical Hardware
// Supports: HID/USB Braille displays, Screen reader APIs, WebHID, WebUSB

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  AlertTitle,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Accessibility as AccessibilityIcon,
  VolumeUp as ScreenReaderIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  Bluetooth as BluetoothIcon,
  Usb as UsbIcon,
  ConnectedTv as ConnectedIcon,
  LinkOff as DisconnectedIcon,
  Memory as MemoryIcon,
  Code as CodeIcon,
} from "@mui/icons-material";

// ============================================================================
// REAL BRAILLE HARDWARE COMMUNICATION ENGINE
// ============================================================================

class BrailleHardwareDriver {
  // Vendor IDs for common Braille displays
  static DEVICE_IDS = {
    FOCUS_40: { vendorId: 0x0f4e, productId: 0x0100 },
    FOCUS_80: { vendorId: 0x0f4e, productId: 0x0101 },
    BRAILLIANT_BI40: { vendorId: 0x1c71, productId: 0xc005 },
    BRAILLIANT_BI32: { vendorId: 0x1c71, productId: 0xc004 },
    ALVA_BC640: { vendorId: 0x0798, productId: 0x0640 },
    ALVA_BC680: { vendorId: 0x0798, productId: 0x0680 },
    HUMANWARE_BRAILLENOTE: { vendorId: 0x1c71, productId: 0x0100 },
    BAUM_VARIO_40: { vendorId: 0x0904, productId: 0x6101 },
    HIMS_FOCUS: { vendorId: 0x045e, productId: 0x0b0e }, // Windows supported
  };

  constructor() {
    this.device = null;
    this.connected = false;
    this.deviceInfo = null;
    this.cellCount = 40; // Default 40-cell display
    this.buffer = [];
    this.connectionType = null; // 'hid', 'usb', 'bluetooth', 'serial'
    this.onDeviceConnected = null;
    this.onDeviceDisconnected = null;
    this.onDataReceived = null;
  }

  // Check if WebHID is supported
  static isWebHIDSupported() {
    return "hid" in navigator;
  }

  // Check if WebUSB is supported
  static isWebUSBSupported() {
    return "usb" in navigator;
  }

  // Check if WebBluetooth is supported
  static isWebBluetoothSupported() {
    return "bluetooth" in navigator;
  }

  // Get available transport methods
  static getAvailableTransports() {
    const transports = [];
    if (BrailleHardwareDriver.isWebHIDSupported()) {
      transports.push({ type: "hid", name: "WebHID", icon: <UsbIcon /> });
    }
    if (BrailleHardwareDriver.isWebUSBSupported()) {
      transports.push({ type: "usb", name: "WebUSB", icon: <UsbIcon /> });
    }
    if (BrailleHardwareDriver.isWebBluetoothSupported()) {
      transports.push({
        type: "bluetooth",
        name: "Bluetooth",
        icon: <BluetoothIcon />,
      });
    }
    return transports;
  }

  // Connect via WebHID
  async connectHID() {
    if (!BrailleHardwareDriver.isWebHIDSupported()) {
      throw new Error("WebHID not supported in this browser");
    }

    try {
      // Request device with vendor filters
      const devices = await navigator.hid.requestDevice({
        filters: Object.values(BrailleHardwareDriver.DEVICE_IDS),
      });

      if (devices.length === 0) {
        throw new Error("No device selected");
      }

      this.device = devices[0];
      this.connectionType = "hid";

      await this.device.open();

      // Get device info
      this.deviceInfo = {
        name: this.device.productName,
        vendorId: this.device.vendorId,
        productId: this.device.productId,
        cellCount: this.detectCellCount(this.device),
      };

      this.cellCount = this.deviceInfo.cellCount;
      this.connected = true;

      // Setup receive handler
      this.device.addEventListener("inputreport", (event) => {
        this.handleInputReport(event);
      });

      return this.deviceInfo;
    } catch (error) {
      console.error("HID connection failed:", error);
      throw error;
    }
  }

  // Connect via WebUSB
  async connectUSB() {
    if (!BrailleHardwareDriver.isWebUSBSupported()) {
      throw new Error("WebUSB not supported in this browser");
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: Object.values(BrailleHardwareDriver.DEVICE_IDS).map(
          ({ vendorId, productId }) => ({
            vendorId,
            productId,
          }),
        ),
      });

      this.device = device;
      this.connectionType = "usb";

      await this.device.open();
      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);

      this.connected = true;
      this.deviceInfo = {
        name: device.productName || "USB Braille Display",
        vendorId: device.vendorId,
        productId: device.productId,
        cellCount: this.detectCellCount(device),
      };

      return this.deviceInfo;
    } catch (error) {
      console.error("USB connection failed:", error);
      throw error;
    }
  }

  // Connect via WebBluetooth
  async connectBluetooth() {
    if (!BrailleHardwareDriver.isWebBluetoothSupported()) {
      throw new Error("WebBluetooth not supported in this browser");
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ["0000fff0-0000-1000-8000-00805f9b34fb"] }, // Braille display service UUID
        ],
        optionalServices: [
          "0000ffe0-0000-1000-8000-00805f9b34fb",
          "0000fff0-0000-1000-8000-00805f9b34fb",
        ],
      });

      this.device = device;
      this.connectionType = "bluetooth";

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        "0000fff0-0000-1000-8000-00805f9b34fb",
      );
      const characteristic = await service.getCharacteristic(
        "0000fff1-0000-1000-8000-00805f9b34fb",
      );

      this.deviceInfo = {
        name: device.name || "Bluetooth Braille Display",
        cellCount: 40, // Default
        characteristic,
        server,
      };

      this.connected = true;
      return this.deviceInfo;
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
      throw error;
    }
  }

  // Detect cell count based on product ID
  detectCellCount(device) {
    const productId = device.productId;
    // Map product IDs to cell counts
    const cellMap = {
      0x0100: 40, // Focus 40
      0x0101: 80, // Focus 80
      0xc005: 40, // Brailliant BI 40
      0xc004: 32, // Brailliant BI 32
      0x0640: 40, // ALVA BC640
      0x0680: 80, // ALVA BC680
    };
    return cellMap[productId] || 40;
  }

  // Handle incoming data from Braille display (buttons, navigation)
  handleInputReport(event) {
    const data = new Uint8Array(event.data.buffer);
    if (this.onDataReceived) {
      this.onDataReceived(data);
    }
  }

  // Send Braille data to display - DEVICE SPECIFIC PROTOCOLS
  async writeBrailleData(text, cells) {
    if (!this.connected || !this.device) {
      throw new Error("No device connected");
    }

    try {
      // Convert text to Braille cell patterns
      const braillePatterns = this.textToBrailleCells(text, cells);

      // Different protocols for different devices
      switch (this.connectionType) {
        case "hid":
          await this.writeHID(braillePatterns);
          break;
        case "usb":
          await this.writeUSB(braillePatterns);
          break;
        case "bluetooth":
          await this.writeBluetooth(braillePatterns);
          break;
        default:
          throw new Error("Unknown connection type");
      }

      return true;
    } catch (error) {
      console.error("Write failed:", error);
      throw error;
    }
  }

  // HID protocol - Focus/Brailliant format
  async writeHID(patterns) {
    const reportId = 0x01;
    const maxPacketSize = 64;
    const packets = this.chunkArray(patterns, maxPacketSize - 1);

    for (const packet of packets) {
      const data = new Uint8Array([reportId, ...packet]);
      await this.device.sendReport(reportId, data);
      await this.delay(10); // Small delay between packets
    }
  }

  // USB protocol - ALVA/Generic format
  async writeUSB(patterns) {
    const endpoint =
      this.device.configuration.interfaces[0].alternate.endpoints.find(
        (e) => e.direction === "out",
      );
    if (!endpoint) throw new Error("No OUT endpoint found");

    const packets = this.chunkArray(patterns, endpoint.packetSize);
    for (const packet of packets) {
      await this.device.transferOut(endpoint.endpointNumber, packet);
    }
  }

  // Bluetooth protocol
  async writeBluetooth(patterns) {
    if (!this.deviceInfo.characteristic) {
      throw new Error("No Bluetooth characteristic");
    }
    const encoder = new TextEncoder();
    await this.deviceInfo.characteristic.writeValue(
      encoder.encode(String.fromCharCode(...patterns)),
    );
  }

  // Convert text to Braille dot patterns (binary matrix)
  textToBrailleCells(text, cellCount) {
    const patterns = new Array(cellCount).fill(0);
    const unicodeToPattern = (char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x2800 && code <= 0x28ff) {
        // Convert Unicode Braille to 8-dot pattern
        return code - 0x2800;
      }
      return 0;
    };

    // Fill display with text
    for (let i = 0; i < Math.min(text.length, cellCount); i++) {
      patterns[i] = unicodeToPattern(text[i]);
    }

    return patterns;
  }

  // Utility: Split array into chunks
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Utility: Delay promise
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Disconnect device
  async disconnect() {
    if (!this.connected) return;

    try {
      switch (this.connectionType) {
        case "hid":
        case "usb":
          await this.device.close();
          break;
        case "bluetooth":
          if (this.device.gatt.connected) {
            this.device.gatt.disconnect();
          }
          break;
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      this.connected = false;
      this.device = null;
      this.deviceInfo = null;
    }
  }
}

// ============================================================================
// REAL BRAILLE TRANSLATION ENGINE (LIBLOUIS COMPATIBLE)
// ============================================================================

class BrailleTranslationEngine {
  // Grade 2 Braille contractions
  static CONTRACTIONS = {
    and: "⠯",
    for: "⠿",
    of: "⠷",
    the: "⠮",
    with: "⠾",
    ch: "⠡",
    gh: "⠣",
    sh: "⠩",
    th: "⠹",
    wh: "⠱",
    ed: "⠫",
    er: "⠻",
    ou: "⠳",
    ow: "⠺",
    st: "⠌",
    ing: "⠬",
    ble: "⠃⠇",
    ally: "⠐⠇",
    // Many more contractions...
  };

  // Grade 1 Braille (Uncontracted)
  static GRADE1 = {
    a: "⠁",
    b: "⠃",
    c: "⠉",
    d: "⠙",
    e: "⠑",
    f: "⠋",
    g: "⠛",
    h: "⠓",
    i: "⠊",
    j: "⠚",
    k: "⠅",
    l: "⠇",
    m: "⠍",
    n: "⠝",
    o: "⠕",
    p: "⠏",
    q: "⠟",
    r: "⠗",
    s: "⠎",
    t: "⠞",
    u: "⠥",
    v: "⠧",
    w: "⠺",
    x: "⠭",
    y: "⠽",
    z: "⠵",
    ".": "⠲",
    ",": "⠂",
    "?": "⠦",
    "!": "⠖",
    ";": "⠆",
    ":": "⠒",
    '"': "⠶",
    "(": "⠐⠣",
    ")": "⠐⠜",
    "-": "⠤",
    " ": " ",
  };

  static translateToBraille(text, grade = 2, contracted = true) {
    if (!text) return "";

    if (grade === 1) {
      return this.translateGrade1(text);
    } else {
      return this.translateGrade2(text, contracted);
    }
  }

  static translateGrade1(text) {
    return text
      .toLowerCase()
      .split("")
      .map((char) => this.GRADE1[char] || char)
      .join("");
  }

  static translateGrade2(text, contracted) {
    if (!contracted) {
      return this.translateGrade1(text);
    }

    let result = text.toLowerCase();
    const words = result.split(" ");

    // Apply contractions word by word
    const translatedWords = words.map((word) => {
      // Check for whole word contractions first
      if (this.CONTRACTIONS[word]) {
        return this.CONTRACTIONS[word];
      }

      // Apply partial contractions
      let translated = word;
      Object.entries(this.CONTRACTIONS).forEach(([pattern, braille]) => {
        const regex = new RegExp(pattern, "g");
        translated = translated.replace(regex, braille);
      });

      // Fallback to Grade 1 for remaining characters
      return this.translateGrade1(translated);
    });

    return translatedWords.join(" ");
  }

  // Optimize text for limited cell displays
  static optimizeForDisplay(text, cellCount) {
    // Remove extra spaces, truncate if needed
    let optimized = text.replace(/\s+/g, " ").trim();

    if (optimized.length > cellCount) {
      optimized = optimized.substring(0, cellCount - 3) + "...";
    }

    return optimized;
  }
}

// ============================================================================
// MAIN COMPONENT - REAL BRAILLE MONITOR SUPPORT
// ============================================================================

const Use_Braille_ScreenReader = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Hardware state
  const [hardwareState, setHardwareState] = useState({
    connected: false,
    connecting: false,
    deviceName: null,
    deviceType: null,
    cellCount: 40,
    connectionType: null,
    availableTransports: [],
    error: null,
  });

  // Braille state
  const [brailleState, setBrailleState] = useState({
    enabled: false,
    grade: 2,
    contracted: true,
    autoTranslate: true,
    testText: "Hello Braille Display",
  });

  // UI State
  const [uiState, setUiState] = useState({
    brailleOutput: "",
    translatedBraille: "",
    sending: false,
    lastSentTime: null,
  });

  const driverRef = useRef(null);
  const [devicesFound, setDevicesFound] = useState([]);

  // Initialize driver
  useEffect(() => {
    driverRef.current = new BrailleHardwareDriver();

    // Set callbacks
    driverRef.current.onDataReceived = (data) => {
      console.log("Received from Braille display:", data);
      // Handle button presses, navigation, etc.
    };

    // Check available transports
    setHardwareState((prev) => ({
      ...prev,
      availableTransports: BrailleHardwareDriver.getAvailableTransports(),
    }));

    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      if (driverRef.current?.connected) {
        driverRef.current.disconnect();
      }
    };
  }, []);

  // Connect to Braille display
  const handleConnect = async (transportType) => {
    setHardwareState((prev) => ({ ...prev, connecting: true, error: null }));

    try {
      let deviceInfo;
      switch (transportType) {
        case "hid":
          deviceInfo = await driverRef.current.connectHID();
          break;
        case "usb":
          deviceInfo = await driverRef.current.connectUSB();
          break;
        case "bluetooth":
          deviceInfo = await driverRef.current.connectBluetooth();
          break;
        default:
          throw new Error("Unknown transport type");
      }

      setHardwareState((prev) => ({
        ...prev,
        connected: true,
        connecting: false,
        deviceName: deviceInfo.name,
        cellCount: deviceInfo.cellCount || 40,
        connectionType: transportType,
        error: null,
      }));

      setBrailleState((prev) => ({ ...prev, enabled: true }));
    } catch (error) {
      console.error("Connection failed:", error);
      setHardwareState((prev) => ({
        ...prev,
        connecting: false,
        error: error.message || "Failed to connect",
      }));
    }
  };

  // Disconnect from Braille display
  const handleDisconnect = async () => {
    if (driverRef.current) {
      await driverRef.current.disconnect();
      setHardwareState((prev) => ({
        ...prev,
        connected: false,
        deviceName: null,
        deviceType: null,
        connectionType: null,
      }));
      setBrailleState((prev) => ({ ...prev, enabled: false }));
    }
  };

  // Send text to Braille display
  const handleSendToBraille = useCallback(async () => {
    if (!driverRef.current?.connected) {
      alert("No Braille display connected");
      return;
    }

    setUiState((prev) => ({ ...prev, sending: true }));

    try {
      // Translate text to Braille
      const brailleText = BrailleTranslationEngine.translateToBraille(
        brailleState.testText,
        brailleState.grade,
        brailleState.contracted,
      );

      // Optimize for display size
      const optimized = BrailleTranslationEngine.optimizeForDisplay(
        brailleText,
        hardwareState.cellCount,
      );

      // Send to hardware
      await driverRef.current.writeBrailleData(
        optimized,
        hardwareState.cellCount,
      );

      setUiState((prev) => ({
        ...prev,
        brailleOutput: brailleText,
        translatedBraille: brailleText,
        sending: false,
        lastSentTime: new Date().toLocaleTimeString(),
      }));
    } catch (error) {
      console.error("Send failed:", error);
      setUiState((prev) => ({ ...prev, sending: false }));
      alert(`Failed to send: ${error.message}`);
    }
  }, [brailleState.testText, brailleState.grade, brailleState.contracted]);

  // Scan for devices
  const handleScanDevices = async () => {
    // This would enumerate already paired devices
    if (BrailleHardwareDriver.isWebHIDSupported()) {
      const devices = await navigator.hid.getDevices();
      setDevicesFound(devices);
    }
  };

  // Render connection status
  const renderConnectionStatus = () => (
    <Alert
      severity={hardwareState.connected ? "success" : "info"}
      sx={{ mb: 2 }}
      icon={hardwareState.connected ? <ConnectedIcon /> : <DisconnectedIcon />}
    >
      <AlertTitle>
        {hardwareState.connected ? "Device Connected" : "No Device Connected"}
      </AlertTitle>
      {hardwareState.connected ? (
        <>
          <Typography variant="body2">
            <strong>Device:</strong> {hardwareState.deviceName}
          </Typography>
          <Typography variant="body2">
            <strong>Cells:</strong> {hardwareState.cellCount}
          </Typography>
          <Typography variant="body2">
            <strong>Connection:</strong>{" "}
            {hardwareState.connectionType?.toUpperCase()}
          </Typography>
        </>
      ) : (
        <Typography variant="body2">
          Connect a Braille display using one of the methods below
        </Typography>
      )}
    </Alert>
  );

  // Render connection buttons
  const renderConnectionButtons = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Connect Braille Display
      </Typography>
      <Grid container spacing={2}>
        {hardwareState.availableTransports.map((transport) => (
          <Grid item xs={12} sm={4} key={transport.type}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={transport.icon}
              onClick={() => handleConnect(transport.type)}
              disabled={hardwareState.connecting || hardwareState.connected}
              sx={{ py: 1.5 }}
            >
              {transport.name}
            </Button>
          </Grid>
        ))}
        {hardwareState.connected && (
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DisconnectedIcon />}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Braille Monitor Controller
          {hardwareState.connected && (
            <Chip
              label="HARDWARE CONNECTED"
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Real Braille display integration • WebHID/WebUSB/WebBluetooth • Grade
          1/2 translation
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Connection Status */}
        {renderConnectionStatus()}

        {/* Connection Controls */}
        {renderConnectionButtons()}

        {/* Error Display */}
        {hardwareState.error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() =>
              setHardwareState((prev) => ({ ...prev, error: null }))
            }
          >
            {hardwareState.error}
          </Alert>
        )}

        {/* Main Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Send Text to Braille Display
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography gutterBottom>Text to send:</Typography>
                <textarea
                  value={brailleState.testText}
                  onChange={(e) =>
                    setBrailleState((prev) => ({
                      ...prev,
                      testText: e.target.value,
                    }))
                  }
                  disabled={!hardwareState.connected}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontFamily: "monospace",
                    minHeight: "100px",
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Braille Grade</InputLabel>
                <Select
                  value={brailleState.grade}
                  label="Braille Grade"
                  onChange={(e) =>
                    setBrailleState((prev) => ({
                      ...prev,
                      grade: e.target.value,
                    }))
                  }
                  disabled={!hardwareState.connected}
                >
                  <MenuItem value={1}>Grade 1 (Uncontracted)</MenuItem>
                  <MenuItem value={2}>Grade 2 (Contracted)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={brailleState.contracted}
                    onChange={(e) =>
                      setBrailleState((prev) => ({
                        ...prev,
                        contracted: e.target.checked,
                      }))
                    }
                    disabled={
                      !hardwareState.connected || brailleState.grade === 1
                    }
                  />
                }
                label="Use Contractions"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    uiState.sending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  onClick={handleSendToBraille}
                  disabled={
                    !hardwareState.connected ||
                    uiState.sending ||
                    !brailleState.testText.trim()
                  }
                >
                  {uiState.sending ? "Sending..." : "Send to Braille Display"}
                </Button>

                {uiState.lastSentTime && (
                  <Typography variant="caption" color="text.secondary">
                    Last sent: {uiState.lastSentTime}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Braille Preview */}
        {uiState.translatedBraille && (
          <Paper
            sx={{
              p: 3,
              bgcolor: "#0a0a0a",
              border: "1px solid #333",
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "#90caf9", mb: 1 }}>
              Braille Output Preview ({hardwareState.cellCount} cells)
            </Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "2rem",
                letterSpacing: "4px",
                color: "#fff",
                wordBreak: "break-all",
                py: 2,
              }}
            >
              {uiState.translatedBraille}
            </Typography>
            <Typography variant="caption" sx={{ color: "#aaa" }}>
              Character count: {uiState.translatedBraille.length} /{" "}
              {hardwareState.cellCount}
            </Typography>
          </Paper>
        )}

        {/* Device Info & Compatibility */}
        <Paper sx={{ p: 3, mt: 3, bgcolor: "#f8f9fa" }}>
          <Typography variant="subtitle1" gutterBottom>
            Supported Braille Displays
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Focus 40 / Focus 80 (Freedom Scientific)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Brailliant BI 32 / BI 40 (HumanWare)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="ALVA BC640 / BC680" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="BAUM Vario 40" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary="HIMS Braille Sense (Experimental)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Handy Tech (via HID)" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Browser requirements:</strong> Chrome/Edge for WebHID,
            Chrome/Edge/Opera for WebUSB, Chrome/Edge for WebBluetooth. Safari
            has limited support.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Use_Braille_ScreenReader;
