import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Header } from '../components/Header';
import { 
  Users, 
  UserSquare2, 
  Home, 
  BookOpen, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  onOpenMobileMenu?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError('Dashboard ma\'lumotlarini yuklashda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
        <Header title="Dashboard" onOpenMobileMenu={onOpenMobileMenu} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
        <Header title="Dashboard" onOpenMobileMenu={onOpenMobileMenu} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error || 'Ma\'lumotlar topilmadi'}</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const todaySchedules = data?.todaySchedules || [];
  const attendanceTrend = data?.attendanceTrend || [];
  const roomOccupancy = data?.roomOccupancy || [];

  // Stats Card Configs with safe fallback defaults
  const statCards = [
    { label: 'Jami O\'quvchilar', value: stats?.totalStudents ?? 0, sub: 'Faol o\'quvchilar', icon: Users, color: 'from-blue-600/20 to-indigo-600/20 text-blue-400', glow: 'glow-primary' },
    { label: 'Jami O\'qituvchilar', value: stats?.totalTeachers ?? 0, sub: 'Faol o\'qituvchilar', icon: UserSquare2, color: 'from-purple-600/20 to-pink-600/20 text-purple-400', glow: 'glow-primary' },
    { label: 'Jami Xonalar', value: stats?.totalRooms ?? 0, sub: 'Mavjud dars xonalari', icon: Home, color: 'from-emerald-600/20 to-teal-600/20 text-emerald-400', glow: 'glow-success' },
    { label: 'Faol Guruhlar', value: stats?.activeGroups ?? 0, sub: 'O\'tilayotgan kurslar', icon: BookOpen, color: 'from-amber-600/20 to-orange-600/20 text-amber-400', glow: 'glow-primary' },
  ];

  // Chart Data: Attendance Trend
  const trendLabels = attendanceTrend.map((t: any) => t?.date || '');
  const trendData = {
    labels: trendLabels.length ? trendLabels : ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    datasets: [
      {
        label: 'Kelganlar',
        data: attendanceTrend.map((t: any) => t?.present || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Kelmaganlar',
        data: attendanceTrend.map((t: any) => t?.absent || 0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Chart Data: Room Occupancy
  const occupancyData = {
    labels: roomOccupancy.map((r: any) => r?.name || ''),
    datasets: [
      {
        label: 'Haftalik darslar soni',
        data: roomOccupancy.map((r: any) => r?.lessonCount || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.65)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af', font: { family: 'Inter' } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', stepSize: 1 } }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="Dashboard" onOpenMobileMenu={onOpenMobileMenu} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className={`glass-card rounded-2xl p-6 flex items-center justify-between border-gray-800/60 ${card.glow}`}>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <h3 className="text-3xl font-extrabold text-white mb-1">{card.value}</h3>
                  <span className="text-xs text-gray-400 font-medium">{card.sub}</span>
                </div>
                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Unpaid Students Metric Card */}
        <div 
          onClick={() => navigate('/students?status=unpaid')}
          className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-gray-800/60 glow-primary cursor-pointer hover:bg-gray-800/10 transition-all duration-300"
        >
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <TrendingUp className="text-red-400" size={20} />
              <span>To'lov qilmagan o'quvchilar soni</span>
            </h3>
            <p className="text-sm text-gray-400">Joriy oy uchun to'lovi amalga oshirilmagan faol o'quvchilar soni (barcha ro'yxatni ko'rish uchun ustiga bosing)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-4xl font-black text-white">{stats?.unpaidActiveStudents ?? 0}</span>
              <p className="text-xs text-red-400 font-semibold mt-0.5">Ta'sirchan ko'rsatkich</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-red-950/40 bg-red-950/20 flex items-center justify-center relative overflow-hidden">
              <Users size={24} className="text-red-400" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Trend Chart */}
          <div className="glass-card rounded-2xl p-6 border-gray-800/60">
            <h3 className="text-base font-bold text-white mb-4">Haftalik Davomat Dinamikasi</h3>
            <div className="h-64 relative">
              {attendanceTrend.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                  Hozircha davomat ma'lumotlari mavjud emas
                </div>
              ) : (
                <Line data={trendData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Room Occupancy Chart */}
          <div className="glass-card rounded-2xl p-6 border-gray-800/60">
            <h3 className="text-base font-bold text-white mb-4">Xonalar Bandligi (Darslar soni)</h3>
            <div className="h-64 relative">
              {roomOccupancy.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                  Hozircha xonalar mavjud emas
                </div>
              ) : (
                <Bar data={occupancyData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-card rounded-2xl p-6 border-gray-800/60">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-indigo-400" size={18} />
            <span>Bugungi Darslar</span>
          </h3>

          {todaySchedules.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-xl">
              Bugun dars jadvali bo'sh.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-400">
                <thead>
                  <tr className="border-b border-gray-800/80 text-gray-500 font-semibold">
                    <th className="py-3 px-4">Vaqt</th>
                    <th className="py-3 px-4">Guruh</th>
                    <th className="py-3 px-4">Kurs</th>
                    <th className="py-3 px-4">O'qituvchi</th>
                    <th className="py-3 px-4">Xona</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {todaySchedules.map((sch: any) => (
                    <tr key={sch?.id} className="hover:bg-gray-800/20 transition-all">
                      <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                        <Clock size={14} className="text-indigo-400" />
                        <span>{sch?.startTime} - {sch?.endTime}</span>
                      </td>
                      <td className="py-4 px-4 text-indigo-400 font-medium">{sch?.group?.name || '-'}</td>
                      <td className="py-4 px-4 text-gray-300">{sch?.group?.course?.name || '-'}</td>
                      <td className="py-4 px-4">{sch?.group?.teacher?.firstName || ''} {sch?.group?.teacher?.lastName || ''}</td>
                      <td className="py-4 px-4 font-semibold text-white">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded-lg text-xs">
                          <MapPin size={12} />
                          <span>{sch?.room?.name || '-'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
