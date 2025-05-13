import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useDonorCleanup = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  // Remove donor on route change
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      localStorage.removeItem('donorEmail');
    }
    prevPath.current = location.pathname;
  }, [location]);

  // Remove donor on tab/browser close
  useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem('donorEmail');
    };
    window.addEventListener('pagehide', handleTabClose); // More reliable than beforeunload

    return () => window.removeEventListener('pagehide', handleTabClose);
  }, []);
};

export default useDonorCleanup;
