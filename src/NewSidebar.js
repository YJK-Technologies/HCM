import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NewSideBar.css";
import logo from './main.png'
import {
  BsBuilding,
  BsDiagram3,
  BsGeoAlt,
  BsShieldLock,
  BsPerson,
  BsPersonBadge,
  BsPersonLinesFill,
  BsCalendarCheck,
  BsBank,
  BsUpcScan,
  BsQrCodeScan,
  BsBriefcase,
  BsAward,
  BsPeople,
  BsCashStack,
  BsFileEarmarkText,
  BsClockHistory,
  BsGlobe,
  BsClock,
  BsCalendar3,
  BsGraphUp,
  BsSpeedometer2,
  BsGraphUpArrow,
  BsKanban,
  BsListTask,
  BsGear,
  BsSliders,
  BsBell,
  BsSun,
  BsClipboardCheck,
  BsBarChartSteps,
  BsFileBarGraph,
  BsPersonCheck,
  BsBarChartLine,
  BsChevronDown,
  BsWrenchAdjustable,
  BsPeopleFill,
  BsArrowRepeat,
  BsPersonPlus,
  BsBoxSeam,
  BsCalendarPlus
} from "react-icons/bs";
import {
  MdOutlineEventNote,
  MdOutlineRateReview,
  MdOutlinePersonSearch,
  MdOutlineAnalytics,
  MdOutlineGavel,
  MdOutlineGroupAdd,
  MdOutlineEventAvailable,
  MdOutlineSchedule,
  MdTravelExplore,
  MdFlightTakeoff,
  MdPayments,
  MdCalendarMonth,
  MdOutlineAccountBalance
} from "react-icons/md";
import { 
  HiOutlineUserGroup
} from "react-icons/hi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbClockCheck, TbHistory } from "react-icons/tb";
import {
  AiOutlinePercentage,
  AiOutlineFileDone,
  AiOutlineDashboard
} from "react-icons/ai";
import { FaHandHoldingUsd, FaCheckCircle, FaFileAlt, FaCalendarAlt } from "react-icons/fa";



const cleanPath = (path) => {
  if (!path) return '';
  let cleaned = path.startsWith('/') ? path : '/' + path;
  return cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
};

const filterMenuByPermission = (menuItems, allowedPaths) => {
  return menuItems.reduce((acc, item) => {
    let newItem = { ...item };

    if (item.subMenus) {
      const filteredSubMenus = filterMenuByPermission(item.subMenus, allowedPaths);

      if (filteredSubMenus.length > 0) {
        newItem.subMenus = filteredSubMenus;
        acc.push(newItem);
      }
    } else if (item.path) {
      const itemPath = cleanPath(item.path);

      if (allowedPaths.includes(itemPath)) {
        acc.push(newItem);
      }
    }

    return acc;
  }, []);
};

