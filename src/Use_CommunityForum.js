import React, { useEffect, useState } from "react";

/**
 * CommunityForum.js
 *
 * Single-file React component for a community forum with:
 * - Post and Admin buttons
 * - Admin login modal (username, reference tag id, email)
 * - Generates 7-digit verification code (simulated email send)
 * - Admin-only announcement area (revealed after successful admin login)
 * - Regular users can post and reply
 *
 * Usage: import CommunityForum from './CommunityForum';
 *        <CommunityForum />
 *
 * Note: This demo simulates sending verification codes by storing them
 *       in localStorage. Replace sending logic with an API call to your
 *       backend/email provider for production.
 */

/* Inline CSS injection so component stays single-file */
const injectStyles = () => {
  const css = `
  .cf-wrapper {
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    max-width: 980px;
    margin: 28px auto;
    padding: 20px;
    background: linear-gradient(180deg, rgba(106,13,173,0.06), rgba(240,235,250,0.4));
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(10,10,20,0.06);
    color: #222;
  }
  .cf-header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
  }
  .cf-title {
    display:flex;
    align-items:center;
    gap:12px;
  }
  .cf-badge {
    background: #6a0dad;
    color: white;
    padding: 10px 14px;
    font-weight:700;
    border-radius:10px;
    box-shadow: 0 4px 14px rgba(106,13,173,0.16);
  }
  .cf-actions {
    display:flex;
    gap:10px;
  }
  .cf-btn {
    background: white;
    border: 2px solid #6a0dad;
    color: #6a0dad;
    padding: 8px 14px;
    border-radius: 10px;
    cursor:pointer;
    font-weight:600;
  }
  .cf-btn.primary {
    background: linear-gradient(90deg,#6a0dad,#8b33e3);
    color:white;
    border: none;
  }
  .cf-card {
    margin-top:18px;
    background: white;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid rgba(106,13,173,0.06);
  }
  .announcement-area {
    background: linear-gradient(90deg, rgba(106,13,173,0.06), rgba(213,130,150,0.03));
    padding:14px;
    border-radius:10px;
    margin-bottom:12px;
  }
  .announcement-item {
    background: #fff;
    border-left: 4px solid #6a0dad;
    padding:10px;
    margin-bottom:8px;
    border-radius:8px;
  }
  .forum-post {
    border: 1px solid rgba(10,10,20,0.04);
    padding:12px;
    border-radius:10px;
    margin-bottom:12px;
    background: #fff;
  }
  .post-meta {
    display:flex;
    justify-content:space-between;
    gap:8px;
    margin-bottom:8px;
    color:#555;
    font-size:13px;
  }
  .post-actions {
    display:flex;
    gap:8px;
    margin-top:8px;
  }
  .reply {
    margin-top:10px;
    margin-left:18px;
    padding:8px;
    background:#fbfbfe;
    border-radius:8px;
    border:1px solid rgba(106,13,173,0.03);
  }
  .small {
    font-size:13px;
    color:#666;
  }
  .modal-backdrop {
    position:fixed;
    inset:0;
    background: rgba(10,10,30,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  }
  .modal {
    width: min(520px, 94%);
    background: white;
    padding:18px;
    border-radius:12px;
  }
  .form-row {
    display:flex;
    flex-direction:column;
    gap:8px;
    margin-bottom:10px;
  }
  label { font-weight:600; color:#333; }
  input[type="text"], input[type="email"], textarea {
    padding:10px;
    border-radius:8px;
    border:1px solid rgba(10,10,20,0.08);
    font-size:14px;
  }
  textarea { min-height:80px; resize:vertical; }
  .inline {
    display:flex;
    gap:10px;
    align-items:center;
  }
  .hint { font-size:12px; color:#7a7a7a; }
  .admin-id {
    padding:8px 10px;
    background: #fff;
    border-radius:8px;
    border:1px dashed rgba(106,13,173,0.18);
    color:#6a0dad;
    font-weight:700;
  }
  @media (max-width:600px) {
    .cf-header { flex-direction:column; align-items:flex-start; gap:8px; }
  }
  `;
  if (!document.getElementById("cf-styles")) {
    const style = document.createElement("style");
    style.id = "cf-styles";
    style.innerHTML = css;
    document.head.appendChild(style);
  }
};

