/**
 * Mobile Optimization Hook
 * Detects mobile devices and provides mobile-specific optimizations
 */

import { useState, useEffect, useCallback } from 'react';

export interface MobileDevice {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  hasTouch: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  browser: string;
  viewportWidth: number;
  viewportHeight: number;
  isStandalone: boolean; // PWA mode
  supportsHover: boolean;
}

export interface MobileOptimizations {
  cardColumns: number;
  gridGap: string;
  fontSize: 'sm' | 'md' | 'lg';
  touchTargetSize: number;
  maxModalWidth: string;
  showCompactView: boolean;
  enableSwipeGestures: boolean;
  useBottomSheet: boolean;
  showMobileNav: boolean;
  optimizedImageSizes: {
    thumbnail: string;
    card: string;
    hero: string;
  };
}

export function useMobileOptimization() {
  const [device, setDevice] = useState<MobileDevice>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'lg',
    orientation: 'landscape',
    hasTouch: false,
    platform: 'desktop',
    browser: 'unknown',
    viewportWidth: 1024,
    viewportHeight: 768,
    isStandalone: false,
    supportsHover: true
  });

  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    cardColumns: 3,
    gridGap: '1.5rem',
    fontSize: 'md',
    touchTargetSize: 44,
    maxModalWidth: '90vw',
    showCompactView: false,
    enableSwipeGestures: false,
    useBottomSheet: false,
    showMobileNav: false,
    optimizedImageSizes: {
      thumbnail: '80x80',
      card: '300x200',
      hero: '800x400'
    }
  });

  // Detect device capabilities
  const detectDevice = useCallback(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    // Screen size detection
    let screenSize: MobileDevice['screenSize'] = 'md';
    if (width < 640) screenSize = 'xs';
    else if (width < 768) screenSize = 'sm';
    else if (width < 1024) screenSize = 'md';
    else if (width < 1280) screenSize = 'lg';
    else if (width < 1536) screenSize = 'xl';
    else screenSize = '2xl';

    // Device type detection
    const isMobile = width < 768 || /Mobi|Android/i.test(userAgent);
    const isTablet = width >= 768 && width < 1024 && hasTouch;
    const isDesktop = !isMobile && !isTablet;

    // Platform detection
    let platform: MobileDevice['platform'] = 'unknown';
    if (/iPad|iPhone|iPod/.test(userAgent)) platform = 'ios';
    else if (/Android/.test(userAgent)) platform = 'android';
    else if (!isMobile) platform = 'desktop';

    // Browser detection
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Edge')) browser = 'edge';

    // Orientation
    const orientation = width > height ? 'landscape' : 'portrait';

    setDevice({
      isMobile,
      isTablet,
      isDesktop,
      screenSize,
      orientation,
      hasTouch,
      platform,
      browser,
      viewportWidth: width,
      viewportHeight: height,
      isStandalone,
      supportsHover
    });
  }, []);

  // Calculate optimizations based on device
  const calculateOptimizations = useCallback((deviceInfo: MobileDevice) => {
    const opts: MobileOptimizations = {
      cardColumns: 3,
      gridGap: '1.5rem',
      fontSize: 'md',
      touchTargetSize: 44,
      maxModalWidth: '90vw',
      showCompactView: false,
      enableSwipeGestures: false,
      useBottomSheet: false,
      showMobileNav: false,
      optimizedImageSizes: {
        thumbnail: '80x80',
        card: '300x200',
        hero: '800x400'
      }
    };

    if (deviceInfo.isMobile) {
      // Mobile optimizations
      opts.cardColumns = deviceInfo.screenSize === 'xs' ? 1 : 2;
      opts.gridGap = '1rem';
      opts.fontSize = deviceInfo.screenSize === 'xs' ? 'sm' : 'md';
      opts.touchTargetSize = 48; // Larger touch targets
      opts.maxModalWidth = '95vw';
      opts.showCompactView = true;
      opts.enableSwipeGestures = true;
      opts.useBottomSheet = true;
      opts.showMobileNav = true;
      opts.optimizedImageSizes = {
        thumbnail: '60x60',
        card: '280x180',
        hero: deviceInfo.viewportWidth < 400 ? '350x200' : '400x250'
      };
    } else if (deviceInfo.isTablet) {
      // Tablet optimizations
      opts.cardColumns = deviceInfo.orientation === 'portrait' ? 2 : 3;
      opts.gridGap = '1.25rem';
      opts.fontSize = 'md';
      opts.touchTargetSize = 46;
      opts.maxModalWidth = '80vw';
      opts.showCompactView = false;
      opts.enableSwipeGestures = true;
      opts.useBottomSheet = false;
      opts.showMobileNav = false;
      opts.optimizedImageSizes = {
        thumbnail: '70x70',
        card: '320x200',
        hero: '600x350'
      };
    } else {
      // Desktop optimizations
      opts.cardColumns = Math.min(4, Math.floor(deviceInfo.viewportWidth / 320));
      opts.gridGap = '1.5rem';
      opts.fontSize = 'md';
      opts.touchTargetSize = 40;
      opts.maxModalWidth = '70vw';
      opts.showCompactView = false;
      opts.enableSwipeGestures = false;
      opts.useBottomSheet = false;
      opts.showMobileNav = false;
      opts.optimizedImageSizes = {
        thumbnail: '100x100',
        card: '350x220',
        hero: '800x450'
      };
    }

    setOptimizations(opts);
  }, []);

  // Update on window resize
  useEffect(() => {
    detectDevice();
    
    const handleResize = () => {
      detectDevice();
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectDevice]);

  // Update optimizations when device changes
  useEffect(() => {
    calculateOptimizations(device);
  }, [device, calculateOptimizations]);

  // Utility functions
  const getBreakpointClasses = useCallback((classes: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }) => {
    const { screenSize } = device;
    return classes[screenSize] || classes.md || '';
  }, [device]);

  const getTouchOptimizedProps = useCallback(() => ({
    style: {
      minHeight: device.hasTouch ? `${optimizations.touchTargetSize}px` : 'auto',
      minWidth: device.hasTouch ? `${optimizations.touchTargetSize}px` : 'auto'
    },
    className: device.hasTouch ? 'touch-target' : ''
  }), [device.hasTouch, optimizations.touchTargetSize]);

  const getImageUrl = useCallback((baseUrl: string, type: 'thumbnail' | 'card' | 'hero') => {
    const size = optimizations.optimizedImageSizes[type];
    
    // If the baseUrl already contains size parameters, replace them
    if (baseUrl.includes('?')) {
      const [url, params] = baseUrl.split('?');
      const urlParams = new URLSearchParams(params);
      urlParams.set('w', size.split('x')[0]);
      urlParams.set('h', size.split('x')[1]);
      return `${url}?${urlParams.toString()}`;
    }
    
    // Add size parameters
    return `${baseUrl}?w=${size.split('x')[0]}&h=${size.split('x')[1]}&fit=crop`;
  }, [optimizations.optimizedImageSizes]);

  const isLowPowerMode = useCallback(() => {
    // Detect if device might be in low power mode
    return device.isMobile && 
           (device.viewportWidth < 400 || 
            navigator.connection?.effectiveType === 'slow-2g' ||
            navigator.connection?.saveData === true);
  }, [device]);

  const shouldReduceMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           isLowPowerMode();
  }, [isLowPowerMode]);

  const getOptimalViewMode = useCallback(() => {
    if (device.isMobile) return 'list';
    if (device.isTablet) return device.orientation === 'portrait' ? 'list' : 'grid';
    return 'grid';
  }, [device]);

  // Performance optimization: Virtualization threshold
  const getVirtualizationThreshold = useCallback(() => {
    if (device.isMobile) return 20; // Virtualize after 20 items
    if (device.isTablet) return 40;
    return 100; // Desktop can handle more
  }, [device]);

  // Swipe gesture handler
  const useSwipeGestures = useCallback((onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    useEffect(() => {
      if (!optimizations.enableSwipeGestures) return;

      let startX = 0;
      let startY = 0;

      const handleTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Check if it's a horizontal swipe (more horizontal than vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }

        startX = 0;
        startY = 0;
      };

      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }, [onSwipeLeft, onSwipeRight]);
  }, [optimizations.enableSwipeGestures]);

  return {
    device,
    optimizations,
    getBreakpointClasses,
    getTouchOptimizedProps,
    getImageUrl,
    isLowPowerMode,
    shouldReduceMotion,
    getOptimalViewMode,
    getVirtualizationThreshold,
    useSwipeGestures
  };
}

export default useMobileOptimization;