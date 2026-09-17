import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const sampleData = [
  { day: 'Mon', collectedKg: 420, recoveredKg: 400 },
  { day: 'Tue', collectedKg: 580, recoveredKg: 550 },
  { day: 'Wed', collectedKg: 750, recoveredKg: 710 },
  { day: 'Thu', collectedKg: 910, recoveredKg: 870 },
  { day: 'Fri', collectedKg: 1100, recoveredKg: 1040 },
  { day: 'Sat', collectedKg: 1350, recoveredKg: 1290 },
  { day: 'Sun', collectedKg: 1520, recoveredKg: 1460 }
];

export function WasteTrendChart({ height = 260 }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="collectedKg"
            name="Collected (kg)"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCollected)"
          />
          <Area
            type="monotone"
            dataKey="recoveredKg"
            name="Recovered (kg)"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRecovered)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
