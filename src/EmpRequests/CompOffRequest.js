import { useState, useEffect, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LoadingScreen from '../Loading';
import { format } from 'date-fns';
import { XCircle } from 'lucide-react';
import { showConfirmationToast } from '../ToastConfirmation';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
const config = require('../Apiconfig');

const EmployeeCompOff = () => {
    const [FromDate, setFromDate] = useState("");
    const [ToDate, setToDate] = useState("");
    const [Reason, setReason] = useState("");
    const [AlternativeReponsablePerson, setReasponsiblePerson] = useState("");
    const [error, setError] = useState(false);
    const [Managerdrop, setManagerdrop] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
    const [ReportingManager, setReportingManager] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSelectManager, setIsSelectManager] = useState(false);
    const [compOffDrop, setCompOffDrop] = useState([]);
    const [selectedCompOff, setSelectedCompOff] = useState('');
    const [compOff, setCompOff] = useState("");
    const [isSelectedCompOff, setIsSelectedCompOff] = useState(false);

    const [leaveRowData, setLeaveRowData] = useState([]);
    const [holidayFromDate, setHolidayFromDate] = useState("");
    const [holidayToDate, setHolidayToDate] = useState("");
    const [holidayName, setHolidayName] = useState("");
    const [statusDropSc, setstatusDropSc] = useState([]);
    const [statusSc, setStatusSc] = useState("");
    const [selectedStatusSc, setSelectedStatusSc] = useState("");
    const [isSelectedStatusSc, setIsSelectedStatusSc] = useState(false);
    const gridRef = useRef()

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

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/EmpCompOffList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                userid: sessionStorage.getItem("selectedUserCode"),
            }),
        })
            .then((response) => response.json())
            .then(setCompOffDrop)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

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
            .then((val) => setstatusDropSc(val))
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

    const formatToBackendDate = (date) => {
        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !compOff ||
            !Reason ||
            !ReportingManager) {
            setError(true);
            toast.warning("Error: Missing required fields");
            return;
        }

        const formData = {
            HolidayDate: formatToBackendDate(compOff),
            HolidayName: selectedCompOff ? selectedCompOff.holidayName : '',
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

    const filteredOptionCopmOff = compOffDrop.map((option) => ({
        value: option.Holiday_Date,
        // label: option.Holiday_Name,
        label: `${option.Holiday_Date} - ${option.Holiday_Name}`,
        holidayName: option.Holiday_Name
    }));

    const handleChangeCompOff = (selectedCompOff) => {
        setSelectedCompOff(selectedCompOff);
        setCompOff(selectedCompOff ? selectedCompOff.value : '');
    };

    const filteredOptionManager = Managerdrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.full_name}`,
    }));

    const handleChangeManager = (selectedOption) => {
        setSelectedManager(selectedOption);
        setReportingManager(selectedOption ? selectedOption.value : '');
    };

    const filterOptionStatusSc = [{ value: 'All', label: 'All' }, ...statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }))];

    const handleChangeStatusSc = (SelectedStatusSc) => {
        setSelectedStatusSc(SelectedStatusSc);
        setStatusSc(SelectedStatusSc ? SelectedStatusSc.value : '');
    };

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
                            // await handleSearchItem();
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
            headerName: "Holiday Date",
            field: "HolidayDate",
            editable: false,
            cellStyle: { textAlign: "center" },
            valueFormatter: params => {
                if (!params.value) return "";
                return format(new Date(params.value), 'yyyy-MM-dd');
            }
        },
        {
            headerName: "Holiday Name",
            field: "HolidayName",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "From Date",
            field: "LeaveFromDate",
            editable: false,
            cellStyle: { textAlign: "center" },
            valueFormatter: params => {
                if (!params.value) return "";
                return format(new Date(params.value), 'yyyy-MM-dd');
            }
        },
        {
            headerName: "To Date",
            field: "LeaveToDate",
            editable: false,
            cellStyle: { textAlign: "center" },
            valueFormatter: params => {
                if (!params.value) return "";
                return format(new Date(params.value), 'yyyy-MM-dd');
            }
        },
        {
            headerName: "Status",
            field: "Status",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        // {
        //     headerName: "Action",
        //     field: "action",
        //     width: 160,
        //     cellStyle: { textAlign: "center" },
        //     sortable: false,
        //     filter: false,
        //     cellRenderer: (params) => {
        //         const row = params.data;

        //         if (row.LeaveStatus !== "Cancelled") {
        //             return <CancelActionRenderer {...params} />;
        //         }

        //         return null;
        //     },
        //     tooltipValueGetter: (params) => {
        //         return params.data.LeaveStatus === 'Cancelled'
        //             ? "This request has already been cancelled."
        //             : "Click to cancel this leave request.";
        //     }
        // },
    ];

    const defaultColDef = {
        resizable: true,
        wrapText: true,
    };

    const handleCompOffSearch = async () => {
        const from = new Date(holidayFromDate);
        const to = new Date(holidayToDate);

        if (from > to) {
            toast.warning("From Date should not be greater than To Date");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/compOffSearchCriteria`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CompanyCode: sessionStorage.getItem('selectedCompanyCode'),
                    EmployeeId: sessionStorage.getItem('selectedUserCode'),
                    FromDate: holidayFromDate,
                    ToDate: holidayToDate,
                    Status: statusSc,
                    HolidayName: holidayName,
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

    const handleReloadSearch = () => {
        clearInputsSearch([])
        setLeaveRowData([])
    };

    const clearInputsSearch = () => {
        setHolidayFromDate('');
        setHolidayToDate('');
        setHolidayName('');
        setStatusSc('');
        setSelectedStatusSc('');
    };

    const handleReloadAdd = () => {
        clearInputsAdd([]);
    };

    const clearInputsAdd = () => {
        setFromDate('');
        setToDate('');
        setReason('');
        setReasponsiblePerson('');
        setSelectedManager('');
        setReportingManager('');
        setSelectedCompOff('');
        setCompOff('');
    };

    return (
        <div className="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Comp Off Request</h1>
                    <div className="action-wrapper desktop-actions">
                        <div className="action-icon reload" onClick={handleReloadAdd}>
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-rotate-right"></i>
                        </div>
                        <div className="action-icon save" onClick={handleSave}>
                            <span className="tooltip">Save</span>
                            <i class="fa-solid fa-floppy-disk"></i>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <LoadingScreen />}
            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <div className="row g-3">

                    {/* <div className="col-md-3">
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
                    </div> */}

                    <div className="col-md-3">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCompOff ? "has-value" : ""} 
                            ${isSelectedCompOff ? "is-focused" : ""}`}
                        >
                            <Select
                                value={selectedCompOff}
                                options={filteredOptionCopmOff}
                                onChange={handleChangeCompOff}
                                placeholder=" "
                                onFocus={() => setIsSelectedCompOff(true)}
                                onBlur={() => setIsSelectedCompOff(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className={`floating-label ${error && !compOff ? 'text-danger' : ''}`}>
                                Comp Off Leaves<span className="text-danger">*</span>
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
                            ${selectedManager ? "has-value" : ""} 
                            ${isSelectManager ? "is-focused" : ""}`}
                        >
                            <Select
                                value={selectedManager}
                                options={filteredOptionManager}
                                onChange={handleChangeManager}
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

                    {/* <div class="col-12">
                        <div className="search-btn-wrapper">
                            <div className="icon-btn save" onClick={handleSave}>
                                <span className="tooltip">Apply</span>
                                <i class="fa-solid fa-floppy-disk"></i>
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>

            <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                <h5>Search Criteria :</h5>

                <div className="row g-3">
                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={holidayFromDate}
                                onChange={(e) => setHolidayFromDate(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                Holiday From Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="date"
                                className="exp-input-field form-control"
                                value={holidayToDate}
                                onChange={(e) => setHolidayToDate(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                Holiday To Date
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                type="text"
                                className="exp-input-field form-control"
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                                placeholder=" "
                                autoComplete="off"
                            />
                            <label className={`exp-form-labels`}>
                                Holiday Name
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedStatusSc ? "has-value" : ""} 
                            ${isSelectedStatusSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="Select_slots"
                                value={selectedStatusSc}
                                onChange={handleChangeStatusSc}
                                options={filterOptionStatusSc}
                                placeholder=" "
                                onFocus={() => setIsSelectedStatusSc(true)}
                                onBlur={() => setIsSelectedStatusSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                            />
                            <label className="floating-label">Leave Status</label>
                        </div>
                    </div>

                    <div className="search-btn-wrapper">
                        <div className="icon-btn search" onClick={handleCompOffSearch}>
                            <span className="tooltip">Search</span>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>

                        <div className="icon-btn reload" onClick={handleReloadSearch}>
                            <span className="tooltip">Reload</span>
                            <i className="fa-solid fa-rotate-right"></i>
                        </div>
                    </div>

                    <div className="col-12 mt-2">
                        <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
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
            </div>
        </div>
    );
};

export default EmployeeCompOff;