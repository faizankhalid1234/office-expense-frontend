"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDualCurrency } from "@/lib/utils-format";
import { CHART_COLORS } from "@/lib/constants";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface TrendData {
  date: string;
  amount: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-bold text-foreground">{formatDualCurrency(payload[0].value, "PKR")}</p>
    </div>
  );
};

function ChartBox({
  title,
  subtitle,
  children,
  empty,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="soft-card flex h-full w-full min-w-0 flex-col overflow-hidden">
      <div className="border-b border-border/40 px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">{title}</h3>
        <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
      </div>
      {empty ? (
        <div className="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground sm:py-16">
          No data yet
        </div>
      ) : (
        <div className="min-w-0 flex-1 overflow-x-auto px-2 py-3 sm:px-3 sm:py-4">{children}</div>
      )}
    </div>
  );
}

export function CategoryPieChart({ data }: { data: CategoryData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full w-full min-w-0"
    >
      <ChartBox title="By Category" subtitle="This month's split" empty={!data.length}>
        {data.length > 0 && (
          <div className="relative mx-auto w-full min-w-[260px] max-w-lg">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {data.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDualCurrency(Number(value), "PKR")} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-center sm:top-[40%]">
              <p className="text-[10px] text-muted-foreground sm:text-xs">Total</p>
              <p className="text-[10px] font-bold text-foreground sm:text-xs">
                {formatDualCurrency(total, "PKR")}
              </p>
            </div>
          </div>
        )}
      </ChartBox>
    </motion.div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="h-full w-full min-w-0"
    >
      <ChartBox title="Monthly Trend" subtitle="Last 12 months">
        <div className="chart-wrap min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#14b8a6" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartBox>
    </motion.div>
  );
}

export function ExpenseTrendChart({ data }: { data: TrendData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="h-full w-full min-w-0"
    >
      <ChartBox title="Expense Trend" subtitle="Last 30 days" empty={!data.length}>
        {data.length > 0 && (
          <div className="chart-wrap min-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  className="text-muted-foreground"
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#0d9488" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartBox>
    </motion.div>
  );
}
