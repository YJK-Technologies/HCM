import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import './InterviewDashboard.css';
import config from "./Apiconfig";
import { Users, UserCheck, Layout } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

const FEEDBACK_DATA = [
    { name: 'Selected', value: 450 },
    { name: 'On Hold', value: 210 },
    { name: 'Rejected', value: 140 },
];

const getCurrentMonthRange = () => {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    return {
        startDate: formatDate(firstDay),
        endDate: formatDate(lastDay)
    };
};

const InterviewDashboard = () => {

    const { startDate, endDate } = getCurrentMonthRange();
    const [dashboardCount, setDashboardCount] = useState({
        Total_Candidate: 0,
        Selected_Candidate: 0,
        Total_Interview_Panel: 0
    });
    const [loading, setLoading] = useState(true);
    const [deptData, setDeptData] = useState([]);
    const [depFromDate, setDepFromDate] = useState(startDate);
    const [depToDate, setDepToDate] = useState(endDate);
    const [deptLoading, setDeptLoading] = useState(false);
    const [panelData, setPanelData] = useState([]);
    const [panFromDate, setPanFromDate] = useState(startDate);
    const [panToDate, setPanToDate] = useState(endDate);
    const [panLoading, setPanLoading] = useState(false);

    useEffect(() => {
        const fetchDashboardCount = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getInterviewDashboardCount`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mode: "DASHBOARD",
                        company_code: sessionStorage.getItem("selectedCompanyCode")
                    })
                });

                const data = await response.json();

                if (data && data.length > 0) {
                    setDashboardCount({
                        Total_Candidate: data[0].Total_Candidate,
                        Selected_Candidate: data[0].Selected_Candidate,
                        Total_Interview_Panel: data[0].Total_Interview_Panel
                    });
                }

            } catch (error) {
                console.error("Dashboard count fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardCount();
    }, []);

    useEffect(() => {
        if (!depFromDate || !depToDate) {
            return; 
        }

        if (new Date(depFromDate) > new Date(depToDate)) {
            toast.warning("From Date cannot be greater than To Date");
            setDeptData([]);
            return;
        }

        const fetchDepartmentChart = async () => {
            setDeptLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/getInterviewDashboardCount`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            mode: "IDC",
                            company_code: sessionStorage.getItem("selectedCompanyCode"),
                            fromDate: depFromDate,
                            toDate: depToDate
                        })
                    }
                );

                const result = await response.json();

                const formattedData = result.map(item => ({
                    name: item.dept_name,
                    count: item.Selected_Count
                }));

                setDeptData(formattedData);

            } catch (error) {
                console.error("Department chart fetch error:", error);
                setDeptData([]);
            } finally {
                setDeptLoading(false);
            }
        };
        fetchDepartmentChart();
    }, [depFromDate, depToDate]);

    useEffect(() => {
        if (!panFromDate || !panToDate) {
            return; 
        }

        if (new Date(panFromDate) > new Date(panToDate)) {
            toast.warning("From Date cannot be greater than To Date");
            setPanelData([]);
            return;
        }

        const fetchDepartmentChart = async () => {
            setPanLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/getInterviewDashboardCount`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            mode: "IPC",
                            company_code: sessionStorage.getItem("selectedCompanyCode"),
                            fromDate: panFromDate,
                            toDate: panToDate
                        })
                    }
                );

                const result = await response.json();

                const formattedData = result.map(item => ({
                    name: item.panel_name,
                    count: item.Selected_Count
                }));

                setPanelData(formattedData);

            } catch (error) {
                console.error("Department chart fetch error:", error);
                setPanelData([]);
            } finally {
                setPanLoading(false);
            }
        };
        fetchDepartmentChart();
    }, [panFromDate, panToDate]);

    return (
        <div className="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <header className="main-header-box header-flex" style={{ padding: '15px', marginBottom: '20px' }}>
                {/* <h1 className="page-title">Interview Analytics</h1> */}
                <h1 className="page-title">Interview Dashboard</h1>
            </header>

            <section className="stats-grid">
                {/* Total Candidates Card */}
                <div className="stat-card animate-entrance" style={{ animationDelay: '0.1s' }}>
                    <div className="icon-box navy-icon icon-animated">
                        <Users size={28} strokeWidth={2.5} />
                    </div>
                    <div className="stat-info">
                        <p>Total Candidates</p>
                        {loading ? <div className="skeleton-loader"></div> : <h3>{dashboardCount.Total_Candidate}</h3>}
                    </div>
                    {/* Decorative background shape */}
                    <div className="card-decoration"></div>
                </div>

                {/* Total Selected Candidates Card */}
                <div className="stat-card animate-entrance" style={{ animationDelay: '0.2s' }}>
                    <div className="icon-box success-icon icon-animated">
                        <UserCheck size={28} strokeWidth={2.5} />
                    </div>
                    <div className="stat-info">
                        <p>Total Selected</p>
                        {loading ? <div className="skeleton-loader"></div> : <h3>{dashboardCount.Selected_Candidate}</h3>}
                    </div>
                    <div className="card-decoration"></div>
                </div>

                {/* Total Interview Panels Card */}
                <div className="stat-card animate-entrance" style={{ animationDelay: '0.3s' }}>
                    <div className="icon-box blue-icon icon-animated">
                        <Layout size={28} strokeWidth={2.5} />
                    </div>
                    <div className="stat-info">
                        <p>Interview Panels</p>
                        {loading ? <div className="skeleton-loader"></div> : <h3>{dashboardCount.Total_Interview_Panel}</h3>}
                    </div>
                    <div className="card-decoration"></div>
                </div>
            </section>

            <section className="charts-grid">
                {/* 1. Interview Feedback Summary (Now Vertical Bar Chart) */}
                <div className="hcm-chart-container">
                    <div className="chart-header mobile-stack">
                        <div className="header-text">
                            <h2>Interview Panel-wise Candidate Count</h2>
                            <p>Candidate recommendations within date range</p>
                        </div>
                        <div className="filter-container mobile-filter">
                            <div className="filter-group">
                                <label>From Date</label>
                                <input type="date" className="input-bg" value={panFromDate} onChange={(e) => setPanFromDate(e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>To Date</label>
                                <input type="date" className="input-bg" value={panToDate} onChange={(e) => setPanToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={panelData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0F5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} fontSize={12}/>
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F4F7F9' }} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--sidenav-hover)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Department-wise Candidate Count (Now Vertical Bar Chart) */}
                <div className="hcm-chart-container">
                    <div className="chart-header mobile-stack">
                        <div className="header-text">
                            <h2>Department-wise Candidate Count</h2>
                            <p>Candidate recommendations within date range</p>
                        </div>
                        <div className="filter-container mobile-filter">
                            <div className="filter-group">
                                <label>From Date</label>
                                <input type="date" className="input-bg" value={depFromDate} onChange={(e) => setDepFromDate(e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>To Date</label>
                                <input type="date" className="input-bg" value={depToDate} onChange={(e) => setDepToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0F5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F4F7F9' }} />
                                <Bar
                                    dataKey="count"
                                    fill="var(--sidenav-hover)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InterviewDashboard;