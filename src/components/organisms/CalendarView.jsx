import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { salesService } from "@/services/api/salesService";

const CalendarView = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, [currentDate]);

  const loadSales = async () => {
    setLoading(true);
    try {
      const allSales = await salesService.getAll();
      setSales(allSales);
    } catch (error) {
      console.error("Failed to load sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDailySales = (date) => {
    return sales.filter(sale => 
      isSameDay(new Date(sale.date), date)
    );
  };

  const getDailyRevenue = (date) => {
    const dailySales = getDailySales(date);
    return dailySales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    const dailySales = getDailySales(date);
    onDateSelect(date, dailySales);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={previousMonth} icon="ChevronLeft" />
            <Button variant="ghost" size="sm" onClick={nextMonth} icon="ChevronRight" />
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const revenue = getDailyRevenue(day);
            const salesCount = getDailySales(day).length;
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={`
                  relative p-2 h-16 border border-gray-200 rounded-lg text-left hover:bg-amber-50 transition-colors
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                  ${isToday ? "border-amber-500 bg-amber-50" : ""}
                  ${revenue > 0 ? "bg-green-50 border-green-200" : ""}
                `}
              >
                <div className="text-sm font-medium">
                  {format(day, "d")}
                </div>
                {revenue > 0 && (
                  <div className="text-xs text-green-700 font-medium mt-1">
                    ${revenue.toFixed(0)}
                  </div>
                )}
                {salesCount > 0 && (
                  <div className="absolute bottom-1 right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-xs text-gray-600">Has Sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-50 border border-amber-500 rounded"></div>
            <span className="text-xs text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;