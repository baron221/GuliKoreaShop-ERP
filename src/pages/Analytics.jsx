import React, { useState } from 'react';

export default function Analytics({ formatMoney, currencyRate, displayCurrency }) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'
  const [hoveredPoint, setHoveredPoint] = useState(null); // { label, valueInKRW, x, y }

  // Data sets in KRW values to support dynamic currency conversion
  const weeklyData = {
    revenueKRW: 28450000,
    conversion: '4.82%',
    customers: '3,120',
    revenueGrowth: '+12.4%',
    conversionGrowth: '-0.5%',
    customersGrowth: '+8.2%',
    chartPoints: [
      { label: 'Dush', valueInKRW: 3120500, x: 50, y: 180 },
      { label: 'Sesh', valueInKRW: 4500200, x: 160, y: 150 },
      { label: 'Chor', valueInKRW: 3800000, x: 270, y: 170 },
      { label: 'Pay', valueInKRW: 6200400, x: 380, y: 110 },
      { label: 'Jum', valueInKRW: 5900100, x: 490, y: 120 },
      { label: 'Shan', valueInKRW: 8450000, x: 600, y: 60 },
      { label: 'Yak', valueInKRW: 7250300, x: 710, y: 85 }
    ],
    pathD: "M 50 180 L 160 150 L 270 170 L 380 110 L 490 120 L 600 60 L 710 85",
    areaD: "M 50 180 L 160 150 L 270 170 L 380 110 L 490 120 L 600 60 L 710 85 V 230 H 50 Z"
  };

  const monthlyData = {
    revenueKRW: 124590000,
    conversion: '5.15%',
    customers: '12,840',
    revenueGrowth: '+18.1%',
    conversionGrowth: '+0.2%',
    customersGrowth: '+15.4%',
    chartPoints: [
      { label: 'Yan', valueInKRW: 15400000, x: 50, y: 190 },
      { label: 'Fev', valueInKRW: 18200500, x: 160, y: 175 },
      { label: 'Mar', valueInKRW: 22500000, x: 270, y: 150 },
      { label: 'Apr', valueInKRW: 31100400, x: 380, y: 100 },
      { label: 'May', valueInKRW: 28450000, x: 490, y: 120 },
      { label: 'Iyun', valueInKRW: 36940000, x: 600, y: 50 },
      { label: 'Iyul', valueInKRW: 45200200, x: 710, y: 20 }
    ],
    pathD: "M 50 190 L 160 175 L 270 150 L 380 100 L 490 120 L 600 50 L 710 20",
    areaD: "M 50 190 L 160 175 L 270 150 L 380 100 L 490 120 L 600 50 L 710 20 V 230 H 50 Z"
  };

  const activeData = timeframe === 'weekly' ? weeklyData : monthlyData;

  // Regional volumes in KRW
  const regions = [
    { name: 'Seul Markazi', volumeKRW: 45200000, growth: '+15%', status: 'Yuqori talab', badge: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Busan Metropoliteni', volumeKRW: 28150000, growth: '+8.4%', status: 'Barqaror', badge: 'bg-surface-container-highest text-on-surface-variant' },
    { name: 'Incheon Xalqaro', volumeKRW: 19400000, growth: '-2.1%', status: 'Ogohlantirish', badge: 'bg-error-container text-on-error-container' }
  ];

  return (
    <main className="pt-24 pb-32 px-5 text-left max-w-5xl mx-auto space-y-6">
      
      {/* Background Glow Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] -right-[5%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-tertiary/5 blur-[80px] rounded-full"></div>
      </div>

      {/* Header & Toggle */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tahlillar</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Sotuvlar tahlili</h1>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex p-1 glass-panel rounded-full self-start sm:self-auto border border-white/40">
          <button 
            onClick={() => { setTimeframe('weekly'); setHoveredPoint(null); }}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
              timeframe === 'weekly' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Haftalik
          </button>
          <button 
            onClick={() => { setTimeframe('monthly'); setHoveredPoint(null); }}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
              timeframe === 'monthly' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Oylik
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden group border border-white/40">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Umumiy tushum</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{formatMoney(activeData.revenueKRW)}</p>
          </div>
          <div className="flex items-center text-secondary text-[11px] font-bold gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>{activeData.revenueGrowth} o'tgan davrga nisbatan</span>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">payments</span>
          </div>
        </div>

        {/* Conversion */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden group border border-white/40">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Konversiya darajasi</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{activeData.conversion}</p>
          </div>
          <div className={`flex items-center text-[11px] font-bold gap-1 relative z-10 ${timeframe === 'weekly' ? 'text-primary' : 'text-secondary'}`}>
            <span className="material-symbols-outlined text-[14px]">
              {timeframe === 'weekly' ? 'trending_down' : 'trending_up'}
            </span>
            <span>{activeData.conversionGrowth} o'tgan davrga nisbatan</span>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">shopping_cart_checkout</span>
          </div>
        </div>

        {/* Active Customers */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden group border border-white/40">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Faol mijozlar</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{activeData.customers}</p>
          </div>
          <div className="flex items-center text-secondary text-[11px] font-bold gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>{activeData.customersGrowth} o'tgan davrga nisbatan</span>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">group</span>
          </div>
        </div>
      </section>

      {/* Main Charts & Widget Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Sales Trends Chart Card */}
        <div className="lg:col-span-3 glass-panel-heavy p-6 rounded-xl flex flex-col gap-4 min-h-[360px] relative border border-white/40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">show_chart</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Savdo tendensiyalari</h3>
                <p className="text-[11px] text-on-surface-variant">Real vaqtdagi daromad ko'rsatkichlari</p>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-grow relative mt-2">
            <svg 
              className="w-full h-full min-h-[220px]" 
              viewBox="0 0 800 250" 
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="0" y1="110" x2="800" y2="110" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="0" y1="170" x2="800" y2="170" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              <line x1="0" y1="230" x2="800" y2="230" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

              {/* Area Gradient */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a53b29" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a53b29" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={activeData.areaD} fill="url(#areaGrad)" className="transition-all duration-500"></path>

              {/* Trend Line */}
              <path 
                d={activeData.pathD} 
                fill="none" 
                stroke="#a53b29" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-all duration-500"
              />

              {/* Interactive Points */}
              {activeData.chartPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="15" 
                    fill="transparent" 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={hoveredPoint?.label === pt.label ? "7" : "4.5"} 
                    fill={hoveredPoint?.label === pt.label ? "#a53b29" : "#ffffff"} 
                    stroke="#a53b29" 
                    strokeWidth="2"
                    className="transition-all duration-200 pointer-events-none"
                  />
                </g>
              ))}
            </svg>

            {/* Dynamic Interactive Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute glass-panel-heavy p-2.5 rounded-lg border border-primary/20 shadow-xl pointer-events-none text-xs transition-all duration-150"
                style={{
                  left: `${(hoveredPoint.x / 800) * 100 - 8}%`,
                  top: `${(hoveredPoint.y / 250) * 100 - 25}%`
                }}
              >
                <p className="font-bold text-primary">{hoveredPoint.label}dagi savdo</p>
                <p className="font-bold text-on-surface">{formatMoney(hoveredPoint.valueInKRW)}</p>
              </div>
            )}
            
            {/* Tooltip Instruction Prompt */}
            {!hoveredPoint && (
              <div className="absolute top-2 right-2 text-[9px] text-on-surface-variant font-bold bg-white/40 px-2 py-0.5 rounded">
                Nuqtalar ustiga sichqonchani olib boring
              </div>
            )}

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 px-10 text-on-surface-variant font-bold text-[10px]">
              {activeData.chartPoints.map((pt, idx) => (
                <span key={idx}>{pt.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:col-span-1">
          
          {/* Best Categories */}
          <div className="glass-panel p-5 rounded-xl flex flex-col gap-3 flex-1 border border-white/40">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Eng yaxshi kategoriya</h3>
            <div className="flex-grow flex flex-col justify-center gap-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">Glow Zardobi</span>
                  <span className="font-extrabold text-primary">42%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">Snail Mucin Niqobi</span>
                  <span className="font-extrabold text-on-surface-variant">28%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-container rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">CICA Toneri</span>
                  <span className="font-extrabold text-on-surface-variant">15%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Retention Rate */}
          <div className="glass-panel p-5 rounded-xl flex flex-col gap-3 flex-1 border border-white/40">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Mijozlarni ushlab qolish</h3>
            <div className="flex flex-col items-center justify-center flex-grow py-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="rgba(0,0,0,0.05)" 
                    strokeWidth="3.2" 
                  />
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#3e6658" 
                    strokeDasharray="74, 100" 
                    strokeLinecap="round" 
                    strokeWidth="3.2" 
                  />
                </svg>
                <span className="text-base font-bold text-secondary">74%</span>
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] font-bold text-on-surface-variant">Sodiq mijozlar o'sishi</p>
                <p className="text-[10px] font-extrabold text-secondary">+5.2% shu oyda</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Regional Performance Table */}
      <section className="glass-panel rounded-xl overflow-hidden border border-white/40">
        <div className="px-5 py-4 border-b border-white/20 flex justify-between items-center">
          <h3 className="text-sm font-bold text-on-surface">Hududiy samaradorlik</h3>
          <button className="text-primary text-xs font-bold hover:underline cursor-pointer">Barcha hududlarni ko'rish</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr className="text-on-surface-variant font-bold text-[9px] border-b border-white/10">
                <th className="px-5 py-3 uppercase tracking-wider">Hudud</th>
                <th className="px-5 py-3 uppercase tracking-wider">Savdo hajmi</th>
                <th className="px-5 py-3 uppercase tracking-wider">O'sish</th>
                <th className="px-5 py-3 uppercase tracking-wider">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {regions.map((reg, idx) => (
                <tr key={idx} className="hover:bg-white/10 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-bold text-on-surface">{reg.name}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant">{formatMoney(reg.volumeKRW)}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-secondary">{reg.growth}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${reg.badge}`}>{reg.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
