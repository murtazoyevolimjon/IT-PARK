import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Header } from '../components/Header';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle, 
  Phone,
  BookOpen
} from 'lucide-react';

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    subject: '',
  });

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data);
    } catch (err: any) {
      setError('O\'qituvchilar ro\'yxatini yuklashda xatolik yuz berdi.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTeachers();
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '+998',
      subject: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phone: teacher.phone,
      subject: teacher.subject,
    });
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher.id}`, formData);
      } else {
        await api.post('/teachers', formData);
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu o\'qituvchini o\'chirib tashlamoqchimisiz?')) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  // Filter teachers based on search
  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const phone = teacher.phone.toLowerCase();
    const subject = teacher.subject.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || phone.includes(query) || subject.includes(query);
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="O'qituvchilar Boshqaruvi" />

      <main className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls and filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ustoz ismi, fani yoki telefoni..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Yangi o'qituvchi</span>
          </button>
        </div>

        {/* Error box */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Teachers Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
            O'qituvchilar topilmadi.
          </div>
        ) : (
          <div className="glass-card rounded-2xl border-gray-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-400">
                <thead>
                  <tr className="border-b border-gray-800/80 text-gray-500 font-semibold">
                    <th className="py-4 px-6">Ism va Familiya</th>
                    <th className="py-4 px-6">Yo'nalish / Mutaxassislik</th>
                    <th className="py-4 px-6">Telefon</th>
                    <th className="py-4 px-6">Guruhlar soni</th>
                    <th className="py-4 px-6 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-800/20 transition-all">
                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 flex items-center justify-center text-xs font-bold">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </div>
                        <span>{teacher.firstName} {teacher.lastName}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-indigo-400">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded-lg text-xs">
                          <BookOpen size={12} />
                          <span>{teacher.subject}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-500" />
                          <span>{teacher.phone}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-300">
                        {teacher.groups?.length || 0} ta guruh
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEdit(teacher)}
                            title="Tahrirlash"
                            className="p-2 text-amber-400 hover:text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            title="O'chirish"
                            className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
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
                {editingTeacher ? 'O\'qituvchi Ma\'lumotlarini Tahrirlash' : 'Yangi O\'qituvchi Qo\'shish'}
              </h3>

              <form onSubmit={handleSaveTeacher} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Ismi</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      placeholder="Eshmat"
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Familiyasi</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                      placeholder="Toshmatov"
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="+998911112233"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Mutaxassisligi (Fan)</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    placeholder="Matematika"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
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
                    Saqlash
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
