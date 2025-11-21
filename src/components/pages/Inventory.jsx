import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { componentService } from "@/services/api/componentService";
import ApperIcon from "@/components/ApperIcon";
import StockBadge from "@/components/molecules/StockBadge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    filterData();
  }, [products, components, searchTerm]);

  const loadInventoryData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsData, componentsData] = await Promise.all([
        productService.getAll(),
        componentService.getAll()
      ]);
      setProducts(productsData);
      setComponents(componentsData);
    } catch (error) {
      console.error("Failed to load inventory data:", error);
      setError("Failed to load inventory data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const searchLower = searchTerm.toLowerCase();
    
    const filteredProds = products.filter(product =>
      product.name.toLowerCase().includes(searchLower)
    );
    
    const filteredComps = components.filter(component =>
      component.name.toLowerCase().includes(searchLower) ||
      component.type.toLowerCase().includes(searchLower)
    );

    setFilteredProducts(filteredProds);
    setFilteredComponents(filteredComps);
  };

  const handleStockUpdate = async (id, newStock, type = "product") => {
    try {
      if (type === "product") {
        await productService.update(id, { currentStock: parseInt(newStock) });
        setProducts(products.map(product =>
          product.Id === id ? { ...product, currentStock: parseInt(newStock) } : product
        ));
      } else {
        await componentService.update(id, { quantity: parseInt(newStock) });
        setComponents(components.map(component =>
          component.Id === id ? { ...component, quantity: parseInt(newStock) } : component
        ));
      }
      toast.success("Stock updated successfully");
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const groupComponentsByType = (components) => {
    return components.reduce((acc, component) => {
      if (!acc[component.type]) {
        acc[component.type] = [];
      }
      acc[component.type].push(component);
      return acc;
    }, {});
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadInventoryData} title="Inventory Error" />;
  }

  const groupedComponents = groupComponentsByType(filteredComponents);

  return (
    <div className="space-y-6">
      {/* Page Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your product inventory and production components.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button icon="Plus">
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Tabs */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none min-h-[44px] ${
              activeTab === "products"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none min-h-[44px] ${
              activeTab === "components"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Components ({filteredComponents.length})
          </button>
        </div>

        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search inventory..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Content */}
      {activeTab === "products" ? (
<Card className="overflow-hidden">
          {filteredProducts.length === 0 ? (
            <Empty
              title="No products found"
              description="Start by adding your seasoning products to track inventory."
              icon="Package"
            />
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block sm:hidden space-y-4 p-4">
                {filteredProducts.map((product) => (
                  <Card key={product.Id} className="p-4 bg-white shadow-sm border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-base">{product.name}</h3>
                        <StockBadge stock={product.currentStock} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Stock
                          </Label>
                          <Input
                            type="number"
                            value={product.currentStock}
                            onChange={(e) => handleStockUpdate(product.Id, e.target.value)}
                            className="mt-1 min-h-[44px]"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </Label>
                          <div className="mt-1 text-gray-900 text-base font-medium flex items-center h-[44px]">
                            ${product.pricePerUnit?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProductClick(product.Id)}
                          icon="Eye"
                          className="min-h-[44px]"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.Id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={product.currentStock}
                            onChange={(e) => handleStockUpdate(product.Id, e.target.value)}
                            className="w-20 sm:w-24 min-h-[44px]"
                            min="0"
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <StockBadge stock={product.currentStock} />
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 text-sm sm:text-base">
                          ${product.pricePerUnit?.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProductClick(product.Id)}
                            icon="Eye"
                            className="min-h-[44px]"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.keys(groupedComponents).length === 0 ? (
            <Empty
              title="No components found"
              description="Add production components like lids, bottles, and labels."
              icon="Boxes"
            />
          ) : (
            Object.entries(groupedComponents).map(([type, typeComponents]) => (
              <Card key={type} className="overflow-hidden">
                <div
                  className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleSection(type)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {type}s ({typeComponents.length})
                  </h3>
                  <ApperIcon
                    name={collapsedSections[type] ? "ChevronRight" : "ChevronDown"}
                    className="w-5 h-5 text-gray-500"
                  />
                </div>
{!collapsedSections[type] && (
                  <>
                    {/* Mobile Grid View */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
                      {typeComponents.map((component) => (
<div key={component.Id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-3 min-h-[200px] flex flex-col justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="font-medium text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">{component.name}</div>
                            
                            <div className="space-y-2">
                              <div className="text-xs sm:text-sm text-gray-500">Quantity</div>
                              <Input
                                type="number"
                                value={component.quantity}
                                onChange={(e) => handleStockUpdate(component.Id, e.target.value, "component")}
                                className="w-full min-h-[44px] text-sm"
                                min="0"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs sm:text-sm text-gray-500">Reorder Level</div>
                              <div className="text-sm sm:text-base text-gray-900">{component.reorderLevel}</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs sm:text-sm text-gray-500">Cost per Unit</div>
                              <div className="text-sm sm:text-base text-gray-900">${component.costPerUnit?.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="pt-2 mt-auto">
                            <StockBadge stock={component.quantity} reorderLevel={component.reorderLevel} />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop Table View */}
<div className="overflow-x-auto hidden md:block">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Component
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reorder Level
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cost per Unit
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {typeComponents.map((component) => (
                            <tr key={component.Id} className="hover:bg-gray-50">
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">{component.name}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <Input
                                  type="number"
                                  value={component.quantity}
                                  onChange={(e) => handleStockUpdate(component.Id, e.target.value, "component")}
                                  className="w-20 sm:w-24 min-h-[44px]"
                                  min="0"
                                />
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 text-sm sm:text-base">
                                {component.reorderLevel}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 text-sm sm:text-base">
                                ${component.costPerUnit?.toFixed(2)}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <StockBadge stock={component.quantity} reorderLevel={component.reorderLevel} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;