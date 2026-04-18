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
import Select from "react-select";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import TabButtons from "./ESSComponents/Tabs";
import * as XLSX from "xlsx-js-style";
const config = require("./Apiconfig");

function ShiftMasterGrid() {
  const [activeTab, setActiveTab] = useState("Shift Master");
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [Shift_ID, setShift_ID] = useState("");
  const [Shift_IDSC, setShift_IDSC] = useState("");
  const [error, setError] = useState("");
  const [Shift_Code, setShift_Code] = useState("");
  const [Shift_CodeSC, setShift_CodeSC] = useState("");
  const [Shift_Name, setShift_Name] = useState("");
  const [Shift_NameSC, setShift_NameSC] = useState("");
  const [Start_Time, setStart_Time] = useState("");
  const [Start_TimeSC, setStart_TimeSC] = useState("");
  const [End_Time, setEnd_Time] = useState("");
  const [End_TimeSC, setEnd_TimeSC] = useState("");
  const [Shift_Hours, setShift_Hours] = useState("");
  const [Shift_HoursSC, setShift_HoursSC] = useState("");
  const [Is_Night_Shift, setIs_Night_Shift] = useState("");
  const [Is_Night_ShiftSC, setIs_Night_ShiftSC] = useState("");
  const [Grace_In_Min, setGrace_In_Min] = useState("");
  const [Grace_In_MinSC, setGrace_In_MinSC] = useState("");
  const [Grace_Out_Min, setGrace_Out_Min] = useState("");
  const [Grace_Out_MinSC, setGrace_Out_MinSC] = useState("");
  const [Cross_Midnight, setCross_Midnight] = useState("");
  const [Cross_MidnightSC, setCross_MidnightSC] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [hasValueChangedSC, setHasValueChangedSC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatusSC, setSelectedStatusSC] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isSelectFocusedSC, setIsSelectFocusedSC] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusdropSC, setStatusdropSC] = useState([]);
  const [Status, setStatus] = useState("");
  const [StatusSC, setStatusSC] = useState("");
  const [statusgriddrop, setStatusGriddrop] = useState([]);

  const [nightShiftDrop, setNightShiftDrop] = useState([]);
  const [nightShiftDropSc, setNightShiftDropSc] = useState([]);
  const [nightShiftDropGrid, setNightShiftDropGrid] = useState([]);
  const [crossNightDrop, setCrossNightDrop] = useState([]);
  const [crossNightDropSc, setCrossNightDropSc] = useState([]);
  const [crossNightDropGrid, setCrossNightDropGrid] = useState([]);
  const [selectedNightShift, setSelectedNightShift] = useState('');
  const [selectedNightShiftSc, setSelectedNightShiftSc] = useState("");
  const [selectedCrossNight, setSelectedCrossNight] = useState("");
  const [selectedCrossNightSc, setSelectedCrossNightSc] = useState("");

  const [isSelectedNightShift, setIsSelectedNightShift] = useState(false);
  const [isSelectedNightShiftSc, setIsSelectedNightShiftSc] = useState(false);
  const [isSelectedCrossNight, setIsSelectedCrossNight] = useState(false);
  const [isSelectedCrossNightSc, setIsSelectedCrossNightSc] = useState(false);

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const companyMappingPermission = permissions
    .filter((permission) => permission.screen_type === "Company Mapping")
    .map((permission) => permission.permission_type.toLowerCase());

  const searchClearInputFields = () => {
    setShift_IDSC("");
    setShift_CodeSC("");
    setShift_NameSC("");
    setStart_TimeSC("");
    setEnd_TimeSC("");
    setShift_HoursSC("");
    setIs_Night_Shift("");
    setIs_Night_ShiftSC("");
    setGrace_In_MinSC("");
    setGrace_Out_MinSC("");
    setCross_MidnightSC("");
    setSelectedStatusSC("");
    setStatusSC("");
  };

  const handleChangeStatusSC = (selectedStatusSC) => {
    setSelectedStatusSC(selectedStatusSC);
    setStatusSC(selectedStatusSC ? selectedStatusSC.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleChangeCrossSC = (selectedCrossNightSc) => {
    setSelectedCrossNightSc(selectedCrossNightSc);
    setCross_MidnightSC(selectedCrossNightSc ? selectedCrossNightSc.value : "");
  };

  const handleChangeCross = (selectedCrossNight) => {
    setSelectedCrossNight(selectedCrossNight);
    setCross_Midnight(selectedCrossNight ? selectedCrossNight.value : "");
  };

  const handleChangeNightSC = (selectedNightShiftSc) => {
    setSelectedNightShiftSc(selectedNightShiftSc);
    setIs_Night_ShiftSC(selectedNightShiftSc ? selectedNightShiftSc.value : "");
  };

  const handleChangeNight = (selectedCrossNight) => {
    setSelectedNightShift(selectedCrossNight);
    setIs_Night_Shift(selectedCrossNight ? selectedCrossNight.value : "");
  };

  const filteredOptionStatusSC = statusdropSC.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCrossSC = crossNightDropSc.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCross = crossNightDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionNightSC = nightShiftDropSc.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionNight = nightShiftDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
      .then((val) => setStatusdrop(val))
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
      .then((val) => setStatusdropSC(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const nightOption = data.map(option => option.attributedetails_name);
        setNightShiftDropGrid(nightOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setNightShiftDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setNightShiftDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const crossOption = data.map(option => option.attributedetails_name);
        setCrossNightDropGrid(crossOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCrossNightDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCrossNightDropSc(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatTimeForSQL = (time) => {
    if (!time) return null;
    return time.length === 5 ? `${time}:00` : time;
  };

  const calculateShiftHours = (start, end) => {
    if (!start || !end) return "";

    const startParts = start.split(":").map(Number);
    const endParts = end.split(":").map(Number);

    const sh = startParts[0];
    const sm = startParts[1];
    const eh = endParts[0];
    const em = endParts[1];

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    // Cross midnight handling
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const diffMinutes = endMinutes - startMinutes;
    return (diffMinutes / 60).toFixed(2);
  };

  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStart_Time(value);
    setShift_Hours(calculateShiftHours(value, End_Time));
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    setEnd_Time(value);
    setShift_Hours(calculateShiftHours(Start_Time, value));
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      const response = await fetch(`${config.apiBaseUrl}/getShiftsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Shift_ID: Shift_IDSC || null,
          Shift_Code: Shift_CodeSC || null,
          Shift_Name: Shift_NameSC || null,
          Status: StatusSC || null,
          Cross_Midnight: Cross_MidnightSC || null,
          Shift_Hours: Shift_HoursSC || null,
          Is_Night_Shift: Is_Night_ShiftSC === "" ? null : Is_Night_ShiftSC,
          Grace_In_Min: Grace_In_MinSC || null,
          Grace_Out_Min: Grace_Out_MinSC || null,
          Start_Time: formatTimeForSQL(Start_TimeSC),
          End_Time: formatTimeForSQL(End_TimeSC),
          company_code,
        })

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
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  title="Update"
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
    // {
    //   headerName: "Shift ID",
    //   field: "Shift_ID",
    //   editable: true,
    // },
    {
      headerName: "Shift Code",
      field: "Shift_Code",
      editable: false,
    },
    {
      headerName: "Shift Name",
      field: "Shift_Name",
      editable: true,
    },
    {
      headerName: "Start Time",
      field: "Start_Time",
      editable: true,
    },
    {
      headerName: "End Time",
      field: "End_Time",
      editable: true,
    },
    {
      headerName: "Shift Hours",
      field: "Shift_Hours",
      editable: true,
    },
    {
      headerName: "Night Shift",
      field: "Is_Night_Shift",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: nightShiftDropGrid,
      },
    },
    {
      headerName: "Grace In Min",
      field: "Grace_In_Min",
      editable: true,
    },
    {
      headerName: "Grace Out Min",
      field: "Grace_Out_Min",
      editable: true,
    },
    {
      headerName: "Cross Midnight",
      field: "Cross_Midnight",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: crossNightDropGrid,
      },
    },
    {
      headerName: "Status",
      field: "Status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
      editable: true,
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
    // { label: "Shift Type Master" },
    { label: "Shift Pattern Master" },
    { label: "Shift Pattern Details" },
    // { label: "Employment Type Master" },
    { label: "Employee Shift Mapping" },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case "Shift Master":
        ShiftMaster();
        break;
      // case 'Shift Type Master':
      //   ShiftTypeMaster();
      //   break;
      case "Shift Pattern Master":
        ShiftPatternMaster();
        break;
      case "Shift Pattern Details":
        ShiftPatternDetails();
        break;
      // case "Employment Type Master":
      //   EmploymentTypeMaster();
      //   break;
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

  const handleSave = async () => {
    if (!Shift_Code || !Shift_Name || !Is_Night_Shift || !Status) {
      toast.warning("Error: Missing required fields");
      setError(" ")
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/Shift_MasterInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Shift_Code: Shift_Code,
            Shift_Name: Shift_Name,
            End_Time: End_Time,
            Status: Status,
            Cross_Midnight: Cross_Midnight,
            Start_Time: Start_Time,
            Shift_Hours: Number(Shift_Hours) || 0,
            Is_Night_Shift: Is_Night_Shift,
            Grace_In_Min: Number(Grace_In_Min),
            Grace_Out_Min: Number(Grace_Out_Min),
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        }
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

    showConfirmationToast(
      "Are you sure you want to update the selected shift data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          // const dataToSend = {
          //   sp_Shift_MasterData: Array.isArray(rowData) ? rowData : [rowData],
          // };

          const dataToSend = {
            sp_Shift_MasterData: Array.isArray(rowData)
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

          const response = await fetch(`${config.apiBaseUrl}/sp_Shift_MasterLoopUpdate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            }
          );

          if (response.ok) {
            toast.success("Shift updated successfully", {
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
      () => toast.info("Update cancelled")
    );
  };

  const handleDelete = async (rowData) => {

    showConfirmationToast(
      "Are you sure you want to delete the selected shift data?",
      async () => {
        try {
          setLoading(true);
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem("selectedUserCode");

          // const dataToSend = {
          //   sp_Shift_MasterData: Array.isArray(rowData) ? rowData : [rowData]
          // };

          const dataToSend = {
            sp_Shift_MasterData: Array.isArray(rowData)
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

          const response = await fetch(`${config.apiBaseUrl}/sp_Shift_MasterLoopDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Shift deleted successfully", {
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
      () => toast.info("Delete cancelled")
    );
  };

  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  const transformRowData = (data) => {
    return data.map((row) => ({
      "Shift Code": row.Shift_Code || "",
      "Shift Name": row.Shift_Name || "",
      "Start Time": row.Start_Time || "",
      "End Time": row.End_Time || "",
      "Shift Hours": row.Shift_Hours || "",
      "Night Shift": row.Is_Night_Shift || "",
      "Grace In Min": row.Grace_In_Min || "",
      "Grace Out Min": row.Grace_Out_Min || "",
      "Cross Midnight": row.Cross_Midnight || "",
      "Status": row.Status || "",
    }));
  };

  const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning("There is no data to export.");
      return;
    }

    const screenName = "Shift Master Search Report";
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Master");

    XLSX.writeFile(workbook, "Shift_Master_Search_Report.xlsx");
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
            <h1 className="page-title">Shift Master</h1>
            <div className="action-wrapper">
              <div onClick={handleSave} className="action-icon add">
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            </div>
          </div>
        </div>

        <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
        <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
          <div className="row g-3">
            {/* <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_ID}
                  onChange={(e) => setShift_ID(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_ID ? "text-danger" : ""}`}
                >
                  Shift ID<span className="text-danger">*</span>
                </label>
              </div>
            </div> */}

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_Name"
                  class="exp-input-field form-control"
                  type="text"
                  maxLength={20}
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_Code}
                  onChange={(e) => setShift_Code(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_Code ? "text-danger" : ""}`}>
                  Shift Code<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="UTC_Offset"
                  class="exp-input-field form-control"
                  type="text"
                  maxLength={50}
                  placeholder=""
                  autoComplete="off"
                  required
                  value={Shift_Name}
                  onChange={(e) => setShift_Name(e.target.value)}
                />
                <label
                  for="state"
                  className={`exp-form-labels ${error && !Shift_Name ? "text-danger" : ""}`}
                >
                  Shift Name<span className="text-danger">*</span>
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="time"
                  value={Start_Time}
                  onChange={handleStartTimeChange}
                  maxLength={7}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Start Time</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="time"
                  value={End_Time}
                  onChange={handleEndTimeChange}
                  maxLength={100}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">End Time</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="number"
                  value={Shift_Hours}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d{0,6}$/.test(value)) {
                      setShift_Hours(value);
                    }
                  }}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Shift Hours</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedNightShift ? "has-value" : ""} 
              ${isSelectedNightShift ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedNightShift}
                  onChange={handleChangeNight}
                  options={filteredOptionNight}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectedNightShift(true)}
                  onBlur={() => setIsSelectedNightShift(false)}
                />
                <label className={`floating-label ${error && !Is_Night_Shift ? "text-danger" : ""}`}>Night Shift<span className="text-danger">*</span></label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  value={Grace_In_Min}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only digits
                    setGrace_In_Min(value);
                  }}
                  maxLength={10}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Grace in Minutes</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  value={Grace_Out_Min}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only digits
                    setGrace_Out_Min(value);
                  }}
                  maxLength={10}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Grace out Minutes</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedCrossNight ? "has-value" : ""} 
              ${isSelectedCrossNight ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedCrossNight}
                  onChange={handleChangeCross}
                  options={filteredOptionCross}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectedCrossNight(true)}
                  onBlur={() => setIsSelectedCrossNight(false)}
                />
                <label className="floating-label">Cross Midnight</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectFocused(true)}
                  onBlur={() => setIsSelectFocused(false)}
                />
                <label className={`floating-label ${error && !Status ? "text-danger" : ""}`}>Status<span className="text-danger">*</span></label>
              </div>
            </div>

          </div>
        </div>

        <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
          <div className="header-flex">
            <h6 className="">Search Criteria:</h6>
          </div>
          <div className="row g-3">
            {/* <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_ID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_IDSC}
                  onChange={(e) => setShift_IDSC(e.target.value)}
                />
                <label
                  htmlFor="fdate"
                  className={`exp-form-labels`}
                >
                  Shift ID
                </label>
              </div>
            </div> */}

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="TimeZone_Name"
                  class="exp-input-field form-control"
                  type="text"
                  maxLength={20}
                  placeholder=" "
                  autoComplete="off"
                  required
                  value={Shift_CodeSC}
                  onChange={(e) => setShift_CodeSC(e.target.value)}
                />
                <label
                  htmlFor="fdate"
                  className={`exp-form-labels`}
                >
                  Shift Code
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  id="UTC_Offset"
                  class="exp-input-field form-control"
                  type="text"
                  maxLength={50}
                  placeholder=""
                  autoComplete="off"
                  required
                  value={Shift_NameSC}
                  onChange={(e) => setShift_NameSC(e.target.value)}
                />
                <label
                  htmlFor="fdate"
                  className={`exp-form-labels`}
                >
                  Shift Name
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="time"
                  value={Start_TimeSC}
                  onChange={(e) => {
                    const timeValue = e.target.value;
                    setStart_TimeSC(timeValue ? timeValue + ":00" : "");
                  }}
                  maxLength={100}
                  autoComplete="off"
                  placeholder=" "
                />
                <label htmlFor="fdate" className="exp-form-labels">Start Time</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="time"
                  value={End_TimeSC}
                  onChange={(e) => setEnd_TimeSC(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">End Time</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="number"
                  value={Shift_HoursSC}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d{0,6}$/.test(value)) {
                      setShift_HoursSC(value);
                    }
                  }}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Shift Hours</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedNightShiftSc ? "has-value" : ""} 
              ${isSelectedNightShiftSc ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedNightShiftSc}
                  onChange={handleChangeNightSC}
                  options={filteredOptionNightSC}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectedNightShiftSc(true)}
                  onBlur={() => setIsSelectedNightShiftSc(false)}
                />
                <label className="floating-label">Night Shift</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  value={Grace_In_MinSC}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only digits
                    setGrace_In_MinSC(value);
                  }}
                  maxLength={10}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Grace in Minutes</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  value={Grace_Out_MinSC}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only digits
                    setGrace_Out_MinSC(value);
                  }}
                  maxLength={10}
                  autoComplete="off"
                  placeholder=" "
                />
                <label className="exp-form-labels">Grace out Minutes</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedCrossNightSc ? "has-value" : ""} 
              ${isSelectedCrossNightSc ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedCrossNightSc}
                  onChange={handleChangeCrossSC}
                  options={filteredOptionCrossSC}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectedCrossNightSc(true)}
                  onBlur={() => setIsSelectedCrossNightSc(false)}
                />
                <label className="floating-label">Cross Midnight</label>
              </div>
            </div>
            <div className="col-md-2">
              <div
                className={`inputGroup selectGroup 
              ${selectedStatusSC ? "has-value" : ""} 
              ${isSelectFocusedSC ? "is-focused" : ""}`}
              >
                <Select
                  id="status"
                  isClearable
                  value={selectedStatusSC}
                  onChange={handleChangeStatusSC}
                  options={filteredOptionStatusSC}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectFocusedSC(true)}
                  onBlur={() => setIsSelectFocusedSC(false)}
                />
                <label class="floating-label">Status</label>
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

export default ShiftMasterGrid;