import React, { useState } from 'react';
import { Home, CreditCard, MessageSquare, History, Menu, Bell, Moon, Sun, ArrowLeft, ArrowUpRight, ShoppingBasket, AlertTriangle, ChevronRight, Zap, Sparkles } from 'lucide-react';

// --- TYPES SECTION ---
export enum AppTab {
  LOGIN, DASHBOARD, WALLET, HISTORY, GROCERY_LIST, ASSISTANT, STORE_VIEW, BUY, LINK_CARD, PROFILE, MERCHANT_TERMINAL
}
export interface User { id: string; name: string; memberId: string; miCoinBalance: number; totalSaved: number; roundUpTarget: number; isAutoSaveEnabled: boolean; isSaveAllChangeEnabled: boolean; }
export interface Product { id: string; name: string; price: number; oldPrice?: number; inStock: boolean; category: string; image: string; carditoeCashback?: number; storeCashback?: number; isCarditoeOriginal?: boolean; promoDescription?: string; discount?: string; }
export interface Store { id: string; name: string; type: string; color: string; logo: string; isLinked: boolean; loyaltyPoints: number; pointsExpiring?: number; notificationCount: number; tabAlerts: any; promos: Product[]; inventory: Product[]; branches: any[]; }
export interface Transaction { id: string; storeId: string; store: string; amount: number; roundedAmount?: number; savings: number; date: string; category: string; items?: string[]; type: 'ROUND_UP' | 'CASHOUT' | 'DEPOSIT'; receiptData?: any; }
export interface ShoppingListItem extends Product { storeId: string; storeName: string; quantity: number; }
export interface SavedList { id: string; name: string; date: string; items: ShoppingListItem[]; total: number; totalSavings: number; }
import { Home, CreditCard, MessageSquare, History, Menu, Bell, Moon, Sun, ArrowLeft, ArrowUpRight, ShoppingBasket, AlertTriangle, ChevronRight, Zap, Sparkles } from 'lucide-react';


const MOCK_USER: User = {
  id: "user_123",
  name: "Thabo Moloi",
  memberId: "8842 1102 9938",
  miCoinBalance: 245.80,
  totalSaved: 1250.45,
  roundUpTarget: 1, 
  isAutoSaveEnabled: true,
  isSaveAllChangeEnabled: false,
};

// Global CarditOe Promotions - These appear in ALL stores
export const CARDITOE_GLOBAL_PROMOS: Product[] = [
  { 
    id: 'ct_1', 
    name: 'CarditOe Original: Albany Bread', 
    price: 18.50, 
    inStock: true, 
    category: 'CarditOe Original', 
    image: '🍞', 
    cashbackAmount: 2.00,
    isCarditoeOriginal: true,
    promoDescription: "Get R2.00 back to MiCOINBANK on every loaf" 
  },
  { 
    id: 'ct_2', 
    name: 'CarditOe Original: Fresh Milk 2L', 
    price: 29.99, 
    inStock: true, 
    category: 'CarditOe Original', 
    image: '🥛', 
    cashbackAmount: 1.50,
    isCarditoeOriginal: true,
    promoDescription: "Get R1.50 back to MiCOINBANK" 
  },
  { 
    id: 'ct_3', 
    name: 'CarditOe Original: Eggs 18s', 
    price: 54.00, 
    inStock: true, 
    category: 'CarditOe Original', 
    image: '🥚', 
    cashbackAmount: 3.00,
    isCarditoeOriginal: true,
    promoDescription: "Get R3.00 back to MiCOINBANK" 
  }
];

