import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from "../ToastConfirmation";
import LoadingScreen from "../Loading";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
const config = require("../Apiconfig");

function LoanDocuments({}) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [remarksSc, setRemarksSc] = useState("");

  const [loanReqId, setLoanReqId] = useState("");
  const [loanReqIdSC, setLoanReqIdSC] = useState("");
  const [selectedLoanReq, setSelectedLoanReq] = useState(null);
  const [selectedLoanReqSC, setSelectedLoanReqSC] = useState(null);
  const [loanReqIdDrop, setLoanReqIdDrop] = useState([]);
  const [isLoanReqFocus, setIsLoanReqFocus] = useState(false);
  const [isLoanReqFocusSC, setIsLoanReqFocusSC] = useState(false);
  const [document_id, setdocument_id] = useState("");
  const [document_type, setdocument_type] = useState("");
  const [file_path, setfile_path] = useState("");
  const [uploaded_by, setuploaded_by] = useState([]);
  const [selectedStatus, setselectedStatus] = useState("");
  const [selectedStatusSC, setselectedStatusSC] = useState("");
  const [ApprovalStatus, setApprovalStatus] = useState("");
  const [ApprovalStatusSC, setApprovalStatusSC] = useState("");
  const [uploaded_at, setuploaded_at] = useState("");
  const [approval_dateSC, setapproval_dateSC] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remarksSC, setRemarksSC] = useState("");
  const [statusDrop, setstatusDrop] = useState([]);
  const [statusDropSC, setstatusDropSC] = useState([]);
  const [isSearchStatus, setIsSearchStatus] = useState(false);
  const [isSearchStatusSC, setIsSearchStatusSC] = useState(false);

  const [approval_idSC, setapproval_idSC] = useState("");
  const [approver_idSC, setapprover_idSC] = useState("");
  const [approval_levelSC, setapproval_levelSC] = useState("");
  const [empIdDropSc, setEmpIdDropSc] = useState([]);



  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDropSC(val));
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
      .then((val) => setLoanReqIdDrop(val));
  }, []);

    useEffect(() => {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
  
          fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ company_code }),
          })
              .then((data) => data.json())
              .then((val) => {
                  const emp = val.map((option) => ({
                      value: option.attributedetails_name,
                      label: `${option.attributedetails_name}`,
                  }));
                  setstatusDrop(emp);
              })
              .catch((error) => console.error("Error fetching data:", error));
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

      setLoanReqIdDrop(loan);
    })
    .catch((error) => console.error("Error fetching loan request:", error));
}, []);


  const filteredOptionLoanReqId = loanReqIdDrop.map((option) => ({
    value: option.loan_request_id,
    label: option.loan_request_id,
  }));

  const filterOptionStatus = statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filterOptionStatusSC = statusDropSC.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleStatus = (SelectedStatus) => {
    setselectedStatus(SelectedStatus);
    setApprovalStatus(SelectedStatus ? SelectedStatus.value : "");
  };

  const handleStatusSC = (SelectedStatus) => {
    setselectedStatusSC(SelectedStatus);
    setApprovalStatusSC(SelectedStatus ? SelectedStatus.value : "");
  };

  const handleLoanReq = (SelectedLoanReq) => {
    setSelectedLoanReq(SelectedLoanReq);
    setLoanReqId(SelectedLoanReq ? SelectedLoanReq.value : "");
  };

  const handleLoanReqSC = (SelectedLoanReq) => {
    setSelectedLoanReqSC(SelectedLoanReq);
    setLoanReqIdSC(SelectedLoanReq ? SelectedLoanReq.value : "");
  };

  const searchClearInputFields = () => {
    setRemarksSc("");
    setapproval_idSC("");
    setLoanReqIdSC("");
    setSelectedLoanReqSC("");
    setapprover_idSC("");
    setapproval_levelSC("");
    setselectedStatusSC("");
    setApprovalStatusSC("");
    setapproval_dateSC("");
  };


