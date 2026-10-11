import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoader from "./components/core/Loaders/GlobalLoader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErr) {
      resizeObserverErr.setAttribute('style', 'display: none');
    }
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.setAttribute('style', 'display: none');
    }
  }
};

window.addEventListener('error', resizeObserverErrorHandler);

function BootstrapApp() {
  const [appReady, setAppReady] = useState(false);
  const [exitingLoader, setExitingLoader] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExitingLoader(true);
      setTimeout(() => setAppReady(true), 500);
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LoadingProvider>
            <AuthProvider>
              <AnimatePresence mode="wait">
                {!appReady && (
                  <GlobalLoader key="boot-loader" isExiting={exitingLoader} />
                )}
              </AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: 'rgba(17, 24, 39, 0.92)',
                      color: '#fff',
                      borderRadius: '14px',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                    },
                    success: {
                      style: {
                        background: 'linear-gradient(135deg, #065f46, #047857)',
                        border: '1px solid rgba(16,185,129,0.3)',
                      },
                    },
                    error: {
                      style: {
                        background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
                        border: '1px solid rgba(239,68,68,0.3)',
                      },
                    },
                  }}
                />
              </motion.div>
            </AuthProvider>
          </LoadingProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BootstrapApp />);
