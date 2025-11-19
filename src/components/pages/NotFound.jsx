import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 sm:p-8 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Search" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full"
              icon="Home"
            >
              Go to Dashboard
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="ghost"
              className="w-full"
              icon="ArrowLeft"
            >
              Go Back
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 px-2">
              Need help? Check out our navigation menu or return to the dashboard to explore your Flavor Junkie CRM.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;