const INITIAL_STORES: Store[] = [
    {
        id: 'picknpay',
        name: 'Pick n Pay',
        type: 'RETAIL',
        color: '#003f7f',
        logo: '🅿️',
        isLinked: true,
        loyaltyPoints: 1240,
        pointsExpiring: 150,
        notificationCount: 3, 
        tabAlerts: { shop: 0, slips: 1, promos: 1, loyalty: 1 },
        promos: [
            { id: 'p1', name: 'Nescafe Gold 200g', price: 120.00, oldPrice: 150.00, inStock: true, category: 'Groceries', image: '☕', storeCashback: 15.00, discount: '20% OFF' },
            { id: 'p2', name: 'Albany Superior Bread', price: 18.00, oldPrice: 22.00, inStock: true, category: 'Groceries', image: '🍞', carditoeCashback: 2.00, storeCashback: 1.00 }
        ],
        inventory: [
             { id: 'i1', name: 'Full Cream Milk 2L', price: 29.99, inStock: true, category: 'Dairy', image: '🥛', carditoeCashback: 1.50 },
             { id: 'i2', name: 'Coca Coke 2L', price: 24.00, inStock: false, category: 'Beverages', image: '🥤', discount: 'R5 OFF' },
             { id: 'i3', name: 'Avocados (Bag)', price: 45.00, inStock: true, category: 'Produce', image: '🥑', storeCashback: 5.00 },
             { id: 'i4', name: 'White Sugar 2kg', price: 38.50, inStock: false, category: 'Groceries', image: '🧂' }
        ],
        branches: [
            { id: 'pnp_middelburg_mall', name: 'Middelburg Mall', province: 'Mpumalanga', city: 'Middelburg', address: 'Fontein St', mallName: 'Middelburg Mall', distance: '1.2 km', isOpen: true, openingHours: '08:00 - 19:00', inventoryIds: ['i1', 'i2', 'i4'] },
            { id: 'pnp_middelburg_cbd', name: 'Middelburg CBD', province: 'Mpumalanga', city: 'Middelburg', address: 'Long St', distance: '3.5 km', isOpen: true, openingHours: '07:30 - 18:00', inventoryIds: ['i1', 'i3'] },
            { id: 'pnp_durban_west', name: 'Durban Workshop', province: 'KwaZulu-Natal', city: 'Durban', address: 'Workshop Shopping Centre', mallName: 'The Workshop', distance: '0.8 km', isOpen: true, openingHours: '08:00 - 20:00', inventoryIds: ['i1', 'i2', 'i3', 'i4'] },
            { id: 'pnp_durban_gateway', name: 'Gateway Mall', province: 'KwaZulu-Natal', city: 'Durban', address: 'Gateway Theatre of Shopping', mallName: 'Gateway Mall', distance: '15 km', isOpen: true, openingHours: '09:00 - 21:00', inventoryIds: ['i1', 'i2', 'i4'] }
        ]
    },
    {
        id: 'shoprite',
        name: 'Shoprite',
        type: 'RETAIL',
        color: '#e53935',
        logo: '🛒',
        isLinked: false,
        loyaltyPoints: 0,
        notificationCount: 0,
        tabAlerts: { shop: 0, slips: 0, promos: 0, loyalty: 0 },
        promos: [
            { id: 's_p1', name: 'Omo Washing Powder 2kg', price: 89.99, oldPrice: 110.00, inStock: true, category: 'Cleaning', image: '🧺', storeCashback: 10.00, discount: 'R20 OFF' },
            { id: 's_p2', name: 'Full Cream Milk 2L', price: 26.99, oldPrice: 32.00, inStock: true, category: 'Dairy', image: '🥛', carditoeCashback: 1.50 }
        ],
        inventory: [
            { id: 's1', name: 'Sunlight Liquid', price: 25.00, inStock: true, category: 'Cleaning', image: '🧴', carditoeCashback: 1.50 },
            { id: 's2', name: 'Albany Superior Bread', price: 17.50, inStock: true, category: 'Groceries', image: '🍞', carditoeCashback: 2.00, isCarditoeOriginal: true }
        ],
        branches: [
            { id: 'sr_middelburg_mall', name: 'Middelburg Mall', province: 'Mpumalanga', city: 'Middelburg', address: 'Corner Fontein & Dr Beyers Naude', mallName: 'Middelburg Mall', distance: '1.4 km', isOpen: true, openingHours: '08:00 - 19:00', inventoryIds: ['s1', 's_p2'] },
            { id: 'sr_middelburg_cbd', name: 'Middelburg CBD', province: 'Mpumalanga', city: 'Middelburg', address: 'Long St', distance: '3.8 km', isOpen: true, openingHours: '07:30 - 18:00', inventoryIds: ['s1', 's2'] },
            { id: 'sr_durban_cbd', name: 'Durban CBD', province: 'KwaZulu-Natal', city: 'Durban', address: 'Dr Pixley KaSeme St', distance: '1.1 km', isOpen: true, openingHours: '07:00 - 19:00', inventoryIds: ['s1', 's2', 's_p2'] },
            { id: 'sr_durban_pavilion', name: 'Pavilion Mall', province: 'KwaZulu-Natal', city: 'Durban', address: 'The Pavilion Shopping Centre', mallName: 'Pavilion Mall', distance: '8.5 km', isOpen: true, openingHours: '09:00 - 21:00', inventoryIds: ['s1', 's_p2'] }
        ]
    },
    {
        id: 'clicks',
        name: 'Clicks',
        type: 'RETAIL',
        color: '#005ca8',
        logo: '💊',
        isLinked: true,
        loyaltyPoints: 540,
        pointsExpiring: 45,
        notificationCount: 2, 
        tabAlerts: { shop: 0, slips: 0, promos: 1, loyalty: 1 },
        promos: [
            { id: 'c1', name: 'Vitamin C Boost', price: 80.00, oldPrice: 110.00, inStock: true, category: 'Health', image: '🍊', storeCashback: 5.00, discount: '3 FOR 2' }
        ],
        inventory: [
             { id: 'c2', name: 'Nivea Lotion', price: 65.00, inStock: true, category: 'Body', image: '🧴', storeCashback: 3.00 },
             { id: 'c3', name: 'Coca Coke 2L', price: 26.50, inStock: true, category: 'Beverages', image: '🥤', discount: 'R3 OFF' },
        ],
        branches: [
            { id: 'cl_middelburg_mall', name: 'Middelburg Mall', province: 'Mpumalanga', city: 'Middelburg', address: 'Fontein St', mallName: 'Middelburg Mall', distance: '1.2 km', isOpen: true, openingHours: '09:00 - 19:00', inventoryIds: ['c2'] },
            { id: 'cl_durban_musgrave', name: 'Musgrave Centre', province: 'KwaZulu-Natal', city: 'Durban', address: 'Musgrave Rd', mallName: 'Musgrave Centre', distance: '4.2 km', isOpen: true, openingHours: '09:00 - 18:00', inventoryIds: ['c2', 'c3'] }
        ]
    }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
      id: '4', 
      storeId: 'picknpay', 
      store: 'Pick n Pay', 
      amount: 203.75, 
      roundedAmount: 204.00, 
      savings: 0.25, 
      date: '19 Oct', 
      category: 'Groceries', 
      items: ['Chicken', 'Vegetables', 'Rice'], 
      type: 'ROUND_UP',
      receiptData: {
          merchantName: "PICK N PAY CAMPUS SQUARE",
          address: ["Corner Kingsway & University Road", "Auckland Park, 2092"],
          vatNo: "4000123456",
          tel: "011 482 1234",
          cashier: "S. KHUMALO",
          date: "2023/10/19",
          time: "14:30:22",
          barcode: "8809222123001",
          tender: "CASH",
          change: 6.00,
          items: [
              { description: "PNP FRESH CHICKEN 1.2KG", quantity: 1, price: 89.99, total: 89.99 },
              { description: "FRESH VEG COMBO", quantity: 1, price: 45.00, total: 45.00, isPromo: true }, 
              { description: "TASTIC RICE 2KG", quantity: 1, price: 38.00, total: 38.00 },
              { description: "COKE 2L", quantity: 1, price: 24.00, total: 24.00 },
              { description: "PLASTIC BAG 24L", quantity: 2, price: 0.80, total: 1.60 },
              { description: "MiCOINBANK ROUND-UP", quantity: 1, price: 0.25, total: 0.25, isPromo: true, promoDescription: "Saved to Wallet" }
          ],
          subtotal: 177.17,
          vat: 26.58,
          total: 204.00
      }
  }
];
// --- PLACEHOLDER COMPONENTS ---
const Login = ({ onLogin }: any) => <div className="p-10 text-center"><button onClick={onLogin} className="bg-brand-600 text-white p-4 rounded-xl">Login to CarditOe'</button></div>;
const Dashboard = ({ user, onStoreClick }: any) => <div className="p-5"><h1>Welcome, {user.name}</h1><p>Your Balance: R{user.miCoinBalance}</p><button onClick={() => onStoreClick(INITIAL_STORES[0])} className="mt-4 p-4 bg-white border rounded-xl">View Pick n Pay</button></div>;
const WalletView = () => <div className="p-5">Wallet Details Coming Soon</div>;
const StoreDetail = ({ store, onBack }: any) => <div className="p-5"><button onClick={onBack}>Back</button><h1>{store.name} Inventory</h1>{store.inventory.map((i: any) => <div key={i.id}>{i.name} - R{i.price}</div>)}</div>;
const GroceryAssistant = () => <div className="p-5">Smart Grocery List & Budgeting Engine</div>;
const ReceiptAssistant = () => <div className="p-5">Receipt Scanning Assistant</div>;
const ProfileView = () => <div className="p-5">User Profile</div>;
const DigitalReceipt = () => <div className="p-5">Digital Slip</div>;
const LinkPhysicalCard = () => <div className="p-5">Link Store Card</div>;
const BuyStore = () => <div className="p-5">Buy Items</div>;
const MerchantTerminal = () => <div className="p-5">Merchant Terminal</div>;
const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStoreTab, setSelectedStoreTab] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [showBalance, setShowBalance] = useState(true);
  const [viewingReceipt, setViewingReceipt] = useState<Transaction | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleStoreClick = (store: Store, tab?: string) => {
    setSelectedStore(store);
    setSelectedStoreTab(tab);
    setActiveTab(AppTab.STORE_VIEW);
  };

  const handleGoBack = () => {
    setActiveTab(AppTab.DASHBOARD);
    setSelectedStore(null);
    setSelectedStoreTab(undefined);
    setShowNotifications(false);
  };

  const handleBackFromStore = () => {
    setSelectedStore(null);
    setSelectedStoreTab(undefined);
    setActiveTab(AppTab.DASHBOARD);
  };

  const totalNotifications = stores.reduce((acc, s) => acc + s.notificationCount, 0) + CARDITOE_GLOBAL_PROMOS.length;

  const renderNotifications = () => (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in slide-in-from-right-10 duration-300">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <button onClick={() => setShowNotifications(false)} className="p-2 -ml-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
              {/* CarditOe GLOBAL PROMOS - Always show these first */}
              <div className="space-y-3">
                  <div className="flex items-center space-x-2 px-1">
                      <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">CarditOe Originals</span>
                  </div>
                  {CARDITOE_GLOBAL_PROMOS.map(promo => (
                      <div key={promo.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-brand-100 dark:border-brand-900/30 flex items-start space-x-3 shadow-sm">
                          <div className="bg-brand-500 p-2.5 rounded-xl text-white shadow-lg shadow-brand-500/20">
                              <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{promo.name}</p>
                                  <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">NEW</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{promo.promoDescription}</p>
                          </div>
                      </div>
                  ))}
              </div>

              {/* STORE SPECIFIC ALERTS */}
              {stores.filter(s => s.isLinked && s.notificationCount > 0).map(store => (
                  <div key={store.id} className="space-y-3">
                      <div className="flex items-center space-x-2 px-1">
                          <span className="text-xs">{store.logo}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{store.name} Updates</span>
                      </div>
                      {store.pointsExpiring && (
                          <div onClick={() => { handleStoreClick(store, 'LOYALTY'); setShowNotifications(false); }} className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start space-x-3 cursor-pointer active:scale-95 transition-transform">
                              <div className="bg-amber-500 p-2 rounded-xl text-white"><AlertTriangle className="w-5 h-5" /></div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Savings Expiring!</p>
                                  <p className="text-[11px] text-amber-700 dark:text-amber-400">R {(store.pointsExpiring/100).toFixed(2)} in cashback will vanish soon.</p>
                              </div>
                          </div>
                      )}
                      {store.tabAlerts.promos > 0 && (
                          <div onClick={() => { handleStoreClick(store, 'PROMOS'); setShowNotifications(false); }} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start space-x-3 cursor-pointer active:scale-95 transition-transform shadow-sm">
                              <div className="bg-brand-500 p-2 rounded-xl text-white"><Zap className="w-5 h-5" /></div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">New Store Cashback</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Check out local deals at {store.name}.</p>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderContent = () => {
    if (showNotifications) return renderNotifications();
    switch (activeTab) {
      case AppTab.LOGIN: return <Login onLogin={() => setActiveTab(AppTab.DASHBOARD)} />;
      case AppTab.DASHBOARD: return <Dashboard user={user} recentTransactions={transactions} stores={stores} onStoreClick={handleStoreClick} onAddCard={() => setActiveTab(AppTab.LINK_CARD)} showBalance={showBalance} onToggleBalance={() => setShowBalance(!showBalance)} onViewReceipt={(tx) => setViewingReceipt(tx)} onHowItWorks={() => setActiveTab(AppTab.WALLET)} />;
      case AppTab.STORE_VIEW: return selectedStore ? <StoreDetail store={selectedStore} initialTab={selectedStoreTab as any} transactions={transactions} onBack={handleBackFromStore} onUpdateStore={(s) => setStores(stores.map(x => x.id === s.id ? s : x))} onViewReceipt={(tx) => setViewingReceipt(tx)} /> : null;
      case AppTab.WALLET: return <WalletView 
        user={user} 
        transactions={transactions} 
        stores={stores} 
        onUpdateSettings={(t) => setUser({...user, roundUpTarget: t})} 
        onToggleAutoSave={() => setUser({...user, isAutoSaveEnabled: !user.isAutoSaveEnabled})} 
        onToggleSaveAllChange={() => setUser({...user, isSaveAllChangeEnabled: !user.isSaveAllChangeEnabled})} 
        onUpdateBalance={(a) => setUser({...user, miCoinBalance: user.miCoinBalance + a})} 
        onAddTransaction={(tx) => setTransactions([tx, ...transactions])} 
        onBack={handleGoBack} 
        onOpenBuy={() => setActiveTab(AppTab.BUY)} 
        onOpenLinkCard={() => setActiveTab(AppTab.LINK_CARD)} 
        onViewReceipt={(tx) => setViewingReceipt(tx)} 
      />;
      case AppTab.HISTORY: return <div className="p-5 pb-24"><h2 className="text-xl font-bold mb-4">Activity History</h2>{transactions.map(tx => <div key={tx.id} className="p-4 bg-white mb-2 rounded-xl border flex justify-between items-center cursor-pointer hover:bg-slate-50" onClick={() => tx.receiptData && setViewingReceipt(tx)}><div className="flex-1"><div><span className="font-bold">{tx.store}</span><span className="text-[10px] text-slate-400 ml-2 uppercase font-black">{tx.type}</span></div><div className="text-xs text-slate-500">{tx.date}</div></div><div className="font-black">R {tx.savings.toFixed(2)}</div></div>)}</div>;
      case AppTab.GROCERY_LIST: return <GroceryAssistant stores={stores} shoppingList={shoppingList} savedLists={savedLists} onAddItem={(i) => setShoppingList([...shoppingList, i])} onRemoveItem={(id, sid) => setShoppingList(shoppingList.filter(x => !(x.id === id && x.storeId === sid)))} onUpdateQuantity={(id, sid, d) => setShoppingList(shoppingList.map(x => (x.id === id && x.storeId === sid) ? {...x, quantity: Math.max(1, x.quantity + d)} : x))} onSaveList={(n) => setSavedLists([...savedLists, {id: Date.now().toString(), name: n, date: 'Today', items: [...shoppingList], total: 0, totalSavings: 0}])} onLoadList={(l) => setShoppingList(l.items)} onDeleteList={(id) => setSavedLists(savedLists.filter(x => x.id !== id))} />;
      case AppTab.ASSISTANT: return <ReceiptAssistant stores={stores} onBack={handleGoBack} onAddTransaction={(tx) => setTransactions([tx, ...transactions])} onUpdateBalance={(a) => setUser({...user, miCoinBalance: user.miCoinBalance + a})} />;
      case AppTab.BUY: return <BuyStore user={user} onBack={handleGoBack} onUpdateBalance={(a) => setUser({...user, miCoinBalance: user.miCoinBalance + a})} onAddTransaction={(tx) => setTransactions([tx, ...transactions])} />;
      case AppTab.LINK_CARD: return <LinkPhysicalCard onBack={handleGoBack} onSuccess={(num) => { setUser({...user, memberId: num}); handleGoBack(); }} />;
      case AppTab.PROFILE: return <ProfileView user={user} onLogout={() => setActiveTab(AppTab.LOGIN)} onBack={handleGoBack} onOpenMerchant={() => setActiveTab(AppTab.MERCHANT_TERMINAL)} />;
      case AppTab.MERCHANT_TERMINAL: return <MerchantTerminal merchantStore={stores[0]} onBack={handleGoBack} onProcessCashout={(amount, memberId) => {
        // Plug-and-play logic: update user balance and add transaction
        setUser(prev => ({ ...prev, miCoinBalance: prev.miCoinBalance - amount }));
        const tx: Transaction = {
          id: `payout_${Date.now()}`,
          store: stores[0].name,
          storeId: stores[0].id,
          amount: 0,
          savings: amount,
          date: 'Today',
          category: 'Cashout',
          type: 'CASHOUT'
        };
        setTransactions([tx, ...transactions]);
      }} />;
      default: return <Dashboard user={user} recentTransactions={transactions} stores={stores} onStoreClick={handleStoreClick} onAddCard={() => setActiveTab(AppTab.LINK_CARD)} showBalance={showBalance} onToggleBalance={() => setShowBalance(!showBalance)} onViewReceipt={(tx) => setViewingReceipt(tx)} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex justify-center">
        <div className="w-full max-w-lg bg-gray-50 dark:bg-slate-900 min-h-screen relative flex flex-col">
          {viewingReceipt && viewingReceipt.receiptData && <DigitalReceipt data={viewingReceipt.receiptData} store={stores.find(s => s.id === viewingReceipt.storeId) || { name: viewingReceipt.store, color: '#475569', logo: '💳' } as any} onClose={() => setViewingReceipt(null)} />}
          {activeTab !== AppTab.STORE_VIEW && activeTab !== AppTab.LOGIN && (
            <header className="bg-white dark:bg-slate-800 px-5 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b dark:border-slate-700">
              <div className="flex items-center space-x-3">
                {(activeTab !== AppTab.DASHBOARD || showNotifications) && <button onClick={handleGoBack} className="p-2 -ml-2 text-gray-600 dark:text-slate-300"><ArrowLeft className="w-5 h-5" /></button>}
                <div onClick={() => setActiveTab(AppTab.DASHBOARD)} className="text-xl font-black tracking-tighter cursor-pointer"><span>Cardit</span><span className="text-brand-500">Oe'</span></div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={toggleTheme}>{isDarkMode ? <Sun className="w-6 h-6 text-slate-300" /> : <Moon className="w-6 h-6 text-gray-600" />}</button>
                <button onClick={() => setShowNotifications(true)} className="relative">
                    <Bell className="w-6 h-6 text-gray-600 dark:text-slate-300" />
                    {totalNotifications > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-brand-500 text-white text-[8px] font-black rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center animate-bounce">{totalNotifications}</span>}
                </button>
                <button onClick={() => setActiveTab(AppTab.PROFILE)} className="text-gray-600 dark:text-slate-300"><Menu className="w-6 h-6" /></button>
              </div>
            </header>
          )}
          <main className="flex-1 overflow-y-auto">{renderContent()}</main>
          {activeTab !== AppTab.STORE_VIEW && activeTab !== AppTab.LOGIN && (
            <nav className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 fixed bottom-0 w-full max-w-lg h-16 z-30 flex justify-around items-center">
                <button onClick={() => { setActiveTab(AppTab.DASHBOARD); setShowNotifications(false); }} className={`flex-1 flex flex-col items-center ${activeTab === AppTab.DASHBOARD && !showNotifications ? 'text-brand-600' : 'text-gray-400'}`}><Home className="w-6 h-6" /><span className="text-[10px]">Home</span></button>
                <button onClick={() => setActiveTab(AppTab.WALLET)} className={`flex-1 flex flex-col items-center ${activeTab === AppTab.WALLET ? 'text-brand-600' : 'text-gray-400'}`}><CreditCard className="w-6 h-6" /><span className="text-[10px]">Wallet</span></button>
                <div className="relative -top-6"><button onClick={() => setActiveTab(AppTab.ASSISTANT)} className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg border-4 border-gray-50 dark:border-slate-900"><MessageSquare className="w-6 h-6" /></button></div>
                <button onClick={() => setActiveTab(AppTab.GROCERY_LIST)} className={`flex-1 flex flex-col items-center ${activeTab === AppTab.GROCERY_LIST ? 'text-brand-600' : 'text-gray-400'}`}><ShoppingBasket className="w-6 h-6" /><span className="text-[10px]">List</span></button>
                <button onClick={() => setActiveTab(AppTab.HISTORY)} className={`flex-1 flex flex-col items-center ${activeTab === AppTab.HISTORY ? 'text-brand-600' : 'text-gray-400'}`}><History className="w-6 h-6" /><span className="text-[10px]">History</span></button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
