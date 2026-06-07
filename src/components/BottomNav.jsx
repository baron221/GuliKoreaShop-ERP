import React from 'react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Bosh sahifa', icon: 'dashboard' },
    { id: 'inventory', label: 'Ombor', icon: 'inventory_2' },
    { id: 'customers', label: 'Mijozlar', icon: 'group' },
    { id: 'analytics', label: 'Tahlil', icon: 'insights' },
    { id: 'suppliers', label: 'Ta\'minotchilar', icon: 'conveyor_belt' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-white/60 dark:bg-black/40 backdrop-blur-xl border-t border-white/40 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-90 cursor-pointer ${
              isActive
                ? 'text-primary dark:text-primary-fixed-dim font-bold'
                : 'text-on-surface-variant dark:text-on-surface-variant/70 hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
