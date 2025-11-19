import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import styles from "./VerifyOtpPage.module.css";

const OTP_LENGTH = 6;
const STEP_FLOW = [
  { label: "Account Details", status: "done" },
  { label: "Verify Email", status: "current" },
  { label: "Welcome", status: "upcoming" },
];

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email?.trim() || "";

  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  const otpValue = otpDigits.join("");
  const canResend = timer === 0 && !resendLoading;
  const formattedTimer = `00:${String(timer).padStart(2, "0")}`;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer]);

  const assignInputRef = (index) => (element) => {
    inputRefs.current[index] = element;
  };

  const updateDigit = (index, value) => {
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const distributeDigits = (startIndex, value) => {
    const digits = value.replace(/\D/g, "").split("");
    if (digits.length === 0) return;

    setOtpDigits((prev) => {
      const next = [...prev];
      let cursor = startIndex;
      digits.forEach((digit) => {
        if (cursor < OTP_LENGTH) {
          next[cursor] = digit;
          cursor += 1;
        }
      });
      return next;
    });

    const lastFilledIndex = Math.min(startIndex + digits.length - 1, OTP_LENGTH - 1);
    const nextFocusIndex = lastFilledIndex + 1;

    window.requestAnimationFrame(() => {
      if (nextFocusIndex < OTP_LENGTH) {
        inputRefs.current[nextFocusIndex]?.focus();
      } else {
        inputRefs.current[OTP_LENGTH - 1]?.blur();
      }
    });
  };

  const handleDigitChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) {
      updateDigit(index, "");
      return;
    }

    if (sanitized.length > 1) {
      distributeDigits(index, sanitized);
      return;
    }

    updateDigit(index, sanitized);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (otpDigits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (index, event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");
    if (!pasted) return;
    distributeDigits(index, pasted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedOtp = otpValue.replace(/\D/g, "");

    if (!cleanedOtp) {
      setError("Please enter the OTP");
      return;
    }

    if (cleanedOtp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/customer/verify-otp", {
        email,
        otp: cleanedOtp,
      });

      if (res.data?.token) {
        const token = res.data.token;
        const baseUser = {
          token,
          custId: res.data.custId,
          email,
          role: "customer",
          userType: (res.data.userType || "customer").toLowerCase(),
        };

        login(baseUser);

        localStorage.setItem("custId", res.data.custId || "");
        localStorage.setItem("role", "customer");

        try {
          const profileRes = await API.get("/auth/me");
          if (profileRes.data?.user) {
            const syncedUser = { ...profileRes.data.user, token };
            login(syncedUser);
          }
        } catch (profileErr) {
          console.error("Profile fetch after OTP failed:", profileErr);
        }

        setOtpDigits(Array(OTP_LENGTH).fill(""));
        setTimer(0);

        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/");
        }, 600);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "OTP verification failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }

    if (timer > 0) {
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);

    try {
      const res = await API.post("/auth/resend-otp", {
        email,
      });

      setResendSuccess(true);
      toast.success(res.data?.message || "OTP resent to your email.");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setError("");
      setTimer(60);
      inputRefs.current[0]?.focus();

      setTimeout(() => {
        setResendSuccess(false);
      }, 3200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
      console.error("Resend OTP error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/register");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardGrid}>
          <aside className={styles.infoColumn}>
            <button type="button" onClick={handleBackClick} className={styles.backButton}>
              <ArrowLeft size={14} />
              Back
            </button>

            <div className={styles.brandBadge}>
              <span className={styles.badgeIcon}>💎</span>
              <div>
                <p className={styles.badgeTitle}>Shree Vardhaman Jewellers</p>
                <p className={styles.badgeSubtitle}>Premium Jewellery Club</p>
              </div>
            </div>

            <div className={styles.infoCopy}>
              <h3 className={styles.infoHeading}>One Last Step</h3>
              <p className={styles.infoDescription}>
                Enter the one-time password we just emailed you to activate your account.
              </p>
            </div>

            <div className={styles.progressTrack}>
              {STEP_FLOW.map((step, index) => {
                const stepClass =
                  step.status === "done"
                    ? styles.stepDone
                    : step.status === "current"
                    ? styles.stepCurrent
                    : styles.stepUpcoming;

                return (
                  <div className={styles.stepItem} key={step.label}>
                    <div className={`${styles.stepBadge} ${stepClass}`}>{index + 1}</div>
                    <span className={`${styles.stepLabel} ${stepClass}`}>{step.label}</span>
                    {index < STEP_FLOW.length - 1 && <div className={styles.stepDivider} />}
                  </div>
                );
              })}
            </div>

            <ul className={styles.checklist}>
              <li>OTP is valid for the next <strong>10 minutes</strong>.</li>
              <li>Check your promotions or spam folder if you can’t find the email.</li>
              <li>Contact our support team if you need a new verification link.</li>
            </ul>

            <div className={styles.supportCard}>
              <p className={styles.supportTitle}>Need assistance?</p>
              <p className={styles.supportCopy}>
                Reach out at <a href="mailto:support@vardhamanjewels.com">support@vardhamanjewels.com</a>
                {" "}or call +91-98765-43210.
              </p>
            </div>
          </aside>

          <section className={styles.formColumn}>
            <div className={styles.formHeader}>
              <div className={styles.iconRing}>
                <Mail size={28} color="#D4AF37" />
              </div>
              <h2 className={styles.title}>Verify Your Email</h2>
              <p className={styles.subtitle}>Enter the 6-digit code sent to</p>
              <p className={styles.emailDisplay}>{email || "your email"}</p>
            </div>

            {error && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                {error}
              </div>
            )}

            {resendSuccess && (
              <div className={`${styles.alert} ${styles.alertSuccess}`}>
                OTP resent successfully! Check your inbox.
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.label}>Enter OTP *</label>
                <div className={styles.otpInputWrapper}>
                  <div className={styles.otpGrid}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={assignInputRef(index)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]*"
                        maxLength={1}
                        className={styles.otpDigit}
                        value={digit}
                        onChange={(event) => handleDigitChange(index, event.target.value)}
                        onKeyDown={(event) => handleDigitKeyDown(index, event)}
                        onPaste={(event) => handleDigitPaste(index, event)}
                        disabled={loading}
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <p className={styles.otpHint}>Enter the 6-digit code from your email</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div className={styles.resendSection}>
              <div className={styles.resendMeta}>
                <p className={styles.resendPrompt}>Didn&apos;t receive the code?</p>
                <div
                  className={`${styles.timerChip} ${
                    canResend ? styles.timerChipReady : styles.timerChipWaiting
                  }`}
                >
                  <span className={styles.timerLabel}>Resend in</span>
                  <span className={styles.timerValue}>{formattedTimer}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend}
                className={styles.resendButton}
              >
                {resendLoading ? "Sending..." : canResend ? "Resend OTP" : "Please wait"}
              </button>
            </div>

            <div className={styles.backLink}>
              <Link to="/register" className={styles.backAnchor}>
                <ArrowLeft size={14} />
                Back to Registration
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;