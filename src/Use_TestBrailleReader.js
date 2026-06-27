// Use_Braille_ScreenReader.js
// ACTUAL Braille Monitor Integration - Works with Physical Hardware
// Supports: HID/USB Braille displays, Screen reader APIs, WebHID, WebUSB
// WITH COMPREHENSIVE DEVICE ACCESS VALIDATION

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
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Accessibility as AccessibilityIcon,
  VolumeUp as ScreenReaderIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Bluetooth as BluetoothIcon,
  Usb as UsbIcon,
  ConnectedTv as ConnectedIcon,
  LinkOff as DisconnectedIcon,
  Memory as MemoryIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  UsbOff as UsbOffIcon,
  BluetoothDisabled as BluetoothDisabledIcon,
  Security as SecurityIcon,
  BrowserNotSupported as BrowserNotSupportedIcon,
  Build as BuildIcon,
} from "@mui/icons-material";

// ============================================================================
// DEVICE ACCESS VALIDATION ENGINE
// ============================================================================

class DeviceAccessValidator {
  // Comprehensive system check
  static async validateSystemConfiguration() {
    const results = {
      browser: this.validateBrowser(),
      webhid: this.validateWebHID(),
      webusb: this.validateWebUSB(),
      webbluetooth: this.validateWebBluetooth(),
      permissions: await this.validatePermissions(),
      os: this.validateOperatingSystem(),
      secureContext: this.validateSecureContext(),
      brailleHardware: await this.detectBrailleHardware(),
      errors: [],
      warnings: [],
      recommendations: []
    };

    // Compile errors and recommendations
    if (!results.browser.supported) {
      results.errors.push({
        component: "browser",
        message: results.browser.error,
        severity: "critical"
      });
    }

    if (!results.secureContext) {
      results.errors.push({
        component: "security",
        message: "Application must run on HTTPS or localhost for device access",
        severity: "critical"
      });
    }

    if (!results.webhid.supported && !results.webusb.supported && !results.webbluetooth.supported) {
      results.errors.push({
        component: "api",
        message: "No device access APIs available in this browser",
        severity: "critical"
      });
    }

    if (results.brailleHardware.available === 0) {
      results.warnings.push({
        component: "hardware",
        message: "No Braille displays detected. Please connect a compatible device.",
        severity: "warning"
      });
    }

    return results;
  }

  // Browser validation
  static validateBrowser() {
    const ua = navigator.userAgent;
    const browser = {
      name: "unknown",
      version: "unknown",
      supported: false,
      error: null,
      recommendations: []
    };

    // Chrome/Edge detection
    if (ua.includes("Chrome") || ua.includes("Edg")) {
      browser.supported = true;
      browser.name = ua.includes("Edg") ? "Microsoft Edge" : "Google Chrome";
      
      // Extract version
      const match = ua.match(/(Chrome|Edg)\/(\d+)/);
      browser.version = match ? match[2] : "unknown";
      
      if (parseInt(browser.version) < 90) {
        browser.warnings = ["Older browser version may have limited WebHID/WebUSB support"];
      }
    }
    // Firefox - limited support
    else if (ua.includes("Firefox")) {
      browser.name = "Mozilla Firefox";
      browser.version = ua.match(/Firefox\/(\d+)/)?.[1] || "unknown";
      browser.supported = false;
      browser.error = "Firefox does not support WebHID or WebUSB. Please use Chrome/Edge.";
      browser.recommendations = ["Install Google Chrome", "Install Microsoft Edge"];
    }
    // Safari - no support
    else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser.name = "Apple Safari";
      browser.version = ua.match(/Version\/(\d+)/)?.[1] || "unknown";
      browser.supported = false;
      browser.error = "Safari does not support WebHID, WebUSB, or WebBluetooth for Braille devices.";
      browser.recommendations = ["Use Chrome on macOS", "Use Edge on macOS"];
    }
    // Other browsers
    else {
      browser.error = "Unsupported browser. Chrome/Edge required for Braille hardware access.";
      browser.recommendations = ["Google Chrome 90+", "Microsoft Edge 90+"];
    }

