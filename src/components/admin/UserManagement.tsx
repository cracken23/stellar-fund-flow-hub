
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash, Check, X } from "lucide-react";
import { User, getAllUsers, removeUser, addUser } from "@/utils/mockData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin",
  });
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  useEffect(() => {
    if (users.length > 0) {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const filtered = users.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.accountNumber.includes(term)
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }
  }, [users, searchTerm]);
  
  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };
  
  const handleAddUser = () => {
    try {
      if (!newUser.name || !newUser.email) {
        toast.error("Name and email are required");
        return;
      }
      
      addUser(newUser.name, newUser.email, newUser.role);
      toast.success("User added successfully");
      setDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "user",
      });
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add user");
    }
  };
  
  const handleRemoveUser = (userId: string) => {
    try {
      removeUser(userId);
      toast.success("User removed successfully");
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove user");
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage all user accounts</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. They will receive a default password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newUser.role}
                  onChange={(e) => setNewUser({
                    ...newUser,
                    role: e.target.value as "user" | "admin",
                  })}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className="rounded-md border">
          <div className="grid grid-cols-12 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-4">Name/Email</div>
            <div className="col-span-3">Account Number</div>
            <div className="col-span-2">Balance</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Actions</div>
          </div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-12 p-4 border-b last:border-0 items-center hover:bg-muted/50">
                <div className="col-span-4">
                  <div>{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="col-span-3 font-mono">{user.accountNumber}</div>
                <div className="col-span-2">${user.balance.toFixed(2)}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-bank-blue/10 text-bank-blue" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveUser(user.id)}
                    className="hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
