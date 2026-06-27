import React, { useState, useEffect } from "react";
import "./Use_2FAGoogleLogin.css";

export default function TwoFactorSetup() {
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with timeout
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, this would come from your backend
      const demoSecret = "JBSWY3DPEHPK3PXP";
      const demoQrCode =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example";

      setSecret(demoSecret);
      setQrCode(demoQrCode);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      if (token === "123456") {
        // Demo verification
        setMessage("2FA enabled successfully!");
      } else {
        setMessage("Invalid token. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="card-header">
          <h2>Set Up Two-Factor Authentication</h2>
          <p>Scan the QR code with Google Authenticator</p>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <div className="qr-container">
                <img src={qrCode} alt="QR Code" className="qr-code" />
                <div className="qr-overlay"></div>
              </div>

              <div className="secret-container">
                <p className="secret-label">Or enter this secret manually:</p>
                <div className="secret-text">{secret}</div>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(secret)}
                >
                  Copy Secret
                </button>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="token-input"
                  maxLength="6"
                />
                <button
                  onClick={handleVerify}
                  className="verify-btn"
                  disabled={token.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </>
          )}
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// Login component with 2FA
export function LoginWith2FA() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setIsLoading(true);
    setError("");

    if (step === 1) {
      // Simulate credentials verification
      setTimeout(() => {
        if (username && password) {
          setStep(2);
        } else {
          setError("Please enter both username and password");
        }
        setIsLoading(false);
      }, 1000);
    } else {
      // Simulate 2FA verification
      setTimeout(() => {
        if (token === "123456") {
          // Redirect to dashboard
          window.location.href = "/app";
        } else {
          setError("Invalid verification code");
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <div className="card-header">
          <h2>Login</h2>
          <p>
            {step === 1
              ? "Enter your credentials"
              : "Two-Factor Authentication"}
          </p>
        </div>

        <div className="card-body">
          {step === 1 ? (
            <>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </>
          ) : (
            <>
              <div className="twofa-prompt">
                <div className="authenticator-icon">
                  <i className="icon-phone"></i>
                </div>
                <p>Open Google Authenticator and enter the 6-digit code</p>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="000000"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="auth-input token-input"
                  maxLength="6"
                />
              </div>
            </>
          )}

          {error && <div className="message error">{error}</div>}

          <button
            onClick={handleLogin}
            className="auth-btn"
            disabled={
              isLoading ||
              (step === 1 && (!username || !password)) ||
              (step === 2 && token.length !== 6)
            }
          >
            {isLoading ? (
              <span className="btn-loading">Processing...</span>
            ) : step === 1 ? (
              "Login"
            ) : (
              "Verify"
            )}
          </button>

          {step === 2 && (
            <button
              className="back-btn"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
