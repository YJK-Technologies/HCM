import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';
import { setDefaultLocale } from "react-datepicker";

const config = require("./Apiconfig");

function AddCountryMaster({ }) {
  
  const [TimeZone_Default, seTimeZone_Default] = useState();
  const [weekoffdrop, setweekoffdrop] = useState([]);
  const [Country_Code, setCountry_Code] = useState("");
  const [Country_Name, setCountry_Name] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);
  const [selectedWeekoff, setselectedWeekoff] = useState("");
  const [WeekOff, setWeekOff] = useState("");
  const [issslectedweekoff, setisSelectedtWEeekoff] = useState(false);
  const [key_field, setkey_field] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setCountry_Code("");
    setselectedWeekoff("");
    setCountry_Name("");
  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setCountry_Code(selectedRow.Country_Code || "");
      setCountry_Name(selectedRow.Country_Name || "");
      seTimeZone_Default(selectedRow.TimeZone_Default || "");
       setkey_field(selectedRow.keyfield || "");

      setselectedWeekoff({
        label: selectedRow.Week_Start_Day,
        value: selectedRow.Week_Start_Day,
      });

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


 

 

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/WeekOff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setweekoffdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);






  const weekOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weekoffMap = weekoffdrop.reduce((acc, item) => {
  acc[item.attributedetails_name] = item;
  return acc;
}, {});


  
  // const filteredOptionWeekoff = weekoffdrop.map(option => ({
  //   value: option.attributedetails_name,
  //   label: option.attributedetails_name
  // }));
 
  const filteredOptionWeekoff = weekOrder
  .filter(day => weekoffMap[day]) // keeps only days sent by backend
  .map(day => ({
    label: day,
    value: day,
  }));



 

  const handleWeekoff = (selectedDPT) => {
    setselectedWeekoff(selectedDPT);
    setWeekOff(selectedDPT ? selectedDPT.value : '');
  };

 


  const handleInsert = async () => {
    if (!Country_Code || !Country_Name || !TimeZone_Default ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/CountryMasterInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            Week_Start_Day:WeekOff,
            Country_Code: Country_Code,
            Country_Name:Country_Name,
            TimeZone_Default:TimeZone_Default,
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        }
      );
      if (response.ok) {
        toast.success("Data inserted Successfully", {
          // onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/CountryMaster"); // Pass selectedRows as props to the Input component
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
     if (!Country_Code || !Country_Name || !TimeZone_Default ){
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/CountryMasterUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            Country_Code:Country_Code,
            Country_Name:Country_Name,
            Week_Start_Day:WeekOff,
            keyfield: key_field,
            TimeZone_Default:TimeZone_Default,
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
          <h1 className="page-title">{mode === "update" ? 'Update Country Master' : 'Add Country Master'} </h1>

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
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={Country_Code}
                onChange={(e) => setCountry_Code((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !Country_Code ? 'text-danger' : ''}`}>Country Code<span className="text-danger">*</span></label>
            </div>
          </div>

            <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                title="Please Enter the Company Contribution"
                required
                autoComplete="off"
                value={Country_Name}
                onChange={(e) => setCountry_Name((e.target.value))}
              />
              <label for="sname" className={`exp-form-labels ${error && !Country_Name ? 'text-danger' : ''}`}>Country Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
              <input
                id="ordno"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                autoComplete="off"
                value={TimeZone_Default}
                onChange={(e) => seTimeZone_Default((e.target.value))}
              />
              <label for="ordno" className="exp-form-labels">Default Timezone</label>
            </div>
          </div>
         <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedWeekoff ? "has-value" : ""} 
              ${issslectedweekoff ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                isClearable
                value={selectedWeekoff}
                onChange={handleWeekoff}
                options={filteredOptionWeekoff}
                placeholder=""
                classNamePrefix="react-select"
                onFocus={() => setisSelectedtWEeekoff(true)}
                onBlur={() => setisSelectedtWEeekoff(false)}
              />
              <label for="status" class={`floating-label ${error && !selectedWeekoff ? 'text-danger' : ''}`}>Week Start Day{<span className="text-danger">*</span>}

              </label>
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
export default AddCountryMaster;
