import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500 shadow-sm hover:shadow-md",
    secondary: "text-amber-700 bg-white border-2 border-amber-500 hover:bg-amber-50 focus:ring-amber-500 shadow-sm hover:shadow-md",
    ghost: "text-amber-700 hover:text-amber-800 hover:bg-amber-50 focus:ring-amber-500",
    danger: "text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm h-8",
    default: "px-4 py-2.5 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  };

  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className={cn("animate-spin", iconPosition === "right" ? "ml-2" : "mr-2")} size={iconSize} />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="mr-2" size={iconSize} />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="ml-2" size={iconSize} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;