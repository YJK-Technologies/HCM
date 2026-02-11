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
    const [activeTab, setActiveTab] = useState("Employee Shift Mapping");
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
    // const [status, setStatus] = useState('');
    // const [selectedStatus, setSelectedStatus] = useState('');
    // const [statusDrop, setStatusDrop] = useState([]);

    const [employmentTypeIdSc, setEmploymentIdSc] = useState('');
    const [employmentTypeSc, setEmploymentTypeSc] = useState('');
    const [selectedEmploymentTypeSc, setSelectedEmploymentTypeSc] = useState('');
    const [employmentTypeDropSc, setEmploymentTypeDropSc] = useState([]);
    const [descriptionSc, setDescriptionSc] = useState('');
    // const [statusSc, setStatusSc] = useState('');
    // const [selectedStatusSc, setSelectedStatusSc] = useState('');
    // const [statusDropSc, setStatusDropSc] = useState([]);
    // const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [employmentTypeDropGrid, setEmploymentTypeDropGrid] = useState([]);

    // const [isSelectStatus, setIsSelectStatus] = useState(false);
    const [isSelectedEmploymentType, setIsSelectEmploymentType] = useState(false);
    // const [isSelectStatusSc, setIsSelectStatusSc] = useState(false);
    const [isSelectedEmploymentTypeSc, setIsSelectEmploymentTypeSc] = useState(false);

    const [employeeShiftId, setEmployeeShiftId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [employeeIdDrop, setEmployeeIdDrop] = useState([]);
    const [shiftId, setShiftId] = useState('');
    const [selectedShiftId, setSelectedShiftId] = useState('');
    const [shiftIdDrop, setShiftIdDrop] = useState([]);
    const [shiftTypeId, setShiftTypeId] = useState('');
    const [selectedShiftTypeId, setSelectedShiftTypeId] = useState('');
    const [shiftTypeIdDrop, setShiftTypeIdDrop] = useState([]);
    const [shiftPatternId, setShiftPatternId] = useState('');
    const [selectedShiftPatternId, setSelectedShiftPatternId] = useState('');
    const [shiftPatternIdDrop, setShiftPatternIdDrop] = useState([]);
    const [effectiveFrom, setEffectiveFrom] = useState('');
    const [effectiveTo, setEffectiveTo] = useState('');
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusDrop, setStatusDrop] = useState([]);

    const [employeeShiftIdSc, setEmployeeShiftIdSc] = useState('');
    const [employeeIdSc, setEmployeeIdSc] = useState('');
    const [selectedEmployeeIdSc, setSelectedEmployeeIdSc] = useState('');
    const [employeeIdDropSc, setEmployeeIdDropSc] = useState([]);
    const [shiftIdSc, setShiftIdSc] = useState('');
    const [selectedShiftIdSc, setSelectedShiftIdSc] = useState('');
    const [shiftIdDropSc, setShiftIdDropSc] = useState([]);
    const [shiftTypeIdSc, setShiftTypeIdSc] = useState('');
    const [selectedShiftTypeIdSc, setSelectedShiftTypeIdSc] = useState('');
    const [shiftTypeIdDropSc, setShiftTypeIdDropSc] = useState([]);
    const [shiftPatternIdSc, setShiftPatternIdSc] = useState('');
    const [selectedShiftPatternIdSc, setSelectedShiftPatternIdSc] = useState('');
    const [shiftPatternIdDropSc, setShiftPatternIdDropSc] = useState([]);
    const [effectiveFromSc, setEffectiveFromSc] = useState('');
    const [effectiveToSc, setEffectiveToSc] = useState('');
    const [statusSc, setStatusSc] = useState('');
    const [selectedStatusSc, setSelectedStatusSc] = useState('');
    const [statusDropSc, setStatusDropSc] = useState([]);

    const [employeeIdDropGrid, setEmployeeIdDropGrid] = useState([]);
    const [shiftIdDropGrid, setShiftIdDropGrid] = useState([]);
    const [shiftTypeIdDropGrid, setShiftTypeIdDropGrid] = useState([]);
    const [shiftPatternIdDropGrid, setShiftPatternIdDropGrid] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);

    const [isSelectStatus, setIsSelectStatus] = useState(false);
    const [isSelectedShiftId, setIsSelectShiftId] = useState(false);
    const [isSelectedEmployeeId, setIsSelectEmployeeId] = useState(false);
    const [isSelectedShiftTypeId, setIsSelectShiftTypeId] = useState(false);
    const [isSelectedShiftPatternId, setIsSelectShiftPatternId] = useState(false);
    const [isSelectStatusSc, setIsSelectStatusSc] = useState(false);
    const [isSelectedShiftIdSc, setIsSelectShiftIdSc] = useState(false);
    const [isSelectedEmployeeIdSc, setIsSelectEmployeeIdSc] = useState(false);
    const [isSelectedShiftTypeIdSc, setIsSelectShiftTypeIdSc] = useState(false);
    const [isSelectedShiftPatternIdSc, setIsSelectShiftPatternIdSc] = useState(false);

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

    const handleChangeEmployeeId = (selectedEmployeeId) => {
        setSelectedEmployeeId(selectedEmployeeId);
        setEmployeeId(selectedEmployeeId ? selectedEmployeeId.value : "");
    };

    const handleChangeShiftId = (selectedShiftId) => {
        setSelectedShiftId(selectedShiftId);
        setShiftId(selectedShiftId ? selectedShiftId.value : "");
    };

    const handleChangeShiftTypeId = (selectedShiftTypeId) => {
        setSelectedShiftTypeId(selectedShiftTypeId);
        setShiftTypeId(selectedShiftTypeId ? selectedShiftTypeId.value : "");
    };

    const handleChangeShiftPatternId = (selectedShiftPatternId) => {
        setSelectedShiftPatternId(selectedShiftPatternId);
        setShiftPatternId(selectedShiftPatternId ? selectedShiftPatternId.value : "");
    };

    const handleChangeStatusSc = (selectedStatusSc) => {
        setSelectedStatusSc(selectedStatusSc);
        setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
    };

    const handleChangeEmployeeIdSc = (selectedEmployeeIdSc) => {
        setSelectedEmployeeIdSc(selectedEmployeeIdSc);
        setEmployeeIdSc(selectedEmployeeIdSc ? selectedEmployeeIdSc.value : "");
    };

    const handleChangeShiftIdSc = (selectedShiftIdSc) => {
        setSelectedShiftIdSc(selectedShiftIdSc);
        setShiftIdSc(selectedShiftIdSc ? selectedShiftIdSc.value : "");
    };

    const handleChangeShiftTypeIdSc = (selectedShiftTypeIdSc) => {
        setSelectedShiftTypeIdSc(selectedShiftTypeIdSc);
        setShiftTypeIdSc(selectedShiftTypeIdSc ? selectedShiftTypeIdSc.value : "");
    };

    const handleChangeShiftPatternIdSc = (selectedShiftPatternIdSc) => {
        setSelectedShiftPatternIdSc(selectedShiftPatternIdSc);
        setShiftPatternIdSc(selectedShiftPatternIdSc ? selectedShiftPatternIdSc.value : "");
    };

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionEmployeeId = employeeIdDrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.First_Name}`,
    }));

    const filteredOptionShiftId = shiftIdDrop.map((option) => ({
        value: option.Shift_ID,
        label: `${option.Shift_ID}-${option.Shift_Name}`,
    }));

    const filteredOptionShiftTypeId = shiftTypeIdDrop.map((option) => ({
        value: option.Shift_Type_ID,
        label: `${option.Shift_Type_ID}-${option.Shift_Type}`,
    }));

    const filteredOptionShiftPatternId = shiftPatternIdDrop.map((option) => ({
        value: option.Shift_Pattern_ID,
        label: `${option.Shift_Pattern_ID}-${option.Pattern_Name}`,
    }));

    const filteredOptionStatusSc = statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionEmployeeIdSc = employeeIdDropSc.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.First_Name}`,
    }));

    const filteredOptionShiftIdSc = shiftIdDropSc.map((option) => ({
        value: option.Shift_ID,
        label: `${option.Shift_ID}-${option.Shift_Name}`,
    }));

    const filteredOptionShiftTypeIdSc = shiftTypeIdDropSc.map((option) => ({
        value: option.Shift_Type_ID,
        label: `${option.Shift_Type_ID}-${option.Shift_Type}`,
    }));

    const filteredOptionShiftPatternIdSc = shiftPatternIdDropSc.map((option) => ({
        value: option.Shift_Pattern_ID,
        label: `${option.Shift_Pattern_ID}-${option.Pattern_Name}`,
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
                const shiftPatternIdOption = data.map((option) => option.attributedetails_name);
                setShiftPatternIdDropGrid(shiftPatternIdOption);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");
        fetch(`${config.apiBaseUrl}/ShiftTypeDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const shiftTypeIdOption = data.map((option) => option.attributedetails_name);
                setShiftTypeIdDropGrid(shiftTypeIdOption);
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
                const shiftIdOption = data.map((option) => option.attributedetails_name);
                setShiftIdDropGrid(shiftIdOption);
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
            .then((response) => response.json())
            .then((data) => {
                const employeeIdOption = data.map((option) => option.attributedetails_name);
                setEmployeeIdDropGrid(employeeIdOption);
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

        fetch(`${config.apiBaseUrl}/ShiftTypeDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setShiftTypeIdDrop(val))
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
            .then((val) => setShiftIdDrop(val))
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
            .then((val) => setEmployeeIdDrop(val))
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

        fetch(`${config.apiBaseUrl}/getEmployeeId`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setEmployeeIdDropSc(val))
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
            .then((val) => setShiftIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/ShiftTypeDropDown`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setShiftTypeIdDropSc(val))
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
            .then((val) => setShiftPatternIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleSearch = async () => {
        setLoading(true);

        try {
            const Company_Code = sessionStorage.getItem("selectedCompanyCode");

            const response = await fetch(`${config.apiBaseUrl}/Employee_shift_mappingSc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Emp_Shift_ID: employeeShiftIdSc,
                    Employee_ID: employeeIdSc,
                    Shift_ID: shiftIdSc,
                    Shift_Type_ID: shiftTypeIdSc,
                    Shift_Pattern_ID: shiftPatternIdSc,
                    Effective_From: effectiveFromSc,
                    Effective_To: effectiveToSc,
                    Is_Current: statusSc,
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
            headerName: "Employee Shift ID",
            field: "Emp_Shift_ID",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Employee ID",
            field: "Employee_ID",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: employmentTypeDropGrid,
            },
        },
        {
            headerName: "Shift ID",
            field: "Shift_ID",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: employmentTypeDropGrid,
            },
        },
        {
            headerName: "Shift Type ID",
            field: "Shift_Type_ID",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
        {
            headerName: "Shift Pattern ID",
            field: "Shift_Pattern_ID",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
        {
            headerName: "Effective From",
            field: "Effective_From",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Effective To",
            field: "Effective_To",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Status",
            field: "Is_Current",
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
        if (!employeeShiftId || !employeeId || !shiftId || !shiftTypeId || !shiftPatternId || !effectiveFrom || !effectiveTo || !status) {
            toast.warning("Missing Required Fields");
            setError(" ");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/Employee_shift_mappingInsert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Emp_Shift_ID: employeeShiftId,
                        Employee_ID: employeeId,
                        Shift_ID: shiftId,
                        Shift_Type_ID: shiftTypeId,
                        Shift_Pattern_ID: shiftPatternId,
                        Effective_From: effectiveFrom,
                        Effective_To: effectiveTo,
                        Is_Current: status,
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
            console.error("Error inserting data:", error);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (rowData) => {
        setLoading(true);

        showConfirmationToast(
            "Are you sure you want to update the selected Shift Pattern data?",
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
                        toast.success("Employment Type Master updated successfully", {
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
            "Are you sure you want to delete the selected shift data?",
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
                        toast.success("Employment type deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting shift rows:", error);
                    toast.error("Error deleting shift data: " + error.message);
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
                        <h1 className="page-title">Employee Shift Mapping</h1>
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
                                    type="number"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    value={employeeShiftId}
                                    onChange={(e) => setEmployeeShiftId(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !employeeShiftId ? "text-danger" : ""}`}>
                                    Employee Shift ID<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedEmployeeId ? "has-value" : ""} 
                                    ${isSelectedEmployeeId ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedEmployeeId}
                                    onChange={handleChangeEmployeeId}
                                    options={filteredOptionEmployeeId}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectEmployeeId(true)}
                                    onBlur={() => setIsSelectEmployeeId(false)}
                                />
                                <label className={`floating-label ${error && !employeeId ? "text-danger" : ""}`}>Employee ID<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedShiftId ? "has-value" : ""} 
                                    ${isSelectedShiftId ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedShiftId}
                                    onChange={handleChangeShiftId}
                                    options={filteredOptionShiftId}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftId(true)}
                                    onBlur={() => setIsSelectShiftId(false)}
                                />
                                <label className={`floating-label ${error && !shiftId ? "text-danger" : ""}`}>Shift ID<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedShiftTypeId ? "has-value" : ""} 
                                    ${isSelectedShiftTypeId ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedShiftTypeId}
                                    onChange={handleChangeShiftTypeId}
                                    options={filteredOptionShiftTypeId}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftTypeId(true)}
                                    onBlur={() => setIsSelectShiftTypeId(false)}
                                />
                                <label className={`floating-label ${error && !shiftTypeId ? "text-danger" : ""}`}>Shift Type ID<span className="text-danger">*</span></label>
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
                                    isClearable
                                    value={selectedShiftPatternId}
                                    onChange={handleChangeShiftPatternId}
                                    options={filteredOptionShiftPatternId}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftPatternId(true)}
                                    onBlur={() => setIsSelectShiftPatternId(false)}
                                />
                                <label className={`floating-label ${error && !shiftPatternId ? "text-danger" : ""}`}>Shift Pattern ID<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="date"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    value={effectiveFrom}
                                    onChange={(e) => setEffectiveFrom(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !effectiveFrom ? "text-danger" : ""}`}>
                                    Effective From<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="date"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    value={effectiveTo}
                                    onChange={(e) => setEffectiveTo(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels ${error && !effectiveTo ? "text-danger" : ""}`}>
                                    Effective To<span className="text-danger">*</span>
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
                                    value={employeeShiftIdSc}
                                    onChange={(e) => setEmployeeShiftIdSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>
                                    Employee Shift ID
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedEmployeeIdSc ? "has-value" : ""} 
                                    ${isSelectedEmployeeIdSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedEmployeeIdSc}
                                    onChange={handleChangeEmployeeIdSc}
                                    options={filteredOptionEmployeeIdSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectEmployeeIdSc(true)}
                                    onBlur={() => setIsSelectEmployeeIdSc(false)}
                                />
                                <label className={`floating-label`}>Employee ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedShiftIdSc ? "has-value" : ""} 
                                    ${isSelectedShiftIdSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedShiftIdSc}
                                    onChange={handleChangeShiftIdSc}
                                    options={filteredOptionShiftIdSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftIdSc(true)}
                                    onBlur={() => setIsSelectShiftIdSc(false)}
                                />
                                <label className={`floating-label`}>Shift ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedShiftTypeIdSc ? "has-value" : ""} 
                                    ${isSelectedShiftTypeIdSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedShiftTypeIdSc}
                                    onChange={handleChangeShiftTypeIdSc}
                                    options={filteredOptionShiftTypeIdSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftTypeIdSc(true)}
                                    onBlur={() => setIsSelectShiftTypeIdSc(false)}
                                />
                                <label className={`floating-label`}>Shift Type ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedShiftPatternIdSc ? "has-value" : ""} 
                                    ${isSelectedShiftPatternIdSc ? "is-focused" : ""}`}
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedShiftPatternIdSc}
                                    onChange={handleChangeShiftPatternIdSc}
                                    options={filteredOptionShiftPatternIdSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectShiftPatternIdSc(true)}
                                    onBlur={() => setIsSelectShiftPatternIdSc(false)}
                                />
                                <label className={`floating-label`}>Shift Pattern ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="date"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    value={effectiveFromSc}
                                    onChange={(e) => setEffectiveFromSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`} >
                                    Effective From
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="TimeZone_ID"
                                    class="exp-input-field form-control"
                                    type="date"
                                    placeholder=" "
                                    autoComplete="off"
                                    required
                                    value={effectiveToSc}
                                    onChange={(e) => setEffectiveToSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`} >
                                    Effective To
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
