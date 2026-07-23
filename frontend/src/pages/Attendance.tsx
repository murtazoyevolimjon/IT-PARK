import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Header } from '../components/Header';
import { 
  Check, 
  X, 
  AlertCircle, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Save,
  Loader
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
        setGroups(response.data);
        if (response.data.length > 0) {
          setSelectedGroupId(response.data[0].id.toString());
        }
      } catch (err: any) {
        setError('Guruhlar ro\'yxatini yuklashda xatolik yuz berdi.');
      }
    };
    fetchGroups();
  }, []);

  // Fetch attendance records when group or date changes
  const fetchAttendanceSheet = async () => {
    if (!selectedGroupId || !date) return;
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      const response = await api.get(`/attendance/group/${selectedGroupId}?date=${date}`);
      
      // Map to local state
      // If status is null, default it to 'kelgan' or keep it null to prompt user
      const initialRecords = response.data.map((r: any) => ({
        studentId: r.studentId,
        firstName: r.firstName,
        lastName: r.lastName,
        phone: r.phone,
        status: r.status || 'kelgan', // default to present if not marked
        comment: r.comment || '',
      }));
      setRecords(initialRecords);
    } catch (err: any) {
      setError('Davomat varaqasini yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSheet();
  }, [selectedGroupId, date]);

  const handleStatusChange = (studentId: number, status: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, comment } : r))
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    const payload = {
      groupId: parseInt(selectedGroupId, 10),
      date,
      records: records.map((r) => ({
        studentId: r.studentId,
        status: r.status,
        comment: r.comment,
      })),
    };

    try {
      await api.post('/attendance/bulk', payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchAttendanceSheet(); // reload
    } catch (err: any) {
      setError(err.response?.data?.message || 'Davomatni saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="Davomat Belgilash" />

      <main className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Selection Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end glass-card p-5 rounded-2xl border-gray-800/60">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Guruhni Tanlang</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer"
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.course.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sana</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSaveAttendance}
              disabled={loading || saving || records.length === 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Davomatni Saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} />
            <span>Davomat muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        {/* Attendance Sheet */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
            Ushbu guruhga o'quvchilar biriktirilmagan.
          </div>
        ) : (
          <div className="glass-card rounded-2xl border-gray-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-400">
                <thead>
                  <tr className="border-b border-gray-800/80 text-gray-500 font-semibold">
                    <th className="py-4 px-6">O'quvchi</th>
                    <th className="py-4 px-6">Telefon</th>
                    <th className="py-4 px-6 text-center">Davomat statusi</th>
                    <th className="py-4 px-6">Sabab/Izoh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {records.map((record) => (
                    <tr key={record.studentId} className="hover:bg-gray-800/20 transition-all">
                      <td className="py-4 px-6 font-semibold text-white">
                        {record.firstName} {record.lastName}
                      </td>
                      <td className="py-4 px-6 text-gray-400">{record.phone}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'kelgan')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              record.status === 'kelgan'
                                ? 'bg-emerald-950/45 border-emerald-500/65 text-emerald-400 glow-success'
                                : 'bg-gray-900/20 border-gray-800/60 text-gray-400 hover:bg-gray-800/30'
                            }`}
                          >
                            <Check size={14} />
                            <span>Kelgan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'kelmagan')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              record.status === 'kelmagan'
                                ? 'bg-red-950/45 border-red-500/65 text-red-400 glow-danger'
                                : 'bg-gray-900/20 border-gray-800/60 text-gray-400 hover:bg-gray-800/30'
                            }`}
                          >
                            <X size={14} />
                            <span>Kelmagan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'sababli')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              record.status === 'sababli'
                                ? 'bg-amber-950/45 border-amber-500/65 text-amber-400'
                                : 'bg-gray-900/20 border-gray-800/60 text-gray-400 hover:bg-gray-800/30'
                            }`}
                          >
                            <AlertTriangle size={14} />
                            <span>Sababli</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={record.comment}
                          onChange={(e) => handleCommentChange(record.studentId, e.target.value)}
                          placeholder="Izoh yozish..."
                          className="w-full px-3 py-1.5 rounded-lg text-xs glass-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
