import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import config from '../Apiconfig';

const ShiftRequestModal = ({ isOpen, onClose, rowData, onSuccess, screenType }) => {
    const [shiftOptions, setShiftOptions] = useState([]);
    const [managerOptions, setManagerOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [fullShiftName, setFullShiftName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        requested_shift_id: null,
        reason: '',
        priority: '',
        rep_manager: null,
        swap_employee_id: null
    });

    useEffect(() => {
        if (isOpen) {
            const company_code = sessionStorage.getItem("selectedCompanyCode");

            const fetchData = async () => {
                try {
                    const [empRes, shiftRes, managerRes, priorityRes] = await Promise.all([
                        fetch(`${config.apiBaseUrl}/getEmployeeId`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_code }) }),
                        fetch(`${config.apiBaseUrl}/ShiftMasterDropDown`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_code }) }),
                        fetch(`${config.apiBaseUrl}/ESSManager`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_code }) }),
                        fetch(`${config.apiBaseUrl}/getPriority`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_code }) })
                    ]);

                    const emps = await empRes.json();
                    const shifts = await shiftRes.json();
                    const managers = await managerRes.json();
                    const priorities = await priorityRes.json();

                    setEmployeeOptions(emps.map(o => ({ value: o.EmployeeId, label: `${o.EmployeeId} - ${o.First_Name}` })));
                    setShiftOptions(shifts.map(o => ({ value: o.Shift_Code, label: `${o.Shift_Code} - ${o.Shift_Name}` })));
                    setManagerOptions(managers.map(o => ({ value: o.EmployeeId, label: `${o.EmployeeId}-${o.full_name}` })));
                    setPriorityOptions(priorities.map(o => ({ value: o.attributedetails_name, label: o.attributedetails_name })));

                    const currentShift = shifts.find(s => s.Shift_Code === rowData?.Shift_Code);
                    setFullShiftName(currentShift ? `${currentShift.Shift_Code} - ${currentShift.Shift_Name}` : rowData?.Shift_Code);
                } catch (err) {
                    console.error("Fetch Error:", err);
                }
            };
            fetchData();

            setForm({ requested_shift_id: null, reason: '', priority: '', rep_manager: null, swap_employee_id: null });
        }
    }, [isOpen, rowData]);

    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));

        if (value) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: false
            }));
        }
    };

    const handleInternalSave = async () => {

        let newErrors = {};

if (!form.requested_shift_id) newErrors.requested_shift_id = true;
if (!form.rep_manager) newErrors.rep_manager = true;

// ✅ Only validate swap employee for Employee screen
if (screenType !== "Admin" && !form.swap_employee_id) {
    newErrors.swap_employee_id = true;
}

if (!form.priority) newErrors.priority = true;
if (!form.reason.trim()) newErrors.reason = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.warning("Please fill all required fields!");
            return;
        }

        const payload = {
            employee_id: rowData?.Employee_ID,
            current_shift_id: rowData?.Shift_Code,
            requested_shift_id: form.requested_shift_id?.value,
            reason: form.reason,
            priority: form.priority?.value,
            swap_employee_id: form.swap_employee_id?.value || '',
            effective_date: rowData?.Date,
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            Location_Code: sessionStorage.getItem('selectedLocationCode'),
            RepManager: form.rep_manager?.value,
            created_by: sessionStorage.getItem('selectedUserCode'),
            screen_type: screenType   // ✅ important
        };

        setIsSubmitting(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/shiftChangeRequestInsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Request submitted successfully!");
                setTimeout(() => { onSuccess(); onClose(); }, 1500);
            } else {
                toast.error(result.message || "Failed to submit.");
            }
        } catch (error) {
            toast.error("Server error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const customSelectStyles = {
        control: (base) => ({ ...base, backgroundColor: 'var(--exp-input-field)', borderColor: 'var(--border-color)', color: 'var(--font-color)' }),
        singleValue: (base) => ({ ...base, color: 'var(--font-color)' }),
        menu: (base) => ({ ...base, backgroundColor: 'var(--bg-color)', zIndex: 9999 }),
        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? 'var(--sidenav-hover)' : 'transparent', color: state.isFocused ? 'var(--font-hover)' : 'var(--font-color)' }),
    };

    const handleResetAndClose = () => {
        setForm({
            requested_shift_id: null,
            reason: '',
            priority: null,
            rep_manager: null,
            swap_employee_id: null
        });
        setErrors({}); 
        onClose(); 
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="side-drawer-wrapper open">
            <div className="side-drawer-backdrop" onClick={handleResetAndClose}></div>
            <div className="side-drawer-panel">
                <div className="side-drawer-header">
                    <div>
                        <h5 className="m-0" style={{ color: 'var(--font-hover)' }}>Shift Change Request</h5>
                        <small style={{ color: 'var(--font-hover)', opacity: 0.8 }}>Date: {rowData?.Date}</small>
                    </div>
                    <button className="close-drawer-icon" title='Close' onClick={handleResetAndClose}>&times;</button>
                </div>

                <div className="side-drawer-body">
                    <div className="current-info-card mb-4">
                        <label className="label-caps">Current Assignment</label>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold" style={{ color: 'var(--font-color)' }}>{rowData?.Employee_ID}</span>
                            <span className="current-shift-tag">{fullShiftName}</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="mb-3" title='Please enter the Requested New Shift'>
                            <label className="form-label-bold" style={{ color: errors.requested_shift_id ? 'red' : 'inherit' }}>Requested New Shift<span className="text-danger">*</span></label>
                            <Select
                                styles={customSelectStyles}
                                options={shiftOptions}
                                isClearable
                                value={form.requested_shift_id}
                                onChange={(val) => handleFieldChange('requested_shift_id', val)}
                                placeholder="Select Shift..."
                            />
                        </div>

                        <div className="row">
                            <div className="col-6 mb-3" title='Please select the Priority'>
                                <label className="form-label-bold" style={{ color: errors.priority ? 'red' : 'inherit' }}>Priority<span className="text-danger">*</span></label>
                                <Select
                                    styles={customSelectStyles}
                                    options={priorityOptions}
                                    isClearable
                                    placeholder="Select Priority..."
                                    value={form.priority}
                                    onChange={(val) => handleFieldChange('priority', val)}
                                    title="Please select the Priority"
                                />
                            </div>
                            <div className="col-6 mb-3" title='Please select the Reporting Manager'>
                                <label className="form-label-bold" style={{ color: errors.rep_manager ? 'red' : 'inherit' }}>Reporting Manager<span className="text-danger">*</span></label>
                                <Select
                                    styles={customSelectStyles}
                                    options={managerOptions}
                                    isClearable
                                    value={form.rep_manager}
                                    title="Please select the Reporting Manager"
                                    onChange={(val) => handleFieldChange('rep_manager', val)}
                                    placeholder="Select Manager..."
                                />
                            </div>
                        </div>

                        <div className="mb-3" title='Please select the Swap Employee'>
                            <label className="form-label-bold" style={{ color: errors.swap_employee_id ? 'red' : 'inherit' }}>Swap Employee<span className="text-danger">*</span></label>
                            <Select
                                styles={customSelectStyles}
                                options={employeeOptions}
                                isClearable
                                isDisabled={screenType === "Admin"}   // disable here
                                value={form.swap_employee_id}
                                onChange={(val) => handleFieldChange('swap_employee_id', val)}
                                placeholder="Select Employee..."
                                title="Please select the Swap Employee"
                            />
                        </div>

                        <div className="mb-3" title='Please enter the Reason for Change'>
                            <label className="form-label-bold" style={{ color: errors.reason ? 'red' : 'inherit' }}>Reason for Change<span className="text-danger">*</span></label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Explain why you need this change..."
                                style={{ backgroundColor: 'var(--exp-input-field)', color: 'var(--font-color)', borderColor: 'var(--border-color)' }}
                                value={form.reason}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setForm({ ...form, reason: val });
                                    if (val.trim()) setErrors(prev => ({ ...prev, reason: false }));
                                }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="side-drawer-footer">
                    <button className="btn-discard" title='Cancel' onClick={handleResetAndClose} disabled={isSubmitting}>Cancel</button>
                    <button className="btn-submit-request" title={`${isSubmitting ? "Submitting..." : "Submit Request"}`} onClick={handleInternalSave} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ShiftRequestModal;