import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance in px to trigger refresh (default 100)
  maxDistance?: number; // Max visual distance in px (default 150)
  minDuration?: number; // Minimum duration in ms for valid pull (default 500)
  enabled?: boolean; // Enable/disable the hook (default true)
}

interface UsePullToRefreshReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  pullDistance: number;
  isRefreshing: boolean;
}

/**
 * Hook for implementing pull-to-refresh functionality on mobile
 * Usage:
 * const { containerRef, pullDistance, isRefreshing } = usePullToRefresh({
 *   onRefresh: async () => { ... },
 *   threshold: 60,
 *   enabled: isMobile
 * });
 */
export const usePullToRefresh = ({
  onRefresh,
  threshold = 100,
  maxDistance = 150,
  minDuration = 500,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    let isAtTop = true;
    let currentPullDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      isAtTop = scrollTop < 10;
      if (isAtTop) {
        startYRef.current = e.touches[0].clientY;
        startTimeRef.current = Date.now();
      } else {
        startYRef.current = 0;
        startTimeRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === 0 || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        currentPullDistance = Math.min(distance, maxDistance);
        setPullDistance(currentPullDistance);
      }
    };

    const handleTouchEnd = () => {
      if (
        currentPullDistance > threshold &&
        !isRefreshing &&
        startYRef.current !== 0
      ) {
        // Check if pull duration was long enough to be intentional
        const duration = Date.now() - startTimeRef.current;
        if (duration >= minDuration) {
          handleRefresh();
        } else {
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
      startYRef.current = 0;
      startTimeRef.current = 0;
      currentPullDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    enabled,
    isRefreshing,
    handleRefresh,
    threshold,
    maxDistance,
    minDuration,
  ]);

  return {
    containerRef,
    pullDistance,
    isRefreshing,
  };
};
