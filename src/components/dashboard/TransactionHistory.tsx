
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserTransactions } from "@/utils/mockData";
import { Transaction } from "@/utils/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  useEffect(() => {
    if (user) {
      const userTransactions = getUserTransactions(user.id);
      setTransactions(userTransactions);
      setFilteredTransactions(userTransactions);
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      let filtered = transactions;
      
      // Apply type filter
      if (filter !== "all") {
        filtered = filtered.filter((t) => t.type === filter);
      }
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (t) => 
            t.description.toLowerCase().includes(term) || 
            (t.fromAccount && t.fromAccount.includes(term)) ||
            (t.toAccount && t.toAccount.includes(term))
        );
      }
      
      setFilteredTransactions(filtered);
    }
  }, [transactions, filter, searchTerm]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all your account transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter === "all" ? "All Transactions" : filter === "credit" ? "Credits Only" : "Debits Only"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilter("all")}>All Transactions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("credit")}>Credits Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("debit")}>Debits Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`transaction-item ${
                  transaction.type === "credit" 
                    ? "transaction-credit" 
                    : "transaction-debit"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(transaction.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                      {transaction.fromAccount && (
                        <span>From: {transaction.fromAccount}</span>
                      )}
                      {transaction.toAccount && (
                        <span>To: {transaction.toAccount}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`font-medium ${
                      transaction.type === "credit" 
                        ? "text-bank-green" 
                        : "text-bank-red"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      <span className={`px-2 py-0.5 rounded ${
                        transaction.status === "completed" 
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No transactions found</p>
            <p className="text-sm text-muted-foreground">Try changing your search or filter settings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
