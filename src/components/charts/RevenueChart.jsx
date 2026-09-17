import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const sampleRevenueData = [
  { month: 'Apr', revenue: 120000 },
  { month: 'May', revenue: 185000 },
  { month: 'Jun', revenue: 240000 },
  { month: 'Jul', revenue: 310000 },
  { month: 'Aug', revenue: 490000 },
  { month: 'Sep (Est)', revenue: 894200 }
];

export function RevenueChart({ height = 260 }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={sampleRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
            formatter={(val) => [`₹${val.toLocaleString()}`, 'B2B Revenue']}
          />
          <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
