
import Header from "@/components/layout/Header";
import SignupForm from "@/components/auth/SignupForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { initializeMockData } from "@/utils/mockData";

const Signup = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Initialize mock data on first load
  useEffect(() => {
    initializeMockData();
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
