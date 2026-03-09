import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";

const config = require("../Apiconfig");

function LoanStatusHistory() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [editedData, setEditedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [timeZoneName, setTimeZoneName] = useState('');
    const [utcOffset, setUtcOffset] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusDrop, setStatusDrop] = useState([]);
    const [dstApplicable, setDstApplicable] = useState('');
    const [selectedDstApplicable, setSelectedDstApplicable] = useState('');
    const [dstApplicableDrop, setDstApplicableDrop] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [dstApplicableDropGrid, setDstApplicableDropGrid] = useState([]);

    const [timeZoneIdSc, setTimeZoneIdSc] = useState('');
    const [timeZoneNameSc, setTimeZoneNameSc] = useState('');
    const [utcOffsetSc, setUtcOffsetSc] = useState('');
    const [statusSc, setStatusSc] = useState('');
    const [selectedStatusSc, setSelectedStatusSc] = useState('');
    const [statusDropSc, setStatusDropSc] = useState([]);
    const [dstApplicableSc, setDstApplicableSc] = useState('');
    const [selectedDstApplicableSc, setSelectedDstApplicableSc] = useState('');
    const [dstApplicableDropSc, setDstApplicableDropSc] = useState([]);

    const [isSelectedStatus, setIsSelectedStatus] = useState('');
    const [isSelectedDstApplicable, setIsSelectedDstApplicable] = useState('');
    const [isSelectedStatusSc, setIsSelectedStatusSc] = useState('');
    const [isSelectedDstApplicableSc, setIsSelectedDstApplicableSc] = useState('');

    //code added by Harish purpose of set user permisssion
    const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
    const LoanStatusHistoryPermission = permissions
        .filter((permission) => permission.screen_type === "LoanStatusHistory")
        .map((permission) => permission.permission_type.toLowerCase());

    const addClearInputFields = () => {
        setTimeZoneName("");
        setUtcOffset("");
        setStatus("");
        setSelectedStatus("");
        setDstApplicable("");
        setSelectedDstApplicable("");
    };

    const searchClearInputFields = () => {
        setTimeZoneIdSc("");
        setTimeZoneNameSc("");
        setUtcOffsetSc("");
        setStatusSc("");
        setSelectedStatusSc("");
        setDstApplicableSc("");
        setSelectedDstApplicableSc("");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setStatusDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setStatusDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const statusOption = data.map((option) => option.attributedetails_name);
                setStatusDropGrid(statusOption);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getBool`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setDstApplicableDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getBool`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setDstApplicableDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getBool`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const statusOption = data.map(
                    (option) => Number(option.attributedetails_name)
                );
                setDstApplicableDropGrid(statusOption);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionStatusSc = statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionDstApplicable = dstApplicableDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionDstApplicableSc = dstApplicableDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    const handleChangeStatusSc = (selectedStatusSc) => {
        setSelectedStatusSc(selectedStatusSc);
        setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
    };

    const handleChangeDstApplicable = (selectedDstApplicable) => {
        setSelectedDstApplicable(selectedDstApplicable);
        setDstApplicable(selectedDstApplicable ? selectedDstApplicable.value : "");
    };

    const handleChangeDstApplicableSc = (selectedDstApplicableSc) => {
        setSelectedDstApplicableSc(selectedDstApplicableSc);
        setDstApplicableSc(selectedDstApplicableSc ? selectedDstApplicableSc.value : "");
    };

    const handleSearch = async () => {
        setLoading(true);

        try {
            const company_code = sessionStorage.getItem("selectedCompanyCode");

            const response = await fetch(`${config.apiBaseUrl}/getTimeZonesearchdata`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    TimeZone_ID: timeZoneIdSc ? timeZoneIdSc : null,
                    TimeZone_Name: timeZoneNameSc,
                    UTC_Offset: utcOffsetSc,
                    DST_Applicable: dstApplicableSc ? dstApplicableSc : null,
                    Status: statusSc,
                    company_code,
                }),
            });

            if (response.ok) {
                const searchData = await response.json();
                setRowData(searchData);
                console.log("data fetched successfully");
            } else if (response.status === 404) {
                toast.warning("Data not found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Search failed");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridData = () => {
        setRowData([]);
        searchClearInputFields();
    };

    const columnDefs = [
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params) => {
                const cellWidth = params.column.getActualWidth();
                const isWideEnough = cellWidth > 20;
                const showIcons = isWideEnough;

                return (
                    <div
                        className="position-relative d-flex align-items-center"
                        style={{ minHeight: "100%", justifyContent: "center" }}
                    >
                        {showIcons && (
                            <>
                                <span
                                    className="icon mx-2"
                                    onClick={() => handleUpdate(params.data, params.node.data)}
                                    title="Update"
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => handleDelete(params.data)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </span>
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            headerName: "Time Zone ID",
            field: "TimeZone_ID",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Time Zone Name",
            field: "TimeZone_Name",
            editable: true,
        },
        {
            headerName: "UTC Offset",
            field: "UTC_Offset",
            editable: true,
        },
        {
            headerName: "DST Applicable",
            field: "DST_Applicable",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: dstApplicableDropGrid,
            },
        },
        {
            headerName: "Status",
            field: "Status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
        {
            headerName: "keyfield",
            field: "keyfield",
            editable: true,
            filter: true,
            hide: true,
            sortable: false,
        },
    ];

    const defaultColDef = {
        resizable: true,
        wrapText: true,
        editable: true,
    };

    const tabs = [
        { label: "Shift Master" },
        { label: "Shift Type Master" },
        { label: "Shift Pattern Master" },
        { label: "Shift Pattern Details" },
        { label: "Employment Type Master" },
        { label: "Employee Shift Mapping" },
    ];

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const onCellValueChanged = (params) => {
        const updatedRowData = [...rowData];
        const rowIndex = updatedRowData.findIndex(
            (row) => row.keyfield === params.data.keyfield,
        );

        if (rowIndex !== -1) {
            updatedRowData[rowIndex][params.colDef.field] = params.newValue;
            setRowData(updatedRowData);

            setEditedData((prevData) => {
                const existingIndex = prevData.findIndex(
                    (item) => item.keyfield === params.data.keyfield,
                );

                if (existingIndex !== -1) {
                    const updatedEdited = [...prevData];
                    updatedEdited[existingIndex] = updatedRowData[rowIndex];
                    return updatedEdited;
                } else {
                    // Add new edited row
                    return [...prevData, updatedRowData[rowIndex]];
                }
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return ""; // Return 'N/A' if the date is missing
        const date = new Date(dateString);

        // Format as DD/MM/YYYY
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    const handleSave = async () => {
        if (!timeZoneName || !utcOffset || !status) {
            toast.warning("Missing Required Fields");
            setError(true);
            return;
        }
        setLoading(false);
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/TimeZonemasterInsert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        TimeZone_Name: timeZoneName,
                        UTC_Offset: utcOffset,
                        Status: status,
                        DST_Applicable: dstApplicable,
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                        created_by: sessionStorage.getItem("selectedUserCode"),
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Data inserted successfully", {
                    onClose: () => {
                        addClearInputFields();
                        setError(false)
                    }
                });
            } else {
                toast.warning(data.message || "Insert failed");
            }
        } catch (error) {
            console.error("Error inserting timezone:", error);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to update the selected time zone master data?",
            async () => {
                setLoading(true);
                try {
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        Time_Zone_masterData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/Time_Zone_masterLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Time zone master updated successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Update failed");
                    }
                } catch (error) {
                    console.error("Update error:", error);
                    toast.error("Error updating data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => toast.info("Update cancelled"),
        );
    };

    const handleDelete = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to delete the selected time zone master data?",
            async () => {
                setLoading(true);
                try {
                    const company_code = sessionStorage.getItem("selectedCompanyCode");

                    const dataToSend = {
                        Time_Zone_masterData: Array.isArray(rowData) ? rowData : [rowData],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/Time_Zone_masterLoopDelete`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "company_code": company_code
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Time zone master deleted successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting time zone master rows:", error);
                    toast.error("Error deleting time zone master data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => toast.info("Delete cancelled"),
        );
    };

    const getCSSVariable = (variableName) => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
    };

    const transformRowData = (data) => {
        return data.map((row) => ({
            "Time Zone ID": row.TimeZone_ID || "",
            "Time Zone Name": row.TimeZone_Name || "",
            "UTC Offset": row.UTC_Offset || "",
            "DST Applicable": row.DST_Applicable || "",
            "Status": row.Status || "",
        }));
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Time Zone Master Search Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Time Zone Master");

        XLSX.writeFile(workbook, "Time_Zone_Master_Search_Report.xlsx");
    };

    return (
        <div className="container-fluid Topnav-screen">
            <div align="">
                {loading && <LoadingScreen />}
                <ToastContainer
                    position="top-right"
                    className="toast-design"
                    theme="colored"
                />
                <div className="shadow-lg p-1 bg-light rounded main-header-box">
                    <div className="header-flex">
                        <h1 className="page-title">Loan Status History</h1>
                        <div className="action-wrapper">
                            <div onClick={handleSave} className="action-icon add">
                                <span className="tooltip">Save</span>
                                <i class="fa-solid fa-floppy-disk"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                    <div className="row g-3">

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={timeZoneName}
                                    onChange={(e) => setTimeZoneName(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !timeZoneName ? "text-danger" : ""}`}>
                                    Time Zone Name<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={utcOffset}
                                    onChange={(e) => setUtcOffset(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !utcOffset ? "text-danger" : ""}`}>
                                    UTC Offset<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedDstApplicable ? "has-value" : ""} 
                                    ${isSelectedDstApplicable ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedDstApplicable}
                                    onChange={handleChangeDstApplicable}
                                    options={filteredOptionDstApplicable}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedDstApplicable(true)}
                                    onBlur={() => setIsSelectedDstApplicable(false)}
                                />
                                <label className={`floating-label`}>DST Applicable</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedStatus ? "has-value" : ""} 
                                    ${isSelectedStatus ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedStatus}
                                    onChange={handleChangeStatus}
                                    options={filteredOptionStatus}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedStatus(true)}
                                    onBlur={() => setIsSelectedStatus(false)}
                                />
                                <label className={`floating-label ${error && !status ? "text-danger" : ""}`}>Status<span className="text-danger">*</span></label>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                    <div className="header-flex">
                        <h6 className="">Search Criteria:</h6>
                    </div>
                    <div className="row g-3">

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    class="exp-input-field form-control"
                                    type="number"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={timeZoneIdSc}
                                    onChange={(e) => setTimeZoneIdSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>Time Zone ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={timeZoneNameSc}
                                    onChange={(e) => setTimeZoneNameSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>Time Zone Name</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={utcOffsetSc}
                                    onChange={(e) => setUtcOffsetSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>UTC Offset</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedDstApplicableSc ? "has-value" : ""} 
                                    ${isSelectedDstApplicableSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedDstApplicableSc}
                                    onChange={handleChangeDstApplicableSc}
                                    options={filteredOptionDstApplicableSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedDstApplicableSc(true)}
                                    onBlur={() => setIsSelectedDstApplicableSc(false)}
                                />
                                <label className={`floating-label`}>DST Applicable</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedStatusSc ? "has-value" : ""} 
                                    ${isSelectedStatusSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedStatusSc}
                                    onChange={handleChangeStatusSc}
                                    options={filteredOptionStatusSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedStatusSc(true)}
                                    onBlur={() => setIsSelectedStatusSc(false)}
                                />
                                <label className={`floating-label`}>Status</label>
                            </div>
                        </div>

                        <div className="col-12">
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
                </div>

                <div
                    className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
                    style={{ width: "100%" }}
                >
                    <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            onCellValueChanged={onCellValueChanged}
                            rowSelection="multiple"
                            onSelectionChanged={onSelectionChanged}
                            pagination={true}
                            paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanStatusHistory;
