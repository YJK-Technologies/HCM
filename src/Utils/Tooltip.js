import Select from "react-select";

/* =======================
   🔹 Form Input Component
======================= */
export const FormInput = ({
  label,
  value,
  error,
  required,
  children,
}) => {
  return (
    <div
      className="inputGroup"
      title={`Please enter the ${label}`} 
    >
      {children}

      <label
        className={`exp-form-labels ${
          error && !value ? "text-danger" : ""
        }`}
      >
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
    </div>
  );
};

/* =======================
   🔹 Form Select Component
======================= */
export const FormSelect = ({
  label,
  value,
  error,
  required,
  options,
  onChange,
  isFocused,
  setIsFocused,
}) => {
  return (
    <div
        className={`inputGroup selectGroup 
        ${value ? "has-value" : ""} 
        ${isFocused ? "is-focused" : ""}`}
        title={`Please select the ${label}`} 
    >
      <Select
        classNamePrefix="react-select"
        placeholder=""
        isClearable
        value={value}
        onChange={onChange}
        options={options}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <label
        className={`floating-label ${
          error && !value ? "text-danger" : ""
        }`}
      >
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
    </div>
  );
};