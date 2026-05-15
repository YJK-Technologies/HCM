import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import ForgotPopup from "./Forgotpopup";
import loginIllustration from './Images/login.svg';
import Logo from "./main.png";       // YJK gold logo (YJKLOGO.PNG / main.png)

const config = require('./Apiconfig');

/* ── Bubble colours mapping ── */
const BUBBLE_TYPES = [
  'gold','amber','silver','gold','amber','gold','silver','amber',
  'gold','silver','amber','gold','silver','gold','amber','silver','gold','amber'
];

const BubbleField = () => (
  <div className="bubble-field" aria-hidden="true">
    {BUBBLE_TYPES.map((cls, i) => (
      <div key={i} className={`bubble ${cls}`} />
    ))}
  </div>
);

const PILLS = [
  { label: 'Payroll',     cls: '' },
  { label: 'Attendance',  cls: 'dim' },
  { label: 'Appraisals',  cls: '' },
  { label: 'Onboarding',  cls: 'dim' },
];

const Login = () => {
  const navigate = useNavigate();

  const [user_code,     setuser_code]     = useState('');
  const [user_password, setuser_password] = useState('');
  const [loginError,    setLoginError]    = useState('');
  const [showPassword,  setShowPassword]  = useState(false);
  const [open,          setOpen]          = useState(false);
  const [isCapsLockOn,           setIsCapsLockOn]           = useState(false);
  const [showCapsLockWarning,    setShowCapsLockWarning]    = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loading,       setLoading]       = useState(false);

  const secretKey = 'yjk26012024';

  /* ── Caps Lock ── */
  useEffect(() => {
    const handle = (e) => {
      if (e instanceof KeyboardEvent && e.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
        setShowCapsLockWarning(true);
        setTimeout(() => setShowCapsLockWarning(false), 2000);
      } else {
        setIsCapsLockOn(false);
        setShowCapsLockWarning(false);
      }
    };
    window.addEventListener('keydown', handle);
    window.addEventListener('keyup',   handle);
    return () => {
      window.removeEventListener('keydown', handle);
      window.removeEventListener('keyup',   handle);
    };
  }, []);

  const arrayBufferToBase64 = (buf) => {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  /* ── Submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    setTimeout(() => setLoading(false), 3000);

    try {
      const encryptedUserCode  = CryptoJS.AES.encrypt(user_code,     secretKey).toString();
      const encryptedPassword  = CryptoJS.AES.encrypt(user_password, secretKey).toString();

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_code: encryptedUserCode, user_password: encryptedPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        const [{ user_code: uc, role_id, user_images, email_id }] = data;

        if (user_images?.data) {
          sessionStorage.setItem('user_image', arrayBufferToBase64(user_images.data));
        }

        sessionStorage.setItem('isLoggedIn',   true);
        sessionStorage.setItem('user_code',    uc);
        sessionStorage.setItem('role_id',      role_id);
        sessionStorage.setItem('userEmailId',  email_id);

        await UserPermission(role_id);
        await fetchUserData(uc);
      } else {
        const err = await response.json();
        setLoginError(err.message);
      }
    } catch (error) {
      setLoginError('Internal server error occurred!');
    } finally {
      setIsPageLoading(false);
    }
  };

  const UserPermission = async (role_id) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('permissions', JSON.stringify(data));
        window.dispatchEvent(new Event('permissionsUpdated'));
      }
    } catch (err) { console.error(err); }
  };

  const fetchUserData = async (userCode) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/getusercompany`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_code: userCode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          handleSave(data[0]);
          navigate('/AccountInformation');
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = (data) => {
    if (!data) return;
    sessionStorage.setItem('selectedCompanyCode',  data.company_no);
    sessionStorage.setItem('selectedCompanyName',  data.company_name);
    sessionStorage.setItem('selectedLocationCode', data.location_no);
    sessionStorage.setItem('selectedLocationName', data.location_name);
    sessionStorage.setItem('selectedShortName',    data.short_name);
    sessionStorage.setItem('selectedUserName',     data.user_name);
    sessionStorage.setItem('selectedUserCode',     data.user_code);
  };

  return (
    <>
      <div className="login-page">
        <BubbleField />
        <div className="top-logo">
          <img src={Logo} alt="YJK Logo" className="orb-logo" />
        </div>
        <div className="main-container">
          <div className="design-panel">
            <div className="left-logo-block">
              <img src={Logo} alt="YJK Logo" className="left-logo-img" />
            </div>
            <div className="welcome-section">
              <div className="hcm-badge">
                <span className="hcm-badge-dot" />
                <span className="hcm-badge-label">HCM Platform</span>
              </div>
              <h1 className="welcome-heading">
                Human Capital<br /><em>Management</em>
              </h1>
              <p className="welcome-sub">
                Streamline your workforce. Payroll, attendance, appraisals — all in one place.
              </p>
            </div>
            <div className="feature-pills">
              {PILLS.map((p) => (
                <span className="pill" key={p.label}>
                  <span className={`pill-icon ${p.cls}`} />
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <div className="signup-panel login-input-area">

            <div className="panel-header">
              {/* <h2 className="signup-title">Welcome back</h2> */}
              <h2 className="signup-title">Welcome</h2>
              <p className="signup-subtitle">Sign in to your YJK HCM account</p>
            </div>

            <form className="signup-form" onSubmit={handleLogin}>

              <div className="field-group">
                <label htmlFor="user_code" className="input-label">User Code</label>
                <span className="field-icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  id="user_code"
                  placeholder="Enter your user code"
                  autoComplete="off"
                  value={user_code}
                  onChange={(e) => setuser_code(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label htmlFor="password" className="input-label">Password</label>
                <span className="field-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <div className="password-wrapper">
                  <input
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    value={user_password}
                    onChange={(e) => setuser_password(e.target.value)}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              </div>
              {showCapsLockWarning && isCapsLockOn && (
                <div className="caps-warning">⚠ Caps Lock is on</div>
              )}
              {loginError && (
                <div className="error-msg">✕ {loginError}</div>
              )}
              <div className="form-options">
                <div className="remember-me-container">
                  <input type="checkbox" id="remember-me" className="custom-checkbox" />
                  <label htmlFor="remember-me" className="checkbox-label">Remember me</label>
                </div>
                <span
                  className="forgot-password-link"
                  onClick={() => setOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
                >
                  Forgot Password?
                </span>
              </div>
              <button
                type="submit"
                className={`create-account-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>Please wait <span className="spinner" /></>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            <div className="login-footer">
              <span className="login-footer-line" />
              <span className="login-footer-text">© YJK Human Capital Management</span>
              <span className="login-footer-line" />
            </div>
          </div>
        </div>
      </div>
      <ForgotPopup open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Login;