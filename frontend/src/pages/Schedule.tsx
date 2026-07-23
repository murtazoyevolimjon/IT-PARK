import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Header } from '../components/Header';
import { 
  Plus, 
  Trash2, 
  X, 
  AlertCircle, 
  Clock,
  UserSquare2,
  AlertTriangle
} from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Dushanba',
  TUESDAY: 'Seshanba',
  WEDNESDAY: 'Chorshanba',
  THURSDAY: 'Payshanba',
  FRIDAY: 'Juma',
  SATURDAY: 'Shanba',
  SUNDAY: 'Yakshanba',
};

export const Schedule: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conflictError, setConflictError] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    groupId: '',
    roomId: '',
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: '',
  });

  const fetchData = async () => {
    try {
      const [rRes, gRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/groups')
      ]);
      setRooms(rRes.data);
      setGroups(gRes.data);
      if (rRes.data.length > 0 && !selectedRoomId) {
        setSelectedRoomId(rRes.data[0].id.toString());
      }
    } catch (err: any) {
      setError('Xonalar va guruhlarni yuklashda xatolik yuz berdi.');
    }
  };

  const fetchSchedules = async () => {
    if (!selectedRoomId) return;
    try {
      setLoading(true);
      const response = await api.get(`/schedules?roomId=${selectedRoomId}`);
      setSchedules(response.data);
      setError('');
    } catch (err: any) {
      setError('Dars jadvalini yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [selectedRoomId]);

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setConflictError('');
    setFormData({
      groupId: groups[0]?.id?.toString() || '',
      roomId: selectedRoomId,
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:30',
    });
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');
    const payload = {
      groupId: parseInt(formData.groupId, 10),
      roomId: parseInt(formData.roomId, 10),
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, payload);
      } else {
        await api.post('/schedules', payload);
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setConflictError(err.response.data.message);
      } else {
        alert(err.response?.data?.message || 'Jadvalni saqlashda xatolik yuz berdi');
      }
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Ushbu dars darslik jadvalidan o\'chirilsinmi?')) return;
    try {
      await api.delete(`/schedules/${id}`);
      fetchSchedules();
    } catch (err: any) {
      alert('O\'chirishda xatolik yuz berdi');
    }
  };

  // Group schedules by day of week
  const schedulesByDay = DAYS.reduce((acc, day) => {
    acc[day] = schedules.filter((s) => s.dayOfWeek === day);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="Haftalik Dars Jadvali" />

      <main className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-semibold text-gray-400 whitespace-nowrap">Xonani tanlang:</span>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer min-w-[180px]"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Sig'imi: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            disabled={rooms.length === 0 || groups.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Dars Qo'shish</span>
          </button>
        </div>

        {/* General Error box */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Weekly Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS.map((day) => {
              const dayLessons = schedulesByDay[day] || [];
              const isToday = new Date().getDay() === (DAYS.indexOf(day) + 1) % 7;
              
              return (
                <div 
                  key={day} 
                  className={`glass-card rounded-2xl p-4 flex flex-col min-h-[350px] border-gray-800/60 ${
                    isToday ? 'border-indigo-500/50 bg-indigo-950/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-850/60 pb-3 mb-3">
                    <h4 className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                      {DAY_LABELS[day]}
                    </h4>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 glow-primary animate-pulse"></span>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    {dayLessons.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-gray-600 italic py-8">
                        Darslar yo'q
                      </div>
                    ) : (
                      dayLessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className="p-3 bg-gray-900/45 hover:bg-gray-900/75 border border-gray-800/70 hover:border-gray-700/60 rounded-xl relative group transition-all"
                        >
                          <button
                            onClick={() => handleDeleteSchedule(lesson.id)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                          
                          <p className="text-xs font-semibold text-indigo-400 mb-1 leading-tight">{lesson.group.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium mb-2">{lesson.group.course.name}</p>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <UserSquare2 size={10} className="text-gray-500" />
                              <span className="truncate">{lesson.group.teacher.firstName} {lesson.group.teacher.lastName[0]}.</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-white font-bold">
                              <Clock size={10} className="text-indigo-400" />
                              <span>{lesson.startTime} - {lesson.endTime}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Schedule Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">
                Yangi Dars Qo'shish
              </h3>

              {conflictError && (
                <div className="mb-4 p-4 bg-red-950/30 border border-red-900/40 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold mb-0.5">To'qnashuv aniqlandi!</h5>
                    <p className="leading-relaxed">{conflictError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Guruhni Tanlang</label>
                  <select
                    value={formData.groupId}
                    onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.course.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Xona</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                    >
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Hafta kuni</label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                    >
                      {DAYS.map(day => <option key={day} value={day}>{DAY_LABELS[day]}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Boshlanish vaqti</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tugash vaqti</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/60 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/40 text-gray-300 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                  >
                    Qo'shish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
