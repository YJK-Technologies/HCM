import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend} from "recharts";
import "./InterviewDashboard.css";
import config from "./Apiconfig";
import { Users, UserCheck, Layout } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const format = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return { startDate: format(firstDay), endDate: format(lastDay) };
};

const DepartmentDashboard = () => {
  const { startDate, endDate } = getCurrentMonthRange();
  const companyCode = sessionStorage.getItem("selectedCompanyCode");
  const Location_Code = sessionStorage.getItem('selectedLocationCode')

  // ================= SUMMARY =================
  const [summary, setSummary] = useState({
    Total_Employees: 0,
    Active_Employees: 0,
    On_Leave: 0,
  });
  const [loading, setLoading] = useState(true);

  // ================= DESIGNATION =================
  const [desigData, setDesigData] = useState([]);
  const [desigFromDate, setDesigFromDate] = useState(startDate);
  const [desigToDate, setDesigToDate] = useState(endDate);

  // ================= DEPARTMENT =================
  const [deptData, setDeptData] = useState([]);
  const [deptFromDate, setDeptFromDate] = useState(startDate);
  const [deptToDate, setDeptToDate] = useState(endDate);

  // ================= COUNTRY =================
  const [countryData, setCountryData] = useState([]);
  const [countryFromDate, setCountryFromDate] = useState(startDate);
  const [countryToDate, setCountryToDate] = useState(endDate);

  // ================= NATIONALITY =================
const [nationalityData, setNationalityData] = useState([]);
const [nationalityFromDate, setNationalityFromDate] = useState(startDate);
const [nationalityToDate, setNationalityToDate] = useState(endDate);

  // ================= LEAVE STATUS =================
  const [leaveData, setLeaveData] = useState([]);
  const [leaveFromDate, setLeaveFromDate] = useState(startDate);
  const [leaveToDate, setLeaveToDate] = useState(endDate);

  // ================= AGE Wise  =================
  const [ageData, setAgeData] = useState([]);
  const [ageFromDate, setAgeFromDate] = useState(startDate);
  const [ageToDate, setAgeToDate] = useState(endDate);

  // ================= SUMMARY FETCH =================
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDepartmentDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "SUMMARY",
            company_code: companyCode,
            Location_Code
          }),
        });

        const data = await response.json();
        if (data.length > 0) setSummary(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchLoanSummary = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getLoanDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "AGC",
            company_code: companyCode,
            Location_Code
          }),
        });

        const data = await response.json();
        if (data.length > 0) setSummary(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoanSummary();
  }, []);

  // ================= COMMON FETCH FUNCTION =================
  const fetchChartData = async (mode, fromDate, toDate, setter, nameField, countField) => {
    if (new Date(fromDate) > new Date(toDate)) {
      toast.warning("From Date cannot be greater than To Date");
      setter([]);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/getDepartmentDashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          company_code: companyCode,
          Location_Code,
          fromDate,
          toDate,
        }),
      });

      const result = await response.json();
      setter(
        result.map((item) => ({
          name: item[nameField],
          count: item[countField],
        }))
      );
    } catch (err) {
      setter([]);
    }
  };

// ================= AGE WISE FETCH FUNCTION =================
  const fetchLoanChartData = async (mode, fromDate, toDate, setter, nameField, countField ) => {
  if (new Date(fromDate) > new Date(toDate)) {
    toast.warning("From Date cannot be greater than To Date");
    setter([]);
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/getLoanDashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        company_code: companyCode,
        Location_Code,
        fromDate,
        toDate,
      }),
    });

    const result = await response.json();

    setter(
      result.map((item) => ({
        name: item[nameField],
        count: item[countField],
      }))
    );
  } catch (error) {
    console.error(error);
    setter([]);
  }
};

  const navigate = useNavigate();

  const handleAgeChartClick = (data) => {
  if (!data || !data.activeLabel) return;

  navigate("/AgesReport", {
    state: {
      age_group: data.activeLabel,
      fromDate: ageFromDate,
      toDate: ageToDate,
    },
  });
};


  useEffect(() => {
    fetchChartData("DESIG", desigFromDate, desigToDate, setDesigData, "Designation", "EmployeeCount");
  }, [desigFromDate, desigToDate]);

  useEffect(() => {
    fetchChartData("DEPT", deptFromDate, deptToDate, setDeptData, "DepartmentName", "EmployeeCount");
  }, [deptFromDate, deptToDate]);

  useEffect(() => {
    fetchChartData("COUNTRY", countryFromDate, countryToDate, setCountryData, "Country", "EmployeeCount");
  }, [countryFromDate, countryToDate]);

  useEffect(() => {
  fetchChartData("NAT", nationalityFromDate, nationalityToDate, setNationalityData, "Nationality", "EmployeeCount");
  }, [nationalityFromDate, nationalityToDate]);

  useEffect(() => {
    fetchChartData("LS", leaveFromDate, leaveToDate, setLeaveData, "LeaveStatus", "LeaveCount");
  }, [leaveFromDate, leaveToDate]);

  useEffect(() => {
  fetchLoanChartData("AGC", ageFromDate, ageToDate, setAgeData, "Age_Group", "Total_Count" );
}, [ageFromDate, ageToDate]);

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />

      <header className="app-shadow-lg main-header-box header-flex" style={{ padding: "10px", marginBottom: "10px" }}>
        <h1 className="page-title">Department Dashboard</h1>
      </header>

      {/* SUMMARY CARDS */}
      {/* <section className="stats-grid">
        <div className="stat-card animate-entrance" style={{ animationDelay: "0.1s" }}>
          <div className="icon-box navy-icon icon-animated">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div className="stat-info">
            <p>Total Employees</p>
            {loading ? <div className="skeleton-loader"></div> : <h3>{summary.Total_Employees}</h3>}
          </div>
          <div className="card-decoration"></div>
        </div>

        <div className="stat-card animate-entrance" style={{ animationDelay: "0.2s" }}>
          <div className="icon-box success-icon icon-animated">
            <UserCheck size={28} strokeWidth={2.5} />
          </div>
          <div className="stat-info">
            <p>Active Employees</p>
            {loading ? <div className="skeleton-loader"></div> : <h3>{summary.Active_Employees}</h3>}
          </div>
          <div className="card-decoration"></div>
        </div>

        <div className="stat-card animate-entrance" style={{ animationDelay: "0.3s" }}>
          <div className="icon-box blue-icon icon-animated">
            <Layout size={28} strokeWidth={2.5} />
          </div>
          <div className="stat-info">
            <p>On Leave</p>
            {loading ? <div className="skeleton-loader"></div> : <h3>{summary.On_Leave}</h3>}
          </div>
          <div className="card-decoration"></div>
        </div>
      </section> */}

      {/* CHARTS */}
