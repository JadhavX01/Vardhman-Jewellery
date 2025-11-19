import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   if (!form.email || form.email.trim() === "") {
  //     setError("Email is required");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!form.password || form.password.trim() === "") {
  //     setError("Password is required");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await API.post("/auth/customer/login", {
  //       email: form.email,
  //       password: form.password,
  //     });

  //     if (res.data.token) {
  //       login({
  //         token: res.data.token,
  //         ...res.data.user,
  //       });

  //       // Save to localStorage (existing format)
  //       localStorage.setItem(
  //         "vardhaman_user",
  //         JSON.stringify({
  //           token: res.data.token,
  //           ...res.data.user,
  //         })
  //       );

  //       // ✅ ALSO SAVE THESE SEPARATELY FOR CART/WISHLIST
  //       localStorage.setItem("token", res.data.token);
  //       localStorage.setItem("custId", res.data.user.custId || res.data.user.Cust_Id);
  //       localStorage.setItem("role", res.data.user.role || "customer");

  //       toast.success("Login successful!");

  //       setTimeout(() => {
  //         navigate("/");
  //       }, 500);
  //     }
  //   } catch (err) {
  //     const errorMsg =
  //       err.response?.data?.message || "Login failed. Please check your credentials.";
  //     setError(errorMsg);
  //     toast.error(errorMsg);
  //     console.error("Login error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!form.email || form.email.trim() === "") {
      setError("Email is required");
      setLoading(false);
      return;
    }
  
    if (!form.password || form.password.trim() === "") {
      setError("Password is required");
      setLoading(false);
      return;
    }
  
    try {
      const res = await API.post("/auth/customer/login", {
        email: form.email,
        password: form.password,
      });
  
      if (res.data.token) {
        const token = res.data.token;
        const baseUser = {
          token,
          ...res.data.user,
        };

        // Persist the initial auth state so interceptors can use it immediately
        localStorage.setItem("vardhaman_user", JSON.stringify(baseUser));
        localStorage.setItem("token", token);
        localStorage.setItem("custId", res.data.user.custId || res.data.user.Cust_Id);
        localStorage.setItem("role", res.data.user.role || "customer");

        // Update React context with the initial user payload
        login(baseUser);

        try {
          // Fetch the freshest profile details
          const profileRes = await API.get("/auth/me");

          if (profileRes.data && profileRes.data.user) {
            const syncedUser = { ...profileRes.data.user, token };
            localStorage.setItem("vardhaman_user", JSON.stringify(syncedUser));
            login(syncedUser);
          }
        } catch (profileErr) {
          console.error("Profile fetch error:", profileErr);
        }

        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStaffLoginClick = () => {
    navigate("/staff-login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>
            Login to your account to continue shopping
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Field */}
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
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
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
                  focusedField === "password" ? styles.inputFocused : ""
                }`}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
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

        {/* Forgot Password Link */}
        <div className={styles.linkSection}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>

        {/* Register Section */}
        <div className={styles.registerSection}>
          <span className={styles.registerText}>Don't have an account?</span>
          <Link to="/register" className={styles.registerLink}>
            Register here
          </Link>
        </div>

        {/* Staff/Admin Login Section */}
        <div className={styles.staffSection}>
          
          <button
            type="button"
            onClick={handleStaffLoginClick}
            className={styles.staffButton}
          >
            <span className={styles.staffButtonText}>Staff/Admin Login</span>
            <span className={styles.staffArrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
