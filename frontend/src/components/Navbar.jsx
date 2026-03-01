import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { currentUser, handleLogout } = useAppContext();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(currentUser ? '/dashboard' : '/')}>
        <div className="w-10 h-10 bg-cse-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">CSE Event Nexus</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Department of Computer Science</p>
        </div>
      </div>
      {currentUser && (
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
