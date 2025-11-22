import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Inventory", href: "/inventory", icon: "Package" },
    { name: "Sales", href: "/sales", icon: "ShoppingCart" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Production", href: "/production", icon: "Factory" },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
<header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
{/* Mobile App-Style Header */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between h-12">
          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 -ml-2"
            aria-label="Toggle menu"
          >
            <ApperIcon 
              name={mobileMenuOpen ? "X" : "Menu"} 
              className="h-6 w-6 text-gray-700" 
            />
          </button>

          {/* Centered Mobile Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Flavor Junkie
              </h1>
            </div>
          </Link>

          {/* Mobile Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 -mr-2">
            <ApperIcon name="Bell" className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
          >
            <nav className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
{/* Desktop Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Flavor Junkie
                </h1>
                <p className="text-xs text-gray-500 -mt-1">CRM System</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
{/* Desktop Navigation */}
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-b-2 border-amber-500"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
{/* Desktop User Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon="Bell">
              <span className="hidden xl:inline">Notifications</span>
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
<div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
</header>
  );
};

export default Header;