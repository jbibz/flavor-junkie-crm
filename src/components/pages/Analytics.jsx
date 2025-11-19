import { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import Chart from "react-apexcharts";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { salesService } from "@/services/api/salesService";
import { productService } from "@/services/api/productService";

const Analytics = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateRange, setDateRange] = useState("month");
  const [filteredSales, setFilteredSales] = useState([]);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    sales: 0,
    avgOrder: 0,
    topProduct: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dateRanges = {
    week: { label: "This Week", start: startOfWeek(new Date()), end: endOfWeek(new Date()) },
    month: { label: "This Month", start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    quarter: { label: "This Quarter", start: startOfQuarter(new Date()), end: endOfQuarter(new Date()) },
    year: { label: "This Year", start: startOfYear(new Date()), end: endOfYear(new Date()) }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  useEffect(() => {
    filterSalesData();
  }, [sales, products, dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, productsData] = await Promise.all([
        salesService.getAll(),
        productService.getAll()
      ]);

      setSales(salesData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterSalesData = () => {
    const range = dateRanges[dateRange];
    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= range.start && saleDate <= range.end;
    });

    setFilteredSales(filtered);
    calculateMetrics(filtered);
  };

  const calculateMetrics = (salesData) => {
    const revenue = salesData.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const totalSales = salesData.length;
    const avgOrder = totalSales > 0 ? revenue / totalSales : 0;

    // Find top product
    const productSales = {};
    salesData.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { quantity: 0, revenue: 0 };
      }
      productSales[sale.productId].quantity += sale.quantity;
      productSales[sale.productId].revenue += sale.totalRevenue;
    });

    const topProductId = Object.entries(productSales).sort((a, b) => b[1].revenue - a[1].revenue)[0]?.[0];
    const topProduct = products.find(p => p.Id === parseInt(topProductId))?.name || "N/A";

    setMetrics({ revenue, sales: totalSales, avgOrder, topProduct });
  };

  const getRevenueChartData = () => {
    const dailyRevenue = {};
    const range = dateRanges[dateRange];
    
    // Initialize all days in range with 0
    for (let d = new Date(range.start); d <= range.end; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, "yyyy-MM-dd");
      dailyRevenue[dateKey] = 0;
    }

    // Fill in actual revenue
    filteredSales.forEach(sale => {
      const dateKey = format(new Date(sale.date), "yyyy-MM-dd");
      if (dailyRevenue.hasOwnProperty(dateKey)) {
        dailyRevenue[dateKey] += sale.totalRevenue;
      }
    });

    const dates = Object.keys(dailyRevenue).sort();
    const revenues = dates.map(date => dailyRevenue[date]);

    return {
      series: [{
        name: "Revenue",
        data: revenues
      }],
      options: {
        chart: {
          type: "area",
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: ["#F59E0B"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        xaxis: {
          categories: dates.map(date => format(new Date(date), dateRange === "year" ? "MMM" : "MM/dd")),
          labels: {
            style: { fontSize: "12px", colors: "#6B7280" }
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${value.toFixed(0)}`,
            style: { fontSize: "12px", colors: "#6B7280" }
          }
        },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 3
        },
        tooltip: {
          y: { formatter: (value) => `$${value.toFixed(2)}` }
        },
        dataLabels: { enabled: false }
      }
    };
  };

  const getProductPerformanceData = () => {
    const productPerformance = {};
    
    filteredSales.forEach(sale => {
      const productName = products.find(p => p.Id === sale.productId)?.name || "Unknown";
      if (!productPerformance[productName]) {
        productPerformance[productName] = 0;
      }
      productPerformance[productName] += sale.totalRevenue;
    });

    const sortedProducts = Object.entries(productPerformance)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7); // Top 7 products

    return {
      series: [{
        name: "Revenue",
        data: sortedProducts.map(([, revenue]) => revenue)
      }],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { show: false }
        },
        colors: ["#D97706"],
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: true,
            dataLabels: { position: "top" }
          }
        },
        xaxis: {
          categories: sortedProducts.map(([name]) => name),
          labels: {
            formatter: (value) => `$${value.toFixed(0)}`,
            style: { fontSize: "12px", colors: "#6B7280" }
          }
        },
        yaxis: {
          labels: {
            style: { fontSize: "12px", colors: "#6B7280" }
          }
        },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 3
        },
        tooltip: {
          y: { formatter: (value) => `$${value.toFixed(2)}` }
        },
        dataLabels: { enabled: false }
      }
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadAnalyticsData} title="Analytics Error" />;
  }

  const revenueChart = getRevenueChartData();
  const productChart = getProductPerformanceData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Sales Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Analyze your sales performance and revenue trends.
          </p>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          {Object.entries(dateRanges).map(([key, range]) => (
            <Button
              key={key}
              variant={dateRange === key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setDateRange(key)}
              className="min-w-0 flex-shrink-0"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue.toLocaleString()}
          prefix="$"
          icon="DollarSign"
          className="text-center sm:text-left"
        />
        <MetricCard
          title="Total Sales"
          value={metrics.sales.toLocaleString()}
          icon="ShoppingCart"
          className="text-center sm:text-left"
        />
        <MetricCard
          title="Avg Order Value"
          value={metrics.avgOrder.toFixed(0)}
          prefix="$"
          icon="TrendingUp"
          className="text-center sm:text-left"
        />
        <MetricCard
          title="Top Product"
          value={metrics.topProduct}
          icon="Award"
          className="text-center sm:text-left"
        />
      </div>

      {/* Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
            Revenue Trend - {dateRanges[dateRange].label}
          </h2>
          <Chart
            options={revenueChart.options}
            series={revenueChart.series}
            type="area"
            height={300}
          />
        </Card>

        {/* Product Performance */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
            Product Performance - {dateRanges[dateRange].label}
          </h2>
          {productChart.series[0].data.length > 0 ? (
            <Chart
              options={productChart.options}
              series={productChart.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500">
              <div className="text-center px-4">
                <p className="text-sm sm:text-base">No sales data for selected period</p>
                <p className="text-xs sm:text-sm mt-1">Try selecting a different date range</p>
              </div>
            </div>
          )}
        </Card>
      </div>
{/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Sales Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Total Orders:</span>
              <span className="font-medium text-gray-900 text-sm sm:text-base">{metrics.sales}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Total Revenue:</span>
              <span className="font-medium text-gray-900 text-sm sm:text-base">${metrics.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Average Order:</span>
              <span className="font-medium text-gray-900 text-sm sm:text-base">${metrics.avgOrder.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-600 text-sm sm:text-base">Best Seller:</span>
              <span className="font-medium text-amber-600 text-sm sm:text-base truncate ml-2">{metrics.topProduct}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Quick Stats</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)}
              </div>
              <div className="text-sm text-green-700 mt-1">Units Sold</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {new Set(filteredSales.map(sale => sale.productId)).size}
              </div>
              <div className="text-sm text-blue-700 mt-1">Products Sold</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">Growth Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-amber-700 min-w-0">
                  <p className="font-medium">Peak Performance</p>
                  <p className="break-words">{metrics.topProduct} is your best seller</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-gray-700 min-w-0">
                  <p className="font-medium">Opportunity</p>
                  <p className="break-words">Consider promoting lower-performing products</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;