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
const INITIAL_PRODUCTS = [];
const INITIAL_CUSTOMERS = [];
const INITIAL_SUPPLIERS = [];
const INITIAL_ORDERS = [];
const INITIAL_NOTIFICATIONS = [];
const INITIAL_EXPENSES = [];

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
        if (!supabase) {
          throw new Error('Supabase client is not initialized (missing environment variables).');
        }
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
