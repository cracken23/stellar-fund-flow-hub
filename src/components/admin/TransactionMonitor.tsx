
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Transaction, getAllTransactions, getAllUsers } from "@/utils/mockData";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/utils/mockData";

const TransactionMonitor = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "credit" | "debit" | "completed" | "pending" | "failed">("all");

  useEffect(() => {
    // Load transactions
    const allTransactions = getAllTransactions();
    setTransactions(allTransactions);
    setFilteredTransactions(allTransactions);
    
    // Create user lookup map
    const allUsers = getAllUsers();
    const userMap: Record<string, User> = {};
    allUsers.forEach(user => {
      userMap[user.id] = user;
      userMap[user.accountNumber] = user;
    });
    setUsers(userMap);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      let filtered = transactions;
      
      // Apply filter
      if (filter === "credit" || filter === "debit") {
        filtered = filtered.filter((t) => t.type === filter);
      } else if (filter === "completed" || filter === "pending" || filter === "failed") {
        filtered = filtered.filter((t) => t.status === filter);
      }
      
      // Apply search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (t) => 
            t.description.toLowerCase().includes(term) || 
            (t.fromAccount && t.fromAccount.includes(term)) ||
            (t.toAccount && t.toAccount.includes(term)) ||
            (users[t.fromAccount || ""]?.name || "").toLowerCase().includes(term) ||
            (users[t.toAccount || ""]?.name || "").toLowerCase().includes(term)
        );
      }
      
      setFilteredTransactions(filtered);
    }
  }, [transactions, filter, searchTerm, users]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Transaction Monitor</CardTitle>
        <CardDescription>View and filter all transactions across the platform</CardDescription>
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
                {filter === "all" ? "All Transactions" : 
                  filter === "credit" ? "Credits Only" : 
                  filter === "debit" ? "Debits Only" :
                  `${filter.charAt(0).toUpperCase() + filter.slice(1)} Only`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilter("all")}>All Transactions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("credit")}>Credits Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("debit")}>Debits Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>Completed Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>Pending Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("failed")}>Failed Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border overflow-hidden">
          <div className="grid grid-cols-12 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">From/To</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-12 p-4 border-b last:border-0 items-center hover:bg-muted/50">
                  <div className="col-span-4">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">ID: {transaction.id.slice(0, 8)}...</div>
                  </div>
                  <div className={`col-span-2 font-medium ${
                    transaction.type === "credit" 
                      ? "text-bank-green" 
                      : "text-bank-red"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="col-span-3">
                    {transaction.type === "credit" && transaction.fromAccount && (
                      <div className="text-sm">
                        From: <span className="font-mono">{transaction.fromAccount}</span>
                        <div className="text-xs text-muted-foreground">
                          {users[transaction.fromAccount]?.name || "Unknown"}
                        </div>
                      </div>
                    )}
                    {transaction.type === "debit" && transaction.toAccount && (
                      <div className="text-sm">
                        To: <span className="font-mono">{transaction.toAccount}</span>
                        <div className="text-xs text-muted-foreground">
                          {users[transaction.toAccount]?.name || "Unknown"}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-sm">
                    {format(new Date(transaction.timestamp), "MMM d, yyyy")}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(transaction.timestamp), "h:mm a")}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
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
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionMonitor;
