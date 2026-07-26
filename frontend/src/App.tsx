import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Rooms } from './pages/Rooms';
import { Courses } from './pages/Courses';
import { Schedule } from './pages/Schedule';
import { Attendance } from './pages/Attendance';
import { Sidebar } from './components/Sidebar';
import { safeJsonParse } from './utils/safeJsonParse';

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => safeJsonParse(localStorage.getItem('user'), null));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = safeJsonParse(localStorage.getItem('user'), null);
    setUser(savedUser);
  }, [token]);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#070b13]">
        {/* Sidebar with Desktop & Mobile Drawer Support */}
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={handleCloseMobileMenu}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full">
          <Routes>
            <Route path="/" element={<Dashboard onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/students" element={<Students onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/teachers" element={<Teachers onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/rooms" element={<Rooms onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/courses" element={<Courses onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/schedule" element={<Schedule onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="/attendance" element={<Attendance onOpenMobileMenu={handleOpenMobileMenu} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