const STORAGE_KEYS = {
  POSTS: "cf_posts_v1",
  REPLIES: "cf_replies_v1",
  ANNOUNCEMENTS: "cf_announcements_v1",
  ADMIN: "cf_admin_v1",
  CODES: "cf_verif_codes_v1", // simulated sent codes
};

const generate7Digit = () => {
  // Ensure leading zeros allowed: generate number 0..9999999 and pad to 7 digits
  const n = Math.floor(Math.random() * 10000000);
  return n.toString().padStart(7, "0");
};

export default function CommunityForum() {
  injectStyles();

  // forum state
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState({}); // {postId: [{...reply}]}
  const [announcements, setAnnouncements] = useState([]);

  // admin state
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: "",
    refTag: "",
    email: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [admin, setAdmin] = useState(null); // { username, refTag, email, id }
  const [sentCodes, setSentCodes] = useState({}); // email->code (simulated)

  // posting UI
  const [userName, setUserName] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [announcementText, setAnnouncementText] = useState("");

  // load from localStorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || "[]");
      const r = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPLIES) || "{}");
      const a = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || "[]"
      );
      const adm = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ADMIN) || "null"
      );
      const codes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CODES) || "{}"
      );
      setPosts(p);
      setReplies(r);
      setAnnouncements(a);
      setAdmin(adm);
      setSentCodes(codes);
    } catch (e) {
      // ignore parse errors
      console.warn("CF: load error", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPLIES, JSON.stringify(replies));
  }, [replies]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ANNOUNCEMENTS,
      JSON.stringify(announcements)
    );
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  }, [admin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(sentCodes));
  }, [sentCodes]);

  // Helpers
  const nowISO = () => new Date().toISOString();

  // Posts
  const handleCreatePost = () => {
    if (!userName.trim() || !newPostText.trim()) {
      alert("Please enter your name and message to post.");
      return;
    }
    const newPost = {
      id: "post_" + Date.now(),
      author: userName.trim(),
      text: newPostText.trim(),
      createdAt: nowISO(),
    };
    setPosts((s) => [newPost, ...s]);
    setNewPostText("");
  };

  const handleReply = (postId) => {
    const text = (replyText[postId] || "").trim();
    if (!text) {
      alert("Please enter a reply message.");
      return;
    }
    const r = {
      id: "reply_" + Date.now(),
      author: userName.trim() || "Anonymous",
      text,
      createdAt: nowISO(),
    };
    setReplies((prev) => {
      const next = { ...prev, [postId]: [...(prev[postId] || []), r] };
      return next;
    });
    setReplyText((prev) => ({ ...prev, [postId]: "" }));
  };

  // Admin: open modal
  const openAdminModal = () => {
    setAdminModalOpen(true);
    setAdminForm({ username: "", refTag: "", email: "" });
    setCodeSent(false);
    setEnteredCode("");
  };

  // Admin: generate code and "send" it (simulate)
  const sendAdminCode = () => {
    const { username, refTag, email } = adminForm;
    if (!username.trim() || !refTag.trim() || !email.trim()) {
      alert("All fields are required: username, reference tag id, and email.");
      return;
    }
    const code = generate7Digit();
    // "Send" code: store in sentCodes mapping. In real app: POST to backend which emails code.
    const next = {
      ...sentCodes,
      [email.trim().toLowerCase()]: { code, createdAt: nowISO() },
    };
    setSentCodes(next);
    setCodeSent(true);

    // user feedback
    alert(
      `Verification code (simulated) sent to ${email.trim()}. (Code: ${code})`
    );
    // In production: the alert and code should NOT be shown; this is only for demo/simulation.
  };

  // Admin: verify code and login
  const verifyAdminCode = () => {
    const { username, refTag, email } = adminForm;
    if (!username.trim() || !refTag.trim() || !email.trim()) {
      alert("All fields are required.");
      return;
    }
    if (!enteredCode.trim()) {
      alert("Please enter the 7-digit verification code sent to your email.");
      return;
    }
    const record = sentCodes[email.trim().toLowerCase()];
    if (!record) {
      alert(
        "No verification code found for that email. Click 'Send Code' first."
      );
      return;
    }
    if (record.code !== enteredCode.trim()) {
      alert("Incorrect verification code. Please try again.");
      return;
    }

    // success -> log admin in
    // Create an admin user id. We'll combine refTag + short hash to remain readable.
    const id = `ADMIN-${refTag.trim().toUpperCase()}-${Math.floor(
      Math.random() * 9000 + 1000
    )}`;
    const adm = {
      username: username.trim(),
      refTag: refTag.trim(),
      email: email.trim().toLowerCase(),
      id,
      loggedAt: nowISO(),
    };
    setAdmin(adm);
    setAdminModalOpen(false);
    setCodeSent(false);
    setEnteredCode("");
    alert(`Welcome ${adm.username}. You are now logged in as ${adm.id}`);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    alert("Admin logged out.");
  };

  // Admin post announcement
  const postAnnouncement = () => {
    if (!admin) {
      alert("Only admin may post announcements.");
      return;
    }
    if (!announcementText.trim()) {
      alert("Please enter announcement text.");
      return;
    }
    const ann = {
      id: "ann_" + Date.now(),
      author: admin.username,
      text: announcementText.trim(),
      createdAt: nowISO(),
    };
    setAnnouncements((s) => [ann, ...s]);
    setAnnouncementText("");
  };

  // Simple UI helpers
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="cf-wrapper" role="region" aria-label="Community forum">
      <div className="cf-header">
        <div className="cf-title">
          <div className="cf-badge">Community</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              Neighborhood Forum
            </div>
            <div className="small">
              Connect, ask, and share — friendly and safe space
            </div>
          </div>
        </div>

        <div className="cf-actions">
          <button
            className="cf-btn"
            onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
            title="Go to the post composer"
          >
            Post
          </button>

          <button
            className="cf-btn primary"
            onClick={openAdminModal}
            title="Admin login"
          >
            Admin
          </button>
        </div>
      </div>

      <div className="cf-card" style={{ marginTop: 16 }}>
        {/* Admin area (visible only to admin) */}
        {admin ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <div className="small">Logged in as</div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <div className="admin-id">{admin.id}</div>
                  <div style={{ fontWeight: 700 }}>{admin.username}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="cf-btn" onClick={logoutAdmin}>
                  Logout
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="small">Post Announcement (admin)</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Write an announcement for everyone..."
                  style={{ flex: 1 }}
                />
                <button className="cf-btn primary" onClick={postAnnouncement}>
                  Announce
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div className="small">Admin Privileges</div>
              <div style={{ marginTop: 6 }}>
                <strong className="small" style={{ color: "#6a0dad" }}>
                  Admin area is hidden — login via Admin button
                </strong>
              </div>
            </div>

            <div className="small hint">
              Admins can post announcements that appear above posts.
            </div>
          </div>
        )}
      </div>

      {/* Announcements (visible to all) */}
      {announcements.length > 0 && (
        <div
          className="cf-card announcement-area"
          aria-live="polite"
          style={{ marginTop: 12 }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8, color: "#4b1466" }}>
            Announcements
          </div>
          {announcements.map((a) => (
            <div key={a.id} className="announcement-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{ fontWeight: 700 }}>{a.author}</div>
                <div className="small">{formatDate(a.createdAt)}</div>
              </div>
              <div style={{ marginTop: 8 }}>{a.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Posting composer */}
      <div className="cf-card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="form-row">
              <label>Your name</label>
              <input
                type="text"
                placeholder="How should others call you? (required)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Write a post</label>
              <textarea
                placeholder="Share something helpful, ask a question, or start a discussion..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </div>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                className="cf-btn"
                onClick={() => {
                  setUserName("");
                  setNewPostText("");
                }}
              >
                Clear
              </button>
              <button className="cf-btn primary" onClick={handleCreatePost}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div style={{ marginTop: 14 }}>
        {posts.length === 0 ? (
          <div className="cf-card small">
            No posts yet — be the first to say hello!
          </div>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="forum-post"
              role="article"
              aria-labelledby={p.id}
            >
              <div className="post-meta">
                <div>
                  <strong>{p.author}</strong>{" "}
                  <span className="small">• {formatDate(p.createdAt)}</span>
                </div>
                <div className="small">Post ID: {p.id}</div>
              </div>
              <div
                id={p.id}
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}
              >
                {p.text}
              </div>

              {/* Replies */}
              <div style={{ marginTop: 10 }}>
                {(replies[p.id] || []).map((r) => (
                  <div key={r.id} className="reply">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{r.author}</div>
                      <div className="small">{formatDate(r.createdAt)}</div>
                    </div>
                    <div style={{ marginTop: 6 }}>{r.text}</div>
                  </div>
                ))}
              </div>

              {/* Reply composer */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Reply..."
                    value={replyText[p.id] || ""}
                    onChange={(e) =>
                      setReplyText((s) => ({ ...s, [p.id]: e.target.value }))
                    }
                    style={{ flex: 1 }}
                  />
                  <button
                    className="cf-btn"
                    onClick={() => setReplyText((s) => ({ ...s, [p.id]: "" }))}
                  >
                    Clear
                  </button>
                  <button
                    className="cf-btn primary"
                    onClick={() => handleReply(p.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADMIN MODAL */}
      {isAdminModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Admin login"
        >
          <div className="modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 800, color: "#4b1466" }}
                >
                  Admin login
                </div>
                <div className="small hint">
                  Enter username, reference tag id and your admin email to
                  receive a 7-digit verification code.
                </div>
              </div>
              <div>
                <button
                  className="cf-btn"
                  onClick={() => setAdminModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="form-row">
                <label>Admin username</label>
                <input
                  type="text"
                  value={adminForm.username}
                  onChange={(e) =>
                    setAdminForm((s) => ({ ...s, username: e.target.value }))
                  }
                  placeholder="e.g., alice_admin"
                />
              </div>

              <div className="form-row">
                <label>Reference Tag ID</label>
                <input
                  type="text"
                  value={adminForm.refTag}
                  onChange={(e) =>
                    setAdminForm((s) => ({ ...s, refTag: e.target.value }))
                  }
                  placeholder="e.g., REF-2025-A"
                />
              </div>

              <div className="form-row">
                <label>Admin email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="admin@domain.com"
                />
                <div className="hint">
                  All fields required. A 7-digit verification code will be sent
                  to this email (simulated).
                </div>
              </div>

              {!codeSent ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="cf-btn primary" onClick={sendAdminCode}>
                    Send Code
                  </button>
                  <button
                    className="cf-btn"
                    onClick={() => {
                      setAdminModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 8 }}>
                  <div className="form-row">
                    <label>Enter the 7-digit code sent to your email</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={7}
                      value={enteredCode}
                      onChange={(e) =>
                        setEnteredCode(
                          e.target.value.replace(/[^\d]/g, "").slice(0, 7)
                        )
                      }
                      placeholder="e.g. 0123456"
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="cf-btn primary"
                      onClick={verifyAdminCode}
                    >
                      Verify & Login
                    </button>
                    <button
                      className="cf-btn"
                      onClick={() => {
                        setCodeSent(false);
                        setEnteredCode("");
                      }}
                    >
                      Resend
                    </button>
                  </div>
                  <div className="hint" style={{ marginTop: 8 }}>
                    Tip: This demo simulates sending the code. For a real app,
                    replace the sendAdminCode() function with a secure backend
                    API that emails the code and expires it after a short time.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
