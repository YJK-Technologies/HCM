import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import TabButtons from "./ESSComponents/Tabs";
import Select from "react-select";


const config = require("./Apiconfig");

function EmployeeTypeMaster() {
    const [activeTab, setActiveTab] = useState("Employment Type Master");
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const navigate = useNavigate();
    const [editedData, setEditedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [employmentTypeId, setEmploymentId] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
    const [employmentTypeDrop, setEmploymentTypeDrop] = useState([]);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusDrop, setStatusDrop] = useState([]);

    const [employmentTypeIdSc, setEmploymentIdSc] = useState('');
    const [employmentTypeSc, setEmploymentTypeSc] = useState('');
    const [selectedEmploymentTypeSc, setSelectedEmploymentTypeSc] = useState('');
    const [employmentTypeDropSc, setEmploymentTypeDropSc] = useState([]);
    const [descriptionSc, setDescriptionSc] = useState('');
    const [statusSc, setStatusSc] = useState('');
    const [selectedStatusSc, setSelectedStatusSc] = useState('');
    const [statusDropSc, setStatusDropSc] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [employmentTypeDropGrid, setEmploymentTypeDropGrid] = useState([]);

    const [isSelectStatus, setIsSelectStatus] = useState(false);
    const [isSelectedEmploymentType, setIsSelectEmploymentType] = useState(false);
    const [isSelectStatusSc, setIsSelectStatusSc] = useState(false);
    const [isSelectedEmploymentTypeSc, setIsSelectEmploymentTypeSc] = useState(false);

    const [createdBy, setCreatedBy] = useState("");
    const [modifiedBy, setModifiedBy] = useState("");
    const [createdDate, setCreatedDate] = useState("");
    const [modifiedDate, setModifiedDate] = useState("");

    //code added by Harish purpose of set user permisssion
    const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
    const companyMappingPermission = permissions
        .filter((permission) => permission.screen_type === "Company Mapping")
        .map((permission) => permission.permission_type.toLowerCase());

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    const handleChangeStatusSc = (selectedStatusSc) => {
        setSelectedStatusSc(selectedStatusSc);
        setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
    };

    const handleChangeEmploymentType = (selectedEmploymentType) => {
        setSelectedEmploymentType(selectedEmploymentType);
        setEmploymentType(selectedEmploymentType ? selectedEmploymentType.value : "");
    };

    const handleChangeEmploymentTypeSc = (selectedEmploymentTypeSc) => {
        setSelectedEmploymentTypeSc(selectedEmploymentTypeSc);
        setEmploymentTypeSc(selectedEmploymentTypeSc ? selectedEmploymentTypeSc.value : "");
    };

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionStatusSc = statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionEmploymentType = employmentTypeDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionEmploymentTypeSc = employmentTypeDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

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
        fetch(`${config.apiBaseUrl}/getEmptype`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const employeeTypeOption = data.map((option) => option.attributedetails_name);
                setEmploymentTypeDropGrid(employeeTypeOption);
            })
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

        fetch(`${config.apiBaseUrl}/getEmptype`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setEmploymentTypeDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getEmptype`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setEmploymentTypeDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleSearch = async () => {
        setLoading(true);

        try {
            const Company_Code = sessionStorage.getItem("selectedCompanyCode");

            const response = await fetch(`${config.apiBaseUrl}/Employment_Type_MasterSc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Employment_Type_ID: employmentTypeIdSc,
                    Employment_Type: employmentTypeSc,
                    Description: descriptionSc,
                    Status: statusSc,
                    Company_Code,
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
        window.location.reload();
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
            headerName: "Employment Type ID",
            field: "Employment_Type_ID",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Employment Type",
            field: "Employment_Type",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: employmentTypeDropGrid,
            },
        },
        {
            headerName: "Description",
            field: "Description",
            editable: true,
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

    const handleTabClick = (tabLabel) => {
        setActiveTab(tabLabel);
        switch (tabLabel) {
            case "Shift Master":
                ShiftMaster();
                break;
            case "Shift Type Master":
                ShiftTypeMaster();
                break;
            case "Shift Pattern Master":
                ShiftPatternMaster();
                break;
            case "Shift Pattern Details":
                ShiftPatternDetails();
                break;
            case "Employment Type Master":
                EmploymentTypeMaster();
                break;
            case "Employee Shift Mapping":
                EmployeeShiftMapping();
                break;
            default:
                break;
        }
    };

    const ShiftMaster = () => {
        navigate("/ShiftMasterGrid");
    };

    const ShiftTypeMaster = () => {
        navigate("/ShiftTypeMaster");
    };

    const ShiftPatternMaster = () => {
        navigate("/ShiftPatternMaster");
    };

    const ShiftPatternDetails = () => {
        navigate("/ShiftPatternDetails");
    };

    const EmploymentTypeMaster = () => {
        navigate("/EmployeeTypeMaster");
    };

    const EmployeeShiftMapping = () => {
        navigate("/EmployeeShiftMapping");
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
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

    const handleRowClick = (rowData) => {
        setCreatedBy(rowData.created_by);
        setModifiedBy(rowData.modified_by);
        const formattedCreatedDate = formatDate(rowData.created_date);
        const formattedModifiedDate = formatDate(rowData.modified_date);
        setCreatedDate(formattedCreatedDate);
        setModifiedDate(formattedModifiedDate);
    };

    // Handler for when a row is selected
    const onRowSelected = (event) => {
        if (event.node.isSelected()) {
            handleRowClick(event.data);
        }
    };

    const handleSave = async () => {
        if (!employmentTypeId || !employmentType || !status) {
            toast.warning("Missing Required Fields");
            setError(" ");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/Employment_Type_MasterInsert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Employment_Type_ID: employmentTypeId,
                        Employment_Type: employmentType,
                        Description: description,
                        Status: status,
                        Company_Code: sessionStorage.getItem("selectedCompanyCode"),
                        Created_by: sessionStorage.getItem("selectedUserCode"),
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Data inserted successfully", {
                    onClose: () => window.location.reload(),
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
        setLoading(true);

        showConfirmationToast(
            "Are you sure you want to update the selected employment type master data?",
            async () => {
                try {
                    const Company_Code = sessionStorage.getItem("selectedCompanyCode");
                    const Modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        Employment_Type_MasterData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                Company_Code,
                                Modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    Company_Code,
                                    Modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/Employment_Type_MasterLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Employment type master updated successfully", {
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
        setLoading(true);

        showConfirmationToast(
            "Are you sure you want to delete the selected employment type master data?",
            async () => {
                try {
                    const Company_Code = sessionStorage.getItem("selectedCompanyCode");

                    const dataToSend = {
                        Employment_Type_MasterData: Array.isArray(rowData) ? rowData : [rowData],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/Employment_Type_MasterLoopDelete`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Company_Code": Company_Code
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Employment type master deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting employment type master rows:", error);
                    toast.error("Error deleting employment type master data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => toast.info("Delete cancelled"),
        );
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
                        <h1 className="page-title">Employment Type Master</h1>
                        <div className="action-wrapper">
                            <div onClick={handleSave} className="action-icon add">
                                <span className="tooltip">Save</span>
                                <i class="fa-solid fa-floppy-disk"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <TabButtons
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
                <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                    <div className="row g-3">
                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={employmentTypeId}
                                    onChange={(e) => setEmploymentId(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !employmentTypeId ? "text-danger" : ""}`}>
                                    Employee Type ID<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedEmploymentType ? "has-value" : ""} 
                                    ${isSelectedEmploymentType ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedEmploymentType}
                                    onChange={handleChangeEmploymentType}
                                    options={filteredOptionEmploymentType}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectEmploymentType(true)}
                                    onBlur={() => setIsSelectEmploymentType(false)}
                                />
                                <label className={`floating-label ${error && !employmentType ? "text-danger" : ""}`}>Employee Type<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={255}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`} >
                                    Description
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedStatus ? "has-value" : ""} 
                                    ${isSelectStatus ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedStatus}
                                    onChange={handleChangeStatus}
                                    options={filteredOptionStatus}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectStatus(true)}
                                    onBlur={() => setIsSelectStatus(false)}
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
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={50}
                                    value={employmentTypeIdSc}
                                    onChange={(e) => setEmploymentIdSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>
                                    Employee Type ID
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedEmploymentTypeSc ? "has-value" : ""} 
                                    ${isSelectedEmploymentTypeSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedEmploymentTypeSc}
                                    onChange={handleChangeEmploymentTypeSc}
                                    options={filteredOptionEmploymentTypeSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectEmploymentTypeSc(true)}
                                    onBlur={() => setIsSelectEmploymentTypeSc(false)}
                                />
                                <label class="floating-label">Employee Type</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    maxLength={255}
                                    value={descriptionSc}
                                    onChange={(e) => setDescriptionSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`} >
                                    Description
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedStatusSc ? "has-value" : ""} 
                                    ${isSelectStatusSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedStatusSc}
                                    onChange={handleChangeStatusSc}
                                    options={filteredOptionStatusSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectStatusSc(true)}
                                    onBlur={() => setIsSelectStatusSc(false)}
                                />
                                <label className="floating-label">Status</label>
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
                            onRowSelected={onRowSelected}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeTypeMaster;
