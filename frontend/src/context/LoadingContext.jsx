import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const LoadingContext = createContext(null);

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useGlobalLoading must be used within a LoadingProvider');
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [queue, setQueue] = useState(0);
  const [message, setMessageState] = useState('');

  const show = useCallback((msg) => {
    setQueue((prev) => prev + 1);
    if (msg !== undefined) {
      setMessageState(msg);
    }
  }, []);

  const hide = useCallback(() => {
    setQueue((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next === 0) {
        setMessageState('');
      }
      return next;
    });
  }, []);

  const setMessage = useCallback((msg) => {
    setMessageState(msg);
  }, []);

  const wrap = useCallback(async (promise, msg) => {
    show(msg);
    try {
      const result = await promise;
      return result;
    } finally {
      hide();
    }
  }, [show, hide]);

  const isLoading = queue > 0;

  const value = useMemo(
    () => ({
      isLoading,
      message,
      queue,
      show,
      hide,
      setMessage,
      wrap,
    }),
    [isLoading, message, queue, show, hide, setMessage, wrap]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const withGlobalLoading = (WrappedComponent) => {
  const WithGlobalLoading = (props) => {
    const loading = useGlobalLoading();
    return <WrappedComponent {...props} loading={loading} />;
  };
  WithGlobalLoading.displayName = `withGlobalLoading(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithGlobalLoading;
};

export const useLoadingTask = (message) => {
  const { show, hide, wrap } = useGlobalLoading();
  const [isTaskLoading, setIsTaskLoading] = useState(false);

  const runTask = useCallback(
    async (fn) => {
      setIsTaskLoading(true);
      show(message);
      try {
        const result = typeof fn === 'function' ? await fn() : await fn;
        return result;
      } finally {
        hide();
        setIsTaskLoading(false);
      }
    },
    [show, hide, message]
  );

  return [isTaskLoading, runTask];
};

export default LoadingContext;
