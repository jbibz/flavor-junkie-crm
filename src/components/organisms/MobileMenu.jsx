import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Inventory", href: "/inventory", icon: "Package" },
    { name: "Sales", href: "/sales", icon: "ShoppingCart" },
    { name: "Dashboard", href: "/", icon: "LayoutDashboard", isCenter: true },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Production", href: "/production", icon: "Factory" },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40 safe-area-pb"
    >
      <div className="flex items-center justify-around px-2 py-4">
        {navigation.map((item) => {
          const active = isActive(item.href);
          
          if (item.isCenter) {
            return (
              <Link
                key={item.name}
                to={item.href}
className="flex flex-col items-center justify-center relative -mt-6"
              >
                <button
                  onClick={() => navigate(item.href)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-6 w-6" />
                </button>
                <span className={`text-xs mt-2 font-medium transition-colors duration-200 text-center ${
                  active ? "text-amber-600" : "text-gray-600"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href}
className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1"
            >
              <button
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center justify-center min-w-0 p-3 rounded-lg transition-colors duration-200 min-h-[44px] ${
                  active
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
              </button>
              <span className={`text-xs mt-2 font-medium transition-colors duration-200 truncate text-center max-w-full ${
                active ? "text-amber-600" : "text-gray-600"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </motion.nav>
  );
};

export default BottomNavigation;