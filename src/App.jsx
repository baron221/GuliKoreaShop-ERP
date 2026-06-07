import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Suppliers from './pages/Suppliers';

// Helper to load from localStorage or fallback
const getInitialState = (key, fallback) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage for ' + key, e);
    }
  }
  return fallback;
};

// Initial Mock Data (used if localStorage is empty)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'COSRX Snail 96 Essence',
    category: 'Zardoblar',
    specs: '100ml',
    stock: 450,
    priceInKRW: 11500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoR_qSPQHsgesJN6Slf85LMPt39c4neAgI_UT6Vu4GFLFOkt5uZn9Q6uEDKslpVewB69YNzN-EzXq5ibTIFlJKS4T6UIBi8rMCi3HLA0l5G5aQg-ghR_cvAAILM65FZnhVik2XhUNMCnEUdX2vnTN6cjUcc32NYOuz4Ot8_HxG8YiuX_veXL3jO69DapINXvSglHr5H64J9VI1UiLrOvMrQqlCG7idTaqDNEoj7ifi2wodU_6SRQ7-0-U5yVqT1rIzIVCtG7IZFRY'
  },
  {
    id: 2,
    name: 'Beauty of Joseon Sun SPF50',
    category: 'Terini parvarish qilish',
    specs: '50ml',
    stock: 620,
    priceInKRW: 8200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxp9HitaTKq-gHWN-3m0-VfvtwB7sKI_ONLUezmg_wBb1C92cAvW0soD6qZ1aw1YHNk3hBJWdKT5Hwpo7T7COQjPsAFrDUCsvCYNS_GdRMyghHUUgEgvZ4dOH5JjBvDeMPIRDNQjbKLxOrGLUujHrrY8ZSrn9PA7nEMyW8JQgjn-eGAHzM9sWwvmGPZghOn3R608x4ccrnlZYXT6-pO8Ue9K9dLcsOiRPVL1GF9npvSE_4-hhfLrqd8LMz4JsBD_U9iyOtzG5tR_U'
  },
  {
    id: 3,
    name: 'Anua Heartleaf 77% Toner',
    category: 'Terini parvarish qilish',
    specs: '250ml',
    stock: 280,
    priceInKRW: 14000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9O2kX_NyLDACXm8DE34zpgFGxJTtwWgF2tir1IhV_15VALzylvTnm7bq-g_ZJrwy3ko9DhLadQ7BCuy8zU3U9K7ZYNKKtCJXwe_pBe8XPumADow752RjSYQ8VtKJbtdwfGwjFjHpytoZsJXEefGodcwmEfeT8b805FeqHEq4iyfMYIoz9LZbRnP7nO4hn2ihqb1IY-FZ3h3Mn7zpUrdxGd7R7KlxW0f333tbL_7JqZDUKr9Yk1UnCuNotCFH0BcW-9G-CTZblhvU'
  },
  {
    id: 4,
    name: 'Laneige Lip Mask Berry',
    category: 'Pardoz',
    specs: '20g',
    stock: 150,
    priceInKRW: 6800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCGEYnPBGfK9z4SJBAGXX-DXl5NvnN2WeW2dlmOO4lj0o3x-NkM3I6rwu81jKIgys_s0AjOu2F_6vmF8dpzzleviRmrx4lE0PPOkHBG1wwHQs3z_wspP5ecS2jMMobAcSej2LZHdCQOG5yL4hbHnKE6hm5wlgaq1G_pgOVFjPePwBKE-e2sQpFDdAWsneCWeClvL43Ji2wAGfXUG-f5VBoBRiQL6ODpyBpeJUNhy-zTs8amwxJrAbphOSBaL9BhH67cclTe47Lqfs'
  },
  {
    id: 5,
    name: 'Round Lab Birch Juice Cream',
    category: 'Terini parvarish qilish',
    specs: '80ml',
    stock: 110,
    priceInKRW: 13000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxp9HitaTKq-gHWN-3m0-VfvtwB7sKI_ONLUezmg_wBb1C92cAvW0soD6qZ1aw1YHNk3hBJWdKT5Hwpo7T7COQjPsAFrDUCsvCYNS_GdRMyghHUUgEgvZ4dOH5JjBvDeMPIRDNQjbKLxOrGLUujHrrY8ZSrn9PA7nEMyW8JQgjn-eGAHzM9sWwvmGPZghOn3R608x4ccrnlZYXT6-pO8Ue9K9dLcsOiRPVL1GF9npvSE_4-hhfLrqd8LMz4JsBD_U9iyOtzG5tR_U'
  },
  {
    id: 6,
    name: 'Some By Mi AHA-BHA-PHA Toner',
    category: 'Terini parvarish qilish',
    specs: '150ml',
    stock: 85,
    priceInKRW: 10500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9O2kX_NyLDACXm8DE34zpgFGxJTtwWgF2tir1IhV_15VALzylvTnm7bq-g_ZJrwy3ko9DhLadQ7BCuy8zU3U9K7ZYNKKtCJXwe_pBe8XPumADow752RjSYQ8VtKJbtdwfGwjFjHpytoZsJXEefGodcwmEfeT8b805FeqHEq4iyfMYIoz9LZbRnP7nO4hn2ihqb1IY-FZ3h3Mn7zpUrdxGd7R7KlxW0f333tbL_7JqZDUKr9Yk1UnCuNotCFH0BcW-9G-CTZblhvU'
  }
];

