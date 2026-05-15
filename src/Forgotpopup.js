import { useState } from 'react';
import { toast } from 'react-toastify';

const config = require('./Apiconfig');

const ForgotPopup = ({ open, handleClose }) => {
    const [email_id, setemail_id] = useState('');
    const [user_code, setuser_code] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm_password, setConfirm_Password] = useState('');
    
    const [otpSent, setOtpSent] = useState(false);
    const [passwordStep, setPasswordStep] = useState(false);

    const resetStates = () => {
        setOtpSent(false);
        setPasswordStep(false);
        setemail_id('');
        setuser_code('');
        setEnteredOtp('');
    };

    const onClose = () => {
        resetStates();
        handleClose();
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiBaseUrl}/forgetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id, user_code }),
            });

            if (response.ok) {
                setOtpSent(true);
                toast.info("OTP sent to your email");
            } else {
                toast.error("User does not exist");
            }
        } catch (error) {
            toast.error("Server error occurred");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiBaseUrl}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id, enteredOtp }),
            });

            if (response.ok) {
                setPasswordStep(true);
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirm_password) {
            return toast.error("Passwords do not match");
        }
        try {
            const response = await fetch(`${config.apiBaseUrl}/passwords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id, user_password: confirm_password, user_code }),
            });
            if (response.ok) {
                toast.success("Password updated successfully");
                onClose();
            } else {
                toast.error("Error updating password");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    if (!open) return null;

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-card theme-adaptive-card">
                <div className="auth-modal-header">
                    <div>
                        <h2>Reset Password</h2>
                        <p>Follow the steps to recover your account</p>
                    </div>
                    <button className="close-circle-btn" title = "Close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="step-indicator">
                    <div className={`step ${!otpSent ? 'active' : 'completed'}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step ${otpSent && !passwordStep ? 'active' : passwordStep ? 'completed' : ''}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step ${passwordStep ? 'active' : ''}`}>3</div>
                </div>

                <div className="auth-modal-body">
                    {passwordStep ? (
                        <form className="auth-form" onSubmit={handlePasswordSubmit}>
                            <div className="auth-input-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    title = "Please enter the New Password"
                                    className="auth-text-input" 
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="auth-input-group">
                                <label>Confirm Password</label>
                                <input 
                                    type="password" 
                                    title = "Please enter the Confirm Password"
                                    className="auth-text-input" 
                                    placeholder="••••••••"
                                    value={confirm_password}
                                    onChange={(e) => setConfirm_Password(e.target.value)}
                                    required 
                                />
                            </div>
                            <button type="submit" title = "Update Password" className="auth-btn-primary">Update Password</button>
                        </form>
                    ) : otpSent ? (
                        <form className="auth-form" onSubmit={handleOtpSubmit}>
                            <div className="auth-info-tag">We sent a 4-digit code to {email_id}</div>
                            <div className="auth-input-group">
                                <label>Verification Code</label>
                                <input 
                                    type="text" 
                                    title = "Please enter the Verification Code"
                                    className="auth-text-input text-center otp-input" 
                                    placeholder="0 0 0 0"
                                    value={enteredOtp}
                                    onChange={(e) => setEnteredOtp(e.target.value)}
                                    maxLength="6"
                                    required 
                                />
                            </div>
                            <button type="submit" title = "Verify Code" className="auth-btn-primary">Verify Code</button>
                            <button type="button" title = "Back to Email" className="auth-btn-link" onClick={() => setOtpSent(false)}>Back to Email</button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleEmailSubmit}>
                            <div className="auth-input-group">
                                <label>User Code</label>
                                <input 
                                    type="text" 
                                    title = "Please enter the User Code"
                                    className="auth-text-input" 
                                    placeholder="Enter your user code"
                                    value={user_code}
                                    onChange={(e) => setuser_code(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="auth-input-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    title = "Please enter the Email Address"
                                    className="auth-text-input" 
                                    placeholder="name@company.com"
                                    value={email_id}
                                    onChange={(e) => setemail_id(e.target.value)}
                                    required 
                                />
                            </div>
                            <button type="submit" title = "Send Reset Code" className="auth-btn-primary">Send Reset Code</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPopup;