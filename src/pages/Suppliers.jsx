import React, { useState } from 'react';

export default function Suppliers({ 
  suppliers, 
  setSuppliers, 
  addNotification, 
  formatMoney, 
  currencyRate, 
  products, 
  setProducts,
  updateProductStock 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null); // Supplier being edited
  const [importingSupplier, setImportingSupplier] = useState(null); // Supplier to import goods from
  const [expandedHistoryId, setExpandedHistoryId] = useState(null); // Collapsible history ID

  // Add Supplier Form states
  const [newName, setNewName] = useState('');
  
  // Mini-cart state inside Register Supplier modal
  const [cartItems, setCartItems] = useState([]); // Array of { id, productId, productName, quantity, priceInKRW, isNewProduct }
  
  // Temporary inputs to add an item to the mini-cart
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [addCartProductId, setAddCartProductId] = useState(products[0]?.id || '');
  const [addCartQty, setAddCartQty] = useState(1);
  const [addCartPriceKRW, setAddCartPriceKRW] = useState(products[0]?.priceInKRW.toString() || '');
  const [addCartPriceUZS, setAddCartPriceUZS] = useState(
    products[0] ? Math.round(products[0].priceInKRW * currencyRate).toString() : ''
  );

  // Edit Supplier Form states
  const [editName, setEditName] = useState('');

  // Import Goods Form states (for existing supplier)
  const [isImportNewProduct, setIsImportNewProduct] = useState(false);
  const [importProductName, setImportProductName] = useState('');
  const [importProductId, setImportProductId] = useState(products[0]?.id || '');
  const [importQty, setImportQty] = useState(1);
  const [importPriceKRW, setImportPriceKRW] = useState('');
  const [importPriceUZS, setImportPriceUZS] = useState('');

  // Currency converters for Add Supplier mini-cart inputs
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

  // Currency converters for Import Goods Modal
  const handleImportPriceKRWChange = (val) => {
    setImportPriceKRW(val);
    if (val === '') {
      setImportPriceUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setImportPriceUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handleImportPriceUZSChange = (val) => {
    setImportPriceUZS(val);
    if (val === '') {
      setImportPriceKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setImportPriceKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Handle product selection change in the Add Supplier mini-cart
  const handleAddCartProductChange = (id) => {
    setAddCartProductId(id);
    const prod = products.find(p => p.id === parseInt(id));
    if (prod) {
      setAddCartPriceKRW(prod.priceInKRW.toString());
      setAddCartPriceUZS(Math.round(prod.priceInKRW * currencyRate).toString());
    }
  };

  // Add item to mini-cart inside the Register Supplier modal
  const handleAddItemToCart = () => {
    let productId = null;
    let productName = '';
    let isNew = false;

    if (isNewProduct) {
      if (!newProductName.trim()) {
        alert("Mahsulot nomini kiriting!");
        return;
      }
      const existingProd = products.find(p => p.name.toLowerCase() === newProductName.trim().toLowerCase());
      if (existingProd) {
        productId = existingProd.id;
        productName = existingProd.name;
        isNew = false;
      } else {
        productName = newProductName.trim();
        isNew = true;
      }
    } else {
      const prod = products.find(p => p.id === parseInt(addCartProductId));
      if (!prod) return;
      productId = prod.id;
      productName = prod.name;
      isNew = false;
    }

    if (addCartQty <= 0) {
      alert("Miqdorni kiriting!");
      return;
    }

    // Check if product is already in the mini-cart
    const alreadyInCart = cartItems.find(item => 
      isNew 
        ? (item.isNewProduct && item.productName.toLowerCase() === productName.toLowerCase()) 
        : (item.productId === productId)
    );
    if (alreadyInCart) {
      alert("Ushbu mahsulot savatga qo'shilgan, avvalgisini o'chirib qayta qo'shishingiz mumkin.");
      return;
    }

    const priceKRW = parseFloat(addCartPriceKRW) || 0;

    const newItem = {
      id: Date.now(),
      productId: productId,
      productName: productName,
      quantity: addCartQty,
      priceInKRW: priceKRW,
      isNewProduct: isNew
    };

    setCartItems(prev => [...prev, newItem]);
    
    // Reset temp inputs
    setAddCartQty(1);
    setNewProductName('');
    setIsNewProduct(false);
  };

  // Remove item from mini-cart
  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Compute total mini-cart price in KRW
  const cartTotalKRW = cartItems.reduce((sum, item) => sum + (item.quantity * item.priceInKRW), 0);

  // Compute overall stats in KRW
  const totalImportsKRW = suppliers.reduce((sum, s) => {
    const sSum = s.purchases?.reduce((pSum, p) => pSum + (p.quantity * p.priceInKRW), 0) || 0;
    return sum + sSum;
  }, 0);

  // Register new supplier partner
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProductsToCreate = [];

    // 1. Process cart items
    cartItems.forEach((item, index) => {
      if (item.isNewProduct) {
        const newProduct = {
          id: Date.now() + index + Math.floor(Math.random() * 1000),
          name: item.productName,
          category: 'Import qilingan',
          specs: '1 dona',
          stock: item.quantity,
          priceInKRW: item.priceInKRW,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoR_qSPQHsgesJN6Slf85LMPt39c4neAgI_UT6Vu4GFLFOkt5uZn9Q6uEDKslpVewB69YNzN-EzXq5ibTIFlJKS4T6UIBi8rMCi3HLA0l5G5aQg-ghR_cvAAILM65FZnhVik2XhUNMCnEUdX2vnTN6cjUcc32NYOuz4Ot8_HxG8YiuX_veXL3jO69DapINXvSglHr5H64J9VI1UiLrOvMrQqlCG7idTaqDNEoj7ifi2wodU_6SRQ7-0-U5yVqT1rIzIVCtG7IZFRY' // Default image placeholder
        };
        newProductsToCreate.push(newProduct);
      } else {
        updateProductStock(item.productId, item.quantity);
      }
    });

    if (newProductsToCreate.length > 0) {
      setProducts(prev => [...prev, ...newProductsToCreate]);
    }

    const newSupplier = {
      id: Date.now(),
      name: newName,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgZYEha_sAYmv_MznSA0D3KNAD7PpufacxHKaLxrqauAy0nnpB8p3ABKT4FbgFpNchLs46Ib3qXLr51w5oJzj4a5loiJKngOtmSlHF0xsr55aXdtoevdzTLKQqws6AMae_spT8MQeVY3KTG7cz9ZDNjQJHXRDXHaw4adHQ0nMWLScTg3XRaE4s6mTlf4igiHIiujj9T7NU5bUwarBiX8rUNBPvNALlu5dxH0mE3mMjz5oU3sVb2ItPZ4XNG7wIJ9QRL19LbKeJEW0', // default logo
      purchases: cartItems.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        priceInKRW: item.priceInKRW,
        date: 'Bugun'
      }))
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    addNotification(`Yangi hamkor ro'yxatdan o'tkazildi: ${newName}. Keltirilgan tovarlar qiymati: ${formatMoney(cartTotalKRW)}.`);

    // Reset Form
    setNewName('');
    setCartItems([]);
    setShowAddModal(false);
  };

  // Open Edit modal
  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setEditName(supplier.name);
  };

  // Save supplier edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? {
      ...s,
      name: editName
    } : s));

    addNotification(`Ta'minotchi ma'lumotlari tahrirlandi: ${editName}.`);
    setEditingSupplier(null);
  };

  // Delete supplier
  const handleDeleteSupplier = (id, name) => {
    const confirmDelete = window.confirm(`"${name}" ta'minotchisini ro'yxatdan o'chirmoqchimisiz?`);
    if (confirmDelete) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      addNotification(`Ta'minotchi ro'yxatdan o'chirildi: ${name}.`);
    }
  };

  // Open Receive Goods Modal for existing supplier
  const handleOpenImport = (supplier) => {
    setImportingSupplier(supplier);
    setIsImportNewProduct(false);
    setImportProductName('');
    const defaultProduct = products[0];
    if (defaultProduct) {
      setImportProductId(defaultProduct.id);
      setImportQty(1);
      setImportPriceKRW(defaultProduct.priceInKRW.toString());
      setImportPriceUZS(Math.round(defaultProduct.priceInKRW * currencyRate).toString());
    }
  };

  const handleImportProductSelectionChange = (id) => {
    setImportProductId(id);
    const prod = products.find(p => p.id === parseInt(id));
    if (prod) {
      setImportPriceKRW(prod.priceInKRW.toString());
      setImportPriceUZS(Math.round(prod.priceInKRW * currencyRate).toString());
    }
  };

  // Submit new import order
  const handleAddImportSubmit = (e) => {
    e.preventDefault();
    
    let productName = '';
    let priceKRW = parseFloat(importPriceKRW) || 0;
    let totalCostKRW = priceKRW * importQty;
    let isNew = false;
    let prodId = null;

    if (isImportNewProduct) {
      if (!importProductName.trim()) {
        alert("Mahsulot nomini kiriting!");
        return;
      }
      productName = importProductName.trim();
      const existingProd = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
      if (existingProd) {
        prodId = existingProd.id;
        isNew = false;
      } else {
        isNew = true;
      }
    } else {
      const prod = products.find(p => p.id === parseInt(importProductId));
      if (!prod) return;
      prodId = prod.id;
      productName = prod.name;
      isNew = false;
    }

    if (isNew) {
      const newProduct = {
        id: Date.now(),
        name: productName,
        category: 'Import qilingan',
        specs: '1 dona',
        stock: importQty,
        priceInKRW: priceKRW,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoR_qSPQHsgesJN6Slf85LMPt39c4neAgI_UT6Vu4GFLFOkt5uZn9Q6uEDKslpVewB69YNzN-EzXq5ibTIFlJKS4T6UIBi8rMCi3HLA0l5G5aQg-ghR_cvAAILM65FZnhVik2XhUNMCnEUdX2vnTN6cjUcc32NYOuz4Ot8_HxG8YiuX_veXL3jO69DapINXvSglHr5H64J9VI1UiLrOvMrQqlCG7idTaqDNEoj7ifi2wodU_6SRQ7-0-U5yVqT1rIzIVCtG7IZFRY'
      };
      setProducts(prev => [...prev, newProduct]);
    } else {
      updateProductStock(prodId, importQty);
    }

    // Add purchase record to supplier
    setSuppliers(prev => prev.map(s => {
      if (s.id === importingSupplier.id) {
        const history = s.purchases || [];
        const newRecord = {
          id: Date.now(),
          productName: productName,
          quantity: importQty,
          priceInKRW: priceKRW,
          date: 'Bugun'
        };
        return {
          ...s,
          purchases: [newRecord, ...history]
        };
      }
      return s;
    }));

    addNotification(`${importingSupplier.name}dan ${importQty} dona ${productName} qabul qilindi. Qiymati: ${formatMoney(totalCostKRW)}.`);
    
    // Reset & close
    setImportingSupplier(null);
    setIsImportNewProduct(false);
    setImportProductName('');
  };

  // Toggle history logs
  const toggleHistory = (supplierId) => {
    if (expandedHistoryId === supplierId) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(supplierId);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-24 pb-32 px-5 max-w-5xl mx-auto text-left">
      
      {/* Screen Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">Ta'minotchilar hisobi</h2>
        <p className="text-xs text-on-surface-variant font-semibold">Chet eldan sotib olingan tovarlar va ulgurji hamkorlar nazorati.</p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-3 mb-6 border border-white/40">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">search</span>
          <input 
            type="text" 
            placeholder="Ta'minotchi nomi bo'yicha qidirish..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-xs text-on-surface focus:outline-none border-none bg-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami Hamkorlar</p>
          <h3 className="text-xl font-bold text-primary">{suppliers.length} ta hamkor</h3>
        </div>
        <div className="glass-card p-4 rounded-xl border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Jami Xaridlar Summasi</p>
          <h3 className="text-xl font-bold text-secondary">{formatMoney(totalImportsKRW)}</h3>
        </div>
      </div>

      {/* Supplier Cards List */}
      <div className="flex flex-col gap-4">
        {filteredSuppliers.length === 0 ? (
          <p className="text-center py-12 text-xs text-on-surface-variant/70">Ta'minotchilar topilmadi.</p>
        ) : (
          filteredSuppliers.map(supplier => {
            const isHistoryExpanded = expandedHistoryId === supplier.id;
            const historyCount = supplier.purchases?.length || 0;
            const supplierTotalImportsKRW = supplier.purchases?.reduce((sum, p) => sum + (p.quantity * p.priceInKRW), 0) || 0;

            return (
              <div 
                key={supplier.id} 
                className="glass-card p-5 rounded-xl border border-white/40 transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/40 border border-white/30 flex items-center justify-center">
                      <img 
                        src={supplier.logo} 
                        alt={supplier.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{supplier.name}</h4>
                      <p className="text-[9px] text-on-surface-variant/80 font-bold mt-1 uppercase tracking-wider">
                        Jami keltirilgan: <span className="text-primary">{formatMoney(supplierTotalImportsKRW)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Yangi tovar qabul qilish */}
                    <button 
                      onClick={() => handleOpenImport(supplier)}
                      className="px-3 py-1.5 text-[10px] font-extrabold bg-primary text-white rounded-lg hover:opacity-95 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                      Yangi tovar
                    </button>
                    {/* Edit/Delete */}
                    <button 
                      onClick={() => handleOpenEdit(supplier)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible History Drawer */}
                <div className="mt-3 border-t border-white/10 pt-2 text-xs">
                  <button 
                    onClick={() => toggleHistory(supplier.id)}
                    className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isHistoryExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    Keltirilgan tovarlar tarixi ({historyCount})
                  </button>

                  {isHistoryExpanded && (
                    <div className="mt-2 p-3 bg-white/40 border border-white/20 rounded-lg space-y-2 max-h-48 overflow-y-auto animate-fade-in">
                      {historyCount === 0 ? (
                        <p className="text-on-surface-variant/70 italic text-[11px]">Hali tovarlar qabul qilinmagan.</p>
                      ) : (
                        supplier.purchases.map(purchase => (
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

      {/* FAB to Register Supplier */}
      <button 
        onClick={() => {
          setShowAddModal(true);
          setCartItems([]);
          setIsNewProduct(false);
          setNewProductName('');
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {/* REGISTER NEW SUPPLIER MODAL WITH MINI-CART */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left my-8 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h3 className="text-base font-bold text-on-surface mb-4">Yangi hamkor ta'minotchini ro'yxatdan o'tkazish</h3>
            
            <form onSubmit={handleAddSupplier} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN: Supplier Info & Actions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Ta'minotchi nomi (Ismi)</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Masalan: Jeju Botanicals"
                    required
                  />
                </div>

                {cartTotalKRW > 0 && (
                  <div className="p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg flex justify-between items-center text-xs font-bold animate-fade-in">
                    <span className="text-secondary">JAMI XARID QIYMATI:</span>
                    <span className="text-secondary text-sm font-extrabold">{formatMoney(cartTotalKRW)}</span>
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
                    Hamkorni qo'shish
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Cart Selection & Items list */}
              <div className="space-y-4">
                <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg space-y-3">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block border-b border-primary-container/20 pb-1">
                    1. Sotib olingan tovarlarni savatga qo'shing:
                  </span>
                  
                  {/* Yangi mahsulot checkbox */}
                  <div className="flex items-center gap-2 py-0.5">
                    <input 
                      type="checkbox" 
                      id="isNewProduct"
                      checked={isNewProduct}
                      onChange={(e) => {
                        setIsNewProduct(e.target.checked);
                        if (e.target.checked) {
                          setNewProductName('');
                        }
                      }}
                      className="w-3.5 h-3.5 accent-primary cursor-pointer"
                    />
                    <label htmlFor="isNewProduct" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer">
                      Yangi mahsulot yaratish
                    </label>
                  </div>
                  
                  {isNewProduct ? (
                    <div>
                      <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">Yangi mahsulot nomi</label>
                      <input 
                        type="text" 
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Mahsulot nomini yozing..."
                        className="w-full p-2 rounded-lg bg-white/40 border border-white/50 text-xs focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  ) : (
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
                  )}

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

                {cartItems.length > 0 ? (
                  <div className="p-3 bg-white/40 border border-white/20 rounded-lg space-y-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block border-b border-white/10 pb-1">
                      Savatdagi tovarlar:
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-[10px] bg-white/30 p-1.5 rounded border border-white/10">
                          <div>
                            <p className="font-bold text-on-surface">
                              {item.productName}
                              {item.isNewProduct && <span className="ml-1.5 px-1 py-0.2 bg-primary/10 rounded text-[7px] border border-primary/20 text-primary">Yangi</span>}
                            </p>
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

      {/* EDIT SUPPLIER NAME MODAL */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Ta'minotchi ma'lumotlarini tahrirlash</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Ta'minotchi nomi</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingSupplier(null)}
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

      {/* RECEIVE NEW GOODS (IMPORT ORDER) TRANSACTION MODAL */}
      {importingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">{importingSupplier.name} ta'minotchidan yangi tovar qabul qilish</h3>
            
            <form onSubmit={handleAddImportSubmit} className="space-y-4">
              
              {/* Yangi mahsulot checkbox */}
              <div className="flex items-center gap-2 py-0.5">
                <input 
                  type="checkbox" 
                  id="isImportNewProduct"
                  checked={isImportNewProduct}
                  onChange={(e) => {
                    setIsImportNewProduct(e.target.checked);
                    if (e.target.checked) {
                      setImportProductName('');
                    }
                  }}
                  className="w-3.5 h-3.5 accent-primary cursor-pointer"
                />
                <label htmlFor="isImportNewProduct" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer">
                  Yangi mahsulot yaratish
                </label>
              </div>

              {isImportNewProduct ? (
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Yangi mahsulot nomi</label>
                  <input 
                    type="text" 
                    value={importProductName}
                    onChange={(e) => setImportProductName(e.target.value)}
                    placeholder="Mahsulot nomini yozing..."
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mahsulotni tanlang</label>
                  <select 
                    value={importProductId}
                    onChange={(e) => handleImportProductSelectionChange(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Zaxira: {p.stock} ta)</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Qabul qilinadigan miqdor (Dona)</label>
                <input 
                  type="number" 
                  min="1"
                  value={importQty} 
                  onChange={(e) => setImportQty(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              {/* Dynamic Currency Price Inputs for Unit Purchase Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Tannarxi (Dona boshiga):
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={importPriceKRW}
                      onChange={(e) => handleImportPriceKRWChange(e.target.value)}
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
                      value={importPriceUZS}
                      onChange={(e) => handleImportPriceUZSChange(e.target.value)}
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
                  <span className="text-on-surface">{((parseFloat(importPriceKRW) || 0) * importQty).toLocaleString()} KRW</span>
                  <span className="text-secondary">{Math.round(((parseFloat(importPriceKRW) || 0) * importQty) * currencyRate).toLocaleString()} UZS</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setImportingSupplier(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Qabul qilish (Zaxiraga qo'shish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
