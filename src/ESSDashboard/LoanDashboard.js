import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import "./Dashboard.css";
import config from '../Apiconfig';
import { ToastContainer, toast } from 'react-toastify';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

const validateDateRange = (from, to) => {

    if (!from && !to) return true;

    if (!from || !to) {
        toast.warning("Please select both From and To dates");
        return false;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) {
        toast.warning("From Date should not be greater than To Date");
        return false;
    }

    return true;
};

const LoanDashboard = () => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const { startDate, endDate } = getCurrentMonthRange();
    const [loanTypeData, setLoanTypeData] = useState([]);
    const [deptData, setDeptData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [riskData, setRiskData] = useState([]);
    const [LDFromDate, setLDFromDate] = useState(startDate);
    const [LDToDate, setLDToDate] = useState(endDate);
    const [DAFromDate, setDAFromDate] = useState(startDate);
    const [DAToDate, setDAToDate] = useState(endDate);
    const [ARFromDate, setARFromDate] = useState(startDate);
    const [ARToDate, setARToDate] = useState(endDate);
    const [RAFromDate, setRAFromDate] = useState(startDate);
    const [RAToDate, setRAToDate] = useState(endDate);

    const fetchLoanType = async () => {

        if (!validateDateRange(LDFromDate, LDToDate)) return;

        try {
            const res = await fetch(`${config.apiBaseUrl}/LoanTypeDistribution`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_code,
                    from_date: LDFromDate,
                    to_date: LDToDate
                })
            });

            if (res.status === 404) {
                setLoanTypeData([]);
                return;
            }

            const data = await res.json();

            const formatted = data.map(item => ({
                name: item.Loan_Type_Name,
                value: item.Total_Loans
            }));

            setLoanTypeData(formatted);
        } catch (err) {
            console.error(err);
            setLoanTypeData([]);
        }
    };

    const fetchDept = async () => {

        if (!validateDateRange(DAFromDate, DAToDate)) return;

        try {
            const res = await fetch(`${config.apiBaseUrl}/DepartmentLoanAmount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_code,
                    from_date: DAFromDate,
                    to_date: DAToDate
                })
            });

            if (res.status === 404) {
                setDeptData([]);
                return;
            }

            const data = await res.json();

            const formatted = data.map(item => ({
                name: item.Department,
                value: item.Total_Loan_Amount
            }));

            setDeptData(formatted);
        } catch (err) {
            console.error(err);
            setDeptData([]);
        }
    };

    const fetchTrend = async () => {

        if (!validateDateRange(ARFromDate, ARToDate)) return;

        try {

            const res = await fetch(`${config.apiBaseUrl}/LoanStatusTrend`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_code,
                    from_date: ARFromDate,
                    to_date: ARToDate
                })
            });

            if (res.status === 404) {
                setTrendData([]);
                return;
            }

            const data = await res.json();

            const grouped = {};

            data.forEach(item => {
                if (!grouped[item.Month]) {
                    grouped[item.Month] = { month: item.Month };
                }

                grouped[item.Month][item.request_status.toLowerCase()] = item.Total_Count;
            });

            setTrendData(Object.values(grouped));
        } catch (err) {
            console.error(err);
            setTrendData([]);
        }
    };

    const fetchRisk = async () => {

        if (!validateDateRange(RAFromDate, RAToDate)) return;

        try {
            const res = await fetch(`${config.apiBaseUrl}/OverduevsPaid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_code,
                    from_date: RAFromDate,
                    to_date: RAToDate
                })
            });

            if (res.status === 404) {
                setRiskData([]);
                return;
            }

            const data = await res.json();

            let obj = { category: "Loans", paid: 0, overdue: 0, due: 0 };

            data.forEach(item => {
                if (item.Status === "Paid") obj.paid = item.Total_Amount;
                if (item.Status === "Overdue") obj.overdue = item.Total_Amount;
                if (item.Status === "Due") obj.due = item.Total_Amount;
            });

            setRiskData([obj]);
        } catch (err) {
            console.error(err);
            setRiskData([]);
        }
    };

    useEffect(() => {
        fetchLoanType();
    }, [LDFromDate, LDToDate]);

    useEffect(() => {
        fetchDept();
    }, [DAFromDate, DAToDate]);

    useEffect(() => {
        fetchTrend();
    }, [ARFromDate, ARToDate]);

    useEffect(() => {
        fetchRisk();
    }, [RAFromDate, RAToDate]);

    return (
        <div className="dashboard-container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />

            {/* Top Section */}
            <header className="shadow-lg p-1 bg-light rounded main-header-box loan-dashboard-header">
                <div className="header-flex">
                    <h1 className="page-title">Loan Dashboard</h1>
                </div>
            </header>

            {/* Grid: Left and Right Layout */}
            <main className="loan-visual-grid">

                {/* Card 1: Left Top */}
                <section className="loan-analytics-card">
                    <div className="loan-card-header">
                        <h3>Loan Type Distribution</h3>

                        <div className="loan-filter-pill">
                            <div className="filter-item">
                                <span className="filter-label">From</span>
                                <input type="date" className="filter-input" value={LDFromDate} onChange={(e) => setLDFromDate(e.target.value)} />
                            </div>
                            <div className="filter-separator"></div>
                            <div className="filter-item">
                                <span className="filter-label">To</span>
                                <input type="date" className="filter-input" value={LDToDate} onChange={(e) => setLDToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="loan-chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={loanTypeData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                    {loanTypeData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Card 2: Right Bottom */}
                <section className="loan-analytics-card">
                    <div className="loan-card-header">
                        <h3>Departmental Allocation</h3>

                        <div className="loan-filter-pill">
                            <div className="filter-item">
                                <span className="filter-label">From</span>
                                <input type="date" className="filter-input" value={DAFromDate} onChange={(e) => setDAFromDate(e.target.value)} />
                            </div>
                            <div className="filter-separator"></div>
                            <div className="filter-item">
                                <span className="filter-label">To</span>
                                <input type="date" className="filter-input" value={DAToDate} onChange={(e) => setDAToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="loan-chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={deptData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4f46e5" radius={[0, 10, 10, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>


                {/* Card 3: Right Top */}
                <section className="loan-analytics-card">
                    <div className="loan-card-header">
                        <h3>Approval vs Rejection Trend</h3>

                        <div className="loan-filter-pill">
                            <div className="filter-item">
                                <span className="filter-label">From</span>
                                <input type="date" className="filter-input" value={ARFromDate} onChange={(e) => setARFromDate(e.target.value)} />
                            </div>
                            <div className="filter-separator"></div>
                            <div className="filter-item">
                                <span className="filter-label">To</span>
                                <input type="date" className="filter-input" value={ARToDate} onChange={(e) => setARToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="loan-chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={3} />
                                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={3} />
                                <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Card 4: Left Bottom */}
                <section className="loan-analytics-card">
                    <div className="loan-card-header">
                        <h3>Risk Analysis: Overdue vs Paid</h3>

                        <div className="loan-filter-pill">
                            <div className="filter-item">
                                <span className="filter-label">From</span>
                                <input type="date" className="filter-input" value={RAFromDate} onChange={(e) => setRAFromDate(e.target.value)} />
                            </div>
                            <div className="filter-separator"></div>
                            <div className="filter-item">
                                <span className="filter-label">To</span>
                                <input type="date" className="filter-input" value={RAToDate} onChange={(e) => setRAToDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="loan-chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={riskData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />

                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend verticalAlign="top" align="right" iconType="circle" />

                                <Bar
                                    dataKey="paid"
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    name="Paid"
                                />
                                <Bar
                                    dataKey="overdue"
                                    fill="#ef4444"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    name="Overdue"
                                />
                                <Bar
                                    dataKey="due"
                                    fill="#f59e0b"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    name="Due"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default LoanDashboard;