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


    const [statusDrop, setStatusDrop] = useState([]);
    const [statusDropAG, setStatusDropAG] = useState([]);
    const [NewstatusDropAG, setNewstatusDropAG] = useState([]);
    const [dstApplicableDrop, setDstApplicableDrop] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [dstApplicableDropGrid, setDstApplicableDropGrid] = useState([]);

    // New - Input
    const [history_id, sethistory_id] = useState('');
    const [loan_request_id, setloan_request_id] = useState('');
    const [old_status, setold_status] = useState('');
    const [new_status, setnew_status] = useState('');
    const [changed_by, setchanged_by] = useState('');
    const [changed_date, setchanged_date] = useState('');
    const [remarks, setRemarks] = useState('');
    // const [loan_request_id, setloan_request_id] = useState('');
    // const [loan_request_id, setloan_request_id] = useState('');

    const [statusDropSc, setStatusDropSc] = useState([]);
    const [dstApplicableDropSc, setDstApplicableDropSc] = useState([]);

    // New - Search
    const [history_idSc, sethistory_idSc] = useState('');
    const [remarksSc, setremarksSc] = useState('');

    // Newly added
    const [isSelectedLoanReqId, setIsSelectedLoanReqId] = useState('');
    const [loanReqIdDrop, setLoanReqIdDrop] = useState([]);
    const [selectedLoanReqIdSc, setSelectedLoanReqIdSc] = useState('');
    const [loanReqIdSc, setLoanReqIdSc] = useState('');
    const [loanReqIdDropSc, setLoanReqIdDropSc] = useState([]);
    const [selectedLoanReqId, setSelectedLoanReqId] = useState('');
    const [loanReqId, setLoanReqId] = useState('');
    const [loanStatusDrop, setLoanStatusDrop] = useState([]);
    const [isSelectedLoanStatus, setIsSelectedLoanStatus] = useState('');
    const [selectedLoanStatus, setSelectedLoanStatus] = useState('');
    const [selectedLoanNewStatus, setSelectedLoanNewStatus] = useState('');
    const [loanStatus, setLoanStatus] = useState([]);
    const [isSelectedLoanNewStatus, setIsSelectedLoanNewStatus] = useState('');
    const [loanNewStatusDrop, setLoanNewStatusDrop] = useState([]);
    const [loanNewStatus, setLoanNewStatus] = useState([]);
    const [isSelectedLoanReqIdSc, setIsSelectedLoanReqIdSc] = useState('');
    const [selectedLoanStatusSc, setSelectedLoanStatusSc] = useState('');
    const [isSelectedLoanStatusSc, setIsSelectedLoanStatusSc] = useState('');
    const [loanStatusDropSc, setLoanStatusDropSc] = useState([]);
    const [loanStatusSc, setLoanStatusSc] = useState('');
    const [isSelectedLoanNewStatusSc, setIsSelectedLoanNewStatusSc] = useState('');
    const [selectedLoanNewStatusSc, setSelectedLoanNewStatusSc] = useState('');
    const [loanNewStatusDropSc, setLoanNewStatusDropSc] = useState([]);
    const [loanNewStatusSc, setLoanNewStatusSc] = useState('');
    const [LoanReqIdGridDrop, setLoanReqIdGridDrop] = useState([]);
    const [OldStatusGridDrop, setOldStatusGridDrop] = useState([]);
    const [NewStatusGridDrop, setNewStatusGridDrop] = useState([]);
    const [loanReqIdDropAG, setLoanReqIdDropAG] = useState([]);


    const filteredOptionLoanStatus = Array.isArray(loanStatusDrop)
        ? loanStatusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionLoanStatusSc = Array.isArray(loanStatusDrop)
        ? loanStatusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];
    const handleChangeLoanStatus = (selectedLoanStatus) => {
        setSelectedLoanStatus(selectedLoanStatus);
        setLoanStatus(selectedLoanStatus ? selectedLoanStatus.value : "");
    };
    const handleChangeLoanStatusSc = (selectedLoanStatusSc) => {
        setSelectedLoanStatusSc(selectedLoanStatusSc);
        setLoanStatusSc(selectedLoanStatusSc ? selectedLoanStatusSc.value : "");
    };

    const filteredOptionLoanNewStatus = Array.isArray(loanStatusDrop)
        ? loanStatusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionLoanNewStatusSc = Array.isArray(loanStatusDropSc)
        ? loanStatusDropSc.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionLoanReqId = Array.isArray(loanReqIdDrop)
        ? loanReqIdDrop.map((option) => ({
            value: option.loan_request_id,
            label: option.loan_request_id,
        }))
        : [];

    const handleChangeLoanReqIdSc = (selectedLoanReqIdSc) => {
        setSelectedLoanReqIdSc(selectedLoanReqIdSc);
        setLoanReqIdSc(selectedLoanReqIdSc ? selectedLoanReqIdSc.value : "");
    };

    const handleChangeLoanReqId = (selectedLoanReqId) => {
        setSelectedLoanReqId(selectedLoanReqId);
        setLoanReqId(selectedLoanReqId ? selectedLoanReqId.value : "");
    };

    const handleChangeLoanNewStatus = (selectedLoanNewStatus) => {
        setSelectedLoanNewStatus(selectedLoanNewStatus);
        setLoanNewStatus(selectedLoanNewStatus ? selectedLoanNewStatus.value : "");
    };
    const handleChangeLoanNewStatusSc = (selectedLoanNewStatusSc) => {
        setSelectedLoanNewStatusSc(selectedLoanNewStatusSc);
        setLoanNewStatusSc(selectedLoanNewStatusSc ? selectedLoanNewStatusSc.value : "");
    };
    const filteredOptionLoanReqIdAG = loanReqIdDropAG.map((option) => ({
        value: option.loan_request_id,
        label: option.loan_request_id,
    }));

    //code added by Harish purpose of set user permisssion
    const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
    const LoanStatusHistoryPermission = permissions
        .filter((permission) => permission.screen_type === "LoanStatusHistory")
        .map((permission) => permission.permission_type.toLowerCase());

    const addClearInputFields = () => {
        sethistory_id("");
        setloan_request_id("");
        setold_status("");
        setnew_status("");
        setchanged_by("");
        setchanged_date("");
        setRemarks("");
    };

    const searchClearInputFields = () => {
        sethistory_idSc("");
        setLoanReqIdSc("");
        setSelectedLoanReqIdSc("");
        setLoanStatusSc("");
        setSelectedLoanStatusSc("");
        setLoanNewStatusSc("");
        setSelectedLoanNewStatusSc("");
        setremarksSc("");

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

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanReqIdDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setStatusDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanStatusDrop(val))
            .catch((error) => console.error("Error fetching loan status:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanStatusDropSc(val))
            .catch((error) => console.error("Error fetching loan status:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanNewStatusDrop(val))
            .catch((error) => console.error("Error fetching loan status:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanNewStatusDropSc(val))
            .catch((error) => console.error("Error fetching loan status:", error));
    }, []);
    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((data) => data.json())
            .then((val) => {
                const loan = val.map((option) => ({
                    value: option.loan_request_id,
                    label: `${option.loan_request_id}`,
                }));

                setLoanReqIdDropAG(loan);
            })
            .catch((error) => console.error("Error fetching loan request:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const OldStatus = val.map(option => option.attributedetails_name);
                setStatusDropAG(OldStatus);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetLoanStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const NewStatus = val.map(option => option.attributedetails_name);
                setNewstatusDropAG(NewStatus);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getLoanRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setLoanReqIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    const filteredOptionLoanReqIdDrop = LoanReqIdGridDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionOldStatusDrop = OldStatusGridDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));


    const filteredOptionNewStatusDrop = NewStatusGridDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionLoanReqIdSc = Array.isArray(loanReqIdDropSc)
        ? loanReqIdDropSc.map((option) => ({
            value: option.loan_request_id,
            label: option.loan_request_id,
        }))
        : [];


    

    const handleSearch = async () => {
        setLoading(true);

        try {
            const company_code = sessionStorage.getItem("selectedCompanyCode");

            const response = await fetch(`${config.apiBaseUrl}/loan_status_history_search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    history_id: history_idSc ? history_idSc : 0,
                    loan_request_id: loanReqIdSc,
                    old_status: loanStatusSc,
                    new_status: loanNewStatusSc,
                    // changed_by: changed_bySc,
                    // changed_date: changed_dateSc,
                    remarks: remarksSc,
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
                                    title="Delete"
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
            headerName: "History ID",
            field: "history_id",
            editable: false,
            cellStyle: { textAlign: "left" },
        },
        {
            headerName: "Loan Request ID",
            field: "loan_request_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: loanReqIdDropAG.map((d) => d.value),
            },
            valueFormatter: (params) => {
                const loan = loanReqIdDropAG.find((d) => d.value === params.value);
                return loan ? loan.label : params.value;
            },
        },
        {
            headerName: "Old Status",
            field: "old_status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropAG,
            },
        },
        {
            headerName: "New Status",
            field: "new_status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: NewstatusDropAG,
            },
        },
        // {
        //     headerName: "Changed By",
        //     field: "changed_by",
        //     editable: true,
        //     cellEditor: "agSelectCellEditor",
        //     cellEditorParams: {
        //         values: statusDropGrid,
        //     },
        // },
        // {
        //     headerName: "Changed Date",
        //     field: "changed_date",
        //     editable: true,
        //     cellEditor: "agSelectCellEditor",
        //     cellEditorParams: {
        //         values: dstApplicableDropGrid,
        //     },
        // },
        {
            headerName: "Remarks",
            field: "remarks",
            editable: true,
            
        },

    ];

    const defaultColDef = {
        resizable: true,
        wrapText: true,
        editable: true,
    };



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
        if (!history_id || !loanReqId || !loanStatus || !loanNewStatus) {
            toast.warning("Missing Required Fields");
            setError(true);
            return;
        }
        setLoading(false);
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/loan_status_historyInsert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        history_id: history_id,
                        loan_request_id: loanReqId,
                        old_status: loanStatus,
                        new_status: loanNewStatus,
                        remarks: remarks,
                        changed_by: sessionStorage.getItem("selectedUserCode"),

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
                    const changed_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        sp_loan_status_historyData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                modified_by,
                                changed_by
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    modified_by,
                                    changed_by
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/loan_status_historyLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Loan Status History updated successfully", {
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
                        sp_loan_status_historyData: Array.isArray(rowData) ? rowData : [rowData],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/loan_status_historyLoopDelete`,
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
                        toast.success("Loan Status History deleted successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting Loan Status History rows:", error);
                    toast.error("Error deleting Loan Status History data: " + error.message);
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
            "History ID": row.history_id || "",
            "Loan Request ID": row.loan_request_id || "",
            "Old Status": row.old_status || "",
            "New Status": row.new_status || "",
            "Remarks": row.remarks || "",
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

        XLSX.writeFile(workbook, "Loan_Status_Histroy_Search_Report.xlsx");
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
                                    maxLength={15}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    autoComplete="off"
                                    value={history_id}
                                    title="Please enter the History ID"
                                    onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    sethistory_id(value);
                                }}
                                />
                                <label for="state" className={`exp-form-labels ${error && !history_id ? "text-danger" : ""}`}>
                                    History ID<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanReqId ? "has-value" : ""} 
                                    ${isSelectedLoanReqId ? "is-focused" : ""}`}
                                    title="Please select the Loan Request ID"
                            >
                                <Select
                                    id="department"
                                    type="text"
                                    isClearable
                                    value={selectedLoanReqId}
                                    onChange={handleChangeLoanReqId}
                                    options={filteredOptionLoanReqId}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanReqId(true)}
                                    onBlur={() => setIsSelectedLoanReqId(false)}
                                />
                                <label className={`floating-label ${error && !loan_request_id ? "text-danger" : ""}`}>Loan Request ID<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanStatus ? "has-value" : ""} 
                                    ${isSelectedLoanStatus ? "is-focused" : ""}`}
                                    title="Please select the Old Status"
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedLoanStatus}
                                    onChange={handleChangeLoanStatus}
                                    options={filteredOptionLoanStatus}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanStatus(true)}
                                    onBlur={() => setIsSelectedLoanStatus(false)}
                                />
                                <label className={`floating-label ${error && !old_status ? "text-danger" : ""}`}>Old Status<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanNewStatus ? "has-value" : ""} 
                                    ${isSelectedLoanNewStatus ? "is-focused" : ""}`}
                                    title="Please select the New Status"
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedLoanNewStatus}
                                    onChange={handleChangeLoanNewStatus}
                                    options={filteredOptionLoanNewStatus}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanNewStatus(true)}
                                    onBlur={() => setIsSelectedLoanNewStatus(false)}
                                />
                                <label className={`floating-label ${error && !new_status ? "text-danger" : ""}`}>New Status<span className="text-danger">*</span></label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="inputGroup">
                                <input
                                    id="fdate"
                                    class="exp-input-field form-control"
                                    type="text"
                                    placeholder=""
                                    required 
                                    autoComplete="off"
                                    value={remarks}
                                    maxLength={255}
                                    title="Please enter the Remarks"
                                    onChange={(e) => setRemarks((e.target.value))}
                                />
                                <label for="sname" className={`exp-form-labels`}>Remarks</label>
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
                                    type="text"
                                    placeholder=" "
                                    maxLength={15}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="off"
                                    required
                                    value={history_idSc}
                                    title="Please enter the History ID"
                                    onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    sethistory_idSc(value);
                                }}
                                />
                                <label for="state" className={`exp-form-labels`}>History ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanReqIdSc ? "has-value" : ""} 
                                    ${isSelectedLoanReqIdSc ? "is-focused" : ""}`}
                                    title="Please select the Loan Request ID"
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedLoanReqIdSc}
                                    onChange={handleChangeLoanReqIdSc}
                                    options={filteredOptionLoanReqIdSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanReqIdSc(true)}
                                    onBlur={() => setIsSelectedLoanReqIdSc(false)}
                                />
                                <label className={`floating-label`}>Loan Request ID</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanStatusSc ? "has-value" : ""} 
                                    ${isSelectedLoanStatusSc ? "is-focused" : ""}`}
                                    title="Please select the Old Status"
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedLoanStatusSc}
                                    onChange={handleChangeLoanStatusSc}
                                    options={filteredOptionLoanStatusSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanStatusSc(true)}
                                    onBlur={() => setIsSelectedLoanStatusSc(false)}
                                />
                                <label className={`floating-label`}>Old Status</label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div
                                className={`inputGroup selectGroup 
                                    ${selectedLoanNewStatusSc ? "has-value" : ""} 
                                    ${isSelectedLoanNewStatusSc ? "is-focused" : ""}`}
                                    title="Please select the New Status"
                            >
                                <Select
                                    id="status"
                                    isClearable
                                    value={selectedLoanNewStatusSc}
                                    onChange={handleChangeLoanNewStatusSc}
                                    options={filteredOptionLoanNewStatusSc}
                                    classNamePrefix="react-select"
                                    placeholder=" "
                                    onFocus={() => setIsSelectedLoanNewStatusSc(true)}
                                    onBlur={() => setIsSelectedLoanNewStatusSc(false)}
                                />
                                <label className={`floating-label`}>New Status</label>
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
                                    maxLength={255}
                                    value={remarksSc}
                                    title="Please enter the Remarks"
                                    onChange={(e) => setremarksSc(e.target.value)}
                                />
                                <label for="state" className={`exp-form-labels`}>Remarks</label>
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
