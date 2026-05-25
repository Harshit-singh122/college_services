import { createContext, useContext } from "react";

const MockAuthContext = createContext();

export const useMockAuth = () => {
  return useContext(MockAuthContext) || {
    user: null,
    isLoaded: true,
    signOut: () => {},
  };
};

export function MockAuthProvider({ children }) {
  const value = {
    user: null,
    isLoaded: true,
    signOut: () => {},
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}
