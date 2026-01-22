import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';


const config = require('./Apiconfig');

function DesginationInput({ }) {
  const [dept_id, setdept_id] = useState("");
  const [desgination_id, setdesgination_id] = useState("");
  const [desgination, setdesgination] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [Deptdrop, setDeptdrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selecteddept, setSelecteddept] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const departmentid = useRef(null);
  const desgid = useRef(null);
  const desg = useRef(null);
  const Status = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfield, setkey_field] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectdep, setIsSelectdep] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);

  console.log(selectedRows);
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};



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
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setError(false);
  };



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setDeptdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  const filteredOptionDept = Deptdrop.map((option) => ({
    value: option.Department,
    label: option.Department,
  }));

  const handleChangedept = (selecteddept) => {
    setSelecteddept(selecteddept);
    setdept_id(selecteddept ? selecteddept.value : '');
    setError(false);
  };




  const handleInsert = async () => {
    if (!dept_id || !desgination_id || !desgination || !status) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/AddDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          dept_id,
          desgination_id,
          desgination,
          status,
          created_by: sessionStorage.getItem('selectedUserCode')

          /* created_by,
          created_date,
          modfied_by,
          modfied_date,*/
        }),
      });
      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message, {

      });
    }
    finally {
      setLoading(false);
    }
  };

  const clearInputFields = () => {
    setdesgination_id("");
    setdesgination("");
    setSelecteddept("");
    setSelectedStatus("");

  }
  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setdesgination_id(selectedRow.desgination_id || "");
      setdesgination(selectedRow.desgination || "");
      setkey_field(selectedRow.keyfield || "");


      setSelecteddept({
        label: selectedRow.dept_id,
        value: selectedRow.dept_id,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });



    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const handleUpdate = async () => {
    if (
      !selecteddept ||
      !desgination ||
      !desgination_id ||
      !selectedStatus

    ) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/DesgintionUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          dept_id: selecteddept.value,
          desgination,
          desgination_id,
          keyfield,
          status: selectedStatus.value,
          modified_by,
        }),
      });
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };


  const handleNavigate = () => {
    navigate("/DesgiantionInfo");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };


  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class=""  >
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-1 bg-light rounded main-header-box">
            <div className="header-flex">
              <h1 className="page-title"> {mode === "update" ? 'Update Designation Details ' : 'Add Designation Details '} </h1>
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
                <div
                  className={`inputGroup selectGroup 
              ${selecteddept ? "has-value" : ""} 
              ${isSelectdep ? "is-focused" : ""}`}
                >
                  <Select
                    id="deptid"
                    value={selecteddept}
                    onChange={handleChangedept}
                    options={filteredOptionDept}
                    placeholder=" "
                    onFocus={() => setIsSelectdep(true)}
                    onBlur={() => setIsSelectdep(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={departmentid}
                    onKeyDown={(e) => handleKeyDown(e, desgid, departmentid)}
                  />
                  <label For="city" className={`floating-label ${error && !dept_id ? 'text-danger' : ''}`}>Department ID<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="did"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the Employee No"
                    value={desgination_id}
                    onChange={(e) => setdesgination_id(e.target.value)}
                    maxLength={10}
                    ref={desgid}
                    onKeyDown={(e) => handleKeyDown(e, desg, desgid)}
                  />
                  <label for="state" className={`exp-form-labels ${error && !desgination_id ? 'text-danger' : ''}`}>Desgination ID<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="ename"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the Employee Name"
                    value={desgination}
                    onChange={(e) => setdesgination(e.target.value)}
                    maxLength={50}
                    ref={desg}
                    onKeyDown={(e) => handleKeyDown(e, Status, desg)}
                  />
                  <label for="state" className={`exp-form-labels ${error && !desgination ? 'text-danger' : ''}`}>Desgination<span className="text-danger">*</span></label>
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
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    options={filteredOptionStatus}
                    classNamePrefix="react-select"
                    placeholder=" "
                    onFocus={() => setIsSelectStatus(true)}
                    onBlur={() => setIsSelectStatus(false)}
                    isClearable
                    data-tip="Please select a payment type"
                    ref={Status}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (mode === "create") {
                          handleInsert();
                        } else {
                          handleUpdate();
                        }
                      }
                    }}
                  />
                  <label for="locno" className={`floating-label ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>

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
      </div>
    </div>
  );
}
export default DesginationInput;