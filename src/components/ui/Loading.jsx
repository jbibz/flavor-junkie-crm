const Loading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-32"></div>
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded w-3/4"></div>
              <div className="h-6 bg-gradient-to-r from-amber-300 to-orange-300 rounded w-1/2"></div>
              <div className="h-3 bg-gradient-to-r from-amber-200 to-orange-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart area skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg"></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded w-1/2"></div>
                <div className="h-4 bg-gradient-to-r from-amber-300 to-orange-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;