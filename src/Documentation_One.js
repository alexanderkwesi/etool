import React, { useState } from "react";
import { UserPlan } from "../src/utils/types";
import Navigation from "./Navigation";
import GuideContent from "./GuideContent";
import AIHelper from "./AIHelper";
import "./Document_One.css";

const App = () => {
  const [activePlan, setActivePlan] = useState(UserPlan.BASIC);

  return (
    <div className="documentation-app">
      {/* Sidebar Navigation */}
      <aside className="documentation-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-badge">DR</div>
            <h1 className="sidebar-title">DocRevisor</h1>
          </div>
          <p className="sidebar-subtitle">User Documentation</p>
        </div>
        <Navigation />
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Plan Toggle Header */}
        <header className="content-header glass-effect">
          <div className="header-content">
            <div className="plan-toggle-container">
              <span className="plan-label">Viewing docs for:</span>
              <div className="plan-toggle">
                {Object.values(UserPlan).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setActivePlan(plan)}
                    className={`plan-button ${activePlan === plan ? "active" : "inactive"}`}
                  >
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="header-actions">
              <a
                href="/app"
                className="dashboard-link"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </header>

        <div className="content-container">
          <GuideContent activePlan={activePlan} />
        </div>

        {/* Floating AI Helper */}
        <AIHelper />
      </main>
    </div>
  );
};

export default App;
