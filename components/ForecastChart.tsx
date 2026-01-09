
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Product } from '../types';

interface Props {
  selectedProduct?: Product | null;
}

const ForecastChart: React.FC<Props> = ({ selectedProduct }) => {
  const chartData = React.useMemo(() => {
    if (selectedProduct) {
      return selectedProduct.historicalSales.slice(-14).map((s) => ({
        name: s.date.split('-').slice(1).join('/'),
        actual: s.quantity,
        predicted: Math.max(0, Math.floor(s.quantity * (0.85 + Math.random() * 0.4)))
      }));
    }

    return [
      { name: '02/15', actual: 380, predicted: 400 },
      { name: '02/16', actual: 420, predicted: 410 },
      { name: '02/17', actual: 400, predicted: 420 },
      { name: '02/18', actual: 300, predicted: 310 },
      { name: '02/19', actual: 200, predicted: 220 },
      { name: '02/20', actual: 278, predicted: 250 },
      { name: '02/21', actual: 189, predicted: 210 },
      { name: '02/22', actual: 239, predicted: 240 },
      { name: '02/23', actual: 349, predicted: 360 },
      { name: '02/24', actual: 410, predicted: 390 },
    ];
  }, [selectedProduct]);

  return (
    <div className="w-full h-full min-h-[300px] bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-6 left-8 z-10">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {selectedProduct ? `${selectedProduct.name} Analysis` : 'Aggregate Demand Forecast'}
        </h4>
        <p className="text-xl font-black text-slate-900">Demand Wavefront</p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 80, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
              padding: '12px 16px'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: '800' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={36} 
            iconType="circle" 
            wrapperStyle={{ top: 24, right: 24 }}
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#6366f1" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorActual)" 
            name="Live Velocity"
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
          <Area 
            type="monotone" 
            dataKey="predicted" 
            stroke="#10b981" 
            strokeWidth={4} 
            strokeDasharray="8 8" 
            fillOpacity={1} 
            fill="url(#colorPred)" 
            name="AI Projection"
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
