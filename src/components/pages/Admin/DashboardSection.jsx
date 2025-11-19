import { Users, UserCheck, Package, DollarSign, TrendingUp, Plus } from "lucide-react";
import styles from "./DashboardSection.module.css";

const DashboardSection = ({ stats, setActiveSection, setShowCreateStaffModal }) => {
  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      change: "+12%",
      icon: Users,
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
    },
    {
      title: "Team Members",
      value: stats.totalUsers,
      change: "+3%",
      icon: UserCheck,
      iconBg: "#d1fae5",
      iconColor: "#059669",
    },
    {
      title: "Total Products",
      value: stats.totalProducts || 0,
      change: "+8%",
      icon: Package,
      iconBg: "#e9d5ff",
      iconColor: "#9333ea",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: "+24%",
      icon: DollarSign,
      iconBg: "#fef3c7",
      iconColor: "#d97706",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <div 
                className={styles.iconWrapper}
                style={{ background: stat.iconBg }}
              >
                <stat.icon size={24} color={stat.iconColor} />
              </div>
              <div className={styles.changeBadge}>
                <TrendingUp size={12} />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className={styles.statValue}>{stat.value}</h3>
            <p className={styles.statTitle}>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsCard}>
        <h3 className={styles.quickActionsTitle}>
          <span className={styles.titleAccent}></span>
          Quick Actions
        </h3>
        <div className={styles.actionsGrid}>
          <button
            onClick={() => {
              setActiveSection("staff");
              setShowCreateStaffModal(true);
            }}
            className={`${styles.actionButton} ${styles.actionButtonBlue}`}
          >
            <div className={styles.actionIconBlue}>
              <Plus color="#ffffff" size={20} />
            </div>
            <span>Add Staff</span>
          </button>
          <button
            onClick={() => setActiveSection("products")}
            className={`${styles.actionButton} ${styles.actionButtonPurple}`}
          >
            <div className={styles.actionIconPurple}>
              <Package color="#ffffff" size={20} />
            </div>
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveSection("customers")}
            className={`${styles.actionButton} ${styles.actionButtonGreen}`}
          >
            <div className={styles.actionIconGreen}>
              <Users color="#ffffff" size={20} />
            </div>
            <span>Customers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
