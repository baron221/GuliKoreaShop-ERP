import React, { useState, useEffect, useRef } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Suppliers from './pages/Suppliers';
import { supabase } from './supabaseClient';

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

  // Connection and loading states
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Global States (initialized from localStorage first, then overwritten by Supabase if available)
  const [products, setProducts] = useState(() => getInitialState('guli_products', INITIAL_PRODUCTS));
  const [customers, setCustomers] = useState(() => getInitialState('guli_customers', INITIAL_CUSTOMERS));
  const [suppliers, setSuppliers] = useState(() => getInitialState('guli_suppliers', INITIAL_SUPPLIERS));
  const [orders, setOrders] = useState(() => getInitialState('guli_orders', INITIAL_ORDERS));
  const [notifications, setNotifications] = useState(() => getInitialState('guli_notifications', INITIAL_NOTIFICATIONS));
  const [expenses, setExpenses] = useState(() => getInitialState('guli_expenses', INITIAL_EXPENSES));

  // Refs to track previous states to avoid loops and detect deletions vs upserts
  const prevProductsRef = useRef(null);
  const prevCustomersRef = useRef(null);
  const prevSuppliersRef = useRef(null);
  const prevOrdersRef = useRef(null);
  const prevNotificationsRef = useRef(null);
  const prevExpensesRef = useRef(null);

  // Initial data loading and seeding from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Supabase: Ma\'lumotlarni yuklash boshlandi...');

        // Fetch products
        const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*').order('id');
        if (prodErr) throw prodErr;

        // Fetch customers
        const { data: dbCustomers, error: custErr } = await supabase.from('customers').select('*').order('id');
        if (custErr) throw custErr;

        // Fetch suppliers
        const { data: dbSuppliers, error: suppErr } = await supabase.from('suppliers').select('*').order('id');
        if (suppErr) throw suppErr;

        // Fetch orders
        const { data: dbOrders, error: ordErr } = await supabase.from('orders').select('*');
        if (ordErr) throw ordErr;

        // Fetch notifications
        const { data: dbNotifications, error: notifErr } = await supabase.from('notifications').select('*').order('id', { ascending: false });
        if (notifErr) throw notifErr;

        // Fetch expenses
        const { data: dbExpenses, error: expErr } = await supabase.from('expenses').select('*').order('id', { ascending: false });
        if (expErr) throw expErr;

        console.log('Supabase: Ulanish muvaffaqiyatli, jadvallar mavjud.');
        setIsUsingSupabase(true);

        // Seeding checks table-by-table
        let activeProducts = dbProducts || [];
        if (activeProducts.length === 0) {
          console.log('Supabase: products bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('products').insert(INITIAL_PRODUCTS);
          if (!seedErr) activeProducts = INITIAL_PRODUCTS;
        }

        let activeCustomers = dbCustomers || [];
        if (activeCustomers.length === 0) {
          console.log('Supabase: customers bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('customers').insert(INITIAL_CUSTOMERS);
          if (!seedErr) activeCustomers = INITIAL_CUSTOMERS;
        }

        let activeSuppliers = dbSuppliers || [];
        if (activeSuppliers.length === 0) {
          console.log('Supabase: suppliers bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('suppliers').insert(INITIAL_SUPPLIERS);
          if (!seedErr) activeSuppliers = INITIAL_SUPPLIERS;
        }

        let activeOrders = dbOrders || [];
        if (activeOrders.length === 0) {
          console.log('Supabase: orders bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('orders').insert(INITIAL_ORDERS);
          if (!seedErr) activeOrders = INITIAL_ORDERS;
        }

        let activeNotifications = dbNotifications || [];
        if (activeNotifications.length === 0) {
          console.log('Supabase: notifications bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('notifications').insert(INITIAL_NOTIFICATIONS);
          if (!seedErr) activeNotifications = INITIAL_NOTIFICATIONS;
        }

        let activeExpenses = dbExpenses || [];
        if (activeExpenses.length === 0) {
          console.log('Supabase: expenses bo\'sh, mock ma\'lumotlar yuklanmoqda...');
          const { error: seedErr } = await supabase.from('expenses').insert(INITIAL_EXPENSES);
          if (!seedErr) activeExpenses = INITIAL_EXPENSES;
        }

        // Set states with the fetched (or seeded) data
        setProducts(activeProducts);
        setCustomers(activeCustomers);
        setSuppliers(activeSuppliers);
        setOrders(activeOrders);
        setNotifications(activeNotifications);
        setExpenses(activeExpenses);

      } catch (err) {
        console.warn('Supabase jadvallari topilmadi yoki ulanish xatosi. LocalStorage rejimi faollashtirildi.', err);
        setIsUsingSupabase(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

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

  // Initialize Telegram WebApp on mount
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Expand Mini App to full container height
    }
  }, []);

  // Connect Active Tab Navigation with Telegram native Back Button
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      if (activeTab !== 'home') {
        tg.BackButton.show();
        const handleBack = () => setActiveTab('home');
        tg.BackButton.onClick(handleBack);
        return () => {
          tg.BackButton.offClick(handleBack);
          tg.BackButton.hide();
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [activeTab]);

  // Sync products state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_products', JSON.stringify(products));

    if (!isUsingSupabase) {
      prevProductsRef.current = products;
      return;
    }

    if (prevProductsRef.current === null) {
      prevProductsRef.current = products;
      return;
    }

    const prev = prevProductsRef.current;
    prevProductsRef.current = products;

    const deleted = prev.filter(prevItem => !products.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = products.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('products').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: products delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('products').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: products upsert error', error); });
    }
  }, [products, isUsingSupabase]);

  // Sync customers state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_customers', JSON.stringify(customers));

    if (!isUsingSupabase) {
      prevCustomersRef.current = customers;
      return;
    }

    if (prevCustomersRef.current === null) {
      prevCustomersRef.current = customers;
      return;
    }

    const prev = prevCustomersRef.current;
    prevCustomersRef.current = customers;

    const deleted = prev.filter(prevItem => !customers.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = customers.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('customers').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: customers delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('customers').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: customers upsert error', error); });
    }
  }, [customers, isUsingSupabase]);

  // Sync suppliers state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_suppliers', JSON.stringify(suppliers));

    if (!isUsingSupabase) {
      prevSuppliersRef.current = suppliers;
      return;
    }

    if (prevSuppliersRef.current === null) {
      prevSuppliersRef.current = suppliers;
      return;
    }

    const prev = prevSuppliersRef.current;
    prevSuppliersRef.current = suppliers;

    const deleted = prev.filter(prevItem => !suppliers.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = suppliers.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('suppliers').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: suppliers delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('suppliers').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: suppliers upsert error', error); });
    }
  }, [suppliers, isUsingSupabase]);

  // Sync orders state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_orders', JSON.stringify(orders));

    if (!isUsingSupabase) {
      prevOrdersRef.current = orders;
      return;
    }

    if (prevOrdersRef.current === null) {
      prevOrdersRef.current = orders;
      return;
    }

    const prev = prevOrdersRef.current;
    prevOrdersRef.current = orders;

    const deleted = prev.filter(prevItem => !orders.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = orders.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('orders').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: orders delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('orders').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: orders upsert error', error); });
    }
  }, [orders, isUsingSupabase]);

  // Sync notifications state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_notifications', JSON.stringify(notifications));

    if (!isUsingSupabase) {
      prevNotificationsRef.current = notifications;
      return;
    }

    if (prevNotificationsRef.current === null) {
      prevNotificationsRef.current = notifications;
      return;
    }

    const prev = prevNotificationsRef.current;
    prevNotificationsRef.current = notifications;

    const deleted = prev.filter(prevItem => !notifications.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = notifications.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('notifications').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: notifications delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('notifications').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: notifications upsert error', error); });
    }
  }, [notifications, isUsingSupabase]);

  // Sync expenses state updates to LocalStorage and Supabase
  useEffect(() => {
    localStorage.setItem('guli_expenses', JSON.stringify(expenses));

    if (!isUsingSupabase) {
      prevExpensesRef.current = expenses;
      return;
    }

    if (prevExpensesRef.current === null) {
      prevExpensesRef.current = expenses;
      return;
    }

    const prev = prevExpensesRef.current;
    prevExpensesRef.current = expenses;

    const deleted = prev.filter(prevItem => !expenses.some(currItem => currItem.id === prevItem.id));
    const addedOrUpdated = expenses.filter(currItem => {
      const prevItem = prev.find(p => p.id === currItem.id);
      if (!prevItem) return true;
      return JSON.stringify(currItem) !== JSON.stringify(prevItem);
    });

    if (deleted.length > 0) {
      supabase.from('expenses').delete().in('id', deleted.map(d => d.id))
        .then(({ error }) => { if (error) console.error('Supabase: expenses delete error', error); });
    }

    if (addedOrUpdated.length > 0) {
      supabase.from('expenses').upsert(addedOrUpdated)
        .then(({ error }) => { if (error) console.error('Supabase: expenses upsert error', error); });
    }
  }, [expenses, isUsingSupabase]);

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
    // Trigger mobile haptic feedback if running in Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

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

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-mesh text-white">
        <div className="text-center bg-surface-glass p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![rect(0,0,0,0)]">Yuklanmoqda...</span>
          </div>
          <p className="mt-4 text-amber-400 font-bold text-xl tracking-wider">GuliKoreaShop</p>
          <p className="text-xs text-white/60 mt-1">Ma'lumotlar bazasiga ulanmoqda...</p>
        </div>
      </div>
    );
  }

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
