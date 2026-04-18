import { Bell, AlertTriangle, CheckCircle2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Notification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "update" | "escalation" | "resolved" | "new";
};

const iconFor = (t: Notification["type"]) => {
  switch (t) {
    case "escalation":
      return { Icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" };
    case "resolved":
      return { Icon: CheckCircle2, color: "text-success", bg: "bg-success/10" };
    case "new":
      return { Icon: FileText, color: "text-primary", bg: "bg-primary/10" };
    default:
      return { Icon: Clock, color: "text-warning", bg: "bg-warning/10" };
  }
};

interface Props {
  notifications?: Notification[];
}

const defaultCitizen: Notification[] = [
  { id: "1", title: "Complaint escalated", desc: "SPC-2024-0892 was auto-escalated to ACP.", time: "2h ago", type: "escalation" },
  { id: "2", title: "Status updated", desc: "SI R. Verma updated SPC-2024-0892.", time: "1d ago", type: "update" },
  { id: "3", title: "Complaint resolved", desc: "SPC-2024-0876 marked as resolved.", time: "3d ago", type: "resolved" },
];

export const NotificationBell = ({ notifications = defaultCitizen }: Props) => {
  const unread = notifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-sm">Notifications</h4>
            <p className="text-xs text-muted-foreground">{unread} recent updates</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Mark all read
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {notifications.map((n) => {
            const { Icon, color, bg } = iconFor(n.type);
            return (
              <div key={n.id} className="p-3 hover:bg-accent/50 transition-colors flex gap-3">
                <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
