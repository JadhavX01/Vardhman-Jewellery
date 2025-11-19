import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Call backend forgot-password endpoint
      const res = await API.post("/auth/forgot-password", { email });
      
      setSuccess(true);
      toast.success(res.data.message || "Password reset link sent to your email!");
      
      // Clear email after success
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (success) {
      setSuccess(false);
      setEmail("");
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle className={styles.checkIcon} />
          </div>
          <h2 className={styles.successTitle}>Check Your Email</h2>
          <p className={styles.successMessage}>
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className={styles.successNote}>
            The link will expire in 1 hour. Check your spam folder if you don't see it.
          </p>
          <div className={styles.successLinks}>
            <Link
              to="/login"
              onClick={handleBackToLogin}
              className={styles.backLink}
            >
              <ArrowLeft className={styles.backIcon} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Mail className={styles.mailIcon} />
          </div>
          <h2 className={styles.title}>Forgot Password?</h2>
          <p className={styles.subtitle}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <label className={styles.label}>Email Address *</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                className={`${styles.input} ${
                  focusedField ? styles.inputFocused : ""
                }`}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <Link
            to="/login"
            className={styles.footerLink}
          >
            <ArrowLeft className={styles.footerIcon} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
