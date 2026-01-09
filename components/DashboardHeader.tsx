
import React from 'react';
import { Package, AlertTriangle, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  totalValue: number;
  understockCount: number;
  overstockValue: number;
  optimizationScore: number;
}

const DashboardHeader: React.FC<Props> = ({ 
  totalValue, 
  understockCount, 
  overstockValue, 
  optimizationScore 
}) => {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const stats = [
    { 
      label: 'Asset Portfolio', 
      value: formatCurrency(totalValue), 
      icon: Package, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Critical Stockouts', 
      value: understockCount.toString(), 
      icon: Zap, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
    { 
      label: 'Wasted Capital', 
      value: formatCurrency(overstockValue), 
      icon: TrendingDown, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Ops Efficiency', 
      value: `${optimizationScore}%`, 
      icon: ShieldCheck, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md group cursor-default">
          <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHeader;
