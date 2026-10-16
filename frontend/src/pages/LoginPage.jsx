import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useAuth } from "../hooks/useAuth";
import "./LoginPage.css";

function LedgerIllustration() {
  return (
    <svg className="login-art" viewBox="0 0 560 300" role="img" aria-label="An open ledger tracking stock moving in and out">
      <path d="M27 22h227l26 18 26-18h227v250H306l-26 18-26-18H27z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M37 31h212l24 17v225l-20-15H37zM523 31H311l-24 17v225l20-15h216z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M58 90h170m-170 37h170m-170 37h170m-170 37h170m-170 37h170M332 90h170m-170 37h170m-170 37h170m-170 37h170m-170 37h170" stroke="currentColor" strokeWidth="1" />
      <path d="M195 90v148m278-148v148" stroke="currentColor" />
      <g fill="currentColor" fontFamily="monospace" fontSize="9" fontWeight="700">
        <text x="83" y="76">THE REGISTER</text><text x="352" y="76">IN / OUT</text>
        <text x="210" y="115">01</text><text x="210" y="152">02</text><text x="210" y="189">03</text>
        <text x="356" y="115">+</text><text x="356" y="152">−</text><text x="356" y="189">+</text>
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="auth-loading" role="status">Opening your ledger…</div>;
  if (user) return <Navigate to={location.state?.from?.pathname || ROUTES.dashboard} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password, remember);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="About the inventory ledger">
        <div>
          <p className="eyebrow">THE INVENTORY LEDGER</p>
          <h1 className="login-story__title serif">A place for<br />every unit.</h1>
          <p className="login-story__copy">Every product, every unit, every movement. A clear record of<br className="login-wide-break" /> what comes in, what goes out, and what’s next.</p>
        </div>
        <div className="login-story__art-wrap"><LedgerIllustration /><p>EVERY DETAIL, ON THE BOOKS.</p></div>
        <footer className="login-story__footer"><strong>ONE PLACE. EVERY UNIT.</strong><span>Main warehouse / PKR</span></footer>
      </section>

      <section className="login-panel">
        <div className="login-panel__inner">
          <p className="eyebrow">00 / OPEN YOUR LEDGER</p>
          <h2 className="login-panel__title serif">Welcome back.</h2>
          <p className="login-panel__intro">Sign in to keep everything accounted for.</p>

          <div className="login-card">
            <div className="login-card__head"><span className="serif">01 — Workspace access</span><LockKeyhole size={16} /></div>
            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field"><span>Email address</span><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="login-field"><span>Password</span><span className="login-password"><input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
              <div className="login-options"><label className="login-remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Keep me signed in</label><button className="login-forgot" type="button" onClick={() => setError("Contact your administrator to reset the password.")}>Forgot password?</button></div>
              {error && <p className="login-error" role="alert">{error}</p>}
              <button className="login-submit" type="submit" disabled={busy}><span>{busy ? "Signing in…" : "Sign in to Register"}</span>{!busy && <ArrowRight size={18} />}</button>
              <p className="login-hint">Using a shared device? Leave “Keep me signed in” unchecked.</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
