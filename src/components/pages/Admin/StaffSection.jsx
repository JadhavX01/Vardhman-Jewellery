import { useState } from "react";
import { Search, Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import API from "../../../utils/api";
import { toast } from "sonner";
import CreateStaffModal from "./modals/CreateStaffModal";
import EditStaffModal from "./modals/EditStaffModal";

const StaffSection = ({ users, fetchUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [newStaff, setNewStaff] = useState({
    login: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "staff",
  });

  const [editStaff, setEditStaff] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    role: "staff",
  });

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create staff
  const handleCreateStaff = async () => {
    try {
      await API.post("/admin/users", newStaff);
      toast.success("Staff member created successfully");
      setShowCreateModal(false);
      setNewStaff({
        login: "",
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "staff",
      });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create staff");
    }
  };

  // Edit staff
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditStaff({
      userName: user.UserName,
      email: user.Email || "",
      phoneNumber: user.PhoneNumber || "",
      role: user.Role || "staff",
    });
    setShowEditModal(true);
  };

  const handleUpdateStaff = async () => {
    try {
      await API.put(`/admin/users/${selectedUser.UserID}`, editStaff);
      toast.success("Staff member updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update staff");
    }
  };

  // Delete staff
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success("Staff member deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete staff member");
    }
  };

  // Toggle lock
  const handleToggleLock = async (userId, currentStatus) => {
    try {
      await API.put(`/admin/users/${userId}/toggle-lock`, {
        lockoutEnabled: !currentStatus,
      });
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header with Search and Add Button */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
          gap: '12px',
          alignItems: 'stretch',
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth >= 640 ? '400px' : '100%' }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }} size={18} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f59e0b';
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(to right, #f59e0b, #d97706)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #d97706, #b45309)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={20} />
            Add Staff
          </button>
        </div>

        {/* Staff Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{
                background: 'linear-gradient(to right, #f9fafb, #fef3c7)',
                borderBottom: '2px solid #e5e7eb',
              }}>
                <tr>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    ID
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: window.innerWidth >= 768 ? 'table-cell' : 'none',
                  }}>
                    Login
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: window.innerWidth >= 1024 ? 'table-cell' : 'none',
                  }}>
                    Email
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Role
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: window.innerWidth >= 640 ? 'table-cell' : 'none',
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: '#ffffff' }}>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.UserID}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fef3c7'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                  >
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#374151',
                    }}>
                      #{u.UserID}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                    }}>
                      {u.UserName}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#6b7280',
                      display: window.innerWidth >= 768 ? 'table-cell' : 'none',
                    }}>
                      {u.Login}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#6b7280',
                      display: window.innerWidth >= 1024 ? 'table-cell' : 'none',
                    }}>
                      {u.Email || "N/A"}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: u.Role === "admin" ? '#f3e8ff' : '#dbeafe',
                        color: u.Role === "admin" ? '#7e22ce' : '#1e40af',
                        border: u.Role === "admin" ? '1px solid #e9d5ff' : '1px solid #bfdbfe',
                      }}>
                        {u.Role || "staff"}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      display: window.innerWidth >= 640 ? 'table-cell' : 'none',
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: u.LockoutEnabled ? '#fee2e2' : '#d1fae5',
                        color: u.LockoutEnabled ? '#991b1b' : '#065f46',
                        border: u.LockoutEnabled ? '1px solid #fecaca' : '1px solid #a7f3d0',
                      }}>
                        {u.LockoutEnabled ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleLock(u.UserID, u.LockoutEnabled)}
                          style={{
                            padding: '8px',
                            background: u.LockoutEnabled ? '#d1fae5' : '#fee2e2',
                            color: u.LockoutEnabled ? '#065f46' : '#991b1b',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = u.LockoutEnabled ? '#a7f3d0' : '#fecaca';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = u.LockoutEnabled ? '#d1fae5' : '#fee2e2';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title={u.LockoutEnabled ? "Unlock User" : "Lock User"}
                        >
                          {u.LockoutEnabled ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button
                          onClick={() => handleEditClick(u)}
                          style={{
                            padding: '8px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#bfdbfe';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#dbeafe';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        {u.Role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(u.UserID, u.UserName)}
                            style={{
                              padding: '8px',
                              background: '#fee2e2',
                              color: '#991b1b',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#fecaca';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No staff members found</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search or add a new staff member</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateStaffModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStaff}
        formData={newStaff}
        setFormData={setNewStaff}
      />

      <EditStaffModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateStaff}
        formData={editStaff}
        setFormData={setEditStaff}
      />
    </>
  );
};

export default StaffSection;
