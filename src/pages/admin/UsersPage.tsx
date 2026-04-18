import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, CheckCircle2, ShieldCheck, Crown, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

type Role = "Citizen" | "Officer" | "Senior Officer" | "Admin";

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  complaints: number;
  status: "active" | "blocked";
  joined: string;
}

const roleStyles: Record<Role, { bg: string; icon: React.ElementType }> = {
  Citizen: { bg: "bg-muted text-muted-foreground border-border", icon: UserIcon },
  Officer: { bg: "bg-primary/10 text-primary border-primary/20", icon: Shield },
  "Senior Officer": { bg: "bg-secondary/10 text-secondary border-secondary/20", icon: ShieldCheck },
  Admin: { bg: "bg-destructive/10 text-destructive border-destructive/20", icon: Crown },
};

const initial: UserRow[] = [
  { id: "U-1042", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 43210", role: "Citizen", complaints: 12, status: "active", joined: "Jan 2024" },
  { id: "U-1041", name: "Priya Mehta", email: "priya.m@example.com", phone: "+91 90000 11122", role: "Citizen", complaints: 4, status: "active", joined: "Feb 2024" },
  { id: "O-2003", name: "SI R. Verma", email: "verma@police.gov", phone: "+91 88880 11122", role: "Officer", complaints: 84, status: "active", joined: "Aug 2022" },
  { id: "O-2007", name: "ACP M. Joshi", email: "joshi@police.gov", phone: "+91 88880 99887", role: "Senior Officer", complaints: 240, status: "active", joined: "Mar 2019" },
  { id: "U-1039", name: "Spam User", email: "spam@bad.com", phone: "+91 11111 22222", role: "Citizen", complaints: 28, status: "blocked", joined: "Dec 2023" },
  { id: "A-3001", name: "Insp. R. Kumar", email: "kumar@police.gov", phone: "+91 99999 11111", role: "Admin", complaints: 0, status: "active", joined: "Jun 2018" },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initial);
  const [query, setQuery] = useState("");

  const toggle = (id: string) => {
    setUsers((u) =>
      u.map((x) =>
        x.id === id
          ? { ...x, status: x.status === "active" ? "blocked" : "active" }
          : x,
      ),
    );
    const user = users.find((u) => u.id === id);
    toast.success(`${user?.name} ${user?.status === "active" ? "blocked" : "unblocked"}`);
  };

  const filtered = users.filter(
    (u) =>
      !query ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View, block or unblock citizen accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{users.filter((u) => u.status === "active").length}</span> active ·{" "}
            <span className="font-bold text-destructive">{users.filter((u) => u.status === "blocked").length}</span> blocked
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card animate-fade-in-up">
        <div className="p-5 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="text-left font-medium py-3 px-5">User</th>
                <th className="text-left font-medium py-3 px-5">Role</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Contact</th>
                <th className="text-left font-medium py-3 px-5 hidden lg:table-cell">Complaints</th>
                <th className="text-left font-medium py-3 px-5">Status</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Joined</th>
                <th className="text-right font-medium py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => {
                const RoleIcon = roleStyles[u.role].icon;
                return (
                <tr key={u.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-teal flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border inline-flex items-center gap-1 ${roleStyles[u.role].bg}`}>
                      <RoleIcon className="h-3 w-3" /> {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <div className="text-sm">{u.email}</div>
                    <div className="text-xs text-muted-foreground">{u.phone}</div>
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell">{u.complaints}</td>
                  <td className="py-3 px-5">
                    {u.status === "active" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-success/10 text-success border-success/20 inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1">
                        <Ban className="h-3 w-3" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell text-muted-foreground text-xs">{u.joined}</td>
                  <td className="py-3 px-5 text-right">
                    <Button
                      size="sm"
                      variant={u.status === "active" ? "outline" : "hero"}
                      onClick={() => toggle(u.id)}
                    >
                      {u.status === "active" ? (
                        <>
                          <Ban className="h-3.5 w-3.5 mr-1" /> Block
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Unblock
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
