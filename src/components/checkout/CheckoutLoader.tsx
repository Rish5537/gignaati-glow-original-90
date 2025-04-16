
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutLoader = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Billing info skeleton */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </div>
          </div>
          
          {/* Payment method skeleton */}
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <div className="space-y-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
        
        {/* Order summary skeleton */}
        <div className="border rounded-lg p-6 h-fit">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-4 mt-2 border-t">
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutLoader;
