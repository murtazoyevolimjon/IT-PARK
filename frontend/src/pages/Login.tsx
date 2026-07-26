import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, Phone, GraduationCap, AlertCircle, Loader } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#030712] relative overflow-hidden px-4">
      {/* Premium Dotted Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(99,102,241,0.06)_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

      {/* Decorative Fluid Mesh Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-gray-950/60 backdrop-blur-2xl rounded-3xl p-8 relative z-10 border border-gray-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] before:absolute before:inset-x-0 before:-top-px before:bg-gradient-to-r before:from-transparent before:via-indigo-500/30 before:to-transparent before:h-px before:rounded-t-3xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide m-0 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
            EDU CRM
          </h2>
          <p className="text-sm text-gray-400 mt-1.5">IT Park Academy admin paneliga kiring</p>
        </div>

        {/* Error box */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl text-sm flex items-start gap-3">
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input placeholder-gray-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-800 disabled:to-violet-800 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] cursor-pointer flex items-center justify-center gap-2 mt-2"
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
  );
};