export const leafIconMap = {
  // --- ADMIN ---
  Company: BsBuilding,
  "Company Mapping": BsDiagram3,
  Location: BsGeoAlt,
  Role: BsShieldLock,
  "Role Mapping": BsPersonLinesFill,
  "Role Rights": BsClipboardCheck,
  User: BsPerson,

  // --- MASTERS ---
  Attribute: BsListTask,
  "Print Templates": BsFileEarmarkText,
  "Bank Account": BsBank,
  "Barcode Generator": BsUpcScan,
  "Barcode Scanner": BsQrCodeScan,
  Department: BsBriefcase,
  "Designation Info": BsAward,
  Intermediary: BsPeople,
  "Number Series": BsBarChartSteps,
  Warehouse: BsBuilding,
  "Financial Year Access": BsCalendarCheck,

  // --- HCM ---
  "Employee Information": BsPersonCheck,
  "Employee Personal Details": BsPersonBadge,
  "Department Dashboard": BsBarChartLine,
  "Admin Dashboard": BsSpeedometer2,
  "Employee Dashboard": BsFileBarGraph,
  "Salary Process": BsCashStack,
  "Payslip Master": AiOutlineFileDone,
  "Country Master": BsGlobe,
  "Time Zone Master": BsClock,
  "Shift Master": BsClockHistory,
  Grade: BsAward,
  Leave: BsCalendar3,
  Loan: BsCashStack,
  Announcement: BsBell,
  "Employee Holiday": BsSun,
  "Settings": BsGear,
  "Assets": BsBoxSeam,
  "Generate Shift": BsArrowRepeat,
  "Visa Requests": MdTravelExplore,
  "Loan Request": FaHandHoldingUsd,
  "Leave Request": FaCalendarAlt,
  "Loan Approvals": FaCheckCircle,
  "Loan Documents": FaFileAlt,
  "Travel Request": MdFlightTakeoff,
  "Loan Repayment Schedule": MdCalendarMonth,
  "Loan Payment": MdPayments,
  "Loan Type": MdOutlineAccountBalance,
  "Loan Status History": TbHistory,
  "Loan Dashboard": AiOutlineDashboard,
  "Comp Off Request": BsCalendarPlus,

  // --- INTERVIEW ---
  "Interview Master": BsPeople,
  "Interview Dashboard": BsGraphUp,
  "Interview Schedule Report": MdOutlineEventNote,
  "Interview Feedback Report": MdOutlineRateReview,
  "Candidate Interview Report": MdOutlinePersonSearch,
  "Panel Performance Report": MdOutlineAnalytics,
  "Hiring Decision Report": MdOutlineGavel,
  "Total Candidates Applied": MdOutlineGroupAdd,
  "Total Interviews Scheduled": MdOutlineEventAvailable,
  "Interview Completion Rate": AiOutlinePercentage,

  // --- PMS ---
  Project: BsKanban,
  "Project Mapping": BsDiagram3,
  Task: BsListTask,
  "Setting Screen": BsSliders,
  "Open Tickets": BsClipboardCheck,
  "Task Update": BsClockHistory,
  "Task Hours & Time Tracking": BsClock,
  "Project Progress": BsGraphUpArrow,
  "Project Chart Report": BsFileBarGraph,
  "Shift Summary Report": MdOutlineSchedule,
};

