import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StockBadge = ({ stock, reorderLevel = 10 }) => {
  const getStockStatus = () => {
    if (stock <= reorderLevel) {
      return { variant: "error", text: "Low Stock", icon: "AlertTriangle" };
    } else if (stock <= reorderLevel * 2) {
      return { variant: "warning", text: "Medium", icon: "AlertCircle" };
    } else {
      return { variant: "success", text: "In Stock", icon: "CheckCircle" };
    }
  };

  const status = getStockStatus();

  return (
    <Badge variant={status.variant} className="inline-flex items-center gap-1">
      <ApperIcon name={status.icon} size={12} />
      {status.text}
    </Badge>
  );
};

export default StockBadge;