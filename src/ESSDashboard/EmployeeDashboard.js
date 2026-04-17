import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from "xlsx-js-style";
import config from '../Apiconfig';
import { showEightHourToast } from "../GlobalToast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { publicIpv4 } from "public-ip";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement);

const Dashboard = (payslip) => {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem("isCheckedIn") === "true";
  });
  const Today = new Date().toISOString().split("T")[0];
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [rowData, setRowData] = useState('');
  const [rempShiftRowData, setEmpShiftRowData] = useState('');
  const [NewJoinees, setNewJoinees] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [startdate, setstartdate] = useState(Today);
  const [enddate, setenddate] = useState(Today);
  const [timer, setTimer] = useState("00:00:00");
  const intervalRef = useRef(null);
  const hasStoppedRef = useRef(false);
  const user_code = sessionStorage.getItem('selectedUserCode');
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [holidayRowData, setHolidayRowData] = useState([]);
  const [payslipData, setPayslipData] = useState({});

  const [shiftFromDate, setShiftFromDate] = useState('');
  const [shiftToDate, setShiftToDate] = useState('');
  const [employeeIdDropGrid, setEmployeeIdDropGrid] = useState([]);
  const [departmentDrop, setDepartmentDrop] = useState([]);
  const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);
  const [shiftIdDropGrid, setShiftIdDropGrid] = useState([]);

  const [isShiftCalendarVisible, setIsShiftCalendarVisible] = useState(true);
  const [currentShiftDate, setCurrentShiftDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexJoinee, setCurrentIndexJoinee] = useState(0);
  const carouselRef = useRef(null);
  const joineeCarouselRef = useRef(null);


  useEffect(() => {
    if (upcomingBirthdays.length > 0) {
      const timer = setInterval(() => {
        handleNext();
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, upcomingBirthdays]);

  const handleNext = () => {
    if (carouselRef.current) {
      const nextIndex = (currentIndex + 1) % upcomingBirthdays.length;
      setCurrentIndex(nextIndex);
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * nextIndex,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const prevIndex = (currentIndex - 1 + upcomingBirthdays.length) % upcomingBirthdays.length;
      setCurrentIndex(prevIndex);
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * prevIndex,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (NewJoinees.length > 0) {
      const timer = setInterval(() => {
        handleJoineeNext();
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [currentIndexJoinee, NewJoinees]);

  const handleJoineeNext = () => {
    if (joineeCarouselRef.current) {
      const nextIndex = (currentIndexJoinee + 1) % NewJoinees.length;
      setCurrentIndexJoinee(nextIndex);
      joineeCarouselRef.current.scrollTo({
        left: joineeCarouselRef.current.offsetWidth * nextIndex,
        behavior: 'smooth'
      });
    }
  };

  const handleJoineePrev = () => {
    if (joineeCarouselRef.current) {
      const prevIndex = (currentIndexJoinee - 1 + NewJoinees.length) % NewJoinees.length;
      setCurrentIndexJoinee(prevIndex);
      joineeCarouselRef.current.scrollTo({
        left: joineeCarouselRef.current.offsetWidth * prevIndex,
        behavior: 'smooth'
      });
    }
  };

  // Filter shifts from existing Ag-Grid rowData for the calendar cells
  const getShiftDetailsForDay = (day) => {
    if (!day) return null;

    // Format the date to match your API response format (YYYY-MM-DD)
    const formattedDate = `${currentShiftDate.getFullYear()}-${String(currentShiftDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // rempShiftRowData-la irunthu antha date-kku mela shift irukkannu check pannum
    return rempShiftRowData && Array.isArray(rempShiftRowData)
      ? rempShiftRowData.find(s => s.Date === formattedDate)
      : null;
  };

  const shiftConfig = {
    S1: {
      label: "Morning Shift",
      icon: "fa-sun",
      color: "#f59e0b"
    },
    S2: {
      label: "General Shift",
      icon: "fa-briefcase",
      color: "#3b82f6"
    },
    S3: {
      label: "Evening Shift",
      icon: "fa-cloud-sun",
      color: "#8b5cf6"
    },
    S4: {
      label: "Night Shift",
      icon: "fa-moon",
      color: "#1e293b"
    },
    S5: {
      label: "Split Shift",
      icon: "fa-clock",
      color: "#10b981"
    },
    S6: {
      label: "Week Off",
      icon: "fa-couch",
      color: "#ef4444"
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employeeIdOption = data.map((option) => ({
          value: option.EmployeeId,
          label: `${option.EmployeeId} - ${option.First_Name}`,
        }));
        setEmployeeIdDropGrid(employeeIdOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getDepartment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const deptOptions = data.map((option) => ({
          value: option.dept_id,
          label: `${option.dept_id} - ${option.dept_name}`,
        }));
        setDepartmentDrop(deptOptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching department data:", error)
      );
  }, []);

  useEffect(() => {
    const Company_Code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/ShiftPatternMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Company_Code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const shiftPatternIdOption = data.map((option) => ({
          value: option.Pattern_Code,
          label: `${option.Pattern_Code} - ${option.Pattern_Name}`,
        }));
        setShiftPatternIdDropGrid(shiftPatternIdOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const shiftOption = data.map((option) => ({
          value: option.Shift_Code,
          label: `${option.Shift_Code} - ${option.Shift_Name}`,
        }));
        setShiftIdDropGrid(shiftOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // useEffect(() => {
  //   const today = new Date();

  //   // Get current day (0 = Sunday, 1 = Monday ...)
  //   const day = today.getDay();

  //   // Calculate Monday
  //   const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
  //   const monday = new Date(today.setDate(diffToMonday));

  //   // Calculate Sunday
  //   const sunday = new Date(monday);
  //   sunday.setDate(monday.getDate() + 6);

  //   const formatDate = (date) => date.toISOString().split("T")[0];

  //   setShiftFromDate(formatDate(monday));
  //   setShiftToDate(formatDate(sunday));
  // }, []);

  useEffect(() => {
    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const from = formatDate(firstDay);
    const to = formatDate(lastDay);

    setShiftFromDate(from);
    setShiftToDate(to);

    handleEmpShiftReportSearch(from, to);

  }, []);

  const {
    Location_name,
    company_logo,
    company_name,
  } = payslip;


  const handleDownloadPdf = () => {
    const input = printRef.current;
    if (!input) return;

    html2canvas(input, {
      scale: 5,
      scrollY: -window.scrollY,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('a4');

      const imgProps = pdf.getImageProperties(imgData);
      const margin = 1;
      const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
      pdf.save(`Payslip_${payslipData.EmployeeId}_${payslipData.SalaryMonth}.pdf`);
    });
  };


  const getImageFromBuffer = (bufferData) => {
    const base64String = btoa(
      new Uint8Array(bufferData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${base64String}`;
  };


  const logoSrc = getImageFromBuffer(company_logo?.data);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        const ip = await publicIpv4();
        setIpAddress(ip);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            }
          );
        } else {
          setLocation("Geolocation not supported");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getHolidayDate`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const holidaysArray = [];
        const leaveArray = [];

        data.forEach((item) => {
          if (item.HOLIDAYS) {
            holidaysArray.push(item.HOLIDAYS.split("T")[0]);
          }
          if (item.LEAVEDATE) {
            leaveArray.push(item.LEAVEDATE.split("T")[0]);
          }
        });

        setHolidays(holidaysArray);
        setLeaves(leaveArray);
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      console.log(err.message || 'Failed to load holidays and leaves');
    }
  };

  // Fetch holidays when the component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Fetch holidays when the component mounts
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/EmployeeDashboardTotalLeave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveData(val));
  }, []);

  const reloadGridData = async () => {
    setRowData([]);
    setstartdate("");
    setenddate("");
  };

  const handleSearch = async () => {
    if (new Date(startdate) > new Date(enddate)) {
      toast.warning("Start Date cannot be greater than End Date");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/ESSEmployeeDashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startdate,
          end_date: enddate,
          userid: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        // const newRows = searchData.map((matchedItem) => ({
        //   work_date: formatDates(matchedItem.work_date),
        //   First_CheckIn: matchedItem.First_CheckIn,
        //   Last_CheckOut: matchedItem.Last_CheckOut,
        //   total_worked_hours: matchedItem.total_worked_hours,
        //   Total_login_Hours: matchedItem.Total_login_Hours,
        //   Status: matchedItem.Status,
        // }));
        setRowData(searchData);
      } else if (response.status === 404) {
        setRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const handleEmpShiftReportSearch = async (fromDate, toDate) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmpShiftReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          From_Date: fromDate || shiftFromDate,
          To_Date: toDate || shiftToDate,
          Employee_ID: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setEmpShiftRowData(searchData);
      } else if (response.status === 404) {
        setEmpShiftRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        setEmpShiftRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const formatDates = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  // AG Grid columns
  const holidayCols = [
    {
      headerName: "Holiday Date",
      field: "HOLIDAYS",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Festival Name",
      field: "Description",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
  ];

  const StatusCellRenderer = (params) => {
    if (params.value === "Compensatory Leave") {
      const isPending = params.data.CompOffStatus === "Pending";
      const isApproved = params.data.CompOffStatus === "Approved";
      const isDisabled = isPending || isApproved;

      const handleRequest = () => {
        if (isDisabled) return;
        navigate("/EmployeeCompOff", {
          state: {
            work_date: params.data.work_date,
            holiday_name: params.data.Holiday_Name
          }
        });
      };

      const btnClass = `btn-comp-off ${isPending ? 'status-pending' : ''} ${isApproved ? 'status-approved' : ''}`;

      return (
        <div className="status-action-wrapper">
          <button
            className={btnClass}
            onClick={handleRequest}
            disabled={isDisabled}
            title={params.data.CompOffStatus || "Apply for Comp Off"} // Fallback browser tooltip
          >
            <i className={isApproved ? "fa-solid fa-check-double" : "fa-solid fa-paper-plane"}></i>
            <span>
              {isPending ? "Pending" : isApproved ? "Approved" : "Comp Off"}
            </span>
          </button>
        </div>
      );
    }

    return <span className="status-text-default">{params.value}</span>;
  };

  const Employeecol = [
    {
      headerName: "Date",
      field: "work_date",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Check In",
      field: "First_CheckIn",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Check Out",
      field: "Last_CheckOut",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Total Worked Hours",
      field: "total_worked_hours",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Total Login  Hours",
      field: "Total_login_Hours",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
      cellRenderer: StatusCellRenderer,
    },
  ];


  const empShiftCols = [
    {
      headerName: "Date",
      field: "Date",
      minWidth: 130
    },
    {
      headerName: "Shift",
      field: "Shift_Code",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftIdDropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftIdDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Employee ID",
      field: "Employee_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: employeeIdDropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = employeeIdDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Department",
      field: "dept_id",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: departmentDrop.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = departmentDrop.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Designation",
      field: "desgination_id",
      minWidth: 130
    },
    {
      headerName: "Shift Pattern",
      field: "Shift_Pattern_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftPatternIdDropGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftPatternIdDropGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Start Time",
      field: "Start_Time",
      minWidth: 100
    },
    {
      headerName: "End Time",
      field: "End_Time",
      minWidth: 100
    },
  ];

  useEffect(() => {
    const fetchHolidayGridData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/GetClr`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode") }),

        });
        if (response.ok) {
          const searchData = await response.json();
          const newRows = searchData.map((matchedItem) => ({
            HOLIDAYS: formatDates(matchedItem.HOLIDAYS),
            Description: matchedItem.Description,
          }));
          setHolidayRowData(newRows);
        } else if (response.status === 404) {
          console.log("Data Not found");
          setHolidayRowData([])
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchHolidayGridData();
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  const fetchNewJoins = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/NewJoinee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode")
        })
      });

      const data = await response.json();

      const employeesWithImages = data.map((joinee) => ({
        ...joinee,
        Photos:
          joinee.Photos && joinee.Photos.data
            ? bufferToBlobUrl(joinee.Photos.data)
            : "",
      }));

      setNewJoinees(employeesWithImages);

    } catch (error) {
      console.error("Error fetching new joinees:", error);
    }
  };

  useEffect(() => {
    fetchNewJoins();
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevDate.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(prevDate.getMonth() + 1);
      return nextMonth;
    });
  };

  const daysArray = Array.from({ length: firstDayOfMonth }, () => "").concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const formatDate = (year, month, day) => {
    if (!day) return null;
    const date = new Date(year, month, day);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isWeekend = (day) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6
  };

  const isHoliday = (day) => {
    if (!day) return false;
    const formattedDate = formatDate(year, month, day);
    return holidays.includes(formattedDate);
  };

  const isLeave = (day) => {
    if (!day) return false;
    const formattedDate = formatDate(year, month, day);
    return leaves.includes(formattedDate);
  };

  const isToday = (day) => day &&
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const [chartData, setChartData] = useState({
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Maximum Focus",
        data: [30, 50, 45, 60, 55, 80, 70],
        borderColor: "#FF4D4D",
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        hoverRadius: 6,
        hitRadius: 20,
      },
      {
        label: "Minimum Focus",
        data: [10, 20, 15, 25, 30, 40, 35],
        borderColor: "#7B61FF",
        backgroundColor: "rgba(123, 97, 255, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        hoverRadius: 6,
        hitRadius: 20,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#666",
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#aaa" },
      },
      y: {
        grid: { color: "#eee", display: false },
        ticks: { color: "#aaa", stepSize: 25 },
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.map((value) => value + Math.round(Math.random() * 10 - 5)), // Randomized updates
        })),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const handleLeave = () => {
    navigate('/ApplyLeave')
  }

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/UpcomingBirthday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode")
        })
      });

      const data = await response.json();

      const employeesWithImages = data.map((person) => ({
        ...person,
        Photos:
          person.Photos && person.Photos.data
            ? bufferToBlobUrl(person.Photos.data)
            : "",
      }));

      setUpcomingBirthdays(employeesWithImages);

    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };

  useEffect(() => {
    fetchBirthdaysinfo();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("lastCheckDate");

    if (isCheckedIn && savedDate === today) {
      startTimer();
    }

    return () => clearInterval(intervalRef.current);
  }, [isCheckedIn]);

  const startTimer = () => {
    let storedElapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;

    let startTime =
      parseInt(localStorage.getItem("startTime")) ||
      Date.now() - storedElapsedTime * 1000;

    localStorage.setItem("startTime", startTime);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      localStorage.setItem("elapsedTime", elapsedTime);

      const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");

      setTimer(`${hours}:${minutes}:${seconds}`);

      if (elapsedTime === 28800 && !localStorage.getItem("mailSent")) {
        sendAutoMail();
        localStorage.setItem("mailSent", "true");
        showEightHourToast(() => {
          console.log("User acknowledged the toast");
        });
      }
    }, 1000);
  };

  const sendAutoMail = async () => {
    const userEmail = sessionStorage.getItem("userEmailId");

    try {
      const response = await fetch(`${config.apiBaseUrl}/sendAutoMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending mail:", error.message);
    }
  };

  const stopTimer = () => {
    if (hasStoppedRef.current) return;
    hasStoppedRef.current = true;

    clearInterval(intervalRef.current);

    const startTime = parseInt(localStorage.getItem("startTime"));
    const currentTime = Date.now();

    let lastElapsedTime = 0;
    if (!isNaN(startTime)) {
      lastElapsedTime = Math.floor((currentTime - startTime) / 1000);
    }

    console.log("Calculated Elapsed Time:", lastElapsedTime);

    localStorage.setItem("lastElapsedTime", lastElapsedTime);
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("startTime");
  };

  const handleTime = async () => {
    try {
      const route = isCheckedIn ? "/DailyLogOUT" : "/DailyLogin";
      const response = await fetch(`${config.apiBaseUrl}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          DeviceDetails: deviceDetails,
          IP_Address: ipAddress,
          Location: location,
        }),
      });

      if (response.status === 200) {
        setIsCheckedIn((prev) => {
          const newState = !prev;
          localStorage.setItem("isCheckedIn", newState);

          const today = new Date().toISOString().split("T")[0];
          const lastDate = localStorage.getItem("lastCheckDate");

          if (newState) {
            if (lastDate === today) {
              const lastElapsedTime = parseInt(localStorage.getItem("lastElapsedTime")) || 0;
              localStorage.setItem("elapsedTime", lastElapsedTime);
            } else {
              localStorage.setItem("elapsedTime", 0);
              localStorage.setItem("lastElapsedTime", 0);
            }

            localStorage.setItem("lastCheckDate", today);
            hasStoppedRef.current = false;
            startTimer();
          } else {
            stopTimer();
          }
          return newState;
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  useEffect(() => {
    const storedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
    const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(storedTime % 60).padStart(2, "0");
    setTimer(`${hours}:${minutes}:${seconds}`);

    localStorage.setItem("lastCheckDate", new Date().toISOString().split("T")[0]);
  }, []);

  const [announcement, setAnnouncement] = useState("Loading...");

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAnnouncementText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncement(data[0].MessageTitle);
      } else {
        setAnnouncement("No announcements available.");
      }
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
      setAnnouncement("Error loading announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    const interval = setInterval(fetchAnnouncement, 5000);
    return () => clearInterval(interval);
  }, []);




  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const printRef = useRef();

  const handlePreview = async () => {
    try {
      const salary_month = selectedPeriod;
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const Employeeid = sessionStorage.getItem('selectedUserCode')

      const body = {
        salary_month,
        company_code,
        Employeeid,
      };

      const response = await fetch(`${config.apiBaseUrl}/Getpayslip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to fetch payslip");

      const data = await response.json();
      console.log("Payslip Data:", data.Basic);
      setPayslipData(data[0]);

      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching payslip");
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Payslip Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .text-end { text-align: right; }
            .fw-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const handleEmpShiftReload = () => {
    setEmpShiftRowData([]);
    setShiftFromDate("");
    setShiftToDate("");
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => {
      const shiftObj = shiftIdDropGrid.find(
        (d) => d.value === row.Shift_Code
      );

      const shiftName = shiftObj
        ? shiftObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const empObj = employeeIdDropGrid.find(
        (d) => d.value === row.Employee_ID
      );

      const empName = empObj
        ? empObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const depObj = departmentDrop.find(
        (d) => d.value === row.dept_id
      );

      const depName = depObj
        ? depObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const spObj = shiftPatternIdDropGrid.find(
        (d) => d.value === row.Shift_Pattern_ID
      );

      const spName = spObj
        ? spObj.label.split(" - ").slice(1).join(" - ")
        : "";

      return {
        "Date": row.Date || "",
        "Shift": `${row.Shift_Code} - ${shiftName}` || "",
        "Employee ID": `${row.Employee_ID} - ${empName}` || "",
        "Department": `${row.dept_id} -${depName}` || "",
        "Designation": row.desgination_id || "",
        "Shift Pattern": `${row.Shift_Pattern_ID} - ${spName}` || "",
        "Start Time": row.Start_Time || "",
        "End Time": row.End_Time || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!rempShiftRowData || rempShiftRowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Shift Routine Search Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER ================= */

    const headerData = [
      [screenName],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    /* ================= TABLE DATA ================= */

    const transformedData = transformRowData(rempShiftRowData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerRowIndex = headerData.length;

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(transformedData[0]).length - 1 } },
    ];

    /* ================= TABLE HEADER STYLE ================= */

    const totalColumns = Object.keys(transformedData[0]).length;

    for (let C = 0; C < totalColumns; C++) {
      const cell =
        worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: C })];

      if (!cell) continue;

      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: tableHeaderBg } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ================= TABLE BODY STYLE ================= */

    for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
      for (let C = 0; C < totalColumns; C++) {
        const cell =
          worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill:
            R % 2 === 0
              ? { fgColor: { rgb: altRowBg } }
              : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    /* ================= COLUMN WIDTH ================= */

    worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

    /* ================= EXPORT ================= */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Routine");

    XLSX.writeFile(workbook, "Shift_Routine_Search_Report.xlsx");
  };

  const transformEmpRowData = (data) => {
    return data.map((row) => {

      return {
        "Date": row.work_date || "",
        "Check In": row.First_CheckIn || "",
        "Check Out": row.Last_CheckOut || "",
        "Total Worked Hours": row.total_worked_hours || "",
        "Total Login  Hours": row.Total_login_Hours || "",
        "Status": row.Status || "",
      };
    });
  };

  const handleExportToExcelEmp = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Employee Search Report";
    const company = sessionStorage.getItem("selectedCompanyName") || "";

    /* ================= THEME COLORS ================= */

    const titleBg = getCSSVariable("--but").replace("#", "");
    const tableHeaderBg = getCSSVariable("--ag-header").replace("#", "");
    const fontColor = getCSSVariable("--font-color").replace("#", "");
    const altRowBg = getCSSVariable("--ag-row").replace("#", "");

    /* ================= HEADER ================= */

    const headerData = [
      [screenName],
      company ? [`Company Name: ${company}`] : [],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    /* ================= TABLE DATA ================= */

    const transformedData = transformEmpRowData(rowData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, {
      origin: `A${headerData.length + 1}`,
    });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerRowIndex = headerData.length;

    /* ================= TITLE STYLE ================= */

    worksheet["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: titleBg } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(transformedData[0]).length - 1 } },
    ];

    /* ================= TABLE HEADER STYLE ================= */

    const totalColumns = Object.keys(transformedData[0]).length;

    for (let C = 0; C < totalColumns; C++) {
      const cell =
        worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: C })];

      if (!cell) continue;

      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: tableHeaderBg } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ================= TABLE BODY STYLE ================= */

    for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
      for (let C = 0; C < totalColumns; C++) {
        const cell =
          worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill:
            R % 2 === 0
              ? { fgColor: { rgb: altRowBg } }
              : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    /* ================= COLUMN WIDTH ================= */

    worksheet["!cols"] = Array(totalColumns).fill({ wch: 22 });

    /* ================= EXPORT ================= */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee");

    XLSX.writeFile(workbook, "Employee_Search_Report.xlsx");
  };

  return (
    <div className="container-fluid  Topnav-screen pb-2">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="app-shadow-lg spacing-p-1 bg-light-color rounded-base main-header-box">
        <div className="header-flex">

          <div className="grid-col-12 grid-col-md-8">
            <div className="ticker-wrapper">
              <div className="ticker-text">{announcement}</div>
            </div>
          </div>

          <div className="dashboard-wrapper">
            <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
              <div className="custom-badge">{user_code}</div>
              <input
                id="timing"
                className="app-form-control"
                type="text"
                readOnly
                value={timer}
                style={{ maxWidth: "120px" }}
              />
              <button
                onClick={handleTime}
                className="check-btn"
                style={{
                  backgroundColor: isCheckedIn ? "red" : "green",
                  color: "white",
                }}
                title={isCheckedIn ? "Check OUT" : "Check IN"}
              >
                <i className="fa-solid fa-clock me-2"></i>
                {isCheckedIn ? "Check OUT" : "Check IN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card-row dashboard-row">

        <div className="leave-balance-container mt-2">
          <div className="app-card-base rounded birthday-card-wrapper app-shadow-lg height-full">

            <div className="d-flex justify-content-between align-items-center spacing-mb-2">
              <h6 className="card-title-heading mb-0">Shift Routine</h6>
              <button
                className="btn btn-sm text-white border-none"
                onClick={() => setIsShiftCalendarVisible(!isShiftCalendarVisible)}
                title={isShiftCalendarVisible ? "Switch to Grid View" : "Switch to Calendar View"}
              >
                {isShiftCalendarVisible ? <i className="fa-solid fa-table"></i> : <i className="fa-solid fa-calendar-days"></i>}
              </button>
            </div>

            <div className="d-flex flex-row align-items-center gap-2 spacing-mb-3">
              <div className="inputGroup flex-grow-1">
                <input
                  id="shiftStart"
                  className="exp-input-field form-control"
                  type="date"
                  value={shiftFromDate}
                  onChange={(e) => setShiftFromDate(e.target.value)}
                />
                <label className="exp-form-labels">From Date</label>
              </div>

              <div className="inputGroup flex-grow-1">
                <input
                  id="shiftEnd"
                  className="exp-input-field form-control"
                  type="date"
                  value={shiftToDate}
                  onChange={(e) => setShiftToDate(e.target.value)}
                />
                <label className="exp-form-labels">To Date</label>
              </div>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEmpShiftReportSearch()}
                style={{ height: "35px", width: "40px" }}
                title="Search"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleEmpShiftReload}
                style={{ height: "35px", width: "40px" }}
                title="Grid Reload"
              >
                <i className="fa-solid fa-rotate-right"></i>
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleExportToExcel}
                style={{ height: "35px", width: "40px" }}
                title="Export Excel"
              >
                <i className="fa-solid fa-file-excel"></i>
              </button>
            </div>

            <div className="shift-content-area" style={{ height: "320px" }}>
              {isShiftCalendarVisible ? (
                <div className="calendar-container">
                  <div className="calendar-nav">
                    <button
                      className="cal-nav-btn"
                      onClick={() =>
                        setCurrentShiftDate(
                          new Date(currentShiftDate.getFullYear(), currentShiftDate.getMonth() - 1, 1)
                        )
                      }
                    >
                      &lt;
                    </button>

                    <span className="calendar-title">
                      {currentShiftDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>

                    <button
                      className="cal-nav-btn"
                      onClick={() =>
                        setCurrentShiftDate(
                          new Date(currentShiftDate.getFullYear(), currentShiftDate.getMonth() + 1, 1)
                        )
                      }
                    >
                      &gt;
                    </button>
                  </div>

                  <div className="calendar-grid-header">
                    {["S", "M", "T", "W", "T", "F", "S"].map(day => <div key={day} className="grid-head-cell">{day}</div>)}
                  </div>

                  <div className="calendar-grid-body">

                    {Array.from(
                      { length: new Date(currentShiftDate.getFullYear(), currentShiftDate.getMonth(), 1).getDay() },
                      () => ""
                    )
                      .concat(
                        Array.from(
                          { length: new Date(currentShiftDate.getFullYear(), currentShiftDate.getMonth() + 1, 0).getDate() },
                          (_, i) => i + 1
                        )
                      )
                      .map((day, index) => {

                        const shiftInfo = getShiftDetailsForDay(day);
                        const shift = shiftInfo ? shiftConfig[shiftInfo.Shift_Code] : null;

                        return (
                          // <div
                          //   key={index}
                          //   className={`cal-day-cell ${day ? "active-day" : ""}`}
                          //   style={{
                          //     backgroundColor: shift ? `${shift.color}15` : ""
                          //   }}
                          // >

                          <div
                            key={index}
                            className={`cal-day-cell ${day ? "active-day" : ""}`}
                            style={{
                              backgroundColor: shift ? `${shift.color}15` : ""
                            }}
                            title={
                              shiftInfo
                                ? `${shift.label}\n${shiftInfo.Start_Time} - ${shiftInfo.End_Time}`
                                : ""
                            }
                          >

                            <span className="day-num">{day}</span>

                            {shift && (
                              <div
                                className="shift-icon"
                                title={shift.label}
                                style={{ color: shift.color }}
                              >
                                <i className={`fa-solid ${shift.icon}`}></i>
                              </div>
                            )}

                          </div>
                        );

                      })}

                  </div>
                </div>
              ) : (
                <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
                  <AgGridReact
                    columnDefs={empShiftCols}
                    rowData={rempShiftRowData}
                    rowHeight={30}
                    pagination={true}
                    paginationAutoPageSize={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="payslip-analysis-container mt-2">
          <div className="app-card-base payslip-gen-card rounded app-shadow-lg height-full border-0 position-relative overflow-hidden">
            <div className="payslip-bg-accent"></div>

            <div className="card-body position-relative z-index-2">
              <div className="d-flex align-items-center mb-4">
                {/* <div className="payslip-icon-box me-3">
                  <i className="bi bi-file-earmark-medical-fill"></i>
                </div> */}
                <div>
                  <h6 className="card-title-heading mb-0">Payslip Generate</h6>
                  <small className="text-muted">Download your monthly earnings</small>
                </div>
              </div>

              <div className="payslip-form-wrapper">
                <div className="modern-input-group mb-4">
                  <input
                    type="month"
                    className="modern-month-input"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    required
                  />
                  <label className="modern-label">Select Payroll Period</label>
                </div>

                <div className="action-container">
                  {selectedPeriod ? (
                    <button className="btn-payslip-primary" onClick={handlePreview}>
                      <i className="bi bi-file-pdf me-2"></i> Generate & Preview
                    </button>
                  ) : (
                    <div className="payslip-helper-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Please select a month to continue
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="holiday-calendar-container mt-2">
          <div className="dashboard-card-base alloted-holidays-card rounded shadow-lg p-0 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-1" style={{ maxHeight: "100px", paddingBottom: "10px" }}>
                <div className="d-flex justify-content-start">
                  <h6 className="card-title-heading">Allotted Holidays</h6>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="calendar-toggle-btn"
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                    title={isCalendarVisible ? "Switch to Grid View" : "Switch to Calendar View"}
                  >
                    {isCalendarVisible ? <i className="fa-solid fa-calendar"></i> : <i className="fa-solid fa-table"></i>}
                  </button>
                </div>
              </div>

              {isCalendarVisible && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <button onClick={handlePrevMonth} className="calender-btn btn btn-sm">
                      Prev
                    </button>
                    <h5 className="text-center mb-0 text-color-dark">
                      {currentDate.toLocaleString("default", { month: "short" })} {currentDate.getFullYear()}
                    </h5>
                    <button onClick={handleNextMonth} className="calender-btn btn btn-sm">
                      Next
                    </button>
                  </div>
                  <div className="calendar-grid">
                    <div className="grid-template-columns-7 text-center fw-bold">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={index}>{day}</div>
                      ))}
                    </div>
                    <div className="grid-template-columns-7 text-center">
                      {daysArray.map((day, index) => {
                        const isDayToday = isToday(day);
                        const isDayWeekend = day && isWeekend(day);
                        const isDayHoliday = day && isHoliday(day);
                        const isDayLeave = isLeave(day);
                        return (
                          <div
                            key={index}
                            className={`day-cell ${isDayToday
                              ? "today-cell"
                              : isDayHoliday
                                ? "holiday-cell"
                                : isDayWeekend
                                  ? "weekend-cell"
                                  : isDayLeave
                                    ? "leave-cell"
                                    : ""
                              }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {!isCalendarVisible && (
                <div className="p-0">
                  <div className="ag-theme-alpine rounded-4" style={{ height: 352, width: "100%", borderRadius: "15px" }}>
                    <AgGridReact columnDefs={holidayCols} rowData={holidayRowData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="dashboard-row spacing-mt-2">

        <div className="grid-col-lg-3">
          <div className="app-card-base joinees-card rounded app-shadow-lg height-full border-0 position-relative">
            <div className="display-flex flex-between-center mb-3">
              <h6 className="card-title-heading mb-0">New Joinees</h6>
            </div>

            <div className="joinee-carousel-container" ref={joineeCarouselRef}>
              {NewJoinees.length > 0 ? (
                NewJoinees.map((joinee, index) => (
                  <div key={index} className="joinee-slide">
                    <div className="joinee-card-inner">
                      <div className="joinee-accent-circle-top"></div>
                      <div className="joinee-accent-circle-bottom"></div>

                      <div className="profile-image-wrapper">
                        {joinee.Photos ? (
                          <img src={joinee.Photos} className="joinee-img-modern" alt="profile" />
                        ) : (
                          <div className="joinee-img-modern initials-avatar">
                            {joinee.EmployeeName.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="joinee-icon-badge">✨</div>
                      </div>

                      <div className="joinee-details mt-3">
                        <h6 className="emp-name-text">{joinee.EmployeeName}</h6>
                        <p className="emp-dept-sub">{joinee.department_ID} • {joinee.EmployeeId}</p>
                        <div className="welcome-badge">Welcome Onboard! 🤝</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-birthday-view">
                  <div className="empty-icon">👥</div>
                  <p className="text-muted-color">No new joinees this month</p>
                </div>
              )}
            </div>

            {NewJoinees.length > 1 && (
              <div className="joinee-nav-controls-bottom">
                <button className="nav-btn" onClick={handleJoineePrev}>❮</button>
                <div className="joinee-nav-dots">
                  {NewJoinees.map((_, i) => (
                    <span key={i} className={`dot ${currentIndexJoinee === i ? 'active' : ''}`}></span>
                  ))}
                </div>
                <button className="nav-btn" onClick={handleJoineeNext}>❯</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid-col-lg-3">
          <div className="app-card-base birthday-card-wrapper rounded app-shadow-lg height-full border-0 position-relative">
            <div className="display-flex flex-between-center mb-3">
              <h6 className="card-title-heading mb-0">Upcoming Birthdays</h6>
            </div>

            <div className="birthday-carousel-container" ref={carouselRef}>
              {upcomingBirthdays.length > 0 ? (
                upcomingBirthdays.map((person, index) => (
                  <div key={index} className="birthday-slide">
                    <div className="birthday-card-inner">
                      <div className="birthday-accent-circle"></div>
                      <div className="birthday-accent-circle-bottom"></div>

                      <div className="profile-image-wrapper">
                        {person.Photos ? (
                          <img
                            src={person.Photos}
                            className="birthday-img-modern"
                            alt="profile"
                          />
                        ) : (
                          <div className="birthday-img-modern initials-avatar">
                            {person.EmployeeName ?
                              person.EmployeeName.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                              : "U"}
                          </div>
                        )}
                        <div className="birthday-icon-badge">🎂</div>
                      </div>

                      <div className="birthday-details mt-3">
                        <h6 className="emp-name-text">{person.EmployeeName}</h6>
                        <p className="emp-dept-sub">{person.Department || 'Team Member'}</p>
                        <div className="wish-badge">Happy Birthday! 🎈</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-birthday-view">
                  <div className="empty-icon">🎉</div>
                  <p className="text-muted-color">No birthdays this week</p>
                </div>
              )}
            </div>

            {upcomingBirthdays.length > 1 && (
              <div className="birthday-nav-controls-bottom">
                <button className="nav-btn" onClick={handlePrev}>❮</button>
                <div className="birthday-nav-dots">
                  {upcomingBirthdays.map((_, i) => (
                    <span key={i} className={`dot ${currentIndex === i ? 'active' : ''}`}></span>
                  ))}
                </div>
                <button className="nav-btn" onClick={handleNext}>❯</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid-col-lg-6">
          <div className="dashboard-card-base leave-balance-card rounded shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title-heading mb-0">Leave Balance</h6>
              </div>
              <button className="btn-apply-modern" onClick={handleLeave}>
                Apply Leave
              </button>
            </div>

            <div className="leave-grid-container">
              {leaveData.length > 0 ? (
                leaveData.map((leave, index) => {
                  const percentage = (leave.availableleave / leave.totalleave) * 100;
                  const strokeDasharray = `${percentage}, 100`;

                  return (
                    <div key={index} className="leave-status-item" title={leave.leavetype} >
                      <div className="leave-progress-wrapper">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                          <path className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path className={`circle stroke-${leave.LeaveId.toLowerCase().replace(/\s/g, '-')}`}
                            strokeDasharray={strokeDasharray}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage">{leave.availableleave}</text>
                        </svg>
                      </div>
                      <div className="leave-info-text">
                        <span className="leave-label">{leave.LeaveId}</span>
                        <span className="leave-total-sub">of {leave.totalleave} Days</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 w-100">
                  <p className="text-muted">No leave data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="dashboard-row spacing-mt-2">
        <div className="grid-col-12">
          <div className="birthday-card-wrapper rounded app-shadow-lg height-full">
            <h6 className="display-flex justify-content-start card-title-heading spacing-mb-2">Employee Search Criteria</h6>

            <div className="dashboard-row mb-2-me-1">

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="startdate"
                    className="exp-input-field form-control"
                    type="date"
                    placeholder=" "
                    autoComplete="off"
                    value={startdate}
                    onChange={(e) => setstartdate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <label className="exp-form-labels">From Date</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="enddate"
                    className="exp-input-field form-control"
                    type="date"
                    autoComplete="off"
                    placeholder=" "
                    value={enddate}
                    onChange={(e) => setenddate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <label className="exp-form-labels">To Date</label>
                </div>
              </div>

              <div className="ms-2">
                <div className="search-btn-wrapper">
                  <div className="icon-btn search" onClick={handleSearch}>
                    <span className="tooltip">Search</span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <div className="icon-btn reload" onClick={reloadGridData}>
                    <span className="tooltip">Reload</span>
                    <i className="fa-solid fa-rotate-right"></i>
                  </div>

                  <div className="icon-btn excel" onClick={handleExportToExcelEmp}>
                    <span className="tooltip">Excel</span>
                    <i className="fa-solid fa-file-excel"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="app-grid-theme ag-theme-alpine mt-2 rounded-xl" style={{ height: 440, width: '100%' }}>
                <AgGridReact
                  columnDefs={Employeecol}
                  rowData={rowData}
                  suppressLoadingOverlay={true}
                  pagination={true}
                  paginationAutoPageSize={true}
                  getRowStyle={(params) => {
                    if (params.data.Status === "Compensatory Leave") {
                      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--ag-header').trim();
                      return {
                        backgroundColor: themeColor,
                        color: '#ffffff',
                      };
                    }
                    return null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Preview */}
      {showModal && payslipData && (

        <div className="  modal fade show d-block payslip-preview-container " tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', marginTop: "50px" }}>
          <div className="payslip-wrapper ">
            <div className="payslip-card" ref={printRef}>
              <h4 className="payslip-title text-center">PAYSLIP</h4>

              {/* Header Section */}
              <div className="header-section d-flex justify-content-between mb-4">
                <div className="company-info d-flex gap-3">
                  <img src={logoSrc} alt="Company Logo" className="company-logo" />
                  <div>
                    <h5 className="company-name">{company_name}</h5>
                    <p className="location"><strong>{Location_name}</strong></p>
                    <p className="salary-month">
                      Payslip for the month of <strong>{payslipData.SalaryMonth}</strong>
                    </p>
                  </div>
                </div>

                <div className="employee-info text-end">
                  <p><strong>Associate Code:</strong> {payslipData.EmployeeId}</p>
                  <p><strong>Associate Name:</strong> {payslipData.employeename}</p>
                  <p><strong>PF No:</strong> {payslipData.PFNo}</p>
                  <p><strong>Designation:</strong> {payslipData.designation_ID}</p>
                  <p><strong>Location:</strong> {Location_name}</p>
                  <p><strong>Total Working Days:</strong> {payslipData.total_working_days}</p>
                </div>
              </div>

              {/* Payslip Table */}
              <table className="payslip-table table table-bordered">
                <thead>
                  <tr>
                    <th colSpan={3}>Earnings</th>
                    <th colSpan={3}>Deductions</th>
                  </tr>
                  <tr>
                    <th>Title</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                    <th>Title</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic</td>
                    <td>{(+payslipData.Basic || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Basic || 0) * 12).toFixed(2)}</td>
                    <td>PF both share</td>
                    <td>{(+payslipData.PF_both_share || 0).toFixed(2)}</td>
                    <td>{((+payslipData.PF_both_share || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td>{(+payslipData.HRA || 0).toFixed(2)}</td>
                    <td>{((+payslipData.HRA || 0) * 12).toFixed(2)}</td>
                    <td>TDS</td>
                    <td>{(+payslipData.TDS || 0).toFixed(2)}</td>
                    <td>{((+payslipData.TDS || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Conveyance</td>
                    <td>{(+payslipData.Conveyance || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Conveyance || 0) * 12).toFixed(2)}</td>
                    <td>Professional Tax</td>
                    <td>{(+payslipData.ProfessionalTax || 0).toFixed(2)}</td>
                    <td>{((+payslipData.ProfessionalTax || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Medical Allowance</td>
                    <td>{(+payslipData.Medical || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Medical || 0) * 12).toFixed(2)}</td>
                    <td>Salary Advance</td>
                    <td>{(+payslipData.StaffLoan_SalaryAdvance || 0).toFixed(2)}</td>
                    <td>{((+payslipData.StaffLoan_SalaryAdvance || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td>
                    <td>{(+payslipData.Special_Allowance || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Special_Allowance || 0) * 12).toFixed(2)}</td>
                    <td>Other Deductions</td>
                    <td>{(+payslipData.otherDeductions || 0).toFixed(2)}</td>
                    <td>{((+payslipData.otherDeductions || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Company PF</td>
                    <td>{(+payslipData.Company_Pf_Contribution || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Company_Pf_Contribution || 0) * 12).toFixed(2)}</td>
                    <td>Leave Deduction</td>
                    <td>{(+payslipData.LeaveDeduction || 0).toFixed(2)}</td>
                    <td>{((+payslipData.LeaveDeduction || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Bonus / Arrears</td>
                    <td>{(+payslipData.Bonus || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Bonus || 0) * 12).toFixed(2)}</td>
                    <td>PF Employee Contribution</td>
                    <td>{(+payslipData.PF_contribution_employee || 0).toFixed(2)}</td>
                    <td>{((+payslipData.PF_contribution_employee || 0) * 12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Other Allowance</td>
                    <td>{(+payslipData.Other_Allowance || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Other_Allowance || 0) * 12).toFixed(2)}</td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr className="summary-row fw-bold">
                    <td>Total Earnings</td>
                    <td>{(+payslipData.Total_Earnigs || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Total_Earnigs || 0) * 12).toFixed(2)}</td>
                    <td>Total Deductions</td>
                    <td>{(+payslipData.Gross_deductions || 0).toFixed(2)}</td>
                    <td>{((+payslipData.Gross_deductions || 0) * 12).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Net Pay and Footer */}
              <div className="net-pay text-end mt-3">
                Net Pay: <span className="amount fw-bold">₹{(+payslipData.Net_Earnings || 0).toFixed(2)}</span>
              </div>

              <div className="mt-4 text-end">
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Authorized By:</strong> HR Department</p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="" style={{ marginLeft: "300px" }}>
              <div className="d-flex justify-content-center bg-light shadow-lg rounded-3   p-3 gap-2 mt-3 mb-5">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-success" onClick={handleDownloadPdf}>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
