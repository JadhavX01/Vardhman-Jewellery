import { LogOut, Home, Package, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

export function AdminHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminMenuItems = [
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('custId');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('vardhaman_user');
      
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur-md border-b border-amber-600/30">
      <div className="container mx-auto px-3 xs:px-4">
        <div className="flex items-center justify-between h-16 xs:h-20">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4 xs:gap-6">
            <button 
              className="md:hidden text-amber-400 hover:text-amber-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 xs:w-6 xs:h-6" />
              ) : (
                <Menu className="w-5 h-5 xs:w-6 xs:h-6" />
              )}
            </button>
            <Link to="/admin/orders" className="flex items-center gap-2 group">
              <motion.div 
                className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white text-sm xs:text-base font-bold">A</span>
              </motion.div>
              <div>
                <span className="text-lg xs:text-xl text-amber-400 font-bold">MOS</span>
                <span className="text-sm xs:text-base text-amber-400 block -mt-1">ADMIN</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6">
            {adminMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-slate-300 hover:text-amber-400 transition-all duration-300 relative group text-sm lg:text-base flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50"
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 xs:gap-3">
            {/* Back to Store Button */}
            <button 
              onClick={() => navigate('/')}
              className="text-amber-400 hover:text-white hover:bg-amber-600/20 transition-all duration-300 p-2 rounded-lg"
              title="Back to Store"
            >
              <Home className="w-4 h-4 xs:w-5 xs:h-5" />
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-white hover:bg-red-600/20 transition-all duration-300 p-2 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-4 h-4 xs:w-5 xs:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-amber-600/30 bg-slate-900/95 backdrop-blur-md"
          >
            <nav className="container mx-auto px-3 xs:px-4 py-4 xs:py-6 flex flex-col gap-3 xs:gap-4">
              {adminMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="text-slate-300 hover:text-amber-400 transition-colors duration-300 block py-2 text-sm xs:text-base flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-slate-700 pt-4 mt-4"
              >
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300 block py-2 text-sm xs:text-base flex items-center gap-2 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
