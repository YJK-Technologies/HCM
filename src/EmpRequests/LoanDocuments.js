import React, { useState, useEffect, useRef } from "react";
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

function LoanDocuments({ }) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loanReqId, setLoanReqId] = useState("");
  const [loanReqIdSC, setLoanReqIdSC] = useState("");
  const [selectedLoanReq, setSelectedLoanReq] = useState(null);
  const [selectedLoanReqSC, setSelectedLoanReqSC] = useState(null);
  const [loanReqIdDrop, setLoanReqIdDrop] = useState([]);
  const [loanReqIdDropAG, setLoanReqIdDropAG] = useState([]);
  const [loanReqIdDropSC, setLoanReqIdDropSC] = useState([]);
  const [isLoanReqFocus, setIsLoanReqFocus] = useState(false);
  const [isLoanReqFocusSC, setIsLoanReqFocusSC] = useState(false);
  const [document_id, setdocument_id] = useState("");
  const [document_idSC, setdocument_idSC] = useState("");
  const [document_type, setdocument_type] = useState("");
  const [document_typeSC, setdocument_typeSC] = useState("");
  const [file_path, setfile_path] = useState("");
  const [file_pathSC, setfile_pathSC] = useState("");
  const [uploaded_by, setuploaded_by] = useState("");
  const [uploaded_bySC, setuploaded_bySC] = useState("");
  const [uploaded_at, setuploaded_at] = useState("");
  const [uploaded_atSC, setuploaded_atSC] = useState("");
  const [documentFile, setDocumentFile] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [documentTypeDrop, setDocumentTypeDrop] = useState([]);
  const [selectedDocumentIdType, setSelectedDocumentIdType] = useState('');
  const [DocumentIdType, setDocumentIdType] = useState('');
  const [isSelectDocumentType, setIsSelectDocumentType] = useState(false);

  const [documentTypeDropSC, setDocumentTypeDropSC] = useState([]);
  const [selectedDocumentIdTypeSC, setSelectedDocumentIdTypeSC] = useState('');
  const [DocumentIdTypeSC, setDocumentIdTypeSC] = useState('');
  const [isSelectDocumentTypeSC, setIsSelectDocumentTypeSC] = useState(false);
  const [DocumentTypeGrid, setDocumentTypeGrid] = useState([]);


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
      .then((val) => setLoanReqIdDropSC(val));
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
    fetch(`${config.apiBaseUrl}/getdocument_type`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setDocumentTypeDrop(val));
  }, []);

  const handleChangeDocumentType = (selectedDocumentIdType) => {
    setSelectedDocumentIdType(selectedDocumentIdType);
    setDocumentIdType(selectedDocumentIdType ? selectedDocumentIdType.value : '');
  };

  const filteredOptionDocumentType = Array.isArray(documentTypeDrop)
    ? documentTypeDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getdocument_type`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setDocumentTypeDropSC(val));
  }, []);

  const handleChangeDocumentTypeSC = (selectedDocumentIdTypeSC) => {
    setSelectedDocumentIdTypeSC(selectedDocumentIdTypeSC);
    setDocumentIdTypeSC(selectedDocumentIdTypeSC ? selectedDocumentIdTypeSC.value : '');
  };

  const filteredOptionDocumentTypeSC = Array.isArray(documentTypeDropSC)
    ? documentTypeDropSC.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getdocument_type`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const TypeOption = data.map((option) => ({
          value: option.attributedetails_name,
          label: `${option.attributedetails_name}`,
        }));
        setDocumentTypeGrid(TypeOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionLoanReqIdSC = Array.isArray(loanReqIdDropSC)
    ? loanReqIdDropSC.map((option) => ({
      value: option.loan_request_id,
      label: option.loan_request_id,
    }))
    : [];

  const filteredOptionLoanReqId = Array.isArray(loanReqIdDrop)
    ? loanReqIdDrop.map((option) => ({
      value: option.loan_request_id,
      label: option.loan_request_id,
    }))
    : [];

  const filteredOptionLoanReqIdAG = Array.isArray(loanReqIdDropAG)
    ? loanReqIdDropAG.map((option) => ({
      value: option.loan_request_id,
      label: option.loan_request_id,
    }))
    : [];

  const handleLoanReq = (SelectedLoanReq) => {
    setSelectedLoanReq(SelectedLoanReq);
    setLoanReqId(SelectedLoanReq ? SelectedLoanReq.value : "");
  };

  const handleLoanReqSC = (SelectedLoanReq) => {
    setSelectedLoanReqSC(SelectedLoanReq);
    setLoanReqIdSC(SelectedLoanReq ? SelectedLoanReq.value : "");
  };

  const searchClearInputFields = () => {
    setLoanReqIdSC("");
    setSelectedLoanReqSC("");
    setdocument_idSC("");
    setdocument_typeSC("");
    setfile_pathSC("");
    setuploaded_bySC("");
    setFromDate("");
    setToDate("");
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
                  title="Update"
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: "pointer" }}
                  title="Delete"
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
      headerName: "Document ID",
      field: "document_id",
      editable: false,
    },

    {
      headerName: "Loan Request ID",
      field: "loan_request_id",
      editable: false,
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
      headerName: "Document Type",
      field: "document_type",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: DocumentTypeGrid.map(d => d.value),
      },
      valueFormatter: (params) => {
        const dept = DocumentTypeGrid.find(d => d.value === params.value);
        return dept ? dept.label : params.value;
      },
    },

    {
      headerName: "File Path",
      field: "file_path",
      editable: true,
    },

    {
      headerName: "Uploaded By",
      field: "uploaded_by",
      editable: true,
    },

    {
      headerName: "Uploaded Date",
      field: "uploaded_at",
      editable: true,
      valueFormatter: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },
    // PDF PREVIEW COLUMN
    {
      headerName: "Preview",
      field: "document",
      width: 120,
      editable: false,
      cellRenderer: (params) => {
        if (!params.value) return null;

        const base64 = params.value;

        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              const pdfWindow = window.open("");

              pdfWindow.document.write(
                `<iframe width="100%" height="100%" src="data:application/pdf;base64,${base64}"></iframe>`,
              );
            }}
          >
            Preview
          </button>
        );
      },
    },

    {
      headerName: "Company Code",
      field: "company_code",
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

  const handleRemove = (index) => {
    setSelectedFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    if (
      !document_id ||
      !loanReqId ||
      !file_path ||
      !uploaded_by ||
      !uploaded_at
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    e.preventDefault();

    const formData = new FormData();

    formData.append("document_id", document_id);
    formData.append("loan_request_id", loanReqId);
    formData.append("document_type", DocumentIdType);
    formData.append("file_path", file_path);
    formData.append("uploaded_by", uploaded_by);
    formData.append("uploaded_at", uploaded_at);
    formData.append(
      "company_code",
      sessionStorage.getItem("selectedCompanyCode"),
    );
    formData.append("keyfield", "");
    formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

    if (documentFile) {
      formData.append("document", documentFile);
    }

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/loan_documentsInsert`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        toast.success("Loan Document Saved Successfully!");
      } else {
        const err = await response.json();
        toast.warning(err.message);
      }
    } catch (error) {
      toast.error("Upload Failed: " + error.message);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        document_id: document_idSC ? document_idSC : 0,
        loan_request_id: loanReqIdSC ? loanReqIdSC : 0,
        document_type: DocumentIdTypeSC || "",
        file_path: file_pathSC || "",
        uploaded_by: uploaded_bySC || "",
        uploaded_at: uploaded_atSC || "",
        FromDate: fromDate,
        ToDate: toDate,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/loan_documentsSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const fetchedData = await response.json();

        setRowData(fetchedData);
      } else if (response.status === 404) {
        toast.warning("Data Not Found");
        setRowData([]);
      } else {
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
            loan_documentsData: Array.isArray(rowData)
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
            `${config.apiBaseUrl}/loan_documentsLoopUpdate`,
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
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const dataToSend = {
            loan_documentsData: Array.isArray(rowData)
              ? rowData.map((row) => ({
                ...row,
                company_code,
                modified_by
              }))
              : [
                {
                  ...rowData,
                  company_code,
                  modified_by
                },
              ],
          };

          const response = await fetch(
            `${config.apiBaseUrl}/loan_documentsLoopDelete`,
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setDocumentFile(file);
      setDocumentUrl(fileUrl);
    } else {
      toast.warning("Please upload a valid PDF file.");
      event.target.value = "";
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => {
      return {
        "Document ID": row.document_id || "",
        "Loan Request ID": row.loan_request_id || "",
        "Document Type": row.document_type || "",
        "File Path": row.file_path || "",
        "Uploaded By": row.uploaded_by || "",
        "Upload Date": row.uploaded_at || "",
      };
    });
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Loan Documents Search Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Documents");

    XLSX.writeFile(workbook, "Loan_Documents.xlsx");
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
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                required
                title="Please enter the Document ID"
                autoComplete="off"
                value={document_id}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setdocument_id(value);
                }}
              />
              <label for="sname" className={`exp-form-labels ${error && !document_id ? "text-danger" : ""}`}>
                Document ID<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedLoanReq ? "has-value" : ""} 
                ${isLoanReqFocus ? "is-focused" : ""}`}
              title="Please enter the Loan Request ID"
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
              <label className={`floating-label ${error && !loanReqId ? "text-danger" : ""}`}>
                Loan Request ID<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedDocumentIdType ? "has-value" : ""} 
              ${isSelectDocumentType ? "is-focused" : ""}`}
              title="Please enter the Document Type"
            >
              <Select
                inputId="documentIdType"
                name="documentIdType"
                value={selectedDocumentIdType}
                onChange={handleChangeDocumentType}
                options={filteredOptionDocumentType}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectDocumentType(true)}
                onBlur={() => setIsSelectDocumentType(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="DocumentType" className="floating-label">Document Type</label>
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
                title="Please Enter the File Path"
                maxLength={255}
                autoComplete="off"
                value={file_path}
                onChange={(e) => setfile_path(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !file_path ? "text-danger" : ""}`}>
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
                title="Please Enter the Uploaded By"
                maxLength={100}
                autoComplete="off"
                value={uploaded_by}
                onChange={(e) => setuploaded_by(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !uploaded_by ? "text-danger" : ""}`}>
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
                title="Please Enter the Uploaded Date"
                autoComplete="off"
                value={uploaded_at}
                onChange={(e) => setuploaded_at(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !uploaded_at ? "text-danger" : ""}`}>
                Uploaded Date<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <div className="image-upload-container">
                {documentUrl ? (
                  <div className="image-preview-box">
                    <iframe
                      src={documentUrl}
                      title="PDF Preview"
                      className="pdf-inline-preview"
                    ></iframe>

                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={() => {
                        setDocumentFile(null);
                        setDocumentUrl("");
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-placeholder-box"
                    onClick={() =>
                      document.getElementById("documentUpload").click()
                    }
                  >
                    <div className="upload-icon-text">
                      <i className="fa-solid fa-file-arrow-up upload-icon me-1"></i>
                      <span>Upload Document</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  className="hidden-file-input"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  id="documentUpload"
                />
                {selectedFile.length > 0 && (
                  <div className="col-md-12 d-flex flex-wrap preview-container mt-2">
                    {selectedFile.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);

                      return (
                        <div key={index} className="file-preview-box">
                          <span
                            className="delete-file-btn"
                            onClick={() => handleRemove(index)}
                          >
                            &times;
                          </span>

                          <iframe
                            src={fileURL}
                            title={file.name}
                            className="uploaded-file"
                          ></iframe>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                required
                title="Please enter the Document ID"
                autoComplete="off"
                value={document_idSC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setdocument_idSC(value);
                }}
              />
              <label for="sname" className={`exp-form-labels`}>
                Document ID
              </label>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
                ${selectedLoanReqSC ? "has-value" : ""} 
                ${isLoanReqFocusSC ? "is-focused" : ""}`}
              title="Please enter the Loan Request ID"
            >
              <Select
                id="loanReq"
                value={selectedLoanReqSC}
                onChange={handleLoanReqSC}
                options={filteredOptionLoanReqIdSC}
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
            <div
              className={`inputGroup selectGroup 
              ${selectedDocumentIdTypeSC ? "has-value" : ""} 
              ${isSelectDocumentTypeSC ? "is-focused" : ""}`}
              title="Please enter the Document Type"
            >
              <Select
                inputId="documentIdType"
                name="documentIdType"
                value={selectedDocumentIdTypeSC}
                onChange={handleChangeDocumentTypeSC}
                options={filteredOptionDocumentTypeSC}
                autoComplete="off"
                placeholder=" "
                onFocus={() => setIsSelectDocumentTypeSC(true)}
                onBlur={() => setIsSelectDocumentTypeSC(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label htmlFor="DocumentType" className="floating-label">Document Type</label>
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
                title="Please Enter the File Path"
                maxLength={255}
                autoComplete="off"
                value={file_pathSC}
                onChange={(e) => setfile_pathSC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                File Path
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
                title="Please Enter the Uploaded By"
                maxLength={100}
                autoComplete="off"
                value={uploaded_bySC}
                onChange={(e) => setuploaded_bySC(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels `}>
                Uploaded By
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
                title="Please Enter the Uploaded From Date"
                autoComplete="off"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Uploaded From
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
                title="Please Enter the Uploaded To Date"
                autoComplete="off"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels`}>
                Uploaded To
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
            onGridReady={onGridReady}
            rowSelection="multiple"
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>
  );
}
export default LoanDocuments;
