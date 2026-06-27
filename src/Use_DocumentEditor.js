import React, { useState, useEffect, useRef } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  Edit,
  Save,
  Download,
  Upload,
  Print,
  Undo,
  Redo,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  InsertPhoto,
  InsertLink,
  TableChart,
  Spellcheck,
  Translate,
  History,
  Settings,
  CloudUpload,
  CloudDownload,
  Share,
  Lock,
  LockOpen,
  AddComment,
  PictureAsPdf,
  Description,
  AutoFixHigh,
  SmartToy,
  Image,
  ContactMail,
  ImageSearch,
  TextSnippet,
  DocumentScanner,
  Summarize,
  ContentCopy,
  Delete,
  Add,
  ArrowBack,
  FormatQuote,
  Code,
  Functions,
  Highlight,
  KeyboardVoice,
  VideoLabel,
  AccountTree,
  School,
  Assessment,
} from "@mui/icons-material";
import { useSecurity } from "./Use_Security";
import { useLocalStorage } from "./hooks/Use_LocalStorage";
import "./Use_App.css";

const DocumentEditor = () => {
  const { isAuthenticated, user, hasPermission } = useSecurity();

  const [userPlanData, setUserPlanData] = useState({
    planId: "basic",
    planName: "Begin Plan",
  });

  // Document states
  const [document, setDocument] = useState({
    id: "doc-" + Date.now(),
    title: "Untitled Document",
    content: "",
    format: "html",
    language: "en",
    wordCount: 0,
    lastSaved: new Date(),
    isPublic: false,
    isEncrypted: false,
    collaborators: [],
  });

  // Editor states
  const [editorContent, setEditorContent] = useState(
    "<h1>Start editing your document...</h1><p>Type your content here...</p>",
  );
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [fontSize, setFontSize] = useState("14");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [grammarCheckEnabled, setGrammarCheckEnabled] = useState(true);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);

  // NEW FEATURES: OCR States
  const [ocrText, setOcrText] = useState("");
  const [showOcrDialog, setShowOcrDialog] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrImages, setOcrImages] = useState([]);

  // NEW FEATURES: AI States
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiAction, setAiAction] = useState("summarize");
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);

  // NEW FEATURES: Editor History
  const [editorHistory, setEditorHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // NEW FEATURES: Document Statistics
  const [documentStats, setDocumentStats] = useState({
    wordCount: 0,
    charCount: 0,
    pageCount: 0,
    readingTime: 0,
    complexity: "Basic",
  });

  // NEW FEATURES: OCR Usage Tracking
  const [ocrUsage, setOcrUsage] = useState({
    scansUsed: 0,
    scansLimit: 5,
  });

  // NEW FEATURES: AI Usage Tracking
  const [aiUsage, setAiUsage] = useState({
    requestsUsed: 0,
    requestsLimit: 0,
  });

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const ocrFileInputRef = useRef(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedPlanData = useLocalStorage.getItem("Use_Plan_Data");
    if (storedPlanData) {
      setUserPlanData({
        planId: storedPlanData.planId || "basic",
        planName: storedPlanData.planName || "Begin Plan",
      });
    }

    // Load saved OCR images - FIX: Ensure it's always an array
    try {
      const savedOcrImages = useLocalStorage.getItem("User_OCR_Images");
      if (Array.isArray(savedOcrImages)) {
        setOcrImages(savedOcrImages);
        setOcrUsage((prev) => ({
          ...prev,
          scansUsed: savedOcrImages.length,
        }));
      } else {
        setOcrImages([]);
      }
    } catch (error) {
      console.error("Error loading OCR images:", error);
      setOcrImages([]);
    }

    // Load AI history - FIX: Ensure it's always an array
    try {
      const savedAiHistory = useLocalStorage.getItem("User_AI_History");
      if (Array.isArray(savedAiHistory)) {
        setAiHistory(savedAiHistory);
        setAiUsage((prev) => ({
          ...prev,
          requestsUsed: savedAiHistory.length,
        }));
      } else {
        setAiHistory([]);
      }
    } catch (error) {
      console.error("Error loading AI history:", error);
      setAiHistory([]);
    }

    // Initialize editor history
    setEditorHistory([editorContent]);
    setHistoryIndex(0);
  }, []);

  // Update document statistics
  useEffect(() => {
    if (editorContent) {
      try {
        const text = editorContent.replace(/<[^>]*>/g, " ");
        const words = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const chars = text.replace(/\s/g, "").length;
        const pages = Math.ceil(words.length / 250);
        const readingTime = Math.ceil(words.length / 200);

        setDocumentStats({
          wordCount: words.length,
          charCount: chars,
          pageCount: pages,
          readingTime,
          complexity:
            words.length > 1000
              ? "Advanced"
              : words.length > 500
                ? "Intermediate"
                : "Basic",
        });
      } catch (error) {
        console.error("Error calculating document stats:", error);
      }
    }
  }, [editorContent]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (editorContent && !isSaving) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [editorContent]);

  const planDetails = {
    basic: {
      name: "Begin Plan",
      fileSizeLimit: 10,
      storage: 1024,
      color: "#757575",
      features: {
        templates: 5,
        exportFormats: ["PDF", "DOCX"],
        collaboration: false,
        aiFeatures: false,
        versionHistory: 7,
        ocrScans: 5,
        aiRequests: 0,
        advancedEditor: false,
      },
    },
    standard: {
      name: "Standard Plan",
      fileSizeLimit: 20,
      storage: 2560,
      color: "#2196f3",
      features: {
        templates: 20,
        exportFormats: ["PDF", "DOCX", "HTML", "TXT"],
        collaboration: true,
        aiFeatures: true,
        versionHistory: 30,
        ocrScans: 50,
        aiRequests: 100,
        advancedEditor: true,
      },
    },
    premium: {
      name: "Premium Plan",
      fileSizeLimit: 50,
      storage: 5120,
      color: "#ff6f00",
      features: {
        templates: 100,
        exportFormats: ["PDF", "DOCX", "HTML", "TXT", "RTF", "ODT", "EPUB"],
        collaboration: true,
        aiFeatures: true,
        versionHistory: 365,
        ocrScans: 200,
        aiRequests: 500,
        advancedEditor: true,
      },
    },
  };

  const currentPlan = planDetails[userPlanData.planId] || planDetails.basic;

  const templates = [
    { id: 1, name: "Business Report", category: "Business", icon: "📊" },
    { id: 2, name: "Meeting Minutes", category: "Business", icon: "📝" },
    { id: 3, name: "Project Proposal", category: "Business", icon: "📋" },
    { id: 4, name: "Technical Manual", category: "Technical", icon: "🔧" },
    { id: 5, name: "API Documentation", category: "Technical", icon: "📚" },
    { id: 6, name: "Research Paper", category: "Academic", icon: "🎓" },
    { id: 7, name: "Legal Contract", category: "Legal", icon: "⚖️" },
    { id: 8, name: "Newsletter", category: "Marketing", icon: "📰" },
  ];

  const exportFormats = [
    { value: "pdf", label: "PDF Document", icon: <PictureAsPdf /> },
    { value: "docx", label: "Microsoft Word", icon: <Description /> },
    { value: "html", label: "Web Page (HTML)", icon: <Description /> },
    { value: "txt", label: "Plain Text", icon: <Description /> },
    { value: "rtf", label: "Rich Text Format", icon: <Description /> },
  ];

  const aiActions = [
    { value: "summarize", label: "Summarize", icon: <Summarize /> },
    { value: "improve", label: "Improve Writing", icon: <AutoFixHigh /> },
    { value: "translate", label: "Translate", icon: <Translate /> },
    { value: "analyze", label: "Analyze Tone", icon: <Assessment /> },
    { value: "simplify", label: "Simplify Text", icon: <School /> },
    { value: "expand", label: "Expand Content", icon: <Add /> },
  ];

  // ========== EXISTING FUNCTIONS ==========
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const autoSave = async () => {
    if (!editorContent.trim()) return;

    setIsSaving(true);
    setSaveStatus("Saving...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDocument((prev) => ({
        ...prev,
        content: editorContent,
        wordCount: documentStats.wordCount,
        lastSaved: new Date(),
      }));

      setSaveStatus("Saved");
      showSnackbar("Document auto-saved successfully", "success");
    } catch (error) {
      setSaveStatus("Error saving");
      showSnackbar("Failed to save document", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await autoSave();
  };

  const handleExport = (format) => {
    showSnackbar(`Exporting document as ${format.toUpperCase()}...`, "info");
    setTimeout(() => {
      showSnackbar(
        `Document exported as ${format.toUpperCase()} successfully`,
        "success",
      );
    }, 2000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > currentPlan.fileSizeLimit * 1024 * 1024) {
      showSnackbar(
        `File size exceeds ${currentPlan.fileSizeLimit}MB limit`,
        "error",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditorContent(e.target.result);
      addToHistory(e.target.result);
      showSnackbar("Document imported successfully", "success");
    };
    reader.readAsText(file);
  };

  const handleTemplateSelect = (template) => {
    const templateContent = `<h1>${template.name}</h1><p>This is a ${template.name.toLowerCase()} template. Start editing...</p>`;
    setEditorContent(templateContent);
    addToHistory(templateContent);
    setShowTemplates(false);
    showSnackbar(`"${template.name}" template loaded`, "success");
  };

  const handleFormatAction = (format, value = null) => {
    if (editorRef.current) {
      document.execCommand(format, false, value);
      editorRef.current.focus();
      updateEditorContent();
    }
  };

  const updateEditorContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditorContent(content);
      addToHistory(content);
    }
  };

  const addToHistory = (content) => {
    if (!editorHistory) {
      setEditorHistory([content]);
      setHistoryIndex(0);
      return;
    }

    const newHistory = [...editorHistory.slice(0, historyIndex + 1), content];
    setEditorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && editorHistory.length > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setEditorContent(editorHistory[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < editorHistory.length - 1 && editorHistory.length > 0) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setEditorContent(editorHistory[nextIndex]);
    }
  };

  const handleInsertImage = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      handleFormatAction("insertImage", imageUrl);
    }
  };

  const handleInsertTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");

    if (rows && cols) {
      let tableHTML =
        '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < rows; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < cols; j++) {
          tableHTML += `<td style="padding: 8px;">Cell ${i + 1}-${j + 1}</td>`;
        }
        tableHTML += "</tr>";
      }
      tableHTML += "</table>";

      handleFormatAction("insertHTML", tableHTML);
    }
  };

  // ========== NEW FEATURES: OCR FUNCTIONS ==========
  const handleOcrUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const ocrLimit = currentPlan.features.ocrScans || 0;

    if (ocrUsage.scansUsed + fileArray.length > ocrLimit) {
      showSnackbar(
        `OCR scan limit exceeded. Max ${ocrLimit} scans allowed.`,
        "error",
      );
      return;
    }

    setIsProcessingOcr(true);

    setTimeout(() => {
      try {
        const newImages = fileArray.map((file) => ({
          id: Date.now() + Math.random(),
          name: file.name,
          url: URL.createObjectURL(file),
          extractedText: `Simulated OCR text from ${file.name}:\n\nThis is sample text that would be extracted using OCR technology. In a real application, this would use Tesseract.js or Google Vision API to extract actual text from the image.`,
        }));

        // FIX: Ensure ocrImages is always an array before spreading
        const currentOcrImages = Array.isArray(ocrImages) ? ocrImages : [];
        const updatedOcrImages = [...currentOcrImages, ...newImages];

        setOcrImages(updatedOcrImages);
        setOcrUsage((prev) => ({
          ...prev,
          scansUsed: prev.scansUsed + fileArray.length,
        }));
        setIsProcessingOcr(false);
        showSnackbar(`OCR processed ${fileArray.length} image(s)`, "success");

        // Save to localStorage
        useLocalStorage.setItem("User_OCR_Images", updatedOcrImages);
      } catch (error) {
        console.error("Error processing OCR:", error);
        setIsProcessingOcr(false);
        showSnackbar("Error processing OCR images", "error");
      }
    }, 2000);
  };

  const handleOcrTextInsert = () => {
    if (ocrText.trim() && editorRef.current) {
      try {
        document.execCommand("insertText", false, ocrText);
        editorRef.current.focus();
        updateEditorContent();
        setShowOcrDialog(false);
        showSnackbar("OCR text inserted into document", "success");
      } catch (error) {
        console.error("Error inserting OCR text:", error);
        showSnackbar("Error inserting text", "error");
      }
    }
  };

  const clearOcrHistory = () => {
    try {
      setOcrImages([]);
      setOcrUsage((prev) => ({ ...prev, scansUsed: 0 }));
      useLocalStorage.setItem("User_OCR_Images", []);
      showSnackbar("OCR history cleared", "success");
    } catch (error) {
      console.error("Error clearing OCR history:", error);
      showSnackbar("Error clearing history", "error");
    }
  };

  // ========== NEW FEATURES: AI FUNCTIONS ==========
  const handleAiAnalysis = async (action) => {
    if (!currentPlan.features.aiFeatures && userPlanData.planId === "basic") {
      showSnackbar("AI features require Standard or Premium plan", "warning");
      return;
    }

    const aiLimit = currentPlan.features.aiRequests || 0;
    if (aiUsage.requestsUsed >= aiLimit) {
      showSnackbar(
        `AI request limit exceeded. Max ${aiLimit} requests allowed.`,
        "error",
      );
      return;
    }

    setIsProcessingAi(true);
    setAiAction(action);

    setTimeout(() => {
      try {
        setIsProcessingAi(false);
        setAiUsage((prev) => ({
          ...prev,
          requestsUsed: prev.requestsUsed + 1,
        }));

        const suggestions = {
          summarize: [
            "Document Summary: This document contains structured content with multiple sections.",
            "Key Points: 1. Introduction 2. Main Content 3. Conclusion 4. Recommendations",
          ],
          improve: [
            "Consider using active voice instead of passive for better engagement.",
            "Add transitional phrases to improve flow between paragraphs.",
          ],
          translate: [
            "Translated content would appear here in the selected language.",
          ],
          analyze: [
            "Tone Analysis: Professional and formal tone detected.",
            "Readability Score: 8.2/10 (Suitable for professional audience)",
            "Sentiment: Neutral to positive",
          ],
          simplify: [
            "Simplified version: Complex terms replaced with everyday language.",
            "Reading level reduced from academic to general audience.",
          ],
          expand: [
            "Expanded content with additional examples and explanations.",
            "Added supporting evidence and case studies.",
          ],
        };

        const newSuggestions = suggestions[action] || [
          "AI analysis completed.",
        ];
        setAiSuggestions(newSuggestions);

        const aiEntry = {
          id: Date.now(),
          action,
          suggestions: newSuggestions,
          timestamp: new Date(),
          documentSnapshot: editorContent.substring(0, 100) + "...",
        };

        // FIX: Ensure aiHistory is always an array before spreading
        const currentAiHistory = Array.isArray(aiHistory) ? aiHistory : [];
        const updatedAiHistory = [aiEntry, ...currentAiHistory.slice(0, 9)];

        setAiHistory(updatedAiHistory);
        useLocalStorage.setItem("User_AI_History", updatedAiHistory);

        setShowAiDialog(true);
      } catch (error) {
        console.error("Error in AI analysis:", error);
        setIsProcessingAi(false);
        showSnackbar("Error in AI analysis", "error");
      }
    }, 3000);
  };

  const applyAiSuggestion = (suggestion) => {
    if (editorRef.current && suggestion) {
      try {
        document.execCommand("insertText", false, "\n\n" + suggestion);
        editorRef.current.focus();
        updateEditorContent();
        showSnackbar("AI suggestion applied", "success");
      } catch (error) {
        console.error("Error applying AI suggestion:", error);
        showSnackbar("Error applying suggestion", "error");
      }
    }
  };

  // ========== NEW FEATURES: ADVANCED EDITOR FUNCTIONS ==========
  const handleInsertCodeBlock = () => {
    const code = prompt(
      "Enter code:",
      "function example() {\n  return 'Hello World';\n}",
    );
    if (code && editorRef.current) {
      const codeBlock = `<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace;"><code>${code}</code></pre>`;
      document.execCommand("insertHTML", false, codeBlock);
      editorRef.current.focus();
      updateEditorContent();
    }
  };

  const handleInsertQuote = () => {
    handleFormatAction("formatBlock", "blockquote");
  };

  const handleInsertEquation = () => {
    const equation = prompt("Enter equation (LaTeX supported):", "E = mc^2");
    if (equation && editorRef.current) {
      const equationHTML = `<div style="text-align: center; font-family: 'Times New Roman', serif; font-size: 18px; padding: 10px;">${equation}</div>`;
      document.execCommand("insertHTML", false, equationHTML);
      editorRef.current.focus();
      updateEditorContent();
    }
  };

  const handleTextHighlight = () => {
    handleFormatAction("hiliteColor", "#ffff00");
  };

  // ========== HELPER FUNCTIONS ==========
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const canUseCollaboration =
    hasPermission("team_access") && currentPlan.features.collaboration;
  const canUseAI = currentPlan.features.aiFeatures;
  const canUseAdvancedExport = userPlanData.planId !== "basic";
  const canUseAdvancedEditor = currentPlan.features.advancedEditor;

  return (
    <div className="dashboard">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with Return to App Button */}
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
            alignItems="flex-start"
          >
            <Box>
              {/* Return to App Button */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => (window.location.href = "/dashboard")}
                  sx={{
                    borderColor: currentPlan.color,
                    color: currentPlan.color,
                  }}
                >
                  Return to App
                </Button>
                <Chip
                  label="Document Editor"
                  size="small"
                  sx={{
                    backgroundColor: currentPlan.color,
                    color: "white",
                  }}
                />
              </Box>

              <Typography variant="h4" gutterBottom>
                Professional Document Editor
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={currentPlan.name}
                  sx={{
                    backgroundColor: currentPlan.color,
                    color: "white",
                    fontSize: "1rem",
                    padding: "4px 12px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <span style={{ opacity: 0.7 }}>Status:</span>
                  <Chip
                    label={saveStatus}
                    size="small"
                    color={
                      saveStatus === "Saved"
                        ? "success"
                        : saveStatus === "Saving..."
                          ? "warning"
                          : "error"
                    }
                    variant="outlined"
                  />
                </Typography>
                {isAuthenticated && user && (
                  <Typography variant="body2">
                    Editing as: {user.email}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              display="flex"
              gap={1}
              flexDirection="column"
              alignItems="flex-end"
            >
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => showSnackbar("Version history opened", "info")}
                >
                  History
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: currentPlan.color,
                    color: currentPlan.color,
                  }}
                  onClick={() => setShowTemplates(true)}
                >
                  Templates
                </Button>
              </Box>
              {/* Document Stats */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {documentStats.wordCount} words • {documentStats.pageCount}{" "}
                pages • {documentStats.readingTime} min read
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Editor Controls - Enhanced with OCR & AI */}
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 1 }}>
                <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
                  {/* File Operations */}
                  <Tooltip title="Save">
                    <IconButton onClick={handleSave} disabled={isSaving}>
                      <Save />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Import Document">
                    <IconButton onClick={() => fileInputRef.current?.click()}>
                      <Upload />
                    </IconButton>
                  </Tooltip>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".txt,.html,.docx,.rtf,.odt"
                    onChange={handleImport}
                  />

                  {/* History Controls */}
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  <Tooltip title="Undo">
                    <IconButton
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                    >
                      <Undo />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Redo">
                    <IconButton
                      onClick={handleRedo}
                      disabled={historyIndex >= editorHistory.length - 1}
                    >
                      <Redo />
                    </IconButton>
                  </Tooltip>

                  {/* Formatting Controls */}
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  <Tooltip title="Bold">
                    <IconButton onClick={() => handleFormatAction("bold")}>
                      <FormatBold />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Italic">
                    <IconButton onClick={() => handleFormatAction("italic")}>
                      <FormatItalic />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Underline">
                    <IconButton onClick={() => handleFormatAction("underline")}>
                      <FormatUnderlined />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Highlight">
                    <IconButton onClick={handleTextHighlight}>
                      <Highlight />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  <Tooltip title="Bullet List">
                    <IconButton
                      onClick={() => handleFormatAction("insertUnorderedList")}
                    >
                      <FormatListBulleted />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Numbered List">
                    <IconButton
                      onClick={() => handleFormatAction("insertOrderedList")}
                    >
                      <FormatListNumbered />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Quote">
                    <IconButton onClick={handleInsertQuote}>
                      <FormatQuote />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  <Tooltip title="Align Left">
                    <IconButton
                      onClick={() => handleFormatAction("justifyLeft")}
                    >
                      <FormatAlignLeft />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Align Center">
                    <IconButton
                      onClick={() => handleFormatAction("justifyCenter")}
                    >
                      <FormatAlignCenter />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Align Right">
                    <IconButton
                      onClick={() => handleFormatAction("justifyRight")}
                    >
                      <FormatAlignRight />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  {/* Insert Tools */}
                  <Tooltip title="Insert Image">
                    <IconButton onClick={handleInsertImage}>
                      <InsertPhoto />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Insert Table">
                    <IconButton onClick={handleInsertTable}>
                      <TableChart />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Insert Link">
                    <IconButton
                      onClick={() => handleFormatAction("createLink")}
                    >
                      <InsertLink />
                    </IconButton>
                  </Tooltip>

                  {canUseAdvancedEditor && (
                    <>
                      <Tooltip title="Insert Code Block">
                        <IconButton onClick={handleInsertCodeBlock}>
                          <Code />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Insert Equation">
                        <IconButton onClick={handleInsertEquation}>
                          <Functions />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                  {/* OCR Tools */}
                  <Tooltip title="Upload Image for OCR">
                    <IconButton
                      onClick={() =>
                        document.getElementById("ocr-file-input")?.click()
                      }
                    >
                      <Badge badgeContent={ocrImages.length} color="primary">
                        <ImageSearch />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <input
                    type="file"
                    id="ocr-file-input"
                    ref={ocrFileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    onChange={handleOcrUpload}
                  />

                  {/* AI & Advanced Tools */}
                  {canUseAI && (
                    <>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                      <Tooltip title="AI Assistant">
                        <IconButton onClick={() => handleAiAnalysis("improve")}>
                          <Badge
                            badgeContent={aiUsage.requestsUsed}
                            color="secondary"
                          >
                            <SmartToy />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Spell Check">
                        <IconButton
                          onClick={() =>
                            showSnackbar("Spell check completed", "success")
                          }
                        >
                          <Spellcheck />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Translate">
                        <IconButton
                          onClick={() => handleAiAnalysis("translate")}
                        >
                          <Translate />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  <Box sx={{ flexGrow: 1 }} />

                  {/* Font Controls */}
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="Times New Roman">
                        Times New Roman
                      </MenuItem>
                      <MenuItem value="Courier New">Courier New</MenuItem>
                      <MenuItem value="Georgia">Georgia</MenuItem>
                      <MenuItem value="Verdana">Verdana</MenuItem>
                      {canUseAdvancedEditor && (
                        <MenuItem value="Monospace">Monospace</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                    >
                      {[10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36].map(
                        (size) => (
                          <MenuItem key={size} value={size.toString()}>
                            {size}px
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Editor Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "70vh" }}>
              <CardContent sx={{ p: 0, height: "100%" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab label="Edit" />
                  <Tab label="Preview" />
                  <Tab label="HTML" />
                  <Tab label="Stats" />
                </Tabs>

                <Box
                  sx={{ p: 2, height: "calc(100% - 48px)", overflow: "auto" }}
                >
                  {activeTab === 0 && (
                    <div
                      ref={editorRef}
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                      onInput={updateEditorContent}
                      style={{
                        height: "100%",
                        outline: "none",
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.6,
                        padding: "16px",
                      }}
                      className="document-editor"
                    />
                  )}

                  {activeTab === 1 && (
                    <div
                      style={{
                        height: "100%",
                        padding: "16px",
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.6,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "4px",
                      }}
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                    />
                  )}

                  {activeTab === 2 && (
                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      variant="outlined"
                      sx={{
                        height: "100%",
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                          alignItems: "flex-start",
                          fontFamily: "monospace",
                        },
                      }}
                    />
                  )}

                  {activeTab === 3 && (
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: currentPlan.color }}
                      >
                        Document Statistics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{ color: currentPlan.color }}
                            >
                              {documentStats.wordCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Words
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{ color: currentPlan.color }}
                            >
                              {documentStats.charCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Characters
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{ color: currentPlan.color }}
                            >
                              {documentStats.pageCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pages
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{ color: currentPlan.color }}
                            >
                              {documentStats.readingTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Minutes to Read
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            <strong>Complexity Level:</strong>{" "}
                            {documentStats.complexity}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              documentStats.wordCount > 2000
                                ? 100
                                : (documentStats.wordCount / 2000) * 100
                            }
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Tools - Enhanced with OCR & AI */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {/* Document Info */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: currentPlan.color }}
                    >
                      Document Info
                    </Typography>
                    <TextField
                      fullWidth
                      label="Document Title"
                      value={document.title}
                      onChange={(e) =>
                        setDocument({ ...document, title: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Word Count:</strong> {documentStats.wordCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Last Saved:</strong>{" "}
                        {document.lastSaved.toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Complexity:</strong> {documentStats.complexity}
                      </Typography>
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={document.isPublic}
                          onChange={(e) =>
                            setDocument({
                              ...document,
                              isPublic: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Public Document"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={document.isEncrypted}
                          onChange={(e) =>
                            setDocument({
                              ...document,
                              isEncrypted: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Encrypt Document"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* OCR Tools Panel */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: currentPlan.color }}
                      >
                        OCR Tools
                      </Typography>
                      <Chip
                        label={`${ocrUsage.scansUsed}/${currentPlan.features.ocrScans}`}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    {!ocrImages || ocrImages.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ py: 2 }}
                      >
                        No OCR images yet
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: 150, overflow: "auto", mb: 2 }}>
                        {ocrImages.slice(0, 3).map((image) => (
                          <Paper
                            key={image.id}
                            sx={{
                              p: 1,
                              mb: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <TextSnippet
                              sx={{
                                mr: 1,
                                fontSize: 20,
                                color: currentPlan.color,
                              }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="caption" noWrap>
                                {image.name}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOcrText(image.extractedText || "");
                                setShowOcrDialog(true);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Paper>
                        ))}
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ImageSearch />}
                      onClick={() =>
                        document.getElementById("ocr-file-input")?.click()
                      }
                      sx={{ mb: 1 }}
                      disabled={
                        isProcessingOcr ||
                        ocrUsage.scansUsed >= currentPlan.features.ocrScans
                      }
                    >
                      {isProcessingOcr
                        ? "Processing..."
                        : "Upload Image for OCR"}
                    </Button>

                    {ocrImages && ocrImages.length > 0 && (
                      <Button
                        fullWidth
                        variant="text"
                        size="small"
                        startIcon={<Delete />}
                        onClick={clearOcrHistory}
                        color="error"
                      >
                        Clear OCR History
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* AI Tools Panel */}
              {canUseAI && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: currentPlan.color }}
                        >
                          AI Assistant
                        </Typography>
                        <Chip
                          label={`${aiUsage.requestsUsed}/${currentPlan.features.aiRequests}`}
                          size="small"
                          color="secondary"
                        />
                      </Box>

                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>AI Action</InputLabel>
                        <Select
                          value={aiAction}
                          label="AI Action"
                          onChange={(e) => setAiAction(e.target.value)}
                        >
                          {aiActions.map((action) => (
                            <MenuItem key={action.value} value={action.value}>
                              <Box display="flex" alignItems="center" gap={1}>
                                {action.icon}
                                {action.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={
                          isProcessingAi ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SmartToy />
                          )
                        }
                        onClick={() => handleAiAnalysis(aiAction)}
                        disabled={
                          isProcessingAi ||
                          aiUsage.requestsUsed >=
                            currentPlan.features.aiRequests
                        }
                        sx={{
                          mb: 1,
                          backgroundColor: currentPlan.color,
                          "&:hover": { backgroundColor: currentPlan.color },
                        }}
                      >
                        {isProcessingAi ? "Processing..." : "Run AI Analysis"}
                      </Button>

                      {aiHistory && aiHistory.length > 0 && (
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            showSnackbar(
                              `AI History: ${aiHistory.length} entries`,
                              "info",
                            )
                          }
                        >
                          View AI History
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Export Options */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: currentPlan.color }}
                    >
                      Export Options
                    </Typography>
                    <Grid container spacing={1}>
                      {exportFormats.map((format, index) => (
                        <Grid item xs={6} key={format.value}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={format.icon}
                            onClick={() => handleExport(format.value)}
                            disabled={index > 1 && !canUseAdvancedExport}
                            sx={{
                              justifyContent: "flex-start",
                              textTransform: "none",
                            }}
                          >
                            {format.label}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Plan Limitations */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: currentPlan.color }}
                    >
                      Plan Features
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Templates:</strong>{" "}
                        {currentPlan.features.templates}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Export Formats:</strong>{" "}
                        {currentPlan.features.exportFormats.length}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Version History:</strong>{" "}
                        {currentPlan.features.versionHistory} days
                      </Typography>
                      <Typography variant="body2">
                        <strong>AI Features:</strong>{" "}
                        {currentPlan.features.aiFeatures ? "✓" : "✗"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Collaboration:</strong>{" "}
                        {currentPlan.features.collaboration ? "✓" : "✗"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>OCR Scans:</strong>{" "}
                        {currentPlan.features.ocrScans}
                      </Typography>
                      <Typography variant="body2">
                        <strong>AI Requests:</strong>{" "}
                        {currentPlan.features.aiRequests}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Advanced Editor:</strong>{" "}
                        {currentPlan.features.advancedEditor ? "✓" : "✗"}
                      </Typography>
                    </Box>
                    {userPlanData.planId === "basic" && (
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: currentPlan.color }}
                        onClick={() => (window.location.href = "/features")}
                      >
                        Upgrade for More Features
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Quick Actions Footer - Enhanced */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: currentPlan.color }}
          >
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Save />}
              sx={{ backgroundColor: currentPlan.color }}
              onClick={handleSave}
            >
              Save Document
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => handleExport("pdf")}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => showSnackbar("Print dialog opened", "info")}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<ImageSearch />}
              sx={{
                borderColor: currentPlan.color,
                color: currentPlan.color,
              }}
              onClick={() => document.getElementById("ocr-file-input")?.click()}
              disabled={ocrUsage.scansUsed >= currentPlan.features.ocrScans}
            >
              OCR Scan ({ocrUsage.scansUsed}/{currentPlan.features.ocrScans})
            </Button>
            {canUseAI && (
              <Button
                variant="outlined"
                startIcon={<SmartToy />}
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => handleAiAnalysis("improve")}
                disabled={
                  aiUsage.requestsUsed >= currentPlan.features.aiRequests
                }
              >
                AI Assist ({aiUsage.requestsUsed}/
                {currentPlan.features.aiRequests})
              </Button>
            )}
            {canUseCollaboration && (
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{
                  borderColor: currentPlan.color,
                  color: currentPlan.color,
                }}
                onClick={() => showSnackbar("Share options opened", "info")}
              >
                Share with Team
              </Button>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Templates Dialog */}
      <Dialog
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: currentPlan.color }}>
            Choose a Template
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {templates
              .slice(0, currentPlan.features.templates)
              .map((template) => (
                <Grid item xs={6} sm={4} md={3} key={template.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        {template.icon}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {template.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {template.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplates(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* OCR Text Dialog */}
      <Dialog
        open={showOcrDialog}
        onClose={() => setShowOcrDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <TextSnippet />
            <Typography variant="h6">Extracted OCR Text</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
            placeholder="Extracted text will appear here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOcrDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleOcrTextInsert}
            disabled={!ocrText.trim()}
            sx={{ backgroundColor: currentPlan.color }}
          >
            Insert into Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Suggestions Dialog */}
      <Dialog
        open={showAiDialog}
        onClose={() => setShowAiDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SmartToy />
            <Typography variant="h6">AI Suggestions</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {aiSuggestions.map((suggestion, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
              <Typography variant="body1">{suggestion}</Typography>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button
                  size="small"
                  onClick={() => applyAiSuggestion(suggestion)}
                  sx={{ color: currentPlan.color }}
                >
                  Apply
                </Button>
              </Box>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAiDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DocumentEditor;