<section className="charts-grid">

    {/* 1. Country-wise Employee Count */}
    <div className="hcm-chart-container">
        <div className="chart-header mobile-stack">
            <div className="header-text">
                <h2>Nationality-wise Employee Count</h2>
                <p>Employees within selected date range</p>
            </div>
            <div className="filter-container mobile-filter">
                <div className="filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={nationalityFromDate}
                        onChange={(e) => setNationalityFromDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={nationalityToDate}
                        onChange={(e) => setNationalityToDate(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                <BarChart data={nationalityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0F5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#F4F7F9" }} />
                    <Bar dataKey="count" fill="var(--sidenav-hover)" radius={[4,4,0,0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>



    {/* 2. Department-wise Employee Count */}
    <div className="hcm-chart-container">
        <div className="chart-header mobile-stack">
            <div className="header-text">
                <h2>Department-wise Employee Count</h2>
                <p>Active employees within selected date range</p>
            </div>
            <div className="filter-container mobile-filter">
                <div className="filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={deptFromDate}
                        onChange={(e) => setDeptFromDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={deptToDate}
                        onChange={(e) => setDeptToDate(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0F5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#F4F7F9" }} />
                    <Bar dataKey="count" fill="var(--sidenav-hover)" radius={[4,4,0,0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>


        {/* 3. Designation-wise Employee Count */}
    <div className="hcm-chart-container">
        <div className="chart-header mobile-stack">
            <div className="header-text">
                <h2>Designation-wise Employee Count</h2>
                <p>Active employees within selected date range</p>
            </div>
            <div className="filter-container mobile-filter">
                <div className="filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={desigFromDate}
                        onChange={(e) => setDesigFromDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        className="input-bg"
                        value={desigToDate}
                        onChange={(e) => setDesigToDate(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                <BarChart 
                    data={desigData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 65 }} // bottom margin increased for angled text
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0F5" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        interval={0} 
                        fontSize={11}
                        angle={-35}             
                        textAnchor="end"        
                        height={70}             
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#F4F7F9" }} />
                    <Bar dataKey="count" fill="var(--sidenav-hover)" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>


    {/* 4. Leave Status Count */}
<div className="hcm-chart-container">
    <div className="chart-header mobile-stack">
        <div className="header-text">
            <h2>Leave Status Count</h2>
            <p>Leave requests within selected date range</p>
        </div>
        <div className="filter-container mobile-filter">
            <div className="filter-group">
                <label>From Date</label>
                <input
                    type="date"
                    className="input-bg"
                    value={leaveFromDate}
                    onChange={(e) => setLeaveFromDate(e.target.value)}
                />
            </div>
            <div className="filter-group">
                <label>To Date</label>
                <input
                    type="date"
                    className="input-bg"
                    value={leaveToDate}
                    onChange={(e) => setLeaveToDate(e.target.value)}
                />
            </div>
        </div>
    </div>

    <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={leaveData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                >
                    {leaveData.map((entry, index) => {
                        let color = "#3b82f6"; // default blue

                        if (entry.name === "Approved") color = "#22c55e";   // green
                        else if (entry.name === "Rejected") color = "#ef4444"; // red
                        else if (entry.name === "Pending") color = "#f59e0b";  // orange

                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>

</div>

{/* AGE GROUP CHART */}
<div className="hcm-chart-container">
  <div className="chart-header mobile-stack">
    <div className="header-text">
      <h2>Age Group Employee Count</h2>
      <p>Employees by age range within selected date range</p>
    </div>

    <div className="filter-container mobile-filter">
      <div className="filter-group">
        <label>From Date</label>
        <input
          type="date"
          className="input-bg"
          value={ageFromDate}
          onChange={(e) => setAgeFromDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>To Date</label>
        <input
          type="date"
          className="input-bg"
          value={ageToDate}
          onChange={(e) => setAgeToDate(e.target.value)}
        />
      </div>
    </div>
  </div>

  <div style={{ width: "100%", height: 320 }}>
    <ResponsiveContainer>
      <BarChart
        data={ageData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        onClick={handleAgeChartClick}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E8F0F5"
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          interval={0}
          fontSize={12}
        />

        <YAxis axisLine={false} tickLine={false} />

        <Tooltip cursor={{ fill: "#F4F7F9" }} />

        <Bar
          dataKey="count"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          barSize={30}
          cursor="pointer"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

</section>    </div>
  );
};

export default DepartmentDashboard;