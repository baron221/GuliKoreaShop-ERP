import React, { useState } from 'react';

export default function TopBar({ notifications, setNotifications, displayCurrency, setDisplayCurrency }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggle = () => setShowDropdown(!showDropdown);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm">
      {/* Brand Logo & Profile */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 shadow-sm">
          <img 
            alt="GuliKoreaShop Logo" 
            className="w-full h-full object-cover" 
            src="/logo.jpg"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-logo select-none text-gold-neon tracking-wide">
          GuliKoreaShop
        </h1>
      </div>

      {/* Header Actions: Currency and Notification Bell */}
      <div className="flex items-center gap-3">
        
        {/* Currency Switcher */}
        <button
          onClick={() => setDisplayCurrency(prev => prev === 'KRW' ? 'UZS' : 'KRW')}
          className="px-3 py-1 text-xs font-extrabold glass-panel border border-primary/30 rounded-lg text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">payments</span>
          {displayCurrency === 'KRW' ? '₩ (Won)' : "so'm (UZS)"}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={handleToggle}
            className="w-10 h-10 flex items-center justify-center text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined relative text-2xl">
              notifications
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-error ring-2 ring-white"></span>
              )}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 glass-panel-heavy rounded-xl p-4 shadow-xl z-50 border border-white/40 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-on-surface text-sm">Bildirishnomalar</h4>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    Barchasini o'chirish
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-on-surface-variant/70 text-center py-4">Yangi bildirishnomalar yo'q.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleMarkAsRead(n.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        n.read 
                          ? 'bg-white/30 border-transparent text-on-surface-variant/70' 
                          : 'bg-primary-container/20 border-primary-container/30 text-on-surface font-semibold hover:bg-primary-container/30'
                      }`}
                    >
                      <p className="text-xs">{n.text}</p>
                      <span className="text-[9px] text-on-surface-variant/50 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
