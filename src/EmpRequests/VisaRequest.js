import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import TabButtons from '../ESSComponents/Tabs';
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
import Select from 'react-select';
import * as XLSX from "xlsx-js-style";
const config = require('../Apiconfig');

function VisaRequest({ }) {

    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [visaRequestId, setVisaRequestId] = useState('');
    const [empIdDrop, setEmpIdDrop] = useState([]);
    const [empId, setEmpId] = useState('');
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [passportId, setPassportId] = useState('');
    const [countryIdDrop, setCountyIdDrop] = useState([]);
    const [countryId, setCountryId] = useState('');
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [visaTypeDrop, setVisaTypeDrop] = useState([]);
    const [visaType, setVisaType] = useState('');
    const [selectedVisaType, setSelectedVisaType] = useState('');
    const [purpose, setPurpose] = useState('');
    const [travelStartDate, setTravelStartDate] = useState('');
    const [travelEndDate, setTravelEndDate] = useState('');
    const [reqStatusDrop, setReqStatusDrop] = useState([]);
    const [reqStatus, setReqStatus] = useState('');
    const [selectedReqStatus, setSelectedReqStatus] = useState('');
    const [reqNumber, setReqNumber] = useState('');
    const [priorityDrop, setPriorityDrop] = useState([]);
    const [priority, setPriority] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [sponsorName, setSponsorName] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [remarks, setRemarks] = useState('');

    const [visaRequestIdSc, setVisaRequestIdSc] = useState('');
    const [empIdDropSc, setEmpIdDropSc] = useState([]);
    const [empIdSc, setEmpIdSc] = useState('');
    const [selectedEmpIdSc, setSelectedEmpIdSc] = useState('');
    const [passportIdSc, setPassportIdSc] = useState('');
    const [countryIdDropSc, setCountyIdDropSc] = useState([]);
    const [countryIdSc, setCountryIdSc] = useState('');
    const [selectedCountryIdSc, setSelectedCountryIdSc] = useState('');
    const [visaTypeDropSc, setVisaTypeDropSc] = useState([]);
    const [visaTypeSc, setVisaTypeSc] = useState('');
    const [selectedVisaTypeSc, setSelectedVisaTypeSc] = useState('');
    const [purposeSc, setPurposeSc] = useState('');
    const [travelStartDateSc, setTravelStartDateSc] = useState('');
    const [travelEndDateSc, setTravelEndDateSc] = useState('');
    const [reqStatusDropSc, setReqStatusDropSc] = useState([]);
    const [reqStatusSc, setReqStatusSc] = useState('');
    const [selectedReqStatusSc, setSelectedReqStatusSc] = useState('');
    const [reqNumberSc, setReqNumberSc] = useState('');
    const [priorityDropSc, setPriorityDropSc] = useState([]);
    const [prioritySc, setPrioritySc] = useState('');
    const [selectedPrioritySc, setSelectedPrioritySc] = useState('');
    const [sponsorNameSc, setSponsorNameSc] = useState('');
    const [estimatedCostSc, setEstimatedCostSc] = useState('');
    const [remarksSc, setRemarksSc] = useState('');

    const [isSelectedEmpId, setIsSelectedEmpId] = useState(false);
    const [isSelectedCountryId, setIsSelectedCountryId] = useState(false);
    const [isSelectedVisaType, setIsSelectedVisaType] = useState(false);
    const [isSelectedReqStatus, setIsSelectedReqStatus] = useState(false);
    const [isSelectedPriority, setIsSelectedPriority] = useState(false);

    const [isSelectedEmpIdSc, setIsSelectedEmpIdSc] = useState(false);
    const [isSelectedCountryIdSc, setIsSelectedCountryIdSc] = useState(false);
    const [isSelectedVisaTypeSc, setIsSelectedVisaTypeSc] = useState(false);
    const [isSelectedReqStatusSc, setIsSelectedReqStatusSc] = useState(false);
    const [isSelectedPrioritySc, setIsSelectedPrioritySc] = useState(false);

    const [empIdDropGrid, setEmpIdDropGrid] = useState([]);
    const [countryIdDropGrid, setCountyIdDropGrid] = useState([]);
    const [visaTypeDropGrid, setVisaTypeDropGrid] = useState([]);
    const [reqStatusDropGrid, setReqStatusDropGrid] = useState([]);
    const [priorityDropGrid, setPriorityDropGrid] = useState([]);

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
            .then((val) => setEmpIdDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetCountry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setCountyIdDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getVisaType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setVisaTypeDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPriority`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPriorityDrop(val));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setReqStatusDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionEmpId = empIdDrop.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.First_Name}`,
    }));

    const filteredOptionCountryId = countryIdDrop.map(option => ({
        value: option.Country_Code,
        label: `${option.Country_Code} - ${option.Country_Name}`
    }));

    const filteredOptionVisaType = visaTypeDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionPriority = priorityDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionReqStatus = reqStatusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeEmpId = (selectedEmpId) => {
        setSelectedEmpId(selectedEmpId);
        setEmpId(selectedEmpId ? selectedEmpId.value : "");
    };

    const handleChangeCountryId = (selectedCountryId) => {
        setSelectedCountryId(selectedCountryId);
        setCountryId(selectedCountryId ? selectedCountryId.value : "");
    };

    const handleChangeVisaType = (selectedVisaType) => {
        setSelectedVisaType(selectedVisaType);
        setVisaType(selectedVisaType ? selectedVisaType.value : "");
    };

    const handleChangePriority = (selectedPriority) => {
        setSelectedPriority(selectedPriority);
        setPriority(selectedPriority ? selectedPriority.value : "");
    };

    const handleChangeReqStatus = (selectedReqStatus) => {
        setSelectedReqStatus(selectedReqStatus);
        setReqStatus(selectedReqStatus ? selectedReqStatus.value : "");
    };

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
            .then((val) => setEmpIdDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetCountry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setCountyIdDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getVisaType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setVisaTypeDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPriority`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setPriorityDropSc(val));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setReqStatusDropSc(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredOptionEmpIdSc = empIdDropSc.map((option) => ({
        value: option.EmployeeId,
        label: `${option.EmployeeId}-${option.First_Name}`,
    }));

    const filteredOptionCountryIdSc = countryIdDropSc.map(option => ({
        value: option.Country_Code,
        label: `${option.Country_Code} - ${option.Country_Name}`
    }));

    const filteredOptionVisaTypeSc = visaTypeDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionPrioritySc = priorityDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionReqStatusSc = reqStatusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeEmpIdSc = (selectedEmpIdSc) => {
        setSelectedEmpIdSc(selectedEmpIdSc);
        setEmpIdSc(selectedEmpIdSc ? selectedEmpIdSc.value : "");
    };

    const handleChangeCountryIdSc = (selectedCountryIdSc) => {
        setSelectedCountryIdSc(selectedCountryIdSc);
        setCountryIdSc(selectedCountryIdSc ? selectedCountryIdSc.value : "");
    };

    const handleChangePrioritySc = (selectedPrioritySc) => {
        setSelectedPrioritySc(selectedPrioritySc);
        setPrioritySc(selectedPrioritySc ? selectedPrioritySc.value : "");
    };

    const handleChangeVisaTypeSc = (selectedVisaTypeSc) => {
        setSelectedVisaTypeSc(selectedVisaTypeSc);
        setVisaTypeSc(selectedVisaTypeSc ? selectedVisaTypeSc.value : "");
    };

    const handleChangeReqStatusSc = (selectedReqStatusSc) => {
        setSelectedReqStatusSc(selectedReqStatusSc);
        setReqStatusSc(selectedReqStatusSc ? selectedReqStatusSc.value : "");
    };

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
            .then((val) => {
                const emp = val.map((option) => ({
                    value: option.EmployeeId,
                    label: `${option.EmployeeId} - ${option.First_Name}`,
                }));
                setEmpIdDropGrid(emp);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/GetCountry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const country = val.map((option) => ({
                    value: option.Country_Code,
                    label: `${option.Country_Code} - ${option.Country_Name}`,
                }));
                setCountyIdDropGrid(country);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getVisaType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const visaType = val.map(option => option.attributedetails_name);
                setVisaTypeDropGrid(visaType);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/getPriority`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const priority = val.map(option => option.attributedetails_name);
                setPriorityDropGrid(priority);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');
        fetch(`${config.apiBaseUrl}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                const reqStatus = val.map(option => option.attributedetails_name);
                setReqStatusDropGrid(reqStatus);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const searchClearInputFields = () => {
        setVisaRequestIdSc("");
        setEmpIdSc("");
        setSelectedEmpIdSc("");
        setPassportIdSc("");
        setCountryIdSc("");
        setSelectedCountryIdSc("");
        setVisaTypeSc("");
        setSelectedVisaTypeSc("");
        setPurposeSc("");
        setTravelStartDateSc("");
        setTravelEndDateSc("");
        setReqStatusSc("");
        setSelectedReqStatusSc("");
        setReqNumberSc("");
        setPrioritySc("");
        setSelectedPrioritySc("");
        setSponsorNameSc("");
        setEstimatedCostSc("");
        setRemarksSc("");
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
                    <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
                        {showIcons && (
                            <>
                                <span
                                    className="icon mx-2"
                                    onClick={() => handleUpdate(params.data, params.node.data)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => handleDelete(params.data)}
                                    style={{ cursor: 'pointer' }}
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
            headerName: "Visa Request ID",
            field: "visa_request_id",
            editable: false
        },
        {
            headerName: "Employee ID",
            field: "employee_id",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: empIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = empIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Passport ID",
            field: "passport_id",
            editable: true
        },
        {
            headerName: "Country ID",
            field: "destination_country_id",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: countryIdDropGrid.map(d => d.value),
            },
            valueFormatter: (params) => {
                const dept = countryIdDropGrid.find(d => d.value === params.value);
                return dept ? dept.label : params.value;
            },
        },
        {
            headerName: "Visa Type",
            field: "visa_type_id",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: visaTypeDropGrid,
            },
        },
        {
            headerName: "Purpose",
            field: "purpose",
            editable: true
        },
        {
            headerName: "Travel Start Date",
            field: "travel_start_date",
            editable: true
        },
        {
            headerName: "Travel End Date",
            field: "travel_end_date",
            editable: true
        },
        {
            headerName: "Request Status",
            field: "request_status",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: reqStatusDropGrid,
            },
        },
        {
            headerName: "Request Number",
            field: "request_number",
            editable: true
        },
        {
            headerName: "Priority Level",
            field: "priority_level",
            editable: true,
            cellStyle: { textAlign: "left" },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: priorityDropGrid,
            },
        },
        {
            headerName: "Sponsor Name",
            field: "sponsor_name",
            editable: true
        },
        {
            headerName: "Estimated Cost",
            field: "estimated_cost",
            editable: true
        },
        {
            headerName: "Remarks",
            field: "Remarks",
            editable: true
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: true,
            hide: true
        }
    ]

    const gridOptions = {
        pagination: true,
        paginationPageSize: 10,
    };

    const handleSave = async () => {
        if (!visaRequestId ||
            !empId ||
            !passportId ||
            !visaType ||
            !travelStartDate ||
            !travelEndDate ||
            !reqStatus ||
            !priority ||
            !estimatedCost
        ) {
            setError(" ");
            toast.warning("Error: Missing required fields");
            return;
        }

        if (new Date(travelStartDate) > new Date(travelEndDate)) {
            toast.warning("Start Date cannot be greater than End Date");
            return;
        }

        setLoading(true);

        try {
            const Header = {
                visa_request_id: visaRequestId,
                employee_id: empId,
                passport_id: passportId,
                destination_country_id: countryId,
                visa_type_id: visaType,
                purpose: purpose,
                travel_start_date: travelStartDate,
                travel_end_date: travelEndDate,
                request_status: reqStatus,
                request_number: reqNumber,
                priority_level: priority,
                sponsor_name: sponsorName,
                estimated_cost: estimatedCost,
                Remarks: remarks,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                Created_by: sessionStorage.getItem('selectedUserCode')
            };
            const response = await fetch(`${config.apiBaseUrl}/visa_requestsInsert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Header),
            });
            if (response.ok) {
                console.log("Data inserted successfully");
                toast.success("Data inserted successfully!", {
                    onClose: () => window.location.reload(),
                });
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            toast.error('Error inserting data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const body = {
                visa_request_id: visaRequestIdSc,
                employee_id: empIdSc,
                passport_id: passportIdSc,
                destination_country_id: countryIdSc,
                visa_type_id: visaTypeSc,
                purpose: purposeSc,
                travel_start_date: travelStartDateSc,
                travel_end_date: travelEndDateSc,
                request_status: reqStatusSc,
                request_number: reqNumberSc,
                priority_level: prioritySc,
                sponsor_name: sponsorNameSc,
                estimated_cost: estimatedCostSc ? estimatedCostSc : 0,
                Remarks: remarksSc,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
            };

            const response = await fetch(`${config.apiBaseUrl}/visaRequestSearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const fetchedData = await response.json();
                setRowData(fetchedData);
            } else if (response.status === 404) {
                console.log("Data Not found");
                toast.warning("Data Not found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    };

    const reloadGridData = () => {
        setRowData([]);
        searchClearInputFields();
    };

    const handleUpdate = async (rowData) => {

        showConfirmationToast(
            "Are you sure you want to update the selected visa request data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const Modified_by = sessionStorage.getItem("selectedUserCode");

                    const dataToSend = {
                        visa_requestsData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                Modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    Modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/visa_requestsLoopUpdate`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(dataToSend),
                        },
                    );

                    if (response.ok) {
                        toast.success("Visa request updated successfully", {
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
            "Are you sure you want to delete the selected visa request data?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");

                    const dataToSend = {
                        visa_requestsData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/visa_requestsLoopDelete`,
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
                        toast.success("Visa request deleted successfully", {
                            onClose: () => handleSearch(), // refresh data
                        });
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Delete failed");
                    }
                } catch (error) {
                    console.error("Error deleting visa request rows:", error);
                    toast.error("Error deleting visa request data: " + error.message);
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
        return data.map((row) => {
            const empObj = empIdDropGrid.find(
                (d) => d.value === row.employee_id
            );

            const empName = empObj
                ? empObj.label.split(" - ").slice(1).join(" - ")
                : "";

            const countryObj = countryIdDropGrid.find(
                (d) => d.value === row.destination_country_id
            );

            const countryName = countryObj
                ? countryObj.label.split(" - ").slice(1).join(" - ")
                : "";

            return {
                "Visa Request ID": row.visa_request_id || "",
                "Employee ID": `${row.employee_id} - ${empName}` || "",
                "Passport ID": row.passport_id || "",
                "Country ID": `${row.destination_country_id} - ${countryName}` || "",
                "Visa Type": row.visa_type_id || "",
                "Purpose": row.purpose || "",
                "Travel Start Date": row.travel_start_date || "",
                "Travel End Date": row.travel_end_date || "",
                "Request Status": row.request_status || "",
                "Request Number": row.request_number || "",
                "Priority Level": row.priority_level || "",
                "Sponsor Name": row.sponsor_name || "",
                "Estimated Cost": row.estimated_cost || "",
                "Remarks": row.Remarks || "",
            };
        });
    };

    const handleExportToExcel = () => {
        if (!rowData || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        const screenName = "Visa Request Search Report";
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Visa Request");

        XLSX.writeFile(workbook, "Visa_Request_Search_Report.xlsx");
    };

    return (
        <div class="container-fluid Topnav-screen ">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Visa Request</h1>
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
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                autoComplete="off"
                                value={visaRequestId}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setVisaRequestId(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !visaRequestId ? 'text-danger' : ''}`}>Visa Request ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmpId ? "has-value" : ""} 
                            ${isSelectedEmpId ? "is-focused" : ""}`}
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectedEmpId(true)}
                                onBlur={() => setIsSelectedEmpId(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedEmpId}
                                onChange={handleChangeEmpId}
                                options={filteredOptionEmpId}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label ${error && !empId ? 'text-danger' : ''}`}>
                                Employee ID<span className="text-danger">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={passportId}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setPassportId(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !passportId ? 'text-danger' : ''}`}>Passport ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCountryId ? "has-value" : ""} 
                            ${isSelectedCountryId ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedCountryId(true)}
                                onBlur={() => setIsSelectedCountryId(false)}
                                isClearable
                                value={selectedCountryId}
                                onChange={handleChangeCountryId}
                                options={filteredOptionCountryId}
                            />
                            <label for="sname" className={`floating-label ${error && !countryId ? 'text-danger' : ''}`}>Country ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedVisaType ? "has-value" : ""} 
                            ${isSelectedVisaType ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedVisaType(true)}
                                onBlur={() => setIsSelectedVisaType(false)}
                                isClearable
                                value={selectedVisaType}
                                onChange={handleChangeVisaType}
                                options={filteredOptionVisaType}
                            />
                            <label for="sname" className={`floating-label ${error && !visaType ? 'text-danger' : ''}`}>Visa Type ID<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={purpose}
                                maxLength={100}
                                onChange={(e) => setPurpose((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Purpose</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={travelStartDate}
                                onChange={(e) => setTravelStartDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !travelStartDate ? 'text-danger' : ''}`}>Travel Start Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={travelEndDate}
                                onChange={(e) => setTravelEndDate((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !travelEndDate ? 'text-danger' : ''}`}>Travel End Date<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedReqStatus ? "has-value" : ""} 
                            ${isSelectedReqStatus ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedReqStatus(true)}
                                onBlur={() => setIsSelectedReqStatus(false)}
                                isClearable
                                value={selectedReqStatus}
                                onChange={handleChangeReqStatus}
                                options={filteredOptionReqStatus}
                            />
                            <label for="sname" className={`floating-label ${error && !reqStatus ? 'text-danger' : ''}`}>Request Status<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder=""
                                required 
                                autoComplete="off"
                                value={reqNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setReqNumber(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Request Number</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPriority ? "has-value" : ""} 
                            ${isSelectedPriority ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPriority(true)}
                                onBlur={() => setIsSelectedPriority(false)}
                                isClearable
                                value={selectedPriority}
                                onChange={handleChangePriority}
                                options={filteredOptionPriority}
                            />
                            <label for="sname" className={`floating-label ${error && !priority ? 'text-danger' : ''}`}>Priority Level<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={sponsorName}
                                maxLength={150}
                                onChange={(e) => setSponsorName((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Sponsor Name</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={estimatedCost}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setEstimatedCost(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels ${error && !estimatedCost ? 'text-danger' : ''}`}>Estimated Cost<span className="text-danger">*</span></label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={remarks}
                                maxLength={255}
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
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={visaRequestIdSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setVisaRequestIdSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Visa Request ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedEmpIdSc ? "has-value" : ""} 
                            ${isSelectedEmpIdSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="department"
                                placeholder=" "
                                onFocus={() => setIsSelectedEmpIdSc(true)}
                                onBlur={() => setIsSelectedEmpIdSc(false)}
                                classNamePrefix="react-select"
                                isClearable
                                type="text"
                                value={selectedEmpIdSc}
                                onChange={handleChangeEmpIdSc}
                                options={filteredOptionEmpIdSc}
                            />
                            <label htmlFor="selecteddpt" className={`floating-label`}>
                                Employee ID
                            </label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={passportIdSc}
                                 onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setPassportIdSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Passport ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedCountryIdSc ? "has-value" : ""} 
                            ${isSelectedCountryIdSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedCountryIdSc(true)}
                                onBlur={() => setIsSelectedCountryIdSc(false)}
                                isClearable
                                value={selectedCountryIdSc}
                                onChange={handleChangeCountryIdSc}
                                options={filteredOptionCountryIdSc}
                            />
                            <label for="sname" className={`floating-label`}>Country ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedVisaTypeSc ? "has-value" : ""} 
                            ${isSelectedVisaTypeSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedVisaTypeSc(true)}
                                onBlur={() => setIsSelectedVisaTypeSc(false)}
                                isClearable
                                value={selectedVisaTypeSc}
                                onChange={handleChangeVisaTypeSc}
                                options={filteredOptionVisaTypeSc}
                            />
                            <label for="sname" className={`floating-label`}>Visa Type ID</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={purposeSc}
                                maxLength={100}
                                onChange={(e) => setPurposeSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Purpose</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={travelStartDateSc}
                                onChange={(e) => setTravelStartDateSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Travel Start Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="date"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={travelEndDateSc}
                                onChange={(e) => setTravelEndDateSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Travel End Date</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedReqStatusSc ? "has-value" : ""} 
                            ${isSelectedReqStatusSc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedReqStatusSc(true)}
                                onBlur={() => setIsSelectedReqStatusSc(false)}
                                isClearable
                                value={selectedReqStatusSc}
                                onChange={handleChangeReqStatusSc}
                                options={filteredOptionReqStatusSc}
                            />
                            <label for="sname" className={`floating-label`}>Request Status</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={15}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={reqNumberSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setReqNumberSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Request Number</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div
                            className={`inputGroup selectGroup 
                            ${selectedPrioritySc ? "has-value" : ""} 
                            ${isSelectedPrioritySc ? "is-focused" : ""}`}
                        >
                            <Select
                                id="country"
                                type="text"
                                classNamePrefix="react-select"
                                placeholder=""
                                onFocus={() => setIsSelectedPrioritySc(true)}
                                onBlur={() => setIsSelectedPrioritySc(false)}
                                isClearable
                                value={selectedPrioritySc}
                                onChange={handleChangePrioritySc}
                                options={filteredOptionPrioritySc}
                            />
                            <label for="sname" className={`floating-label`}>Priority Level</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={sponsorNameSc}
                                maxLength={150}
                                onChange={(e) => setSponsorNameSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Sponsor Name</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={estimatedCostSc}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); 
                                    setEstimatedCostSc(value);
                                }}
                            />
                            <label for="sname" className={`exp-form-labels`}>Estimated Cost</label>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                id="fdate"
                                class="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please Enter the Annual Bonus"
                                autoComplete="off"
                                value={remarksSc}
                                maxLength={255}
                                onChange={(e) => setRemarksSc((e.target.value))}
                            />
                            <label for="sname" className={`exp-form-labels`}>Remarks</label>
                        </div>
                    </div>

                    {/* Search + Reload Buttons */}
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

            <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
                <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        pagination={true}
                        paginationAutoPageSize={true}
                        gridOptions={gridOptions}
                    />
                </div>
            </div>


        </div>
    );
}
export default VisaRequest;