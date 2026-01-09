
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Package, TrendingUp, Settings, Bell, Search, Filter, 
  BrainCircuit, X, ArrowUpRight, ArrowDownRight, 
  ImageIcon, Check, Calendar, Target, 
  Zap, Edit2, Link as LinkIcon, Activity, Globe, Cloud, 
  ShieldCheck, Plus, ShoppingCart, Loader2, DollarSign,
  Shield, Fingerprint, Mail, BellRing, Smartphone, Briefcase, 
  Truck, BadgeCheck, Smartphone as MobileIcon, Terminal,
  History as HistoryLog, Sliders, Box, Wand2, CreditCard,
  PlusCircle, MapPinned, Store, Building2, ChevronRight,
  HelpCircle, ChevronLeft, LayoutGrid, ListFilter, Camera, Upload, Trash2, Info, AlertCircle, ShoppingBag,
  ExternalLink, BarChart3, Clock3, Tag, RefreshCw, Sun, Snowflake, TrendingDown, Thermometer, Waves,
  CheckCircle2, ListTodo, Ghost, Sparkle, ScanLine, QrCode, FileJson, Database, Percent, CalendarDays, Rocket,
  UserCheck, MessageCircle, Map, Send, MoveHorizontal, Wifi, WifiOff, CloudOff, FileText, Share2
} from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import InventoryCard from './components/InventoryCard';
import ForecastChart from './components/ForecastChart';
import InsightsPanel from './components/InsightsPanel';
import { MOCK_PRODUCTS, MOCK_FACTORS, CATEGORIES_WITH_IMAGES, MOCK_SUPPLIERS } from './constants';
import { getInventoryInsights, generateProductImage } from './services/geminiService';
import { InventoryInsight, Product, Supplier } from './types';

