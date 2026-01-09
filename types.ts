
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  category: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  leadTime: number; // in days
  historicalSales: SalesData[];
  location: 'North' | 'South' | 'East' | 'West';
  imageUrl?: string;
  supplier?: Supplier;
}

export interface SalesData {
  date: string;
  quantity: number;
}

export interface ForecastResult {
  date: string;
  predicted: number;
  actual?: number;
}

export interface InventoryInsight {
  id: string;
  type: 'understock' | 'overstock' | 'rebalance';
  productName: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  action: string;
}

export interface MarketFactor {
  name: string;
  impact: number; // -1 to 1
  description: string;
}