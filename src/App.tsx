
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminPortal from "./pages/AdminPortal";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User dashboard routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/transactions" element={<UserDashboard section="transactions" />} />
            <Route path="/payments" element={<UserDashboard section="payments" />} />
            <Route path="/settings" element={<UserDashboard section="settings" />} />
            
            {/* Admin portal routes */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/users" element={<AdminPortal section="users" />} />
            <Route path="/admin/transactions" element={<AdminPortal section="transactions" />} />
            <Route path="/admin/settings" element={<AdminPortal section="settings" />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
