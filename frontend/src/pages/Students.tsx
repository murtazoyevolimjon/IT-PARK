import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Header } from '../components/Header';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FolderPlus, 
  X, 
  AlertCircle, 
  Phone,
  Calendar,
  Check
} from 'lucide-react';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [enrollingStudent, setEnrollingStudent] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    status: 'ACTIVE',
  });
  
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err: any) {
      setError('O\'quvchilar ro\'yxatini yuklashda xatolik yuz berdi.');
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchGroups()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '+998',
      birthDate: '',
      status: 'ACTIVE',
    });
    setIsCrudModalOpen(true);
  };

  const handleOpenEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : '',
      status: student.status,
    });
    setIsCrudModalOpen(true);
  };

  const handleOpenEnroll = (student: any) => {
    setEnrollingStudent(student);
    // Preset already enrolled groups
    const currentGroupIds = student.groups.map((g: any) => g.group.id);
    setSelectedGroupIds(currentGroupIds);
    setIsEnrollModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
      } else {
        await api.post('/students', formData);
      }
      setIsCrudModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu o\'quvchini o\'chirib tashlamoqchimisiz?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  const handleSaveEnrollment = async () => {
    if (!enrollingStudent) return;
    try {
      // First link selected ones
      await api.post(`/students/${enrollingStudent.id}/groups`, { groupIds: selectedGroupIds });
      
      // Then check for any removed ones and delete link.
      const prevGroupIds = enrollingStudent.groups.map((g: any) => g.group.id);
      const removedGroupIds = prevGroupIds.filter((id: number) => !selectedGroupIds.includes(id));
      
      for (const removeId of removedGroupIds) {
        await api.delete(`/students/${enrollingStudent.id}/groups/${removeId}`);
      }

      setIsEnrollModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      alert('Guruhga biriktirishda xatolik yuz berdi');
    }
  };

  const toggleGroupSelection = (groupId: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  // Filter students based on search and status
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const phone = student.phone.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = fullName.includes(query) || phone.includes(query);
    const matchesStatus = statusFilter ? student.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="O'quvchilar Boshqaruvi" />

      <main className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls and filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 w-full md:w-auto items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O'quvchi ismi yoki telefoni..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer"
            >
              <option value="">Barcha statuslar</option>
              <option value="ACTIVE">Faol</option>
              <option value="INACTIVE">Nofaol</option>
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Yangi o'quvchi</span>
          </button>
        </div>

        {/* Error box */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Students Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
            O'quvchilar topilmadi.
          </div>
        ) : (
          <div className="glass-card rounded-2xl border-gray-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-400">
                <thead>
                  <tr className="border-b border-gray-800/80 text-gray-500 font-semibold">
                    <th className="py-4 px-6">Ism va Familiya</th>
                    <th className="py-4 px-6">Telefon</th>
                    <th className="py-4 px-6">Tug'ilgan sana</th>
                    <th className="py-4 px-6">A'zo bo'lgan sana</th>
                    <th className="py-4 px-6">Guruhlari</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-800/20 transition-all">
                      <td className="py-4 px-6 font-semibold text-white">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-500" />
                          <span>{student.phone}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {student.birthDate ? (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-gray-500" />
                            <span>{new Date(student.birthDate).toLocaleDateString('uz-UZ')}</span>
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {new Date(student.joinedAt).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {student.status !== 'ACTIVE' ? (
                            <span className="text-xs text-gray-500 italic">-</span>
                          ) : student.groups.length === 0 ? (
                            <span className="text-xs text-gray-600 italic">Biriktirilmagan</span>
                          ) : (
                            student.groups.map((g: any) => (
                              <span 
                                key={g.group.id} 
                                className="px-2 py-0.5 bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded text-[10px] font-medium"
                              >
                                {g.group.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.status === 'ACTIVE' 
                            ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-400' 
                            : 'bg-gray-850/30 border border-gray-800/40 text-gray-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                          <span>{student.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {student.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleOpenEnroll(student)}
                              title="Guruhga qo'shish"
                              className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/30 rounded-lg transition-all cursor-pointer"
                            >
                              <FolderPlus size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Tahrirlash"
                            className="p-2 text-amber-400 hover:text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
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

        {/* Create/Edit Student Modal */}
        {isCrudModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsCrudModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">
                {editingStudent ? 'O\'quvchi Ma\'lumotlarini Tahrirlash' : 'Yangi O\'quvchi Qo\'shish'}
              </h3>

              <form onSubmit={handleSaveStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Ismi</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      placeholder="Jasur"
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
                      placeholder="Raimov"
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
                    placeholder="+998901112233"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tug'ilgan sana</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                    >
                      <option value="ACTIVE">Faol</option>
                      <option value="INACTIVE">Nofaol</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/60 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCrudModalOpen(false)}
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

        {/* Enroll Student to Groups Modal */}
        {isEnrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsEnrollModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-1">Guruhlarga Biriktirish</h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">
                O'quvchi: {enrollingStudent?.firstName} {enrollingStudent?.lastName}
              </p>

              {groups.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Hozircha guruhlar yaratilmagan
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {groups.map((group) => {
                    const isSelected = selectedGroupIds.includes(group.id);
                    return (
                      <div
                        key={group.id}
                        onClick={() => toggleGroupSelection(group.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-950/20 border-indigo-500/50 text-white' 
                            : 'bg-gray-900/25 border-gray-800/40 text-gray-400 hover:bg-gray-800/20'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-white">{group.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{group.course.name} • {group.teacher.firstName} {group.teacher.lastName}</p>
                        </div>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-500 text-white' 
                            : 'border-gray-700'
                        }`}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/40 text-gray-300 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSaveEnrollment}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