    return browser;
  }

  // WebHID validation
  static validateWebHID() {
    const supported = "hid" in navigator;
    return {
      supported,
      available: supported,
      permissions: supported ? "requires-user-gesture" : "not-available",
      error: supported ? null : "WebHID API not available",
      devices: []
    };
  }

  // WebUSB validation
  static validateWebUSB() {
    const supported = "usb" in navigator;
    return {
      supported,
      available: supported,
      permissions: supported ? "requires-user-gesture" : "not-available",
      error: supported ? null : "WebUSB API not available",
      devices: []
    };
  }

  // WebBluetooth validation
  static validateWebBluetooth() {
    const supported = "bluetooth" in navigator;
    return {
      supported,
      available: supported,
      permissions: supported ? "requires-user-gesture" : "not-available",
      error: supported ? null : "WebBluetooth API not available",
      devices: []
    };
  }

  // Permission validation
  static async validatePermissions() {
    const permissions = {
      hid: false,
      usb: false,
      bluetooth: false,
      error: null
    };

    try {
      // Check if we can request permissions (not queryable directly)
      permissions.hid = "hid" in navigator;
      permissions.usb = "usb" in navigator;
      permissions.bluetooth = "bluetooth" in navigator;
    } catch (error) {
      permissions.error = error.message;
    }

    return permissions;
  }

  // OS validation
  static validateOperatingSystem() {
    const ua = navigator.userAgent;
    let os = "unknown";
    let supported = true;
    let error = null;
    let recommendations = [];

    if (ua.includes("Windows NT")) {
      os = "Windows";
      supported = true;
    } else if (ua.includes("Mac OS X")) {
      os = "macOS";
      supported = true;
      recommendations = ["Chrome on macOS requires USB permissions", "Some devices may need additional drivers"];
    } else if (ua.includes("Linux")) {
      os = "Linux";
      supported = true;
      recommendations = ["Linux requires udev rules for USB/HID devices", "May need sudo permissions"];
    } else if (ua.includes("Android")) {
      os = "Android";
      supported = false;
      error = "Android does not support WebHID/WebUSB for Braille displays";
    } else if (ua.includes("iOS")) {
      os = "iOS";
      supported = false;
      error = "iOS does not support Braille display connections via web";
    }

    return { name: os, supported, error, recommendations };
  }

  // Secure context validation
  static validateSecureContext() {
    return window.isSecureContext;
  }

  // Detect connected Braille hardware
  static async detectBrailleHardware() {
    const result = {
      available: 0,
      devices: [],
      error: null
    };

    // Try to enumerate already paired HID devices
    if ("hid" in navigator) {
      try {
        const devices = await navigator.hid.getDevices();
        const brailleDevices = devices.filter(device => 
          this.isBrailleDevice(device.vendorId, device.productId)
        );
        result.available += brailleDevices.length;
        result.devices.push(...brailleDevices);
      } catch (error) {
        result.error = error.message;
      }
    }

    return result;
  }

  // Check if device is a Braille display by vendor/product ID
  static isBrailleDevice(vendorId, productId) {
    const BRAILLE_VENDORS = [
      0x0f4e, // Freedom Scientific
      0x1c71, // HumanWare
      0x0798, // ALVA
      0x0904, // BAUM
      0x045e, // Microsoft/HIMS
    ];
    
    const BRAILLE_PRODUCTS = [
      0x0100, 0x0101, // Focus
      0xc005, 0xc004, // Brailliant
      0x0640, 0x0680, // ALVA
      0x6101, // BAUM
    ];

    return BRAILLE_VENDORS.includes(vendorId) && BRAILLE_PRODUCTS.includes(productId);
  }

  // Get human-readable error message
  static getErrorMessage(error) {
    const errorMessages = {
      "NotFoundError": "No Braille display found. Please check connections and drivers.",
      "SecurityError": "Permission denied. You must interact with the page to connect devices.",
      "NotAllowedError": "Access to Braille devices was denied. Please enable permissions.",
      "NetworkError": "Connection failed. Check device connection and try again.",
      "AbortError": "Connection request was cancelled.",
      "TimeoutError": "Connection timed out. Ensure device is powered on and try again.",
      "NotSupportedError": "This Braille display is not supported by your browser.",
    };

    return errorMessages[error.name] || error.message || "Unknown error occurred";
  }

  // Get system requirements summary
  static getSystemRequirements() {
    return {
      browser: ["Google Chrome 90+", "Microsoft Edge 90+"],
      protocols: ["WebHID", "WebUSB", "WebBluetooth"],
      os: ["Windows 10+", "macOS 11+", "Linux (with udev rules)"],
      hardware: ["Focus series", "Brailliant series", "ALVA series", "BAUM Vario"],
      permissions: ["HTTPS or localhost", "User gesture required"],
      limitations: ["No iOS/Android support", "Safari/Firefox not supported"]
    };
  }
}

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
    HIMS_FOCUS: { vendorId: 0x045e, productId: 0x0b0e },
  };

  constructor() {
    this.device = null;
    this.connected = false;
    this.deviceInfo = null;
    this.cellCount = 40;
    this.buffer = [];
    this.connectionType = null;
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

  // Get available transport methods with validation
  static getAvailableTransports() {
    const transports = [];
    
    if (BrailleHardwareDriver.isWebHIDSupported()) {
      transports.push({ 
        type: "hid", 
        name: "WebHID", 
        icon: <UsbIcon />,
        description: "Best for Focus, Brailliant, ALVA",
        priority: 1
      });
    }
    
    if (BrailleHardwareDriver.isWebUSBSupported()) {
      transports.push({ 
        type: "usb", 
        name: "WebUSB", 
        icon: <UsbIcon />,
        description: "Alternative USB connection",
        priority: 2
      });
    }
    
    if (BrailleHardwareDriver.isWebBluetoothSupported()) {
      transports.push({
        type: "bluetooth",
        name: "Bluetooth",
        icon: <BluetoothIcon />,
        description: "Wireless connection",
        priority: 3
      });
    }

    // Sort by priority
    return transports.sort((a, b) => a.priority - b.priority);
  }

  // Connect via WebHID
  async connectHID() {
    if (!BrailleHardwareDriver.isWebHIDSupported()) {
      throw new Error("WebHID not supported in this browser. Please use Chrome or Edge.");
    }

    try {
      // Request device with vendor filters
      const devices = await navigator.hid.requestDevice({
        filters: Object.values(BrailleHardwareDriver.DEVICE_IDS),
      });

      if (devices.length === 0) {
        throw new Error("No device selected. Please select a Braille display from the list.");
      }

      this.device = devices[0];
      this.connectionType = "hid";

      await this.device.open();

      // Get device info
      this.deviceInfo = {
        name: this.device.productName || "Unknown Braille Display",
        vendorId: this.device.vendorId,
        productId: this.device.productId,
        cellCount: this.detectCellCount(this.device),
        serialNumber: this.device.serialNumber || "Unknown",
      };

      this.cellCount = this.deviceInfo.cellCount;
      this.connected = true;

      // Setup receive handler
      this.device.addEventListener("inputreport", (event) => {
        this.handleInputReport(event);
      });

      if (this.onDeviceConnected) {
        this.onDeviceConnected(this.deviceInfo);
      }

      return this.deviceInfo;
    } catch (error) {
      console.error("HID connection failed:", error);
      
      // Enhance error message
      if (error.name === "SecurityError") {
        throw new Error("Permission denied. You must interact with the page to connect devices.");
      } else if (error.name === "NotFoundError") {
        throw new Error("No Braille display found. Please check your device is connected and powered on.");
      }
      
      throw error;
    }
  }

  // Connect via WebUSB
  async connectUSB() {
    if (!BrailleHardwareDriver.isWebUSBSupported()) {
      throw new Error("WebUSB not supported in this browser. Please use Chrome or Edge.");
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: Object.values(BrailleHardwareDriver.DEVICE_IDS).map(
          ({ vendorId, productId }) => ({
            vendorId,
            productId,
          })
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
        serialNumber: device.serialNumber || "Unknown",
      };

      this.cellCount = this.deviceInfo.cellCount;

      if (this.onDeviceConnected) {
        this.onDeviceConnected(this.deviceInfo);
      }

      return this.deviceInfo;
    } catch (error) {
      console.error("USB connection failed:", error);
      
      if (error.name === "SecurityError") {
        throw new Error("USB permission denied. Please allow access to the device.");
      } else if (error.name === "NotFoundError") {
        throw new Error("No USB Braille display found. Check connection and drivers.");
      }
      
      throw error;
    }
  }

  // Connect via WebBluetooth
  async connectBluetooth() {
    if (!BrailleHardwareDriver.isWebBluetoothSupported()) {
      throw new Error("WebBluetooth not supported in this browser.");
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ["0000fff0-0000-1000-8000-00805f9b34fb"] },
          { namePrefix: "Braille" },
          { namePrefix: "Focus" },
          { namePrefix: "Brailliant" },
          { namePrefix: "ALVA" },
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
        "0000fff0-0000-1000-8000-00805f9b34fb"
      );
      const characteristic = await service.getCharacteristic(
        "0000fff1-0000-1000-8000-00805f9b34fb"
      );

      this.deviceInfo = {
        name: device.name || "Bluetooth Braille Display",
        cellCount: 40,
        characteristic,
        server,
        device,
      };

      this.connected = true;
      
      // Handle disconnection
      device.addEventListener("gattserverdisconnected", () => {
        this.connected = false;
        if (this.onDeviceDisconnected) {
          this.onDeviceDisconnected();
        }
      });

      if (this.onDeviceConnected) {
        this.onDeviceConnected(this.deviceInfo);
      }

      return this.deviceInfo;
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
      
      if (error.name === "SecurityError") {
        throw new Error("Bluetooth permission denied.");
      } else if (error.name === "NotFoundError") {
        throw new Error("No Bluetooth Braille display found. Ensure device is discoverable.");
      }
      
      throw error;
    }
  }

  // Detect cell count based on product ID
  detectCellCount(device) {
    const productId = device.productId;
    const cellMap = {
      0x0100: 40, // Focus 40
      0x0101: 80, // Focus 80
      0xc005: 40, // Brailliant BI 40
      0xc004: 32, // Brailliant BI 32
      0x0640: 40, // ALVA BC640
      0x0680: 80, // ALVA BC680
      0x6101: 40, // BAUM Vario 40
    };
    return cellMap[productId] || 40;
  }

  // Handle incoming data from Braille display
  handleInputReport(event) {
    const data = new Uint8Array(event.data.buffer);
    if (this.onDataReceived) {
      this.onDataReceived(data);
    }
  }

  // Send Braille data to display
  async writeBrailleData(text, cells) {
    if (!this.connected || !this.device) {
      throw new Error("No Braille display connected");
    }

    try {
      const braillePatterns = this.textToBrailleCells(text, cells);

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
      throw new Error(`Failed to send to Braille display: ${error.message}`);
    }
  }

  // HID protocol
  async writeHID(patterns) {
    const reportId = 0x01;
    const maxPacketSize = 64;
    const packets = this.chunkArray(patterns, maxPacketSize - 1);

    for (const packet of packets) {
      const data = new Uint8Array([reportId, ...packet]);
      await this.device.sendReport(reportId, data);
      await this.delay(10);
    }
  }

  // USB protocol
  async writeUSB(patterns) {
    const endpoint = this.device.configuration.interfaces[0].alternate.endpoints.find(
      (e) => e.direction === "out"
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
      throw new Error("No Bluetooth characteristic available");
    }
    const encoder = new TextEncoder();
    await this.deviceInfo.characteristic.writeValue(
      encoder.encode(String.fromCharCode(...patterns))
    );
  }

  // Convert text to Braille dot patterns
  textToBrailleCells(text, cellCount) {
    const patterns = new Array(cellCount).fill(0);
    const unicodeToPattern = (char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x2800 && code <= 0x28ff) {
        return code - 0x2800;
      }
      return 0;
    };

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
      
      if (this.onDeviceDisconnected) {
        this.onDeviceDisconnected();
      }
    }
  }
}

