import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import Circle from "../DashboardImages/circle.svg";
import { Doughnut, Bar } from "react-chartjs-2";
import { getElementAtEvent } from "react-chartjs-2";
import Vector from "./Team.png";
import Select from "react-select";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title,
  ArcElement,
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../Apiconfig";
import { publicIpv4 } from "public-ip";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { showEightHourToast } from "../GlobalToast";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTooltip,
  ChartLegend,
  Title,
  ArcElement,
);

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [time, updateTime] = useState(new Date());
  const [viewChart, setViewChart] = useState(true);
  const [timer, setTimer] = useState("00:00:00");
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [NewJoinees, setNewJoinees] = useState([]);
  const [SelectedManager, setSelectedManager] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [manager, setManager] = useState("");
  const [Managerdrop, setManagerdrop] = useState([]);
  const [error, setError] = useState(null);
  const [FromDate, setFromDate] = useState([]);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [rowDataTeamList, setRowDataTeamList] = useState([]);
  const user_code = sessionStorage.getItem("selectedUserCode");

  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [Manager, setmanager] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [pfNo, setPfNo] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [maritalStatusDrop, setMaritalStatusDrop] = useState([]);
  const [shift, setShift] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [shiftDrop, setShiftDrop] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [totalActiveEmployees, setTotalActiveEmployees] = useState(0);
  const [formattedTotalActiveEmployees, setFormattedTotalActiveEmployees] =
    useState("0");
  const [TotalNetEarnings, setTotalNetEarnings] = useState(0);
  const [formatedTotalEarnings, setformatedTotalEarnings] = useState("0");
  const [FormatedTotalPayslip, setFormatedTotalPayslip] = useState("0");
  const [TotalPayslips, setTotalPayslips] = useState(0);

  const [isSelectMarital, setIsSelectMarital] = useState(false);
  const [isSelectShift, setIsSelectShift] = useState(false);
  const navigate = useNavigate();

  const [shiftEmpId, setShiftEmpId] = useState("");
  const [selectedShiftEmpId, setSelectedShiftEmpId] = useState("");
  const [shiftEmpIdDrop, setShiftEmpIdDrop] = useState([]);
  const [shiftEmpIdDropGrid, setShiftEmpIdDropGrid] = useState([]);
  const [shiftDeptId, setShiftDeptId] = useState("");
  const [selectedShiftDeptId, setSelectedShiftDeptId] = useState("");
  const [shiftDeptIdDrop, setShiftDeptIdDrop] = useState([]);
  const [shiftDeptIdDropGrid, setShiftDeptIdDropGrid] = useState([]);
  const [shiftDesigId, setShiftDesigId] = useState("");
  const [selectedShiftDesigId, setSelectedShiftDesigId] = useState("");
  const [shiftDesigIdDrop, setShiftDesigIdDrop] = useState([]);
  const [shiftDesigIdDropGrid, setShiftDesigIdDropGrid] = useState([]);
  const [shiftPatternId, setShiftPatternId] = useState("");
  const [selectedShiftPatternId, setSelectedShiftPatternId] = useState("");
  const [shiftPatternIdDrop, setShiftPatternIdDrop] = useState([]);
  const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);
  const [shiftDay, setShiftDay] = useState("");
  const [TRFromDate, setTRFromDate] = useState("");
  const [shiftFromDate, setShiftFromDate] = useState("");
  const [TRToDate, setTRToDate] = useState("");
  const [shiftToDate, setShiftToDate] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [selectedShiftCode, setSelectedShiftCode] = useState("");
  const [shiftCodeDrop, setShiftCodeDrop] = useState([]);
  const [shiftCodeDropGrid, setShiftCodeDropGrid] = useState([]);
  const [shiftStartTime, setShiftStartTime] = useState("");
  const [shiftEndTime, setShiftEndTime] = useState("");
  const [shiftRowData, setShiftRowData] = useState([]);

  const [isSelectedShiftEmpId, setIsSelectedShiftEmpId] = useState(false);
  const [isSelectedShiftDeptId, setIsSelectedShiftDeptId] = useState(false);
  const [isSelectedShiftDesigId, setIsSelectedShiftDesigId] = useState(false);
  const [isSelectedShiftPatternId, setIsSelectedShiftPatternId] =
    useState(false);
  const [isSelectedShiftCode, setIsSelectedShiftCode] = useState(false);
  const [shiftData, setShiftData] = useState([]);

  const [dashboardRequests, setDashboardRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexJoinee, setCurrentIndexJoinee] = useState(0);
  const carouselRef = useRef(null);
  const joineeCarouselRef = useRef(null);

  const [dashboard, setDashboard] = useState({});

  const hasStoppedRef = useRef(false);
  const intervalRef = useRef(null);


  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);
  const fetchDashboardData = async () => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const response = await fetch(
        `${config.apiBaseUrl}/GetDashboardAttendanceSummary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setDashboard(data);
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Task Hour Report Summary
  const [rowDataTHRS, setRowDataTHRS] = useState([]);
  const [userDrop, setUserDrop] = useState([]);
  const [user, setUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isSelectUser, setIsSelectUser] = useState(false);

  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];

  const handleChangeUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : "");
  };

  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usercode`);
        const data = await response.json();
        console.log("Fetched user codes:", data);

        if (response.ok) {
          const updatedData = [{ user_code: "ALL", user_name: "All" }, ...data];
          setUserDrop(updatedData);

          const defaultOption = {
            value: "ALL",
            label: "All",
          };
          setSelectedUser(defaultOption);
          setUser(defaultOption.value);
        } else {
          console.warn("No data found for user codes");
          setUserDrop([]);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };

    fetchUserCodes();
  }, []);


  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setTRFromDate(today);
    setTRToDate(today);

    fetchTHRSGridData(today, today, "All");
  }, []);

  const fetchTHRSGridData = async (
    fromDate = TRFromDate,
    toDate = TRToDate,
    userId = user
  ) => {
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      toast.warning("To Date should not be earlier than From Date");
      return;
    }
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const res = await fetch(`${config.apiBaseUrl}/getTHRSReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: TRFromDate || null,
          end_date: TRToDate || null,
          userid: userId || "All",
          company_code,
          Status: "Active",
        }),
      });

      const data = await res.json();

      const safeData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setRowDataTHRS(safeData);
    } catch (err) {
      console.error("THRS Fetch Error:", err);
    }
  };

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
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const prevIndex =
        (currentIndex - 1 + upcomingBirthdays.length) %
        upcomingBirthdays.length;
      setCurrentIndex(prevIndex);
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * prevIndex,
        behavior: "smooth",
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
        behavior: "smooth",
      });
    }
  };

  const handleJoineePrev = () => {
    if (joineeCarouselRef.current) {
      const prevIndex =
        (currentIndexJoinee - 1 + NewJoinees.length) % NewJoinees.length;
      setCurrentIndexJoinee(prevIndex);
      joineeCarouselRef.current.scrollTo({
        left: joineeCarouselRef.current.offsetWidth * prevIndex,
        behavior: "smooth",
      });
    }
  };

  const fetchShiftPatternSummary = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/shiftPatternChart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();

      const colors = [
        "#4CAF50",
        "#2196F3",
        "#FF9800",
        "#9C27B0",
        "#F44336",
        "#00BCD4",
        "#8BC34A",
        "#FFC107",
      ];

      const formatted = data.map((item, index) => ({
        name: item.Shift_Name,
        value: item.Employee_Count,
        color: colors[index % colors.length],
      }));

      setShiftData(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShiftPatternSummary();
  }, []);

  useEffect(() => {
    if (typeof totalActiveEmployees === "number") {
      setFormattedTotalActiveEmployees(
        totalActiveEmployees.toLocaleString("en-IN"),
      );
    } else {
      setFormattedTotalActiveEmployees("0");
    }
  }, [totalActiveEmployees]);

  useEffect(() => {
    if (typeof TotalNetEarnings === "number") {
      setformatedTotalEarnings(TotalNetEarnings.toLocaleString("en-IN"));
    } else {
      setformatedTotalEarnings("0");
    }
  }, [TotalNetEarnings]);

  useEffect(() => {
    if (typeof TotalPayslips === "number") {
      setFormatedTotalPayslip(TotalPayslips.toLocaleString("en-IN"));
    } else {
      setFormatedTotalPayslip("0");
    }
  }, [TotalPayslips]);

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
        setShiftEmpIdDropGrid(employeeIdOption);
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
        setShiftDeptIdDropGrid(deptOptions);
      })
      // .then((val) => setDPTdrop(val))
      .catch((error) =>
        console.error("Error fetching department data:", error),
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
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const shiftOption = data.map((option) => ({
          value: option.Shift_Code,
          label: `${option.Shift_Code} - ${option.Shift_Name}`,
        }));
        setShiftCodeDropGrid(shiftOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getEmployeeId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setShiftEmpIdDrop(val))
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
      .then((data) => data.json())
      .then((val) => setShiftDeptIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
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
      .then((data) => data.json())
      .then((val) => setShiftPatternIdDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setShiftCodeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionEmpId = shiftEmpIdDrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId} - ${option.First_Name}`,
  }));

  const filteredOptionDeptId = shiftDeptIdDrop.map((option) => ({
    value: option.dept_id,
    label: `${option.dept_id} - ${option.dept_name}`,
  }));

  const filteredOptionShiftCode = shiftCodeDrop.map((option) => ({
    value: option.Shift_Code,
    label: `${option.Shift_Code} - ${option.Shift_Name}`,
  }));

  const filteredOptionShiftPatternId = shiftPatternIdDrop.map((option) => ({
    value: option.Pattern_Code,
    label: `${option.Pattern_Code} - ${option.Pattern_Name}`,
  }));

  const handleChangeEmpId = (selectedShiftEmpId) => {
    setSelectedShiftEmpId(selectedShiftEmpId);
    setShiftEmpId(selectedShiftEmpId ? selectedShiftEmpId.value : "");
  };

  const handleChangeDeptId = (selectedShiftDeptId) => {
    setSelectedShiftDeptId(selectedShiftDeptId);
    setShiftDeptId(selectedShiftDeptId ? selectedShiftDeptId.value : "");
    fetchDesignation(selectedShiftDeptId ? selectedShiftDeptId.value : "");
  };

  const handleChangeDesigId = (selectedShiftDesigId) => {
    setSelectedShiftDesigId(selectedShiftDesigId);
    setShiftDesigId(selectedShiftDesigId ? selectedShiftDesigId.value : "");
  };

  const handleChangeShiftCode = (selectedShiftCode) => {
    setSelectedShiftCode(selectedShiftCode);
    setShiftCode(selectedShiftCode ? selectedShiftCode.value : "");
  };

  const handleChangeShiftPatternId = (selectedShiftPatternId) => {
    setSelectedShiftPatternId(selectedShiftPatternId);
    setShiftPatternId(
      selectedShiftPatternId ? selectedShiftPatternId.value : "",
    );
  };

  const fetchDesignation = async (selectedValue) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: selectedValue,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      const formattedData = [
        { value: "All", label: "All" },
        ...data.map((product) => ({
          value: product.Desgination,
          label: product.Desgination,
        })),
      ];

      setShiftDesigIdDrop(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching product codes:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTotalActiveEmployees = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(
          `${config.apiBaseUrl}/TotalActiveEmployees`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code: companyCode }),
          },
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].TotalActiveEmployeesWithPayslip !== undefined
        ) {
          const [{ TotalActiveEmployeesWithPayslip }] = data;
          setTotalActiveEmployees(TotalActiveEmployeesWithPayslip);
        } else {
          console.warn("Unexpected response or empty data:", data);
          setTotalActiveEmployees(0); // fallback
        }
      } catch (error) {
        console.error("Error fetching TotalActiveEmployees:", error);
        setTotalActiveEmployees(0); // fallback
      }
    };

    fetchTotalActiveEmployees();
  }, []);
  useEffect(() => {
    const fetchTotalNetEarnings = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalNetEarnings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].TotalNetEarnings_PreviousMonth !== undefined
        ) {
          const [{ TotalNetEarnings_PreviousMonth }] = data;
          setTotalNetEarnings(TotalNetEarnings_PreviousMonth);
        } else {
          console.warn("Unexpected or empty response for Net Earnings:", data);
          setTotalNetEarnings(0); // fallback
        }
      } catch (error) {
        console.error("Error fetching Total Net Earnings:", error);
        setTotalNetEarnings(0); // fallback
      }
    };

    fetchTotalNetEarnings();
  }, []);

  useEffect(() => {
    const fetchTotalPayslips = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalPayslips`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].TotalPayslips !== undefined
        ) {
          const [{ TotalPayslips }] = data;
          setTotalPayslips(TotalPayslips);
        } else {
          console.warn(
            "Unexpected or empty response for Total Payslips:",
            data,
          );
          setTotalPayslips(0);
        }
      } catch (error) {
        console.error("Error fetching Total Payslips:", error);
        setTotalPayslips(0);
      }
    };

    fetchTotalPayslips();
  }, []);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Get Device Details
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        // Get IP Address
        const ip = await publicIpv4(); // Correct function
        setIpAddress(ip);

        // Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            },
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

  const handleChangeShift = (selectedShift) => {
    setSelectedShift(selectedShift);
    setShift(selectedShift ? selectedShift.value : "");
  };

  const filteredOptionShift = [
    { value: "All", label: "All" },
    ...shiftDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    })),
  ];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getcompanyshift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setShiftDrop(val));
  }, []);

  const handleChangeMartial = (selectedMarital) => {
    setSelectedMaritalStatus(selectedMarital);
    setMaritalStatus(selectedMarital ? selectedMarital.value : "");
  };

  const filteredOptionMartial = [
    { value: "All", label: "All" },
    ...maritalStatusDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    })),
  ];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getMartial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setMaritalStatusDrop(val));
  }, []);

  useEffect(() => {
    const savedSeconds = localStorage.getItem("loggedSeconds");
    const savedCheckIn = localStorage.getItem("isCheckedIn");

    if (savedSeconds) {
      setSecondsPassed(Number(savedSeconds));
      setTimer(formatTime(Number(savedSeconds)));
    }

    if (savedCheckIn === "true") {
      setIsCheckedIn(true);

      // Resume timer automatically
      const startTime = Date.now() - Number(savedSeconds || 0) * 1000;

      const id = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setSecondsPassed(elapsed);
        setTimer(formatTime(elapsed));
        localStorage.setItem("loggedSeconds", elapsed);
      }, 1000);

      setIntervalId(id);
    }
  }, []);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  // useEffect(() => {
  //   const fetchLeaveRequests = async () => {
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/LeaveStatus`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           manager: user_code,
  //           company_code: sessionStorage.getItem("selectedCompanyCode"),
  //         }),
  //       });

  //       const data = await response.json();
  //       const formattedRequests = data.map((row) => ({
  //         id: row.EmployeeId,
  //         EmployeeId: row.EmployeeId,
  //         EmployeeName: row.EmployeeName,
  //         FromDate: formatDate(row.FromDate),
  //         ToDate: formatDate(row.ToDate),
  //         LeaveType: row.LeaveType,
  //         LeaveDays: row.LeaveDays,
  //         status: row.LeaveStatus,
  //       }));
  //       setLeaveRequests(formattedRequests);
  //     } catch (err) {
  //       setError(err.message || 'Error fetching leave requests');
  //       setLeaveRequests([])
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLeaveRequests();

  //   const interval = setInterval(fetchLeaveRequests, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchDashboardRequests = async () => {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      let leaveData = [];
      let loanData = [];
      let visaData = [];
      let travelData = [];
      let empData = [];
      let familyChangeData = [];
      let academicData = [];
      let documentData = [];
      let compOffData = [];
      let assetData = [];
      let shiftChangeData = [];

      /* ---------- Leave ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/LeaveStatus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manager: user_code,
            company_code,
          }),
        });

        if (res.ok) leaveData = await res.json();
      } catch (err) {
        console.log("Leave API failed");
      }

      /* ---------- Loan ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/LoanRequestDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ manager_id: user_code, company_code }),
        });

        if (res.ok) loanData = await res.json();
      } catch (err) {
        console.log("Loan API failed");
      }

      /* ---------- Visa ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/visaRequestDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ manager_id: user_code, company_code }),
        });

        if (res.ok) visaData = await res.json();
      } catch (err) {
        console.log("Visa API failed");
      }

      /* ---------- Travel ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/travelRequestsDashboard`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ manager_id: user_code, company_code }),
          },
        );

        if (res.ok) travelData = await res.json();
      } catch (err) {
        console.log("Travel API failed");
      }

      /* ---------- Employee Change ---------- */
      // try {
      //   const res = await fetch(`${config.apiBaseUrl}/GetEmployeeRequest`,
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ RepManager: user_code, company_code }),
      //     },
      //   );

      //   if (res.ok) travelData = await res.json();
      // } catch (err) {
      //   console.log("Travel API failed");
      // }
      try {
        const res = await fetch(`${config.apiBaseUrl}/GetPersonalRequest`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ RepManager: user_code, company_code }),
          },
        );

        if (res.ok) empData = await res.json();
      } catch (err) {
        console.log("Employee API failed");
      }

      /* ---------- Employee Family Change ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/GetFamilyRequest`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_code, RepManager: user_code, }),
          },
        );

        if (res.ok) familyChangeData = await res.json();
      } catch (err) {
        console.log("Family API failed");
      }

      /* ---------- Academic ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/GetAcademicRequest`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_code, RepManager: user_code, }),
          },
        );

        if (res.ok) academicData = await res.json();
      } catch (err) {
        console.log("Academic API failed");
      }

      /* ---------- Documents ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/GetDocumentsRequest`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_code, RepManager: user_code, }),
          },
        );

        if (res.ok) documentData = await res.json();
      } catch (err) {
        console.log("Document API failed");
      }

      /* ---------- Comp Off ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/DashboardCompOffRequest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            RepManager: user_code,
            CompanyCode: company_code,
          }),
        });

        if (res.ok) compOffData = await res.json();
      } catch (err) {
        console.log("Comp Off API failed");
      }

      /* ---------- Employee Assets ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/GetAssetRequest`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_code,
              RepManager: user_code,
            }),
          },
        );

        if (res.ok) assetData = await res.json();
      } catch (err) {
        console.log("Employee Assets API failed");
      }

      /* ---------- Shift Change ---------- */
      try {
        const res = await fetch(`${config.apiBaseUrl}/shiftChangeRequestManager`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code,
            RepManager: user_code,
          }),
        });

        if (res.ok) shiftChangeData = await res.json();
      } catch (err) {
        console.log("Shift Change API failed");
      }

      /* ---------- Leave ---------- */
      const formattedLeave = leaveData
        .filter((r) => r.LeaveStatus === "Pending")
        .map((row) => ({
          type: "Leave",
          id: row.EmployeeId,
          EmployeeId: row.EmployeeId,
          EmployeeName: row.EmployeeName,
          title: row.LeaveType,
          FromDate: formatDate(row.FromDate),
          ToDate: formatDate(row.ToDate),
          status: row.LeaveStatus,
          days: row.LeaveDays,
        }));

      /* ---------- Loan ---------- */
      const formattedLoan = loanData.map((row) => ({
        type: "Loan",
        id: row.loan_request_id,
        EmployeeId: row.employee_id,
        EmployeeName: row.Employee_Name,
        title: row.loan_type_id,
        status: row.request_status,
      }));

      /* ---------- Visa ---------- */
      const formattedVisa = visaData.map((row) => ({
        type: "Visa",
        id: row.visa_request_id,
        EmployeeId: row.employee_id,
        EmployeeName: row.Employee_Name,
        title: row.visa_type_id,
        FromDate: formatDate(row.travel_start_date),
        ToDate: formatDate(row.travel_end_date),
        status: row.request_status,
        days: row.TravelDays,
      }));

      /* ---------- Travel ---------- */
      const formattedTravel = travelData.map((row) => ({
        type: "Travel",
        id: row.travel_request_id,
        EmployeeId: row.employee_id,
        EmployeeName: row.Employee_Name,
        title: row.travel_type,
        FromDate: formatDate(row.travel_start_date),
        ToDate: formatDate(row.travel_end_date),
        status: row.request_status,
        days: row.TravelDays,
      }));

      /* ---------- Comp Off ---------- */
      const formattedCompOff = compOffData.map((row) => ({
        type: "Comp Off",
        id: row.Keyfield,
        HolidayDate: row.HolidayDate,
        EmployeeId: row.EmployeeId,
        EmployeeName: row.EmployeeName,
        title: row.HolidayName || "Comp Off Request",
        FromDate: row.LeaveFromDate ? formatDate(row.LeaveFromDate) : null,
        ToDate: row.LeaveToDate ? formatDate(row.LeaveToDate) : null,
        status: row.Status,
        days: row.LeaveDays,
      }));

      /* ---------- Shift Change ---------- */
      const formattedShiftChange = shiftChangeData.map((row) => ({
        type: "Shift Change",
        id: row.request_id,
        EmployeeId: row.employee_id,
        EmployeeName: row.EmployeeName,
        title: `${row.current_shift_name} → ${row.requested_shift_name}`,
        FromDate: row.FromDate
          ? formatDate(row.FromDate)
          : null,
        ToDate: row.ToDate
          ? formatDate(row.ToDate)
          : null,
        status: row.request_status,
        keyfield: row.keyfield,
        currentShift: row.current_shift_name,
        requestedShift: row.requested_shift_name,
        days: row.LeaveDays
      }));

      /* ---------- Employee Change Group ---------- */
      const grouped = {};

      empData.forEach((row) => {
        if (!grouped[row.Info_request_id]) {
          grouped[row.Info_request_id] = {
            type: "Employee",
            id: row.Info_request_id,
            EmployeeId: row.EmployeeId,
            EmployeeName: row.EmployeeName,
            title: "Detail Changes",
            status: row.request_status,
          };
        }
      });

      const formattedEmp = Object.values(grouped);

      /* ---------- Family Change Group ---------- */
      const groupedFamily = {};

      familyChangeData.forEach((row) => {
        if (!groupedFamily[row.Info_request_id]) {
          groupedFamily[row.Info_request_id] = {
            type: "Family",
            id: row.Info_request_id,
            EmployeeId: row.EmployeeId,
            EmployeeName: row.Employee_Name,
            title: "Detail Changes",
            status: row.request_status,
          };
        }
      });

      const formattedFamily = Object.values(groupedFamily);
      /* ---------- Asset Change Group ---------- */
      const groupedAsset = {};

      assetData.forEach((row) => {
        const key = row.info_request_id || row.RequestID;

        if (!groupedAsset[key]) {
          groupedAsset[key] = {
            type: "Asset",
            id: key,
            EmployeeId: row.EmployeeID,
            EmployeeName: row.Employee_Name,
            title: "Detail Changes",
            status: row.request_status,
            rows: [],
          };
        }

        groupedAsset[key].rows.push(row);
      });

      const formattedAsset = Object.values(groupedAsset);

      /* ---------- Academic Group ---------- */
      const groupedAcademic = {};

      academicData.forEach((row) => {
        if (!groupedAcademic[row.info_request_id]) {
          groupedAcademic[row.info_request_id] = {
            type: "Academic",
            id: row.info_request_id,
            EmployeeId: row.EmployeeId,
            EmployeeName: row.Employee_Name,
            title: "Academic Details",
            status: row.request_status,

            // 🔴 store full rows for approval
            rows: [],
          };
        }

        groupedAcademic[row.info_request_id].rows.push(row);
      });

      const formattedAcademic = Object.values(groupedAcademic);

      /* ---------- Documents Group ---------- */
      const groupedDocuments = {};

      documentData.forEach((row) => {
        if (!groupedDocuments[row.info_request_id]) {
          groupedDocuments[row.info_request_id] = {
            type: "Document",
            id: row.info_request_id,
            EmployeeId: row.EmployeeId,
            EmployeeName: row.Employee_Name,
            title: "Document Details",
            status: row.request_status,

            // important for approval
            rows: [],
          };
        }

        groupedDocuments[row.info_request_id].rows.push(row);
      });

      const formattedDocuments = Object.values(groupedDocuments);
      /* ---------- Merge ---------- */
      const merged = [
        ...formattedLeave,
        ...formattedVisa,
        ...formattedTravel,
        ...formattedLoan,
        ...formattedEmp,
        ...formattedFamily,
        ...formattedAcademic,
        ...formattedDocuments,
        ...formattedCompOff,
        ...formattedAsset,
        ...formattedShiftChange,
      ];

      setDashboardRequests(merged);
    };

    fetchDashboardRequests();
    const interval = setInterval(fetchDashboardRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApproval = async (type, id, FromDate, isApproved, extra = {}) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const approver = sessionStorage.getItem("selectedUserCode");
      const modified_by = sessionStorage.getItem("selectedUserCode");

      let url = "";
      let body = {};

      const status = isApproved ? "Approved" : "Rejected";

      /* ---------- Comp Off ---------- */
      if (type === "Comp Off") {
        url = `${config.apiBaseUrl}/DashboardCompOffApproval`;

        body = {
          EmployeeId: extra.EmployeeId,
          Status: status,
          HolidayDate: extra.HolidayDate,
          ApprovedBy: approver,
          CompanyCode: company_code,
          modified_by: sessionStorage.getItem("selectedUserCode"),
          Keyfield: id,
        };
      }

      /* ---------- Leave ---------- */
      else if (type === "Leave") {
        const [day, month, year] = FromDate.split("-");
        const backendDate = `${year}-${month}-${day}`;

        url = `${config.apiBaseUrl}/LeaveAuthorization`;

        body = {
          EmployeeId: id,
          LeaveStatus: status,
          FromDate: backendDate,
          company_code: company_code,
          modified_by: sessionStorage.getItem("selectedUserCode")
        };
      }

      /* ---------- Loan ---------- */
      else if (type === "Loan") {
        url = `${config.apiBaseUrl}/ApprovalLoan`;

        body = {
          loan_request_id: id,
          company_code,
          request_status: status,
        };
      }

      /* ---------- Visa ---------- */
      else if (type === "Visa") {
        url = `${config.apiBaseUrl}/ApprovalVisa`;

        body = {
          visa_request_id: id,
          company_code,
          request_status: status,
          Modified_by: sessionStorage.getItem("selectedUserCode")
        };
      }

      /* ---------- Travel ---------- */
      else if (type === "Travel") {
        url = `${config.apiBaseUrl}/ApprovalTravel`;

        body = {
          travel_request_id: id,
          company_code,
          request_status: status,
          modified_by: sessionStorage.getItem("selectedUserCode")
        };
      }

      /* ---------- Employee Change ---------- */
      else if (type === "Employee") {
        url = `${config.apiBaseUrl}/ApprovePersonalRequest`;

        body = {
          Info_request_id: id,
          company_code,
          request_status: status,
          approver_id: sessionStorage.getItem("selectedUserCode"),
        };
      }

      /* ---------- Family Change ---------- */
      else if (type === "Family") {
        url = `${config.apiBaseUrl}/ApproveFamilyRequest`;

        body = {
          Info_request_id: id,
          company_code,
          request_status: status,
          approver_id: sessionStorage.getItem("selectedUserCode"),
          modified_by: sessionStorage.getItem("selectedUserCode"),
        };
      }

      /* ---------- Academic Change ---------- */
      else if (type === "Academic") {
        url = `${config.apiBaseUrl}/ApproveAcademicRequest`;

        const selectedRequest = dashboardRequests.find(
          (r) => r.id === id && r.type === "Academic",
        );

        body = {
          approvalData: selectedRequest.rows.map((row) => ({
            detail_id: row.detail_id,
            info_request_id: row.info_request_id,
            company_code,
            EmployeeId: row.EmployeeId,
            request_status: status,
            modified_by: sessionStorage.getItem("selectedUserCode"),
          })),
        };
      }

      /* ---------- Document Change ---------- */
      else if (type === "Document") {
        url = `${config.apiBaseUrl}/ApproveDocumentRequest`;

        const selectedRequest = dashboardRequests.find(
          (r) => r.id === id && r.type === "Document",
        );

        body = {
          approvalData: selectedRequest.rows.map((row) => ({
            detail_id: row.detail_id,
            info_request_id: row.info_request_id,
            company_code,
            EmployeeId: row.EmployeeId,
            request_status: status,
            created_by: sessionStorage.getItem("selectedUserCode"),
            modified_by: sessionStorage.getItem("selectedUserCode"),
          })),
        };
      }

      /* --------------- Asset Change -----------------*/
      else if (type === "Asset") {
        url = `${config.apiBaseUrl}/ApproveAssetRequest`;

        const selectedRequest = dashboardRequests.find(
          (r) => r.id === id && r.type === "Asset"
        );
        const formatToSQLDate = (value) => {
          if (!value) return null;

          const date = new Date(value);
          if (isNaN(date)) return null;

          return date.toISOString().split("T")[0]; // yyyy-MM-dd
        };

        body = {
          approvalData: selectedRequest.rows.map((row) => {
            let AssetID = null;
            let ExpectedReturnDate = null;
            let ActualReturnDate = null;
            let Remarks = "";

            if (row.FieldName === "AssetID") {
              AssetID = row.NewValue;
            }
            if (row.FieldName === "ExpectedReturnDate") {
              ExpectedReturnDate = formatToSQLDate(row.NewValue);
            }
            if (row.FieldName === "ActualReturnDate") {
              ActualReturnDate = formatToSQLDate(row.NewValue);
            }
            if (row.FieldName === "Remarks") {
              Remarks = row.NewValue;
            }

            return {
              DetailID: row.DetailID,
              info_request_id: row.RequestID || row.info_request_id,
              company_code,
              EmployeeID: row.EmployeeID,
              request_status: status,
              AssetID,
              ExpectedReturnDate,
              ActualReturnDate,
              Remarks,
            };
          }),
        };
      }

      /* ---------- Shift Request ---------- */
      else if (type === "Shift Change") {
        url = `${config.apiBaseUrl}/shiftRequestManagerApproval`;

        body = {
          request_id: id,
          company_code,
          request_status: status,
          modified_by: sessionStorage.getItem('selectedUserCode'),
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(`${type} ${status} successfully`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  // Fetch data from the backend
  const fetchNewJoins = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/NewJoinee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      // Convert raw response to JSON
      const data = await response.json();

      // Convert buffer data to Blob URL (same logic you used)
      const employeesWithImages = data.map((joinee) => ({
        ...joinee,
        Photos:
          joinee.Photos && joinee.Photos.data
            ? bufferToBlobUrl(joinee.Photos.data)
            : "",
      }));

      // Set final formatted data into state
      setNewJoinees(employeesWithImages);
    } catch (error) {
      console.error("Error fetching new joinees:", error);
    }
  };

  useEffect(() => {
    fetchNewJoins();
  }, []);

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/UpcomingBirthday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      const employeesWithImages = responseData.map((person) => {
        console.log(person.Photos); // Check image buffer structure

        return {
          ...person,
          Photos:
            person.Photos && person.Photos.data
              ? bufferToBlobUrl(person.Photos.data)
              : "",
        };
      });

      setUpcomingBirthdays(employeesWithImages);
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };

  useEffect(() => {
    fetchBirthdaysinfo();
  }, []);

  const [teamData, setTeamData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamListChart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      console.log(manager);

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        const teamNames = data.map((item) => item.DEPARTMENT);
        const teamDistribution = data.map((item) => item.EMPLOYEE);

        setTeamData({
          labels: teamNames,
          datasets: [
            {
              label: "Team Distribution",
              data: teamDistribution,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      } else {
        setTeamData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTeamData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchGridData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      setRowDataTeamList(data);
    } catch (error) {
      console.error("Error fetching grid data:", error);
      setRowDataTeamList([]);
    }
  };

  useEffect(() => {
    if (!manager) return;

    if (viewChart) {
      fetchTeamData();
    } else {
      fetchGridData();
    }
  }, [manager, viewChart]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getManager`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setManagerdrop(val));
  }, []);

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.manager,
    label: option.manager,
  }));

  const handleChangeManager = (SelectedManager) => {
    setSelectedManager(SelectedManager);
    setManager(SelectedManager ? SelectedManager.value : "");
  };

  const teamOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // AG Grid columns
  const columnDefsList = [
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Employee Id",
      field: "EmployeeId",
      onCellClicked: (params) => {
        const empId = params.value;
        navigate("/AddEmployeeInfo", { state: { employeeId: empId } });
      },
    },
    {
      headerName: "Employee Name",
      field: "EmployeeName",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
  ];

  // AG Grid columns
  const ShiftColDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Date",
      field: "Date",
      minWidth: 130,
    },
    {
      headerName: "Shift Pattern",
      field: "Shift_Pattern_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftPatternIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftPatternIdDropGrid.find(
          (d) => d.value === params.value,
        );
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Day Sequence",
      field: "Day_Sequence",
      minWidth: 130,
    },
    {
      headerName: "Shift Code",
      field: "Shift_Code",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftCodeDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftCodeDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Employee ID",
      field: "Employee_ID",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftEmpIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftEmpIdDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Department",
      field: "dept_id",
      minWidth: 130,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftDeptIdDropGrid.map((d) => d.value),
      },
      valueFormatter: (params) => {
        const dept = shiftDeptIdDropGrid.find((d) => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },
    {
      headerName: "Designation",
      field: "desgination_id",
      minWidth: 130,
    },
    {
      headerName: "Start Time",
      field: "Start_Time",
      minWidth: 100,
    },
    {
      headerName: "End Time",
      field: "End_Time",
      minWidth: 100,
    },
  ];

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Employee ID",
      field: "Employeeid",
    },
    {
      headerName: "Employee Name",
      field: "First_Name",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
    {
      headerName: "Manager",
      field: "manager",
    },
    // {
    //   headerName: "Shift",
    //   field: "shift",
    // },
    {
      headerName: "Aadhaar No",
      field: "AAdhar_no",
    },
    {
      headerName: "PF No",
      field: "PFNo",
    },
    {
      headerName: "Account No",
      field: "Account_NO",
    },
    {
      headerName: "Marital Status",
      field: "marital_status",
    },
    {
      headerName: "DOJ",
      field: "DOJ",
    },
    {
      headerName: "DOL",
      field: "DOL",
    },
  ];

  // AG Grid columns For Time and Hours
  const columnDefsTHRS = [
    {
      headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1,
      width: 80, cellStyle: { textAlign: "center" },
    },
    { headerName: "User", field: "user_name" },
    {
      headerName: "Working Date",
      field: "work_date",
    }, { headerName: "Shift code", field: "Shift_Code" },
    { headerName: "Status", field: "Status" },
    { headerName: "Total Login Hours", field: "Total_login_Hours" },
    { headerName: "First CheckIn", field: "First_CheckIn" },
    { headerName: "Last CheckOut", field: "Last_CheckOut" },
    { headerName: "Over Time", field: "Overtime" },
    { headerName: "Under Time", field: "Undertime" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          created_by: sessionStorage.getItem("selectedUserCode"),
          modified_by: sessionStorage.getItem("selectedUserCode"),
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

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (id, isChecked) => {
    setSelectedRows((prev) =>
      isChecked ? [...prev, id] : prev.filter((rowId) => rowId !== id),
    );
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmpSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Employeeid: employeeId,
          First_Name: employeeName,
          department_ID: department,
          designation_ID: designation,
          AAdhar_no: aadharNo,
          marital_status: maritalStatus,
          PFNo: pfNo,
          Account_NO: accountNo,
          shift: shift,
          manager: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData);
        console.log("data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  const handleShiftSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAdEmpShiftReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          From_Date: shiftFromDate,
          To_Date: shiftToDate,
          Employee_ID: shiftEmpId,
          department_ID: shiftDeptId,
          designation_ID: shiftDesigId,
          Shift_Pattern_ID: shiftPatternId,
          Shift_Code: shiftCode,
          Day_Sequence: shiftDay,
          Start_Time: shiftStartTime,
          End_Time: shiftEndTime,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        setShiftRowData(searchData);
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setShiftRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  // const reloadGridData = () => {
  //   window.location.reload();
  // };

  // useEffect(() => {
  //   const fetchAttendanceData = async () => {
  //     const manager = sessionStorage.getItem('selectedUserCode');
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode"),
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!Array.isArray(data) || data.length === 0) {
  //         throw new Error("Invalid or empty data");
  //       }

  //       const statusColors = {
  //         Present: "#4CAF50",  // Green
  //         Absent: "#F44336",   // Red
  //         Late: "#FF9800",     // Orange
  //         HalfDay: "#2196F3",  // Blue
  //         Leave: "#9C27B0",    // Purple
  //       };

  //       const labels = data.map((item) => item.Status);
  //       const values = data.map((item) => item.Employees);

  //       const backgroundColors = labels.map((status) => statusColors[status] || "#9E9E9E");

  //       setChartData({
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: "Overall Attendance",
  //             data: values,
  //             backgroundColor: backgroundColors,
  //             borderColor: "#ccc",
  //             borderWidth: 1,
  //           },
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchAttendanceData();
  // }, []);

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

  //Over All Attendance Function
  const [showChart, setShowChart] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [leaveRowData, setLeaveRowData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchLeaveStatusData = async (LeaveStatus = "") => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/DashboardOverallAttendanceData`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manager: sessionStorage.getItem("selectedUserCode"),
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            LeaveStatus: LeaveStatus,
          }),
        },
      );

      const result = await response.json();

      if (Array.isArray(result)) {
        setLeaveRowData(result);
      } else {
        setLeaveRowData([]);
      }
    } catch (error) {
      console.error("Failed to fetch leave data", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        const labels = result.map((item) => item.Status);
        const dataValues = result.map((item) => item.Employees);
        const backgroundColors = result.map((item) =>
          item.Status === "Present"
            ? "green"
            : item.Status === "Leave"
              ? "blue"
              : "red",
        );

        const chart = {
          labels,
          datasets: [
            {
              label: "Overall Attendance",
              data: dataValues,
              backgroundColor: backgroundColors,
              borderRadius: 0,
              barThickness: 70,
            },
          ],
        };

        setChartData(chart);
      } else {
        console.warn("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  };

  const onBarClick = (event) => {
    const elements = getElementAtEvent(chartRef.current, event);

    if (!elements || elements.length === 0) return;

    const clickedIndex = elements[0].index;
    const clickedLabel = chartData.labels[clickedIndex];

    console.log("Clicked on:", clickedLabel);
    setShowChart(false);
    fetchLeaveStatusData(clickedLabel);
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const handleToggle = () => {
    const newState = !showChart;
    setShowChart(newState);

    if (!newState) {
      fetchLeaveStatusData("");
    }
  };

  const columnLeave = [
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: "center" },
    },
    { headerName: "Date", field: "Date" },
    { headerName: "Employee ID", field: "EmployeeId" },
    { headerName: "Employee Name", field: "EmployeeName" },
    { headerName: "Department", field: "department_ID" },
    { headerName: "Designation", field: "designation_ID" },
    { headerName: "Manager", field: "Manager" },
    { headerName: "Attendance Status", field: "AttendanceStatus" },
  ];

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

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformShiftRowData = (data) => {
    return data.map((row) => {
      const patternObj = shiftPatternIdDropGrid.find(
        (d) => d.value === row.Shift_Pattern_ID,
      );

      const patternName = patternObj
        ? patternObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const shiftObj = shiftCodeDropGrid.find(
        (d) => d.value === row.Shift_Code,
      );

      const shiftName = shiftObj
        ? shiftObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const empObj = shiftEmpIdDropGrid.find(
        (d) => d.value === row.Employee_ID,
      );

      const empName = empObj
        ? empObj.label.split(" - ").slice(1).join(" - ")
        : "";

      const deptObj = shiftDeptIdDropGrid.find((d) => d.value === row.dept_id);

      const deptName = deptObj
        ? deptObj.label.split(" - ").slice(1).join(" - ")
        : "";

      return {
        Date: row.Date || "",
        "Shift Pattern": `${row.Shift_Pattern_ID} - ${patternName}` || "",
        "Day Sequence": row.Day_Sequence || "",
        Shift: `${row.Shift_Code} - ${shiftName}` || "",
        "Employee ID": `${row.Employee_ID} - ${empName}` || "",
        Department: `${row.dept_id} - ${deptName}` || "",
        Designation: row.desgination_id || "",
        "Start Time": row.Start_Time || "",
        "End Time": row.End_Time || "",
      };
    });
  };

  const handleExportToExcelShift = () => {
    if (!shiftRowData || shiftRowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Employee Shift Detail Search Report";
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

    const transformedData = transformShiftRowData(shiftRowData);

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
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
      },
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
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill: R % 2 === 0 ? { fgColor: { rgb: altRowBg } } : undefined,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Shift Detail");

    XLSX.writeFile(workbook, "Employee_Shift_Detail_Search_Report.xlsx");
  };

  const transformRowData = (data) => {
    return data.map((row) => {
      return {
        "Employee ID": row.Employeeid || "",
        "Employee Name": row.First_Name || "",
        Department: row.department_ID || "",
        Designation: row.designation_ID || "",
        Manager: row.manager || "",
        Shift: row.shift || "",
        "Aadhaar No": row.AAdhar_no || "",
        "PF No": row.PFNo || "",
        "Account No": row.Account_NO || "",
        "Marital Status": row.marital_status || "",
        DOJ: row.DOJ || "",
        DOL: row.DOL || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Employee Detail Search Report";
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

    const transformedData = transformRowData(rowData);

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
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
      },
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
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill: R % 2 === 0 ? { fgColor: { rgb: altRowBg } } : undefined,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Detail");

    XLSX.writeFile(workbook, "Employee_Detail_Search_Report.xlsx");
  };

  const convertDate = (date) => {
    if (!date) return "";
    const parts = date.split(/[-\/]/);
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  };

  const [requestSearch, setRequestSearch] = useState("");

  const filteredRequests = dashboardRequests
    .filter(r => (r.status || "").toLowerCase() === "pending")
    .filter(req => {
      const searchLower = (requestSearch || "").trim().toLowerCase();

      if (!searchLower) return true;

      return (
        (req.EmployeeName && String(req.EmployeeName).toLowerCase().includes(searchLower)) ||
        (req.EmployeeId && String(req.EmployeeId).toLowerCase().includes(searchLower)) ||
        (req.type && String(req.type).toLowerCase().includes(searchLower)) ||
        (req.title && String(req.title).toLowerCase().includes(searchLower))
      );
    });

  const reloadGridDatas = () => {
    clearInputsField([])
    setRowData([])
  };

  const clearInputsField = () => {
    setShiftEndTime('');
    setShiftStartTime('');
    setShiftDay('');
    setSelectedShiftCode('');
    setShiftCode('');
    setSelectedShiftPatternId('');
    setShiftPatternId('');
    setSelectedShiftDesigId('');
    setShiftDesigId('');
    setSelectedShiftDeptId('');
    setShiftDeptId('');
    setSelectedShiftEmpId('');
    setShiftEmpId('');
    setShiftToDate('');
    setTRToDate('');
    setShiftFromDate('');
    setTRFromDate('');
  };

  const reloadGridData = () => {
    clearInputs([])
    setShiftRowData([])
  };

  const clearInputs = () => {
    setSelectedMaritalStatus('');
    setMaritalStatus('');
    setAccountNo('');
    setPfNo('');
    setAadharNo('');
    setmanager('');
    setDesignation('');
    setDepartment('');
    setEmployeeName('');
    setEmployeeId('');
    setEmployeeName('');
  };


  return (
    <div className="dashboard-container-fluid Topnav-screen pb-2">
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="app-shadow-lg spacing-p-1 bg-light-color rounded-base main-header-box">
        <div className="header-flex">
          <div className="grid-col-12 grid-col-md-8">
            <div className="ticker-wrapper">
              <div className="ticker-text">{announcement}</div>
            </div>
          </div>

          <div className="dashboard-wrapper">
            <input
              id="timing"
              className="app-form-control"
              type="text"
              readOnly
              value={timer}
            />

            <button
              onClick={handleTime}
              className="check-btn"
              style={{
                backgroundColor: isCheckedIn ? "red" : "green",
                color: "white",
              }}
              title={isCheckedIn ? "Check Out" : "Check In"}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>
          </div>
        </div>
      </div>

      {/* <div className="dashboard-layout mt-2">
        <div className="dashboard-row">
          <div className="grid-col-md-4">
            <div className="info-card-base rounded card-gradient-blue">
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Total Active Employees
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {" "}
                {formattedTotalActiveEmployees}
              </div>
            </div>
          </div>

          <div className="grid-col-md-4">
            <div
              className="info-card-base rounded card-gradient-pink"
              style={{ cursor: "pointer" }}
            >
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Total Salary Generated
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                &#8377; {formatedTotalEarnings}
              </div>
              <div className="graph-line"></div>
            </div>
          </div>

          <div className="grid-col-md-4">
            <div
              className="info-card-base rounded card-gradient-indigo"
              style={{ cursor: "pointer" }}
            >
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Number of Salary Generated
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {FormatedTotalPayslip}
              </div>
              <div className="graph-line"></div>
            </div>
          </div>
          
        </div>
      </div> */}

      <div className="dashboard-layout mt-2">
        <div className="dashboard-row">
          {/* Total Employees */}
          <div className="grid-col-md-3">
            <div className="info-card-base rounded card-gradient-blue">
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Total Employees
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-">
                {dashboard.TotalEmployees || 0}
              </div>
            </div>
          </div>

          {/* Present Today */}
          <div className="grid-col-md-3">
            <div className="info-card-base rounded card-gradient-pink">
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Total Present Today
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {dashboard.PresentToday || 0}
              </div>
            </div>
          </div>

          {/* Absent Today */}
          <div className="grid-col-md-3">
            <div className="info-card-base rounded card-gradient-indigo">
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Total Absent Today
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {dashboard.AbsentToday || 0}
              </div>
            </div>
          </div>

          {/* Late Arrivals */}
          <div className="grid-col-md-3">
            <div className="info-card-base rounded card-gradient-teal">
              <img src={Circle} className="card-pulse-image" alt="" />
              <div className="text-color-white font-weight-bold">
                Late Arrivals
              </div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {dashboard.LateArrivals || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row row spacing-mt-2">
        <div className="col-lg-8">
          <div className="dashboard-row ">
            <div className="grid-col-lg-6 grid-col-md-6">
              <div className="app-card-base attendance-card-wrapper rounded app-shadow-lg height-full">
                <div className="display-flex flex-between-center padding-horizontal-2 spacing-mb-2">
                  <h6 className="card-title-heading spacing-mb-0">
                    Today Attendance
                  </h6>
                  <button
                    className="btn-outline-primary-custom"
                    onClick={handleToggle}
                  >
                    {showChart ? (
                      <>
                        <i className="fa-solid fa-table-list mr-2"></i> Leave List
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-chart-pie mr-2"></i> Show Chart
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="chart-area-container"
                  style={{ width: "100%", height: "280px", padding: "20px" }}
                >
                  {showChart ? (
                    chartData ? (
                      <Bar
                        ref={chartRef}
                        data={chartData}
                        options={chartOptions}
                        onClick={onBarClick}
                      />
                    ) : (
                      <p>Loading...</p>
                    )
                  ) : (
                    <div
                      className="app-grid-theme ag-theme-alpine"
                      style={{ height: 255, width: "100%" }}
                    >
                      <AgGridReact
                        rowData={leaveRowData}
                        columnDefs={columnLeave}
                        rowHeight={30}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-col-lg-6 grid-col-md-6">
              <div className="app-card-base shift-pattern-wrapper rounded app-shadow-lg height-full">
                <div className="display-flex flex-between-center">
                  <h6 className="card-title-heading spacing-mb-0">
                    Shift Name
                  </h6>
                </div>

                <div
                  className="shift-chart-container"
                  style={{
                    position: "relative",
                    height: "240px",
                    marginTop: "30px",
                  }}
                >
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={shiftData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                      // label={({ name, value }) => `${name} (${value})`}
                      >
                        {shiftData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* <div className="shift-legend-list spacing-mt-3">
              {shiftData.map((item, idx) => (
                <div key={idx} className="shift-legend-item">
                  <span className="dot" style={{ backgroundColor: item.color }}></span>
                  <span className="label">{item.name}</span>
                  <span className="count">{item.value}</span>
                </div>
              ))}
            </div> */}
              </div>
            </div>

            <div className="grid-col-lg-6 spacing-mt-2">
              <div className="app-card-base joinees-card rounded app-shadow-lg height-full border-0 position-relative">
                <div className="display-flex flex-between-center mb-3">
                  <h6 className="card-title-heading mb-0">New Joiners</h6>
                </div>

                <div className="fixed-card-content">
                  <div
                    className="joinee-carousel-container"
                    ref={joineeCarouselRef}
                  >
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
                              <h6 className="emp-name-text">
                                {joinee.EmployeeName}
                              </h6>
                              <div className="emp-dept-sub">
                                {joinee.department_ID} • {joinee.EmployeeId}
                              </div>
                              <div className="welcome-badge">
                                Welcome Onboard! 🤝
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-birthday-view">
                        <div className="empty-icon">👥</div>
                        <p className="text-muted-color">
                          No new joinees this month
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {NewJoinees.length > 1 && (
                  <div className="joinee-nav-controls-bottom">
                    <button className="nav-btn" onClick={handleJoineePrev}>
                      ❮
                    </button>
                    <div className="joinee-nav-dots">
                      {NewJoinees.map((_, i) => (
                        <span
                          key={i}
                          className={`dot ${currentIndexJoinee === i ? "active" : ""}`}
                        ></span>
                      ))}
                    </div>
                    <button className="nav-btn" onClick={handleJoineeNext}>
                      ❯
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid-col-lg-6 spacing-mt-2">
              <div className="app-card-base birthday-card-wrapper rounded app-shadow-lg height-full border-0 position-relative">
                <div className="display-flex flex-between-center mb-3">
                  <h6 className="card-title-heading mb-0">
                    Upcoming Birthdays
                  </h6>
                </div>

                <div className="fixed-card-content">
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
                              <h6 className="emp-name-text">
                                {person.EmployeeName}
                              </h6>
                              <div className="emp-dept-sub">
                                {person.Department || "Team Member"}
                              </div>
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
                </div>

                {upcomingBirthdays.length > 1 && (
                  <div className="birthday-nav-controls-bottom">
                    <button className="nav-btn" onClick={handlePrev}>
                      ❮
                    </button>
                    <div className="birthday-nav-dots">
                      {upcomingBirthdays.map((_, i) => (
                        <span
                          key={i}
                          className={`dot ${currentIndex === i ? "active" : ""}`}
                        ></span>
                      ))}
                    </div>
                    <button className="nav-btn" onClick={handleNext}>
                      ❯
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Approval */}
        <div className="grid-col-lg-4">
          <div className="app-card-base pending-requests-card rounded app-shadow-lg">
            {/* Header Section */}
            <div className="card-header-modern">
              {/* Row 1: Title and Count */}
              <div className="header-top-row d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title-heading mb-0">Pending Requests</h6>
                <span className="request-badge-count">
                  {dashboardRequests.filter(r => (r.status || "").toLowerCase() === "pending").length}&nbsp;&nbsp;Pending
                </span>
              </div>

              {/* Row 2: Search Bar (Bottom) */}
              <div className="header-bottom-row">
                <div className="search-wrapper-modern">
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input
                    type="text"
                    className="search-input-modern"
                    placeholder="Search employee or request type..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="custom-list-container fixed-list-height">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, index) => (
                  <div
                    key={index}
                    className="request-item-modern"
                    onClick={() => {
                      navigate("/RequestReport", {
                        state: {
                          type: req.type,
                          id: req.id,
                          fromDate: convertDate(req.FromDate),
                          toDate: convertDate(req.ToDate),
                          employeeId: req.EmployeeId,
                          status: "Pending",
                          mode: "item",
                          HolidayName: req.title
                        },
                      })
                    }}
                  >
                    {/* Avatar Fallback Logic */}
                    <div className="req-avatar">
                      {req.EmployeeName
                        ? req.EmployeeName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                        : "Mr.X"
                      }
                    </div>
                    <div className="req-content">
                      <div className="req-top-row">
                        <span className="req-emp-name">{req.EmployeeName}</span>
                        <span className="req-type-tag" onClick={(e) => {
                          e.stopPropagation();
                          navigate("/RequestReport", {
                            state: { employeeId: req.EmployeeId, type: req.type, status: "Pending", mode: "type" },
                          });
                        }}>
                          {req.type}
                        </span>
                      </div>

                      <div className="req-mid-row">
                        <span className="req-id">ID: {req.EmployeeId}</span>
                        <span className="req-dot">•</span>
                        <span className="req-title">{req.title}</span>
                      </div>

                      {req.FromDate && (
                        <div className="req-date-footer">
                          <i className="fa-regular fa-calendar-days"></i>
                          <span>{req.FromDate}</span>
                          <i className="fa-solid fa-arrow-right-long mx-2"></i>
                          <span>{req.ToDate}</span>
                          {req.days && <span className="req-days-count">({req.days} Days)</span>}
                        </div>
                      )}
                    </div>

                    {/* Action Group */}
                    <div className="req-actions-vertical">
                      <button
                        className="action-circle-btn approve"
                        title="Approve"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproval(req.type, req.id, req.FromDate, true, {
                            EmployeeId: req.EmployeeId,
                            HolidayDate: req.HolidayDate,
                          });
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        className="action-circle-btn reject"
                        title="Reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproval(req.type, req.id, req.FromDate, false, {
                            EmployeeId: req.EmployeeId,
                            HolidayDate: req.HolidayDate,
                          });
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-state">
                  <div className="empty-illustration">📂</div>
                  <p>No matching requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-row row main-stats-container">
        <div className="col-6 spacing-mt-2 time-tracking-wrapper">
          <div className="app-card-base rounded birthday-card-wrapper app-shadow-lg height-full padding-all-3">
            {/* Header Section */}
            <div className="myteam-header">
              <h6 className="card-title-heading mb-0">My Team</h6>

              <div className="myteam-actions">
                <Select
                  id="status"
                  value={SelectedManager}
                  onChange={handleChangeManager}
                  options={filteredOptionManager}
                  className="team-select-wrapper"
                  placeholder="Select Manager..."
                  isClearable
                />

                {/* Global Color Toggle Button */}
                <button
                  className="team-toggle-button"
                  onClick={() => {
                    setViewChart(!viewChart);
                    if (viewChart) {
                      fetchGridData();
                    }
                  }}
                >
                  {viewChart ? (
                    <>
                      <i className="fa-solid fa-list-ul mr-2"></i> Team List
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-chart-pie mr-2"></i> Chart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="myteam-content-area mt-3">
              {viewChart ? (
                <div className="display-flex justify-content-center dashboard-row">
                  <div className="grid-col-12">
                    <div
                      className="chart-container"
                      style={{ height: 260, width: "100%", paddingBottom: "20px" }}
                    >
                      {teamData?.labels?.length > 0 ? (
                        <Doughnut data={teamData} options={teamOptions} />
                      ) : (
                        <div className="no-data-state py-5">
                          <i className="fa-solid fa-inbox mb-2"></i>
                          <p>No team data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="app-grid-theme ag-theme-alpine rounded-xl overflow-hidden"
                  style={{ height: 265, width: "100%" }}
                >
                  <AgGridReact
                    columnDefs={columnDefsList}
                    rowData={rowDataTeamList}
                    rowHeight={35}
                    headerHeight={40}
                    animateRows={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-6 spacing-mt-2 my-team-wrapper">
          <div className=" rounded birthday-card-wrapper app-shadow-lg height-full">
            {/* Header */}
            <div className="myteam-header">
              <h6 className="card-title-heading spacing-mb-2">Time Tracking</h6>
            </div>

            {/* Filters */}
            <div className="row g-3 mb-2">
              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    value={TRFromDate}
                    onChange={(e) => setTRFromDate(e.target.value)}
                  />
                  <label className="exp-form-labels">From Date</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    value={TRToDate}
                    min={TRFromDate}
                    onChange={(e) => setTRToDate(e.target.value)}
                  />
                  <label className="exp-form-labels">To Date</label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedUser ? "has-value" : ""} 
                  ${isSelectUser ? "is-focused" : ""}`}
                >
                  <Select
                    id="Approvedby"
                    value={selectedUser}
                    onChange={handleChangeUser}
                    options={filteredOptionUser}
                    classNamePrefix="react-select"
                    placeholder=" "
                    onFocus={() => setIsSelectUser(true)}
                    onBlur={() => setIsSelectUser(false)}
                    isClearable
                  />
                  <label for="sname" className="floating-label">
                    User Code
                  </label>
                </div>
              </div>

              {/* Search */}
              <div className="col-md-3 mt-2 d-flex justify-content-end justify-content-md-start">
                <button
                  className="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
                  onClick={() => fetchTHRSGridData()}
                  style={{ height: "30px", width: "40px" }}
                  title="Search"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>

            </div>

            {/* Grid */}
            <div
              className="app-grid-theme ag-theme-alpine spacing-mt-2 rounded-xl"
              style={{ height: 255, width: "100%" }}
            >
              <AgGridReact
                columnDefs={columnDefsTHRS}
                rowData={rowDataTHRS}
                rowHeight={30}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row spacing-mt-2">
        <div className="grid-col-12">
          <div className="birthday-card-wrapper rounded app-shadow-lg height-full">
            <h6 className="display-flex justify-content-start card-title-heading spacing-mb-2">
              Employee Shift Details
            </h6>

            <div className="row mb-2-me-1 g-3">
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="date"
                    autoComplete="off"
                    placeholder=" "
                    value={shiftFromDate}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    onChange={(e) => setShiftFromDate(e.target.value)}
                  />
                  <label className="exp-form-labels">From Date</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="date"
                    autoComplete="off"
                    placeholder=" "
                    value={shiftToDate}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    onChange={(e) => setShiftToDate(e.target.value)}
                  />
                  <label className="exp-form-labels">To Date</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedShiftEmpId ? "has-value" : ""} 
                  ${isSelectedShiftEmpId ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectedShiftEmpId(true)}
                    onBlur={() => setIsSelectedShiftEmpId(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionEmpId}
                    onChange={handleChangeEmpId}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    value={selectedShiftEmpId}
                  />
                  <label className="floating-label">Employee ID</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedShiftDeptId ? "has-value" : ""} 
                  ${isSelectedShiftDeptId ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectedShiftDeptId(true)}
                    onBlur={() => setIsSelectedShiftDeptId(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionDeptId}
                    onChange={handleChangeDeptId}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    value={selectedShiftDeptId}
                  />
                  <label className="floating-label">Department ID</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedShiftDesigId ? "has-value" : ""} 
                  ${isSelectedShiftDesigId ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectedShiftDesigId(true)}
                    onBlur={() => setIsSelectedShiftDesigId(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={shiftDesigIdDrop}
                    onChange={handleChangeDesigId}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    value={selectedShiftDesigId}
                  />
                  <label className="floating-label">Designation ID</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedShiftPatternId ? "has-value" : ""} 
                  ${isSelectedShiftPatternId ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectedShiftPatternId(true)}
                    onBlur={() => setIsSelectedShiftPatternId(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionShiftPatternId}
                    onChange={handleChangeShiftPatternId}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    value={selectedShiftPatternId}
                  />
                  <label className="floating-label">Shift Pattern ID</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                  ${selectedShiftCode ? "has-value" : ""} 
                  ${isSelectedShiftCode ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectedShiftCode(true)}
                    onBlur={() => setIsSelectedShiftCode(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionShiftCode}
                    onChange={handleChangeShiftCode}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    value={selectedShiftCode}
                  />
                  <label className="floating-label">Shift Name</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="number"
                    autoComplete="off"
                    placeholder=" "
                    value={shiftDay}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    onChange={(e) => setShiftDay(e.target.value)}
                  />
                  <label className="exp-form-labels">Day Sequence</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="time"
                    autoComplete="off"
                    placeholder=" "
                    value={shiftStartTime}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    onChange={(e) => setShiftStartTime(e.target.value)}
                  />
                  <label className="exp-form-labels">Start Time</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="time"
                    autoComplete="off"
                    placeholder=" "
                    value={shiftEndTime}
                    onKeyDown={(e) => e.key === "Enter" && handleShiftSearch()}
                    onChange={(e) => setShiftEndTime(e.target.value)}
                  />
                  <label className="exp-form-labels">End Time</label>
                </div>
              </div>

              <div className="col-md-2 d-flex justify-content-md-start justify-content-end align-items-center">
                <div className="search-btn-wrapper">
                  <div className="icon-btn search" onClick={handleShiftSearch}>
                    <span className="tooltip">Search</span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="icon-btn reload" onClick={reloadGridDatas}>
                    <span className="tooltip">Reload</span>
                    <i className="fa-solid fa-rotate-right"></i>
                  </div>
                  <div
                    className="icon-btn excel"
                    onClick={handleExportToExcelShift}
                  >
                    <span className="tooltip">Excel</span>
                    <i className="fa-solid fa-file-excel"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div
                className="app-grid-theme ag-theme-alpine mt-2 rounded-xl"
                style={{ height: 440, width: "100%" }}
              >
                <AgGridReact
                  columnDefs={ShiftColDefs}
                  rowData={shiftRowData}
                  suppressRowClickSelection={true}
                  onGridReady={(params) => {
                    gridApiRef.current = params.api;
                    gridColumnApiRef.current = params.columnApi;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row spacing-mt-2">
        <div className="grid-col-12">
          <div className="birthday-card-wrapper rounded app-shadow-lg height-full">
            <h6 className="display-flex justify-content-start card-title-heading spacing-mb-2">
              Employee Details
            </h6>

            <div className="row mb-2-me-1 g-3">
              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={employeeId}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                  <label className="exp-form-labels">Employee ID</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={employeeName}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                  <label className="exp-form-labels">Employee Name</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    autoComplete="off"
                    placeholder=" "
                    type="text"
                    value={department}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <label className="exp-form-labels">Department</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={designation}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                  <label className="exp-form-labels">Designation</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={Manager}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setmanager(e.target.value)}
                  />
                  <label className="exp-form-labels">Manager</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={aadharNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAadharNo(e.target.value)}
                  />
                  <label className="exp-form-labels">Aadhaar No</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={pfNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setPfNo(e.target.value)}
                  />
                  <label className="exp-form-labels">PF No</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={accountNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAccountNo(e.target.value)}
                  />
                  <label className="exp-form-labels">Account No</label>
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
                ${selectedMaritalStatus ? "has-value" : ""} 
                ${isSelectMarital ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectMarital(true)}
                    onBlur={() => setIsSelectMarital(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionMartial}
                    onChange={handleChangeMartial}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedMaritalStatus}
                  />
                  <label className="floating-label">Marital Status</label>
                </div>
              </div>

              {/* <div className="grid-col-md-5">
                <div
                  className={`inputGroup selectGroup 
                ${selectedShift ? "has-value" : ""} 
                ${isSelectShift ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectShift(true)}
                    onBlur={() => setIsSelectShift(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionShift}
                    onChange={handleChangeShift}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedShift}
                  />
                  <label className="floating-label">Shift</label>
                </div>
              </div> */}

              <div className="col-md-2 d-flex justify-content-md-start justify-content-end align-items-center">
                <div className="search-btn-wrapper">
                  <div className="icon-btn search" onClick={handleSearch}>
                    <span className="tooltip">Search</span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="icon-btn reload" onClick={reloadGridData}>
                    <span className="tooltip">Reload</span>
                    <i className="fa-solid fa-rotate-right"></i>
                  </div>
                  <div className="icon-btn excel" onClick={handleExportToExcel}>
                    <span className="tooltip">Excel</span>
                    <i className="fa-solid fa-file-excel"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div
                className="app-grid-theme ag-theme-alpine mt-2 rounded-xl"
                style={{ height: 440, width: "100%" }}
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  suppressRowClickSelection={true}
                  onGridReady={(params) => {
                    gridApiRef.current = params.api;
                    gridColumnApiRef.current = params.columnApi;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
