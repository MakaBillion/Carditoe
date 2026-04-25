import React, { useState } from 'react';
import { Home, CreditCard, MessageSquare, History, Menu, Bell, Moon, Sun, ArrowLeft, ArrowUpRight, ShoppingBasket, AlertTriangle, ChevronRight, Zap, Sparkles } from 'lucide-react';

// --- 1. TYPES (Moved here so Vercel doesn't look for outside files) ---
export enum AppTab { LOGIN, DASHBOARD, WALLET, HISTORY, GROCERY_LIST, ASSISTANT, STORE_VIEW, BUY, LINK_CARD, PROFILE, MERCHANT_TERMINAL }
export interface User { id: string; name: string; memberId: string; miCoinBalance: number; totalSaved: number; roundUpTarget: number; isAutoSaveEnabled: boolean; isSaveAllChangeEnabled: boolean; }
export interface Product { id: string; name: string; price: number; oldPrice?: number; inStock: boolean; category: string; image: string; carditoeCashback?: number; storeCashback?: number; isCarditoeOriginal?: boolean; promoDescription?: string; discount?: string; }
export interface Store { id: string; name: string; type: string; color: string; logo: string; isLinked: boolean; loyaltyPoints: number; pointsExpiring?: number; notificationCount: number; tabAlerts: any; promos: Product[]; inventory: Product[]; branches: any[]; }
export interface Transaction { id: string; storeId: string; store: string; amount: number; roundedAmount?: number; savings: number; date: string; category: string; items?: string[]; type: 'ROUND_UP' | 'CASHOUT' | 'DEPOSIT'; receiptData?: any; }

// --- 2. PLACEHOLDER COMPONENTS (To stop the build errors) ---
const Login = ({ onLogin }: any) => (
  <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-3xl font-black mb-6">Cardit<span className="text-brand-500 text-blue-600">Oe'</span></h1>
    <p className="mb-8 text-slate-500">The miCoinBank™ Engine is almost ready.</p>
    <button onClick={onLogin} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Enter Dashboard</button>
  </div>
);

const Dashboard = ({ user, stores, onStoreClick }: any) => (
  <div className="p-5 space-y-6">
    <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl">
      <p className="text-xs opacity-80 uppercase font-black tracking-widest">miCoinBank Balance</p>
      <h2 className="text-4xl font-black mt-1">R {user.miCoinBalance.toFixed(2)}</h2>
    </div>
    <div className="space-y-4">
      <h3 className="font-black text-lg uppercase tracking-tight">Your Linked Stores</h3>
      {stores.map((store: any) => (
        <div key={store.id} onClick={() => onStoreClick(store)} className="p-4 bg-white rounded-2xl border flex justify-between items-center cursor-pointer shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{store.logo}</span>
            <span className="font-bold">{store.name}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      ))}
    </div>
  </div>
);

const WalletView = () => <div className="p-10 text-center">miCoinBank Savings Engine</div>;
const StoreDetail = ({ store, onBack }: any) => (
  <div className="p-5">
    <button onClick={onBack} className="mb-4 flex items-center text-blue-600 font-bold"><ArrowLeft className="mr-2" /> Back</button>
    <h1 className="text-2xl font-black">{store.name} Inventory</h1>
    <p className="text-slate-500 mb-4">Real-time stock from local branches.</p>
    {store.inventory.map((i: any) => <div key={i.id} className="p-3 border-b flex justify-between"><span>{i.name}</span><strong>R{i.price}</strong></div>)}
  </div>
);
const GroceryAssistant = () => <div className="p-10 text-center">Smart Grocery List & Budgeting</div>;
const ReceiptAssistant = () => <div className="p-10 text-center">Receipt Scanning Assistant</div>;
const ProfileView = () => <div className="p-10 text-center">User Profile Settings</div>;
const DigitalReceipt = () => <div className="p-10 text-center">Digital Slip Preview</div>;
const LinkPhysicalCard = () => <div className="p-10 text-center">Link Your Store Card</div>;
const BuyStore = () => <div className="p-10 text-center">In-Store Shopping</div>;
const MerchantTerminal = () => <div className="p-10 text-center">Merchant Cashout Terminal</div>;

// --- 3. THE DATA (Your original mock data) ---
const MOCK_USER: User = {
  id: "user_123", name: "Thabo Moloi", memberId: "8842 1102 9938", miCoinBalance: 245.80, totalSaved: 1250.45, roundUpTarget: 1, isAutoSaveEnabled: true, isSaveAllChangeEnabled: false,
};

const INITIAL_STORES: Store[] = [
    { id: 'picknpay', name: 'Pick n Pay', type: 'RETAIL', color: '#003f7f', logo: '🅿️', isLinked: true, loyaltyPoints: 1240, pointsExpiring: 150, notificationCount: 3, tabAlerts: {}, promos: [], inventory: [{ id: 'i1', name: 'Full Cream Milk 2L', price: 29.99, inStock: true, category: 'Dairy', image: '🥛' }], branches: [] },
    { id: 'shoprite', name: 'Shoprite', type: 'RETAIL', color: '#e53935', logo: '🛒', isLinked: false, loyaltyPoints: 0, notificationCount: 0, tabAlerts: {}, promos: [], inventory: [{ id: 's2', name: 'Albany Superior Bread', price: 17.50, inStock: true, category: 'Groceries', image: '🍞' }], branches: [] }
];

// --- 4. THE MAIN APP ENGINE ---
const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LOGIN);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    setActiveTab(AppTab.STORE_VIEW);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.LOGIN: return <Login onLogin={() => setActiveTab(AppTab.DASHBOARD)} />;
      case AppTab.DASHBOARD: return <Dashboard user={user} stores={stores} onStoreClick={handleStoreClick} />;
      case AppTab.STORE_VIEW: return <StoreDetail store={selectedStore} onBack={() => setActiveTab(AppTab.DASHBOARD)} />;
      case AppTab.WALLET: return <WalletView />;
      case AppTab.GROCERY_LIST: return <GroceryAssistant />;
      case AppTab.HISTORY: return <div className="p-10">Transaction History</div>;
      default: return <Dashboard user={user} stores={stores} onStoreClick={handleStoreClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen relative flex flex-col shadow-2xl">
        <header className="bg-white px-5 py-4 flex justify-between items-center border-b sticky top-0 z-20">
          <div className="text-xl font-black tracking-tighter">Cardit<span className="text-blue-600">Oe'</span></div>
          <Bell className="w-6 h-6 text-gray-400" />
        </header>
        <main className="flex-1">{renderContent()}</main>
        {activeTab !== AppTab.LOGIN && (
          <nav className="bg-white border-t fixed bottom-0 w-full max-w-lg h-16 z-30 flex justify-around items-center">
            <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="flex flex-col items-center text-blue-600"><Home className="w-6 h-6" /><span className="text-[10px]">Home</span></button>
            <button onClick={() => setActiveTab(AppTab.WALLET)} className="flex flex-col items-center text-gray-400"><CreditCard className="w-6 h-6" /><span className="text-[10px]">Wallet</span></button>
            <button onClick={() => setActiveTab(AppTab.GROCERY_LIST)} className="flex flex-col items-center text-gray-400"><ShoppingBasket className="w-6 h-6" /><span className="text-[10px]">List</span></button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default MainApp;
