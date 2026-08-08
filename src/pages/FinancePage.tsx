import { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coffee, 
  Briefcase, 
  Utensils, 
  Smartphone,
  ChevronRight,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GradientWaves from '../components/GradientWaves';

// --- Mock Data ---
const initialPockets = [
  { id: 1, name: 'Makan & Minum', balance: 1500000, icon: Utensils, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { id: 2, name: 'Transportasi', balance: 500000, icon: Smartphone, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 3, name: 'Tabungan', balance: 10000000, icon: Wallet, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
];

const transactions = [
  { id: 1, title: 'Makan Malam', date: 'Hari ini, 19:30', amount: -120000, type: 'expense', icon: Utensils, pocket: 'Makan & Minum' },
  { id: 2, title: 'Topup KRL', date: 'Kemarin, 08:15', amount: -50000, type: 'expense', icon: Smartphone, pocket: 'Transportasi' },
  { id: 3, title: 'Gaji Bulanan', date: '5 Agu 2026', amount: 8000000, type: 'income', icon: Briefcase, pocket: 'Utama' },
  { id: 4, title: 'Beli Kopi', date: '5 Agu 2026', amount: -35000, type: 'expense', icon: Coffee, pocket: 'Makan & Minum' },
];

export default function FinancePage() {
  const [pockets] = useState(initialPockets);
  const [showAddPocket, setShowAddPocket] = useState(false);
  const totalBalance = 12500000;

  return (
    <div className="relative flex flex-col min-h-screen pb-32 bg-background">
      {/* Header / Total Balance Area */}
      <div className="sticky top-0 z-0">
        <div className="relative w-full shrink-0 h-[340px] flex flex-col items-center pt-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 z-0 bg-primary">
            <GradientWaves 
              horizonColor="#1B4965"
              waveColor="#62B6CB"
              crestColor="#BEE9E8"
              speed={0.4}
              amplitude={2.0}
              waveScale={0.8}
            />
          </div>
          <div className="absolute inset-0 bg-black/10 z-0"></div>

          {/* Header Content */}
          <div className="relative z-10 flex flex-col items-center w-full px-6 pt-6">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Wallet size={18} />
              <span className="text-sm font-medium tracking-wide">Total Kekayaan</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight font-bricolage">
              Rp {totalBalance.toLocaleString('id-ID')}
            </h1>
            
            <div className="mt-6 flex gap-4 w-full justify-center">
              <button className="flex-1 max-w-[140px] bg-white/20 hover:bg-white/30 active:scale-95 transition-all backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 flex flex-col items-center gap-1 shadow-lg">
                <div className="p-1.5 bg-white/20 rounded-full mb-1">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-white">Top Up</span>
              </button>
              <button className="flex-1 max-w-[140px] bg-white/20 hover:bg-white/30 active:scale-95 transition-all backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 flex flex-col items-center gap-1 shadow-lg">
                <div className="p-1.5 bg-white/20 rounded-full mb-1">
                  <ArrowDownRight size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-white">Transfer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Rounded Overlapping) */}
      <div className="relative -mt-6 bg-background rounded-t-3xl flex-1 z-20 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        
        {/* Pull Indicator */}
        <div className="w-full flex justify-center py-4">
          <div className="w-12 h-1.5 bg-secondary/30 rounded-full"></div>
        </div>

        {/* Kantong (Pockets) Section */}
        <div className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground font-bricolage flex items-center gap-2">
              Kantong Saya
            </h3>
            <button 
              onClick={() => setShowAddPocket(!showAddPocket)}
              className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-primary transition-transform active:scale-90"
            >
              <Plus size={18} className={showAddPocket ? "rotate-45 transition-transform" : "transition-transform"} />
            </button>
          </div>

          <AnimatePresence>
            {showAddPocket && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl">
                  <p className="text-sm text-foreground/70 mb-3">Pilih jenis kantong baru:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Liburan', 'Pendidikan', 'Darurat', 'Belanja'].map((k) => (
                      <button key={k} className="px-4 py-2 bg-background rounded-full text-xs font-semibold border border-secondary/20 whitespace-nowrap active:scale-95 transition-all">
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pockets Grid/List */}
          <div className="grid gap-3">
            {pockets.map((pocket, i) => {
              const Icon = pocket.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={pocket.id}
                  className="flex items-center p-4 bg-primary rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-secondary/20 active:scale-[0.98] transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${pocket.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-bold text-primary-foreground mb-0.5">{pocket.name}</h3>
                    <p className="text-lg font-bold text-primary-foreground tracking-tight font-mono">
                      Rp {pocket.balance.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-background">
                    <ChevronRight size={18} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="px-5 mb-8">
           <div className="p-5 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl border border-secondary/30 relative overflow-hidden">
             <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">Pengeluaran Bulan Ini</p>
                  <h3 className="text-2xl font-bold text-foreground font-bricolage">Rp 4.500.000</h3>
                  <div className="flex items-center gap-1 text-xs text-red-500 font-medium mt-1">
                    <TrendingUp size={14} />
                    <span>+12% dari bulan lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <MoreHorizontal size={20} className="text-foreground/50" />
                </div>
             </div>
             
             {/* Decor */}
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground font-bricolage">Transaksi Terakhir</h3>
            <button className="text-xs font-semibold text-secondary hover:text-primary transition-colors">Lihat Semua</button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx) => {
              const Icon = tx.icon;
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-secondary/10 transition-transform group-active:scale-95 ${isIncome ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/5 text-primary'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 pb-4 border-b border-secondary/10">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-foreground">{tx.title}</h4>
                      <span className={`text-sm font-bold font-mono ${isIncome ? 'text-emerald-600' : 'text-foreground'}`}>
                        {isIncome ? '+' : '-'}Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-foreground/60">
                      <span>{tx.date}</span>
                      <span className="px-2 py-0.5 bg-secondary/10 rounded-full font-medium">{tx.pocket}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