const INITIAL_CUSTOMERS = [
  { 
    id: 1, 
    name: '"Beauty Zone" Do\'koni (Toshkent)', 
    phone: '+998 90 998 11 22', 
    totalPurchasedKRW: 6975000, 
    totalPaidKRW: 5500000,
    purchases: [
      { id: 101, productName: 'Beauty of Joseon Sun SPF50', quantity: 200, priceInKRW: 12000, date: '08-Iyun, 2026' },
      { id: 102, productName: 'COSRX Snail 96 Essence', quantity: 100, priceInKRW: 16500, date: '06-Iyun, 2026' },
      { id: 103, productName: 'Anua Heartleaf 77% Toner', quantity: 150, priceInKRW: 19500, date: '02-Iyun, 2026' }
    ]
  },
  { 
    id: 2, 
    name: '"K-Beauty Samarkand" (Reseller)', 
    phone: '+998 93 550 44 55', 
    totalPurchasedKRW: 5010000, 
    totalPaidKRW: 5010000,
    purchases: [
      { id: 201, productName: 'Round Lab Birch Juice Cream', quantity: 120, priceInKRW: 18000, date: '07-Iyun, 2026' },
      { id: 202, productName: 'Laneige Lip Mask Berry', quantity: 300, priceInKRW: 9500, date: '04-Iyun, 2026' }
    ]
  },
  { 
    id: 3, 
    name: '"Glow Store" Abu Saxiy (Ulgurji)', 
    phone: '+998 99 880 77 66', 
    totalPurchasedKRW: 6975000, 
    totalPaidKRW: 4000000,
    purchases: [
      { id: 301, productName: 'COSRX Snail 96 Essence', quantity: 150, priceInKRW: 16500, date: '08-Iyun, 2026' },
      { id: 302, productName: 'Beauty of Joseon Sun SPF50', quantity: 250, priceInKRW: 12000, date: '05-Iyun, 2026' },
      { id: 303, productName: 'Some By Mi AHA-BHA-PHA Toner', quantity: 100, priceInKRW: 15000, date: '28-May, 2026' }
    ]
  },
  { 
    id: 4, 
    name: '"Madina Cosmetics" (Namangan)', 
    phone: '+998 91 330 22 11', 
    totalPurchasedKRW: 3720000, 
    totalPaidKRW: 3000000,
    purchases: [
      { id: 401, productName: 'Anua Heartleaf 77% Toner', quantity: 80, priceInKRW: 19500, date: '07-Iyun, 2026' },
      { id: 402, productName: 'Round Lab Birch Juice Cream', quantity: 120, priceInKRW: 18000, date: '01-Iyun, 2026' }
    ]
  }
];

const INITIAL_SUPPLIERS = [
  {
    id: 1,
    name: 'Cosmax Global (Seoul)',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgZYEha_sAYmv_MznSA0D3KNAD7PpufacxHKaLxrqauAy0nnpB8p3ABKT4FbgFpNchLs46Ib3qXLr51w5oJzj4a5loiJKngOtmSlHF0xsr55aXdtoevdzTLKQqws6AMae_spT8MQeVY3KTG7cz9ZDNjQJHXRDXHaw4adHQ0nMWLScTg3XRaE4s6mTlf4igiHIiujj9T7NU5bUwarBiX8rUNBPvNALlu5dxH0mE3mMjz5oU3sVb2ItPZ4XNG7wIJ9QRL19LbKeJEW0',
    purchases: [
      { id: 1001, productName: 'COSRX Snail 96 Essence', quantity: 500, priceInKRW: 11500, date: '05-Iyun, 2026' },
      { id: 1002, productName: 'Beauty of Joseon Sun SPF50', quantity: 800, priceInKRW: 8200, date: '01-Iyun, 2026' }
    ]
  },
  {
    id: 2,
    name: 'Amorepacific Wholesale',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMmh59zsvUB4l6klP_9zSU5wQfgUOsfy31tLW5qs9kcM6S8m0m-PAhD4Yz9X362dxauiIdW-0k4ZEvkXe3WxYc8yyZn4mkyS-nfV0ka8iTuPk-V0xr25oRX4az5-IkHNlvwdKpwMYuFEghPTiqZat2iuC-N7ftJDa7TVlFianpYMS3aK_vNfjfEL6nWgOnG4uJew59YiWeZ1JcA5l6zQhqrCan_uOysl4zAy5M-nL351-muGHzsWJCx4_nKXrfwjVNEevl2vBHxws',
    purchases: [
      { id: 2001, productName: 'Laneige Lip Mask Berry', quantity: 300, priceInKRW: 6800, date: '03-Iyun, 2026' }
    ]
  },
  {
    id: 3,
    name: 'Anua Brand Distributor',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD197977f4gIQLr_GbA6egMHz-iXPz8rmGTxSx4FdgMkncP6LrkFn75Q4SJ4HMzTZux-wuQSxP3RMaGm82nfguIqNud4j3h4cuLr0Qk-ukh5ytZakmSTVCLA4nC-8H2TSS894eeA9w_Y7zjsvQWwAfbOjlxszM2l-fcqaKeBiepcNas4CMZRdyl13TAQyPUMHzmp_yRDNG2b38e5p_YGFWG2H87IG7aAVjkcaQtHALxIuGU6_2JqOVDMudfo4LP_q-wRG2Q2M92Wcg',
    purchases: [
      { id: 3001, productName: 'Anua Heartleaf 77% Toner', quantity: 400, priceInKRW: 14000, date: '02-Iyun, 2026' }
    ]
  }
];

const INITIAL_ORDERS = [
  { id: '#ORD-20608', item: 'COSRX Snail 96 Essence', units: 150, priceInKRW: 2475000, status: 'Yuborilgan' },
  { id: '#ORD-20607', item: 'Round Lab Birch Juice Cream', units: 120, priceInKRW: 2160000, status: 'Jarayonda' },
  { id: '#ORD-20606', item: 'Beauty of Joseon Sun SPF50', units: 200, priceInKRW: 2400000, status: 'Yetkazildi' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'Ogohlantirish: Some By Mi AHA-BHA-PHA Toner zaxirasi kam qoldi (85 dona qoldi)', read: false, time: '10 daqiqa avval' },
  { id: 2, text: 'Buyurtma #ORD-20608 mijozga yuborildi: 150 dona COSRX Snail 96 Essence', read: true, time: '2 soat avval' },
  { id: 3, text: 'Koreyadan yangi konteyner yetib keldi: Bojxona rasmiylashtiruvi yakunlandi', read: true, time: '1 kun avval' }
];

