// export default function Loader() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <div className="w-20 h-20 border-blue-500 border-t-transparent border-[15px] rounded-full animate-spin" />
//     </div>
//   );
// }

// app/loading-showcase/page.tsx or pages/loading-showcase.tsx (Next.js)
"use client";

import React from "react";
import classNames from "classnames";

export type LoaderType = "line" | "profile" | "card";

// Base Skeleton
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={classNames("animate-pulse bg-gray-300 rounded-full ", className)}
  />
);

// SkeletonText Component
const SkeletonText = ({ lines = 10 }: { lines?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: lines }).map((_, idx) =>
      idx % 2 === 0 ? (
        <Skeleton key={idx} className="h-6 w-full" />
      ) : (
        <Skeleton key={idx} className="h-5 w-5/6" />
      )
    )}
  </div>
);

// SkeletonCard Component
const SkeletonCard = () => (
  <div className="p-4 border border-gray-200 rounded-lg shadow-sm space-y-4 w-full">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-3 w-4/6" />
  </div>
);

// SkeletonProfile Component
const SkeletonProfile = () => (
  <div className="p-6 rounded-lg shadow space-y-6 w-full max-w-md mx-auto">
    <div className="flex flex-col items-center space-y-6">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    {/* <div className="space-y-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div> */}
    <SkeletonText lines={10} />
  </div>
);

const Loader = ({ type = "line" }: { type: LoaderType }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      {/* Profile Skeleton */}
      {type === "profile" && (
        <section>
          <SkeletonProfile />
        </section>
      )}

      {/* Text Skeleton */}
      {type === "line" && (
        <section>
          <div className="max-w-2xl mx-auto space-y-3">
            <SkeletonText lines={15} />
          </div>
        </section>
      )}

      {/* Grid of Cards */}
      {type === "card" && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Loader;
