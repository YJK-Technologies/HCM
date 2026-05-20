import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LoadingScreen from '../Loading';
import { XCircle } from 'lucide-react';
import { showConfirmationToast } from '../ToastConfirmation';
import { useLocation } from "react-router-dom";
const config = require('../Apiconfig');

const EmployeeCompOff = () => {
    const [FromDate, setFromDate] = useState("");
    const [HolidayDate, setHolidayDate] = useState("");
    const [HolidayName, setHolidayName] = useState("");
    const [ToDate, setToDate] = useState("");
    const [Reason, setReason] = useState("");
    const [AlternativeReponsablePerson, setReasponsiblePerson] = useState("");
    const [ReportingManager, setReportingManager] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [Managerdrop, setManagerdrop] = useState([]);
    const [selectedmanager, setselectedmanager] = useState('');
    const gridRef = useRef()
    const [loading, setLoading] = useState(false);
    const [isSelectManager, setIsSelectManager] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { work_date, holiday_name } = location.state;

            const formatDate = (date) => {
                if (!date) return "";

                // convert / to -
                date = date.replace(/\//g, "-");

                const d = new Date(date);

                // convert to yyyy-mm-dd for input type="date"
                return !isNaN(d) ? d.toISOString().split("T")[0] : "";
            };

            setHolidayDate(formatDate(work_date));
            setHolidayName(holiday_name || "");
        }
    }, [location.state]);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/ESSManager`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((response) => response.json())
            .then(setManagerdrop)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const handleFromDate = (e) => {
        const selectedDate = e.target.value;
        setFromDate(selectedDate);
        setToDate(selectedDate);
    };

    const handleToDateChange = (e) => {
        const selectedDate = e.target.value;

        if (FromDate && selectedDate !== FromDate) {
            toast.warning("Comp Off allows only single day");
            setToDate(FromDate);
            return;
        }
        setToDate(selectedDate);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !HolidayDate ||
            !HolidayName ||
            !Reason ||
            !ReportingManager) {
            setError(true);
            toast.warning("Error: Missing required fields");
            return;
        }

        const formData = {
            HolidayDate,
            HolidayName,
            LeaveFromDate: FromDate ? FromDate : null,
            LeaveToDate: ToDate ? ToDate : null,
            Reason,
            RepManager: ReportingManager,
            EmployeeId: sessionStorage.getItem("selectedUserCode"),
            CompanyCode: sessionStorage.getItem('selectedCompanyCode'),
            CreatedBy: sessionStorage.getItem("selectedUserCode"),
            ResPerson: AlternativeReponsablePerson,
        };
        setError(false);
        setLoading(true);
        try {

            const response = await fetch(`${config.apiBaseUrl}/compOffRequestInsert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Form Submitted Successfully", data);
                toast.success("Data inserted successfully!", {
                    onClose: () => window.location.reload(),
                });
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (err) {
            console.error("Error inserted data:", err);
            toast.error('Error inserted data: ' + err.message, {
            });
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate('/EmployeeDashboard');
    };

    const filteredOptionManager = Managerdrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.full_name}`,
    }));

    const handleChangemanager = (selectedOption) => {
        setselectedmanager(selectedOption);
        setReportingManager(selectedOption ? selectedOption.value : '');
    };

    return (
        <div className="container-fluid Topnav-screen">
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Employee Comp Off</h1>
                    <div className="action-wrapper">
                        <div className="action-icon delete" onClick={goBack}>
                            <span className="tooltip">Close</span>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

                    <div className="col-md-3">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={HolidayDate}
                                readOnly
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels ${error && !HolidayDate ? 'text-danger' : ''}`}>
                                Holiday Date<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="inputGroup">
                            <input
                                type="Text"
                                className="exp-input-field form-control"
                                value={HolidayName}
                                readOnly
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels ${error && !HolidayName ? 'text-danger' : ''}`}>
                                Holiday Name<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={FromDate}
                                onChange={handleFromDate}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                From Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={ToDate}
                                onChange={handleToDateChange}
                                disabled
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                To Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="inputGroup">
                            <textarea
                                className="form-control"
                                value={Reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="3"
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels ${error && !Reason ? 'text-danger' : ''}`}>
                                Reason<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedmanager ? "has-value" : ""} 
                            ${isSelectManager ? "is-focused" : ""}`}
                        >
                            <Select
                                value={selectedmanager}
                                options={filteredOptionManager}
                                onChange={handleChangemanager}
                                placeholder=" "
                                onFocus={() => setIsSelectManager(true)}
                                onBlur={() => setIsSelectManager(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className={`floating-label ${error && !ReportingManager ? 'text-danger' : ''}`}>
                                Reporting Manager<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="inputGroup">
                            <input
                                type="text"
                                className="exp-input-field form-control"
                                value={AlternativeReponsablePerson}
                                onChange={(e) => setReasponsiblePerson(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                Responsible Person
                            </label>
                        </div>
                    </div>

                    <div class="col-12">
                        <div className="search-btn-wrapper">
                            <div className="icon-btn save" onClick={handleSave}>
                                <span className="tooltip">Apply</span>
                                <i class="fa-solid fa-floppy-disk"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployeeCompOff;