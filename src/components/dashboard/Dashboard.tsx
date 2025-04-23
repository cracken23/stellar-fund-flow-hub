
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowLeftRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTransactions } from "@/utils/mockData";
import { Transaction } from "@/utils/mockData";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits] = useState(0);

  useEffect(() => {
    if (user) {
      const userTransactions = getUserTransactions(user.id).slice(0, 5); // Get only the 5 most recent
      setTransactions(userTransactions);
      
      // Calculate total credits and debits in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTransactions = getUserTransactions(user.id).filter(
        (t) => new Date(t.timestamp) > thirtyDaysAgo
      );
      
      const credits = recentTransactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const debits = recentTransactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);
        
      setTotalCredits(credits);
      setTotalDebits(debits);
    }
  }, [user]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="text-sm opacity-80">Available Balance</div>
        <div className="text-3xl font-bold mt-2">${user.balance.toFixed(2)}</div>
        <div className="text-xs opacity-70 mt-2">Account: {user.accountNumber}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
        <Button className="flex-1" variant="outline" asChild>
          <a href="/payments">
            <ArrowUp className="mr-2 h-4 w-4" />
            Send
          </a>
        </Button>
        <Button className="flex-1" variant="outline" asChild>
          <a href="/transactions">
            <ArrowDown className="mr-2 h-4 w-4" />
            Request
          </a>
        </Button>
        <Button className="flex-1" variant="outline" asChild>
          <a href="/transactions">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            History
          </a>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Income (30d)</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              ${totalCredits.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
              Incoming transfers
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Expenses (30d)</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              ${totalDebits.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
              Outgoing transfers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`transaction-item ${
                    transaction.type === "credit" 
                      ? "transaction-credit" 
                      : "transaction-debit"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-sm">{transaction.description}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === "credit" 
                        ? "text-bank-green" 
                        : "text-bank-red"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-primary" asChild>
                <a href="/transactions">View All Transactions</a>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
