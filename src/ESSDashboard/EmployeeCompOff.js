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
            let formattedDate = "";

            if (work_date) {
                const parts = work_date.split("-");
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }

            setHolidayDate(formattedDate || "");
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

    const [leaveRowData, setLeaveRowData] = useState([]);
    const [statusDropSc, setStatusDropSc] = useState([]);
    const [selectedStatusSc, setselectedStatusSc] = useState("");
    const [FromDateSc, setFromDateSc] = useState("");
    const [ToDateSc, setToDateSc] = useState("");
    const [LeaveStatusSc, setLeaveStatusSc] = useState("");
    const [isSearchStatusSc, setIsSearchStatusSc] = useState(false);

    const CancelActionRenderer = (params) => {
        const { data } = params;

        const handleCancel = async () => {
            if (data.LeaveStatus === 'Cancelled') return;

            showConfirmationToast("Are you sure you want to cancel this leave request?",
                async () => {

                    try {
                        const response = await fetch(`${config.apiBaseUrl}/LeaveCancellation`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                EmployeeId: sessionStorage.getItem('selectedUserCode'),
                                LeaveStatus: "Cancelled",
                                FromDate: data.FromDate,
                            }),
                        });

                        const result = await response.json();
                        if (response.ok) {
                            toast.success("Leave request cancelled successfully!");
                            await handleSearchItem();
                        } else {
                            console.error(result.message);
                            toast.warning(result.message || "Failed to cancel leave");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('Error: ' + err.message);
                    }
                },
                () => {
                    toast.info("Data updated cancelled.");
                }
            );
        };

        const isCancelled = data.LeaveStatus === 'Cancelled';

        return (
            <div className="action-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <button
                    onClick={handleCancel}
                    disabled={isCancelled}
                    className={`icon-cancel-btn ${isCancelled ? 'disabled' : ''}`}
                >
                    <XCircle size={18} strokeWidth={2.5} />
                </button>
            </div>
        );
    };

    const leaveColumnDefs = [
        {
            headerName: "From Date",
            field: "FromDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "To Date",
            field: "ToDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Leave Status",
            field: "LeaveStatus",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Action",
            field: "action",
            width: 100,
            cellStyle: { textAlign: "center" },
            sortable: false,
            filter: false,
            cellRenderer: CancelActionRenderer,
            tooltipValueGetter: (params) => {
                return params.data.LeaveStatus === 'Cancelled'
                    ? "This request has already been cancelled."
                    : "Click to cancel this leave request.";
            }
        },
    ];

    const handleSearchItem = async () => {
        const from = new Date(FromDateSc);
        const to = new Date(ToDateSc);

        if (from > to) {
            toast.warning("From Date should not be greater than To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/getEmployeeLeavesearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    EmployeeId: sessionStorage.getItem('selectedUserCode'),
                    FromDate: FromDateSc,
                    ToDate: ToDateSc,
                    LeaveStatus: LeaveStatusSc,
                })
            });
            if (response.ok) {
                const searchData = await response.json();
                setLeaveRowData(searchData);
                console.log("data fetched successfully")
            } else if (response.status === 404) {
                setLeaveRowData([]);
                toast.warning("Data not found")
                console.log("Data not found");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {
                })
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReload = () => {
        clearInputs([])
        setLeaveRowData([])
    };

    const clearInputs = () => {
        setFromDateSc('');
        setToDateSc('');
        setLeaveStatusSc('');
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => setStatusDropSc(val))
    }, []);

    const filterOptionStatusSc = [{ value: 'All', label: 'All' }, ...statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }))];

    const handleChangeStatusSc = (SelectedStatus) => {
        setselectedStatusSc(SelectedStatus);
        setLeaveStatusSc(SelectedStatus ? SelectedStatus.value : '');
    };

    const handleConfirm = () => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        if (selectedRows.length === 0) {
            toast.warning("Please select a row to load data");
            return;
        }

        const row = selectedRows[0];

        setLeaveStatusSc(row.LeaveStatus || "");
    };

    const defaultColDef = {
        resizable: true,
        wrapText: true,
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
                        {(LeaveStatusSc === "Pending" || LeaveStatusSc === "Rejected" || LeaveStatusSc === "") && (
                            <div className="search-btn-wrapper">
                                <div className="icon-btn save" onClick={handleSave}>
                                    <span className="tooltip">Apply</span>
                                    <i class="fa-solid fa-floppy-disk"></i>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <h5>Search Criteria :</h5>

                <div className="row g-3">

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={FromDateSc}
                                placeholder=" "
                                autoComplete="off"
                                onChange={(e) => setFromDateSc(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                            <label className="exp-form-labels">From Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={ToDateSc}
                                placeholder=" "
                                autoComplete="off"
                                onChange={(e) => setToDateSc(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                            <label className="exp-form-labels">To Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedStatusSc ? "has-value" : ""} 
                            ${isSearchStatusSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="Select_slots"
                                value={selectedStatusSc}
                                onChange={handleChangeStatusSc}
                                options={filterOptionStatusSc}
                                placeholder=" "
                                onFocus={() => setIsSearchStatusSc(true)}
                                onBlur={() => setIsSearchStatusSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                            <label className="floating-label">Leave Status</label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="search-btn-wrapper">
                            <div className="icon-btn search" onClick={handleSearchItem}>
                                <span className="tooltip">Search</span>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            <div className="icon-btn reload" onClick={handleReload}>
                                <span className="tooltip">Reload</span>
                                <i className="fa-solid fa-rotate-right"></i>
                            </div>

                            <div className="icon-btn save" onClick={handleConfirm}>
                                <span className="tooltip">Confirm</span>
                                <i className="fa-solid fa-check"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                                rowData={leaveRowData}
                                columnDefs={leaveColumnDefs}
                                defaultColDef={defaultColDef}
                                rowSelection="single"
                                ref={gridRef}
                            />
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default EmployeeCompOff;