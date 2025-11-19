import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "../../ui/button";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Mock data for analytics
  const analyticsData = {
    totalRevenue: 2548900,
    totalOrders: 342,
    totalCustomers: 87,
    averageOrderValue: 7452,
    revenueGrowth: 23.5,
    orderGrowth: 12.3,
    customerGrowth: 8.7,
    conversionRate: 3.8,
  };

  // Mock monthly sales data
  const monthlySalesData = [
    { month: "Jan", sales: 45000, orders: 28 },
    { month: "Feb", sales: 52000, orders: 32 },
    { month: "Mar", sales: 48000, orders: 29 },
    { month: "Apr", sales: 61000, orders: 38 },
    { month: "May", sales: 55000, orders: 34 },
    { month: "Jun", sales: 67000, orders: 42 },
    { month: "Jul", sales: 72000, orders: 45 },
    { month: "Aug", sales: 68000, orders: 41 },
    { month: "Sep", sales: 75000, orders: 47 },
    { month: "Oct", sales: 82000, orders: 51 },
    { month: "Nov", sales: 95000, orders: 58 },
    { month: "Dec", sales: 128900, orders: 97 },
  ];

  // Mock product category data
  const categoryData = [
    { category: "Necklaces", sales: 450000, percentage: 28.5 },
    { category: "Rings", sales: 380000, percentage: 24.1 },
    { category: "Bracelets", sales: 320000, percentage: 20.3 },
    { category: "Earrings", sales: 285000, percentage: 18.1 },
    { category: "Others", sales: 113900, percentage: 8.9 },
  ];

  // Mock customer data
  const topCustomers = [
    { name: "Madhu Online Services", spent: 85000, orders: 8, status: "VIP" },
    { name: "Aditya Jadhav", spent: 62000, orders: 6, status: "Regular" },
    { name: "Rajesh Kumar", spent: 45000, orders: 4, status: "Regular" },
    { name: "Priya Sharma", spent: 38000, orders: 3, status: "Regular" },
    { name: "Amit Patel", spent: 28000, orders: 2, status: "New" },
  ];

  // Calculate max values for charts
  const maxMonthlySales = Math.max(...monthlySalesData.map(d => d.sales));
  const maxOrders = Math.max(...monthlySalesData.map(d => d.orders));

  return (
    <div className="analyticsContainer">
      {/* Header */}
      <div className="analyticsHeader">
        <div>
          <h2 className="analyticsTitle">📊 Analytics & Reports</h2>
          <p className="analyticsSubtitle">
            Track sales, revenue, and customer insights
          </p>
        </div>
        <Button className="exportBtn">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="timeRangeContainer">
        <div className="timeRangeLabel">📅 View By:</div>
        <div className="timeRangeButtons">
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              className={`timeRangeBtn ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metricsGrid">
        {/* Total Revenue */}
        <div className="metricCard">
          <div className="metricIcon revenue">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Total Revenue</p>
            <h3 className="metricValue">
              ₹{(analyticsData.totalRevenue / 100000).toFixed(2)}L
            </h3>
            <p className="metricChange positive">
              ↑ {analyticsData.revenueGrowth}% from last {timeRange}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="metricCard">
          <div className="metricIcon orders">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Total Orders</p>
            <h3 className="metricValue">{analyticsData.totalOrders}</h3>
            <p className="metricChange positive">
              ↑ {analyticsData.orderGrowth}% from last {timeRange}
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="metricCard">
          <div className="metricIcon customers">
            <Users className="w-6 h-6" />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Total Customers</p>
            <h3 className="metricValue">{analyticsData.totalCustomers}</h3>
            <p className="metricChange positive">
              ↑ {analyticsData.customerGrowth}% from last {timeRange}
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="metricCard">
          <div className="metricIcon average">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Average Order Value</p>
            <h3 className="metricValue">
              ₹{(analyticsData.averageOrderValue / 1000).toFixed(1)}K
            </h3>
            <p className="metricChange">
              Conversion: {analyticsData.conversionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="chartsGrid">
        {/* Monthly Sales Chart */}
        <div className="chartCard">
          <h3 className="chartTitle">📈 Monthly Sales Trend</h3>
          <div className="chartContainer">
            <div className="barChart">
              <div className="chartYAxis">
                <span>₹{(maxMonthlySales / 1000).toFixed(0)}K</span>
                <span>₹{(maxMonthlySales / 2000).toFixed(0)}K</span>
                <span>₹0</span>
              </div>
              <div className="chartBars">
                {monthlySalesData.map((data, idx) => (
                  <div key={idx} className="barGroup">
                    <div
                      className="bar"
                      style={{
                        height: `${(data.sales / maxMonthlySales) * 100}%`,
                        backgroundColor: "#a855f7",
                      }}
                      title={`₹${data.sales}`}
                    />
                    <span className="barLabel">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="chartCard">
          <h3 className="chartTitle">🏷️ Sales by Category</h3>
          <div className="categoryChart">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="categoryRow">
                <div className="categoryInfo">
                  <p className="categoryName">{cat.category}</p>
                  <p className="categoryAmount">₹{(cat.sales / 100000).toFixed(2)}L</p>
                </div>
                <div className="categoryBar">
                  <div
                    className="categoryBarFill"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="categoryPercent">{cat.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Timeline Chart */}
      <div className="chartCard fullWidth">
        <h3 className="chartTitle">📊 Orders Timeline</h3>
        <div className="chartContainer">
          <div className="lineChart">
            <div className="chartYAxis">
              <span>{maxOrders}</span>
              <span>{Math.round(maxOrders / 2)}</span>
              <span>0</span>
            </div>
            <div className="chartLine">
              {monthlySalesData.map((data, idx) => (
                <div
                  key={idx}
                  className="linePoint"
                  style={{
                    height: `${(data.orders / maxOrders) * 100}%`,
                  }}
                  title={`${data.orders} orders`}
                />
              ))}
            </div>
          </div>
          <div className="chartXAxis">
            {monthlySalesData.map((data, idx) => (
              <span key={idx}>{data.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="chartCard fullWidth">
        <h3 className="chartTitle">👥 Top Customers</h3>
        <div className="tableContainer">
          <table className="analyticsTable">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Total Spent</th>
                <th>Orders</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, idx) => (
                <tr key={idx}>
                  <td className="customerName">{customer.name}</td>
                  <td className="amount">₹{(customer.spent / 1000).toFixed(1)}K</td>
                  <td className="orders">{customer.orders}</td>
                  <td>
                    <span className={`statusBadge ${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summaryStats">
        <div className="statItem">
          <span className="statLabel">Average Monthly Revenue</span>
          <span className="statValue">
            ₹{(analyticsData.totalRevenue / 12 / 100000).toFixed(2)}L
          </span>
        </div>
        <div className="statItem">
          <span className="statLabel">Average Orders Per Month</span>
          <span className="statValue">{Math.round(analyticsData.totalOrders / 12)}</span>
        </div>
        <div className="statItem">
          <span className="statLabel">Customer Lifetime Value</span>
          <span className="statValue">
            ₹{(analyticsData.totalRevenue / analyticsData.totalCustomers / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="statItem">
          <span className="statLabel">Top Category</span>
          <span className="statValue">Necklaces (28.5%)</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
