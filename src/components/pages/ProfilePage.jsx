import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { User, Package, Heart, Settings, LogOut, MapPin, CreditCard, Mail, Phone, Shield, Edit2, Plus, Trash2, Home, Briefcase, Star } from "lucide-react";
import { toast } from "sonner";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [safeUserData, setSafeUserData] = useState({
    name: "Demo User",
    email: "demo@gmail.com",
    mobile: "9999999999",
    role: "user",
  });

  const [deleteModalTarget, setDeleteModalTarget] = useState(null); // 🆕 Delete modal state
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", mobile: "" });
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Address Management State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    addressType: 'Home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  // Load user data
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vardhaman_user");
      const parsed = stored ? JSON.parse(stored) : null;
      const authUser = user || parsed;

      if (authUser) {
        const userData = {
          name: authUser.name || authUser.userName || authUser.Login || "Demo User",
          email: authUser.email || authUser.Login || "demo@gmail.com",
          mobile: authUser.mobile || authUser.phone || "9999999999",
          role: authUser.role || "user",
        };
        
        setSafeUserData(userData);

        const parts = userData.name.split(" ");
        setFormData({
          firstName: parts[0] || "Demo",
          lastName: parts.slice(1).join(" ") || "User",
          mobile: userData.mobile
        });
      }
    } catch (err) {
      console.error("Error reading user data:", err);
    }
  }, [user]);

  // Load addresses when addresses tab is active
  useEffect(() => {
    if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab]);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "DU";
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    // { id: "payment", label: "Payment Methods", icon: CreditCard },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  // Load Addresses
  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await API.get('/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Load addresses error:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Open Add Address Modal
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      addressType: 'Home',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India',
      phone: safeUserData.mobile,
      isDefault: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  // Open Edit Address Modal
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      addressType: address.AddressType,
      addressLine1: address.AddressLine1,
      addressLine2: address.AddressLine2 || '',
      city: address.City,
      state: address.State,
      pinCode: address.PinCode,
      country: address.Country || 'India',
      phone: address.Phone || safeUserData.mobile,
      isDefault: address.IsDefault === 1
    });
    setShowAddressModal(true);
  };

  // Save Address (Add or Update)
  const handleSaveAddress = async () => {
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (addressForm.pinCode.length !== 6) {
      toast.error('PIN code must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      if (editingAddress) {
        await API.put(`/addresses/${editingAddress.AddressId}`, addressForm);
        toast.success('✅ Address updated successfully');
      } else {
        await API.post('/addresses', addressForm);
        toast.success('✅ Address added successfully');
      }
      
      setShowAddressModal(false);
      loadAddresses();
    } catch (error) {
      console.error('Save address error:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  // 🆕 Delete Address (with modal close)
  const handleDeleteAddress = async (addressId) => {
    try {
      await API.delete(`/addresses/${addressId}`);
      toast.success('✅ Address deleted successfully');
      setDeleteModalTarget(null); // Close modal
      loadAddresses();
    } catch (error) {
      console.error('Delete address error:', error);
      toast.error('Failed to delete address');
    }
  };

  // Set Default Address
  const handleSetDefault = async (addressId) => {
    try {
      await API.put(`/addresses/${addressId}/default`);
      toast.success('✅ Default address updated');
      loadAddresses();
    } catch (error) {
      console.error('Set default error:', error);
      toast.error('Failed to set default address');
    }
  };


  const { login } = useAuth();
  const handleSaveChanges = async () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const mobile = formData.mobile.trim();
  
    if (!fullName || fullName.length === 0) {
      toast.error("Please enter your first and last name");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
  
    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await API.put('/auth/update-profile', { name: fullName, mobile: formData.mobile });
      if (res.data && res.data.user) {
        const updatedUser = res.data.user;
        setSafeUserData({
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          role: updatedUser.role,
        });
        login(updatedUser); // Update context + localStorage
        toast.success('✅ Profile updated successfully!');
        setIsEditingPhone(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('custId');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('vardhaman_user');
      
      logout();
      navigate('/login');
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === "orders") {
      navigate("/orders");
    } else if (tabId === "wishlist") {
      navigate("/wishlist");
    } else {
      setActiveTab(tabId);
    }
  };

  // Get Address Icon
  const getAddressIcon = (type) => {
    switch(type) {
      case 'Home': return <Home size={20} />;
      case 'Work': return <Briefcase size={20} />;
      default: return <MapPin size={20} />;
    }
  };

  return (
    <div className="profile-page">
      {/* Hero Header */}
      <div className="profile-hero">
        <div className="profile-hero-overlay"></div>
        <div className="profile-hero-content">
          <User size={48} className="hero-icon" />
          <h1 className="profile-hero-title">My Account</h1>
          <p className="profile-hero-subtitle">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-grid">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                <span>{getInitials(safeUserData.name)}</span>
              </div>
              <h3 className="user-name">{safeUserData.name}</h3>
              <p className="user-email">{safeUserData.email}</p>
              <div className="user-badge">
                <Shield size={12} />
                <span>{safeUserData.role === "admin" ? "Admin" : "Registered"}</span>
              </div>
            </div>

            <nav className="profile-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
              <button onClick={handleLogout} className="nav-item logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            {activeTab === "profile" && (
              <div className="content-card">
                <h2 className="content-title">Personal Information</h2>
                
                <form className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-readonly">
                      <Mail size={18} />
                      <span>{safeUserData.email}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    {isEditingPhone ? (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({ ...formData, mobile: value });
                          }}
                          placeholder="10 digit mobile number"
                          style={{
                            flex: 1,
                            padding: '14px 16px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '2px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '10px',
                            color: '#f5f5f5',
                            fontSize: '15px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setIsEditingPhone(false)}
                          style={{
                            padding: '14px 20px',
                            background: 'rgba(220, 38, 38, 0.2)',
                            border: '2px solid rgba(220, 38, 38, 0.3)',
                            borderRadius: '10px',
                            color: '#dc2626',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="input-readonly" style={{ cursor: 'pointer' }} onClick={() => setIsEditingPhone(true)}>
                        <Phone size={18} />
                        <span>{safeUserData.mobile}</span>
                        <Edit2 size={16} style={{ marginLeft: 'auto', color: '#D4AF37' }} />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                      className="btn-save"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const parts = safeUserData.name.split(" ");
                        setFormData({
                          firstName: parts[0] || "Demo",
                          lastName: parts.slice(1).join(" ") || "User",
                          mobile: safeUserData.mobile
                        });
                        setIsEditingPhone(false);
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 className="content-title" style={{ margin: 0 }}>Saved Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #D4AF37, #c19820)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Plus size={18} />
                    Add Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <p className="content-placeholder">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <MapPin size={64} style={{ color: '#D4AF37', opacity: 0.5, marginBottom: '20px' }} />
                    <p className="content-placeholder">No addresses found. Add your first address!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {addresses.map((address) => (
                      <div
                        key={address.AddressId}
                        style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: address.IsDefault ? '2px solid #D4AF37' : '2px solid rgba(212, 175, 55, 0.2)',
                          borderRadius: '12px',
                          padding: '24px',
                          position: 'relative'
                        }}
                      >
                        {/* Default Badge */}
                        {address.IsDefault && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'linear-gradient(135deg, #D4AF37, #c19820)',
                            color: '#000',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Star size={12} />
                            DEFAULT
                          </div>
                        )}

                        {/* Address Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '2px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D4AF37'
                          }}>
                            {getAddressIcon(address.AddressType)}
                          </div>
                          <div>
                            <h3 style={{ color: '#D4AF37', fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>
                              {address.AddressType}
                            </h3>
                            {address.Phone && (
                              <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                                📞 {address.Phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Address Details */}
                        <div style={{ color: '#f5f5f5', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                          <p style={{ margin: '0 0 4px 0' }}>{address.AddressLine1}</p>
                          {address.AddressLine2 && <p style={{ margin: '0 0 4px 0' }}>{address.AddressLine2}</p>}
                          <p style={{ margin: '0' }}>
                            {address.City}, {address.State} - {address.PinCode}
                          </p>
                          <p style={{ margin: '4px 0 0 0', color: '#999' }}>{address.Country}</p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {!address.IsDefault && (
                            <button
                              onClick={() => handleSetDefault(address.AddressId)}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '8px',
                                color: '#D4AF37',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEditAddress(address)}
                            style={{
                              padding: '8px 16px',
                              background: 'rgba(212, 175, 55, 0.1)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '8px',
                              color: '#D4AF37',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s'
                            }}
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          {/* 🆕 Updated Delete Button */}
                          <button
                            onClick={() => setDeleteModalTarget(address.AddressId)}
                            style={{
                              padding: '8px 16px',
                              background: 'rgba(220, 38, 38, 0.1)',
                              border: '1px solid rgba(220, 38, 38, 0.3)',
                              borderRadius: '8px',
                              color: '#dc2626',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          
          </main>
        </div>
      </div>

      {/* ADDRESS MODAL (Add/Edit) */}
      {showAddressModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowAddressModal(false)}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#D4AF37', fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Address Type */}
              <div>
                <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                  Address Type *
                </label>
                <select
                  value={addressForm.addressType}
                  onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '10px',
                    color: '#f5f5f5',
                    fontSize: '15px'
                  }}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Billing">Billing</option>
                  <option value="Shipping">Shipping</option>
                </select>
              </div>

              {/* Address Line 1 */}
              <div>
                <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="House/Flat No., Building Name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '10px',
                    color: '#f5f5f5',
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="Street, Area, Landmark"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '10px',
                    color: '#f5f5f5',
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* City & State */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="City"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      color: '#f5f5f5',
                      fontSize: '15px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="State"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      color: '#f5f5f5',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              {/* PIN Code & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={addressForm.pinCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setAddressForm({ ...addressForm, pinCode: value });
                    }}
                    placeholder="6-digit PIN"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      color: '#f5f5f5',
                      fontSize: '15px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setAddressForm({ ...addressForm, phone: value });
                    }}
                    placeholder="10-digit mobile"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      color: '#f5f5f5',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Set as Default */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="isDefault" style={{ color: '#f5f5f5', fontSize: '14px', cursor: 'pointer' }}>
                  Set as default address
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleSaveAddress}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #D4AF37, #c19820)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  {isLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                </button>
                <button
                  onClick={() => setShowAddressModal(false)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'transparent',
                    color: '#f5f5f5',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 DELETE CONFIRMATION MODAL */}
      {deleteModalTarget && (
        <div 
          className="delete-modal"
          onClick={() => setDeleteModalTarget(null)}
          style={{
            visibility: 'visible',
            opacity: 1,
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1001,
            transition: 'all 0.4s',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            className="delete-modal__content"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: '16px',
              position: 'relative',
              width: '450px',
              maxWidth: '90%',
              background: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid rgba(220, 38, 38, 0.5)',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(220, 38, 38, 0.4)',
              animation: 'scaleIn 0.3s ease'
            }}
          >
            {/* Warning Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '3px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'pulse 2s infinite'
            }}>
              <Trash2 size={40} style={{ color: '#dc2626' }} />
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#dc2626',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              Delete Address?
            </h2>

            {/* Message */}
            <p style={{
              fontSize: '15px',
              color: '#ccc',
              textAlign: 'center',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Are you sure you want to delete this address? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setDeleteModalTarget(null)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'transparent',
                  color: '#f5f5f5',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAddress(deleteModalTarget)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
                  transition: 'all 0.3s'
                }}
              >
                Yes, Delete
              </button>
            </div>

            {/* Close X Button */}
            <button
              onClick={() => setDeleteModalTarget(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#999',
                fontSize: '32px',
                cursor: 'pointer',
                lineHeight: 1,
                padding: 0,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
