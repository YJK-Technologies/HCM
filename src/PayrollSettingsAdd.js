import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from "./Loading";

const config = require("./Apiconfig");

function PayrollSettingsAdd() {

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const [salary_from_to_day, setsalary_from_to_day] = useState("");
  const [salary_from_day, setSalaryFromDay] = useState("");
  const [salary_to_day, setSalaryToDay] = useState("");
  const [OT_Rate, setOTRate] = useState("");
  const [effective_from, setEffectiveFrom] = useState("");
  const [effective_to, setEffectiveTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [Status, setStatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // refs (same flow feeling)
  const fromDayRef = useRef(null);
  const toDayRef = useRef(null);
  const otRef = useRef(null);
  const effFromRef = useRef(null);
  const effToRef = useRef(null);
  const remarksRef = useRef(null);


  // 🔁 LOAD UPDATE DATA
useEffect(() => {
  if (mode === "update" && selectedRow) {
    setSalaryFromDay(selectedRow.salary_from_day || "");
    setsalary_from_to_day(selectedRow.salary_from_to_day || "");
    setSalaryToDay(selectedRow.salary_to_day || "");
    setOTRate(selectedRow.OT_Rate || "");
    setEffectiveFrom(selectedRow.effective_from?.split("T")[0] || "");
    setEffectiveTo(selectedRow.effective_to?.split("T")[0] || "");
    setRemarks(selectedRow.remarks || "");
    setStatus(selectedRow.Status || "");

    // ✅ IMPORTANT FIX
    if (selectedRow.Status) {
      setSelectedStatus({
        value: selectedRow.Status,
        label: selectedRow.Status
      });
    }
  }
}, [mode, selectedRow]);
  useEffect(() => {
  fetch(`${config.apiBaseUrl}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company_code: sessionStorage.getItem("selectedCompanyCode"),
    }),
  })
    .then(res => res.json())
    .then(setStatusdrop);
}, []);

const resetForm = () => {
  setsalary_from_to_day("");
  setSalaryFromDay("");
  setSalaryToDay("");
  setOTRate("");
  setEffectiveFrom("");
  setEffectiveTo("");
  setRemarks("");
  setStatus("");
  setSelectedStatus(null);
  setError(false);
};

  const handleSave = async () => {
    if (!salary_from_day || !salary_to_day || !salary_from_to_day || !OT_Rate || !effective_from || !effective_to || !Status) {
      setError(true);
      toast.warning("Missing Required Fields");
      return;
    }

    setLoading(true);

    try {
      const url =
        mode === "create"
          ? `${config.apiBaseUrl}/AddPayrollSetting`
          : `${config.apiBaseUrl}/UpdatePayrollSetting`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          SI_no: selectedRow?.SI_no,           
          keyfield: selectedRow?.keyfield,     
          modified_by: sessionStorage.getItem('selectedUserCode'),                
          created_by: sessionStorage.getItem('selectedUserCode'),
          salary_from_to_day,
          salary_from_day,
          salary_to_day,
          OT_Rate,
          effective_from,
          effective_to,
          remarks,
          Status,
        })
        });

      if (response.ok) {
        toast.success(mode === "create" ? "Saved successfully" : "Updated successfully");
        resetForm(); 
      //  navigate to main screen after Saved or Updated
      // setTimeout(() => navigate("/PayrollSettings"), 1000);
      } else {
        const err = await response.json();
        toast.warning(err.message);
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/PayrollSettings");
  };

  const handleKeyDown = (e, nextRef, value) => {
    if (e.key === "Enter") {
      if (value) nextRef.current.focus();
      else e.preventDefault();
    }
  };

  return (
    <div className="container-fluid Topnav-screen">

      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER */}
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">
            {mode === "update" ? "Update Payroll Settings" : "Add Payroll Settings"}
          </h1>

          <div className="action-wrapper">
            <div className="action-icon delete" onClick={handleNavigate}>
              <span className="tooltip">Close</span>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          {/* From Day */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="number"
                placeholder=""
                className="exp-input-field form-control"
                value={salary_from_to_day}
                onChange={(e) => setsalary_from_to_day(e.target.value)}
                ref={fromDayRef}
                onKeyDown={(e) => handleKeyDown(e, toDayRef, salary_from_to_day)}
              />
              <label className={`exp-form-labels ${error && !salary_from_to_day ? "text-danger" : ""}`}>
               Salary From To Day <span className="text-danger">*</span>
              </label>
            </div>
          </div>


          {/* From Day */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="number"
                placeholder=""
                className="exp-input-field form-control"
                value={salary_from_day}
                onChange={(e) => setSalaryFromDay(e.target.value)}
                ref={fromDayRef}
                onKeyDown={(e) => handleKeyDown(e, toDayRef, salary_from_day)}
              />
              <label className={`exp-form-labels ${error && !salary_from_day ? "text-danger" : ""}`}>
               Salary From Day <span className="text-danger">*</span>
              </label>
            </div>
          </div>

          {/* To Day */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="number"
                placeholder=""
                className="exp-input-field form-control"
                value={salary_to_day}
                onChange={(e) => setSalaryToDay(e.target.value)}
                ref={toDayRef}
                onKeyDown={(e) => handleKeyDown(e, otRef, salary_to_day)}
              />
              <label className={`exp-form-labels ${error && !salary_to_day ? "text-danger" : ""}`}>
               Salary To Day <span className="text-danger">*</span>
              </label>
            </div>
          </div>

          {/* OT Rate */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="number"
                placeholder=""
                className="exp-input-field form-control"
                value={OT_Rate}
                onChange={(e) => setOTRate(e.target.value)}
                ref={otRef}
                onKeyDown={(e) => handleKeyDown(e, effFromRef, OT_Rate)}
              />
              <label className={`exp-form-labels ${error && !OT_Rate ? "text-danger" : ""}`}>OT Rate<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* Effective From */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                className="exp-input-field form-control"
                placeholder=""
                value={effective_from}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                ref={effFromRef}
                onKeyDown={(e) => handleKeyDown(e, effToRef, effective_from)}
              />
              <label className={`exp-form-labels ${error && !effective_from ? "text-danger" : ""}`}>Financial From<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* Effective To */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="date"
                placeholder=""
                className="exp-input-field form-control"
                value={effective_to}
                onChange={(e) => setEffectiveTo(e.target.value)}
                ref={effToRef}
                onKeyDown={(e) => handleKeyDown(e, remarksRef, effective_to)}
              />
              <label className={`exp-form-labels ${error && !effective_to ? "text-danger" : ""}`}>Financial To<span className="text-danger">*</span></label>
            </div>
          </div>

          {/* Remarks */}
          <div className="col-md-2">
            <div className="inputGroup">
              <input
                type="text"
                className="exp-input-field form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                ref={remarksRef}
                placeholder=""
              />
              <label className="exp-form-labels">Remarks</label>
            </div>
          </div>

          <div className="col-md-2">
          <div className={`inputGroup selectGroup ${selectedStatus ? "has-value" : ""}`}>
            <Select
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setStatus(val ? val.value : "");
              }}
              options={statusdrop.map(s => ({
                value: s.attributedetails_name,
                label: s.attributedetails_name
              }))}
              classNamePrefix="react-select"
              placeholder=""
              isClearable
            />
            <label className={`floating-label ${error && !Status ? "text-danger" : ""}`}>Status<span className="text-danger">*</span></label>
          </div>
        </div>

          {/* SAVE */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn save" onClick={handleSave}>
                <span className="tooltip">
                  {mode === "create" ? "Save" : "Update"}
                </span>
                <i className="fa-solid fa-floppy-disk"></i>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PayrollSettingsAdd;