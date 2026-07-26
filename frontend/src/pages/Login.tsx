import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, Phone, GraduationCap, AlertCircle, Loader, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import loginHeroImg from '../assets/login-hero.png';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { phone, password });
      const { access_token, user } = response.data;
      onLoginSuccess(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Tizimga kirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen flex items-center justify-center bg-[#030712] relative overflow-hidden p-3 sm:p-5 lg:p-6 select-none">
      {/* Background Dotted Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(99,102,241,0.07)_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

      {/* Decorative Fluid Mesh Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>

      {/* Main Split Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 my-auto">
        
        {/* Left Side: Visual Hero Showcase (Visible on Large Screens) */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-between p-5 xl:p-6 rounded-3xl bg-gray-950/40 border border-gray-800/50 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <Sparkles size={13} className="text-indigo-400" />
              <span>IT PARK ACADEMY • LMS & CRM PLATFORM</span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              O'quv markazingizni yangi bosqichga olib chiqing
            </h1>
            <p className="text-gray-400 text-xs xl:text-sm leading-relaxed max-w-xl">
              Barcha o'quvchilar, o'qituvchilar, guruhlar, dars jadvallari va oylik to'lovlar tahlilini yagona aqlli tizim orqali samarali boshqaring.
            </p>
          </div>

          {/* Hero Image Presentation Container */}
          <div className="relative my-4 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-900/80 max-h-[38vh] flex items-center justify-center">
              <img 
                src={loginHeroImg} 
                alt="EDU CRM Dashboard Illustration" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Floating Glass Badges */}
            <div className="absolute -bottom-3 -left-3 bg-gray-900/90 border border-gray-700/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Tizim holati</p>
                <p className="text-xs font-semibold text-white leading-none">99.9% Ishonchli & Tezkor</p>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 bg-gray-900/90 border border-gray-700/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Himoya</p>
                <p className="text-xs font-semibold text-white leading-none">Xavfsiz Kirish Tizimi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 pt-2 border-t border-gray-800/60">
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Backend API: Ishlamoqda</span>
            </div>
            <div className="text-xs text-gray-600">|</div>
            <div className="text-[11px] text-gray-400">
              Versiya: <span className="text-indigo-400 font-semibold">v2.5.0</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-gray-950/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-gray-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative before:absolute before:inset-x-0 before:-top-px before:bg-gradient-to-r before:from-transparent before:via-indigo-500/40 before:to-transparent before:h-px before:rounded-t-3xl">
            {/* Brand header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white mb-3 shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide m-0 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                EDU CRM
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">IT Park Academy admin paneliga kiring</p>
            </div>

            {/* Error box */}
            {error && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/40 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Telefon raqam</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Phone size={15} />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm glass-input placeholder-gray-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Parol</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm glass-input placeholder-gray-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-800 disabled:to-violet-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Kutilmoqda...</span>
                  </>
                ) : (
                  <span>Tizimga kirish</span>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
