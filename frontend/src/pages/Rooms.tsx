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
  Home,
  Users
} from 'lucide-react';

interface RoomsProps {
  onOpenMobileMenu?: () => void;
}

export const Rooms: React.FC<RoomsProps> = ({ onOpenMobileMenu }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    capacity: 15,
  });

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (err: any) {
      setError('Xonalar ro\'yxatini yuklashda xatolik yuz berdi.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRooms();
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      capacity: 15,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
    });
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu xonani o\'chirib tashlamoqchimisiz?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  // Filter rooms based on search
  const filteredRooms = rooms.filter((room) => {
    const name = room.name.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query);
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="Xonalar Boshqaruvi" onOpenMobileMenu={onOpenMobileMenu} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
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
              placeholder="Xona nomi orqali qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Yangi xona</span>
          </button>
        </div>

        {/* Error box */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Rooms grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
            Xonalar topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="glass-card glass-card-hover rounded-2xl p-6 border-gray-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 rounded-xl">
                      <Home size={22} />
                    </div>
                    <span className="px-2.5 py-1 bg-gray-800/40 border border-gray-700/30 text-gray-400 rounded-lg text-xs font-semibold">
                      ID: #{room.id}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2">{room.name}</h4>
                  
                  <p className="text-sm text-gray-400 flex items-center gap-2 mb-6">
                    <Users size={14} className="text-gray-500" />
                    <span>Sig'imi: <b>{room.capacity}</b> nafar o'quvchi</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-800/40">
                  <button
                    onClick={() => handleOpenEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 hover:border-amber-900/50 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Tahrirlash</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>O'chirish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">
                {editingRoom ? 'Xonani Tahrirlash' : 'Yangi Xona Qo\'shish'}
              </h3>

              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Xona nomi</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="101-xona"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Sig'imi (nafar o'quvchi)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value, 10)})}
                    required
                    min={1}
                    placeholder="15"
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
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                  >
                    {submitting ? "Saqlanmoqda..." : "Saqlash"}
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
