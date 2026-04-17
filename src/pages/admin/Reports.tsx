import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryData = [
  { label: "Theft", value: 38, color: "bg-primary" },
  { label: "Cybercrime", value: 27, color: "bg-secondary" },
  { label: "Fraud", value: 18, color: "bg-warning" },
  { label: "Domestic", value: 9, color: "bg-destructive" },
  { label: "Public Nuisance", value: 8, color: "bg-success" },
];

const areaData = [
  { area: "MG Road", count: 312 },
  { area: "Indira Nagar", count: 264 },
  { area: "Koramangala", count: 198 },
  { area: "HSR Layout", count: 175 },
  { area: "Whitefield", count: 142 },
  { area: "Jayanagar", count: 118 },
];

const monthly = [120, 165, 140, 198, 175, 220, 188, 240, 210, 268, 235, 290];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Reports = () => {
  const maxArea = Math.max(...areaData.map((a) => a.count));
  const maxMonth = Math.max(...monthly);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Insights across categories, geographies and trends.
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-1" /> Export PDF
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
        <h3 className="font-display font-semibold mb-1">Monthly trend</h3>
        <p className="text-xs text-muted-foreground mb-4">Complaints filed per month (current year)</p>
        <div className="flex items-end gap-2 h-48">
          {monthly.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md gradient-primary opacity-80 hover:opacity-100 transition-all"
                style={{ height: `${(v / maxMonth) * 100}%` }}
                title={`${months[i]}: ${v}`}
              />
              <span className="text-[10px] text-muted-foreground">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
          <h3 className="font-display font-semibold mb-1">Category breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution across complaint types</p>
          <div className="space-y-4">
            {categoryData.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.color} rounded-full transition-all duration-500`}
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in-up [animation-delay:120ms]">
          <h3 className="font-display font-semibold mb-1">Area-wise issues</h3>
          <p className="text-xs text-muted-foreground mb-4">Top stations by complaint volume</p>
          <div className="space-y-3">
            {areaData.map((a) => (
              <div key={a.area} className="flex items-center gap-3">
                <span className="text-sm font-medium w-32 truncate">{a.area}</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-teal rounded-full"
                    style={{ width: `${(a.count / maxArea) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
