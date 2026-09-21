import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { useStore } from "../store";
import { Card, Button } from "../components/ui";
import { PageHeader } from "../components/common";
import { DEPARTMENTS } from "../data";

const NAVY = "#10294f";
const ACCENT = "#1e63d0";
const PALETTE = [
  "#10294f",
  "#1e63d0",
  "#3b82c4",
  "#5f9bd8",
  "#0f7a48",
  "#b5710a",
  "#7c5cbf",
  "#c0332f",
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #dbe3ee",
  fontSize: 12,
  boxShadow: "0 6px 24px rgba(16,41,79,0.12)",
};

export default function Reports() {
  const { grs, toast } = useStore();

  const byDept = DEPARTMENTS.map((d) => ({
    name: d.replace(" Department", "").replace(" Administration", " Admin"),
    count: grs.filter((g) => g.department === d).length,
  })).filter((d) => d.count > 0);

  const byYear = Object.entries(
    grs.reduce<Record<string, number>>((acc, g) => {
      const y = g.date.slice(0, 4);
      acc[y] = (acc[y] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  const byCat = Object.entries(
    grs.reduce<Record<string, number>>((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthly = months.map((m, i) => {
    const count = grs.filter(
      (g) => Number(g.date.slice(5, 7)) === i + 1,
    ).length;
    // Blend live data with a realistic demo baseline curve.
    const baseline = [18, 22, 27, 24, 31, 29, 35, 33, 28, 26, 30, 21][i];
    return { month: m, additions: baseline + count };
  });

  return (
    <div className="animate-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Insights across departments, categories and time — based on demo data."
        actions={
          <Button onClick={() => toast("Report exported as PDF.")}>
            <Download size={16} /> Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-base font-bold">GRs by Department</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Total resolutions per department
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byDept} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#5a6b82" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: "#5a6b82" }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#eef2f7" }} />
              <Bar dataKey="count" fill={NAVY} radius={[4, 4, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-base font-bold">GRs by Category</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Distribution across resolution categories
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byCat}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={2}
              >
                {byCat.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-base font-bold">GRs by Year</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Resolutions issued per year
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byYear} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#5a6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5a6b82" }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#eef2f7" }} />
              <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={54} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-base font-bold">Monthly GR Additions</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            New resolutions added each month
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#5a6b82" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5a6b82" }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="additions"
                stroke={ACCENT}
                strokeWidth={2.5}
                dot={{ r: 3, fill: ACCENT }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
