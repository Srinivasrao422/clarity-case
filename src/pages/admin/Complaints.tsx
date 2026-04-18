import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, MoreVertical, Eye, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";
import { SLABadge } from "@/components/SLABadge";

const officers = [
  "SI R. Verma · MG Road",
  "Insp. A. Khan · Cyber Cell",
  "ASI M. Singh · Traffic",
  "SI N. Desai · Women & Child",
  "Insp. S. Gupta · EOW",
];

const complaints = [
  { id: "SPC-2024-0892", citizen: "Aarav Sharma", category: "Theft", station: "MG Road", priority: "High", status: "Escalated", date: "Mar 12", officer: "SI R. Verma", slaHours: -12 },
  { id: "SPC-2024-0891", citizen: "Priya Mehta", category: "Cybercrime", station: "Cyber Cell", priority: "High", status: "In Progress", date: "Mar 12", officer: "Insp. A. Khan", slaHours: 8 },
  { id: "SPC-2024-0890", citizen: "Rohan Iyer", category: "Public Nuisance", station: "Indira Nagar", priority: "Low", status: "Resolved", date: "Mar 11", officer: "SI K. Pillai", slaHours: 0 },
  { id: "SPC-2024-0889", citizen: "Neha Kapoor", category: "Missing Person", station: "HSR Layout", priority: "High", status: "In Progress", date: "Mar 11", officer: "Insp. P. Rao", slaHours: 14 },
  { id: "SPC-2024-0888", citizen: "Vikram Rao", category: "Fraud", station: "Whitefield", priority: "Medium", status: "Submitted", date: "Mar 10", officer: "Unassigned", slaHours: 48 },
  { id: "SPC-2024-0887", citizen: "Anjali Singh", category: "Vehicle", station: "Koramangala", priority: "Medium", status: "Resolved", date: "Mar 10", officer: "ASI M. Singh", slaHours: 0 },
  { id: "SPC-2024-0886", citizen: "Karthik Nair", category: "Domestic", station: "Jayanagar", priority: "High", status: "In Progress", date: "Mar 09", officer: "SI N. Desai", slaHours: 22 },
];

const statusStyles: Record<string, string> = {
  Escalated: "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Submitted: "bg-primary/10 text-primary border-primary/20",
};

const priorityStyles: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted text-muted-foreground",
};

const Complaints = () => {
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = complaints.filter((c) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.citizen.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.station.toLowerCase().includes(q);
    return (
      (filter === "All" || c.status === filter) &&
      (category === "All" || c.category === category) &&
      matchesQuery
    );
  });

  const [assignFor, setAssignFor] = useState<string | null>(null);
  const [chosenOfficer, setChosenOfficer] = useState(officers[0]);

  const updateStatus = (id: string) => toast.success(`${id} status updated`);
  const openAssign = (id: string) => {
    setAssignFor(id);
    setChosenOfficer(officers[0]);
  };
  const confirmAssign = () => {
    toast.success(`${chosenOfficer.split(" · ")[0]} assigned to ${assignFor}`);
    setAssignFor(null);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Complaint Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Triage, assign officers and update status across all complaints.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card animate-fade-in-up">
        <div className="p-5 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, citizen, category or station..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground self-center mr-2">
              Status:
            </span>
            {["All", "Submitted", "In Progress", "Escalated", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground self-center mr-2">
              Category:
            </span>
            {["All", "Theft", "Cybercrime", "Fraud", "Missing Person", "Public Nuisance", "Vehicle", "Domestic"].map((f) => (
              <button
                key={f}
                onClick={() => setCategory(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === f
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="h-3 w-3 mr-1" /> Date range
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="text-left font-medium py-3 px-5">ID</th>
                <th className="text-left font-medium py-3 px-5">Citizen</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Category</th>
                <th className="text-left font-medium py-3 px-5 hidden lg:table-cell">Station</th>
                <th className="text-left font-medium py-3 px-5">Priority</th>
                <th className="text-left font-medium py-3 px-5">Status</th>
                <th className="text-left font-medium py-3 px-5 hidden md:table-cell">Date</th>
                <th className="text-right font-medium py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-primary">{c.id}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full gradient-teal flex items-center justify-center text-[10px] font-semibold text-secondary-foreground">
                        {c.citizen.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {c.citizen}
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell text-muted-foreground">{c.category}</td>
                  <td className="py-3 px-5 hidden lg:table-cell text-muted-foreground">{c.station}</td>
                  <td className="py-3 px-5">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityStyles[c.priority]}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell text-muted-foreground text-xs">{c.date}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => toast(`Viewing ${c.id}`)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => assignOfficer(c.id)}>
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => updateStatus(c.id)}>
                        Update
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No complaints match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
