import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if key is a valid Clerk production key (starts with pk_live_)
// For development, wrap App without Clerk
const isValidKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith("pk_live_");

const root = createRoot(document.getElementById("root"));

if (isValidKey) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}