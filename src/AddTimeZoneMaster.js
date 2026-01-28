import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function AddTimeZoneMaster({ }) {

  const [DST_Flag, setDST_Flag] = useState("");
  const [error, setError] = useState("");
  const [TimeZone_ID, setTimeZone_ID] = useState("");
  const [TimeZone_Name, setTimeZone_Name] = useState("");
  const [UTC_Offset, setUTC_Offset] = useState("");
  const [key_field, setkey_field] = useState("");
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  
  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfiels, setKeyfiels] = useState('');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setDST_Flag("");
    setTimeZone_ID("");
    setTimeZone_Name("");
    setUTC_Offset("");
  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setTimeZone_ID(selectedRow.TimeZone_ID || "");
      setTimeZone_Name(selectedRow.TimeZone_Name || "");
      setUTC_Offset(selectedRow.UTC_Offset || "");
      setDST_Flag(selectedRow.DST_Flag ?? 0);
      setkey_field(selectedRow.keyfield || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);



  const handleInsert = async () => {
    if (!TimeZone_ID || !TimeZone_Name || !UTC_Offset || DST_Flag === undefined) {
      toast.warning("Error: Missing required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/TimeZonemasterInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TimeZone_ID: TimeZone_ID,
            TimeZone_Name: TimeZone_Name,
            UTC_Offset: UTC_Offset,
            DST_Flag: DST_Flag,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Data inserted successfully", {
          onClose: () => clearInputFields(),
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

  const handleNavigate = () => {
    navigate("/TimeZoneGrid"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  const handleUpdate = async () => {
    if (!DST_Flag || !TimeZone_ID || !TimeZone_Name || !UTC_Offset) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/TimeZonemasterUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          DST_Flag:DST_Flag,
         TimeZone_ID: TimeZone_ID,
         TimeZone_Name: TimeZone_Name,
          UTC_Offset:UTC_Offset,
          keyfield: key_field,
          modified_by
        }),
      });
      // if (response.status === 200) {
      //   console.log("Data Updated successfully");
      //   setIsUpdated(true);
      //   clearInputFields();
      //   toast.success("Data Updated successfully!")
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update Time Zone ' : 'Add Time Zone '} </h1>

          <div className="action-wrapper">
            <div className="action-icon delete" onClick={handleNavigate}>
              <span className="tooltip">Close</span>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>

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
                value={TimeZone_ID}
                onChange={(e) => setTimeZone_ID(e.target.value)}
              />
              <label for="state" className={`exp-form-labels ${error && !TimeZone_ID ? 'text-danger' : ''}`}>TimeZone ID<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="TimeZone_Name"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                required
                value={TimeZone_Name}
                onChange={(e) => setTimeZone_Name(e.target.value)}
              />
              <label for="state" className={`exp-form-labels ${error && !TimeZone_Name ? 'text-danger' : ''}`}>TimeZone Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="UTC_Offset"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                autoComplete="off"
                required
                value={UTC_Offset}
                onChange={(e) => setUTC_Offset(e.target.value)}
              />
              <label for="state" className={`exp-form-labels ${error && !UTC_Offset ? 'text-danger' : ''}`}>UTC Offset<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                className="exp-input-field form-control"
                type="number"
                value={DST_Flag}
                onChange={(e) => setDST_Flag(e.target.value)}
                maxLength={100}
                autoComplete="off"
                placeholder=" "
              />
              <label className="exp-form-labels">DST Flag</label>
            </div>
          </div>


          <div class="col-12">
            <div className="search-btn-wrapper">
              {mode === "create" ? (
                <div className="icon-btn save" onClick={handleInsert}>
                  <span className="tooltip">Save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              ) : (
                <div className="icon-btn update" onClick={handleUpdate}>
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddTimeZoneMaster;
