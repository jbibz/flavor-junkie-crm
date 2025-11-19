import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ error, onRetry, title = "Something went wrong" }) => {
  return (
<div className="min-h-[350px] sm:min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-6 sm:p-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            {error || "We encountered an unexpected error. Please try again."}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-105 min-h-[44px]"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            If the problem persists, please check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;