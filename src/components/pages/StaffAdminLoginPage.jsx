import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import styles from "./StaffAdminLoginPage.module.css";

const StaffAdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.login || form.login.trim() === "") {
      setError("Username/Login ID is required");
      setLoading(false);
      return;
    }

    if (!form.password || form.password.trim() === "") {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      // Call backend staff/admin login endpoint
      const res = await API.post("/auth/staff-admin/login", {
        login: form.login,
        password: form.password,
      });

      console.log("Login response:", res.data); // Debug log

      if (res.data.token) {
        const userData = {
          token: res.data.token,
          ...res.data.user, // userId, name, login, role
        };

        // Store token and user data in AuthContext
        login(userData);

        // Store in localStorage for persistence
        localStorage.setItem("vardhaman_user", JSON.stringify(userData));

        // Show appropriate message based on user role
        const userRole = (res.data.user.role || '').toLowerCase();
        
        if (userRole === "admin") {
          toast.success("Admin login successful! Redirecting...");
          // Force full page reload to clear cache
          window.location.href = "/admin-dashboard";
          return;
        } else if (userRole === "staff") {
          toast.success("Staff login successful! Redirecting...");
          // Force full page reload to clear cache
          window.location.href = "/staff-dashboard";
          return;
        } else {
          setError(`Invalid user role: ${userRole}`);
          setLoading(false);
          return;
        }
      } else {
        setError("No token received from server");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleCustomerLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBackClick}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
          <span>Back to Home</span>
        </button>

        {/* <p className={styles.backNote}>
          Use customer login at footer or main navigation
        </p> */}

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Staff & Admin Login</h2>
          <p className={styles.subtitle}>
            Login with your credentials provided by management
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username/Login ID Field */}
          <div className={styles.formField}>
            <label className={styles.label}>Username / Login ID *</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="login"
                value={form.login}
                onChange={handleChange}
                onFocus={() => setFocusedField("login")}
                onBlur={() => setFocusedField("")}
                className={`${styles.input} ${
                  focusedField === "login" ? styles.inputFocused : ""
                }`}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>
            <p className={styles.inputHint}>
              Provided by your administrator
            </p>
          </div>

          {/* Password Field */}
          <div className={styles.formField}>
            <label className={styles.label}>Password *</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`${styles.input} ${styles.inputWithIcon} ${
                  focusedField === "password" ? styles.inputFocused : ""
                }`}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                tabIndex="-1"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className={styles.eyeIcon} />
                ) : (
                  <Eye className={styles.eyeIcon} />
                )}
              </button>
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Customer Login Section */}
        <div className={styles.customerSection}>
          {/* <p className={styles.customerLabel}>Are you a customer?</p> */}
          <button
            type="button"
            onClick={handleCustomerLoginClick}
            className={styles.customerButton}
          >
            <span className={styles.customerButtonText}>Customer Login</span>
            <span className={styles.customerArrow}>→</span>
          </button>
        </div>

        {/* Help Text */}
        <div className={styles.helpBox}>
          <p className={styles.helpText}>
            <strong className={styles.helpBold}>Need help?</strong> Contact your administrator if you don't have login credentials or have forgotten your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffAdminLoginPage;
