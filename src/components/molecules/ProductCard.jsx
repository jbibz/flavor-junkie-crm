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
<Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleViewProduct}>
      <div className="flex items-center justify-center space-x-3 text-center">
        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {product.currentStock} units
        </span>
        <StockBadge stock={product.currentStock} reorderLevel={10} />
      </div>
    </Card>
  );
};

export default ProductCard;