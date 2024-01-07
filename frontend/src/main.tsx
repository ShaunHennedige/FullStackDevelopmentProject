// Importing necessary React and ReactDOM modules and components
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // Importing the main App component
import "./index.css"; // Importing global styles
import { QueryClient, QueryClientProvider } from "react-query"; // Importing QueryClient and QueryClientProvider from react-query
import { AppContextProvider } from "./contexts/AppContext.tsx"; // Importing AppContextProvider from the AppContext module
import { SearchContextProvider } from "./contexts/SearchContext.tsx"; // Importing SearchContextProvider from the SearchContext module

// Creating a new instance of QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Setting the number of retries for queries to 0
    },
  },
});

// Rendering the root of the React application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrapping the entire application with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      {/* Wrapping the App component with AppContextProvider */}
      <AppContextProvider>
        {/* Wrapping the App component with SearchContextProvider */}
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
