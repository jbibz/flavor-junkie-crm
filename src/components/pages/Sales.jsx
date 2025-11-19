import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import FormField from "@/components/molecules/FormField";
import MetricCard from "@/components/molecules/MetricCard";
import CalendarView from "@/components/organisms/CalendarView";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { salesService } from "@/services/api/salesService";
import { productService } from "@/services/api/productService";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
    monthlyGrowth: 0
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSales, setSelectedSales] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [newSale, setNewSale] = useState({
    productId: "",
    quantity: 1,
    unitPrice: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, productsData] = await Promise.all([
        salesService.getAll(),
        productService.getAll()
      ]);

      setSales(salesData);
      setProducts(productsData);
      calculateMetrics(salesData);
    } catch (error) {
      console.error("Failed to load sales data:", error);
      setError("Failed to load sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (salesData) => {
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const totalSales = salesData.length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Calculate monthly growth (mock calculation)
    const currentMonth = new Date().getMonth();
    const currentMonthSales = salesData.filter(sale => 
      new Date(sale.date).getMonth() === currentMonth
    );
    const lastMonthSales = salesData.filter(sale => 
      new Date(sale.date).getMonth() === currentMonth - 1
    );
    
    const currentMonthRevenue = currentMonthSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const lastMonthRevenue = lastMonthSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    
    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    setMetrics({
      totalRevenue,
      totalSales,
      avgOrderValue,
      monthlyGrowth
    });
  };

  const handleDateSelect = (date, dailySales) => {
    setSelectedDate(date);
    setSelectedSales(dailySales);
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSale.productId || !newSale.quantity || !newSale.unitPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const selectedProduct = products.find(p => p.Id === parseInt(newSale.productId));
      
      if (selectedProduct.currentStock < newSale.quantity) {
        toast.error("Insufficient stock for this sale");
        return;
      }

      const saleData = {
        date: new Date(newSale.date).toISOString(),
        productId: parseInt(newSale.productId),
        quantity: parseInt(newSale.quantity),
        unitPrice: parseFloat(newSale.unitPrice),
        totalRevenue: parseInt(newSale.quantity) * parseFloat(newSale.unitPrice)
      };

      await salesService.create(saleData);
      
      // Update product stock
      await productService.update(parseInt(newSale.productId), {
        currentStock: selectedProduct.currentStock - parseInt(newSale.quantity)
      });

      // Reload data
      loadSalesData();
      
      // Reset form
      setNewSale({
        productId: "",
        quantity: 1,
        unitPrice: 0,
        date: new Date().toISOString().split('T')[0]
      });
      
      setShowSaleModal(false);
      toast.success("Sale recorded successfully!");
    } catch (error) {
      console.error("Failed to create sale:", error);
      toast.error("Failed to record sale");
    }
  };

  const handleProductChange = (productId) => {
    const product = products.find(p => p.Id === parseInt(productId));
    setNewSale({
      ...newSale,
      productId,
      unitPrice: product?.pricePerUnit || 0
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.Id === productId);
    return product?.name || "Unknown Product";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadSalesData} title="Sales Error" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Sales Tracking
          </h1>
          <p className="mt-2 text-gray-600">
            Track your daily sales and revenue with calendar overview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => setShowSaleModal(true)}
            icon="Plus"
          >
            Record Sale
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
          changeType={metrics.monthlyGrowth >= 0 ? "positive" : "negative"}
          change={Math.abs(metrics.monthlyGrowth)}
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales.toLocaleString()}
          icon="ShoppingCart"
        />
        <MetricCard
          title="Avg Order Value"
          value={metrics.avgOrderValue.toFixed(0)}
          prefix="$"
          icon="TrendingUp"
        />
        <MetricCard
          title="Monthly Growth"
          value={Math.abs(metrics.monthlyGrowth).toFixed(1)}
          suffix="%"
          icon={metrics.monthlyGrowth >= 0 ? "TrendingUp" : "TrendingDown"}
          changeType={metrics.monthlyGrowth >= 0 ? "positive" : "negative"}
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <CalendarView onDateSelect={handleDateSelect} />
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
            </h3>
            
            {selectedDate && selectedSales.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedSales.reduce((sum, sale) => sum + sale.totalRevenue, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Sales Details:</h4>
                  {selectedSales.map((sale) => (
                    <div key={sale.Id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{getProductName(sale.productId)}</div>
                        <div className="text-sm text-gray-600">{sale.quantity} units × ${sale.unitPrice}</div>
                      </div>
                      <div className="font-medium text-gray-900">${sale.totalRevenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No sales on this date</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Click a date to view sales</p>
              </div>
            )}
          </Card>

          {/* Recent Sales */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
            {sales.length === 0 ? (
              <Empty
                title="No sales recorded"
                description="Start recording your sales to track revenue."
                icon="ShoppingCart"
                action={() => setShowSaleModal(true)}
                actionText="Record First Sale"
              />
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sales.slice(0, 10).map((sale) => (
                  <div key={sale.Id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-gray-900">{getProductName(sale.productId)}</div>
                      <div className="text-xs text-gray-500">{format(new Date(sale.date), "MMM d")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${sale.totalRevenue.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{sale.quantity} units</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Record New Sale</h3>
              <button
                onClick={() => setShowSaleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="space-y-4">
              <FormField label="Product" required>
                <select
                  value={newSale.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.Id} value={product.Id}>
                      {product.name} (Stock: {product.currentStock})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Quantity" required>
                <Input
                  type="number"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                  min="1"
                  required
                />
              </FormField>

              <FormField label="Unit Price" required>
                <Input
                  type="number"
                  step="0.01"
                  value={newSale.unitPrice}
                  onChange={(e) => setNewSale({...newSale, unitPrice: e.target.value})}
                  min="0.01"
                  required
                />
              </FormField>

              <FormField label="Sale Date" required>
                <Input
                  type="date"
                  value={newSale.date}
                  onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                  required
                />
              </FormField>

              {newSale.quantity && newSale.unitPrice && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Total Revenue:</span>
                    <span className="font-bold text-amber-900">
                      ${(newSale.quantity * newSale.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  Record Sale
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowSaleModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Sales;