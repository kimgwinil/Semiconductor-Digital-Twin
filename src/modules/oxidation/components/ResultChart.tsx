import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ResultChartProps {
  data: any[];
}

export function ResultChart({ data }: ResultChartProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        Run a simulation to generate data
      </div>
    );
  }

  // Sort by time for a proper trend line if needed, but since it's a history of runs, 
  // we might just want to show them sequentially. Let's just map the index as Run #
  const chartData = data.map((d, i) => ({
    name: `Run ${i + 1}`,
    ...d
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-4 pl-4 border-l-2 border-cyan-500">
        History: {t('oxidation.chart.title')}
      </h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="nm"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#22d3ee' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="thickness" 
              name="Thickness (nm)"
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#020617', stroke: '#06b6d4', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#020617' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
