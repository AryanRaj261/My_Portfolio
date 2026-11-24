import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiCopy, FiLogOut, FiShield, FiX } from "react-icons/fi";
import { authConfigured, supabase } from "../lib/supabase";

const initialOtp = { channel: "email", destination: "", value: "" };
const isE164 = (value) => /^\+[1-9]\d{7,14}$/.test(value);

export function AuthDialog({ onClose, onSessionChange, open }) {
  const [mode, setMode] = useState("login");
  const [channel, setChannel] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(initialOtp);
  const [step, setStep] = useState("method");
  const [session, setSession] = useState(null);
  const [mfa, setMfa] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const resetFeedback = () => { setMessage(""); setError(""); };

  useEffect(() => {
    if (!open || !supabase) return undefined;
    let mounted = true;
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        setSession(data.session);
        onSessionChange(data.session.user);
      }
    };
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      onSessionChange(nextSession?.user ?? null);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [onSessionChange, open]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  const setAuthenticated = async (nextSession) => {
    setSession(nextSession);
    onSessionChange(nextSession?.user ?? null);
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel === "aal1" && assurance?.nextLevel === "aal2") {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp?.find((item) => item.status === "verified");
      if (factorsError || !factor) throw factorsError || new Error("Authenticator verification is required, but no factor was found.");
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (challengeError) throw challengeError;
      setMfa({ kind: "challenge", factorId: factor.id, challengeId: challenge.id });
      setStep("mfa");
      setMessage("Enter the six-digit code from your authenticator app.");
      return;
    }
    setStep("account");
    setMessage("You are signed in securely.");
  };

  const requestOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    const destination = channel === "phone" ? phone.trim() : email.trim().toLowerCase();
    if (!destination) return setError(`Enter your ${channel === "phone" ? "phone number" : "email address"}.`);
    if (channel === "phone" && !isE164(destination)) return setError("Use an international phone number, for example +919876543210.");
    setBusy(true);
    const request = channel === "phone"
      ? { phone: destination }
      : { email: destination, options: { emailRedirectTo: window.location.origin, shouldCreateUser: mode === "signup" } };
    const { error: authError } = await supabase.auth.signInWithOtp(request);
    setBusy(false);
    if (authError) return setError(authError.message);
    setOtp({ channel, destination, value: "" });
    setStep("otp");
    setMessage(`A verification code was sent to ${destination}.`);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    resetFeedback();
    if (!/^\d{6,8}$/.test(otp.value)) return setError("Enter the verification code exactly as received.");
    setBusy(true);
    const credentials = otp.channel === "phone"
      ? { phone: otp.destination, token: otp.value, type: "sms" }
      : { email: otp.destination, token: otp.value, type: "email" };
    const { data, error: authError } = await supabase.auth.verifyOtp(credentials);
    setBusy(false);
    if (authError) return setError(authError.message);
    try {
      await setAuthenticated(data.session);
    } catch (nextError) {
      setError(nextError.message || "Your account was verified, but authenticator setup needs attention.");
    }
  };

  const socialLogin = async (provider) => {
    resetFeedback();
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    setBusy(false);
    if (authError) setError(authError.message);
  };

  const beginAuthenticatorEnrollment = async () => {
    resetFeedback();
    setBusy(true);
    const { data: enrollment, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Portfolio authenticator" });
    if (enrollError) { setBusy(false); return setError(enrollError.message); }
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: enrollment.id });
    setBusy(false);
    if (challengeError) return setError(challengeError.message);
    setMfa({ kind: "enroll", factorId: enrollment.id, challengeId: challenge.id, qrCode: enrollment.totp.qr_code, secret: enrollment.totp.secret });
    setStep("mfa");
    setMessage("Scan the QR code with an authenticator app, then enter its six-digit code.");
  };

  const verifyAuthenticator = async (event) => {
    event.preventDefault();
    resetFeedback();
    if (!/^\d{6}$/.test(mfaCode)) return setError("Enter the current six-digit authenticator code.");
    setBusy(true);
    const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: mfa.factorId, challengeId: mfa.challengeId, code: mfaCode });
    setBusy(false);
    if (verifyError) return setError(verifyError.message);
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    onSessionChange(data.session?.user ?? null);
    setMfa(null);
    setMfaCode("");
    setStep("account");
    setMessage(mfa.kind === "enroll" ? "Authenticator app enabled." : "Authenticator verified. You are signed in.");
  };

  const signOut = async () => {
    setBusy(true);
    const { error: signOutError } = await supabase.auth.signOut();
    setBusy(false);
    if (signOutError) return setError(signOutError.message);
    setSession(null);
    onSessionChange(null);
    setStep("method");
    setMessage("Signed out.");
  };

  const displayName = session?.user?.email || session?.user?.phone || "your account";
  const dialogTitle = step === "mfa" ? "Verify your authenticator" : step === "account" ? "Your account" : mode === "signup" ? "Create your access" : "Welcome back";

  return (
    <div className="auth-dialog__backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
        <button className="auth-dialog__close" type="button" onClick={onClose} aria-label="Close authentication"><FiX /></button>
        <div className="auth-dialog__intro"><span><FiShield /> Secure access</span><h2 id="auth-dialog-title">{dialogTitle}</h2><p>Use a verified one-time code or a trusted provider. No portfolio password is stored here.</p></div>
        {!authConfigured ? (
          <div className="auth-dialog__configuration" role="status"><strong>Authentication needs configuration.</strong><p>Add the Supabase URL and publishable key in Vercel, then enable the required providers. The UI will not simulate a login before a secure backend is connected.</p></div>
        ) : step === "account" && session ? (
          <div className="auth-dialog__account"><p>Signed in as <strong>{displayName}</strong>.</p><button className="auth-dialog__primary" type="button" disabled={busy} onClick={beginAuthenticatorEnrollment}><FiShield /> Add authenticator app</button><button className="auth-dialog__secondary" type="button" disabled={busy} onClick={signOut}><FiLogOut /> Sign out</button></div>
        ) : step === "mfa" ? (
          <form className="auth-dialog__form" onSubmit={verifyAuthenticator}>
            {mfa?.kind === "enroll" && <div className="auth-dialog__qr"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(mfa.qrCode)}`} alt="Authenticator setup QR code" /><p>Can’t scan it? Use <code>{mfa.secret}</code><button type="button" onClick={() => navigator.clipboard?.writeText(mfa.secret)} aria-label="Copy authenticator secret"><FiCopy /></button></p></div>}
            <label>Authenticator code<input inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={mfaCode} onChange={(event) => setMfaCode(event.target.value.replace(/\D/g, ""))} placeholder="123456" /></label>
            <button className="auth-dialog__primary" type="submit" disabled={busy}>{busy ? "Verifying…" : <><FiCheck /> Verify securely</>}</button>
          </form>
        ) : step === "otp" ? (
          <form className="auth-dialog__form" onSubmit={verifyOtp}>
            <button className="auth-dialog__back" type="button" onClick={() => { setStep("method"); resetFeedback(); }}><FiArrowLeft /> Use a different method</button>
            <label>Verification code<input inputMode="numeric" autoComplete="one-time-code" maxLength="8" value={otp.value} onChange={(event) => setOtp((current) => ({ ...current, value: event.target.value.replace(/\D/g, "") }))} placeholder="Enter code" /></label>
            <button className="auth-dialog__primary" type="submit" disabled={busy}>{busy ? "Verifying…" : <><FiCheck /> Verify code</>}</button>
          </form>
        ) : (
          <>
            <div className="auth-dialog__tabs" role="tablist" aria-label="Authentication mode"><button type="button" role="tab" aria-selected={mode === "login"} onClick={() => setMode("login")}>Log in</button><button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => setMode("signup")}>Sign up</button></div>
            <div className="auth-dialog__channels" role="tablist" aria-label="Verification channel"><button type="button" role="tab" aria-selected={channel === "email"} onClick={() => setChannel("email")}>Email OTP</button><button type="button" role="tab" aria-selected={channel === "phone"} onClick={() => setChannel("phone")}>Phone OTP</button></div>
            <form className="auth-dialog__form" onSubmit={requestOtp}><label>{channel === "email" ? "Email address" : "Phone number"}<input type={channel === "email" ? "email" : "tel"} autoComplete={channel === "email" ? "email" : "tel"} value={channel === "email" ? email : phone} onChange={(event) => channel === "email" ? setEmail(event.target.value) : setPhone(event.target.value)} placeholder={channel === "email" ? "you@example.com" : "+919876543210"} /></label><button className="auth-dialog__primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send verification code"}</button></form>
            <div className="auth-dialog__divider"><span>or continue with</span></div>
            <div className="auth-dialog__social"><button type="button" onClick={() => socialLogin("google")} disabled={busy}><b>G</b> Google</button><button type="button" onClick={() => socialLogin("twitter")} disabled={busy}><b>𝕏</b> X / Twitter</button><button type="button" onClick={() => socialLogin("facebook")} disabled={busy}><b>f</b> Facebook</button></div>
          </>
        )}
        {message && <p className="auth-dialog__message" role="status">{message}</p>}
        {error && <p className="auth-dialog__error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
