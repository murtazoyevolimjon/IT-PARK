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
  BookOpen, 
  Users,
  Calendar,
  UserSquare2
} from 'lucide-react';

interface CoursesProps {
  onOpenMobileMenu?: () => void;
}

export const Courses: React.FC<CoursesProps> = ({ onOpenMobileMenu }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'courses' | 'groups'>('courses');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Course Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseFormData, setCourseFormData] = useState({ name: '', description: '' });

  // Group Modals
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    courseId: '',
    teacherId: '',
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    try {
      const [cRes, gRes, tRes] = await Promise.all([
        api.get('/courses'),
        api.get('/courses/groups'),
        api.get('/teachers'),
      ]);
      setCourses(cRes.data);
      setGroups(gRes.data);
      setTeachers(tRes.data);
    } catch (err: any) {
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    init();
  }, []);

  // Course actions
  const handleOpenCourseCreate = () => {
    setEditingCourse(null);
    setCourseFormData({ name: '', description: '' });
    setIsCourseModalOpen(true);
  };

  const handleOpenCourseEdit = (course: any) => {
    setEditingCourse(course);
    setCourseFormData({ name: course.name, description: course.description || '' });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, courseFormData);
      } else {
        await api.post('/courses', courseFormData);
      }
      setIsCourseModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu kursni o\'chirib tashlamoqchimisiz?')) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  // Group actions
  const handleOpenGroupCreate = () => {
    setEditingGroup(null);
    setGroupFormData({
      name: '',
      courseId: courses[0]?.id ? String(courses[0].id) : '',
      teacherId: teachers[0]?.id ? String(teachers[0].id) : '',
      startDate: '',
      endDate: '',
    });
    setIsGroupModalOpen(true);
  };

  const handleOpenGroupEdit = (group: any) => {
    setEditingGroup(group);
    setGroupFormData({
      name: group.name,
      courseId: String(group.courseId),
      teacherId: String(group.teacherId),
      startDate: group.startDate ? group.startDate.split('T')[0] : '',
      endDate: group.endDate ? group.endDate.split('T')[0] : '',
    });
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      const payload = {
        name: groupFormData.name,
        courseId: Number(groupFormData.courseId),
        teacherId: Number(groupFormData.teacherId),
        startDate: groupFormData.startDate,
        endDate: groupFormData.endDate,
      };

      if (editingGroup) {
        await api.put(`/courses/groups/${editingGroup.id}`, payload);
      } else {
        await api.post('/courses/groups', payload);
      }
      setIsGroupModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu guruhni o\'chirib tashlamoqchimisiz?')) return;
    try {
      await api.delete(`/courses/groups/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  // Filters
  const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b13]">
      <Header title="Kurslar va Guruhlar Boshqaruvi" onOpenMobileMenu={onOpenMobileMenu} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation Tabs and Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800/60 pb-4">
          <div className="flex bg-gray-900/35 border border-gray-800/60 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('courses'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'courses' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Kurslar
            </button>
            <button
              onClick={() => { setActiveTab('groups'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'groups' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Guruhlar
            </button>
          </div>

          <div className="flex flex-1 w-full md:w-auto items-center justify-end gap-4">
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'courses' ? "Kurs nomi..." : "Guruh nomi..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>

            <button
              onClick={activeTab === 'courses' ? handleOpenCourseCreate : handleOpenGroupCreate}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              <span>{activeTab === 'courses' ? 'Yangi Kurs' : 'Yangi Guruh'}</span>
            </button>
          </div>
        </div>

        {/* Error box */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : activeTab === 'courses' ? (
          /* Courses Render */
          filteredCourses.length === 0 ? (
            <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
              Kurslar topilmadi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="glass-card glass-card-hover rounded-2xl p-6 border-gray-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 rounded-xl">
                        <BookOpen size={22} />
                      </div>
                      <span className="px-2.5 py-1 bg-gray-800/40 border border-gray-700/30 text-gray-400 rounded-lg text-xs font-semibold">
                        Guruhlar: {course.groups?.length || 0} ta
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">{course.name}</h4>
                    <p className="text-sm text-gray-400 mb-6 min-h-[40px] leading-relaxed">
                      {course.description || "Tavsif berilmagan."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-800/40">
                    <button
                      onClick={() => handleOpenCourseEdit(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 hover:border-amber-900/50 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Groups Render */
          filteredGroups.length === 0 ? (
            <div className="py-16 text-center text-gray-500 bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl">
              Guruhlar topilmadi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div key={group.id} className="glass-card glass-card-hover rounded-2xl p-6 border-gray-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded-lg text-xs font-semibold">
                        {group.course.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                        <Users size={12} className="text-indigo-400" />
                        <span>{group._count?.students || 0} ta o'quvchi</span>
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-3">{group.name}</h4>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <UserSquare2 size={14} className="text-gray-500" />
                        <span>O'qituvchi: <b className="text-gray-300">{group.teacher.firstName} {group.teacher.lastName}</b></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} className="text-gray-500" />
                        <span>Muddati: <b className="text-gray-300">
                          {new Date(group.startDate).toLocaleDateString('uz-UZ')} - {new Date(group.endDate).toLocaleDateString('uz-UZ')}
                        </b></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-800/40">
                    <button
                      onClick={() => handleOpenGroupEdit(group)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/30 hover:border-amber-900/50 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Course CRUD Modal */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">
                {editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Yaratish'}
              </h3>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Kurs nomi</label>
                  <input
                    type="text"
                    value={courseFormData.name}
                    onChange={(e) => setCourseFormData({...courseFormData, name: e.target.value})}
                    required
                    placeholder="General English"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Kurs tavsifi (ixtiyoriy)</label>
                  <textarea
                    value={courseFormData.description}
                    onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                    placeholder="Boshlang'ich darajalar uchun ingliz tili darslari"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/60 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
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

        {/* Group CRUD Modal */}
        {isGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-6 border-gray-800/80 glow-primary relative">
              <button 
                onClick={() => setIsGroupModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">
                {editingGroup ? 'Guruhni Tahrirlash' : 'Yangi Guruh Yaratish'}
              </h3>

              <form onSubmit={handleSaveGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Guruh nomi</label>
                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                    required
                    placeholder="English Evening 1"
                    className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Kursni Tanlang</label>
                    <select
                      value={groupFormData.courseId}
                      onChange={(e) => setGroupFormData({...groupFormData, courseId: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                    >
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">O'qituvchi</label>
                    <select
                      value={groupFormData.teacherId}
                      onChange={(e) => setGroupFormData({...groupFormData, teacherId: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input cursor-pointer"
                    >
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Boshlanish sanasi</label>
                    <input
                      type="date"
                      value={groupFormData.startDate}
                      onChange={(e) => setGroupFormData({...groupFormData, startDate: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tugash sanasi</label>
                    <input
                      type="date"
                      value={groupFormData.endDate}
                      onChange={(e) => setGroupFormData({...groupFormData, endDate: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/60 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsGroupModalOpen(false)}
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