const menuData = [
  {
    label: "Admin",
    icon: BsPeopleFill,
    isDropdown: true,
    subMenus: [
      { label: "Company", path: "/Company" },
      { label: "Company Mapping", path: "/CompanyMapping" },
      { label: "Location", path: "/Location" },
      { label: "Role", path: "/Role" },
      { label: "Role Mapping", path: "/UserRoleMapping" },
      { label: "Role Rights", path: "/UserRights" },
      { label: "User", path: "/User" },
    ],
  },
  {
    label: "Masters",
    icon: BsWrenchAdjustable,
    isDropdown: true,
    subMenus: [
      { label: "Attribute", path: "/Attribute" },
      { label: "Print Templates", path: "/TemplateDesign" },
      { label: "Bank Account", path: "/BankAccount" },
      { label: "Barcode Generator", path: "/BarcodeGenerator" },
      { label: "Barcode Scanner", path: "/BarcodeScanner" },
      { label: "Department", path: "/Department" },
      { label: "Designation Info", path: "/DesgiantionInfo" },
      { label: "Intermediary", path: "/Intermediary" },
      { label: "Number Series", path: "/NumberSeries" },
      { label: "Warehouse", path: "/Warehouse" },
      { label: "Financial Year Access", path: "/FinancialYearAccess" },
      { label: "Country Master", path: "/CountryMaster" },
      { label: "Time Zone Master", path: "/TimeZoneGrid" },
    ],
  },
  {
    label: "ESS",
    icon: HiOutlineUserGroup,
    isDropdown: true,
    subMenus: [
      {
        label: "Dashboard",
        isDropdown: true,
        subMenus: [
          { label: "Admin Dashboard", path: "/ESSDashboard" },
          { label: "Employee Dashboard", path: "/EmployeeDashboard" },
          { label: "Department Dashboard", path: "/DepartmentDashboard" },
        ],
      },
      {
        label: "Employee",
        isDropdown: true,
        subMenus: [
          { label: "Employee Information", path: "/AddEmployeeInfo" },
          { label: "Employee Personal Details", path: "/ManualEmployeeInfo" },
        ],
      },
      {
        label: "Requests",
        isDropdown: true,
        subMenus: [
          { label: "Leave Request", path: "/LeaveRequest" },
          { label: "Visa Requests", path: "/VisaRequest" },
          { label: "Travel Request", path: "/TravelRequest" },
          { label: "Comp Off Request", path: "/CompOffRequest" },
        ],
      },
      {
        label: "Others",
        isDropdown: true,
        subMenus: [
         
          { label: "Grade", path: "/EmployeeGrade" },
          { label: "Leave", path: "/EmpLeave" },
          { label: "Announcement", path: "/Announce" },
          { label: "Employee Holiday", path: "/HoliDays" },
          { label: "Settings", path: "/WeekOff" },
          { label: "Assets", path: "/Assets" },
        ],
      },
      {
        label: "Reports",
        isDropdown: true,
        subMenus: [
          { label: "Loan Summary Report", path: "/LoanSummaryReports" },
          { label: "Pending Approvals Report", path: "/PendingApprovalsRepo" },
          { label: "Loan Disbursement Report", path: "/LoanDisbursementRepo" },
          { label: "Overdue Loans Report", path: "/OverdueLoansReport" },
          { label: "Repayment Schedule Report", path: "/RepaymentScheduleRep" },
        ],
      },
    ],
  },
  
  {
    label: "Payroll",
    icon: RiMoneyDollarCircleLine,
    isDropdown: true,
    subMenus: [
      { label: "Payslip Master", path: "/PayslipSalaryDays" },
      { label: "Salary Process", path: "/salarypath" },
      { label: "Loan Dashboard", path: "/LoanDashboard" },
      { label: "Loan", path: "/EmployeeLoan" },
      { label: "Loan Type", path: "/LoanType" },
      { label: "Loan Documents", path: "/LoanDocuments" },
      { label: "Loan Request", path: "/LoanRequest" },
      { label: "Loan Approvals", path: "/LoanApprovals" },
      { label: "Loan Payment", path: "/LoanPayment" },
      { label: "Loan Repayment Schedule", path: "/LoanSchedule" },
      { label: "Loan Status History", path: "/LoanStatusHistory" },

      {
        label: "Others",
        isDropdown: true,
        subMenus: [
         
          { label: "Settings", path: "/PayrollSettings" },
        ],
      },
    ],
  },
  {
    label: "Attendance",
    icon: TbClockCheck,
    isDropdown: true,
    subMenus: [
      {
        label: "Masters",
        isDropdown: true,
        subMenus: [
          { label: "Project", path: "/Project" },
          { label: "Project Mapping", path: "/ProjectMapping" },
          { label: "Task", path: "/Task" },
          { label: "Shift Master", path: "/ShiftMasterGrid" },
          { label: "Setting Screen", path: "/PMSsettings" },
        ],
      },
      {
        label: "Transactions",
        isDropdown: true,
        subMenus: [
          { label: "Open Tickets", path: "/OpenTickets" },
          { label: "Task Update", path: "/ProjectDetails" },
          { label: "Generate Shift", path: "/GenerateShift" },
        ],
      },
      {
        label: "Reports",
        isDropdown: true,
        subMenus: [
          { label: "Task Hours & Time Tracking", path: "/TaskHours" },
          { label: "Project Progress", path: "/ProjectProgress" },
          { label: "Project Chart Report", path: "/ProjectChartReport" },
          { label: "Shift Summary Report", path: "/ShiftSumRep" },
        ],
      },
        {
        label: "Others",
        isDropdown: true,
        subMenus: [
         
          { label: "Settings", path: "/PMSsettings" },
        ],
      },
    ],
  },
  {
    label: "Recruitment",
    icon: BsPersonPlus,
    isDropdown: true,
    subMenus: [
      { label: "Interview Master", path: "/JobMaster" },
      { label: "Interview Dashboard", path: "/InterviewDashboard" },
      { label: "Interview Schedule Report", path: "/InterviewScheduleRep" },
      { label: "Interview Feedback Report", path: "/InterviewFeedbackRep" },
      { label: "Candidate Interview Report", path: "/CandidateInterviewRe" },
      { label: "Panel Performance Report", path: "/PanelPerformanceRepo" },
      { label: "Hiring Decision Report", path: "/HiringDecisionReport" },
      { label: "Total Candidates Applied", path: "/TotalCandidatesAppli" },
      { label: "Total Interviews Scheduled", path: "/TotalInterviewsSched" },
      { label: "Interview Completion Rate", path: "/InterviewCompletionR" },
      
    ],
  },
];

