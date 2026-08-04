import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format } from 'date-fns';
import LoadingScreen from '../Loading';
import { XCircle } from 'lucide-react';
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

const ApplyLeave = () => {
  const [LeaveType, setLeaveType] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [Reason, setReason] = useState("");
  const [Select_slots, setSelect_Slots] = useState("");
  const [AlternativeReponsablePerson, setReasponsiblePerson] = useState("");
  const [ReportingManager, setReportingManager] = useState("");
  const [LeaveDrop, setLeaveDrop] = useState([]);
  const [SelectedLeave, setSelectedLeave] = useState("");
  const navigate = useNavigate();
  const [SlotDrop, setSlotDrop] = useState([]);
  const [SelectedSlot, setSelectedSlot] = useState("");
  const [rowData, setrowData] = useState([]);
  const [error, setError] = useState(false);
  const [Managerdrop, setManagerdrop] = useState([]);
  const [selectedmanager, setselectedmanager] = useState('');
  const gridRef = useRef()
  const [loading, setLoading] = useState(false);
  const [isSelectLeave, setIsSelectLeave] = useState(false);
  const [isSelectSlot, setIsSelectSlot] = useState(false);
  const [isSelectManager, setIsSelectManager] = useState(false);
  const [isSearchLeave, setIsSearchLeave] = useState(false);
  const [isSearchStatus, setIsSearchStatus] = useState(false);
  const [compOffOptions, setCompOffOptions] = useState([]);
  const [selectedCompOff, setSelectedCompOff] = useState(null);
  const [isSelectCompOff, setIsSelectCompOff] = useState(false);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getapplyLeavetype`,{
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //   company_code: sessionStorage.getItem("selectedCompanyCode"),
  //   })
  // })
  //     .then((data) => data.json())
  //     .then((val) => setLeaveDrop(val));
  // }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        EmployeeId: sessionStorage.getItem("selectedUserCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveDrop(val))
  }, []);

  const filterOptionLeaveType = LeaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }));


  const handleLeaveType = async (SelectedLeave) => {
    setSelectedLeave(SelectedLeave);
    const value = SelectedLeave ? SelectedLeave.value : '';
    setLeaveType(value);

    if (value === "Comp Off") {
      if (FromDate) {
        setToDate(FromDate);
      }

      try {
        const res = await fetch(`${config.apiBaseUrl}/getCompOffDropdown`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            EmployeeId: sessionStorage.getItem("selectedUserCode"),
            CompanyCode: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await res.json();

        const formatted = data.map(item => ({
          value: item.HolidayDate,
          // label: `${item.HolidayDate} - ${item.HolidayName}`,
          label: `${item.HolidayName}`,
        }));

        setCompOffOptions(formatted);

      } catch (err) {
        console.error("Comp Off fetch failed");
      }
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSelectslot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSlotDrop(val));
  }, []);


  // useEffect(() => {
  // //   fetch(`${config.apiBaseUrl}/getSelectslot`)
  //  .then((data) => data.json())
  //     .then((val) => setSlotDrop(val));
  // }, []);


  const filterOptionSelect_Slots = SlotDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleSelect_Slots = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
    setSelect_Slots(selectedSlot ? selectedSlot.value : '');
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    validateDates(FromDate, e.target.value);
  };

  const handleFromDate = (e) => {
    const selectedDate = e.target.value;

    setFromDate(selectedDate);

    if (LeaveType === "Comp Off") {
      setToDate(selectedDate);
    } else {
      validateDates(selectedDate, ToDate);
    }
  };

  const validateDates = (FromDate, ToDate) => {
    if (FromDate && ToDate) {
      const fromDateObj = new Date(FromDate);
      const toDateObj = new Date(ToDate);

      if (fromDateObj > toDateObj) {
        toast.warning("From Date should not be after To Date");
      }
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getEmployeeTotalLeaveBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem('selectedLocationCode'),
      }),
    })
      .then((data) => data.json())
      .then((val) => setrowData(val));
  }, []);

  const calculateLeaveDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const diffTime = toDate - fromDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

    return diffDays;
  };

  // const formatToBackendDate = (date) => {
  //   const [day, month, year] = date.split("-");
  //   return `${year}-${month}-${day}`;
  // };

  const formatToBackendDate = (dateValue) => {
    if (!dateValue) return "";
    return format(new Date(dateValue), "yyyy-MM-dd");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!LeaveType ||
      !FromDate ||
      !ToDate ||
      !Reason ||
      !ReportingManager ||
      !AlternativeReponsablePerson) {
      setError(true);
      toast.warning("Error: Missing required fields");
      return;
    }

    const fromDateObj = new Date(FromDate);
    const toDateObj = new Date(ToDate);

    if (fromDateObj > toDateObj) {
      toast.warning("From Date should not be after To Date");
    }

    const appliedDays = calculateLeaveDays(FromDate, ToDate);

    // const selectedLeaveBalance = rowData.find(
    //   (item) => item.leavetype === LeaveType
    // );

    // if (!selectedLeaveBalance) {
    //   toast.error("Leave type not found in balance");
    //   return;
    // }

    // const available = selectedLeaveBalance.availableleave;

    const selectedLeaveBalance = rowData.find(
      (item) =>
        item.LeaveId === LeaveType ||
        item.LeaveName === LeaveType
    );

    if (!selectedLeaveBalance) {
      toast.error("Leave type not found in balance");
      return;
    }

    const available = selectedLeaveBalance.AvailableLeave || 0;

    if (appliedDays > available) {
      toast.warning(
        `Only ${available} leave(s) available. You are applying ${appliedDays} days`
      );
      return;
    }

    if (LeaveType === "Comp Off" && !selectedCompOff) {
      toast.warning("Please select Comp Off");
      return;
    }

    const formData = {
      LeaveType,
      FromDate,
      ToDate,
      Select_slots,
      Reason,
      ReportingManager,
      EmployeeId: sessionStorage.getItem("selectedUserCode"),
      company_code: sessionStorage.getItem('selectedCompanyCode'),
      Location_Code: sessionStorage.getItem('selectedLocationCode'),
      created_by: sessionStorage.getItem("selectedUserCode"),
      AlternativeReponsablePerson,
      HolidayDate: LeaveType === "Comp Off" && selectedCompOff
        ? formatToBackendDate(selectedCompOff.value)
        : null,

      HolidayName: LeaveType === "Comp Off" && selectedCompOff
        ? selectedCompOff.label
        : null
    };
    setLoading(true);
    try {

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeLeave`, {
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

  const [columnDefs] = useState([
    { headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1, width: 40, cellStyle: { textAlign: "center" }, },
    { headerName: 'Leave Type', field: 'LeaveId', sortable: true, filter: true, },
    { headerName: 'Current No of Leaves', field: 'CurrentYearCredit', sortable: true, filter: true },
    { headerName: 'Taken Current Year', field: 'TakenCurrentYear', sortable: true, filter: true },
    { headerName: 'Previous Year Balance', field: 'PreviousYearBalance', sortable: true, filter: true },
    { headerName: 'Taken Previous Year', field: 'TakenPreviousYear', sortable: true, filter: true },
    { headerName: 'No of Available Leaves', field: 'AvailableLeave', sortable: true, filter: true },
    { headerName: 'Non CarryForward Balance', field: 'NonCarryForwardBalance', sortable: true, filter: true },
  ]);


  const goBack = () => {
    navigate('/EmployeeDashboard');
  };

  const handleClose = () => {
    setOpen(false);

  };

  const [open, setOpen] = React.useState(false);

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setReportingManager(selectedOption ? selectedOption.value : '');
  };

  const [leaveRowData, setLeaveRowData] = useState([]);
  const [leaveDrop, setleaveDrop] = useState([]);
  const [statusDrop, setstatusDrop] = useState([]);
  const [leaveType, setleaveType] = useState("");
  const [selectedLeave, setselectedLeave] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [LeaveStatus, setleaveStatus] = useState("");

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
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Location_Code: sessionStorage.getItem('selectedLocationCode'),
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
      headerName: "S.No", valueGetter: (params) => params.node.rowIndex + 1,
      width: 80, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Request Type", field: "RequestType",
      cellStyle: { textAlign: "center" }, editable: false,
    },
    {
      headerName: "Leave Type", field: "LeaveType",
      cellStyle: { textAlign: "center" }, editable: false,
    },
    {
      headerName: "From Date", field: "FromDate",
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "To Date", field: "ToDate",
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Status", field: "LeaveStatus",
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Holiday Date", field: "HolidayDate",
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Holiday Name", field: "HolidayName",
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Leave Used", field: "LeaveUsed", hide: true,
      editable: false, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Is Leave Applied", field: "IsLeaveApplied", editable: false,
      hide: true, cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Action", field: "action", width: 160,
      cellStyle: { textAlign: "center" }, sortable: false, filter: false,
      cellRenderer: (params) => {
        const row = params.data;

        if (row.RequestType === "Comp Off" && row.LeaveUsed === "No" && row.LeaveStatus === "Approved") {
          return (
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleConfirm(row)}
            >
              Apply
            </button>
          );
        }

        const reapplyStatuses = ["Cancelled", "Rejected"];

        if (
          row.RequestType === "Leave" &&
          reapplyStatuses.includes(row.LeaveStatus)
        ) {
          return (
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={() => handleConfirm(row)}
            >
              Re-Apply
            </button>
          );
        }

        if (row.RequestType === "Leave" && row.LeaveStatus !== "Cancelled") {
          return <CancelActionRenderer {...params} />;
        }

        return null;
      },
      tooltipValueGetter: (params) => {
        return params.data.LeaveStatus === 'Cancelled'
          ? "This request has already been cancelled."
          : "Click to cancel this leave request.";
      }
    },
  ];

  const handleSearchItem = async () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

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
          Location_Code: sessionStorage.getItem('selectedLocationCode'),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
          FromDate: fromDate ? fromDate : null,
          ToDate: toDate ? toDate : null,
          LeaveStatus: LeaveStatus,
          LeaveType: leaveType
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
    setfromDate('');
    settoDate('');
    setleaveStatus('');
    setleaveType('');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        EmployeeId: sessionStorage.getItem("selectedUserCode")
      }),
    })
      .then((data) => data.json())
      .then((val) => setleaveDrop(val))
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
      .then((val) => setstatusDrop(val))
  }, []);

  const filterOptionLeaves = [{ value: 'All', label: 'All' }, ...leaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }))];

  const filterOptionStatus = [{ value: 'All', label: 'All' }, ...statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleLeaves = (SelectedLeave) => {
    setselectedLeave(SelectedLeave);
    setleaveType(SelectedLeave ? SelectedLeave.value : '');
  };

  const handleStatus = (SelectedStatus) => {
    setselectedStatus(SelectedStatus);
    setleaveStatus(SelectedStatus ? SelectedStatus.value : '');
  };

  const handleConfirm = async () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select a row to load data");
      return;
    }

    const row = selectedRows[0];

    if (row.RequestType === "Leave" && row.LeaveStatus === "Approved") {
      toast.error("Leave already approved");
      return;
    }

    if (row.RequestType === "Comp Off" && row.LeaveUsed === "Yes") {
      toast.error("Comp Off already used");
      return;
    }

    setSelectedLeave({
      value: row.LeaveType,
      label: row.LeaveType,
    });

    setLeaveType(row.LeaveType)

    if (row.LeaveType === "Comp Off") {
      try {
        const res = await fetch(`${config.apiBaseUrl}/getCompOffDropdown`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeeId: sessionStorage.getItem("selectedUserCode"),
            CompanyCode: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await res.json();

        const formatted = data.map(item => ({
          value: item.HolidayDate,
          label: `${item.HolidayName}`,
        }));

        setCompOffOptions(formatted);

      } catch (err) {
        console.error("Comp Off fetch failed", err);
      }
    }

    setSelectedCompOff({
      value: formatToBackendDate(row.HolidayDate),
      label: row.HolidayName,
    });

    setFromDate(row.FromDate ? format(new Date(row.FromDate), "yyyy-MM-dd") : "");
    setToDate(row.ToDate ? format(new Date(row.ToDate), "yyyy-MM-dd") : "");
    setleaveStatus(row.LeaveStatus || "");
  };

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // flex: 1
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Apply Leave</h1>
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

          <div className="col-md-6">
            <div className="row g-3">

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
                  ${SelectedLeave ? "has-value" : ""} 
                  ${isSelectLeave ? "is-focused" : ""}`}
                  title="Please Select the Leave Type"
                >
                  <Select
                    id="LeaveType"
                    value={SelectedLeave}
                    onChange={handleLeaveType}
                    options={filterOptionLeaveType}
                    placeholder=" "
                    onFocus={() => setIsSelectLeave(true)}
                    onBlur={() => setIsSelectLeave(false)}
                    classNamePrefix="react-select"
                    isClearable
                  />
                  <label className={`floating-label ${error && !LeaveType ? 'text-danger' : ''}`}>
                    Leave Type<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {LeaveType === "Comp Off" && (
                <div className="col-md-3">
                  <div
                    className={`inputGroup selectGroup 
                    ${selectedCompOff ? "has-value" : ""} 
                    ${isSelectCompOff ? "is-focused" : ""}`}
                    title="Please Select the Comp Off"
                  >
                    <Select
                      value={selectedCompOff}
                      onChange={(option) => setSelectedCompOff(option)}
                      options={compOffOptions}
                      placeholder=" "
                      onFocus={() => setIsSelectCompOff(true)}
                      onBlur={() => setIsSelectCompOff(false)}
                      classNamePrefix="react-select"
                      isClearable
                    />
                    <label className={`floating-label ${error && !selectedCompOff ? 'text-danger' : ''}`}>
                      Select Comp Off<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
                  ${SelectedSlot ? "has-value" : ""} 
                  ${isSelectSlot ? "is-focused" : ""}`}
                  title="Please Select the Slot"
                >
                  <Select
                    id="Select_slots"
                    value={SelectedSlot}
                    onChange={handleSelect_Slots}
                    options={filterOptionSelect_Slots}
                    placeholder=" "
                    onFocus={() => setIsSelectSlot(true)}
                    onBlur={() => setIsSelectSlot(false)}
                    classNamePrefix="react-select"
                    isClearable
                  />
                  <label className="floating-label">Select Slot</label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Select the From Date"
                    value={FromDate}
                    onChange={handleFromDate}
                    min={new Date().toISOString().split("T")[0]}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label className={`exp-form-labels ${error && !FromDate ? 'text-danger' : ''}`}>
                    From Date<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    type="date"
                    className="exp-input-field form-control"
                    title="Please Select the To Date"
                    value={ToDate}
                    onChange={handleToDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={LeaveType === "Comp Off"}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label className={`exp-form-labels ${error && !ToDate ? 'text-danger' : ''}`}>
                    To Date<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div className="col-md-12">
                <div className="inputGroup">
                  <textarea
                    className="form-control"
                    value={Reason}
                    onChange={(e) => setReason(e.target.value)}
                    title="Please Enter the Reason"
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
                  title="Please Select the Reporting Manager"
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
                    title="Please Enter the Responsible Person"
                    value={AlternativeReponsablePerson}
                    onChange={(e) => setReasponsiblePerson(e.target.value)}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label className={`exp-form-labels ${error && !AlternativeReponsablePerson ? 'text-danger' : ''}`}>
                    Responsible Person<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

            </div>
            <div class="col-12">
              {/* {leaveStatus !== "Pending" && leaveStatus !== "Approved" && (
                <button className="btn btn-primary" onClick={handleSave}>Apply</button>
              )}
              <button className="btn btn-secondary" onClick={handleadjustmentbtn}>
                Applied Leaves
              </button> */}

              <div className="search-btn-wrapper">
                <div className="icon-btn save" onClick={handleSave}>
                  <span className="tooltip">Apply</span>
                  <i className="fa-solid fa-floppy-disk"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="inputGroup">
              <h5>Leave Balance</h5>
              <div className="ag-theme-alpine" style={{ height: 220, width: "100%", borderRadius: "10px" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    minWidth: 180,
                    resizable: true,
                    sortable: true,
                    // filter: true,
                  }}
                />
              </div>
            </div>
          </div>
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
                title="Please Select the From Date"
                value={fromDate}
                placeholder=" "
                autoComplete="off"
                onChange={(e) => setfromDate(e.target.value)}
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
                title="Please Select the To Date"
                value={toDate}
                placeholder=" "
                autoComplete="off"
                onChange={(e) => settoDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
              />
              <label className="exp-form-labels">To Date</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedLeave ? "has-value" : ""} 
              ${isSearchLeave ? "is-focused" : ""}`}
              title="Please Select the Leave Type"
            >
              <Select
                id="LeaveType"
                value={selectedLeave}
                onChange={handleLeaves}
                options={filterOptionLeaves}
                placeholder=" "
                onFocus={() => setIsSearchLeave(true)}
                onBlur={() => setIsSearchLeave(false)}
                classNamePrefix="react-select"
                isClearable
                onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
              />
              <label className="floating-label">Leave Type</label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSearchStatus ? "is-focused" : ""}`}
              title="Please Select the Leave Status"
            >
              <Select
                id="Select_slots"
                value={selectedStatus}
                onChange={handleStatus}
                options={filterOptionStatus}
                placeholder=" "
                onFocus={() => setIsSearchStatus(true)}
                onBlur={() => setIsSearchStatus(false)}
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

              {/* <div className="icon-btn save" onClick={handleConfirm}>
                <span className="tooltip">Confirm</span>
                <i className="fa-solid fa-check"></i>
              </div> */}
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
      </div>
    </div>
  );
};

export default ApplyLeave;