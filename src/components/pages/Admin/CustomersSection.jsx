import { useState } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";

const CustomersSection = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.Cust_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.EMail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.Mobile?.includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
        }} size={18} />
        <input
          type="text"
          placeholder="Search customers..."
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

      {/* Customers Table */}
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
              background: 'linear-gradient(to right, #f9fafb, #d1fae5)',
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
                  Customer Name
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
                  Mobile
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
                  Location
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ background: '#ffffff' }}>
              {filteredCustomers.map((c) => (
                <tr
                  key={c.Cust_Id}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#d1fae5'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <td style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                  }}>
                    #{c.Cust_Id}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}>
                    {c.Cust_Name}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    color: '#6b7280',
                    display: window.innerWidth >= 768 ? 'table-cell' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} color="#6b7280" />
                      {c.EMail || "N/A"}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    color: '#6b7280',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color="#6b7280" />
                      {c.Mobile}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    fontSize: '14px',
                    color: '#6b7280',
                    display: window.innerWidth >= 1024 ? 'table-cell' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="#6b7280" />
                      {c.CityName}, {c.State}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: c.IsActive ? '#d1fae5' : '#fee2e2',
                      color: c.IsActive ? '#065f46' : '#991b1b',
                      border: c.IsActive ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    }}>
                      {c.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#6b7280',
          }}>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No customers found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
          Customer Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Customers</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{customers.length}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
              {customers.filter(c => c.IsActive).length}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Inactive</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
              {customers.filter(c => !c.IsActive).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersSection;
