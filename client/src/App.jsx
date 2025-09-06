import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="border-primary-600 mx-auto w-12 h-12 rounded-full border-b-2 animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main App component that uses auth context
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <Login onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <Signup onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return <Chat />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
