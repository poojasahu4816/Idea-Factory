
import React from 'react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { InventoryInsight } from '../types';

interface Props {
  insights: InventoryInsight[];
  loading: boolean;
  onRefresh: () => void;
}

const InsightsPanel: React.FC<Props> = ({ insights, loading, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900">AI Optimization Insights</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 text-slate-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[500px]">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-8 bg-slate-100 rounded w-full mt-2"></div>
            </div>
          ))
        ) : insights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No critical optimizations needed at this moment.</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  insight.type === 'understock' ? 'bg-rose-100 text-rose-700' :
                  insight.type === 'overstock' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {insight.type}
                </span>
                <span className={`text-[10px] font-semibold ${
                  insight.severity === 'high' ? 'text-rose-600' : 
                  insight.severity === 'medium' ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {insight.severity.toUpperCase()} PRIORITY
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{insight.productName}</h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{insight.message}</p>
              <button className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group">
                <span>{insight.action}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-indigo-600 text-white">
        <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Impact Analysis</p>
        <p className="text-sm font-medium">Resolving these items can reduce working capital blockage by $12,400 this week.</p>
      </div>
    </div>
  );
};

export default InsightsPanel;
