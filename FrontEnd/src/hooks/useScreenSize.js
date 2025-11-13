import { useState, useEffect, useCallback } from 'react';

// Custom hook untuk detect screen size with comprehensive breakpoints
export const useScreenSize = () => {
  const getScreenInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      // Detailed breakpoints
      isXsMobile: width <= 375,
      isSmMobile: width > 375 && width <= 480,
      isMdMobile: width > 480 && width <= 768,
      isSmTablet: width > 768 && width <= 900,
      isMdTablet: width > 900 && width <= 1024,
      isSmDesktop: width > 1024 && width <= 1200,
      isMdDesktop: width > 1200 && width <= 1400,
      isLgDesktop: width > 1400,
      
      // Legacy support
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024,
      
      // Orientation
      isLandscape: width > height,
      isPortrait: height >= width,
      
      // Device categories
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isHighDPI: window.devicePixelRatio > 1.5,
      
      // Specific device detection
      isIPhone: /iPhone/.test(navigator.userAgent),
      isIPad: /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
      isAndroid: /Android/.test(navigator.userAgent),
      
      // Accessibility
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
    };
  }, []);

  const [screenSize, setScreenSize] = useState(getScreenInfo);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenInfo());
    };

    // Use throttling for better performance
    let timeoutId = null;
    const throttledResize = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleResize();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Listen for media query changes
    const mediaQueryLists = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ];
    
    mediaQueryLists.forEach(mq => mq.addEventListener('change', handleResize));
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleResize);
      mediaQueryLists.forEach(mq => mq.removeEventListener('change', handleResize));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [getScreenInfo]);

  return screenSize;
};

// Comprehensive breakpoint utilities
export const breakpoints = {
  xsMobile: 375,
  smMobile: 480,
  mdMobile: 768,
  smTablet: 900,
  mdTablet: 1024,
  smDesktop: 1200,
  mdDesktop: 1400,
  lgDesktop: 1600,
  
  // Legacy support
  mobile: 768,
  tablet: 1024,
  desktop: 1400
};

export const mediaQueries = {
  xsMobile: `(max-width: ${breakpoints.xsMobile}px)`,
  smMobile: `(min-width: ${breakpoints.xsMobile + 1}px) and (max-width: ${breakpoints.smMobile}px)`,
  mdMobile: `(min-width: ${breakpoints.smMobile + 1}px) and (max-width: ${breakpoints.mdMobile}px)`,
  smTablet: `(min-width: ${breakpoints.mdMobile + 1}px) and (max-width: ${breakpoints.smTablet}px)`,
  mdTablet: `(min-width: ${breakpoints.smTablet + 1}px) and (max-width: ${breakpoints.mdTablet}px)`,
  smDesktop: `(min-width: ${breakpoints.mdTablet + 1}px) and (max-width: ${breakpoints.smDesktop}px)`,
  mdDesktop: `(min-width: ${breakpoints.smDesktop + 1}px) and (max-width: ${breakpoints.mdDesktop}px)`,
  lgDesktop: `(min-width: ${breakpoints.mdDesktop + 1}px)`,
  
  // Legacy support
  mobile: `(max-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.tablet + 1}px)`,
  
  // Orientation
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  
  // Accessibility
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
  darkMode: '(prefers-color-scheme: dark)',
  
  // Touch devices
  touchDevice: '(hover: none) and (pointer: coarse)',
  hoverDevice: '(hover: hover) and (pointer: fine)',
  
  // High DPI
  highDPI: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
};

// Utility function to check if current screen matches breakpoint
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    
    const handleChange = (e) => setMatches(e.matches);
    mediaQueryList.addEventListener('change', handleChange);
    
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);
  
  return matches;
};