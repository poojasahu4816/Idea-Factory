
import { Product, MarketFactor, Supplier } from './types';

const generateSales = (base: number, volatility: number) => 
  Array.from({ length: 30 }, (_, i) => ({
    date: `2024-02-${String(i + 1).padStart(2, '0')}`,
    quantity: Math.max(0, Math.floor(base + (Math.random() - 0.5) * volatility))
  }));

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Global Tech Distribution', contact: '+91 9876543210', email: 'sales@globaltech.com', category: 'Electronics', rating: 4.8 },
  { id: 'sup2', name: 'Premium Mobiles North', contact: '+91 8887776665', email: 'b2b@premium.in', category: 'Mobile', rating: 4.5 },
  { id: 'sup3', name: 'Gadget Wholesale Hub', contact: '+91 7776665554', email: 'orders@gadgethub.com', category: 'Accessories', rating: 4.9 },
  { id: 'sup4', name: 'Digital Solutions Ent', contact: '+91 6665554443', email: 'procure@digisol.com', category: 'IT Hardware', rating: 4.2 }
];

export const CATEGORIES_WITH_IMAGES = [
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400', count: 120, desc: 'Phones, Laptops, Gadgets' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400', count: 56, desc: 'Cases, Headphones, Power' },
  { name: 'IT Hardware', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400', count: 34, desc: 'Printers, Routers, Servers' },
  { name: 'Personal Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', count: 15, desc: 'Earbuds, Speakers' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ELEC001',
    name: 'Apple iPhone 15',
    category: 'Electronics',
    currentStock: 120,
    minStock: 40,
    maxStock: 300,
    price: 71999,
    leadTime: 3,
    location: 'North',
    historicalSales: generateSales(25, 10),
    supplier: MOCK_SUPPLIERS[1],
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC002',
    name: 'Samsung Galaxy S23',
    category: 'Electronics',
    currentStock: 95,
    minStock: 30,
    maxStock: 250,
    price: 65999,
    leadTime: 5,
    location: 'South',
    historicalSales: generateSales(20, 8),
    supplier: MOCK_SUPPLIERS[1],
    imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC003',
    name: 'OnePlus 11 5G',
    category: 'Electronics',
    currentStock: 150,
    minStock: 50,
    maxStock: 400,
    price: 50999,
    leadTime: 4,
    location: 'West',
    historicalSales: generateSales(18, 6),
    supplier: MOCK_SUPPLIERS[0],
    imageUrl: 'https://images.unsplash.com/photo-1674482326194-633096b79c3a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC004',
    name: 'Xiaomi Redmi Note 13 Pro',
    category: 'Electronics',
    currentStock: 300,
    minStock: 100,
    maxStock: 800,
    price: 19999,
    leadTime: 7,
    location: 'East',
    historicalSales: generateSales(45, 20),
    supplier: MOCK_SUPPLIERS[0],
    imageUrl: 'https://images.unsplash.com/photo-1695484803914-949437175949?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC006',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Accessories',
    currentStock: 80,
    minStock: 20,
    maxStock: 150,
    price: 26999,
    leadTime: 10,
    location: 'North',
    historicalSales: generateSales(12, 4),
    supplier: MOCK_SUPPLIERS[2],
    imageUrl: 'https://images.unsplash.com/photo-1661347333292-6277e9974278?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC007',
    name: 'Dell Inspiron 15 Laptop',
    category: 'IT Hardware',
    currentStock: 60,
    minStock: 15,
    maxStock: 100,
    price: 53999,
    leadTime: 14,
    location: 'South',
    historicalSales: generateSales(8, 3),
    supplier: MOCK_SUPPLIERS[3],
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ELEC010',
    name: 'Boat Airdopes 441 TWS',
    category: 'Personal Audio',
    currentStock: 500,
    minStock: 150,
    maxStock: 1500,
    price: 2249,
    leadTime: 2,
    location: 'West',
    historicalSales: generateSales(60, 25),
    supplier: MOCK_SUPPLIERS[2],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400'
  }
];

export const MOCK_FACTORS: MarketFactor[] = [
  { name: 'Festival Season: Navratri', impact: 0.8, description: 'Increased demand for electronics and gifts' },
  { name: 'Supply: Microchip Delay', impact: -0.4, description: 'Slight delay in restocking premium mobiles' },
  { name: 'Market: Discount Wars', impact: 0.5, description: 'Competitors increasing ad spend on accessories' }
];