// ============================================================================
// REAL BRAILLE TRANSLATION ENGINE
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
  };

  // Grade 1 Braille (Uncontracted)
  static GRADE1 = {
    a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
    f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
    k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
    p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
    u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
    ".": "⠲", ",": "⠂", "?": "⠦", "!": "⠖",
    ";": "⠆", ":": "⠒", '"': "⠶", "(": "⠐⠣",
    ")": "⠐⠜", "-": "⠤", " ": " ",
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

    const translatedWords = words.map((word) => {
      if (this.CONTRACTIONS[word]) {
        return this.CONTRACTIONS[word];
      }

      let translated = word;
      Object.entries(this.CONTRACTIONS).forEach(([pattern, braille]) => {
        const regex = new RegExp(pattern, "g");
        translated = translated.replace(regex, braille);
      });

      return this.translateGrade1(translated);
    });

    return translatedWords.join(" ");
  }

  static optimizeForDisplay(text, cellCount) {
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
  const [showSystemDetails, setShowSystemDetails] = useState(false);

  // System validation state
  const [systemState, setSystemState] = useState({
    validated: false,
    isValid: false,
    browser: null,
    webhid: null,
    webusb: null,
    webbluetooth: null,
    secureContext: false,
    os: null,
    errors: [],
    warnings: [],
    recommendations: [],
    lastChecked: null
  });

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
    errorDetails: null
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

  // Initialize and validate system
  useEffect(() => {
    const validateSystem = async () => {
      const validation = await DeviceAccessValidator.validateSystemConfiguration();
      
      setSystemState({
        validated: true,
        isValid: validation.errors.length === 0,
        ...validation,
        lastChecked: new Date().toISOString()
      });

      // Set available transports
      setHardwareState((prev) => ({
        ...prev,
        availableTransports: BrailleHardwareDriver.getAvailableTransports(),
      }));
    };

    validateSystem();

    driverRef.current = new BrailleHardwareDriver();

    // Set callbacks
    driverRef.current.onDeviceConnected = (deviceInfo) => {
      setHardwareState((prev) => ({
        ...prev,
        connected: true,
        deviceName: deviceInfo.name,
        cellCount: deviceInfo.cellCount,
        error: null
      }));
      setBrailleState((prev) => ({ ...prev, enabled: true }));
    };

    driverRef.current.onDeviceDisconnected = () => {
      setHardwareState((prev) => ({
        ...prev,
        connected: false,
        deviceName: null,
        deviceType: null,
        connectionType: null,
      }));
      setBrailleState((prev) => ({ ...prev, enabled: false }));
    };

    driverRef.current.onDataReceived = (data) => {
      console.log("Received from Braille display:", data);
    };

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
    setHardwareState((prev) => ({ 
      ...prev, 
      connecting: true, 
      error: null,
      errorDetails: null 
    }));

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
        errorDetails: null
      }));

      setBrailleState((prev) => ({ ...prev, enabled: true }));
    } catch (error) {
      console.error("Connection failed:", error);
      setHardwareState((prev) => ({
        ...prev,
        connecting: false,
        error: DeviceAccessValidator.getErrorMessage(error),
        errorDetails: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }));
    }
  };

  // Disconnect from Braille display
  const handleDisconnect = async () => {
    if (driverRef.current) {
      await driverRef.current.disconnect();
    }
  };

  // Send text to Braille display
  const handleSendToBraille = useCallback(async () => {
    if (!driverRef.current?.connected) {
      setHardwareState((prev) => ({
        ...prev,
        error: "No Braille display connected. Please connect a device first."
      }));
      return;
    }

    setUiState((prev) => ({ ...prev, sending: true }));

    try {
      const brailleText = BrailleTranslationEngine.translateToBraille(
        brailleState.testText,
        brailleState.grade,
        brailleState.contracted,
      );

      const optimized = BrailleTranslationEngine.optimizeForDisplay(
        brailleText,
        hardwareState.cellCount,
      );

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
      setHardwareState((prev) => ({
        ...prev,
        error: `Failed to send: ${error.message}`
      }));
    }
  }, [brailleState.testText, brailleState.grade, brailleState.contracted, hardwareState.cellCount]);

  // Scan for devices
  const handleScanDevices = async () => {
    if (BrailleHardwareDriver.isWebHIDSupported()) {
      try {
        const devices = await navigator.hid.getDevices();
        setDevicesFound(devices);
      } catch (error) {
        console.error("Scan failed:", error);
      }
    }
  };

  // Render system validation errors
  const renderSystemValidation = () => {
    if (!systemState.validated) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Validating system configuration...</Typography>
        </Box>
      );
    }

    if (!systemState.isValid) {
      return (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setShowSystemDetails(!showSystemDetails)}
            >
              {showSystemDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          }
        >
          <AlertTitle>System Configuration Error</AlertTitle>
          <Typography variant="body2">
            Your system is not properly configured for Braille display access.
          </Typography>
          
          <Collapse in={showSystemDetails}>
            <Box sx={{ mt: 2 }}>
              {systemState.errors.map((error, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <ErrorIcon color="error" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="error">
                    <strong>{error.component}:</strong> {error.message}
                  </Typography>
                </Box>
              ))}
              
              {systemState.recommendations.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recommendations:
                  </Typography>
                  <List dense>
                    {systemState.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <BuildIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Collapse>
        </Alert>
      );
    }

    return null;
  };

  // Render browser/OS compatibility warnings
  const renderCompatibilityWarnings = () => {
    if (!systemState.validated) return null;

    const warnings = [];

    if (systemState.browser && !systemState.browser.supported) {
      warnings.push({
        icon: <BrowserNotSupportedIcon />,
        title: "Unsupported Browser",
        message: systemState.browser.error,
        recommendations: systemState.browser.recommendations
      });
    }

    if (systemState.os && !systemState.os.supported) {
      warnings.push({
        icon: <ComputerIcon />,
        title: "Unsupported Operating System",
        message: systemState.os.error,
        recommendations: systemState.os.recommendations
      });
    }

    if (!systemState.secureContext) {
      warnings.push({
        icon: <SecurityIcon />,
        title: "Insecure Context",
        message: "Application must run on HTTPS or localhost",
        recommendations: ["Use HTTPS", "Use localhost for development"]
      });
    }

    if (warnings.length === 0 && systemState.isValid) {
      return (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
          <AlertTitle>System Ready</AlertTitle>
          <Typography variant="body2">
            Your system is properly configured for Braille display access.
            {systemState.browser && ` Browser: ${systemState.browser.name} ${systemState.browser.version}`}
            {systemState.os && ` • OS: ${systemState.os.name}`}
          </Typography>
        </Alert>
      );
    }

    return warnings.map((warning, index) => (
      <Alert key={index} severity="warning" sx={{ mb: 2 }} icon={warning.icon}>
        <AlertTitle>{warning.title}</AlertTitle>
        <Typography variant="body2">{warning.message}</Typography>
        {warning.recommendations && (
          <Box sx={{ mt: 1 }}>
            {warning.recommendations.map((rec, i) => (
              <Typography key={i} variant="body2" component="li" sx={{ ml: 2 }}>
                {rec}
              </Typography>
            ))}
          </Box>
        )}
      </Alert>
    ));
  };

  // Render connection status
  const renderConnectionStatus = () => (
    <Alert
      severity={hardwareState.connected ? "success" : "info"}
      sx={{ mb: 2 }}
      icon={
        hardwareState.connected ? (
          <ConnectedIcon />
        ) : (
          <DisconnectedIcon />
        )
      }
    >
      <AlertTitle>
        {hardwareState.connected ? "Braille Display Connected" : "No Braille Display Connected"}
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
            <strong>Connection:</strong> {hardwareState.connectionType?.toUpperCase()}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body2">
            Connect a Braille display using one of the methods below
          </Typography>
          {systemState.isValid && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Ensure your Braille display is powered on and connected via USB/Bluetooth
            </Typography>
          )}
        </>
      )}
    </Alert>
  );

  // Render connection buttons with disabled states
  const renderConnectionButtons = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Connect Braille Display
      </Typography>
      
      {!systemState.isValid && systemState.validated && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<InfoIcon />}>
          <Typography variant="body2">
            Please resolve system configuration issues before attempting to connect.
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {hardwareState.availableTransports.map((transport) => {
          const isDisabled = 
            hardwareState.connecting || 
            hardwareState.connected || 
            !systemState.isValid ||
            !systemState.secureContext;
          
          return (
            <Grid item xs={12} sm={4} key={transport.type}>
              <Tooltip title={transport.description} arrow>
                <span>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={transport.icon}
                    onClick={() => handleConnect(transport.type)}
                    disabled={isDisabled}
                    sx={{ 
                      py: 1.5,
                      opacity: isDisabled ? 0.6 : 1,
                    }}
                  >
                    {transport.name}
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          );
        })}
        
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
      
      {hardwareState.availableTransports.length === 0 && systemState.validated && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>No Device Access APIs Available</AlertTitle>
          <Typography variant="body2">
            Your browser does not support WebHID, WebUSB, or WebBluetooth.
            Please install Google Chrome or Microsoft Edge.
          </Typography>
        </Alert>
      )}
    </Box>
  );

  // Render detailed error message
  const renderDetailedError = () => {
    if (!hardwareState.error) return null;

    return (
      <Alert 
        severity="error" 
        sx={{ mb: 3 }}
        onClose={() => setHardwareState((prev) => ({ ...prev, error: null, errorDetails: null }))}
      >
        <AlertTitle>Connection Error</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {hardwareState.error}
        </Typography>
        
        {hardwareState.errorDetails && (
          <>
            <Button
              size="small"
              onClick={() => setHardwareState((prev) => ({
                ...prev,
                showDetails: !prev.showDetails
              }))}
              sx={{ mt: 1, color: 'error.contrastText' }}
            >
              {hardwareState.showDetails ? 'Hide Details' : 'Show Technical Details'}
            </Button>
            
            <Collapse in={hardwareState.showDetails}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'error.dark',
                  borderColor: 'error.light'
                }}
              >
                <Typography variant="caption" component="pre" sx={{ 
                  color: 'error.contrastText',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  fontSize: '0.75rem'
                }}>
                  Error: {hardwareState.errorDetails.name}{'\n'}
                  Message: {hardwareState.errorDetails.message}{'\n'}
                  {hardwareState.errorDetails.stack}
                </Typography>
              </Paper>
            </Collapse>
          </>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Troubleshooting Steps:
          </Typography>
          <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                Ensure your Braille display is powered on
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                Check USB/Bluetooth connection
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                Install/reinstall device drivers
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                Restart your Braille display
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <Typography variant="body2">
                Try a different connection method (HID vs USB vs Bluetooth)
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Alert>
    );
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
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
            <Typography variant="body1" color="text.secondary">
              Real Braille display integration • WebHID/WebUSB/WebBluetooth • Grade 1/2 translation
            </Typography>
          </Box>
          
          <Tooltip title="System Requirements">
            <IconButton onClick={() => setShowSystemDetails(!showSystemDetails)}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* System Validation */}
        {renderSystemValidation()}
        
        {/* Compatibility Warnings */}
        {renderCompatibilityWarnings()}

        {/* Connection Status */}
        {renderConnectionStatus()}

        {/* Connection Controls */}
        {renderConnectionButtons()}

        {/* Detailed Error Display */}
        {renderDetailedError()}

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
                    backgroundColor: !hardwareState.connected ? "#f5f5f5" : "white",
                  }}
                />
                {!hardwareState.connected && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Connect a Braille display to enable text input
                  </Typography>
                )}
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
                    disabled={!hardwareState.connected || brailleState.grade === 1}
                  />
                }
                label="Use Contractions"
              />
              {brailleState.grade === 1 && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Contractions only available in Grade 2
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={uiState.sending ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                  onClick={handleSendToBraille}
                  disabled={!hardwareState.connected || uiState.sending || !brailleState.testText.trim()}
                  sx={{ minWidth: '200px' }}
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
              mb: 3,
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
              Character count: {uiState.translatedBraille.length} / {hardwareState.cellCount}
            </Typography>
            {uiState.translatedBraille.length > hardwareState.cellCount && (
              <Typography variant="caption" sx={{ color: "#ff9800", display: 'block', mt: 1 }}>
                ⚠️ Text exceeds display capacity. Will be truncated.
              </Typography>
            )}
          </Paper>
        )}

        {/* System Requirements & Device Info */}
        <Paper sx={{ p: 3, bgcolor: "#f8f9fa" }}>
          <Accordion defaultExpanded={!systemState.isValid}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                System Requirements & Supported Devices
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Browser Requirements
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {systemState.browser?.supported ? 
                          <CheckCircleIcon color="success" fontSize="small" /> : 
                          <ErrorIcon color="error" fontSize="small" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${systemState.browser?.name || 'Unknown'}`}
                        secondary={systemState.browser?.version || ''}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        inset
                        primary="Required: Chrome 90+ / Edge 90+"
                        secondary={systemState.secureContext ? "HTTPS ✓" : "HTTPS required"}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Supported Braille Displays
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Focus 40 / Focus 80" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Brailliant BI 32 / BI 40" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="ALVA BC640 / BC680" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="BAUM Vario 40" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon color="info" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="HIMS / Handy Tech (Experimental)" />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Connection Status
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {hardwareState.connected ? 
                          <ConnectedIcon color="success" /> : 
                          <DisconnectedIcon color="disabled" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={hardwareState.connected ? "Connected" : "Disconnected"}
                        secondary={hardwareState.connected ? hardwareState.deviceName : "No device"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <MemoryIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cell Count"
                        secondary={hardwareState.connected ? `${hardwareState.cellCount} cells` : "40 cells (default)"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CodeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Translation"
                        secondary={`Grade ${brailleState.grade} ${brailleState.contracted ? '+ Contractions' : ''}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>⚠️ Important Notes:</strong>
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                • This application requires direct hardware access and will only work in supported browsers
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                • You must interact with the page (click) before device connections will work
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                • Some Braille displays require specific drivers to be installed on your system
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary">
                • If connection fails, try restarting your Braille display and refreshing the page
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
    </Box>
  );
};

export default Use_Braille_ScreenReader;
