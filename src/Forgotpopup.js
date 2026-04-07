// import { useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';

// const config = require('./Apiconfig');

// const ForgotPopup = ({ open, handleClose }) => {
//   const [email_id, setemail_id] = useState('');
//   const [user_code, setuser_code] = useState('');
//   const [enteredOtp, setEnteredOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [new_password, setNew_Password] = useState('');
//   const [loginError, setLoginError] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [password, setPassword] = useState(false);

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`${config.apiBaseUrl}/forgetPassword`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email_id, user_code }),
//       });

//       if (response.ok) {
//         setOtpSent(true);
//       } else {
//         const errorData = await response.json();
//         console.error('Error:', errorData.message);
//         setLoginError("User doesn't exist. Register as a new user");
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       setLoginError("Internal server error occurred!");
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`${config.apiBaseUrl}/verify-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email_id, enteredOtp }),
//       });

//       if (response.ok) {
//         console.log('OTP verified successfully');
//         setPassword(true);
//       } else {
//         const errorData = await response.json();
//         console.error('Error:', errorData.message);
//         setOtpError("Invalid OTP");
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       setOtpError("Internal server error occurred!");
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (newPassword === new_password) {
//       try {
//         const response = await fetch(`${config.apiBaseUrl}/passwords`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email_id, user_password: new_password, user_code }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           handleClose();

//           toast.success("Password updated successfully")
//           console.log('Password updated successfully');
//         } else {

//           toast.error("Error updating password")
//           console.log('Error updating password');
//         }
//       } catch (error) {

//         toast.error("Error updating password")
//         console.log('Error updating password');
//       }
//     } else {
//       setOtpError('Wrong Otp');
//       toast.error("Wrong Otp")
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="modal-overlay">

//       <ToastContainer position="top-right" className="toast-design" theme="colored" />

//       <div className="custom-modal container-fluid Topnav-screen">
//         <div className="custom-modal-body">

//           {/* Header */}
//           <div className="shadow-lg p-1 bg-light rounded main-header-box">
//             <div className="header-flex">

//               <h1 className="custom-modal-title">Verification</h1>

//               <div className="action-wrapper">
//                 <div className="action-icon delete" onClick={handleClose}>
//                   <span className="tooltip">Close</span>
//                   <i className="fa-solid fa-xmark"></i>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Body Container */}
//           <div className="form-row shadow-lg p-2 bg-light rounded mt-2 container-form-box">

//             {/* Password Screen */}
//             {password ? (
//               <>
//                 <div className="form-block col-md-12">
//                   <div className="inputGroup">
//                     <input
//                       id="newPassword"
//                       className="exp-input-field form-control"
//                       type="password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       placeholder=" "
//                     />
//                     <label className="exp-form-labels">Enter New Password</label>
//                   </div>
//                 </div>

//                 <div className="form-block col-md-12">
//                   <div className="inputGroup">
//                     <input
//                       id="confirmPassword"
//                       className="exp-input-field form-control"
//                       type="password"
//                       value={new_password}
//                       onChange={(e) => setNew_Password(e.target.value)}
//                       placeholder=" "
//                     />
//                     <label className="exp-form-labels">Confirm New Password</label>
//                   </div>
//                 </div>

//                 <div className="col-12">
//                   <div className="search-btn-wrapper">
//                     <div className="icon-btn save" onClick={handlePasswordSubmit}>
//                       <span className="tooltip">Submit</span>
//                       <i className="fa-solid fa-arrow-right"></i>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : otpSent ? (
//               <>
//                 {/* OTP Screen */}
//                 <div className="form-block col-md-12">
//                   <div className="inputGroup">
//                     <input
//                       id="otp"
//                       className="exp-input-field form-control"
//                       value={enteredOtp}
//                       onChange={(e) => setEnteredOtp(e.target.value)}
//                       placeholder=" "
//                     />
//                     <label className="exp-form-labels">Enter OTP</label>
//                   </div>
//                 </div>

//                 <div className="col-12">
//                   <div className="search-btn-wrapper">
//                     <div className="icon-btn save" onClick={handleOtpSubmit}>
//                       <span className="tooltip">Submit</span>
//                       <i className="fa-solid fa-arrow-right"></i>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Email Screen */}
//                 <div className="form-block col-md-12">
//                   <div className="inputGroup">
//                     <input
//                       id="email"
//                       className="exp-input-field form-control"
//                       type="text"
//                       value={user_code}
//                       onChange={(e) => setuser_code(e.target.value)}
//                       placeholder=" "
//                     />
//                     <label className="exp-form-labels">User Code</label>
//                   </div>
//                 </div>

//                 <div className="form-block col-md-12">
//                   <div className="inputGroup">
//                     <input
//                       id="email"
//                       className="exp-input-field form-control"
//                       type="email"
//                       value={email_id}
//                       onChange={(e) => setemail_id(e.target.value)}
//                       placeholder=" "
//                     />
//                     <label className="exp-form-labels">Email ID</label>
//                   </div>
//                 </div>

//                 <div className="col-12">
//                   <div className="search-btn-wrapper">
//                     <div className="icon-btn save" onClick={handleEmailSubmit}>
//                       <span className="tooltip">Verify</span>
//                       <i className="fa-solid fa-check"></i>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Error message section */}
//             {otpError && <div className="text-danger mt-2">{otpError}</div>}
//             {loginError && <div className="text-danger mt-2">{loginError}</div>}

//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default ForgotPopup;

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
            <div className="auth-modal-card">
                <div className="auth-modal-header">
                    <div>
                        <h2>Reset Password</h2>
                        <p>Follow the steps to recover your account</p>
                    </div>
                    <button className="close-circle-btn" onClick={onClose}>
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
                                    className="auth-text-input" 
                                    placeholder="••••••••"
                                    value={confirm_password}
                                    onChange={(e) => setConfirm_Password(e.target.value)}
                                    required 
                                />
                            </div>
                            <button type="submit" className="auth-btn-primary">Update Password</button>
                        </form>
                    ) : otpSent ? (
                        <form className="auth-form" onSubmit={handleOtpSubmit}>
                            <div className="auth-info-tag">We sent a 4-digit code to {email_id}</div>
                            <div className="auth-input-group">
                                <label>Verification Code</label>
                                <input 
                                    type="text" 
                                    className="auth-text-input text-center otp-input" 
                                    placeholder="0 0 0 0"
                                    value={enteredOtp}
                                    onChange={(e) => setEnteredOtp(e.target.value)}
                                    maxLength="6"
                                    required 
                                />
                            </div>
                            <button type="submit" className="auth-btn-primary">Verify Code</button>
                            <button type="button" className="auth-btn-link" onClick={() => setOtpSent(false)}>Back to Email</button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleEmailSubmit}>
                            <div className="auth-input-group">
                                <label>User Code</label>
                                <input 
                                    type="text" 
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
                                    className="auth-text-input" 
                                    placeholder="name@company.com"
                                    value={email_id}
                                    onChange={(e) => setemail_id(e.target.value)}
                                    required 
                                />
                            </div>
                            <button type="submit" className="auth-btn-primary">Send Reset Code</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPopup;