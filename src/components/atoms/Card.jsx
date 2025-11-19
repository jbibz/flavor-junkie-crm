import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;