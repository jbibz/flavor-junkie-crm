import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon,
  prefix = "",
  suffix = "",
  className = ""
}) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-green-600";
    if (changeType === "negative") return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "TrendingUp";
    if (changeType === "negative") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getChangeColor()}`}>
              <ApperIcon name={getChangeIcon()} size={14} />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full">
            <ApperIcon name={icon} className="w-6 h-6 text-amber-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;