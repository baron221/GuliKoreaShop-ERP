import React, { useState } from 'react';

export default function Inventory({ products, setProducts, addNotification, formatMoney, currencyRate, orders }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 

  // Add Form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Terini parvarish qilish');
  const [newProdSpecs, setNewProdSpecs] = useState('30ml');
  const [newProdStock, setNewProdStock] = useState(100);
  const [newProdPriceKRW, setNewProdPriceKRW] = useState('');
  const [newProdPriceUZS, setNewProdPriceUZS] = useState('');

  // Edit Form states
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editStock, setEditStock] = useState(0);
  const [editPriceKRW, setEditPriceKRW] = useState('');
  const [editPriceUZS, setEditPriceUZS] = useState('');

  const categories = ['Barchasi', 'Terini parvarish qilish', 'Pardoz', 'Tozalovchilar', 'Zardoblar'];

  // Currency converters for Add Form
  const handlePriceKRWChange = (val) => {
    setNewProdPriceKRW(val);
    if (val === '') {
      setNewProdPriceUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setNewProdPriceUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handlePriceUZSChange = (val) => {
    setNewProdPriceUZS(val);
    if (val === '') {
      setNewProdPriceKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setNewProdPriceKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Currency converters for Edit Form
  const handleEditPriceKRWChange = (val) => {
    setEditPriceKRW(val);
    if (val === '') {
      setEditPriceUZS('');
    } else {
      const num = parseFloat(val) || 0;
      setEditPriceUZS(Math.round(num * currencyRate).toString());
    }
  };

  const handleEditPriceUZSChange = (val) => {
    setEditPriceUZS(val);
    if (val === '') {
      setEditPriceKRW('');
    } else {
      const num = parseFloat(val) || 0;
      setEditPriceKRW((num / currencyRate).toFixed(1).toString());
    }
  };

  // Add new product SKU
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const mockImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoR_qSPQHsgesJN6Slf85LMPt39c4neAgI_UT6Vu4GFLFOkt5uZn9Q6uEDKslpVewB69YNzN-EzXq5ibTIFlJKS4T6UIBi8rMCi3HLA0l5G5aQg-ghR_cvAAILM65FZnhVik2XhUNMCnEUdX2vnTN6cjUcc32NYOuz4Ot8_HxG8YiuX_veXL3jO69DapINXvSglHr5H64J9VI1UiLrOvMrQqlCG7idTaqDNEoj7ifi2wodU_6SRQ7-0-U5yVqT1rIzIVCtG7IZFRY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxp9HitaTKq-gHWN-3m0-VfvtwB7sKI_ONLUezmg_wBb1C92cAvW0soD6qZ1aw1YHNk3hBJWdKT5Hwpo7T7COQjPsAFrDUCsvCYNS_GdRMyghHUUgEgvZ4dOH5JjBvDeMPIRDNQjbKLxOrGLUujHrrY8ZSrn9PA7nEMyW8JQgjn-eGAHzM9sWwvmGPZghOn3R608x4ccrnlZYXT6-pO8Ue9K9dLcsOiRPVL1GF9npvSE_4-hhfLrqd8LMz4JsBD_U9iyOtzG5tR_U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9O2kX_NyLDACXm8DE34zpgFGxJTtwWgF2tir1IhV_15VALzylvTnm7bq-g_ZJrwy3ko9DhLadQ7BCuy8zU3U9K7ZYNKKtCJXwe_pBe8XPumADow752RjSYQ8VtKJbtdwfGwjFjHpytoZsJXEefGodcwmEfeT8b805FeqHEq4iyfMYIoz9LZbRnP7nO4hn2ihqb1IY-FZ3h3Mn7zpUrdxGd7R7KlxW0f333tbL_7JqZDUKr9Yk1UnCuNotCFH0BcW-9G-CTZblhvU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCGEYnPBGfK9z4SJBAGXX-DXl5NvnN2WeW2dlmOO4lj0o3x-NkM3I6rwu81jKIgys_s0AjOu2F_6vmF8dpzzleviRmrx4lE0PPOkHBG1wwHQs3z_wspP5ecS2jMMobAcSej2LZHdCQOG5yL4hbHnKE6hm5wlgaq1G_pgOVFjPePwBKE-e2sQpFDdAWsneCWeClvL43Ji2wAGfXUG-f5VBoBRiQL6ODpyBpeJUNhy-zTs8amwxJrAbphOSBaL9BhH67cclTe47Lqfs'
    ];
    const image = mockImages[Math.floor(Math.random() * mockImages.length)];
    const unitPriceKRW = parseFloat(newProdPriceKRW) || 0;

    const newProduct = {
      id: Date.now(),
      name: newProdName,
      category: newProdCategory,
      specs: newProdSpecs,
      stock: newProdStock,
      priceInKRW: unitPriceKRW,
      image
    };

    setProducts(prev => [newProduct, ...prev]);
    addNotification(`Katalogga yangi tovar qo'shildi: ${newProdName} (${newProdSpecs}) - narxi: ${formatMoney(unitPriceKRW)}.`);

    // Reset and close
    setNewProdName('');
    setNewProdCategory('Terini parvarish qilish');
    setNewProdSpecs('30ml');
    setNewProdStock(100);
    setNewProdPriceKRW('');
    setNewProdPriceUZS('');
    setShowAddModal(false);
  };

  // Open Edit modal with pre-populated values
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditSpecs(product.specs);
    setEditStock(product.stock);
    setEditPriceKRW(product.priceInKRW.toString());
    setEditPriceUZS(Math.round(product.priceInKRW * currencyRate).toString());
  };

  // Save edited product
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const unitPriceKRW = parseFloat(editPriceKRW) || 0;

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
      ...p,
      name: editName,
      category: editCategory,
      specs: editSpecs,
      stock: editStock,
      priceInKRW: unitPriceKRW
    } : p));

    addNotification(`Mahsulot ma'lumotlari tahrirlandi: ${editName}.`);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (id, name) => {
    const confirmDelete = window.confirm(`"${name}" mahsulotini katalogdan o'chirmoqchimisiz?`);
    if (confirmDelete) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addNotification(`Mahsulot katalogdan o'chirildi: ${name}.`);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Barchasi' || product.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter(p => p.stock < 50).length;

  // 1. Calculate the total sum of all imported goods in stock
  const totalStockValueKRW = products.reduce((sum, p) => sum + (p.stock * p.priceInKRW), 0);

  // 2. Calculate the total sold goods count from orders
  const totalSoldGoods = orders.reduce((sum, o) => sum + o.units, 0);

  return (
    <main className="pt-20 pb-28 px-5 text-left max-w-4xl mx-auto">
      {/* Search Bar */}
      <section className="mb-6 mt-4">
        <div className="glass-panel rounded-xl p-2 inner-glow flex items-center gap-3 border border-white/40">
          <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
          <input 
            type="text" 
            placeholder="Ombordan qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-xs text-on-surface placeholder:text-on-surface-variant/60"
          />
        </div>
      </section>

      {/* KPI Summary */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel rounded-xl p-4 inner-glow border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">JAMI MAHSULOT TURLARI (SKU)</p>
          <h2 className="text-xl font-bold text-primary">{products.length} ta</h2>
        </div>
        <div className="glass-panel rounded-xl p-4 inner-glow border border-white/40">
          <p className="text-[9px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">ZAXIRASI KAM TURLAR</p>
          <h2 className={`text-xl font-bold ${lowStockCount > 0 ? 'text-error animate-pulse' : 'text-secondary'}`}>{lowStockCount} ta</h2>
        </div>
        
        {/* New double card for overall sums */}
        <div className="glass-panel rounded-xl p-4 col-span-2 inner-glow border border-white/40 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">KIRGAN TOVARLAR JAMI SUMMASI (OMBOR)</p>
            <h2 className="text-lg font-extrabold text-primary">{formatMoney(totalStockValueKRW)}</h2>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">JAMI SOTILGAN TOVARLAR</p>
            <h2 className="text-lg font-extrabold text-secondary">{totalSoldGoods} dona</h2>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="mb-6 overflow-x-auto no-scrollbar flex gap-2 pb-2">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-primary text-white border-transparent shadow-sm'
                  : 'glass-panel text-on-surface-variant border-white/20 hover:bg-white/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center py-12 text-xs text-on-surface-variant/70">Mos keladigan mahsulotlar topilmadi.</p>
        ) : (
          filteredProducts.map(product => {
            let status = 'Sotuvda bor';
            let badgeClass = 'bg-secondary-container/80 text-on-secondary-container';
            let progressColor = 'bg-secondary';
            if (product.stock === 0) {
              status = 'Tugagan';
              badgeClass = 'bg-surface-container-highest/80 text-on-surface-variant';
              progressColor = 'bg-on-surface-variant/20';
            } else if (product.stock < 50) {
              status = 'Zaxira kam';
              badgeClass = 'bg-error-container/80 text-on-error-container';
              progressColor = 'bg-error';
            }

            const stockPercent = Math.min((product.stock / 1000) * 100, 100);

            return (
              <div 
                key={product.id} 
                className="glass-panel rounded-xl overflow-hidden inner-glow group border border-white/40 flex flex-col justify-between relative"
              >
                {/* Product Image and Action Buttons */}
                <div className="relative h-44 w-full bg-surface-container-low">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Status Tag */}
                  <div className={`absolute top-3 right-3 px-3 py-0.5 rounded-full font-bold text-[9px] ${badgeClass}`}>
                    {status}
                  </div>

                  {/* Circular Pencil (Edit) and Bin (Delete) Buttons */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(product)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-md"
                      title="Tahrirlash"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors cursor-pointer shadow-md"
                      title="O'chirish"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                
                {/* Product Text details */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-on-surface">{product.name}</h3>
                      <p className="text-[9px] font-semibold text-on-surface-variant/80">{product.category} • {product.specs}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-extrabold block ${product.stock < 50 ? 'text-error' : 'text-primary'}`}>{product.stock} dona</span>
                      <span className="text-[9px] font-bold text-on-surface-variant block mt-0.5">{formatMoney(product.priceInKRW)}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-surface-variant/30 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className={`${progressColor} h-full transition-all duration-500`} style={{ width: `${stockPercent}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* FAB button for adding new product */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:opacity-95 active:scale-90 transition-all z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Katalogga yangi tovar qo'shish</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mahsulot nomi</label>
                <input 
                  type="text" 
                  value={newProdName} 
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Masalan: Guruchli Toner"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Kategoriya</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="Terini parvarish qilish">Terini parvarish qilish</option>
                    <option value="Pardoz">Pardoz</option>
                    <option value="Tozalovchilar">Tozalovchilar</option>
                    <option value="Zardoblar">Zardoblar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Xarakteristika (Specs)</label>
                  <input 
                    type="text" 
                    value={newProdSpecs} 
                    onChange={(e) => setNewProdSpecs(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Masalan: 150ml, 5 talik qadoq"
                    required
                  />
                </div>
              </div>

              {/* Real-time Dual Currency Price Inputs */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Birlik xarid narxi (Koreyadan):
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={newProdPriceKRW}
                      onChange={(e) => handlePriceKRWChange(e.target.value)}
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
                      value={newProdPriceUZS}
                      onChange={(e) => handlePriceUZSChange(e.target.value)}
                      placeholder="So'm"
                      className="w-full pl-2 pr-9 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      required
                    />
                    <span className="absolute right-2 text-[9px] text-on-surface-variant font-bold">so'm</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Dastlabki zaxira miqdori (Dona)</label>
                <input 
                  type="number" 
                  min="0"
                  value={newProdStock} 
                  onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Mahsulotni qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-heavy p-6 rounded-2xl border border-white/50 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-on-surface mb-4">Mahsulot ma'lumotlarini tahrirlash</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Mahsulot nomi</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Kategoriya</label>
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="Terini parvarish qilish">Terini parvarish qilish</option>
                    <option value="Pardoz">Pardoz</option>
                    <option value="Tozalovchilar">Tozalovchilar</option>
                    <option value="Zardoblar">Zardoblar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Xarakteristika (Specs)</label>
                  <input 
                    type="text" 
                    value={editSpecs} 
                    onChange={(e) => setEditSpecs(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Real-time Dual Currency Price Inputs */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg">
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Birlik xarid narxi (Koreyadan):
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 uppercase">KRW (Won)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-on-surface-variant font-bold">₩</span>
                    <input 
                      type="number"
                      value={editPriceKRW}
                      onChange={(e) => handleEditPriceKRWChange(e.target.value)}
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
                      value={editPriceUZS}
                      onChange={(e) => handleEditPriceUZSChange(e.target.value)}
                      placeholder="So'm"
                      className="w-full pl-2 pr-9 py-1.5 text-xs rounded-lg glass-input border-none focus:outline-none"
                      required
                    />
                    <span className="absolute right-2 text-[9px] text-on-surface-variant font-bold">so'm</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Ombordagi zaxira miqdori (Dona)</label>
                <input 
                  type="number" 
                  min="0"
                  value={editStock} 
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-white/40 border border-white/50 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
    </main>
  );
}
