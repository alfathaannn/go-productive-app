import { Wallet, TrendingUp, TrendingDown, PieChart, ChevronRight, ListTodo, Activity, Coffee, Smartphone, Briefcase, Utensils, MonitorPlay, Fuel, ShoppingBag, ShoppingCart, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import GradientWaves from "../components/GradientWaves";

const recentTransactions = [
  { id: 1, title: 'Gaji Bulanan', date: '5 Agu 2026', amount: 8000000, type: 'income', icon: Wallet },
  { id: 2, title: 'Beli Kopi', date: '5 Agu 2026', amount: 35000, type: 'expense', icon: Coffee },
  { id: 3, title: 'Topup e-Wallet', date: '4 Agu 2026', amount: 150000, type: 'expense', icon: Smartphone },
  { id: 4, title: 'Project Freelance', date: '3 Agu 2026', amount: 2500000, type: 'income', icon: Briefcase },
  { id: 5, title: 'Makan Malam', date: '3 Agu 2026', amount: 120000, type: 'expense', icon: Utensils },
  { id: 6, title: 'Langganan Netflix', date: '1 Agu 2026', amount: 186000, type: 'expense', icon: MonitorPlay },
  { id: 7, title: 'Beli Bensin', date: '30 Jul 2026', amount: 100000, type: 'expense', icon: Fuel },
  { id: 8, title: 'Jual Barang Bekas', date: '28 Jul 2026', amount: 450000, type: 'income', icon: ShoppingBag },
  { id: 9, title: 'Belanja Bulanan', date: '25 Jul 2026', amount: 850000, type: 'expense', icon: ShoppingCart },
  { id: 10, title: 'Service Motor', date: '22 Jul 2026', amount: 350000, type: 'expense', icon: Wrench },
];

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Banner Section (Sticky Parallax) */}
      <div className="sticky top-0 z-0">
        <div className="relative w-full shrink-0 h-56 flex flex-col items-center pt-8 overflow-hidden pb-4">
          {/* Animated Background */}
        <div className="absolute inset-0 z-0 bg-primary">
          <GradientWaves 
            horizonColor="#1B4965"
            waveColor="#62B6CB"
            crestColor="#BEE9E8"
            speed={0.4}
            amplitude={2.0}
            waveScale={0.8}
            mouseInteraction={true}
          />
        </div>

        {/* Optional: subtle background pattern or overlay */}
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        
        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 flex justify-between items-center z-20 text-[10px] text-white/50">
          <div>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div>
            designed by <a href="https://alfathaannn.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-white opacity-100 transition-opacity hover:opacity-80 font-bricolage">alfathaannn</a>
          </div>
        </div>

        <h1 className="relative z-10 text-2xl font-extrabold text-white tracking-tight font-bricolage mt-2">
          Go Productive
        </h1>
        </div>
      </div>

      {/* Content Section (Rounded Top & Overlapping Banner) */}
      <div className="relative -mt-6 bg-background rounded-t-xl flex-1 px-4 pb-32 z-20 flex flex-col">
        
        {/* Floating Card Section (Inside Content, pulled up perfectly to center) */}
        <div className="relative z-30 -mt-[18.75%] mb-6">
          <div className="w-full aspect-[16/6] bg-primary rounded-xl shadow-lg border border-secondary/20 flex flex-col justify-between p-4 sm:p-5">
            {/* Top part: Saldo */}
            <div>
              <div className="flex items-center gap-2 text-primary-foreground/80 mb-1">
                <Wallet size={16} />
                <span className="text-sm font-medium">Total Saldo</span>
              </div>
              <h2 className="text-3xl font-bold text-primary-foreground tracking-tight">
                Rp 12.500.000
              </h2>
            </div>

            {/* Bottom part: In/Out */}
            <div className="flex items-center gap-6 pt-3 mt-auto border-t border-secondary/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-secondary/20 rounded-lg">
                  <TrendingUp size={16} className="text-background" />
                </div>
                <div>
                  <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Pemasukan</p>
                  <p className="text-sm font-semibold text-primary-foreground">Rp 4.200.000</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-secondary/20 rounded-lg">
                  <TrendingDown size={16} className="text-background" />
                </div>
                <div>
                  <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Pengeluaran</p>
                  <p className="text-sm font-semibold text-primary-foreground">Rp 1.800.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Content */}
        <div className="space-y-4">
          {/* <p className="text-foreground text-sm mb-4">
            Akses menu utama aplikasi Go Productive Anda di sini.
          </p> */}

          {/* Personal Finance Card */}
          <Link to="/finance" className="block w-full">
            <div className="relative overflow-hidden bg-primary rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all active:scale-[0.98] group">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-secondary/30">
                  <PieChart className="text-secondary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary-foreground mb-0.5 tracking-tight font-bricolage">Personal Finance</h3>
                  <p className="text-xs text-primary-foreground/70 leading-relaxed line-clamp-2">
                    Catat pengeluaran, pemasukan, dan pantau kesehatan dompet Anda.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0 text-background transition-transform group-hover:translate-x-1">
                  <ChevronRight size={18} />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </Link>

          {/* Todo List Card */}
          <Link to="/todo" className="block w-full">
            <div className="relative overflow-hidden bg-primary rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all active:scale-[0.98] group">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-secondary/30">
                  <ListTodo className="text-secondary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary-foreground mb-0.5 tracking-tight font-bricolage">Todo List</h3>
                  <p className="text-xs text-primary-foreground/70 leading-relaxed line-clamp-2">
                    Kelola dan selesaikan tugas-tugas harian Anda dengan rapi.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0 text-background transition-transform group-hover:translate-x-1">
                  <ChevronRight size={18} />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </Link>

          {/* Stock Broker Chart Card */}
          <div className="relative overflow-hidden bg-primary rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="relative z-10 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center backdrop-blur-sm border border-secondary/30">
                    <Activity className="text-secondary" size={16} />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground/80 font-bricolage">Investasi & Aset</span>
                </div>
                <div className="px-2 py-1 bg-secondary/20 rounded-md border border-secondary/30">
                  <span className="text-xs font-bold text-secondary">+12.4%</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-primary-foreground tracking-tight">Rp 48.250.000</h3>
                <p className="text-[10px] text-primary-foreground/60 mt-0.5">Berhasil naik Rp 5.320.000 bulan ini</p>
              </div>

              {/* Chart SVG */}
              <div className="w-full h-24 mt-4 relative">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#62B6CB" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#62B6CB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill */}
                  <path 
                    d="M0 40 L0 30 L10 25 L20 28 L30 15 L40 22 L50 12 L60 18 L70 8 L80 10 L90 4 L100 2 L100 40 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* Stroke */}
                  <polyline 
                    points="0,30 10,25 20,28 30,15 40,22 50,12 60,18 70,8 80,10 90,4 100,2" 
                    fill="none" 
                    stroke="#62B6CB" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="drop-shadow-[0_0_4px_rgba(98,182,203,0.8)]"
                  />
                  
                  {/* Glowing dot at the end */}
                  <circle cx="100" cy="2" r="2" fill="#BEE9E8" className="animate-pulse shadow-[0_0_8px_#BEE9E8]" />
                  <circle cx="100" cy="2" r="4" fill="#BEE9E8" opacity="0.3" className="animate-ping" />
                </svg>

                {/* Vertical Grid Line for hover effect simulation */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-secondary/30 border-dashed border-l border-secondary/50 hidden"></div>
              </div>

              {/* Time Filters */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-secondary/20">
                {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((time, i) => (
                  <button key={i} className={`text-[10px] font-medium px-2 py-1 rounded-md transition-colors ${time === '1M' ? 'bg-secondary text-primary font-bold' : 'text-primary-foreground/50 hover:text-primary-foreground hover:bg-secondary/10'}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Riwayat Transaksi Section */}
          <div className="-mx-4 px-4 pt-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-foreground tracking-tight font-bricolage">Riwayat Transaksi</h3>
              <button className="text-[10px] font-bold text-primary hover:underline bg-primary/5 px-2 py-1 rounded-md">
                Lihat Semua
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {recentTransactions.map((trx) => {
                const IconComponent = trx.icon;
                return (
                  <div key={trx.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        trx.type === 'income' 
                          ? 'bg-secondary/20 text-primary group-hover:bg-secondary/30' 
                          : 'bg-primary/5 text-primary/70 group-hover:bg-primary/10'
                      }`}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight mb-0.5">{trx.title}</p>
                        <p className="text-[10px] text-foreground/60 font-medium">{trx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold tracking-tight ${
                        trx.type === 'income' ? 'text-secondary' : 'text-foreground'
                      }`}>
                        {trx.type === 'income' ? '+' : '-'}Rp {trx.amount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
