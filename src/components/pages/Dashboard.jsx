import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InventoryGrid from "@/components/organisms/InventoryGrid";
import NotesEditor from "@/components/organisms/NotesEditor";
import MetricCard from "@/components/molecules/MetricCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { productService } from "@/services/api/productService";
import { salesService } from "@/services/api/salesService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    lowStockItems: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsData, salesData] = await Promise.all([
        productService.getAll(),
        salesService.getAll()
      ]);

      setProducts(productsData);

      // Calculate metrics
      const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalRevenue, 0);
      const totalSales = salesData.length;
      const lowStockItems = productsData.filter(product => product.currentStock <= 10).length;
      const totalProducts = productsData.length;

      setMetrics({
        totalRevenue,
        totalSales,
        lowStockItems,
        totalProducts
      });

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "inventory":
        navigate("/inventory");
        break;
      case "sales":
        navigate("/sales");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "production":
        navigate("/production");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadDashboardData} title="Dashboard Error" />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to your Flavor Junkie CRM. Here's your business overview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={() => handleQuickAction("sales")} icon="Plus">
            Add Sale
          </Button>
          <Button variant="secondary" onClick={() => handleQuickAction("production")} icon="Factory">
            Log Production
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue.toLocaleString()}
          prefix="$"
          icon="DollarSign"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales.toLocaleString()}
          icon="ShoppingCart"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <MetricCard
          title="Low Stock Items"
          value={metrics.lowStockItems}
          icon="AlertTriangle"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          icon="Package"
          className="hover:shadow-lg transition-shadow duration-200"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
<Button
            variant="ghost"
            onClick={() => handleQuickAction("inventory")}
            className="h-24 p-3 flex-col justify-center items-center gap-2 min-w-0"
            icon="Package"
          >
            <span className="text-xs text-center leading-tight">Manage Inventory</span>
          </Button>
<Button
            variant="ghost"
            onClick={() => handleQuickAction("sales")}
            className="h-24 p-3 flex-col justify-center items-center gap-2 min-w-0"
            icon="ShoppingCart"
          >
            <span className="text-xs text-center leading-tight">Record Sales</span>
          </Button>
<Button
            variant="ghost"
            onClick={() => handleQuickAction("analytics")}
            className="h-24 p-3 flex-col justify-center items-center gap-2 min-w-0"
            icon="BarChart3"
          >
            <span className="text-xs text-center leading-tight">View Analytics</span>
          </Button>
<Button
            variant="ghost"
            onClick={() => handleQuickAction("production")}
            className="h-24 p-3 flex-col justify-center items-center gap-2 min-w-0"
            icon="Factory"
          >
            <span className="text-xs text-center leading-tight">Track Production</span>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Inventory Overview</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/inventory")}
              icon="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
          <InventoryGrid products={products} loading={false} error="" />
        </div>

        {/* Notes Editor */}
        <div className="space-y-6">
          <NotesEditor />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Sale recorded</p>
                  <p className="text-gray-500">BBQ Blend - 5 units sold</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Production logged</p>
                  <p className="text-gray-500">Garlic Supreme - 50 unit batch</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Low stock alert</p>
                  <p className="text-gray-500">Italian Herb Mix - 8 units remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;