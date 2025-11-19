import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      if (res.data.token) {
        // Check if user is admin
        if (res.data.role !== 'admin') {
          toast.error("Access denied. Admin credentials required.");
          setLoading(false);
          return;
        }

        // Use AuthContext login method
        login({
          token: res.data.token,
          redirectTo: res.data.redirectTo,
          ...res.data.user,
        });

        toast.success("Admin login successful!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Admin Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-200">Vardhaman Jewellery Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Administrator Login
            </h2>
            <p className="text-blue-200 text-sm">
              Enter your admin credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pl-11 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@vardhaman.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pl-11 pr-11 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          {/* Back to User Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-300 hover:text-white text-sm transition-colors"
            >
              ← Back to User Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-blue-300 text-xs">
            🔒 This is a secure admin area. All activities are logged.
          </p>
        </div>
      </div>

      {/* CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;