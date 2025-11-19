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
    <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <StockBadge stock={product.currentStock} reorderLevel={10} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Stock:</span>
            <span className="font-medium text-gray-900">{product.currentStock} units</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Unit Price:</span>
            <span className="font-medium text-gray-900">${product.pricePerUnit?.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={handleViewProduct}
          variant="ghost" 
          size="sm" 
          className="w-full justify-center"
          icon="Eye"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;