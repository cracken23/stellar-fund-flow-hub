
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import TransactionMonitor from "@/components/admin/TransactionMonitor";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// This component serves as a shell for admin portal sections
const AdminPortal = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams();
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Render appropriate section based on route parameter
  const renderSection = () => {
    switch (section) {
      case 'users':
        return <UserManagement />;
      case 'transactions':
        return <TransactionMonitor />;
      case 'settings':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <p className="text-muted-foreground">
              System settings functionality is coming soon.
            </p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header />
        <main className="container mx-auto p-4 md:p-6 max-w-6xl">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
