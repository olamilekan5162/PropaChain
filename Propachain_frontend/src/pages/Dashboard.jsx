import { Wallet, TrendingUp, Home, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { TransactionCard } from '../components/common/TransactionCard';
import { PropertyCard } from '../components/common/PropertyCard';

// Mock Data
const STATS = [
  { label: 'Total Balance', value: '$24,500', icon: Wallet, change: '+12.5% this month' },
  { label: 'Active Rentals', value: '3', icon: Home, change: '2 expiring soon' },
  { label: 'Total Income', value: '$3,200', icon: TrendingUp, change: '+$450 this week' },
];

const RECENT_TRANSACTIONS = [
  { id: 1, type: 'rent', propertyTitle: 'Eco-Friendly Smart Home', amount: 1200, date: 'Mar 12, 2025', status: 'completed' },
  { id: 2, type: 'buy', propertyTitle: 'Luxury Penthouse', amount: 35000, date: 'Mar 10, 2025', status: 'pending' },
  { id: 3, type: 'income', propertyTitle: 'Beachfront Villa', amount: 2800, date: 'Mar 08, 2025', status: 'completed' },
];

const MY_PROPERTIES = [
  {
    id: 2,
    title: "Modern Beachfront Villa",
    location: "Coastal Bay, Sunshine State",
    price: 2800000,
    image: "https://images.unsplash.com/photo-1600596542815-6000255adeba?auto=format&fit=crop&q=80&w=800",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: 'Rented'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back, User! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Properties */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">My Properties</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {MY_PROPERTIES.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer group min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-primary transition-colors">
                  <ArrowUpRight />
                </div>
                <p className="font-medium text-slate-600 hover:text-primary">Add New Property</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Recent Transactions */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs">See All</Button>
            </div>
            <div className="space-y-4">
              {RECENT_TRANSACTIONS.map(tx => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
