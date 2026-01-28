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

function ShiftMaster({ }) {

    const [Shift_ID, setShift_ID] = useState("");
    const [error, setError] = useState("");
    const [Shift_Code, setShift_Code] = useState("");
    const [Shift_Name, setShift_Name] = useState("");
    const [Start_Time, setStart_Time] = useState("");
    const [End_Time, setEnd_Time] = useState("");
    const [Shift_Hours, setShift_Hours] = useState("");
    const [Is_Night_Shift, seIs_Night_Shift] = useState("");
    const [Grace_In_Min, setGrace_In_Min] = useState("");
    const [Grace_Out_Min, setGrace_Out_Min] = useState("");
    const [key_field, setkey_field] = useState("");
    const navigate = useNavigate();
    const [hasValueChanged, setHasValueChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const modified_by = sessionStorage.getItem("selectedUserCode");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isSelectFocused, setIsSelectFocused] = useState(false);
    const [Status, setStatus] = useState("");
    const [statusdrop, setStatusdrop] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const location = useLocation();
    const { mode, selectedRow } = location.state || {};

    console.log(selectedRow);



    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : '');
        setHasValueChanged(true);
    };

    const filteredOptionStatus = statusdrop.map((option) => ({
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
            .then((data) => data.json())
            .then((val) => setStatusdrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);



    const clearInputFields = () => {
        setShift_ID("");
        setShift_Code("");
        setShift_Name("");
        setStart_Time("");
    };


    useEffect(() => {
        if (mode === "update" && selectedRow && !isUpdated) {
            setShift_ID(selectedRow.Shift_ID || "");
            setShift_Code(selectedRow.Shift_Code || "");
            setShift_Name(selectedRow.Shift_Name || "");
            setStart_Time(selectedRow.Start_Time ?? "");
            setkey_field(selectedRow.keyfield || "");

        } else if (mode === "create") {
            clearInputFields();
        }
    }, [mode, selectedRow, isUpdated]);



    const handleInsert = async () => {
        // if (!Shift_ID || !Shift_Code || !Shift_Name ) {
        //   toast.warning("Error: Missing required fields");
        //   return;
        // }

        setLoading(true);

        try {
            const response = await fetch(
                `${config.apiBaseUrl}/Shift_MasterInsert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Shift_ID: Number(Shift_ID),
                        Shift_Code: Shift_Code,
                        Shift_Name: Shift_Name,
                        End_Time: End_Time ,
                        Status: Status,
                        Start_Time: Start_Time,
                        Shift_Hours: Number(Shift_Hours) || 0,
                        Is_Night_Shift: Is_Night_Shift ? 1 : 0,
                        Grace_In_Min: Number(Grace_In_Min),
                       Grace_Out_Min:  Number(Grace_Out_Min),
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

    const handleNavigate = () => {
        navigate("/ShiftMasterGrid"); // Pass selectedRows as props to the Input component
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
        if (!Shift_Code || !Shift_Name || !Start_Time || !End_Time) {
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
                    Shift_ID: Shift_ID,
                    Shift_Code: Shift_Code,
                    Shift_Name: Shift_Name,
                    Start_Time: Start_Time,
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
                    <h1 className="page-title">{mode === "update" ? 'Update Shift Master' : 'Add Shift Master'} </h1>

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
                                value={Shift_ID}
                                onChange={(e) => setShift_ID(e.target.value)}
                            />
                            <label for="state" className={`exp-form-labels ${error && !Shift_ID ? 'text-danger' : ''}`}>Shift ID<span className="text-danger">*</span></label>
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
                                value={Shift_Code}
                                onChange={(e) => setShift_Code(e.target.value)}
                            />
                            <label for="state" className={`exp-form-labels ${error && !Shift_Code ? 'text-danger' : ''}`}>Shift Code <span className="text-danger">*</span></label>
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
                                value={Shift_Name}
                                onChange={(e) => setShift_Name(e.target.value)}
                            />
                            <label for="state" className={`exp-form-labels ${error && !Shift_Name ? 'text-danger' : ''}`}>Shift Name<span className="text-danger">*</span></label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                className="exp-input-field form-control"
                                type="time"
                                value={Start_Time}
                                onChange={(e) => setStart_Time(e.target.value)}
                                maxLength={100}
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
                                onChange={(e) => setEnd_Time(e.target.value)}
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
                                onChange={(e) => setShift_Hours(e.target.value)}
                                maxLength={100}
                                autoComplete="off"
                                placeholder=" "
                            />
                            <label className="exp-form-labels">Shift Hours</label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                className="exp-input-field form-control"
                                type="text"
                                value={Is_Night_Shift}
                                onChange={(e) => seIs_Night_Shift(e.target.value)}
                                maxLength={100}
                                autoComplete="off"
                                placeholder=" "
                            />
                            <label className="exp-form-labels">Night Shift</label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="inputGroup">
                            <input
                                className="exp-input-field form-control"
                                type="number"
                                value={Grace_In_Min}
                                onChange={(e) => setGrace_In_Min(e.target.value)}
                                maxLength={100}
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
                                type="number"
                                value={Grace_Out_Min}
                                onChange={(e) => setGrace_Out_Min(e.target.value)}
                                maxLength={100}
                                autoComplete="off"
                                placeholder=" "
                            />
                            <label className="exp-form-labels">Grace out Minutes</label>
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
                                onKeyDown={handleKeyDownStatus}
                            />
                            <label class="floating-label">Status</label>
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
export default ShiftMaster;
