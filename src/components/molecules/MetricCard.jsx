import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

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
<Card className={`p-3 ${className}`}>
      <div className="flex items-start gap-3">
<div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm text-gray-600 font-medium text-center">{title}</p>
          <p className="text-xl font-bold text-gray-900 text-center break-words">
            {prefix}{value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center justify-center gap-1 text-sm ${getChangeColor()}`}>
              <ApperIcon name={getChangeIcon()} size={14} />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex-shrink-0">
            <ApperIcon name={icon} className="w-5 h-5 text-amber-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;