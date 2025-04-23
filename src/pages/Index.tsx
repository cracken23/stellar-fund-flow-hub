
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-bank-light-blue to-bank-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Banking Made Simple</h1>
              <p className="text-xl mb-8">
                Welcome to BankEase, a modern banking platform that makes managing your finances easy and secure.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    className="bg-white text-bank-blue hover:bg-white/90"
                    onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
                  >
                    Go to {isAdmin ? "Admin Portal" : "Dashboard"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-bank-blue hover:bg-white/90"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-transparent border-white text-white hover:bg-white/10"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-bank-light-gray">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-bank-blue/10 text-bank-blue w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Banking</h3>
                <p className="text-muted-foreground">
                  State-of-the-art security protocols to keep your financial information safe and protected.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-bank-blue/10 text-bank-blue w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Transfers</h3>
                <p className="text-muted-foreground">
                  Send and receive money instantly with just a few clicks, no hassle or delays.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-bank-blue/10 text-bank-blue w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Transaction History</h3>
                <p className="text-muted-foreground">
                  Keep track of all your transactions with detailed history and reporting features.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied users who trust BankEase for their banking needs.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")}>Create Your Account</Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">BankEase</h2>
              <p className="text-gray-400 text-sm">Banking made simple</p>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BankEase. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
