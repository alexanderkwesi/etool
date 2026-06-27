import React from "react";
import { UserPlan } from "../src/utils/types";
import "./GuideContent.css";

const GuideContent = ({ activePlan }) => {
  const getPlanColor = (plan) => {
    switch (plan) {
      case UserPlan.BASIC:
        return "plan-basic";
      case UserPlan.STANDARD:
        return "plan-standard";
      case UserPlan.PREMIUM:
        return "plan-premium";
      default:
        return "plan-basic";
    }
  };

  const getPlanName = (plan) => {
    switch (plan) {
      case UserPlan.BASIC:
        return "Begin Plan";
      case UserPlan.STANDARD:
        return "Standard Plan";
      case UserPlan.PREMIUM:
        return "Premium Plan";
      default:
        return "Plan";
    }
  };

  return (
    <div className="guide-content">
      <section id="introduction" className="section introduction-section">
        <h2 className="section-title">Introduction</h2>
        <p className="section-description">
          Welcome to the <strong>DocRevisor Engineering File Management Tool</strong>. This
          platform is designed specifically for engineers who need to convert,
          compare, and secure CAD and documentation files within a highly secure
          local environment.
        </p>
        <div className="info-box">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="info-title">New to DocRevisor?</h4>
            <p className="info-text">
              Our platform prioritizes local storage security. Your files never
              leave your device unless explicitly shared via team features.
            </p>
          </div>
        </div>
      </section>

      <section id="dashboard-layout" className="section dashboard-section">
        <h2 className="section-title">Understanding the Dashboard</h2>
        <p className="section-description">
          The dashboard is your central command hub. It dynamically adapts its
          theme and available features based on your active subscription tier.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-features">
            <h4 className="feature-item">
              <span className="feature-number">1</span>
              The Navigation Header
            </h4>
            <p className="feature-description">
              Contains global actions: Support, Security Settings, Logout, and
              the "Upgrade" CTA. It also displays your current plan badge.
            </p>

            <h4 className="feature-item">
              <span className="feature-number">2</span>
              Usage Statistics
            </h4>
            <p className="feature-description">
              Three primary cards track your "Files Processed", "Storage Used",
              and "Total Conversions". Limits are enforced per month based on
              your plan.
            </p>
          </div>

          <div className="dashboard-preview">
            <div className="preview-container">
              <div className={`preview-badge ${getPlanColor(activePlan)}`}></div>
            </div>
            <div className="preview-overlay">
              <span className="preview-label">UI Preview: {getPlanName(activePlan)}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="plan-system" className="section plans-section">
        <h2 className="section-title">Plan & Tier System</h2>
        <p className="section-description">
          Features are unlocked progressively. The UI uses color-coding to
          signal your current environment level.
        </p>

        <div className="plans-list">
          <div className="plan-card">
            <div className="plan-color basic"></div>
            <div className="plan-details">
              <h5 className="plan-name">Begin Plan (Basic)</h5>
              <p className="plan-description">
                5 files/mo, 1GB storage, basic viewing.
              </p>
            </div>
            <div className="plan-theme">GREY THEME</div>
          </div>
          <div className="plan-card">
            <div className="plan-color standard"></div>
            <div className="plan-details">
              <h5 className="plan-name">Standard Plan</h5>
              <p className="plan-description">
                10 files/mo, 2.5GB storage, team members (up to 5).
              </p>
            </div>
            <div className="plan-theme">BLUE THEME</div>
          </div>
          <div className="plan-card premium">
            <div className="plan-color premium"></div>
            <div className="plan-details">
              <h5 className="plan-name">Premium Plan</h5>
              <p className="plan-description">
                50 files/mo, 5GB storage, Advanced File Comparison.
              </p>
            </div>
            <div className="plan-theme">ORANGE THEME</div>
          </div>
        </div>
      </section>

      <section id="file-operations" className="section files-section">
        <h2 className="section-title">Core File Operations</h2>
        <div className="files-grid">
          <div className="file-card">
            <div className="file-icon conversion">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h4 className="file-title">File Conversion</h4>
            <p className="file-description">
              Supports CAD, STEP, DWP, and common engineering formats.
              Accessible via "Quick Actions" or the conversion tool card.
            </p>
          </div>
          <div className={`file-card ${activePlan !== UserPlan.PREMIUM ? "premium-feature" : ""}`}>
            <div className="file-icon comparison">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="file-title">File Comparison</h4>
            <p className="file-description">
              Identify differences between document versions.
              {activePlan !== UserPlan.PREMIUM && (
                <span className="premium-badge">Premium Feature</span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section id="security-privacy" className="section security-section">
        <h2 className="section-title">Security & Privacy</h2>
        <div className="security-card">
          <div className="security-content">
            <h3 className="security-heading">Encryption by Birth Date</h3>
            <p className="security-text">
              DocRevisor uses a unique local encryption protocol. Files are
              secured using the user's defined date of birth as a salt, ensuring
              that data stored in local storage is inaccessible to other apps or
              system users.
            </p>
            <ul className="security-features">
              <li className="security-feature">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AES-256 Local Encryption
              </li>
              <li className="security-feature">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Zero-Knowledge Architecture
              </li>
            </ul>
          </div>
          <div className="security-pattern">
            <svg width="256" height="256" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.5h-2.5V11H12V9h-2.5v-.5h2.5V7h-3v5.5h3v1.5h-3v.5h3V16h1v-3.5z" />
            </svg>
          </div>
        </div>
      </section>

      <section id="team-management" className="section team-section">
        <h2 className="section-title">Team & Account Management</h2>
        <div className="team-table-container">
          <table className="team-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Standard</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Max Team Members</td>
                <td>Up to 5</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Role Management</td>
                <td>Basic Roles</td>
                <td>Advanced Permissions</td>
              </tr>
              <tr>
                <td>Billing History</td>
                <td>Included</td>
                <td>Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="support-resources" className="section support-section">
        <h2 className="section-title">Support & Help</h2>
        <div className="support-grid">
          <div className="support-card">
            <h4 className="support-title">Email Support</h4>
            <p className="support-subtitle">Response within 24 hours</p>
            <code className="support-contact">support@docrevisor.com</code>
          </div>
          <div className="support-card">
            <h4 className="support-title">Live Chat</h4>
            <p className="support-subtitle">9 AM - 6 PM EST</p>
            <code className="support-contact">+44 (800) 123-REVISE</code>
          </div>
          <div className="support-card">
            <h4 className="support-title">Knowledge Base</h4>
            <p className="support-subtitle">Tutorials and FAQs</p>
            <button className="support-button">View Documentation →</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuideContent;
