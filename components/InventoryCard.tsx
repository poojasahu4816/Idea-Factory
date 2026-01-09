
import React from 'react';
import { Product } from '../types';
import { ImageIcon, Clock, ShoppingBag } from 'lucide-react';

interface Props {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

const InventoryCard: React.FC<Props> = ({ 
  product, 
  isSelected, 
  onSelect
}) => {
  const stockRatio = (product.currentStock / product.maxStock) * 100;
  const isCritical = product.currentStock <= product.minStock;
  const isOverstocked = product.currentStock > product.maxStock;

  let statusColor = 'bg-emerald-500';
  let statusText = 'Optimal';
  let statusBg = 'bg-emerald-50 text-emerald-600';
  
  if (isCritical) {
    statusColor = 'bg-rose-500';
    statusText = 'Low Stock';
    statusBg = 'bg-rose-50 text-rose-600';
  } else if (isOverstocked) {
    statusColor = 'bg-amber-500';
    statusText = 'Overstock';
    statusBg = 'bg-amber-50 text-amber-600';
  }

  return (
    <div 
      className={`bg-white rounded-[2rem] border-2 p-4 transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-indigo-500' : 'border-slate-100 hover:border-slate-200'}`}
      onClick={onSelect}
    >
      <div className="h-40 bg-slate-50 rounded-2xl relative overflow-hidden mb-5">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-slate-200" />
          </div>
        )}
        <div className="absolute top-3 right-3">
           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm border border-white/50 backdrop-blur-md ${statusBg}`}>
             {statusText}
           </span>
        </div>
      </div>

      <div className="space-y-4 px-2">
        <div>
          <h3 className="font-black text-slate-900 leading-none mb-1 truncate">{product.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
             <p className="text-[10px] font-black text-slate-500 uppercase">Available</p>
             <p className="text-sm font-black text-slate-900">{product.currentStock} units</p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${statusColor}`}
              style={{ width: `${Math.min(stockRatio, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
           <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase">{product.leadTime}d wait</span>
           </div>
           <p className="font-black text-slate-900">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
