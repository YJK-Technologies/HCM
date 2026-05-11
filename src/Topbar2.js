import { useEffect, useState, useCallback } from 'react';
import './Topbar2.css';
import './NewSideBar.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DocumentPdf from './pdf/YJK_ERP_DOCUMENTATION.pdf';
import { ThemeProvider } from './ThemeContext';
import AppContent from './App_content';
import { showConfirmationToast } from './ToastConfirmation';
import { ToastContainer, toast } from 'react-toastify';

// Assuming config is imported from Apiconfig
const TopBar = () => {
  const user_code = sessionStorage.getItem('selectedUserCode');
  const user_name = sessionStorage.getItem('selectedUserName');
  const [selectedImage, setSelectedImage] = useState(null);
  const userImageBase64 = sessionStorage.getItem('user_image');
  const userImageSrc = userImageBase64 ? `data:image/png;base64,${userImageBase64}` : null;
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(sessionStorage.getItem('selectedCompanyName') || '');
  const [locationName, setLocationName] = useState(sessionStorage.getItem('selectedLocationName') || '');
  const shortName = sessionStorage.getItem('selectedShortName');
  const config = require('./Apiconfig'); // Make sure config is defined
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const company_code = sessionStorage.getItem('selectedCompanyCode');

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const fetchNotifications = useCallback(async () => {
    try {
      const payload = {
        company_code: company_code,
        CompanyCode: company_code,   // For CompOff 
        employee_id: user_code,      // For Loan, Visa, Travel, Shift
        EmployeeId: user_code,       // For Leave & CompOff
        swap_employee_id: user_code  // For Shift
      };

      const [shiftChangeRes, loanRes, leaveRes, visaRes, travelRes, compOffRes, shiftRes] = await Promise.all([
        fetch(`${config.apiBaseUrl}/shiftChangeRequestEmployee`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getLoanNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getLeaveNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getVisaNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getTravelNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getComOffNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        fetch(`${config.apiBaseUrl}/getShiftNotification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      ]);

      let combinedData = [];

      const process = async (res, type) => {
        if (res.status === 200) {
          const data = await res.json();
          combinedData = [...combinedData, ...data.map(item => ({ ...item, type }))];
        }
      };

      await process(shiftChangeRes, 'SHIFT CHANGE');
      await process(loanRes, 'LOAN');
      await process(leaveRes, 'LEAVE');
      await process(visaRes, 'VISA');
      await process(travelRes, 'TRAVEL');
      await process(compOffRes, 'COMPOFF');
      await process(shiftRes, 'SHIFT NOTIFICATION');

      setNotifications(combinedData);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [company_code, user_code, config.apiBaseUrl]);

  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleRequestAction = async (requestId, actionStatus) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/shiftRequestEmployeeApproval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: requestId,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          swap_employee_id: sessionStorage.getItem('selectedUserCode'),
          modified_by: sessionStorage.getItem('selectedUserCode'),
          is_swap_request: actionStatus
        }),
      });

      if (response.ok) {
        toast.success(`Request ${actionStatus} successfully!`);
        fetchNotifications();
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error processing request:", err);
      toast.error("Internal Server Error");
    }
  };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   navigate('/login', { replace: true });
  //   window.history.pushState(null, null, window.location.href);
  // };

  // const performLogout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   navigate('/login', { replace: true });
  //   window.history.pushState(null, null, window.location.href);
  // };

  const toggleDrawer = (e) => {
    if (e) e.preventDefault();
    setShowNotificationsDrawer(!showNotificationsDrawer);
  };


  const performLogout = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    sessionStorage.clear();

    if (theme) {
      localStorage.setItem("theme", theme);
    }

    navigate('/login', { replace: true });
    window.history.pushState(null, null, window.location.href);
  };

  // The function that triggers your custom confirmation toast
  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent link jump

    showConfirmationToast("Are you sure you want to logout?",
      performLogout,
      () => console.log("Logout cancelled")
    );
  };

  // Back button handling remains the same...
  useEffect(() => {
    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handlesetting = () => {
    navigate("/Settings")
  }

  const handleAccount = () => {
    navigate("/AccountInformation")
  }

  // File and Image handlers remain the same...
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size exceeds 1MB. Please upload a smaller file.',
          confirmButtonText: 'OK'
        });
        return;
      }

      Swal.fire({
        title: 'Do you want to change your profile picture?',
        text: "You selected a new image. Do you want to save it?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedImage(file);
          handleSaveImage(file);
          handleInsert(file);
        } else {
          e.target.value = null;
        }
      });
    }
  };

  const handleSaveImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('user_image', reader.result.split(',')[1]);
        setSelectedImage(null);

        Swal.fire(
          'Changed!',
          'Your profile picture has been updated.',
          'success'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = async (file) => {
    try {
      const formData = new FormData();
      formData.append("user_code", user_code);
      if (file) {
        formData.append("user_img", file);
      }

      const response = await fetch(`${config.apiBaseUrl}/UpdateUserImage`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          Swal.fire({
            title: "Success",
            text: "Data inserted successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        Swal.fire({
          title: 'Error!',
          text: errorResponse.message,
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        console.error("Failed to insert data");
        Swal.fire({
          title: 'Error!',
          text: 'Failed to insert data',
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error inserting data: ' + error.message,
        icon: 'error',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('sessionStorage has changed!');
      setCompanyName(sessionStorage.getItem('selectedCompanyName') || '');
      setLocationName(sessionStorage.getItem('selectedLocationName') || '');
    };

    window.addEventListener('storageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storageUpdate', handleStorageChange);
    };
  }, []);

  const handleOpenPDF = () => {
    window.open(DocumentPdf, '_blank');
  };

  const handleLoanSeen = async (loanRequestId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/loanNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loan_request_id: loanRequestId,
          is_notification_seen: 1,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking notification as seen:", err);
    }
  };

  const handleLeaveSeen = async (empId, fromDate) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/leaveNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EmployeeId: empId,
          FromDate: fromDate,
          is_notification_seen: 1,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Leave notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking leave as seen:", err);
    }
  };

  const handleVisaSeen = async (visaRequestId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/visaNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visa_request_id: visaRequestId,
          is_notification_seen: 1,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking notification as seen:", err);
    }
  };

  const handleTravelSeen = async (travelRequestId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/travelNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travel_request_id: travelRequestId,
          is_notification_seen: 1,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking notification as seen:", err);
    }
  };

  const handleCompOffSeen = async (empId, holidayDate, keyField) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/compOffNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EmployeeId: empId,
          HolidayDate: holidayDate,
          Keyfield: keyField,
          is_notification_seen: 1,
          CompanyCode: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking Comp Off as seen:", err);
    }
  };

  const handleShiftSeen = async (shiftRequestId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/shiftNotificationSeen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: shiftRequestId,
          is_notification_seen: 1,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        fetchNotifications();
        toast.success("Notification marked as seen");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (err) {
      console.error("Error marking notification as seen:", err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand bg-dark Topnav">
        <div className="container-fluid">

          {/* 1. Logo and App Name */}
          <a className="navbar-brand d-flex align-items-center">
            {/* <img src={logo} alt="Logo" width="40" height="40" className="d-inline-block align-top logo-img" />
          <b className="app-name">
            <sub>
              <sub>
                <i>
                  <span className="hcm-text">HCM</span>
                </i>
              </sub>
            </sub>
          </b> */}
          </a>

          {/* 2. Right-aligned Content */}
          <div className="d-flex align-items-center topbar-right-content">

            {/* Company and Location Info - Hidden on very small screens */}
            <div className="d-none d-sm-block"></div>
            <div className="company-info d-none d-sm-block mb-0 text-center me-2"> {/* Added me-4 for space */}
              <p className="company-name-text mb-0">{companyName}</p>
              <span className="location-name-text">{locationName}</span>
            </div>

            {/* Short Name and Location Info - Shown on very small screens */}
            <div className="d-sm-none"></div>
            <div className="company-info-mobile d-sm-none text-center">
              <p className="company-name-text-mobile mb-0">{shortName}</p>
              <span className="location-name-text-mobile">{locationName}</span>
            </div>

            {/* Welcome Message */}
            <div className="welcome-message d-none d-md-flex flex-column align-items-center justify-content-center ms-auto me-2"> 
              {/* ms-auto will push this group to the right, creating a gap from the company info */}
               <span className="user-name-text">Welcome</span>
              <span className="welcome-subtext">{user_name}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="profile-dropdown ms-3 mt-4">
              <a
                className="nav-link dropdown-toggle p-0"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userImageSrc ? (
                  <img
                    src={userImageSrc}
                    alt="User Avatar"
                    width="35"
                    height="35"
                    className="profile-avatar rounded-circle position-relative"
                    title={user_code}
                  />
                ) : (
                  <div
                    className="avatar-placeholder rounded-circle position-relative"
                    title={user_code}
                  >
                    {user_name ? user_name.charAt(0) : 'U'}
                  </div>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end profile-dropdown-card" aria-labelledby="navbarDropdown">
                {/* User Info Header */}
                <li className="px-3 py-2 border-bottom mb-2">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-2"> {/* Added flex-shrink-0 */}
                      {userImageSrc ? (
                        <img src={userImageSrc} alt="User" width="40" height="40" className="rounded-circle border" />
                      ) : (
                        <div className="avatar-placeholder-small">{user_code?.charAt(0)}</div>
                      )}
                    </div>
                    <div className="lh-sm">
                      {/* Title attribute added so user can see full name on hover if it is cut off */}
                      <p className="mb-0 fw-bold text-white" style={{ paddingLeft: "0px" }} title={user_name || 'User'}>
                        {user_name || 'User'}
                      </p>
                    </div>
                  </div>
                </li>

                {/* Main Actions */}
                <li>
                  <a className="dropdown-item" onClick={handleAccount}>
                    <i className="bi bi-building me-2"></i>Companies
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" onClick={handlesetting}>
                    <i className="bi bi-gear me-2"></i>Settings
                  </a>
                </li>

                <li>
                  <label className="dropdown-item mb-0">
                    <i className="bi bi-camera me-2"></i>Change Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </li>

                {selectedImage && (
                  <li className="px-2 mt-1">
                    <button className="btn btn-sm btn-primary w-100 py-1" onClick={handleSaveImage}>Save Changes</button>
                  </li>
                )}

                {/* Divider */}
                <li><hr className="dropdown-divider border-secondary" /></li>

                {/* Logout */}
                <li>
                  <a className="dropdown-item logout-item" onClick={handleLogoutClick}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>

            {/* Notification Bell */}
            <div className="notification-wrapper ms-3">
              <a className="text-white p-0 theme-icon-link position-relative"
                id="notificationDropdown" data-bs-toggle="dropdown">
                <i className="bi bi-bell-fill" style={{ fontSize: '1.2rem' }}></i>
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </a>

              <ul className="dropdown-menu dropdown-menu-end notification-dropdown-card p-0">
                <li className="px-3 py-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 text-white fw-bold">Recent Requests</h6>
                  <span className="badge bg-primary">{notifications.length} Total</span>
                </li>

                <div className="notification-scroll-area">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 2).map((noti) => (
                      <li key={noti.type === 'LOAN' ? `loan-${noti.loan_request_id}` : noti.request_id} className="w-100 border-bottom border-secondary p-3">
                        {noti.type === 'LOAN' ? (
                          /* LOAN NOTIFICATION DESIGN */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)' }}>
                                <i className="bi bi-cash-stack text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Loan Update</p>
                                  <span className="badge bg-soft-warning text-warning x-small">Loan</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', lineHeight: '1.4', paddingLeft: "0px" }}>
                                  {noti.message}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <button
                                className="action-btn-circle seen-btn"
                                title="Mark as Seen"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLoanSeen(noti.loan_request_id);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                            </div>
                          </div>
                        ) : noti.type === 'LEAVE' ? (
                          /* LEAVE NOTIFICATION DESIGN */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #20c997 0%, #087f5b 100%)' }}>
                                <i className="bi bi-calendar-check text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Leave Update</p>
                                  <span className="badge bg-soft-success text-success-light x-small">Leave</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', paddingLeft: "0px" }}>
                                  {noti.message} ({new Date(noti.FromDate).toLocaleDateString()})
                                </p>
                              </div>
                            </div>
                            <button
                              className="action-btn-circle seen-btn"
                              title="Mark as Seen"
                              style={{ color: '#20c997', border: '1px solid rgba(32, 201, 151, 0.3)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveSeen(noti.EmployeeId, noti.FromDate);
                              }}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </div>

                        ) : noti.type === 'VISA' ? (
                          /* VISA NOTIFICATION DESIGN */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}>
                                <i className="bi bi-globe2 text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Visa Update</p>
                                  <span className="badge bg-soft-info text-info x-small">Visa</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', lineHeight: '1.4', paddingLeft: "0px" }}>
                                  {noti.message} ({new Date(noti.travel_start_date).toLocaleDateString()})
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <button className="action-btn-circle seen-btn" title="Mark as Seen"
                                style={{ color: '#4e73df', border: '1px solid rgba(78, 115, 223, 0.3)' }}
                                onClick={(e) => { e.stopPropagation(); handleVisaSeen(noti.visa_request_id); }}>
                                <i className="bi bi-eye-fill"></i>
                              </button>
                            </div>
                          </div>
                        ) : noti.type === 'TRAVEL' ? (
                          /* TRAVEL NOTIFICATION DESIGN (DROPDOWN) */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)' }}>
                                <i className="bi bi-map text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Travel Update</p>
                                  <span className="badge bg-soft-cyan text-cyan x-small">Travel</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', lineHeight: '1.4', paddingLeft: "0px" }}>
                                  {noti.message} ({new Date(noti.travel_start_date).toLocaleDateString()})
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <button className="action-btn-circle seen-btn" title="Mark as Seen"
                                style={{ color: '#0dcaf0', border: '1px solid rgba(13, 202, 240, 0.3)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTravelSeen(noti.travel_request_id);
                                }}>
                                <i className="bi bi-eye-fill"></i>
                              </button>
                            </div>
                          </div>
                        ) : noti.type === 'COMPOFF' ? (
                          /* COMP OFF NOTIFICATION DESIGN */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #e65100 100%)' }}>
                                <i className="bi bi-sun-fill text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Comp Off Update</p>
                                  <span className="badge bg-soft-orange text-orange x-small">Comp Off</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', paddingLeft: "0px" }}>
                                  {noti.message} ({new Date(noti.HolidayDate).toLocaleDateString()})
                                </p>
                              </div>
                            </div>
                            <button
                              className="action-btn-circle seen-btn"
                              title="Mark as Seen"
                              style={{ color: '#fd7e14', border: '1px solid rgba(253, 126, 20, 0.3)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompOffSeen(noti.EmployeeId, noti.HolidayDate, noti.Keyfield);
                              }}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </div>
                        ) : noti.type === 'SHIFT NOTIFICATION' ? (
                          /* SHIFT NOTIFICATION DESIGN (DROPDOWN) */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3" style={{ background: 'linear-gradient(135deg, #6610f2 0%, #4e0891 100%)' }}>
                                <i className="bi bi-clock-fill text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>Shift Update</p>
                                  <span className="badge bg-soft-indigo text-indigo x-small">Shift</span>
                                </div>
                                <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: '11px', lineHeight: '1.4', paddingLeft: "0px" }}>
                                  {noti.message} ({new Date(noti.effective_date).toLocaleDateString()})
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <button
                                className="action-btn-circle seen-btn"
                                title="Mark as Seen"
                                style={{ color: '#6610f2', border: '1px solid rgba(102, 16, 242, 0.3)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShiftSeen(noti.request_id);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* EXISTING SHIFT REQUEST DESIGN */
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="req-avatar-small me-3">
                                {noti.EmployeeName.charAt(0)}
                              </div>
                              <div>
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0 fw-bold text-white small" style={{ paddingLeft: "0px" }}>{noti.EmployeeName}</p>
                                  <span className="badge bg-soft-purple text-purple x-small">Shift</span>
                                </div>
                                <small className="d-block text-white">ID: {noti.employee_id}</small>
                                <div className="mt-1 d-flex align-items-center text-white" style={{ fontSize: '11px' }}>
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {new Date(noti.FromDate).toLocaleDateString()}
                                  <i className="bi bi-arrow-right mx-1"></i>
                                  {noti.requested_shift_name}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                              <button className="action-btn-circle approve" title='Approved' onClick={(e) => { e.stopPropagation(); handleRequestAction(noti.request_id, "Approved"); }}>
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button className="action-btn-circle reject" title='Rejected' onClick={(e) => { e.stopPropagation(); handleRequestAction(noti.request_id, "Rejected"); }}>
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-muted small">No pending requests</li>
                  )}
                </div>

                <li className="p-0">
                  <button className="view-all-btn-professional w-100 border-0" onClick={toggleDrawer}>
                    <span>View All Notifications</span>
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </li>
              </ul>
            </div>

            {/* Theme Dropdown */}
            <div className="dropdown theme-dropdown d-md-block ms-3">
              <a
                className="text-white p-0 theme-icon-link"
                href="#"
                id="dropdownMenuButton"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Change Theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-droplet-fill" viewBox="0 0 16 16">
                  <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13" />
                </svg>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <ThemeProvider>
                  <AppContent />
                </ThemeProvider>
              </ul>
            </div>

            {/* Help/Documentation */}
            <div className="help-icon ms-3">
              <a
                className="text-white p-0 theme-icon-link"
                style={{ cursor: "pointer" }}
                onClick={handleOpenPDF}
                title='Help / Documentation'
              >
                <i className="fas fa-question-circle fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* FULL HEIGHT NOTIFICATION SIDE DRAWER */}
      <div className={`notification-side-drawer ${showNotificationsDrawer ? 'show' : ''}`}>
        <div className="drawer-header p-3 d-flex justify-content-between align-items-center border-bottom border-secondary">
          <h5 className="mb-0 text-white fw-bold">All Notifications ({notifications.length})</h5>
          <button className="btn-close btn-close-white" title='Close' onClick={toggleDrawer}></button>
        </div>

        <div className="drawer-body">
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div
                key={
                  noti.type === 'LOAN' ? `loan-drawer-${noti.loan_request_id}` :
                    noti.type === 'LEAVE' ? `leave-drawer-${noti.EmployeeId}-${noti.FromDate}` :
                      noti.request_id
                }
                className="notification-item-box border-bottom border-secondary p-3 drawer-item"
              >
                {noti.type === 'LOAN' ? (
                  /* LOAN DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)' }}>
                        <i className="bi bi-cash-stack text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Loan Notification</h6>
                          <span className="badge bg-soft-warning text-warning x-small">Status Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button className="action-btn-circle seen-btn" title="Mark as Seen"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoanSeen(noti.loan_request_id);
                        }}>
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>

                ) : noti.type === 'LEAVE' ? (
                  /* LEAVE DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #20c997 0%, #087f5b 100%)' }}>
                        <i className="bi bi-calendar-check text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Leave Notification</h6>
                          <span className="badge bg-soft-success text-success-light x-small">Status Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message} for <strong>{new Date(noti.FromDate).toLocaleDateString()}</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button
                        className="action-btn-circle seen-btn"
                        title="Mark as Seen"
                        style={{ color: '#20c997', border: '1px solid rgba(32, 201, 151, 0.3)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveSeen(noti.EmployeeId, noti.FromDate);
                        }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>

                ) : noti.type === 'VISA' ? (
                  /* VISA DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}>
                        <i className="bi bi-passport text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Visa Notification</h6>
                          <span className="badge bg-soft-info text-info x-small">Status Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message} for <strong>{new Date(noti.travel_start_date).toLocaleDateString()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button className="action-btn-circle seen-btn" title="Mark as Seen"
                        style={{ color: '#4e73df', border: '1px solid rgba(78, 115, 223, 0.3)' }}
                        onClick={(e) => { e.stopPropagation(); handleVisaSeen(noti.visa_request_id); }}>
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>

                ) : noti.type === 'TRAVEL' ? (
                  /* TRAVEL DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      {/* Icon with Cyan/Blue Sky Gradient */}
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)' }}>
                        <i className="bi bi-airplane-engines text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Travel Notification</h6>
                          <span className="badge bg-soft-cyan text-cyan x-small">Status Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message} for <strong>{new Date(noti.travel_start_date).toLocaleDateString()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button className="action-btn-circle seen-btn" title="Mark as Seen"
                        style={{ color: '#0dcaf0', border: '1px solid rgba(13, 202, 240, 0.3)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTravelSeen(noti.travel_request_id);
                        }}>
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>

                ) : noti.type === 'COMPOFF' ? (
                  /* COMP OFF DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #e65100 100%)' }}>
                        <i className="bi bi-calendar-plus text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Comp Off Notification</h6>
                          <span className="badge bg-soft-orange text-orange x-small">Status Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message} for holiday on <strong>{new Date(noti.HolidayDate).toLocaleDateString()}</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button
                        className="action-btn-circle seen-btn"
                        title="Mark as Seen"
                        style={{ color: '#fd7e14', border: '1px solid rgba(253, 126, 20, 0.3)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompOffSeen(noti.EmployeeId, noti.HolidayDate, noti.Keyfield);
                        }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>
                ) : noti.type === 'SHIFT NOTIFICATION' ? (
                  /* SHIFT NOTIFICATION DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3" style={{ background: 'linear-gradient(135deg, #6610f2 0%, #4e0891 100%)' }}>
                        <i className="bi bi-arrow-left-right text-white"></i>
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">Shift Notification</h6>
                          <span className="badge bg-soft-indigo text-indigo x-small">Roster Updated</span>
                        </div>
                        <p className="text-white-50 small mb-0" style={{ paddingLeft: "0px" }}>
                          {noti.message} effective from <strong>{new Date(noti.effective_date).toLocaleDateString()}</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button
                        className="action-btn-circle seen-btn"
                        title="Mark as Seen"
                        style={{ color: '#6610f2', border: '1px solid rgba(102, 16, 242, 0.3)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShiftSeen(noti.request_id);
                        }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* EXISTING SHIFT DRAWER DESIGN */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="req-avatar-small flex-shrink-0 me-3">
                        {noti.EmployeeName.charAt(0)}
                      </div>
                      <div className="notification-content" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <h6 className="text-white mb-0 fw-bold">{noti.EmployeeName}</h6>
                          <span className="badge bg-soft-purple text-purple x-small">Shift Change Request</span>
                        </div>
                        <p className="text-white-50 small mb-1 text-truncate-2" style={{ paddingLeft: "0px" }}>
                          Requested <strong>{noti.requested_shift_name}</strong> for {new Date(noti.FromDate).toLocaleDateString()}.
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 ms-3 flex-shrink-0">
                      <button className="action-btn-circle approve-btn" title="Approved" onClick={() => handleRequestAction(noti.request_id, "Approved")}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="action-btn-circle reject-btn" title='Rejected' onClick={() => handleRequestAction(noti.request_id, "Rejected")}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-5 text-center text-white-50">
              <i className="bi bi-bell-slash d-block mb-2 fs-2"></i>
              No notifications found.
            </div>
          )}
        </div>
      </div>
      {showNotificationsDrawer && <div className="drawer-overlay" onClick={toggleDrawer}></div>}
    </>
  );
};

export default TopBar;