interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-300';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton presets para casos comunes
export function GroupCardSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function ParticipantCardSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export function GiftCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex gap-3">
        <Skeleton variant="rectangular" className="w-20 h-20 shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
