import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  action,
  actionText = "Add Item",
  icon = "Package"
}) => {
  return (
<div className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-6 sm:p-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm sm:text-base px-2">{description}</p>
        </div>

        {action && (
          <button
            onClick={action}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-105 min-h-[44px]"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;