import { ShoppingCart, Search, Menu, Heart, User, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";  // WhatsApp icon
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Header.module.css";
import logo from "../../images/logo.jpg";

export function Header({ cartCount, onCartClick }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // WhatsApp number hardcoded here; replace with your real number including country code without + or spaces
  const whatsappNumber = "7743901468";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Navigation links with Home, About, Collections, Contact
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo & Mobile Menu */}
          <div className={styles.logoSection}>
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={styles.menuIcon} />
              ) : (
                <Menu className={styles.menuIcon} />
              )}
            </button>
            <Link to="/" className={styles.logoLink}>
              <motion.img 
                src={logo}
                alt="Vardhman Jewels Logo"
                className={styles.logoImage}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <span className={styles.logoName}>VARDHMAN JEWELS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={styles.navLink}
              >
                {link.name}
                <span className={styles.navUnderline}></span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
              aria-label="WhatsApp"
              title="Chat with us on WhatsApp"
              style={{ color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <FaWhatsapp size={23} />
            </a>

            <button 
              className={styles.iconButton}
              onClick={() => navigate("/search")}
              aria-label="Search"
            >
              <Search className={styles.icon} />
            </button>

            <button 
              className={styles.iconButton}
              onClick={() => navigate("/wishlist")}
              aria-label="Wishlist"
            >
              <Heart className={styles.icon} />
            </button>

            <button 
              className={styles.iconButton}
              onClick={() => navigate("/profile")}
              aria-label="Profile"
            >
              <User className={styles.icon} />
            </button>

            <button 
              className={styles.cartButton}
              onClick={onCartClick}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className={styles.icon} />
              {cartCount > 0 && (
                <motion.span 
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
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
            className={styles.mobileMenu}
          >
            <nav className={styles.mobileNav}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.mobileNavItem}
                >
                  <Link
                    to={link.path}
                    className={styles.mobileNavLink}
                    onClick={handleNavClick}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
