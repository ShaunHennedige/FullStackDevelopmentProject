// Importing necessary React components and libraries
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Retrieving the Stripe public key from environment variables
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Type definition for toast messages
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Type definition for the AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};

// Creating a React context for the AppContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Loading the Stripe instance with the provided public key
const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Provider component for the AppContext
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State for managing toast messages
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  // Query for validating the user token using the apiClient
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    // Providing AppContext values to the children components
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
      }}
    >
      {/* Rendering Toast component if there is a toast message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {/* Rendering the children components */}
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for accessing the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
