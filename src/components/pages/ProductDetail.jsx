import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { productionService } from "@/services/api/productionService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState([]);
  const [batchMultiplier, setBatchMultiplier] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, productionData] = await Promise.all([
        productService.getById(parseInt(id)),
        productionService.getByProductId(parseInt(id))
      ]);
      
      setProduct(productData);
      setProduction(productionData || []);
    } catch (error) {
      console.error("Failed to load product data:", error);
      setError("Failed to load product data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateBatchCost = () => {
    if (!product?.recipe) return 0;
    return product.recipe.reduce((total, item) => {
      return total + (item.gramsPerBatch * batchMultiplier * item.costPerGram);
    }, 0);
  };

  const calculateUnitCost = () => {
    const batchCost = calculateBatchCost();
    const unitsPerBatch = product?.batchSize || 1;
    return batchCost / unitsPerBatch;
  };

  const calculateProfitMargin = () => {
    const unitCost = calculateUnitCost();
    const unitPrice = product?.pricePerUnit || 0;
    return unitPrice > 0 ? ((unitPrice - unitCost) / unitPrice) * 100 : 0;
  };

  const handleBatchSizeChange = (newMultiplier) => {
    const multiplier = Math.max(0.1, parseFloat(newMultiplier) || 0);
    setBatchMultiplier(multiplier);
  };

  const handleLogProduction = async () => {
    try {
      const batchData = {
        productId: parseInt(id),
        date: new Date().toISOString(),
        quantity: Math.floor((product?.batchSize || 1) * batchMultiplier),
        totalCost: calculateBatchCost(),
        notes: `Batch of ${batchMultiplier}x standard size`
      };

      await productionService.create(batchData);
      
      // Update product stock
      const newStock = product.currentStock + batchData.quantity;
      await productService.update(parseInt(id), { currentStock: newStock });
      
      setProduct({ ...product, currentStock: newStock });
      loadProductData(); // Reload to get updated production history
      
      toast.success(`Production batch logged successfully! Added ${batchData.quantity} units to inventory.`);
    } catch (error) {
      console.error("Failed to log production:", error);
      toast.error("Failed to log production batch");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadProductData} title="Product Error" />;
  }

  if (!product) {
    return <ErrorView error="Product not found" onRetry={() => navigate("/inventory")} title="Product Not Found" />;
  }

  const scaledRecipe = product.recipe?.map(item => ({
    ...item,
    scaledGrams: item.gramsPerBatch * batchMultiplier,
    scaledCost: item.gramsPerBatch * batchMultiplier * item.costPerGram
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-center sm:text-left">
          <div className="flex justify-center sm:justify-start items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/inventory")}
              icon="ArrowLeft"
            >
              Back to Inventory
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {product.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Product details, recipe, and cost analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <Button 
            onClick={handleLogProduction}
            icon="Factory"
            className="w-full sm:w-auto"
          >
            Log Production
          </Button>
          <Button variant="secondary" icon="Edit" className="w-full sm:w-auto">
            Edit Product
          </Button>
        </div>
      </div>

      {/* Product Overview */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{product.currentStock}</div>
            <div className="text-sm text-gray-600 mt-1">Current Stock</div>
            <div className="mt-2">
              {product.currentStock <= 10 ? (
                <span className="text-red-600 text-sm inline-flex items-center">
                  <span className="mr-1">⚠️</span> Low Stock
                </span>
              ) : (
                <span className="text-green-600 text-sm inline-flex items-center">
                  <span className="mr-1">✅</span> In Stock
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">${product.pricePerUnit?.toFixed(2)}</div>
            <div className="text-sm text-gray-600 mt-1">Unit Price</div>
            <div className="text-xs text-gray-500 mt-1">Selling Price</div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">${calculateUnitCost().toFixed(2)}</div>
            <div className="text-sm text-gray-600 mt-1">Unit Cost</div>
            <div className="text-xs text-gray-500 mt-1">Production Cost</div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{calculateProfitMargin().toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-1">Profit Margin</div>
            <div className="text-xs text-gray-500 mt-1">Per Unit</div>
          </div>
        </Card>
      </div>

      {/* Recipe and Batch Calculator */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">Recipe</h2>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs sm:text-sm font-medium text-gray-600">Ingredient</th>
                    <th className="text-right py-2 text-xs sm:text-sm font-medium text-gray-600">Grams</th>
                    <th className="text-right py-2 text-xs sm:text-sm font-medium text-gray-600">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {scaledRecipe.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-xs sm:text-sm text-gray-900 truncate max-w-0">{item.ingredient}</td>
                      <td className="text-right py-2 text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                        {item.scaledGrams.toFixed(1)}g
                      </td>
                      <td className="text-right py-2 text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                        ${item.scaledCost.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 text-xs sm:text-sm font-semibold text-gray-900">Total</td>
                    <td className="text-right py-3 text-xs sm:text-sm font-semibold text-gray-900 font-mono whitespace-nowrap">
                      {scaledRecipe.reduce((sum, item) => sum + item.scaledGrams, 0).toFixed(1)}g
                    </td>
                    <td className="text-right py-3 text-xs sm:text-sm font-semibold text-gray-900 font-mono whitespace-nowrap">
                      ${calculateBatchCost().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Card>

        {/* Batch Calculator */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">Batch Calculator</h2>
          <div className="space-y-6">
            <div>
              <Label>Batch Multiplier</Label>
              <Input
                type="number"
                value={batchMultiplier}
                onChange={(e) => handleBatchSizeChange(e.target.value)}
                step="0.1"
                min="0.1"
                placeholder="1.0"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">
                Standard batch size: {product.batchSize} units
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Units to Produce:</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor((product.batchSize || 1) * batchMultiplier)} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Batch Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${calculateBatchCost().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost per Unit:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${calculateUnitCost().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Expected Profit per Unit:</span>
                <span className="text-sm font-semibold text-green-600">
                  ${((product.pricePerUnit || 0) - calculateUnitCost()).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleLogProduction}
              className="w-full"
              icon="Plus"
            >
              Log Production Batch
            </Button>
          </div>
        </Card>
      </div>

      {/* Production History */}
<Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">Production History</h2>
        {production.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Factory" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm sm:text-base">No production history found</p>
            <p className="text-xs sm:text-sm mt-1">Log your first production batch to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Cost
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    Cost per Unit
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {production.map((batch) => (
                  <tr key={batch.Id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {new Date(batch.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {batch.quantity} units
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      ${batch.totalCost?.toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      ${(batch.totalCost / batch.quantity).toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 truncate max-w-xs hidden md:table-cell">
                      {batch.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;