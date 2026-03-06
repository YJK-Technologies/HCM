import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select';
import Loading from "../Loading";
import config from '../Apiconfig';

function GenerateShift({ }) {
    const [employeeID, setEmployeeID] = useState('');
    const [selectedDpt, setSelectedDpt] = useState("");
    const [designation, setDesignation] = useState("");
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [department, setDepartment] = useState("");
    const [selectedDsg, setSelectedDsg] = useState('');
    const [selectedEmp, setSelectedEmp] = useState('');
    const [empDrop, setEmpDrop] = useState([]);
    const [DptDrop, setDptDrop] = useState([]);
    const [dynamicOptions, setDynamicOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSelectedEmp, setIsSelectedEmp] = useState(false);
    const [isSelectDepartment, setIsSelectDepartment] = useState(false);
    const [isSelectDesignation, setIsSelectDesignation] = useState(false);

    const company_code = sessionStorage.getItem('selectedCompanyCode')

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        const fetchDept = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getDept`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ company_code }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const val = await response.json();
                setDptDrop(val);

                // const defaultOption = { value: 'All', label: 'All' };
                // setSelectedDpt(defaultOption);
                // setDepartment(defaultOption.value);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        if (company_code) {
            fetchDept();
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getEmployeeId`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') })
                });

                const val = await response.json();
                setEmpDrop(val);

                // const defaultOption = { value: 'All', label: 'All' };
                // setSelectedEmp(defaultOption);
                // setEmployeeID(defaultOption.value);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const filteredOptionDpt = [
        { value: 'All', label: 'All' },
        ...(Array.isArray(DptDrop)
            ? DptDrop.map((option) => ({
                value: option.Department,
                label: option.Department,
            }))
            : [])
    ];

    const handleChangeDpt = (selectedDpt) => {
        setSelectedDpt(selectedDpt);
        setDepartment(selectedDpt ? selectedDpt.value : '');
        fetchDesignation(selectedDpt ? selectedDpt.value : '');
        // const defaultOption = { value: 'All', label: 'All' };
        // setSelectedDsg(defaultOption);
        // setDesignation(defaultOption.value);
    };

    const handleChangedesgination = (selecteddesg) => {
        setSelectedDsg(selecteddesg ? selecteddesg.value : '');
        setDesignation(selecteddesg);
    };

    const fetchDesignation = async (selectedValue) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dept_id: selectedValue, company_code }),
            });

            const data = await response.json();
            const formattedData = [
                { value: 'All', label: 'All' },
                ...data.map((product) => ({
                    value: product.Desgination,
                    label: product.Desgination,
                }))
            ];

            setDynamicOptions(formattedData);
            return formattedData;
        } catch (error) {
            console.error('Error fetching product codes:', error);
            return [];
        }
    };

    const reloadGridData = () => {
        window.location.reload();
    };

    const filteredOptionEmp = [{ value: 'All', label: 'All' },
    ...(Array.isArray(empDrop) ? empDrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId} - ${option.First_Name}`,
    }))
        : [])
    ];

    const handleChangeEmp = (selectedUser) => {
        setSelectedEmp(selectedUser);
        setEmployeeID(selectedUser ? selectedUser.value : '');
    };

    const handleGenerateShift = async () => {
        if (!fromDate || !toDate) {
            toast.warning("Error: Missing required fields");
            setError(" ");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            toast.warning("From Date cannot be greater than To Date");
            return;
        }

        if ((!department) && (!employeeID)) {
            toast.warning("Please select at least Department or Employee");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/getGenerateShift`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        department_ID: department,
                        designation_ID: designation,
                        Employee_ID: employeeID,
                        From_Date: fromDate,
                        To_Date: toDate,
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                        created_by: sessionStorage.getItem("selectedUserCode"),
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Shift Generated & Email Sent", {
                    onClose: () => window.location.reload(),
                });
            } else {
                toast.warning(data.message || "Insert failed");
            }
        } catch (error) {
            console.error("Error inserting timezone:", error);
            toast.error("Server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div class="container-fluid Topnav-screen ">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            {isLoading && <Loading />}

            <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Generate Shift</h1>
                    <div className="action-wrapper desktop-actions">
                        <div className="action-icon print" onClick={reloadGridData}>
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedDpt ? "has-value" : ""} 
                            ${isSelectDepartment ? "is-focused" : ""}`}
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectDepartment(true)}
                                onBlur={() => setIsSelectDepartment(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedDpt}
                                onChange={handleChangeDpt}
                                options={filteredOptionDpt}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label ${error && !department ? 'text-danger' : ''}`}>
                                Department<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedDsg ? "has-value" : ""} 
                            ${isSelectDesignation ? "is-focused" : ""}`}
                        >
                            <Select
                                id="designation"
                                placeholder=" "
                                onFocus={() => setIsSelectDesignation(true)}
                                onBlur={() => setIsSelectDesignation(false)}
                                classNamePrefix="react-select"
                                isClearable
                                name="designation_ID"
                                value={selectedDsg}
                                options={dynamicOptions}
                                onChange={handleChangedesgination}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label`}>
                                Designation
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmp ? "has-value" : ""} 
                            ${isSelectedEmp ? "is-focused" : ""}`}
                        >
                            <Select
                                id="cno"
                                type="text"
                                isClearable
                                classNamePrefix="react-select"
                                placeholder=" "
                                onFocus={() => setIsSelectedEmp(true)}
                                onBlur={() => setIsSelectedEmp(false)}
                                required
                                title="Please enter the employee id"
                                onChange={handleChangeEmp}
                                value={selectedEmp}
                                options={filteredOptionEmp}
                            />
                            <label for="state" className={`floating-label ${error && !employeeID ? 'text-danger' : ''}`}>
                                Employee ID<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="SalaryDate"
                                className="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please Enter the Salary Month"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <label htmlFor="SalaryDate" className={`${error && !fromDate ? 'text-danger' : ''}`}>From Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="SalaryDate"
                                className="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required
                                title="Please Enter the Salary Month"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                            <label htmlFor="SalaryDate" className={`${error && !toDate ? 'text-danger' : ''}`}>To Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div class="me-2">
                            <div class=" d-flex justify-content-start">
                                <button className="Documents-btn mt-2" title="Generate Payslip" onClick={handleGenerateShift}>
                                    <span class="folderContainer">
                                        <svg
                                            class="fileBack"
                                            width="146"
                                            height="113"
                                            viewBox="0 0 146 113"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                                                fill="url(#paint0_linear_117_4)"
                                            ></path>
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_117_4"
                                                    x1="0"
                                                    y1="0"
                                                    x2="72.93"
                                                    y2="95.4804"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stop-color="#8F88C2"></stop>
                                                    <stop offset="1" stop-color="#5C52A2"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <svg
                                            class="filePage"
                                            width="88"
                                            height="99"
                                            viewBox="0 0 88 99"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect width="88" height="99" fill="url(#paint0_linear_117_6)"></rect>
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_117_6"
                                                    x1="0"
                                                    y1="0"
                                                    x2="81"
                                                    y2="160.5"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stop-color="white"></stop>
                                                    <stop offset="1" stop-color="#686868"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <svg
                                            class="fileFront"
                                            width="160"
                                            height="79"
                                            viewBox="0 0 160 79"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                                                fill="url(#paint0_linear_117_5)"
                                            ></path>
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_117_5"
                                                    x1="38.7619"
                                                    y1="8.71323"
                                                    x2="66.9106"
                                                    y2="82.8317"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stop-color="#C3BBFF"></stop>
                                                    <stop offset="1" stop-color="#51469A"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default GenerateShift;