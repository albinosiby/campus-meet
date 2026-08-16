"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ChartSlice } from "@/admin/types";

interface PieChartCardProps {
  title: string;
  description: string;
  data: ChartSlice[];
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartSlice & { percent: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-sm border border-admin-border bg-admin-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-heading text-admin-ink">{item.label}</p>
      <p className="mt-1 text-[11px] text-admin-muted">
        {item.value} registrations · {item.percent}%
      </p>
    </div>
  );
}

export function PieChartCard({ title, description, data }: PieChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map((item) => ({
    ...item,
    percent: total ? Math.round((item.value / total) * 100) : 0,
  }));

  return (
    <div className="rounded-sm border border-admin-border bg-admin-surface p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h3 className="font-heading text-base font-semibold text-admin-ink">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-admin-muted">
          {description}
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-admin-muted">
          No data yet
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto]">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="max-h-[280px] min-w-[160px] space-y-2.5 overflow-y-auto pr-1">
            {chartData.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs text-admin-muted" title={item.label}>
                    {item.label}
                  </span>
                </div>
                <span className="shrink-0 font-heading text-xs font-semibold tabular-nums text-admin-ink">
                  {item.value}
                  <span className="ml-1 font-normal text-admin-muted">
                    ({item.percent}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
