import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StockBadge from "@/components/molecules/StockBadge";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/product/${product.Id}`);
  };

  return (
<Card className="relative p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-primary-300 rounded-xl bg-white" onClick={handleViewProduct}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
          <StockBadge stock={product.currentStock} reorderLevel={10} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">Current Stock</p>
            <p className="text-xl font-bold text-gray-900">{product.currentStock}</p>
            <p className="text-xs text-gray-400">units available</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-r-2 border-b-2 border-primary-600 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;