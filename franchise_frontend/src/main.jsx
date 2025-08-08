
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import  { persistor, store} from './Redux/Store/Index.jsx';
// import ErrorBoundary from '../src/services/SupportingComponents/ErrorBoundary.jsx';
import LoadingFallback from '../src/services/SupportingComponents/LoadingFallback.jsx';

// Create a single instance of QueryClient with production-appropriate settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      retry: 2, // Will retry failed queries 2 times before displaying an error
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

// For production, we use createRoot from react-dom/client
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
      <Provider store={store}>
        <PersistGate loading={<LoadingFallback />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </HelmetProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>
);