import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    show: false,
    title: '',
    message: '',
  });

  const showLoading = useCallback((title = '', message = '') => {
    setLoadingState({
      show: true,
      title,
      message,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({ ...prev, show: false }));
  }, []);

  /**
   * Helper to wrap any async function or action with loading overlay
   * Executes without artificial delays for maximum performance
   */
  const withLoading = useCallback(async (title, asyncFn, minDurationMs = 0, message = 'Please wait while the request is processing.') => {
    showLoading(title, message);
    const start = Date.now();
    try {
      const result = await asyncFn();
      if (minDurationMs > 0) {
        const elapsed = Date.now() - start;
        if (elapsed < minDurationMs) {
          await new Promise(r => setTimeout(r, minDurationMs - elapsed));
        }
      }
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, withLoading, isLoading: loadingState.show }}>
      {children}
      <LoadingOverlay
        show={loadingState.show}
        title={loadingState.title}
        message={loadingState.message}
      />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