type ViewID = 'dashboard' | 'inventory' | 'forecasting' | 'suppliers' | 'connect' | 'settings';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'success' | 'whatsapp';
  read: boolean;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewID>('dashboard');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [insights, setInsights] = useState<InventoryInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('All');
  const [inventoryLocation, setInventoryLocation] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  const [selectedTransferProduct, setSelectedTransferProduct] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferTo, setTransferTo] = useState<Product['location']>('South');
  
  const [discountValue, setDiscountValue] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [userProfile] = useState({
    name: 'Sarah Connor',
    role: 'Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  });

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      title,
      message,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleStockTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransferProduct || transferAmount <= 0) return;
    setProducts(prev => prev.map(p => p.id === selectedTransferProduct ? { ...p, location: transferTo } : p));
    addNotification('Relocation Success', `Units moved to ${transferTo} Hub successfully.`, 'success');
    setIsTransferModalOpen(false);
  };

  const triggerWhatsAppPO = (product: Product) => {
    addNotification('WhatsApp PO Sent', `PO for ${product.name} dispatched to ${product.supplier?.name}.`, 'whatsapp');
  };

  const handleConnectClick = (service: string) => {
    setIsSyncing(service);
    setTimeout(() => {
      setIsSyncing(null);
      addNotification('Direct Connect', `${service} linked successfully! Data is now auto-syncing.`, 'success');
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardStats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.currentStock * p.price), 0);
    const understockCount = products.filter(p => p.currentStock <= p.minStock).length;
    const overstockValue = products.filter(p => p.currentStock > p.maxStock).reduce((acc, p) => acc + ((p.currentStock - p.maxStock) * p.price), 0);
    return { totalValue, understockCount, overstockValue, optimizationScore: 94 };
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingInsights(true);
      getInventoryInsights(products).then(res => {
        setInsights(res);
        setLoadingInsights(false);
      });
    }
  }, [isAuthenticated, products]);

  const ViewTitleHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        <span>OptiStock AI</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-indigo-600">{title}</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
        <ViewTitleHeader title="Smart Dashboard" subtitle={`AI recommends reordering ${dashboardStats.understockCount} items.`} />
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setIsOffline(!isOffline)}
            className={`cursor-pointer px-4 py-3 rounded-2xl border transition-all flex items-center gap-3 ${isOffline ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}
          >
            {isOffline ? <CloudOff className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
            <div className="text-left">
              <p className="text-[9px] font-black uppercase leading-none mb-0.5">Mode</p>
              <p className="text-[10px] font-black uppercase">{isOffline ? 'Offline (Local)' : 'Online (Cloud)'}</p>
            </div>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Store Health</p>
               <p className="text-sm font-black text-slate-900">100% Active</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
               <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      
      <DashboardHeader 
        totalValue={dashboardStats.totalValue} 
        understockCount={dashboardStats.understockCount} 
        overstockValue={dashboardStats.overstockValue} 
        optimizationScore={dashboardStats.optimizationScore} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-rose-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform"><AlertCircle className="w-16 h-16" /></div>
             <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" /> Stock Depletion Alert!
             </h3>
             <div className="space-y-4 relative z-10">
                {products.filter(p => p.currentStock <= p.minStock * 1.5).slice(0, 3).map((p, i) => (
                   <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 group/item">
                      <div>
                         <p className="text-xs font-black">{p.name}</p>
                         <p className="text-[10px] font-medium opacity-70 uppercase">{p.currentStock} units remaining</p>
                      </div>
                      <button 
                        onClick={() => triggerWhatsAppPO(p)}
                        className="p-3 bg-white/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                   </div>
                ))}
             </div>
             <button onClick={() => setCurrentView('inventory')} className="w-full mt-8 py-4 bg-white text-rose-600 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-50 transition-all">Emergency Order All</button>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                <LinkIcon className="w-4 h-4 text-indigo-600" /> Direct Connect
             </h3>
             <p className="text-slate-400 text-xs font-medium mb-8">Connect your store in one click for automatic data synchronization.</p>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Shopify', icon: ShoppingBag, color: 'text-emerald-600' },
                  { name: 'Amazon', icon: Store, color: 'text-amber-600' },
                  { name: 'Tally', icon: FileText, color: 'text-indigo-600' },
                  { name: 'GST', icon: ShieldCheck, color: 'text-blue-600' },
                ].map(svc => (
                  <button 
                    key={svc.name}
                    onClick={() => handleConnectClick(svc.name)}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center gap-3 hover:border-indigo-400 transition-all group"
                  >
                    {isSyncing === svc.name ? <Loader2 className="w-6 h-6 animate-spin text-indigo-600" /> : <svc.icon className={`w-6 h-6 ${svc.color}`} />}
                    <span className="text-[10px] font-black uppercase">{svc.name}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm h-[550px]">
              <ForecastChart selectedProduct={selectedProduct} />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Next Week Projections</h4>
                  <p className="text-lg font-black leading-tight">Electronics category is expected to surge by 30% due to upcoming seasonal trends.</p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 p-3 rounded-xl hover:bg-white/20 w-fit">
                  Full Report <ChevronRight className="w-4 h-4" />
                </button>
             </div>
             <div className="bg-emerald-600 p-8 rounded-[3rem] text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Savings Opportunity</h4>
                  <p className="text-lg font-black leading-tight">Relocating items from East to North Hub can save $450 in logistics.</p>
                </div>
                <button onClick={() => setIsTransferModalOpen(true)} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 p-3 rounded-xl hover:bg-white/20 w-fit">
                  Transfer Stock <ChevronRight className="w-4 h-4" />
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryView = () => (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <ViewTitleHeader title="Inventory Grid" subtitle="Manage stocks across multiple locations with ease." />
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsTransferModalOpen(true)} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
            <MoveHorizontal className="w-5 h-5" /> Stock Transfer
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
            <Plus className="w-5 h-5" /> Add New Item
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
          <MapPinned className="w-5 h-5 text-indigo-600" />
          {['All', 'North', 'South', 'East', 'West'].map(loc => (
            <button 
              key={loc} onClick={() => setInventoryLocation(loc)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryLocation === loc ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {loc === 'All' ? 'All Regions' : `${loc} Hub`}
            </button>
          ))}
        </div>
        <div className="relative flex-grow">
          <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Search SKU or Stock Item..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products
          .filter(p => (inventoryCategory === 'All' || p.category === inventoryCategory) && 
                      (inventoryLocation === 'All' || p.location === inventoryLocation) &&
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(product => (
            <InventoryCard key={product.id} product={product} isSelected={selectedProduct?.id === product.id} onSelect={() => { setSelectedProduct(product); setIsModalOpen(true); }} />
          ))}
      </div>
    </div>
  );

  const renderConnectView = () => (
    <div className="space-y-12 pb-24 animate-in fade-in duration-500">
      <ViewTitleHeader title="One-Click Connect" subtitle="Link your business ecosystem without any technical complexity." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { id: 'shopify', name: 'Shopify Store', icon: ShoppingBag, desc: 'Synchronize your online storefront.', color: 'emerald' },
          { id: 'amazon', name: 'Amazon Seller', icon: Store, desc: 'Manage Amazon inventory directly from here.', color: 'amber' },
          { id: 'tally', name: 'Tally Prime', icon: FileText, desc: 'Bridge your financial ledgers and stock counts.', color: 'indigo' },
          { id: 'gst', name: 'GST Portal', icon: ShieldCheck, desc: 'Handle GST compliance and invoicing automatically.', color: 'blue' },
          { id: 'flipkart', name: 'Flipkart', icon: ShoppingCart, desc: 'Monitor Flipkart orders in real-time.', color: 'sky' },
          { id: 'zoho', name: 'Zoho Books', icon: Briefcase, desc: 'Unified accounting and stock management.', color: 'rose' },
        ].map(item => (
          <div key={item.id} className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col group hover:border-indigo-500 transition-all">
             <div className={`w-20 h-20 rounded-[2rem] bg-${item.color}-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-10 h-10 text-${item.color}-600`} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-3">{item.name}</h3>
             <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">{item.desc}</p>
             <button 
              onClick={() => handleConnectClick(item.name)}
              className={`mt-auto w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${isSyncing === item.name ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl'}`}
             >
                {isSyncing === item.name ? 'Linking...' : 'Connect Now'}
             </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isAuthenticated) return <LoginView onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed inset-y-0 z-50 shadow-2xl">
        <div className="p-10 flex items-center space-x-4">
           <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-600/20"><BrainCircuit className="w-7 h-7" /></div>
           <span className="text-xl font-black tracking-tighter">OptiStock</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'inventory', icon: Package, label: 'My Stock' },
            { id: 'forecasting', icon: TrendingUp, label: 'Demand Plan' },
            { id: 'suppliers', icon: UserCheck, label: 'Suppliers' },
            { id: 'connect', icon: LinkIcon, label: 'Direct Connect' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => { setCurrentView(item.id as any); }} 
              className={`flex items-center space-x-4 w-full p-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${currentView === item.id ? 'bg-white/10 text-white border border-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5 space-y-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <img src={userProfile.avatar} className="w-10 h-10 rounded-xl" />
               <div className="overflow-hidden">
                 <p className="text-xs font-black truncate">{userProfile.name}</p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase truncate">Lead Operative</p>
               </div>
             </div>
             <button onClick={() => setIsAuthenticated(false)} className="p-2 text-slate-600 hover:text-rose-400">
                <ArrowDownRight className="w-4 h-4 rotate-45" />
             </button>
           </div>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto relative">
        <header className="flex justify-end items-center gap-6 mb-12">
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input type="text" placeholder="Search SKU or Item..." className="bg-transparent border-none outline-none text-xs font-bold text-slate-900 w-48" />
          </div>
          
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotificationPanel(!showNotificationPanel)} className="relative p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
               <Bell className="w-5 h-5 text-slate-600" />
               {notifications.length > 0 && <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />}
            </button>

            {showNotificationPanel && (
              <div className="absolute top-16 right-0 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Feed</h3>
                  <button onClick={() => setNotifications([])} className="text-[10px] font-black text-rose-500 uppercase">Clear All</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-6 border-b border-slate-50 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                          n.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' : 
                          n.type === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {n.type === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black text-slate-900 mb-1">{n.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest font-black">No Pending Notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'inventory' && renderInventoryView()}
        {currentView === 'suppliers' && (
          <div className="space-y-10 pb-24 animate-in fade-in duration-500">
             <ViewTitleHeader title="Supplier Management" subtitle="Manage procurement channels and automated supplier integrations." />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {MOCK_SUPPLIERS.map(sup => (
                  <div key={sup.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all flex flex-col">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                           <UserCheck className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                           <Sparkle className="w-3 h-3 fill-current" /> {sup.rating}
                        </div>
                     </div>
                     <h3 className="text-lg font-black text-slate-900 mb-1">{sup.name}</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{sup.category} Partner</p>
                     <div className="mt-auto pt-6 border-t border-slate-50 flex gap-3">
                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 transition-all">Order Log</button>
                        <button 
                          onClick={() => triggerWhatsAppPO({ name: 'Stock Request', supplier: sup } as any)}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                           <MessageCircle className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
        {currentView === 'forecasting' && (
           <div className="space-y-10 pb-24 animate-in fade-in duration-500">
             <ViewTitleHeader title="AI Demand Projections" subtitle="Predictive analysis and market trend visualization." />
             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm h-[600px]">
                <ForecastChart selectedProduct={null} />
             </div>
           </div>
        )}
        {currentView === 'connect' && renderConnectView()}
      </main>

      {isModalOpen && selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onNotification={addNotification}
          onWhatsApp={triggerWhatsAppPO}
          onClose={() => setIsModalOpen(false)} 
          onUpdate={(p) => setProducts(prev => prev.map(item => item.id === p.id ? p : item))} 
        />
      )}

      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setIsTransferModalOpen(false)} />
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl relative z-10 p-12 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Inter-Hub Stock Transfer</h2>
            <form onSubmit={handleStockTransfer} className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Item</label>
                  <select 
                    required value={selectedTransferProduct} onChange={(e) => setSelectedTransferProduct(e.target.value)}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                     <option value="">Select an asset...</option>
                     {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.location})</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Hub</label>
                    <select 
                      value={transferTo} onChange={(e) => setTransferTo(e.target.value as any)}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                       <option value="South">South Hub</option>
                       <option value="East">East Hub</option>
                       <option value="West">West Hub</option>
                       <option value="North">North Hub</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                    <input 
                      type="number" required placeholder="0" value={transferAmount} onChange={(e) => setTransferAmount(parseInt(e.target.value))}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
               </div>
               <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4">
                  <Truck className="w-5 h-5" /> Dispatch Relocation Relay
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-emerald-600/20 blur-[120px] rounded-full" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-6 bg-indigo-600 rounded-[2.5rem] shadow-2xl mb-8 border border-white/10">
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">OptiStock AI</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Advanced Business Intelligence</p>
        </div>
        <div className="bg-slate-900 border border-white/10 p-12 rounded-[4rem] shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => { setLoading(true); setTimeout(onLogin, 1000); }} 
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Fingerprint className="w-7 h-7" /><span>Initiate Session</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal = ({ product, onClose, onNotification, onWhatsApp, onUpdate }: { product: Product; onClose: () => void; onNotification: (t: string, m: string, ty: AppNotification['type']) => void; onWhatsApp: (p: Product) => void; onUpdate: (p: Product) => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'supplier'>('overview');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[4rem] w-full max-w-5xl shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all text-slate-500 z-20"><X className="w-5 h-5" /></button>
        <div className="w-full md:w-2/5 bg-slate-100 h-64 md:h-auto shrink-0 relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            </div>
          )}
        </div>
        <div className="flex-1 p-12 md:p-16 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="mb-8">
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 block px-3 py-1 bg-indigo-50 rounded-lg w-fit">{product.category}</span>
             <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{product.name}</h2>
          </div>

          <div className="flex gap-4 border-b border-slate-100 mb-8">
             <button onClick={() => setActiveTab('overview')} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Inventory Profile</button>
             <button onClick={() => setActiveTab('supplier')} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'supplier' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Supplier & Order</button>
          </div>

          {activeTab === 'overview' ? (
             <div className="space-y-8 flex-1">
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Unit Price</p>
                    <p className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Warehouse Hub</p>
                    <p className="text-3xl font-black text-slate-900">{product.location} Region</p>
                  </div>
                </div>
                <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                   <p className="text-[10px] font-black text-indigo-600 uppercase mb-4 tracking-widest">Current Stock Status</p>
                   <p className="text-5xl font-black text-slate-900">{product.currentStock} Units</p>
                </div>
             </div>
          ) : (
            <div className="space-y-8 flex-1">
               <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">{product.supplier?.name}</h4>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-xs font-black text-slate-800">{product.supplier?.contact}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Partner Rating</p>
                        <p className="text-xs font-black text-slate-800">{product.supplier?.rating}/5.0</p>
                     </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Procurement Channels:</p>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => onWhatsApp(product)}
                        className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 flex items-center justify-center gap-3 font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" /> WhatsApp PO
                     </button>
                     <button 
                        onClick={() => onNotification('PO Sent', `Email order for ${product.name} sent.`, 'success')}
                        className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100 flex items-center justify-center gap-3 font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all">
                        <Send className="w-5 h-5" /> Email Direct
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
