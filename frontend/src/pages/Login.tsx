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
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#030712] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Dotted Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(99,102,241,0.07)_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

      {/* Decorative Fluid Mesh Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>

      {/* Main Split Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto">
        
        {/* Left Side: Visual Hero Showcase (Visible on Large Screens) */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-between p-6 rounded-3xl bg-gray-950/40 border border-gray-800/50 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
              <Sparkles size={14} className="text-indigo-400" />
              <span>IT PARK ACADEMY • LMS & CRM PLATFORM</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              O'quv markazingizni yangi bosqichga olib chiqing
            </h1>
            <p className="text-gray-400 text-sm xl:text-base leading-relaxed max-w-xl">
              Barcha o'quvchilar, o'qituvchilar, guruhlar, dars jadvallari va oylik to'lovlar tahlilini yagona aqlli tizim orqali samarali boshqaring.
            </p>
          </div>

          {/* Hero Image Presentation Container */}
          <div className="relative my-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-900/80">
              <img 
                src={loginHeroImg} 
                alt="EDU CRM Dashboard Illustration" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Floating Glass Badges */}
            <div className="absolute -bottom-4 -left-4 bg-gray-900/90 border border-gray-700/80 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Tizim holati</p>
                <p className="text-xs font-semibold text-white">99.9% Ishonchli & Tezkor</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-gray-900/90 border border-gray-700/80 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Himoya</p>
                <p className="text-xs font-semibold text-white">Xavfsiz Kirish Tizimi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-gray-800/60">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Backend API: Ishlamoqda</span>
            </div>
            <div className="text-xs text-gray-500">|</div>
            <div className="text-xs text-gray-400">
              Versiya: <span className="text-indigo-400 font-semibold">v2.5.0</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-gray-950/75 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative before:absolute before:inset-x-0 before:-top-px before:bg-gradient-to-r before:from-transparent before:via-indigo-500/40 before:to-transparent before:h-px before:rounded-t-3xl">
            {/* Brand header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white mb-4 shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                <GraduationCap size={36} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide m-0 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                EDU CRM
              </h2>
              <p className="text-sm text-gray-400 mt-1.5">IT Park Academy admin paneliga kiring</p>
            </div>

            {/* Error box */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/30 border border-red-900/40 text-red-400 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Telefon raqam</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input placeholder-gray-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Parol</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm glass-input placeholder-gray-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-800 disabled:to-violet-800 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
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
