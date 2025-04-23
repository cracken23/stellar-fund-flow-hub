
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { addTransaction, getAllUsers } from "@/utils/mockData";
import { toast } from "sonner";
import { User } from "@/utils/mockData";

const NewTransaction = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all users except the current one
    const allUsers = getAllUsers().filter((u) => u.id !== user?.id);
    setUsers(allUsers);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!amount || !receiverId || !description) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amountValue > user.balance) {
      toast.error("Insufficient funds for this transaction");
      return;
    }
    
    setIsLoading(true);
    
    try {
      addTransaction(user.id, receiverId, amountValue, description);
      toast.success("Transaction completed successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <Card className="max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
        <CardDescription>Send money to another user</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiver">Select Recipient</Label>
            <select
              id="receiver"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            >
              <option value="">Select a recipient</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.accountNumber})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={user.balance.toString()}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Available balance: ${user.balance.toFixed(2)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this payment for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Send Money"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewTransaction;
