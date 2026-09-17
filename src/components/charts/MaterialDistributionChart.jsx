import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const sampleMaterialData = [
  { name: 'Clean Plastic & PET', value: 38, color: '#10b981' },
  { name: 'Cardboard & Paper', value: 24, color: '#06b6d4' },
  { name: 'Coconut Shells', value: 16, color: '#f59e0b' },
  { name: 'Metal & Aluminium', value: 12, color: '#a855f7' },
  { name: 'E-Waste PCB', value: 6, color: '#ef4444' },
  { name: 'Glass & Textiles', value: 4, color: '#64748b' }
];

export function MaterialDistributionChart({ height = 260 }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={sampleMaterialData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {sampleMaterialData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
            formatter={(val) => [`${val}%`, 'Share']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-[11px] text-slate-300 ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
