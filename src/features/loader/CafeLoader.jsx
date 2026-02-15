import React from 'react';

const CafeLoader = ({ fullScreen = true, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 z-50">
        <div className="text-center">
          {/* Coffee Cup Animation */}
          <div className="mb-8">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              {/* Cup */}
              <path
                d="M20 15H60V55C60 65.05 52.627 73 43 73H37C27.373 73 20 65.05 20 55V15Z"
                stroke="#B45309"
                strokeWidth="2"
                fill="none"
              />
              {/* Handle */}
              <path
                d="M60 25C70 25 75 30 75 40C75 50 70 55 60 55"
                stroke="#B45309"
                strokeWidth="2"
                fill="none"
              />
              {/* Coffee Liquid - Animated */}
              <defs>
                <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
                </linearGradient>
              </defs>
              <g className="animate-[fill-up_2s_ease-in-out_infinite]">
                <path
                  d="M22 55C22 63.83 28.373 71 37 71H43C51.627 71 58 63.83 58 55V30H22V55Z"
                  fill="url(#coffeeGradient)"
                  opacity="0.9"
                />
              </g>
              {/* Steam - Animated */}
              <g className="opacity-0 animate-[steam-rise_1.5s_ease-in_infinite]">
                <path
                  d="M30 20Q30 10 35 5"
                  stroke="#D97706"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M45 18Q45 8 50 3"
                  stroke="#D97706"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full bg-orange-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Loading Message */}
          <p className="text-amber-900 text-lg font-medium">{message}</p>
          <p className="text-amber-700/60 text-sm mt-2">Brewing the perfect experience...</p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl animate-pulse" />
      </div>
    );
  }

  // Inline/Overlay version
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        {/* Coffee Cup Animation - Smaller */}
        <div className="mb-6">
          <svg
            width="60"
            height="60"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M20 15H60V55C60 65.05 52.627 73 43 73H37C27.373 73 20 65.05 20 55V15Z"
              stroke="#B45309"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M60 25C70 25 75 30 75 40C75 50 70 55 60 55"
              stroke="#B45309"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="coffeeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
              </linearGradient>
            </defs>
            <g className="animate-[fill-up_2s_ease-in-out_infinite]">
              <path
                d="M22 55C22 63.83 28.373 71 37 71H43C51.627 71 58 63.83 58 55V30H22V55Z"
                fill="url(#coffeeGradient2)"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0s' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0.2s' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0.4s' }} />
        </div>

        <p className="text-amber-900 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Alternative Loader with Spinning Coffee Bean
const CafeBeanLoader = ({ fullScreen = true, message = 'Loading...' }) => {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 z-50'
          : 'flex items-center justify-center p-8'
      }
    >
      <div className="text-center">
        {/* Spinning Coffee Bean */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-200/30 border-t-amber-600 animate-spin" />
            
            {/* Middle rotating ring - opposite direction */}
            <div className="absolute inset-2 rounded-full border-3 border-orange-200/30 border-t-orange-600 animate-spin" style={{ animationDirection: 'reverse' }} />
            
            {/* Coffee Bean Icon Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Coffee Bean */}
                <path
                  d="M18 4C11 4 6 9.5 6 18C6 26.5 11 32 18 32C25 32 30 26.5 30 18C30 9.5 25 4 18 4Z"
                  fill="#B45309"
                  opacity="0.8"
                />
                <path
                  d="M18 8C14 8 11 12 11 18C11 24 14 28 18 28"
                  fill="#D97706"
                  opacity="0.9"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pulsing Text */}
        <p className="text-amber-900 text-lg font-medium animate-pulse">{message}</p>
        <p className="text-amber-700/60 text-sm mt-2">Freshly brewing...</p>

        {fullScreen && (
          <>
            <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl animate-pulse" />
          </>
        )}
      </div>
    </div>
  );
};

// Minimal Page Loader (like Next.js style)
const CafePageLoader = ({ fullScreen = true }) => {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 z-50'
          : 'flex items-center justify-center p-8'
      }
    >
      {/* Animated progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1 bg-amber-200/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-[progress_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Card
const CafeSkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md p-6 border border-amber-100/40 overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 md:h-56 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-xl mb-4 animate-pulse" />
          
          {/* Title skeleton */}
          <div className="h-6 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg mb-3 animate-pulse w-3/4" />
          
          {/* Category skeleton */}
          <div className="h-4 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg mb-4 w-1/3 animate-pulse" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg w-5/6 animate-pulse" />
          </div>

          {/* Button skeleton */}
          <div className="flex justify-between items-end">
            <div className="h-6 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg w-1/4 animate-pulse" />
            <div className="h-10 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-lg w-1/4 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export { CafeLoader, CafeBeanLoader, CafePageLoader, CafeSkeletonLoader };
