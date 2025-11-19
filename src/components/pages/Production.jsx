import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productionService } from "@/services/api/productionService";
import { productService } from "@/services/api/productService";

const Production = () => {
  const [production, setProduction] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProduction, setFilteredProduction] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    productId: "",
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBatch, setExpandedBatch] = useState(null);

  useEffect(() => {
    loadProductionData();
  }, []);

  useEffect(() => {
    filterData();
  }, [production, products, searchTerm]);

  const loadProductionData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productionData, productsData] = await Promise.all([
        productionService.getAll(),
        productService.getAll()
      ]);

      setProduction(productionData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load production data:", error);
      setError("Failed to load production data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = production.filter(batch => {
      const product = products.find(p => p.Id === batch.productId);
      const productName = product?.name || "";
      return productName.toLowerCase().includes(searchLower) ||
             batch.notes?.toLowerCase().includes(searchLower);
    });
    setFilteredProduction(filtered);
  };

  const calculateBatchCost = (productId, quantity) => {
    const product = products.find(p => p.Id === productId);
    if (!product?.recipe) return 0;

    const multiplier = quantity / (product.batchSize || 1);
    return product.recipe.reduce((total, item) => {
      return total + (item.gramsPerBatch * multiplier * item.costPerGram);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newBatch.productId || !newBatch.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const totalCost = calculateBatchCost(parseInt(newBatch.productId), parseInt(newBatch.quantity));
      
      const batchData = {
        productId: parseInt(newBatch.productId),
        date: new Date(newBatch.date).toISOString(),
        quantity: parseInt(newBatch.quantity),
        totalCost,
        notes: newBatch.notes
      };

      await productionService.create(batchData);
      
      // Update product stock
      const product = products.find(p => p.Id === parseInt(newBatch.productId));
      if (product) {
        await productService.update(parseInt(newBatch.productId), {
          currentStock: product.currentStock + parseInt(newBatch.quantity)
        });
      }

      // Reload data
      loadProductionData();
      
      // Reset form
      setNewBatch({
        productId: "",
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      
      setShowModal(false);
      toast.success("Production batch logged successfully!");
    } catch (error) {
      console.error("Failed to log production batch:", error);
      toast.error("Failed to log production batch");
    }
  };

  const handleProductChange = (productId) => {
    const product = products.find(p => p.Id === parseInt(productId));
    setNewBatch({
      ...newBatch,
      productId,
      quantity: product?.batchSize || 1
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.Id === productId);
    return product?.name || "Unknown Product";
  };

  const toggleBatchDetails = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadProductionData} title="Production Error" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Production History
          </h1>
          <p className="mt-2 text-gray-600">
            Track your production batches and manufacturing costs.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => setShowModal(true)}
            icon="Plus"
          >
            Log Production
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search production history..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Production History */}
      <Card className="overflow-hidden">
        {filteredProduction.length === 0 ? (
          <Empty
            title="No production history found"
            description="Start by logging your first production batch to track manufacturing."
            icon="Factory"
            action={() => setShowModal(true)}
            actionText="Log First Batch"
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProduction.map((batch) => (
              <div key={batch.Id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getProductName(batch.productId)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(batch.date), "MMMM d, yyyy")} • {batch.quantity} units
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${batch.totalCost?.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${(batch.totalCost / batch.quantity).toFixed(2)}/unit
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBatchDetails(batch.Id)}
                      icon={expandedBatch === batch.Id ? "ChevronUp" : "ChevronDown"}
                    >
                      Details
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBatch === batch.Id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Batch Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Production Date:</span>
                            <span className="text-gray-900">{format(new Date(batch.date), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quantity Produced:</span>
                            <span className="text-gray-900">{batch.quantity} units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Batch Cost:</span>
                            <span className="text-gray-900">${batch.totalCost?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Unit:</span>
                            <span className="text-gray-900">${(batch.totalCost / batch.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Production Notes</h4>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {batch.notes || "No notes recorded for this batch"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Production Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Log Production Batch</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Product" required>
                <select
                  value={newBatch.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.Id} value={product.Id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Quantity Produced" required>
                <Input
                  type="number"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}
                  min="1"
                  required
                />
              </FormField>

              <FormField label="Production Date" required>
                <Input
                  type="date"
                  value={newBatch.date}
                  onChange={(e) => setNewBatch({...newBatch, date: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Production Notes">
                <textarea
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
                  rows="3"
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Optional notes about this production batch..."
                />
              </FormField>

              {newBatch.productId && newBatch.quantity && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Estimated Batch Cost:</span>
                      <span className="font-bold text-amber-900">
                        ${calculateBatchCost(parseInt(newBatch.productId), parseInt(newBatch.quantity)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Cost per Unit:</span>
                      <span className="font-medium text-amber-900">
                        ${(calculateBatchCost(parseInt(newBatch.productId), parseInt(newBatch.quantity)) / parseInt(newBatch.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1" icon="Factory">
                  Log Production
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
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

export default Production;