const INITIAL_EXPENSES = [
  { id: 1, category: 'Logistika', amountKRW: 150000, description: 'Konteyner bojlari va bojxona to\'lovlari', date: '08-Iyun, 2026' },
  { id: 2, category: 'Ro\'zg\'or', amountKRW: 120000, description: 'Oilaviy oziq-ovqat va go\'sht xaridi', date: '07-Iyun, 2026' },
  { id: 3, category: 'Shaxsiy', amountKRW: 40000, description: 'Benzin va shaxsiy tushlik xarajatlari', date: '05-Iyun, 2026' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Currency State: 1 KRW (Won) = live UZS (So'm), default fallback to 8.0
  const [displayCurrency, setDisplayCurrency] = useState('UZS'); // set default to UZS
  const [currencyRate, setCurrencyRate] = useState(8.0);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/KRW')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.UZS) {
          setCurrencyRate(data.rates.UZS);
        }
      })
      .catch(err => {
        console.error('Failed to fetch real-time exchange rate:', err);
      });
  }, []);

  // Global States (synchronized to localStorage)
  const [products, setProducts] = useState(() => getInitialState('guli_products', INITIAL_PRODUCTS));
  const [customers, setCustomers] = useState(() => getInitialState('guli_customers', INITIAL_CUSTOMERS));
  const [suppliers, setSuppliers] = useState(() => getInitialState('guli_suppliers', INITIAL_SUPPLIERS));
  const [orders, setOrders] = useState(() => getInitialState('guli_orders', INITIAL_ORDERS));
  const [notifications, setNotifications] = useState(() => getInitialState('guli_notifications', INITIAL_NOTIFICATIONS));
  const [expenses, setExpenses] = useState(() => getInitialState('guli_expenses', INITIAL_EXPENSES));

  // Sync state updates to LocalStorage
  useEffect(() => {
    localStorage.setItem('guli_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('guli_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('guli_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('guli_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('guli_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('guli_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Currency Converter Formatter
  const formatMoney = (valueInKRW) => {
    if (displayCurrency === 'KRW') {
      return `₩${valueInKRW.toLocaleString()}`;
    } else {
      const valueInUZS = Math.round(valueInKRW * currencyRate);
      return `${valueInUZS.toLocaleString()} so'm`;
    }
  };

  const addNotification = (text) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        text,
        read: false,
        time: 'Hozirgi vaqtda'
      },
      ...prev
    ]);
  };

  const updateProductStock = (productId, amount) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock + amount) };
      }
      return p;
    }));
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            products={products} 
            updateProductStock={updateProductStock} 
            addNotification={addNotification}
            orders={orders}
            formatMoney={formatMoney}
            currencyRate={currencyRate}
            customers={customers}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            products={products} 
            setProducts={setProducts} 
            addNotification={addNotification} 
            formatMoney={formatMoney}
            currencyRate={currencyRate}
            orders={orders}
          />
        );
      case 'customers':
        return (
          <Customers 
            customers={customers}
            setCustomers={setCustomers}
            addNotification={addNotification}
            formatMoney={formatMoney}
            currencyRate={currencyRate}
            products={products}
            updateProductStock={updateProductStock}
          />
        );
      case 'analytics':
        return <Analytics formatMoney={formatMoney} currencyRate={currencyRate} displayCurrency={displayCurrency} />;
      case 'suppliers':
        return (
          <Suppliers 
            suppliers={suppliers} 
            setSuppliers={setSuppliers} 
            addNotification={addNotification} 
            formatMoney={formatMoney}
            currencyRate={currencyRate}
            products={products}
            setProducts={setProducts}
            updateProductStock={updateProductStock}
          />
        );
      default:
        return <div className="pt-24 text-center">Sahifa topilmadi.</div>;
    }
  };

  return (
    <div className="bg-gradient-mesh min-h-screen text-on-surface">
      <TopBar 
        notifications={notifications} 
        setNotifications={setNotifications} 
        displayCurrency={displayCurrency}
        setDisplayCurrency={setDisplayCurrency}
      />
      
      <div className="pb-16">
        {renderActivePage()}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
