import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminSettings = () => {
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure escalation rules, notifications and station details.
        </p>
      </div>

      <form onSubmit={save} className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-display font-semibold">Escalation rules</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="l1">Level 1 SLA (hours)</Label>
              <Input id="l1" type="number" defaultValue={48} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="l2">Level 2 SLA (hours)</Label>
              <Input id="l2" type="number" defaultValue={96} className="mt-1.5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-display font-semibold">Notifications</h3>
          {[
            { id: "email", label: "Email alerts on new high-priority complaints", on: true },
            { id: "sms", label: "SMS alerts on auto-escalations", on: true },
            { id: "weekly", label: "Weekly performance digest", on: false },
          ].map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <Label htmlFor={n.id} className="text-sm font-normal">
                {n.label}
              </Label>
              <Switch id={n.id} defaultChecked={n.on} />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="hero">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
