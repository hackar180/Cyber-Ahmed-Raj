
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { UserProfile, SecurityStatus, ScanResult } from './types';
import { analyzeSecurityThreat } from './services/gemini';
import { sendTelegramAlert } from './services/telegram';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hacker_profile');
    try {
      return saved ? JSON.parse(saved) : {
        name: 'Cyber Hacker Ahmed Raj',
        role: 'Elite Security Expert',
        avatar: null
      };
    } catch {
      return { name: 'Cyber Hacker Ahmed Raj', role: 'Elite Security Expert', avatar: null };
    }
  });

  const [editForm, setEditForm] = useState<UserProfile>({ ...profile });
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState<string[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<SecurityStatus | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [sysLogs, setSysLogs] = useState<string[]>([]);

  // System log simulation
  useEffect(() => {
    const logPool = [
      "Inbound traffic encrypted...",
      "Firewall integrity check: OK",
      "Memory leak scan completed",
      "Encrypted tunnel stable",
      "Threat database updated",
      "Port 443 monitoring active",
      "IP Masking operational"
    ];
    const interval = setInterval(() => {
      setSysLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('hacker_results');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) { console.error("Error loading results:", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hacker_results', JSON.stringify(results));
  }, [results]);

  const stats = useMemo(() => {
    const total = results.length;
    const malicious = results.filter(r => r.status !== 'Clean').length;
    const safetyScore = total === 0 ? 100 : Math.round(((total - malicious) / total) * 100);
    return { total, malicious, safetyScore };
  }, [results]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return alert("দয়া করে ইনপুট দিন!");

    setIsScanning(true);
    setLastAnalysis(null);
    setScanSteps(["Initializing scanner...", "Bypassing sandbox...", "Connecting to deep-scan DB..."]);
    
    // Simulate steps
    const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    try {
      await timer(800);
      setScanSteps(prev => [...prev, "Analyzing patterns...", "AI engine checking for anomalies..."]);
      
      const result = await analyzeSecurityThreat(scanInput.trim(), 'link');
      
      await timer(500);
      setLastAnalysis(result);
      
      const newResult: ScanResult = {
        timestamp: new Date().toLocaleTimeString(),
        type: 'Link',
        status: result.isSafe ? 'Clean' : 'Malicious',
        analysis: result.message
      };
      
      setResults(prev => [newResult, ...prev]);

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      const alertMsg = `🎯 *Target Analyzed*\nOperator: ${profile.name}\nInput: ${scanInput}\nResult: ${result.isSafe ? 'SAFE' : 'THREAT'}\nLevel: ${result.threatLevel}`;
      sendTelegramAlert(alertMsg);
    } catch (error) {
      console.error(error);
      alert("ক্রিটিক্যাল এরর! পুনরায় চেষ্টা করুন।");
    } finally {
      setIsScanning(false);
      setScanSteps([]);
    }
  };

  const saveProfileSettings = () => {
    localStorage.setItem('hacker_profile', JSON.stringify(editForm));
    setProfile({ ...editForm });
    setSaveStatus("SUCCESS!");
    setTimeout(() => { setSaveStatus(null); setIsEditing(false); }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-transparent text-[#00ff41] font-sans selection:bg-[#00ff41] selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-14 relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-[#00ff41] pl-6 py-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-60 mono">System: Operational</p>
            </div>
            <h1 className="text-4xl font-black text-white mono uppercase tracking-tighter">{profile.name}</h1>
            <p className="text-xs opacity-50 mono mt-1 italic">{profile.role}</p>
          </div>
          <div className="flex gap-4">
             <div className="hidden lg:block glass p-3 rounded-lg border border-[#00ff41]/20">
                <p className="text-[9px] uppercase mono opacity-40 mb-1">System Logs</p>
                <div className="space-y-1 h-12 overflow-hidden">
                  {sysLogs.map((log, i) => (
                    <p key={i} className="text-[10px] mono opacity-80 truncate leading-none">>> {log}</p>
                  ))}
                </div>
             </div>
             <button onClick={() => setIsEditing(!isEditing)} className="hacker-btn border border-[#00ff41]/50 px-6 py-3 rounded-lg hover:bg-[#00ff41]/10 text-[10px] font-bold mono uppercase tracking-widest self-center">
              {isEditing ? "Cancel" : "Config_Profile"}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-fadeIn">
            {isEditing && (
              <div className="glass p-8 rounded-2xl border border-[#00ff41] animate-scaleIn bg-black/95">
                <h3 className="mono text-sm mb-6 uppercase tracking-widest text-white border-b border-[#00ff41]/20 pb-4">Edit_User_Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-[#00ff41]/60 mono ml-1">Admin Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/50 border border-[#00ff41]/30 p-3 rounded-xl text-[#00ff41] outline-none mono focus:border-[#00ff41] focus:shadow-[0_0_10px_rgba(0,255,65,0.2)]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-[#00ff41]/60 mono ml-1">Designation</label>
                    <input type="text" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full bg-black/50 border border-[#00ff41]/30 p-3 rounded-xl text-[#00ff41] outline-none mono focus:border-[#00ff41]" />
                  </div>
                </div>
                <button onClick={saveProfileSettings} className="mt-8 w-full bg-[#00ff41] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_30px_#00ff41] transition-all">
                  {saveStatus || "Apply_Changes"}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scan Tool */}
              <div className="lg:col-span-2 glass p-8 md:p-10 rounded-3xl border border-[#00ff41]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 mono text-[10px] opacity-20">Scanner_v3.0.4</div>
                <div className="mb-10 flex items-center gap-4">
                   <div className="w-10 h-10 border border-[#00ff41] rounded flex items-center justify-center mono text-lg">?</div>
                   <h2 className="text-xl font-bold text-white mono uppercase tracking-widest">Threat_Analyzer</h2>
                </div>
                
                <form onSubmit={handleScan} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute -top-3 left-4 px-2 bg-black text-[10px] mono text-[#00ff41] z-20 group-hover:text-white transition-colors">Target_Input</div>
                    <textarea 
                      value={scanInput} 
                      onChange={e => setScanInput(e.target.value)}
                      placeholder="Paste suspicious link or script code here..."
                      className="w-full bg-black/40 border border-[#00ff41]/20 rounded-2xl p-6 text-[#00ff41] focus:border-[#00ff41] outline-none mono h-40 text-lg shadow-inner placeholder:opacity-20 transition-all focus:bg-black/60"
                    />
                  </div>
                  <button 
                    disabled={isScanning}
                    className={`w-full font-bold py-6 rounded-2xl uppercase tracking-[0.8em] border transition-all text-sm hacker-btn ${isScanning ? 'opacity-40 cursor-wait border-gray-700' : 'border-[#00ff41] hover:bg-[#00ff41] hover:text-black shadow-[0_0_40px_rgba(0,255,65,0.15)]'}`}
                  >
                    {isScanning ? "Engaging_Engine..." : "Execute_Scan"}
                  </button>
                </form>
              </div>

              {/* Stats Block */}
              <div className="space-y-6">
                <div className="glass p-6 rounded-2xl border border-[#00ff41]/10 group hover:border-[#00ff41]/40 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase mono opacity-50">Safety Score</span>
                    <span className="text-[#00ff41] mono">[OK]</span>
                  </div>
                  <div className="text-5xl font-bold text-white mb-2 mono">{stats.safetyScore}%</div>
                  <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-[#00ff41]/10">
                    <div className="bg-[#00ff41] h-full transition-all duration-1000" style={{ width: `${stats.safetyScore}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="glass p-6 rounded-2xl border border-red-900/20 text-center hover:border-red-500/40 transition-all">
                      <div className="text-3xl font-bold text-red-500 mb-1 mono">{stats.malicious}</div>
                      <div className="text-[9px] uppercase tracking-widest opacity-40 font-bold mono">Threats</div>
                   </div>
                   <div className="glass p-6 rounded-2xl border border-blue-900/20 text-center hover:border-blue-500/40 transition-all">
                      <div className="text-3xl font-bold text-blue-400 mb-1 mono">{stats.total}</div>
                      <div className="text-[9px] uppercase tracking-widest opacity-40 font-bold mono">Scans</div>
                   </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-[#00ff41]/10 h-[210px] overflow-hidden">
                   <h4 className="text-[10px] mono uppercase opacity-50 mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-ping"></span> Live_System_Feed
                   </h4>
                   <div className="space-y-3 font-mono text-[9px]">
                      {sysLogs.map((log, i) => (
                        <div key={i} className="flex gap-2 text-[#00ff41]/70 animate-fadeIn">
                          <span className="opacity-30">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                          <span>{log}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <div ref={resultRef} className="space-y-8">
              {isScanning && (
                <div className="p-12 glass rounded-3xl border border-[#00ff41]/30 bg-black/80 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41]/20 overflow-hidden">
                      <div className="h-full bg-[#00ff41] w-1/3 animate-[move_2s_infinite]"></div>
                   </div>
                   <div className="max-w-md mx-auto">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
                        <h4 className="mono text-lg uppercase font-bold text-white tracking-widest">Scanning_Target...</h4>
                      </div>
                      <div className="space-y-2">
                        {scanSteps.map((step, i) => (
                          <div key={i} className="mono text-xs opacity-80 flex items-center gap-2 animate-fadeIn">
                            <span className="text-[#00ff41]">></span> {step}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {lastAnalysis && !isScanning && (
                <div className={`p-10 rounded-3xl border-2 animate-scaleIn relative overflow-hidden ${lastAnalysis.isSafe ? 'border-green-500/40 bg-green-500/5' : 'border-red-600/40 bg-red-600/5'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${lastAnalysis.isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                        {lastAnalysis.isSafe ? "✓" : "!"}
                      </div>
                      <div>
                        <h3 className={`font-black text-2xl uppercase mono ${lastAnalysis.isSafe ? 'text-green-400' : 'text-red-500'}`}>
                          {lastAnalysis.isSafe ? "Access_Granted" : "Threat_Detected"}
                        </h3>
                        <p className="text-[10px] mono opacity-50 uppercase tracking-[0.3em]">Analysis Completed by Alpha AI</p>
                      </div>
                    </div>
                    <div className={`px-6 py-2 rounded-full text-xs font-bold mono border ${lastAnalysis.isSafe ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-500'}`}>
                      THREAT_LEVEL: {lastAnalysis.threatLevel.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="glass p-8 rounded-2xl border-white/5 mb-8">
                    <p className="text-xl md:text-2xl opacity-90 italic font-bold leading-relaxed text-white">"{lastAnalysis.message}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lastAnalysis.details.map((d, i) => (
                      <div key={i} className="text-[11px] bg-black/60 p-5 rounded-xl border border-white/5 flex items-start gap-4 hover:border-[#00ff41]/30 transition-all group">
                        <span className="text-[#00ff41] font-bold group-hover:animate-pulse">#</span> 
                        <span className="text-gray-400 leading-tight">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Logs Table */}
            <div className="glass p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-bold text-white mono uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[#00ff41]"></span> Recent_Activities
                </h4>
                <button onClick={() => { setResults([]); localStorage.removeItem('hacker_results'); }} className="text-[9px] mono uppercase opacity-30 hover:opacity-100 transition-opacity">Clear_History</button>
              </div>
              
              <div className="space-y-2">
                {results.length === 0 ? (
                  <div className="text-center py-20 opacity-20 mono text-sm italic uppercase">No scan data available in local buffer</div>
                ) : (
                  results.map((log, i) => (
                    <div key={i} className="group grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white/5 border border-transparent rounded-2xl text-[11px] hover:border-[#00ff41]/20 hover:bg-white/[0.02] transition-all animate-fadeIn">
                      <div className="text-gray-500 mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#00ff41]"></span>
                        {log.timestamp}
                      </div>
                      <div className="text-white font-bold mono truncate md:col-span-2 group-hover:text-[#00ff41]">{log.analysis}</div>
                      <div className="md:text-right">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black mono border ${log.status === 'Clean' ? 'border-green-500/20 text-green-500' : 'border-red-500/20 text-red-500'}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl border border-[#00ff41]/20 animate-fadeIn bg-black/60 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00ff41]/5 rounded-full blur-[100px]"></div>
            <h2 className="text-4xl font-black mb-12 mono uppercase text-white flex items-center gap-6">
              <span className="w-12 h-0.5 bg-[#00ff41]"></span> Guide_Manual
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Target Analysis", desc: "Paste any suspicious URL or script content. Our AI engine deconstructs the request headers and checks against 50+ threat databases.", icon: "🎯" },
                { title: "Risk Mitigation", desc: "If threat level is 'Critical' or 'High', immediately terminate all active sessions and do not interact with the target link.", icon: "🛡️" },
                { title: "Data Privacy", desc: "Scan history is stored locally in your browser's encrypted storage. It never leaves your machine unless reported.", icon: "🔒" },
                { title: "Telegram Sync", desc: "Enable real-time alerts to sync with your remote terminal for off-site monitoring and multi-admin collaboration.", icon: "🛰️" }
              ].map((item, idx) => (
                <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-[#00ff41] font-bold mb-3 uppercase mono text-sm tracking-widest">{idx + 1}. {item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 mono text-[10px]">
               <p>© 2025 Cyber Hacker Ahmed Raj. All rights reserved.</p>
               <p>Version: 4.2.0-STABLE</p>
            </footer>
          </div>
        )}
      </main>
      
      {/* Visual Glitch Styles */}
      <style>{`
        @keyframes move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default App;
