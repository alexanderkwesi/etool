# ETool – Full-Stack Integration Guide

## What's in this delivery

| File | Purpose |
|------|---------|
| `server.py` | **Unified Flask backend** – replaces all separate server files |
| `src_api/apiConfig.js` | **Frontend API layer** – every endpoint, one file |
| `src_api/useAuth.js` | **React Auth hook + Context Provider** |
| `requirements.txt` | Python dependencies |

---

## Quick Start

### 1 – Backend

```bash
# From the project root (where server.py lives)
pip install -r requirements.txt
python server.py
# → http://127.0.0.1:5000
```

The SQLite database (`server/engineering_tools.db`) is used automatically.
All tables are created on first run if they don't exist.

### 2 – Frontend

```bash
npm install
npm start
# → http://localhost:3000
```

---

## How to wire apiConfig.js into your React components

### Step 1 – Copy to src/

```
cp src_api/apiConfig.js  src/apiConfig.js
cp src_api/useAuth.js    src/hooks/useAuth.js
```

### Step 2 – Wrap your app with AuthProvider (index.js or App.js)

```jsx
import { AuthProvider } from './hooks/useAuth';
// ...
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Step 3 – Replace hardcoded API calls in existing components

#### Before (typical existing pattern):
```js
const API_BASE = "http://127.0.0.1:5000/api";
const response = await axios.post(`${API_BASE}/login`, { email, password }, { withCredentials: true });
```

#### After (using apiConfig.js):
```js
import { authApi } from '../apiConfig';
const data = await authApi.login(email, password);
```

### Step 4 – Use the auth hook in any component

```jsx
import { useAuth } from '../hooks/useAuth';

function LoginButton() {
  const { login, logout, user, isAuthenticated, error, loading } = useAuth();

  const handleLogin = async () => {
    await login('user@example.com', 'password123');
    // user is now set in context – no need to manage localStorage
  };
  // ...
}
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Email + password login |
| POST | `/api/signup` | Register new user |
| POST | `/api/logout` | Clear session |
| GET  | `/api/check-auth` | Check session validity |
| POST | `/api/auth/google/callback` | Google OAuth user upsert |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/user/profile` | Current user data |
| POST | `/api/user/category-setup` | Save profession details |
| GET  | `/api/verify-category-setup` | Check if setup complete |

### Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/plans` | List active subscription plans |
| POST | `/api/create-subscription` | Assign plan to user |

### PayPal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/paypal/config` | Return client-id to frontend |
| POST | `/api/paypal/create-order` | Create PayPal payment |
| POST | `/api/paypal/execute-payment` | Execute payment after approval |
| POST | `/api/paypal/verify-payment` | Verify payment state |

### Dashboard / Team / Billing / Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/dashboard/stats` | Aggregate stats |
| GET  | `/api/dashboard/activity` | Recent activity |
| GET  | `/api/team/members` | List team members |
| POST | `/api/team/members` | Invite team member |
| GET  | `/api/billing/history` | Billing records |
| POST | `/api/files/upload` | Upload document |
| POST | `/api/files/convert` | Convert document |
| GET  | `/api/health` | Health check |

---

## Environment Variables (`.env` in project root)

```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
REACT_APP_GOOGLE_CLIENT_ID=...
FLASK_SECRET_KEY=change-me-in-production
```

---

## Updating existing frontend files

The following files already use `const API_BASE = "http://127.0.0.1:5000/api"` and
call axios/fetch directly. They work as-is, but can be migrated to `apiConfig.js`
for consistency:

- `src/Use_Signon.js`      → use `authApi`
- `src/Use_Signonpage.js`  → use `authApi`
- `src/paymentService.js`  → use `paypalApi`
- `src/Use_Payment.js`     → use `paypalApi` + `plansApi`

The API_BASE value **5000** is the same in all files, so the backend starts
on the correct port automatically.
