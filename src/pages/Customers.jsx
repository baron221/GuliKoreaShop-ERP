import React, { useState } from 'react';

export default function Customers({ 
  customers, 
  setCustomers, 
  addNotification, 
  formatMoney, 
  currencyRate, 
  products, 
  updateProductStock 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [payingClient, setPayingClient] = useState(null); // Client receiving payment
  const [editingClient, setEditingClient] = useState(null); // Client being edited
  const [purchasingClient, setPurchasingClient] = useState(null); // Client making new purchase
  const [expandedHistoryId, setExpandedHistoryId] = useState(null); // ID of client with expanded history

  // Add Client Form states
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientPaidKRW, setNewClientPaidKRW] = useState('');
  const [newClientPaidUZS, setNewClientPaidUZS] = useState('');
  
  // Mini-cart state inside Register Client modal
  const [cartItems, setCartItems] = useState([]); // Array of { id, productId, productName, quantity, priceInKRW }
  
  // Temporary inputs to add an item to the mini-cart
  const [addCartProductId, setAddCartProductId] = useState(products[0]?.id || '');
  const [addCartQty, setAddCartQty] = useState(1);
  const [addCartPriceKRW, setAddCartPriceKRW] = useState(products[0]?.priceInKRW.toString() || '');
  const [addCartPriceUZS, setAddCartPriceUZS] = useState(
    products[0] ? Math.round(products[0].priceInKRW * currencyRate).toString() : ''
  );

  // Edit Client Form states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Payment Form states
  const [payAmountKRW, setPayAmountKRW] = useState('');
  const [payAmountUZS, setPayAmountUZS] = useState('');

  // New Purchase Form states (for existing client)
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchasePriceKRW, setPurchasePriceKRW] = useState('');
  const [purchasePriceUZS, setPurchasePriceUZS] = useState('');

  // Currency converters for Add Client mini-cart inputs
  const handleAddCartPriceKRWChange = (val) => {
    setAddCartPriceKRW(val);
    if (val === '') {
      setAddCartPriceUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setAddCartPriceUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handleAddCartPriceUZSChange = (val) => {
    setAddCartPriceUZS(val);
    if (val === '') {
      setAddCartPriceKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setAddCartPriceKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Currency converters for Add Client Paid
  const handleAddPaidKRWChange = (val) => {
    setNewClientPaidKRW(val);
    if (val === '') {
      setNewClientPaidUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setNewClientPaidUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handleAddPaidUZSChange = (val) => {
    setNewClientPaidUZS(val);
    if (val === '') {
      setNewClientPaidKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setNewClientPaidKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Currency converters for Payment Modal
  const handlePayKRWChange = (val) => {
    setPayAmountKRW(val);
    if (val === '') {
      setPayAmountUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setPayAmountUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handlePayUZSChange = (val) => {
    setPayAmountUZS(val);
    if (val === '') {
      setPayAmountKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setPayAmountKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Currency converters for New Purchase Modal
  const handlePurchasePriceKRWChange = (val) => {
    setPurchasePriceKRW(val);
    if (val === '') {
      setPurchasePriceUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setPurchasePriceUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handlePurchasePriceUZSChange = (val) => {
    setPurchasePriceUZS(val);
    if (val === '') {
      setPurchasePriceKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setPurchasePriceKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Handle product selection change in the Add Client mini-cart
  const handleAddCartProductChange = (id) => {
    setAddCartProductId(id);
    const prod = products.find(p => p.id === parseInt(id));
    if (prod) {
      setAddCartPriceKRW(prod.priceInKRW.toString());
      setAddCartPriceUZS(Math.round(prod.priceInKRW * currencyRate).toString());
    }
  };

  // Add item to mini-cart inside the Register Client modal
  const handleAddItemToCart = () => {
    const prod = products.find(p => p.id === parseInt(addCartProductId));
    if (!prod) return;

    if (addCartQty <= 0) {
      alert("Miqdorni kiriting!");
      return;
    }

    // Check if enough stock exists in warehouse
    if (addCartQty > prod.stock) {
      alert(`Omborda yetarli mahsulot yo'q! (Joriy zaxira: ${prod.stock} dona).`);
      return;
    }

    // Check if product is already in the mini-cart
    const alreadyInCart = cartItems.find(item => item.productId === prod.id);
    if (alreadyInCart) {
      alert("Ushbu mahsulot savatga qo'shilgan, avvalgisini o'chirib qayta qo'shishingiz mumkin.");
      return;
    }

    const priceKRW = parseFloat(addCartPriceKRW) || 0;

    const newItem = {
      id: Date.now(),
      productId: prod.id,
      productName: prod.name,
      quantity: addCartQty,
      priceInKRW: priceKRW
    };

    setCartItems(prev => [...prev, newItem]);
    
    // Reset temp inputs
    setAddCartQty(1);
  };

  // Remove item from mini-cart
  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Compute total mini-cart price in KRW
  const cartTotalKRW = cartItems.reduce((sum, item) => sum + (item.quantity * item.priceInKRW), 0);

  // Compute overall stats in KRW
  const totalSalesKRW = customers.reduce((sum, c) => sum + c.totalPurchasedKRW, 0);
  const totalPaidKRW = customers.reduce((sum, c) => sum + c.totalPaidKRW, 0);
  const totalDebtKRW = totalSalesKRW - totalPaidKRW;

  // Register new client with selected items
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim()) return;

    const paidKRW = parseFloat(newClientPaidKRW) || 0;

    // 1. Subtract warehouse inventory for each cart item
    cartItems.forEach(item => {
      updateProductStock(item.productId, -item.quantity);
    });

    const newClient = {
      id: Date.now(),
      name: newClientName,
      phone: newClientPhone,
      totalPurchasedKRW: cartTotalKRW,
      totalPaidKRW: paidKRW,
      purchases: cartItems.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        priceInKRW: item.priceInKRW,
        date: 'Bugun'
      }))
    };

    setCustomers(prev => [newClient, ...prev]);
    addNotification(`Yangi mijoz ro'yxatdan o'tkazildi: ${newClientName}. Sotuv summasi: ${formatMoney(cartTotalKRW)}.`);

    // Reset Form
    setNewClientName('');
    setNewClientPhone('');
    setNewClientPaidKRW('');
    setNewClientPaidUZS('');
    setCartItems([]);
    setShowAddModal(false);
  };

  // Save Edit Client Details
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) return;

    setCustomers(prev => prev.map(c => c.id === editingClient.id ? {
      ...c,
      name: editName,
      phone: editPhone
    } : c));

    addNotification(`Mijoz ma'lumotlari tahrirlandi: ${editName}.`);
    setEditingClient(null);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone);
  };

  const handleDeleteClient = (id, name) => {
    const confirmDelete = window.confirm(`"${name}" mijozini ro'yxatdan o'chirmoqchimisiz?`);
    if (confirmDelete) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      addNotification(`Mijoz ro'yxatdan o'chirildi: ${name}.`);
    }
  };

  // Handle Payment Submission
  const handleReceivePayment = (e) => {
    e.preventDefault();
    const payAmtKRW = parseFloat(payAmountKRW) || 0;
    if (payAmtKRW <= 0) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === payingClient.id) {
        return {
          ...c,
          totalPaidKRW: c.totalPaidKRW + payAmtKRW
        };
      }
      return c;
    }));

    addNotification(`${payingClient.name}dan ${formatMoney(payAmtKRW)} to'lov qabul qilindi.`);
    setPayingClient(null);
    setPayAmountKRW('');
    setPayAmountUZS('');
  };

  const handleOpenPayment = (client) => {
    setPayingClient(client);
    setPayAmountKRW('');
    setPayAmountUZS('');
  };

  // Open New Purchase modal for existing client
  const handleOpenPurchase = (client) => {
    setPurchasingClient(client);
    const defaultProduct = products[0];
    if (defaultProduct) {
      setSelectedProductId(defaultProduct.id);
      setPurchaseQty(1);
      setPurchasePriceKRW(defaultProduct.priceInKRW.toString());
      setPurchasePriceUZS(Math.round(defaultProduct.priceInKRW * currencyRate).toString());
    }
  };

  const handleProductSelectionChange = (id) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === parseInt(id));
    if (prod) {
      setPurchasePriceKRW(prod.priceInKRW.toString());
      setPurchasePriceUZS(Math.round(prod.priceInKRW * currencyRate).toString());
    }
  };

  // Submit new purchase for existing client
  const handleAddPurchaseSubmit = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === parseInt(selectedProductId));
    if (!prod || !purchasingClient) return;

    // Validate warehouse stock
    if (purchaseQty > prod.stock) {
      alert(`Omborda yetarli mahsulot yo'q! Joriy zaxira: ${prod.stock} dona.`);
      return;
    }

    const priceKRW = parseFloat(purchasePriceKRW) || 0;
    const totalCostKRW = priceKRW * purchaseQty;

    // 1. Subtract warehouse inventory
    updateProductStock(prod.id, -purchaseQty);

    // 2. Add purchase record & update balances
    setCustomers(prev => prev.map(c => {
      if (c.id === purchasingClient.id) {
        const history = c.purchases || [];
        const newRecord = {
          id: Date.now(),
          productName: prod.name,
          quantity: purchaseQty,
          priceInKRW: priceKRW,
          date: 'Bugun'
        };
        return {
          ...c,
          totalPurchasedKRW: c.totalPurchasedKRW + totalCostKRW,
          purchases: [newRecord, ...history]
        };
      }
      return c;
    }));

    addNotification(`${purchasingClient.name} uchun ${purchaseQty} dona ${prod.name} sotildi. Qiymati: ${formatMoney(totalCostKRW)}.`);
    setPurchasingClient(null);
  };

  // Toggle collapsible history panel
  const toggleHistory = (clientId) => {
    if (expandedHistoryId === clientId) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(clientId);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <main className="pt-24 pb-32 px-5 max-w-5xl mx-auto text-left">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">Mijozlar hisobi</h2>
        <p className="text-xs text-on-surface-variant font-semibold">Mijozlar xaridlari, to'lovlar va qarzdorlik balansi.</p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-3 mb-6 border border-white/40">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">search</span>
          <input 
            type="text" 
            placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-xs text-on-surface focus:outline-none border-none bg-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami Savdolar</p>
          <h3 className="text-xl font-bold text-primary">{formatMoney(totalSalesKRW)}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami To'langan</p>
          <h3 className="text-xl font-bold text-secondary">{formatMoney(totalPaidKRW)}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami Qarzlar</p>
          <h3 className={`text-xl font-bold ${totalDebtKRW > 0 ? 'text-error animate-pulse' : 'text-secondary'}`}>{formatMoney(totalDebtKRW)}</h3>
        </div>
      </div>

      {/* Customers List */}
      <div className="flex flex-col gap-4">
        {filteredCustomers.length === 0 ? (
          <p className="text-center py-12 text-xs text-on-surface-variant/70">Mijozlar topilmadi.</p>
        ) : (
          filteredCustomers.map(client => {
            const debt = client.totalPurchasedKRW - client.totalPaidKRW;
            const isHistoryExpanded = expandedHistoryId === client.id;
            const historyCount = client.purchases?.length || 0;

            return (
              <div 
                key={client.id} 
                className="glass-card p-5 rounded-xl border border-white/40 transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{client.name}</h4>
                    <p className="text-[10px] text-on-surface-variant/80 font-bold mt-0.5">{client.phone}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Add Purchase Button */}
                    <button 
                      onClick={() => handleOpenPurchase(client)}
                      className="px-3 py-1.5 text-[10px] font-extrabold bg-primary text-white rounded-lg hover:opacity-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                      Yangi xarid
                    </button>
                    {/* Pay Button */}
                    <button 
                      onClick={() => handleOpenPayment(client)}
                      className="px-3 py-1.5 text-[10px] font-extrabold bg-secondary text-white rounded-lg hover:opacity-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-xs">point_of_sale</span>
                      To'lov olish
                    </button>
                    {/* Edit/Delete */}
                    <button 
                      onClick={() => handleOpenEdit(client)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteClient(client.id, client.name)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-y border-white/20 py-3 text-xs font-semibold my-2">
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Xaridlar summasi</p>
                    <p className="text-on-surface">{formatMoney(client.totalPurchasedKRW)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Jami to'lagan</p>
                    <p className="text-secondary">{formatMoney(client.totalPaidKRW)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Qarz balansi</p>
                    <p className={debt > 0 ? 'text-error font-extrabold flex items-center gap-0.5' : 'text-secondary font-extrabold'}>
                      {formatMoney(debt)}
                      {debt > 0 && <span className="px-1.5 py-0.2 bg-error/10 rounded text-[8px] border border-error/20">Qarzdor</span>}
                    </p>
                  </div>
                </div>

                {/* Collapsible History Drawer */}
                <div className="mt-2 text-xs">
                  <button 
                    onClick={() => toggleHistory(client.id)}
                    className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isHistoryExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    Xaridlar tarixi ({historyCount})
                  </button>

                  {isHistoryExpanded && (
                    <div className="mt-2 p-3 bg-white/40 border border-white/20 rounded-lg space-y-2 max-h-48 overflow-y-auto">
                      {historyCount === 0 ? (
                        <p className="text-on-surface-variant/70 italic text-[11px]">Hali xaridlar qilinmagan.</p>
                      ) : (
                        client.purchases.map(purchase => (
                          <div 
                            key={purchase.id} 
                            className="flex justify-between items-center text-[11px] pb-1 border-b border-white/10 last:border-none"
                          >
                            <div>
                              <p className="font-bold text-on-surface">{purchase.productName}</p>
                              <p className="text-[9px] text-on-surface-variant/80 font-bold">
                                {purchase.quantity} dona × {formatMoney(purchase.priceInKRW)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{formatMoney(purchase.quantity * purchase.priceInKRW)}</p>
                              <span className="text-[8px] text-on-surface-variant/50">{purchase.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB to Register Client */}
      <button 
        onClick={() => {
          setShowAddModal(true);
          setCartItems([]);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl">person_add</span>
      </button>

      {/* ADD NEW CLIENT MODAL WITH MINI-CART */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Katalogga yangi mijoz ro'yxatdan o'tkazish</h3>
            
            <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN: Customer Info, Payment, and Action buttons */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mijozning to'liq ismi (F.I.SH.)</label>
                  <input 
                    type="text" 
                    value={newClientName} 
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Masalan: Dilshod Akramov"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Telefon raqami</label>
                  <input 
                    type="text" 
                    value={newClientPhone} 
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Masalan: +998 90 123 45 67"
                    required
                  />
                </div>

                {/* TO'LANGAN MIQDOR (INITIAL PAYMENT) */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg">
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                      2. To'langan miqdor:
                    </span>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                      <input 
                        type="number"
                        value={newClientPaidKRW}
                        onChange={(e) => handleAddPaidKRWChange(e.target.value)}
                        placeholder="Won"
                        className="w-full pl-5 pr-2 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">UZS (So'm)</label>
                    <div className="relative flex items-center">
                      <input 
                        type="number"
                        value={newClientPaidUZS}
                        onChange={(e) => handleAddPaidUZSChange(e.target.value)}
                        placeholder="So'm"
                        className="w-full pl-2 pr-9 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      />
                      <span className="absolute right-2 text-[9px] text-on-surface-variant font-bold">so'm</span>
                    </div>
                  </div>
                </div>

                {/* Summary of Debt left */}
                {cartTotalKRW > 0 && (
                  <div className="p-3 bg-error-container/10 border border-error-container/20 rounded-lg flex justify-between items-center text-xs font-bold animate-fade-in">
                    <span className="text-error">QOLGAN QARZ BALANSI:</span>
                    <span className="text-error text-sm font-extrabold">
                      {formatMoney(cartTotalKRW - (parseFloat(newClientPaidKRW) || 0))}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-white/20">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    disabled={cartItems.length === 0}
                    className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mijozni qo'shish
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Cart System and Items list */}
              <div className="space-y-4">
                {/* DASTLABKI XARIDLAR (SAVATGA TOVAR QO'SHISH BLOKI) */}
                <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg space-y-3">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block border-b border-primary-container/20 pb-1">
                    1. Olinadigan tovarlarni savatga qo'shing:
                  </span>
                  
                  <div>
                    <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">Tovarni tanlang</label>
                    <select 
                      value={addCartProductId}
                      onChange={(e) => handleAddCartProductChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/40 border border-white/50 text-xs focus:outline-none focus:border-primary"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Zaxira: {p.stock} ta)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">Soni</label>
                      <input 
                        type="number"
                        min="1"
                        value={addCartQty}
                        onChange={(e) => setAddCartQty(parseInt(e.target.value) || 0)}
                        className="w-full p-2 rounded-lg bg-white/40 border border-white/50 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">₩ (Won)</label>
                      <input 
                        type="number"
                        value={addCartPriceKRW}
                        onChange={(e) => handleAddCartPriceKRWChange(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/40 border border-white/50 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">So'm</label>
                      <input 
                        type="number"
                        value={addCartPriceUZS}
                        onChange={(e) => handleAddCartPriceUZSChange(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/40 border border-white/50 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleAddItemToCart}
                    className="w-full py-1.5 bg-primary text-white text-[10px] font-extrabold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                    Savatga tovar qo'shish
                  </button>
                </div>

                {/* SAVATDAGI TOVARLAR RO'YXATI VA JAMI SUMMA */}
                {cartItems.length > 0 ? (
                  <div className="p-3 bg-white/40 border border-white/20 rounded-lg space-y-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block border-b border-white/10 pb-1">
                      Savatdagi tovarlar:
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-[10px] bg-white/30 p-1.5 rounded border border-white/10">
                          <div>
                            <p className="font-bold text-on-surface">{item.productName}</p>
                            <p className="text-on-surface-variant/85 font-semibold text-[9px]">
                              {item.quantity} dona × {formatMoney(item.priceInKRW)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-primary">{formatMoney(item.quantity * item.priceInKRW)}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-error hover:opacity-80 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Cart Total indicator */}
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-bold">
                      <span className="text-on-surface-variant">JAMI XARID SUMMASI:</span>
                      <span className="text-primary text-sm font-extrabold">{formatMoney(cartTotalKRW)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white/20 border border-dashed border-white/40 rounded-lg text-center text-xs text-on-surface-variant/70 italic">
                    Savat bo'sh. Davom etish uchun kamida bitta tovar qo'shishingiz kerak.
                  </div>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT CLIENT DETAILS MODAL */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left">
            <h3 className="text-base font-bold text-on-surface mb-4">Mijoz ma'lumotlarini tahrirlash</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Ism va familiya (F.I.SH.)</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Telefon raqami</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE PAYMENT MODAL */}
      {payingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left">
            <h3 className="text-base font-bold text-on-surface mb-2">{payingClient.name} uchun to'lov qabul qilish</h3>
            <p className="text-[10px] text-error font-extrabold uppercase mb-4 tracking-wider">
              Joriy qarz balansi: {formatMoney(payingClient.totalPurchasedKRW - payingClient.totalPaidKRW)}
            </p>
            
            <form onSubmit={handleReceivePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    To'lov miqdorini kiriting:
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={payAmountKRW}
                      onChange={(e) => handlePayKRWChange(e.target.value)}
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
                      value={payAmountUZS}
                      onChange={(e) => handlePayUZSChange(e.target.value)}
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
                  onClick={() => setPayingClient(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  To'lovni kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW PURCHASE TRANSACTION MODAL */}
      {purchasingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left">
            <h3 className="text-base font-bold text-on-surface mb-4">{purchasingClient.name} uchun yangi xarid qo'shish</h3>
            
            <form onSubmit={handleAddPurchaseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mahsulotni tanlang</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => handleProductSelectionChange(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Omborda: {p.stock} ta)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Sotuv miqdori (Dona)</label>
                <input 
                  type="number" 
                  min="1"
                  value={purchaseQty} 
                  onChange={(e) => setPurchaseQty(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
                
                {/* Stock Validation Warning */}
                {(() => {
                  const prod = products.find(p => p.id === parseInt(selectedProductId));
                  if (prod && purchaseQty > prod.stock) {
                    return (
                      <p className="text-[10px] text-error font-extrabold mt-1">
                        ⚠️ Omborda yetarli tovar yo'q! (Mavjud zaxira: {prod.stock} dona)
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Dynamic Currency Price Inputs for Unit Selling Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Sotuv narxi (Dona boshiga):
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={purchasePriceKRW}
                      onChange={(e) => handlePurchasePriceKRWChange(e.target.value)}
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
                      value={purchasePriceUZS}
                      onChange={(e) => handlePurchasePriceUZSChange(e.target.value)}
                      placeholder="So'm"
                      className="w-full pl-2 pr-9 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      required
                    />
                    <span className="absolute right-2 text-[9px] text-on-surface-variant font-bold">so'm</span>
                  </div>
                </div>
              </div>

              {/* Purchase Total Estimation */}
              <div className="p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami xarid summasi:</p>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-on-surface">{((parseFloat(purchasePriceKRW) || 0) * purchaseQty).toLocaleString()} KRW</span>
                  <span className="text-secondary">{Math.round(((parseFloat(purchasePriceKRW) || 0) * purchaseQty) * currencyRate).toLocaleString()} UZS</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setPurchasingClient(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={(() => {
                    const prod = products.find(p => p.id === parseInt(selectedProductId));
                    return prod ? purchaseQty > prod.stock : true;
                  })()}
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sotish (Zaxiradan ayirish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
