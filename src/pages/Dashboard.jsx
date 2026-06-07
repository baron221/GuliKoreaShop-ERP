import React, { useState } from 'react';

export default function Dashboard({ 
  products, 
  updateProductStock, 
  addNotification, 
  orders, 
  formatMoney, 
  currencyRate,
  customers = [],
  expenses = [],
  setExpenses
}) {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [batchQuantity, setBatchQuantity] = useState(100);

  // Real-time Currency Converter widget state
  const [calcWon, setCalcWon] = useState('');
  const [calcSom, setCalcSom] = useState('');

  // Add Expense Modal states
  const [expenseCategory, setExpenseCategory] = useState('Logistika');
  const [expenseAmountKRW, setExpenseAmountKRW] = useState('');
  const [expenseAmountUZS, setExpenseAmountUZS] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  const handleWonChange = (val) => {
    setCalcWon(val);
    if (val === '') {
      setCalcSom('');
    } else {
      const num = parseFloat(val) || 0;
      setCalcSom(Math.round(num * currencyRate).toString());
    }
  };

  const handleSomChange = (val) => {
    setCalcSom(val);
    if (val === '') {
      setCalcWon('');
    } else {
      const num = parseFloat(val) || 0;
      setCalcWon((num / currencyRate).toFixed(1).toString());
    }
  };

  const handleExpenseKRWChange = (val) => {
    setExpenseAmountKRW(val);
    if (val === '') {
      setExpenseAmountUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setExpenseAmountUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handleExpenseUZSChange = (val) => {
    setExpenseAmountUZS(val);
    if (val === '') {
      setExpenseAmountKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setExpenseAmountKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Compute stats dynamically
  const lowStockCount = products.filter(p => p.stock < 50).length;

  // Compute Total Sales Revenue (Savdo tushumi)
  const totalRevenueKRW = customers.reduce((sum, c) => {
    return sum + (c.purchases?.reduce((pSum, p) => pSum + (p.quantity * p.priceInKRW), 0) || 0);
  }, 0);

  // Compute Total Units Sold
  const totalUnitsSold = customers.reduce((sum, c) => {
    return sum + (c.purchases?.reduce((pSum, p) => pSum + p.quantity, 0) || 0);
  }, 0);

  // Helper to get cost price (tannarx) of a product by name
  const getProductCostPrice = (productName) => {
    const prod = products.find(p => p.name === productName);
    return prod ? prod.priceInKRW : 0;
  };

  // Compute Gross Profit (Yalpi Foyda) from all customer sales
  const totalGrossProfitKRW = customers.reduce((sum, c) => {
    const cProfit = c.purchases?.reduce((pSum, p) => {
      const costPrice = getProductCostPrice(p.productName);
      const profitPerUnit = p.priceInKRW - costPrice;
      return pSum + (p.quantity * profitPerUnit);
    }, 0) || 0;
    return sum + cProfit;
  }, 0);

  // Compute Operating Expenses (Operatsion xarajatlar - Business, e.g. Logistika)
  const operatingExpensesKRW = expenses
    .filter(e => e.category === 'Logistika')
    .reduce((sum, e) => sum + e.amountKRW, 0);

  // Compute Business Net Profit (Sof Foyda)
  const netProfitKRW = totalGrossProfitKRW - operatingExpensesKRW;

  // Compute Drawings (Sof foydadan ishlatilgani - Shaxsiy & Ro'zg'or)
  const spentFromNetProfitKRW = expenses
    .filter(e => e.category === 'Shaxsiy' || e.category === 'Ro\'zg\'or')
    .reduce((sum, e) => sum + e.amountKRW, 0);

  // Compute Remaining Balance/Savings (Sof qoldiq / Jamg'arma)
  const remainingSavingsKRW = netProfitKRW - spentFromNetProfitKRW;

  // Get recent purchases feed (flattened and sorted by ID/date)
  const recentPurchases = customers.flatMap(c => 
    (c.purchases || []).map(p => ({
      ...p,
      clientName: c.name
    }))
  ).sort((a, b) => b.id - a.id).slice(0, 3);

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    updateProductStock(product.id, batchQuantity);

    const importCode = `IMP-${Math.floor(1000 + Math.random() * 9000)}`;
    addNotification(`Yangi import buyurtmasi yuborildi (${importCode}): ${product.name} uchun ${batchQuantity} dona ta'minotchidan buyurtma qilindi va omborga yuklandi.`);

    setShowBatchModal(false);
    setBatchQuantity(100);
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmountKRW) || 0;
    if (amount <= 0 || !expenseDescription.trim()) return;

    const newExpense = {
      id: Date.now(),
      category: expenseCategory,
      amountKRW: amount,
      description: expenseDescription.trim(),
      date: 'Bugun'
    };

    setExpenses(prev => [...prev, newExpense]);
    addNotification(`Yangi xarajat qo'shildi: ${expenseCategory} - ${formatMoney(amount)}.`);

    // Reset Form & Close
    setExpenseCategory('Logistika');
    setExpenseAmountKRW('');
    setExpenseAmountUZS('');
    setExpenseDescription('');
    setShowExpenseModal(false);
  };

  const activeProduct = products.find(p => p.id === parseInt(selectedProductId));
  const estimatedCostKRW = activeProduct ? activeProduct.priceInKRW * batchQuantity : 0;

  return (
    <main className="pt-24 pb-32 px-5 max-w-4xl mx-auto text-left">
      
      {/* Dashboard Header */}
      <section className="mb-6">
        <h2 className="text-2xl font-extrabold text-on-surface mb-1">Xayrli tong, Gulnoza</h2>
        <p className="text-xs text-on-surface-variant font-semibold">Tizim holati ideal. Bugungi ko'rsatkichlar va hisobotlar bilan tanishing.</p>
      </section>

      {/* KPI Grid - Bento Style */}
      <section className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Revenue */}
        <div className="glass-panel col-span-2 p-6 rounded-xl flex flex-col justify-between overflow-hidden relative border border-white/40 shadow-sm">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Umumiy sotuv tushumi</p>
            <h3 className="text-3xl font-extrabold text-primary">{formatMoney(totalRevenueKRW)}</h3>
          </div>
          <div className="flex items-center gap-1 mt-3 text-secondary">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <span className="text-[11px] font-bold">Barcha mijozlar xaridlari yig'indisi</span>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between border border-white/40 shadow-sm">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Jami sotilgan tovarlar</p>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-on-surface">{totalUnitsSold.toLocaleString()} ta</h3>
            <span className="text-[11px] text-on-surface-variant font-semibold">Sotilgan tovarlar miqdori</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`glass-panel p-6 rounded-xl flex flex-col justify-between border border-white/40 shadow-sm ${lowStockCount > 0 ? 'border-l-4 border-l-error' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Kam qolgan tovarlar</p>
            {lowStockCount > 0 && (
              <span className="flex h-2.5 w-2.5 rounded-full bg-error animate-pulse"></span>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className={`text-xl font-bold ${lowStockCount > 0 ? 'text-error' : 'text-secondary'}`}>{lowStockCount}</h3>
            <span className="text-[11px] text-on-surface-variant font-semibold">Zaxirasi kamaygan mahsulotlar</span>
          </div>
        </div>
      </section>

      {/* Dynamic P&L Report Card */}
      <section className="mb-6">
        <div className="glass-panel p-5 rounded-xl border border-white/40 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-sm">finance</span>
            Moliyaviy Hisobot (Kassa va Foyda Balansi)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Business performance */}
            <div className="p-4 bg-white/30 rounded-lg space-y-2 border border-white/10">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider block border-b border-black/5 pb-1">
                1. Biznes Faoliyati
              </span>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/80">Savdo tushumi:</span>
                  <span className="text-on-surface font-extrabold">{formatMoney(totalRevenueKRW)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/80">Yalpi foyda:</span>
                  <span className="text-secondary font-extrabold">{formatMoney(totalGrossProfitKRW)}</span>
                </div>
                <div className="flex justify-between text-error font-bold">
                  <span>Logistika (Xarajat):</span>
                  <span>-{formatMoney(operatingExpensesKRW)}</span>
                </div>
              </div>
            </div>
            
            {/* Box 2: Net Profit */}
            <div className="p-4 bg-secondary-container/10 border border-secondary-container/20 rounded-lg space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-on-secondary-container uppercase tracking-wider block border-b border-secondary-container/20 pb-1">
                  2. Biznes Sof Foydasi
                </span>
                <p className="text-[9px] text-on-surface-variant/70 mt-1 font-semibold leading-relaxed">
                  Yalpi foydadan biznes xarajatlari (Logistika) chegirilgan sof foyda.
                </p>
              </div>
              <div className="text-center py-2">
                <span className="text-lg font-black text-secondary">{formatMoney(netProfitKRW)}</span>
              </div>
            </div>

            {/* Box 3: Spent from Net Profit & Savings */}
            <div className="p-4 bg-white/30 rounded-lg space-y-2 border border-white/10">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider block border-b border-black/5 pb-1">
                3. Sof Foydadan Ishlatilgani
              </span>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between text-error font-bold">
                  <span>Shaxsiy + Ro'zg'or:</span>
                  <span>-{formatMoney(spentFromNetProfitKRW)}</span>
                </div>
                <div className="flex justify-between border-t border-black/5 pt-1.5 text-[11px] font-extrabold">
                  <span className="text-on-surface">SOF QOLDIQ:</span>
                  <span className={`font-black ${remainingSavingsKRW >= 0 ? 'text-secondary' : 'text-error animate-pulse'}`}>
                    {formatMoney(remainingSavingsKRW)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expenses Logger Widget */}
      <section className="mb-6">
        <div className="glass-panel p-5 rounded-xl border border-white/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              Xarajatlar Daftari (Logistika, Shaxsiy va Ro'zg'or)
            </h3>
            
            <button 
              onClick={() => setShowExpenseModal(true)}
              className="px-2.5 py-1 text-[10px] font-extrabold bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              Xarajat qo'shish
            </button>
          </div>

          {/* Expense Breakdown Categories */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-primary/5 p-2 rounded-lg border border-primary/15">
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Biznes (Logistika)</p>
              <p className="font-extrabold text-primary">{formatMoney(operatingExpensesKRW)}</p>
            </div>
            <div className="bg-secondary/5 p-2 rounded-lg border border-secondary/15">
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Oilaviy Ro'zg'or</p>
              <p className="font-extrabold text-secondary">
                {formatMoney(expenses.filter(e => e.category === "Ro'zg'or").reduce((sum, e) => sum + e.amountKRW, 0))}
              </p>
            </div>
            <div className="bg-tertiary/5 p-2 rounded-lg border border-tertiary/15">
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Shaxsiy</p>
              <p className="font-extrabold text-tertiary">
                {formatMoney(expenses.filter(e => e.category === 'Shaxsiy').reduce((sum, e) => sum + e.amountKRW, 0))}
              </p>
            </div>
          </div>

          {/* Recent Expenses Ledger */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-center py-6 text-xs text-on-surface-variant/70 italic">Xarajatlar kiritilmagan.</p>
            ) : (
              [...expenses].reverse().map(exp => (
                <div key={exp.id} className="flex justify-between items-center text-[11px] bg-white/20 p-2.5 rounded-lg border border-white/10 hover:bg-white/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded text-[7px] font-extrabold border ${
                        exp.category === 'Logistika' 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : exp.category === "Ro'zg'or" 
                          ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                          : 'bg-tertiary/10 border-tertiary/20 text-tertiary'
                      }`}>
                        {exp.category}
                      </span>
                      <span className="font-bold text-on-surface">{exp.description}</span>
                    </div>
                    <span className="text-[8px] text-on-surface-variant/65 block mt-0.5">{exp.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-primary">-{formatMoney(exp.amountKRW)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mb-6">
        <button 
          onClick={() => setShowBatchModal(true)}
          className="w-full h-14 bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          YANGI IMPORT BUYURTMASI YARATISH
        </button>
      </section>

      {/* Real-time Currency Converter Widget */}
      <section className="mb-6">
        <div className="glass-panel p-5 rounded-xl border border-white/40 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">currency_exchange</span>
              Valyuta konvertori (Real vaqtda)
            </h3>
            <span className="text-[10px] font-bold text-on-surface-variant/80 bg-white/40 px-2.5 py-0.5 rounded-full">
              Kurs: 1 Won = {currencyRate} so'm
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">Koreya Woni (KRW)</label>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs text-on-surface-variant font-bold">₩</span>
                <input 
                  type="number"
                  value={calcWon}
                  onChange={(e) => handleWonChange(e.target.value)}
                  placeholder="Won miqdori"
                  className="w-full pl-6 pr-3 py-2 text-xs rounded-lg glass-input border-none focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">O'zbek so'mi (UZS)</label>
              <div className="relative flex items-center">
                <input 
                  type="number"
                  value={calcSom}
                  onChange={(e) => handleSomChange(e.target.value)}
                  placeholder="So'm miqdori"
                  className="w-full pl-3 pr-12 py-2 text-xs rounded-lg glass-input border-none focus:outline-none"
                />
                <span className="absolute right-2.5 text-[9px] text-on-surface-variant font-bold">so'm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Sales Ledger */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-on-surface">Oxirgi savdolar (Kassa logs)</h2>
        </div>
        <div className="space-y-3">
          {recentPurchases.length === 0 ? (
            <p className="text-center py-6 text-xs text-on-surface-variant/70 italic">Hali savdolar amalga oshirilmagan.</p>
          ) : (
            recentPurchases.map(purchase => (
              <div 
                key={purchase.id} 
                className="glass-panel-heavy p-4 rounded-xl flex items-center justify-between group transition-all duration-300 hover:translate-x-1 border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-secondary-container/30 text-on-secondary-container">
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface font-extrabold">{purchase.clientName}</p>
                    <p className="text-xs text-on-surface-variant/90 font-medium">{purchase.productName} × {purchase.quantity} dona</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary font-extrabold">{formatMoney(purchase.quantity * purchase.priceInKRW)}</p>
                  <span className="text-[9px] text-on-surface-variant/50 font-bold">{purchase.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CREATE NEW IMPORT ORDER MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Ta'minotchidan yangi import buyurtmasi yaratish</h3>
            
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mahsulotni tanlang</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Birlik narxi: {formatMoney(p.priceInKRW)} - Omborda: {p.stock} ta)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Buyurtma miqdori (Dona)</label>
                <input 
                  type="number" 
                  min="1"
                  value={batchQuantity} 
                  onChange={(e) => setBatchQuantity(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Taxminiy xarid narxi (Koreyadan):</p>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-on-surface">{estimatedCostKRW.toLocaleString()} KRW (Won)</span>
                  <span className="text-primary">{Math.round(estimatedCostKRW * currencyRate).toLocaleString()} UZS (So'm)</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Import qilish (Buyurtma yuborish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Yangi xarajat kiritish</h3>
            
            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Xarajat turi (Kategoriya)</label>
                <select 
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="Logistika">Logistika (Biznes xarajati)</option>
                  <option value="Ro'zg'or">Oilaviy Ro'zg'or (Sof foydadan)</option>
                  <option value="Shaxsiy">Shaxsiy xarajat (Sof foydadan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Xarajat tavsifi (Nima uchun)</label>
                <input 
                  type="text" 
                  value={expenseDescription} 
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="Masalan: Konteyner yetkazib berish haqi"
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              {/* Dynamic Currency Price Inputs for Expense Amount */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Xarajat miqdori:
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={expenseAmountKRW}
                      onChange={(e) => handleExpenseKRWChange(e.target.value)}
                      placeholder="Won"
                      className="w-full pl-5 pr-2 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">UZS (So'm)</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number"
                      value={expenseAmountUZS}
                      onChange={(e) => handleExpenseUZSChange(e.target.value)}
                      placeholder="So'm"
                      className="w-full pl-2 pr-9 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      required
                    />
                    <span className="absolute right-2 text-[9px] text-on-surface-variant font-bold">so'm</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Xarajatni kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
