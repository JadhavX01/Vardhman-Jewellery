import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { toast } from "sonner";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    custName: "",
    email: "",
    mobile: "",
    add1: "",
    add2: "",
    state: "",
    cityName: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [states, setStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [citiesCache, setCitiesCache] = useState({});
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const cityDropdownRef = useRef(null);
  const cityInputRef = useRef(null);

  // Click outside handler for city dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        if (data?.data?.states) {
          setStates(data.data.states.map((s) => s.name));
        }
      } catch (err) {
        console.error("Error loading states:", err);
        toast.error("Failed to load states. Please refresh.");
      }
    };
    fetchStates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      let val = value.replace(/[^\d+]/g, "");
      if (val.startsWith("+91")) val = "+91" + val.slice(3, 13);
      else val = val.slice(0, 10);
      setForm({ ...form, mobile: val });
      return;
    }

    if (name === "pinCode") {
      const val = value.replace(/\D/g, "").slice(0, 6);
      setForm({ ...form, pinCode: val });
      return;
    }

    if (name === "password") {
      setForm({ ...form, password: value });
      if (!value) setPasswordStrength("");
      else if (value.length < 6) setPasswordStrength("Too Short");
      else if (!/(?=.*[a-z])/.test(value)) setPasswordStrength("Add lowercase");
      else if (!/(?=.*[A-Z])/.test(value)) setPasswordStrength("Add uppercase");
      else if (!/(?=.*\d)/.test(value)) setPasswordStrength("Add number");
      else if (!/(?=.*[!@_#\$%\^&\*])/.test(value))
        setPasswordStrength("Add special char");
      else setPasswordStrength("Strong");
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setForm({ ...form, state: selectedState, cityName: "" });
    setCitySearch("");
    setShowCityDropdown(false);
    setAvailableCities([]);

    if (!selectedState) return;

    if (citiesCache[selectedState]) {
      setAvailableCities(citiesCache[selectedState]);
      return;
    }

    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India", state: selectedState }),
        }
      );
      const data = await res.json();
      if (data?.data) {
        setAvailableCities(data.data);
        setCitiesCache((prev) => ({ ...prev, [selectedState]: data.data }));
      }
    } catch (err) {
      console.error("Error loading cities:", err);
      toast.error("Failed to load cities for this state.");
    }
  };

  const handleCitySearch = (e) => {
    const search = e.target.value;
    setCitySearch(search);
    if (form.state && availableCities.length > 0) setShowCityDropdown(true);
    if (form.cityName && search !== form.cityName) setForm({ ...form, cityName: "" });
  };

  const handleCitySelect = (city) => {
    setForm({ ...form, cityName: city });
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const getFilteredCities = () => {
    if (!form.state) return [];
    const cities = availableCities || [];
    if (!citySearch) return cities.slice(0, 10);
    return cities
      .filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
      .slice(0, 15);
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@_#\$%\^&\*])[A-Za-z\d!@_#\$%\^&\*]{6,}$/;

  const validateForm = () => {
    const custName = form.custName.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();
    const add1 = form.add1.trim();
    const cityName = form.cityName.trim();
    const pinCode = form.pinCode.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!custName) return setError("Customer name is required");
    if (!email || !email.includes("@")) return setError("Valid email is required");
    if (!mobile || !/^(\+91)?\d{10}$/.test(mobile))
      return setError("Valid mobile number is required (10 digits, optional +91)");
    if (!add1) return setError("Address Line 1 is required");
    if (!form.state) return setError("State is required");
    if (!cityName) return setError("City is required");
    if (!pinCode || !/^\d{6}$/.test(pinCode))
      return setError("Valid pincode (6 digits) is required");
    if (!password || !passwordRegex.test(password))
      return setError(
        "Password must be at least 6 chars, include uppercase, lowercase, number & special char"
      );
    if (password !== confirmPassword)
      return setError("Passwords do not match");
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      custName: form.custName.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim(),
      add1: form.add1.trim(),
      add2: form.add2 ? form.add2.trim() : "",
      state: form.state,
      cityName: form.cityName.trim(),
      pinCode: form.pinCode.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      const res = await API.post("/auth/customer/register", payload);
      if (res.data.custId) {
        toast.success("Registration successful! Check your email for OTP.");
        navigate("/verify-otp", {
          state: { email: form.email, custId: res.data.custId },
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = getFilteredCities();

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Create Your Account
          </h2>
          <p className={styles.subtitle}>
            Join Shree Vardhaman Jewellers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Personal Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>

            <div className={styles.fieldGroup}>
              {/* Full Name */}
              <div className={styles.formField}>
                <label className={styles.label}>Full Name *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="custName"
                    value={form.custName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("custName")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "custName" ? styles.inputFocused : ""
                    }`}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.formField}>
                <label className={styles.label}>Email Address *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "email" ? styles.inputFocused : ""
                    }`}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className={styles.formField}>
                <label className={styles.label}>Mobile Number *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("mobile")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "mobile" ? styles.inputFocused : ""
                    }`}
                    placeholder="+91 XXXXXXXXXX"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Address Details</h3>

            <div className={styles.fieldGroup}>
              {/* Address Line 1 */}
              <div className={styles.formField}>
                <label className={styles.label}>Address Line 1 *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="add1"
                    value={form.add1}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("add1")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "add1" ? styles.inputFocused : ""
                    }`}
                    placeholder="Street address, P.O. Box, Company name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address Line 2 */}
              <div className={styles.formField}>
                <label className={styles.label}>Address Line 2 (Optional)</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="add2"
                    value={form.add2}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("add2")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "add2" ? styles.inputFocused : ""
                    }`}
                    placeholder="Apartment, suite, unit, building, floor"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* State + City Row */}
              <div className={styles.twoColumnRow}>
                {/* State */}
                <div className={styles.formField}>
                  <label className={styles.label}>State *</label>
                  <div className={styles.inputWrapper}>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleStateChange}
                      onFocus={() => setFocusedField("state")}
                      onBlur={() => setFocusedField("")}
                      className={`${styles.input} ${styles.select} ${
                        focusedField === "state" ? styles.inputFocused : ""
                      }`}
                      required
                      disabled={loading}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div className={`${styles.formField} ${styles.relativePosition}`}>
                  <label className={styles.label}>City *</label>
                  <div className={styles.inputWrapper}>
                    <input
                      ref={cityInputRef}
                      type="text"
                      value={citySearch || form.cityName}
                      onChange={handleCitySearch}
                      onFocus={() => {
                        if (form.state && availableCities.length > 0) {
                          setShowCityDropdown(true);
                        }
                        setFocusedField("city");
                      }}
                      onBlur={() => setFocusedField("")}
                      className={`${styles.input} ${
                        focusedField === "city" ? styles.inputFocused : ""
                      }`}
                      placeholder={
                        form.state ? "Search or select city" : "Select state first"
                      }
                      disabled={!form.state || loading}
                    />
                  </div>

                  {/* City Dropdown */}
                  {showCityDropdown && form.state && (
                    <div
                      ref={cityDropdownRef}
                      className={styles.cityDropdown}
                    >
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city, index) => (
                          <button
                            key={`${city}-${index}`}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={styles.cityOption}
                          >
                            {city}
                          </button>
                        ))
                      ) : (
                        <div className={styles.noCities}>
                          {citySearch
                            ? `No cities found for "${citySearch}"`
                            : "No cities available"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected City Indicator */}
                  {form.cityName && !citySearch && (
                    <div className={styles.citySelected}>
                      ✓ {form.cityName}
                    </div>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className={styles.formField}>
                <label className={styles.label}>Pincode *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="pinCode"
                    value={form.pinCode}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("pinCode")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "pinCode" ? styles.inputFocused : ""
                    }`}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Security</h3>

            <div className={styles.fieldGroup}>
              {/* Password */}
              <div className={styles.formField}>
                <label className={styles.label}>Password *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      passwordStrength === "Strong"
                        ? styles.inputSuccess
                        : passwordStrength && passwordStrength !== "Strong"
                        ? styles.inputError
                        : focusedField === "password"
                        ? styles.inputFocused
                        : ""
                    }`}
                    placeholder="Min 6 chars, upper, lower, number, special char"
                    required
                    disabled={loading}
                  />
                </div>
                {passwordStrength && (
                  <div
                    className={`${styles.passwordStrength} ${
                      passwordStrength === "Strong"
                        ? styles.strengthStrong
                        : styles.strengthWeak
                    }`}
                  >
                    {passwordStrength === "Strong" ? "✓" : "⚠️"} {passwordStrength}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.formField}>
                <label className={styles.label}>Confirm Password *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      form.confirmPassword &&
                      form.password === form.confirmPassword
                        ? styles.inputSuccess
                        : form.confirmPassword &&
                          form.password !== form.confirmPassword
                        ? styles.inputError
                        : focusedField === "confirmPassword"
                        ? styles.inputFocused
                        : ""
                    }`}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitBtn} ${
              loading ? styles.submitBtnLoading : ""
            }`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className={styles.loginLink}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLinkText}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
