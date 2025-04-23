
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, getAllTransactions } from "@/utils/mockData";
import { Transaction, User } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, User as UserIcon, ArrowLeftRight } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactionVolume, setTransactionVolume] = useState(0);

  useEffect(() => {
    // Load data
    const allUsers = getAllUsers();
    const allTransactions = getAllTransactions();
    
    setUsers(allUsers);
    setTransactions(allTransactions);
    
    // Calculate total balance
    const total = allUsers.reduce((sum, user) => sum + user.balance, 0);
    setTotalBalance(total);
    
    // Calculate transaction volume
    const volume = allTransactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
    setTransactionVolume(volume);
  }, []);

  // Generate transaction data by day for the chart
  const getTransactionsByDay = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    }).reverse();
    
    const data = last7Days.map(day => {
      const dayTransactions = transactions.filter(t => {
        const transDate = new Date(t.timestamp).toISOString().split("T")[0];
        return transDate === day;
      });
      
      const credits = dayTransactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const debits = dayTransactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);
        
      // Format the day as a more readable date (e.g., "Mon 5/1")
      const date = new Date(day);
      const formattedDay = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'numeric', 
        day: 'numeric' 
      });
      
      return {
        name: formattedDay,
        Credits: credits,
        Debits: debits,
      };
    });
    
    return data;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total Users</CardTitle>
            <CardDescription className="text-3xl font-bold text-foreground">
              {users.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Active accounts
              </span>
              <Button variant="ghost" size="sm" asChild className="text-xs px-0">
                <Link to="/admin/users">
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total Balance</CardTitle>
            <CardDescription className="text-3xl font-bold text-foreground">
              ${totalBalance.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Across all accounts
              </span>
              <Button variant="ghost" size="sm" asChild className="text-xs px-0">
                <Link to="/admin/users">
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Transaction Volume</CardTitle>
            <CardDescription className="text-3xl font-bold text-foreground">
              ${transactionVolume.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                All time volume
              </span>
              <Button variant="ghost" size="sm" asChild className="text-xs px-0">
                <Link to="/admin/transactions">
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Chart */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Transaction Activity</CardTitle>
          <CardDescription>Last 7 days transaction volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <BarChart data={getTransactionsByDay()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Credits" fill="#36B37E" />
              <Bar dataKey="Debits" fill="#FF5630" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-24 flex-col" asChild>
          <Link to="/admin/users">
            <UserIcon className="h-6 w-6 mb-2" />
            <span>Manage Users</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex-col" asChild>
          <Link to="/admin/transactions">
            <ArrowLeftRight className="h-6 w-6 mb-2" />
            <span>View Transactions</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex-col" asChild>
          <Link to="/admin/settings">
            <CreditCard className="h-6 w-6 mb-2" />
            <span>System Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
