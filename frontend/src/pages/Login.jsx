import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Database, Eye, EyeOff, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { seedAllData, forceUpdateStudents } from '../seedData';
import { STUDENTS } from '../studentData';
import Navbar from '../components/Navbar';

// Credentials for staff login
const STAFF_CREDENTIALS = {
  faculty: {
    username: 'faculty',
    password: 'faculty',
    user: {
      id: 'f1',
      name: 'Dr. Arul Kumar',
      email: 'faculty@cse.edu',
      role: UserRole.FACULTY,
    }
  },
  hod: {
    username: 'hod',
    password: 'hod',
    user: {
      id: 'h1',
      name: 'Dr. Meena Iyer',
      email: 'hod@cse.edu',
      role: UserRole.HOD,
    }
  },
  principal: {
    username: 'principal',
    password: 'principal',
    user: {
      id: 'p1',
      name: 'Dr. S. Rajan',
      email: 'principal@college.edu',
      role: UserRole.PRINCIPAL,
    }
  }
};

const Login = () => {
  const { handleLogin } = useAppContext();
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically seed data on first load
    const autoSeed = async () => {
      setSeeding(true);
      const result = await seedAllData();
      setSeedStatus(result);
      setSeeding(false);
    };
    autoSeed();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check staff credentials first
    const matchedStaff = Object.values(STAFF_CREDENTIALS).find(
      cred => cred.username.toLowerCase() === username.toLowerCase() && cred.password === password
    );

    if (matchedStaff) {
      handleLogin(matchedStaff.user);
      navigate('/dashboard');
    } else {
      // Check student credentials (email as username, rollNo as password)
      const matchedStudent = STUDENTS.find(
        student => student.email.toLowerCase() === username.toLowerCase() && student.rollNo.toUpperCase() === password.toUpperCase()
      );

      if (matchedStudent) {
        handleLogin({
          id: matchedStudent.id,
          name: matchedStudent.name,
          email: matchedStudent.email,
          role: UserRole.STUDENT_GENERAL,
        });
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    }
    
    setLoading(false);
  };

  const handleManualSeed = async () => {
    setSeeding(true);
    setSeedStatus(null);
    const result = await seedAllData();
    setSeedStatus(result);
    setSeeding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-panel p-8 rounded-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to access the portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Username or Email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Password or Roll No"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Seed Database Button */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <button
              onClick={handleManualSeed}
              disabled={seeding}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              <Database size={18} />
              {seeding ? 'Seeding Database...' : 'Seed Database'}
            </button>
            <button
              onClick={async () => {
                setSeeding(true);
                const result = await forceUpdateStudents();
                setSeedStatus({ students: result });
                setSeeding(false);
              }}
              disabled={seeding}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all disabled:opacity-50"
            >
              <Users size={18} />
              {seeding ? 'Updating...' : 'Update All Students'}
            </button>
            {seedStatus && (
              <div className="mt-3 text-center text-xs space-y-1">
                {seedStatus.users && (
                  <p className={seedStatus.users?.success ? 'text-emerald-600' : 'text-red-600'}>
                    Users: {seedStatus.users?.message}
                  </p>
                )}
                <p className={seedStatus.students?.success ? 'text-emerald-600' : 'text-red-600'}>
                  Students: {seedStatus.students?.message}
                </p>
                {seedStatus.events && (
                  <p className={seedStatus.events?.success ? 'text-emerald-600' : 'text-red-600'}>
                    Events: {seedStatus.events?.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
