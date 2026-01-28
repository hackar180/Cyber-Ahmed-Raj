
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Analysis_Hub', icon: '⚡' },
    { id: 'help', label: 'Protocol_Book', icon: '☣️' },
  ];

  return (
    <div className="w-64 glass h-screen fixed left-0 top-0 p-8 flex flex-col border-r border-[#00ff41]/10 hidden md:flex bg-[#050505] z-50">
      <div className="mb-14 text-center group cursor-pointer">
        <div className="relative inline-block">
          <h1 className="text-2xl font-black text-[#00ff41] tracking-[0.2em] mono uppercase relative z-10">ALPHA</h1>
          <div className="absolute -inset-1 bg-[#00ff41]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <p className="text-[9px] text-gray-500 mt-2 mono uppercase tracking-widest">Security Terminal</p>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center gap-4 mono text-[11px] uppercase tracking-[0.2em] relative group ${
              activeTab === item.id 
                ? 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 shadow-[0_0_20px_rgba(0,255,65,0.1)]' 
                : 'text-gray-600 hover:text-[#00ff41] hover:bg-white/5'
            }`}
          >
            <span className="text-base group-hover:animate-bounce transition-all">{item.icon}</span>
            <span className="font-bold">{item.label}</span>
            {activeTab === item.id && (
              <span className="absolute right-4 w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_8px_#00ff41]"></span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 glass p-4 rounded-xl border-white/5">
           <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_5px_#00ff41]"></div>
           <div>
             <div className="text-[9px] text-gray-600 uppercase tracking-widest mono">Node Status</div>
             <div className="text-[10px] font-bold text-[#00ff41]/80 mono">ENCRYPTED_LINK</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
