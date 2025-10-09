import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Camera, Inbox, BarChart3, Settings, Calendar } from 'lucide-react';
import { countNewAspirasi } from '@/lib/aspirasiService';

interface AdminSidebarProps {
  active?: 'dashboard' | 'artikel' | 'gallery' | 'aspirasi' | 'kalender' | 'analytics' | 'settings';
  onClose?: () => void;
}

const AdminSidebar = ({ active, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const [newAspCount, setNewAspCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const c = await countNewAspirasi();
      if (isMounted) setNewAspCount(c);
    })();
    return () => { isMounted = false; };
  }, []);

  const baseBtn = 'w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base';
  const activeCls = 'bg-red-50 text-red-700 border border-red-200';
  const idleCls = 'text-gray-700 hover:bg-gray-50';

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg min-h-screen">
      <div className="p-4 sm:p-6 border-b">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-xs sm:text-sm text-gray-600">Manajemen Situs</p>
      </div>

      <nav className="p-2 sm:p-4">
        <div className="space-y-2">
          <button
            onClick={() => handleNavigation('/admin?tab=dashboard')}
            className={`${baseBtn} ${active === 'dashboard' ? activeCls : idleCls}`}
          >
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
            Dashboard
          </button>

          <button
            onClick={() => handleNavigation('/admin?tab=posts')}
            className={`${baseBtn} ${active === 'artikel' ? activeCls : idleCls}`}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Artikel
          </button>

          <button
            onClick={() => handleNavigation('/admin-gallery')}
            className={`${baseBtn} ${active === 'gallery' ? activeCls : idleCls}`}
          >
            <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
            Dokumentasi
          </button>

          <button
            onClick={() => handleNavigation('/admin-aspirasi')}
            className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${active === 'aspirasi' ? activeCls : idleCls}`}
          >
            <span className="flex items-center gap-2 sm:gap-3">
              <Inbox className="h-4 w-4 sm:h-5 sm:w-5" />
              Aspirasi
            </span>
            {newAspCount > 0 && (
              <span className="inline-flex items-center justify-center text-xs font-semibold bg-red-600 text-white rounded-full min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-2">
                {newAspCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavigation('/admin-kalender')}
            className={`${baseBtn} ${active === 'kalender' ? activeCls : idleCls}`}
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Kalender
          </button>

          <button
            onClick={() => handleNavigation('/admin?tab=analytics')}
            className={`${baseBtn} ${active === 'analytics' ? activeCls : idleCls}`}
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Analytics
          </button>

          <button
            onClick={() => handleNavigation('/admin?tab=settings')}
            className={`${baseBtn} ${active === 'settings' ? activeCls : idleCls}`}
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Pengaturan
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;


