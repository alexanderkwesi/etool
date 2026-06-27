import React, { useState, useEffect } from "react";
import "./Use_CommunityForum2.css";

const CommunityForum = () => {
  const [language, setLanguage] = useState("en");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [adminAnnouncement, setAdminAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    tagId: "",
    code: "",
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // Enhanced sample posts with more realistic data
  const initialPosts = [
    {
      id: 1,
      title: "Welcome to Our Engineering Community Forum! 🎉",
      content:
        "We're thrilled to launch this space where engineers can collaborate, share knowledge, and help each other grow. Feel free to ask questions, share insights, or start discussions about any engineering topics. Let's build an amazing community together!",
      author: "Admin",
      date: "2024-01-15",
      isAnnouncement: true,
      replies: [
        {
          id: 1,
          content:
            "This is fantastic! Looking forward to learning from experienced engineers and contributing to the community.",
          author: "SarahChen",
          date: "2024-01-15",
        },
        {
          id: 2,
          content:
            "Great initiative! The engineering community needed a dedicated space like this. Excited to be part of it!",
          author: "MikeEngineer",
          date: "2024-01-15",
        },
        {
          id: 3,
          content:
            "Perfect timing! I was just looking for a platform to discuss CAD optimization techniques with peers.",
          author: "AlexTech",
          date: "2024-01-16",
        },
      ],
    },
    {
      id: 2,
      title: "Best Practices for Large CAD File Conversion? 📐",
      content:
        "I'm working with complex mechanical assemblies that often exceed 500MB when exported. What are your proven strategies for maintaining quality while reducing file size during conversion? Specifically interested in STEP to DWF workflows.",
      author: "CADExpert23",
      date: "2024-01-16",
      isAnnouncement: false,
      replies: [
        {
          id: 1,
          content:
            "I recommend using the built-in simplification tools in SolidWorks before export. Also, consider breaking large assemblies into smaller sub-assemblies for better management.",
          author: "MechanicalPro",
          date: "2024-01-16",
        },
        {
          id: 2,
          content:
            "For STEP files, try adjusting the tolerance settings. A slightly larger tolerance can significantly reduce file size without noticeable quality loss in most engineering applications.",
          author: "DesignGuru",
          date: "2024-01-17",
        },
      ],
    },
    {
      id: 3,
      title: "STEP vs DWF vs DWG - Collaboration Format Discussion 💬",
      content:
        "Our distributed team is debating the best format for cross-platform collaboration. We have users on Windows, Mac, and Linux systems. What are your experiences with these formats in mixed environments?",
      author: "TeamLead_Emma",
      date: "2024-01-17",
      isAnnouncement: false,
      replies: [
        {
          id: 1,
          content:
            "DWF works great for review purposes but STEP is better for actual engineering work. For mixed environments, we've had success with PDF for 2D and STEP for 3D.",
          author: "CrossPlatformDev",
          date: "2024-01-17",
        },
        {
          id: 2,
          content:
            "Consider the end use: DWF for lightweight viewing, STEP for manufacturing, DWG for AutoCAD users. We maintain all three for different stakeholders.",
          author: "ManufacturingEng",
          date: "2024-01-18",
        },
      ],
    },
    {
      id: 4,
      title: "File Comparison Tools Recommendation 🔍",
      content:
        "Looking for reliable tools to compare different versions of engineering drawings. Preferably something that can handle CAD files and highlight dimensional changes automatically. Any suggestions?",
      author: "QualityControl",
      date: "2024-01-18",
      isAnnouncement: false,
      replies: [],
    },
  ];

  useEffect(() => {
    const savedPosts = localStorage.getItem("forumPosts");
    const savedAdmin = localStorage.getItem("isAdmin");
    const savedAdminId = localStorage.getItem("adminId");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(initialPosts);
    }

    if (savedAdmin === "true") {
      setIsAdmin(true);
      setAdminId(savedAdminId || "ADM001");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("forumPosts", JSON.stringify(posts));
  }, [posts]);

 const translations = {
   en: {
     welcome: "Community Forum",
     tagline: "Connect, share, and learn with fellow engineers",
     post: "Create Post",
     admin: "Admin Login",
     announcements: "Announcements",
     recentPosts: "Recent Posts",
     postTitle: "Post Title",
     postContent: "What's on your mind?",
     submit: "Submit Post",
     announcementTitle: "Announcement Title",
     announcementContent: "Important information for the community",
     submitAnnouncement: "Post Announcement",
     login: "Admin Login",
     username: "Admin Username",
     tagId: "Reference Tag ID",
     code: "Verification Code",
     requestCode: "Request Code",
     loginBtn: "Login",
     logout: "Logout",
     reply: "Reply",
     writeReply: "Write your reply...",
     postReply: "Post Reply",
   },
   de: {
     welcome: "Community-Forum",
     tagline: "Verbinden, teilen und lernen Sie mit anderen Ingenieuren",
     post: "Beitrag erstellen",
     admin: "Admin-Login",
     announcements: "Ankündigungen",
     recentPosts: "Aktuelle Beiträge",
     postTitle: "Beitragstitel",
     postContent: "Was beschäftigt Sie?",
     submit: "Beitrag abschicken",
     announcementTitle: "Ankündigungstitel",
     announcementContent: "Wichtige Informationen für die Community",
     submitAnnouncement: "Ankündigung posten",
     login: "Admin-Login",
     username: "Admin-Benutzername",
     tagId: "Referenz-Tag-ID",
     code: "Bestätigungscode",
     requestCode: "Code anfordern",
     loginBtn: "Anmelden",
     logout: "Abmelden",
     reply: "Antworten",
     writeReply: "Schreiben Sie Ihre Antwort...",
     postReply: "Antwort posten",
   },
   fr: {
     welcome: "Forum Communautaire",
     tagline: "Connectez-vous, partagez et apprenez avec d'autres ingénieurs",
     post: "Créer un Post",
     admin: "Connexion Admin",
     announcements: "Annonces",
     recentPosts: "Posts Récents",
     postTitle: "Titre du Post",
     postContent: "Qu'est-ce qui vous préoccupe ?",
     submit: "Soumettre le Post",
     announcementTitle: "Titre de l'Annonce",
     announcementContent: "Informations importantes pour la communauté",
     submitAnnouncement: "Publier l'Annonce",
     login: "Connexion Admin",
     username: "Nom d'utilisateur Admin",
     tagId: "ID de Tag de Référence",
     code: "Code de Vérification",
     requestCode: "Demander le Code",
     loginBtn: "Se Connecter",
     logout: "Se Déconnecter",
     reply: "Répondre",
     writeReply: "Écrivez votre réponse...",
     postReply: "Publier la Réponse",
   },
   es: {
     welcome: "Foro Comunitario",
     tagline: "Conecta, comparte y aprende con otros ingenieros",
     post: "Crear Publicación",
     admin: "Inicio de Sesión Admin",
     announcements: "Anuncios",
     recentPosts: "Publicaciones Recientes",
     postTitle: "Título de la Publicación",
     postContent: "¿Qué tienes en mente?",
     submit: "Enviar Publicación",
     announcementTitle: "Título del Anuncio",
     announcementContent: "Información importante para la comunidad",
     submitAnnouncement: "Publicar Anuncio",
     login: "Inicio de Sesión Admin",
     username: "Nombre de Usuario Admin",
     tagId: "ID de Etiqueta de Referencia",
     code: "Código de Verificación",
     requestCode: "Solicitar Código",
     loginBtn: "Iniciar Sesión",
     logout: "Cerrar Sesión",
     reply: "Responder",
     writeReply: "Escribe tu respuesta...",
     postReply: "Publicar Respuesta",
   },
   it: {
     welcome: "Forum della Community",
     tagline: "Connettiti, condividi e impara con altri ingegneri",
     post: "Crea Post",
     admin: "Login Admin",
     announcements: "Annunci",
     recentPosts: "Post Recenti",
     postTitle: "Titolo del Post",
     postContent: "A cosa stai pensando?",
     submit: "Invia Post",
     announcementTitle: "Titolo Annuncio",
     announcementContent: "Informazioni importanti per la community",
     submitAnnouncement: "Pubblica Annuncio",
     login: "Login Admin",
     username: "Nome Utente Admin",
     tagId: "ID Tag di Riferimento",
     code: "Codice di Verifica",
     requestCode: "Richiedi Codice",
     loginBtn: "Accedi",
     logout: "Disconnetti",
     reply: "Rispondi",
     writeReply: "Scrivi la tua risposta...",
     postReply: "Pubblica Risposta",
   },
 };


  const t = translations[language];

  const generateVerificationCode = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

  const handleRequestCode = () => {
    if (!loginData.username || !loginData.tagId) {
      alert("Please enter username and tag ID first");
      return;
    }

    const verificationCode = generateVerificationCode();
    setLoginData((prev) => ({ ...prev, code: verificationCode }));
    alert(`Verification code sent to admin email: ${verificationCode}`);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.tagId || !loginData.code) {
      alert("Please fill all fields");
      return;
    }

    if (
      loginData.username === "admin" &&
      loginData.tagId === "ADM001" &&
      loginData.code
    ) {
      setIsAdmin(true);
      setAdminId("ADM001");
      setShowAdminLogin(false);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminId", "ADM001");
      setLoginData({ username: "", tagId: "", code: "" });
      alert("Admin access granted!");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminId("");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminId");
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert("Please fill in both title and content");
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: isAdmin ? "Admin" : "User",
      date: new Date().toISOString().split("T")[0],
      isAnnouncement: false,
      reply: 'reply',
      replies: [],
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!adminAnnouncement.title || !adminAnnouncement.content) {
      alert("Please fill in both title and content");
      return;
    }

    const announcement = {
      id: Date.now(),
      title: adminAnnouncement.title,
      content: adminAnnouncement.content,
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
      isAnnouncement: true,
      replies: [],
    };

    setPosts([announcement, ...posts]);
    setAdminAnnouncement({ title: "", content: "" });
  };

  const handleReplySubmit = (postId, content) => {
    if (!content.trim()) return;

    const newReply = {
      id: Date.now(),
      content: content,
      author: isAdmin ? "Admin" : "User",
      date: new Date().toISOString().split("T")[0],
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newReply] }
          : post
      )
    );

    setReplyingTo(null);
    setReplyContent("");
  };

  const ReplyForm = ({ postId, onCancel }) => {
    return (
      <div className="reply-form slide-in">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReplySubmit(postId, replyContent);
          }}
          className="form"
        >
          <div className="form__group">
            <textarea
              placeholder={t.writeReply}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="3"
              className="form-textarea"
              autoFocus
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn--primary">
              💬 {t.postReply}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn--secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const PostCard = ({ post }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
      <article
        className={`post ${
          post.isAnnouncement ? "post-announcement" : ""
        } fade-in`}
      >
        {post.isAnnouncement && (
          <div className="announcement-banner">
            <span>📢 Official Announcement</span>
          </div>
        )}

        <div className="post-content">
          <div className="post-header">
            <h3 className="post-title">{post.title}</h3>
            <span className="post-date">{post.date}</span>
          </div>

          <div className="author-info">
            <div
              className={`author-avatar ${
                post.author === "Admin" ? "admin" : "user"
              }`}
            >
              {post.author.charAt(0)}
            </div>
            <span className="author-name">{post.author}</span>
            {post.isAnnouncement && (
              <span className="admin-tag">Verified Admin</span>
            )}
          </div>

          <div className="post-body">
            <p>{post.content}</p>
          </div>

          {/* Replies Section */}
          <div className="replies-section">
            <div className="replies-header">
              <span>💬 {t.reply}</span>
              <span className="replies-count">{post.replies.length}</span>
            </div>

            {post.replies.length > 0 && (
              <div className="replies-list">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="reply slide-in">
                    <div className="reply-header">
                      <div className="reply-author">
                        <div
                          className={`reply-avatar ${
                            reply.author === "Admin" ? "admin" : "user"
                          }`}
                        >
                          {reply.author.charAt(0)}
                        </div>
                        <span className="reply-name">{reply.author}</span>
                      </div>
                      <span className="reply-date">{reply.date}</span>
                    </div>
                    <p className="reply-content">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Action */}
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="btn btn--secondary"
                style={{ marginTop: "var(--space-4)" }}
              >
                ✍️ {t.reply}
              </button>
            ) : (
             
              <ReplyForm
                postId={post.id}
                onCancel={() => setShowReplyForm(false)}
              />
            
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container__">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="logo-circle">⚙️</div>
              <div>
                <h1>{t.welcome}</h1>
                <p className="header-tagline">{t.tagline}</p>
              </div>
            </div>

            <div className="admin_select_container">
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <div className="admin-badge">
                    <span>👑 Admin: {adminId}</span>
                  </div>
                )}

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select"
                  style={{ color: "lightgray" }}
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                </select>

                <div style={{ margin: "15px" }}>
                  {isAdmin ? (
                    <button onClick={handleLogout} className="btn btn-danger">
                      🚪 {t.logout}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="btn btn-primary"
                    >
                      🔐 {t.admin}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="grid lg:grid-cols-3">
            {/* Left Sidebar - Post Creation */}
            <div className="sidebar">
              {/* User Post Form */}
              <div className="card">
                <h3 className="card-header">📝 {t.post}</h3>
                <form onSubmit={handlePostSubmit} className="form space-y-4">
                  <div className="form__group">
                    <input
                      type="text"
                      placeholder={t.postTitle}
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form__group">
                    <textarea
                      placeholder={t.postContent}
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      rows="5"
                      className="form-textarea"
                    />
                  </div>
                  <button type="submit" className="btn btn--primary btn--full">
                    🚀 {t.submit}
                  </button>
                </form>
              </div>

              {/* Admin Announcement Form */}
              {isAdmin && (
                <div className="card card-announcement">
                  <h3 className="card-header">📢 {t.submitAnnouncement}</h3>
                  <form
                    onSubmit={handleAnnouncementSubmit}
                    className="form space-y-4"
                  >
                    <div className="form__group">
                      <input
                        type="text"
                        placeholder={t.announcementTitle}
                        value={adminAnnouncement.title}
                        onChange={(e) =>
                          setAdminAnnouncement({
                            ...adminAnnouncement,
                            title: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form__group">
                      <textarea
                        placeholder={t.announcementContent}
                        value={adminAnnouncement.content}
                        onChange={(e) =>
                          setAdminAnnouncement({
                            ...adminAnnouncement,
                            content: e.target.value,
                          })
                        }
                        rows="5"
                        className="form-textarea"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn--secondary btn--full"
                    >
                      📣 {t.submitAnnouncement}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
              <h2 className="posts-title">{t.recentPosts}</h2>

              {posts.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state__text">{t.noPosts}</p>
                  <button
                    onClick={() =>
                      document.querySelector(".form-input")?.focus()
                    }
                    className="btn btn--primary"
                    style={{ marginTop: "var(--space-6)" }}
                  >
                    🎯 {t.startDiscussion}
                  </button>
                </div>
              ) : (
                
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay fade-in">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{t.login}</h3>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="modal__form space-y-6">
              <div className="form__group">
                <label className="form__label">{t.username}</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="form-input"
                  placeholder="Enter admin username"
                />
              </div>

              <div className="form__group">
                <label className="form__label">{t.tagId}</label>
                <input
                  type="text"
                  value={loginData.tagId}
                  onChange={(e) =>
                    setLoginData({ ...loginData, tagId: e.target.value })
                  }
                  className="form-input"
                  placeholder="Enter reference tag ID"
                />
              </div>

              <div className="form__group">
                <label className="form__label">{t.code}</label>
                <div className="code-group">
                  <input
                    type="text"
                    value={loginData.code}
                    onChange={(e) =>
                      setLoginData({ ...loginData, code: e.target.value })
                    }
                    className="form-input code-group__input"
                    placeholder="7-digit verification code"
                  />
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    className="btn btn--secondary"
                  >
                    📧 {t.requestCode}
                  </button>
                </div>
              </div>

              <div className="form__actions flex space-x-3">
                <button type="submit" className="btn btn--primary flex-1">
                  🔑 {t.loginBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="btn btn--secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
