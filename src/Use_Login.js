/**
 * Use_Login.js
 *
 * This file satisfies the import in Use_GoogleAuth.js:
 *   import AuthPage from './Use_Login';
 *
 * The full login/signup implementation lives in Use_Signonpage.js.
 * Use_Login is simply an alias so Use_GoogleAuth (which wraps the
 * auth form inside a branded header) can import it by this name.
 *
 * Props accepted (passed through from Use_GoogleAuth):
 *   isLogin {boolean} – true = show login tab, false = show signup tab
 */

export { default } from './Use_Signonpage';