const columnDefs = [
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params) => {
      const cellWidth = params.column.getActualWidth();
      const showIcons = cellWidth > 20;

      return (
        <div
          className="position-relative d-flex align-items-center"
          style={{ minHeight: "100%", justifyContent: "center" }}
        >
          {showIcons && (
            <>
              <span
                className="icon mx-2"
                onClick={() => handleUpdate(params.data)}
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
    headerName: "Approval ID",
    field: "approval_id",
    editable: false,
  },

  {
  headerName: "Loan Request ID",
  field: "loan_request_id",
  editable: true,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: {
    values: loanReqIdDrop.map((d) => d.value),
  },
  valueFormatter: (params) => {
    const loan = loanReqIdDrop.find((d) => d.value === params.value);
    return loan ? loan.label : params.value;
  },
},

  {
    headerName: "Approver ID",
    field: "approver_id",
    editable: true,
  },

  {
    headerName: "Approval Level",
    field: "approval_level",
    editable: true,
  },

  {
  headerName: "Approval Status",
  field: "approval_status",
  editable: true,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: {
    values: statusDrop.map((d) => d.value),
  },
  valueFormatter: (params) => {
    const status = statusDrop.find((d) => d.value === params.value);
    return status ? status.label : params.value;
  },
},

  {
    headerName: "Approval Date",
    field: "approval_date",
    editable: true,
  },

  {
    headerName: "Remarks",
    field: "remarks",
    editable: true,
  },

  {
    headerName: "Company Code",
    field: "company_code",
    editable: false,
    hide: true,
  },

  {
    headerName: "Created By",
    field: "created_by",
    editable: false,
    hide: true,
  },

  {
    headerName: "Created Date",
    field: "created_date",
    editable: false,
    hide: true,
  },

  {
    headerName: "Keyfield",
    field: "keyfield",
    hide: true,
  },
];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

const handleSave = async () => {
  setLoading(true);

  try {
    const Header = {
    //   approval_id: approval_id,
    //   loan_request_id: loanReqId,
    //   approver_id: approver_id,
    //   approval_level: approval_level,
    //   approval_status: ApprovalStatus,
    //   approval_date: approval_date,
    //   remarks: remarks,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      keyfield: '',
      created_by: sessionStorage.getItem("selectedUserCode"),
    };

    const response = await fetch(`${config.apiBaseUrl}/loan_approvalsInsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Header),
    });

    if (response.ok) {
      console.log("Loan approval inserted successfully");
      toast.success("Loan Approval Saved Successfully!", {
        onClose: () => window.location.reload(),
      });
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to insert loan approval");
      console.error(errorResponse.details || errorResponse.message);
    }
  } catch (error) {
    console.error("Error inserting loan approval:", error);
    toast.error("Error inserting data: " + error.message);
  } finally {
    setLoading(false);
  }
};

const handleSearch = async () => {
  setLoading(true);

  try {
    const body = {
    //   approval_id: approval_idSC ? approval_idSC : 0,
    //   loan_request_id: loanReqIdSC ? loanReqIdSC : 0,
    //   approver_id: approver_idSC ? approver_idSC : 0,
    //   approval_level: approval_levelSC ? approval_levelSC : 0,
    //   approval_status: ApprovalStatusSC || "",
    //   approval_date: approval_dateSC || "",
    //   remarks: remarksSc || "",
      company_code: sessionStorage.getItem("selectedCompanyCode"),
    };

    const response = await fetch(`${config.apiBaseUrl}/loan_approvalsSearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const fetchedData = await response.json();
      setRowData(fetchedData);
    } 
    else if (response.status === 404) {
      toast.warning("Data Not Found");
      setRowData([]);
    } 
    else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Search failed");
      console.error(errorResponse.details || errorResponse.message);
      setRowData([]);
    }

  } catch (error) {
    console.error("Error fetching search data:", error);
    toast.error("Error fetching search data");
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
      "Are you sure you want to update the selected loan request data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            loan_approvalsData: Array.isArray(rowData)
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

          const response = await fetch(
            `${config.apiBaseUrl}/loan_approvalsLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("loan approval updated successfully", {
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
      "Are you sure you want to delete the selected loan request data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem("selectedCompanyCode");

          const dataToSend = {
            loan_approvalsData: Array.isArray(rowData)
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

          const response = await fetch(
            `${config.apiBaseUrl}/loan_approvalsLoopDelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                company_code: company_code,
              },
              body: JSON.stringify(dataToSend),
            },
          );

          if (response.ok) {
            toast.success("Loan approval deleted successfully", {
              onClose: () => handleSearch(), // refresh data
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Delete failed");
          }
        } catch (error) {
          console.error("Error deleting loan approval rows:", error);
          toast.error("Error deleting loan approval data: " + error.message);
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
      return {
        "Approval ID": row.approval_id || "",
        "Loan Request ID": row.loan_request_id || "",
        "Approver ID": row.approver_id || "",
        "Approval Level": row.approval_level || "",
        "Approval Status": row.approval_status || "",
        "Approval Date": row.approval_date || "",
        "Remarks": row.remarks || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Loan Approval Search Report";
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
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: Object.keys(transformedData[0]).length - 1 },
      },
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
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

        if (!cell) continue;

        cell.s = {
          font: { color: { rgb: fontColor } },
          fill: R % 2 === 0 ? { fgColor: { rgb: altRowBg } } : undefined,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Approvals");

    XLSX.writeFile(workbook, "Loan_Approval.xlsx");
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Loan Documents</h1>
          <div className="action-wrapper">
            {/* <div onClick={handleSave} className="action-icon add">
              <span className="tooltip">Save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div> */}
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
                type="number"
                placeholder=""
                required
                autoComplete="off"
                value={document_id}
                onChange={(e) => setdocument_id(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !document_id ? "text-danger" : ""}`}
              >
                Document ID<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedLoanReq ? "has-value" : ""} 
                ${isLoanReqFocus ? "is-focused" : ""}`}
            >
              <Select
                id="loanReq"
                value={selectedLoanReq}
                onChange={handleLoanReq}
                options={filteredOptionLoanReqId}
                placeholder=" "
                onFocus={() => setIsLoanReqFocus(true)}
                onBlur={() => setIsLoanReqFocus(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className="floating-label">Loan Request ID</label>
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
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={document_type}
                onChange={(e) => setdocument_type(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Document Type
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
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={file_path}
                onChange={(e) => setfile_path(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !file_path ? "text-danger" : ""}`}
              >
                File Path<span className="text-danger">*</span>
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
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={uploaded_by}
                onChange={(e) => setuploaded_by(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !uploaded_by ? "text-danger" : ""}`}
              >
                Uploaded By<span className="text-danger">*</span>
              </label>
            </div>
          </div>


          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={uploaded_at}
                onChange={(e) => setuploaded_at(e.target.value)}
              />
              <label
                for="sname"
                className={`exp-form-labels ${error && !uploaded_at ? "text-danger" : ""}`}
              >
                Uploaded Date<span className="text-danger">*</span>
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
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <label htmlFor="sname" className={`exp-form-labels`}>
                Remarks
              </label>
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
                type="number"
                placeholder=""
                required
                autoComplete="off"
                value={approval_idSC}
                onChange={(e) => setapproval_idSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels `}>
                Approval ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedLoanReqSC ? "has-value" : ""} 
                ${isLoanReqFocusSC ? "is-focused" : ""}`}
            >
              <Select
                id="loanReq"
                value={selectedLoanReqSC}
                onChange={handleLoanReqSC}
                options={filteredOptionLoanReqId}
                placeholder=" "
                onFocus={() => setIsLoanReqFocusSC(true)}
                onBlur={() => setIsLoanReqFocusSC(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className="floating-label">Loan Request ID</label>
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
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={approver_idSC}
                onChange={(e) => setapprover_idSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Approver ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={approval_levelSC}
                onChange={(e) => setapproval_levelSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Approval Level
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedStatusSC ? "has-value" : ""} 
                ${isSearchStatusSC ? "is-focused" : ""}`}
            >
              <Select
                id="Select_slots"
                value={selectedStatusSC}
                onChange={handleStatusSC}
                options={filterOptionStatusSC}
                placeholder=" "
                onFocus={() => setIsSearchStatusSC(true)}
                onBlur={() => setIsSearchStatusSC(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label className="floating-label">Approval Status</label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={approval_dateSC}
                onChange={(e) => setapproval_dateSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Approval Date
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
                required
                title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={remarksSC}
                onChange={(e) => setRemarksSC(e.target.value)}
              />
              <label htmlFor="sname" className={`exp-form-labels`}>
                Remarks
              </label>
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

      <div
        className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box"
        style={{ width: "100%" }}
      >
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
export default LoanDocuments;
