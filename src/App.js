// App.js - Main application routing configuration
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SecurityProvider, useSecurity } from "./Use_Security";
import "./App.css";

// Layout Components
import Sidebar from "./Use_AppSideBar";

// Page Components - Public Routes
import HomePage from "./Use_HomePage";
import LandPage from "./Use_LandingPage";
import ContactPage from "./Use_Contact";
import PitchDeck from "./parentComponents";
import FinancialPage from "./Use_FinancialPage";
import SchedulePage from "./Use_Schedule_Demo";
import CoffeeMeetUp from "./Use_Coffee_MeetUp";
import OverviewPage from "./Use_Overview";
import CompetitionPage from "./Use_Competition";
import SEIS from "./SEIS";
import VisaRoadmap from "./VisaRoadMap";
import Platform from "./Platform";
import Solutions from "./Solutions";
import Investment from "./Investment";
import ROICalculator from "./ROICalculator";
import FeaturesPricePlan from "./Use_FeaturesPlan";
import Faq from "./Use_Faq";
import PaymentPage from "./Use_Payment";
import DocGuideContentOne from "./Documentation_One";
import FinancialProjectionsPage from "./Use_Financial_Projetions.js";

// Authentication Components
import AuthPage from "./Use_Signonpage";
import FAGoogleLogin from "./Use_2FAGoogleLogin";

// App Core Components
import Dashboard from "./Use_Dashboard";
import UseApp from "./Use_App";
import FileManager from "./Use_FileManager";

// Document Processing Components
import FileConversion from "./Use_FileConversion";
import Compare from "./Use_Compare";
import Viewing from "./Use_FileViewing";
import Download from "./Use_FileDownload";
import DocumentEditor from "./Use_DocumentEditor";

// Remediation Components
import BasicRemedition from "./Use_BasicRemedition";
import PDFAccessibility from "./Use_PDFAccessibility";
import AccessibilityPage from "./Use_Accessibility_Features_Enabled";
import DocumentCompliance from "./Use_DocumentCompliance";
import TagStructure from "./Use_TagStructure";

// AI Components
import AiPoweredFixes from "./Use_AIPowered_Fixes";
import SmartTagging from "./Use_SmartTagging";
import ContentAnalysis from "./Use_ContentAnalysis";
import AutomatedCompliance from "./Use_AutomatedCompilance";

// OCR Components
import DocumentScanning from "./Use_DocumentScanning";
import TextReognition from "./Use_TextRecogniation";
import ImageText from "./Use_ImageText";
import BatchProcessing from "./Use_BatchProcessing";

// CRM Components
import ContentManagement from "./Use_ContentManagement";
import DocumentTracking from "./Use_DocumentTracking";
import ClientPortal from "./Use_ClientPortal";
import ReportAnalytics from "./Use_ReportAnalytics";

// Team & Account Components
import Member from "./Use_TeamMember";
import RoleManage from "./Use_RoleManagement";
import Accounts from "./Use_AccountPage";
import Category from "./Use_Categorization.js";

// Billing Components
import BillingHistory from "./Use_BillingHistory";
import BillPayment from "./Use_BillPayment";

// Security Components
import SecurityDashboard from "./Use_Security";

// Community Components
import ForumTwo from "./Use_CommunityForum2";

// ============================================================
// Layout component for pages that need the sidebar
// ============================================================
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

// ============================================================
// Protected Route Component - Must be used inside SecurityProvider
// ============================================================
const ProtectedRoute = ({ children }) => {
  // This hook will only work if called inside SecurityProvider
  const { isAuthenticated, loading } = useSecurity();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

// ============================================================
// Simple wrapper for auth pages
// ============================================================
const AuthWrapper = ({ isLogin }) => <AuthPage isLogin={isLogin} />;
const AuthRoute = AuthWrapper;

// ============================================================
// Main App Component
// ============================================================
function App() {
  return (
    <GoogleOAuthProvider
      clientId={
        process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"
      }
    >
      <SecurityProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* ===== PUBLIC ROUTES - NO SIDEBAR ===== */}
              {/* Marketing & Landing Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<LandPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/features" element={<FeaturesPricePlan />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/payment" element={<PaymentPage />} />

              {/* Investor Relations */}
              <Route path="/deck" element={<PitchDeck />} />
              <Route path="/financials" element={<FinancialPage />} />
              <Route path="/schedule-demo" element={<SchedulePage />} />
              <Route path="/coffee-meetup" element={<CoffeeMeetUp />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/competition" element={<CompetitionPage />} />
              <Route path="/projections" element={<FinancialProjectionsPage />} />
              <Route path="/seis" element={<SEIS />} />
              <Route path="/visa" element={<VisaRoadmap />} />
              <Route path="/platform" element={<Platform />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/investors" element={<Investment />} />
              <Route path="/roi" element={<ROICalculator />} />

              {/* Documentation */}
              <Route path="/documentation/1" element={<DocGuideContentOne />} />

              {/* Authentication */}
              <Route path="/login" element={<AuthRoute isLogin={true} />} />
              <Route path="/signup" element={<AuthRoute isLogin={false} />} />
              <Route path="/falogin" element={<FAGoogleLogin />} />

              {/* Community */}
              <Route path="/community" element={<ForumTwo />} />

              {/* ===== PROTECTED ROUTES - WITH SIDEBAR ===== */}
              {/* Dashboard & App */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <UseApp />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storage"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FileManager />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* File Operations */}
              <Route
                path="/convert"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FileConversion />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Compare />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Viewing />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/downloads"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Download />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DocumentEditor />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Document Remediation */}
              <Route
                path="/remediation/basic"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BasicRemedition />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/remediation/pdf-accessibility"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PDFAccessibility />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/remediation/braille&Screen&Reader"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AccessibilityPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/remediation/compliance"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DocumentCompliance />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/remediation/tag-structure"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TagStructure />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* AI Features */}
              <Route
                path="/ai/remediation"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AiPoweredFixes />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/tagging"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SmartTagging />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/analysis"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ContentAnalysis />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/compliance"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AutomatedCompliance />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* OCR Features */}
              <Route
                path="/ocr/scan"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DocumentScanning />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ocr/text-recognition"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TextReognition />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ocr/image-to-text"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ImageText />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ocr/batch"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BatchProcessing />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* CRM Features */}
              <Route
                path="/crm/contacts"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ContentManagement />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crm/document-tracking"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DocumentTracking />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crm/client-portal"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ClientPortal />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crm/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ReportAnalytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Team Management */}
              <Route
                path="/team/members"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Member />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/roles"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleManage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Account Settings */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Accounts />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-setup"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Category />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Billing */}
              <Route
                path="/billing/history"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BillingHistory />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing/payment"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BillPayment />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Security - Properly protected with SecurityProvider */}
              <Route
                path="/security"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SecurityDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SecurityProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