const secondaryMenuData = [
  { label: "YJK TECHNOLOGIES" },
  { label: "Version 1.0.0" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const allowedPaths = useMemo(() => {
    try {
      const permissionsJSON = sessionStorage.getItem("permissions");
      const permissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];

      return Array.isArray(permissions)
        ? permissions.map((permission) =>
          permission.screen_type ? cleanPath(permission.screen_type) : ''
        ).filter(path => path.length > 0)
        : [];
    } catch (e) {
      console.error("Failed to parse permissions from sessionStorage:", e);
      return [];
    }
  }, []);

  const filteredMenuData = useMemo(() => {
    if (allowedPaths.length === 0) return [];

    return filterMenuByPermission(menuData, allowedPaths);
  }, [allowedPaths]);


  const toggleDropdown = (key) => {
    setOpenMenus((prev) => {
      const newState = {};

      if (prev[key]) {
        return { ...prev, [key]: false };
      }

      Object.keys(prev).forEach((k) => {
        if (k.startsWith(key) || key.startsWith(k)) {
          newState[k] = prev[k];
        }
      });

      newState[key] = true;

      return newState;
    });
  };

  const renderMenuItem = (item, keyPrefix) => {
    const Icon = item.icon;
    const isOpen = openMenus[keyPrefix];
    const isActive = location.pathname === item.path;
    const isSubActive = item.subMenus?.some(s => s.path === location.pathname);

    return (
      <li
        key={keyPrefix}
        className={`nav-item ${isOpen ? "open" : ""} ${isActive || isSubActive ? "active" : ""}`}
      >
        {item.isDropdown ? (
          <div
            className={`nav-link ${item.isDropdown && keyPrefix.includes('-') ? 'submenu-parent-link' : ''}`}
            onClick={() => toggleDropdown(keyPrefix)}
          >
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
            <BsChevronDown className={`dropdown-arrow ${isOpen ? "rotated" : ""}`} />
          </div>
        ) : (
          <Link to={item.path} className="nav-link">
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
          </Link>
        )}

        {item.subMenus && (
          <ul className={`dropdown-list ${isOpen ? "show" : ""}`}>
            {/* Render filtered submenus */}
            {item.subMenus.map((sub, i) => {
              const subKey = `${keyPrefix}-${i}`;
              const LeafIcon = leafIconMap[sub.label];
              return sub.isDropdown
                ? renderMenuItem(sub, subKey)
                : (
                  <li key={subKey}>
                    <Link
                      to={sub.path}
                      className={`dropdown-item text-wrap ${cleanPath(location.pathname) === cleanPath(sub.path) ? "active" : ""}`}
                    >
                      {LeafIcon && <LeafIcon className="menu-icon me-2" size={14} />}
                      {sub.label}
                    </Link>
                  </li>
                );
            })}
          </ul>
        )}
      </li>
    );
  };


  return (
    <>
      <button className={`mobile-menu-btn ${collapsed ? "show" : "hide"}`} onClick={() => setCollapsed(false)}>
        <i className="bi bi-list classic-icon" ></i>
      </button>

      <aside className={`sidebar ${collapsed ? "collapsed" : "open"} ${collapsed ? "" : "mobile-open"}`}>
        <header className="sidebar-header">
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <button className="sidebar-toggler" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi bi-chevron-left classic-chevron ${collapsed ? "rotated" : ""}`}></i>
          </button>
        </header>

        <nav className="sidebar-nav">
          {/* 3. Use filteredMenuData */}
          <ul className="nav-list primary-nav">{filteredMenuData.map((item, i) => renderMenuItem(item, String(i)))}</ul>
          <ul className="sidebar-footer">
            {secondaryMenuData.map((item, i) => (
              <li key={i} className="footer-item">
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;