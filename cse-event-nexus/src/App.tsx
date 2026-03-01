import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  LogOut, 
  ChevronRight, 
  FileText, 
  MapPin, 
  Utensils, 
  Monitor, 
  Mic2, 
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Send,
  Camera,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, UserRole, EventRequest, EventStatus } from './types';
import { MOCK_USERS, MOCK_EVENTS } from './mockData';

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => (
  <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-cse-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
        C
      </div>
      <div>
        <h1 className="font-bold text-lg leading-tight">CSE Event Nexus</h1>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Department of Computer Science</p>
      </div>
    </div>
    {user && (
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-slate-500">{user.role.replace('_', ' ')}</p>
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

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => (
  <div className="min-h-[80vh] flex items-center justify-center p-6">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full glass-panel p-8 rounded-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-500 mt-2">Select a role to enter the portal</p>
      </div>
      <div className="space-y-3">
        {MOCK_USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => onLogin(user)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-cse-accent hover:bg-blue-50/50 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-cse-accent group-hover:text-white transition-colors">
                {user.role === UserRole.FACULTY ? <ShieldCheck size={20} /> : 
                 user.role === UserRole.HOD ? <UserCheck size={20} /> :
                 user.role === UserRole.PRINCIPAL ? <ShieldCheck size={20} /> :
                 <Users size={20} />}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-cse-accent transform group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  </div>
);

const StatusBadge = ({ status }: { status: EventStatus }) => {
  const styles = {
    [EventStatus.PENDING_FACULTY]: "bg-amber-100 text-amber-700 border-amber-200",
    [EventStatus.PENDING_HOD]: "bg-blue-100 text-blue-700 border-blue-200",
    [EventStatus.PENDING_PRINCIPAL]: "bg-purple-100 text-purple-700 border-purple-200",
    [EventStatus.APPROVED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [EventStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
    [EventStatus.COMPLETED]: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status.replace('PENDING_', '').replace('_', ' ')}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventRequest[]>(MOCK_EVENTS);
  const [view, setView] = useState<'dashboard' | 'create' | 'iqac' | 'explore'>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [organizerRequests, setOrganizerRequests] = useState<{id: string, name: string, status: 'pending' | 'approved'}[]>([
    { id: 's2', name: 'Jane Smith', status: 'pending' }
  ]);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    setView('dashboard');
  };

  const createEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent: EventRequest = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      organizerId: currentUser?.id || '',
      organizerName: currentUser?.name || '',
      date: formData.get('date') as string,
      venue: formData.get('venue') as string,
      status: EventStatus.PENDING_FACULTY,
      media: {
        poster: formData.get('media_poster') === 'on',
        brochure: formData.get('media_brochure') === 'on',
        photo: formData.get('media_photo') === 'on',
        certificate: formData.get('media_certificate') === 'on',
      },
      food: {
        available: formData.get('food_available') === 'on',
        vipMenu: formData.get('food_vip') as string,
        generalMenu: formData.get('food_general') as string,
      },
      guest: {
        name: formData.get('guest_name') as string,
        details: formData.get('guest_details') as string,
        accommodation: formData.get('guest_accommodation') === 'on',
      },
      itSupport: {
        desktop: formData.get('it_desktop') === 'on',
        lanWifi: formData.get('it_wifi') === 'on',
        numUsers: parseInt(formData.get('it_users') as string || '0'),
      },
      avSupport: {
        display: formData.get('av_display') === 'on',
        micColor: formData.get('av_mic_color') === 'on',
        micHand: formData.get('av_mic_hand') === 'on',
        micPodium: formData.get('av_mic_podium') === 'on',
      },
      createdAt: new Date().toISOString(),
    };
    setEvents([newEvent, ...events]);
    setView('dashboard');
  };

  const handleApproval = (eventId: string, approve: boolean) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        if (!approve) return { ...ev, status: EventStatus.REJECTED };
        
        switch (ev.status) {
          case EventStatus.PENDING_FACULTY: return { ...ev, status: EventStatus.PENDING_HOD };
          case EventStatus.PENDING_HOD: return { ...ev, status: EventStatus.PENDING_PRINCIPAL };
          case EventStatus.PENDING_PRINCIPAL: return { ...ev, status: EventStatus.APPROVED };
          default: return ev;
        }
      }
      return ev;
    }));
  };

  const approveOrganizer = (studentId: string) => {
    setOrganizerRequests(organizerRequests.map(req => 
      req.id === studentId ? { ...req, status: 'approved' } : req
    ));
  };

  if (!currentUser) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={null} onLogout={() => {}} />
      <Login onLogin={handleLogin} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {view === 'dashboard' && "Department Dashboard"}
              {view === 'create' && "New Event Request"}
              {view === 'explore' && "Event Explorer"}
              {view === 'iqac' && "IQAC Process Submission"}
            </h2>
            <p className="text-slate-500 mt-1">
              {view === 'dashboard' && `Welcome back, ${currentUser.name}. Manage your events and approvals.`}
              {view === 'create' && "Fill in the details to request a new event."}
              {view === 'explore' && "Discover and register for upcoming department events."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentUser.role === UserRole.STUDENT_ORGANIZER && currentUser.isApprovedOrganizer && view === 'dashboard' && (
              <button onClick={() => setView('create')} className="btn-primary flex items-center gap-2">
                <Plus size={18} /> Create Event
              </button>
            )}
            {currentUser.role === UserRole.STUDENT_GENERAL && view === 'dashboard' && (
              <button onClick={() => setView('explore')} className="btn-primary flex items-center gap-2">
                <Calendar size={18} /> Explore Events
              </button>
            )}
            {view !== 'dashboard' && (
              <button onClick={() => setView('dashboard')} className="btn-secondary">
                Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Pending', value: events.filter(e => e.status.startsWith('PENDING')).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Approved', value: events.filter(e => e.status === EventStatus.APPROVED).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Completed', value: events.filter(e => e.status === EventStatus.COMPLETED).length, icon: FileCheck, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl">
                    <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Event List / Approval Queue */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">
                    {currentUser.role === UserRole.STUDENT_ORGANIZER ? "My Event Requests" : "Approval Queue"}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {events
                    .filter(ev => {
                      if (currentUser.role === UserRole.STUDENT_ORGANIZER) return ev.organizerId === currentUser.id;
                      if (currentUser.role === UserRole.FACULTY) return ev.status === EventStatus.PENDING_FACULTY;
                      if (currentUser.role === UserRole.HOD) return ev.status === EventStatus.PENDING_HOD;
                      if (currentUser.role === UserRole.PRINCIPAL) return ev.status === EventStatus.PENDING_PRINCIPAL;
                      return false;
                    })
                    .map(event => (
                      <div key={event.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-cse-accent group-hover:text-white transition-all">
                              <Calendar size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{event.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin size={12} /> {event.venue}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock size={12} /> {event.date}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2">By {event.organizerName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={event.status} />
                            {currentUser.role !== UserRole.STUDENT_ORGANIZER && (
                              <div className="flex items-center gap-2 ml-4">
                                <button 
                                  onClick={() => handleApproval(event.id, true)}
                                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => handleApproval(event.id, false)}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Reject"
                                >
                                  <AlertCircle size={18} />
                                </button>
                              </div>
                            )}
                            {currentUser.role === UserRole.STUDENT_ORGANIZER && event.status === EventStatus.APPROVED && (
                              <button 
                                onClick={() => { setSelectedEvent(event); setView('iqac'); }}
                                className="btn-secondary text-xs py-1.5"
                              >
                                Submit IQAC
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {events.filter(ev => {
                    if (currentUser.role === UserRole.STUDENT_ORGANIZER) return ev.organizerId === currentUser.id;
                    if (currentUser.role === UserRole.FACULTY) return ev.status === EventStatus.PENDING_FACULTY;
                    if (currentUser.role === UserRole.HOD) return ev.status === EventStatus.PENDING_HOD;
                    if (currentUser.role === UserRole.PRINCIPAL) return ev.status === EventStatus.PENDING_PRINCIPAL;
                    return false;
                  }).length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <CheckCircle size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No pending requests at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Faculty Specific: Organizer Requests */}
              {currentUser.role === UserRole.FACULTY && (
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-cse-accent" /> Organizer Requests
                  </h3>
                  <div className="space-y-4">
                    {organizerRequests.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <p className="text-sm font-semibold">{req.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{req.status}</p>
                        </div>
                        {req.status === 'pending' && (
                          <button 
                            onClick={() => approveOrganizer(req.id)}
                            className="p-1.5 bg-white text-cse-accent rounded-lg border border-slate-200 hover:bg-cse-accent hover:text-white transition-all"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Department Info Card */}
              <div className="glass-panel rounded-2xl p-6 bg-cse-primary text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">CSE Department</h3>
                  <p className="text-slate-300 text-sm mb-6">Excellence in Innovation and Technology.</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Users size={16} />
                      </div>
                      <span>1,200+ Students</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <ShieldCheck size={16} />
                      </div>
                      <span>45 Faculty Members</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              {/* Quick Links */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quick Resources</h3>
                <div className="space-y-2">
                  {['Venue Booking Policy', 'IQAC Guidelines', 'Budget Templates', 'Guest Protocol'].map((link, i) => (
                    <a key={i} href="#" className="flex items-center justify-between p-2 text-sm text-slate-600 hover:text-cse-accent hover:bg-slate-50 rounded-lg transition-all">
                      {link} <ChevronRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Event Form */}
        {view === 'create' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={createEvent} className="space-y-8">
              {/* Basic Info */}
              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="text-cse-accent" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Event Title</label>
                    <input name="title" required className="input-field" placeholder="e.g. Tech Symposium 2024" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Venue</label>
                    <select name="venue" required className="input-field">
                      <option value="Seminar Hall A">Seminar Hall A</option>
                      <option value="Seminar Hall B">Seminar Hall B</option>
                      <option value="Main Lab 1">Main Lab 1</option>
                      <option value="Auditorium">Auditorium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date</label>
                    <input name="date" type="date" required className="input-field" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea name="description" required className="input-field h-24" placeholder="Briefly describe the event purpose and target audience..." />
                  </div>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Media & IT */}
                <div className="space-y-8">
                  <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Camera size={18} className="text-cse-accent" /> Media Requirements
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['Poster', 'Brochure', 'Photo', 'Certificate'].map(item => (
                        <label key={item} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:border-cse-accent transition-all">
                          <input type="checkbox" name={`media_${item.toLowerCase()}`} className="w-4 h-4 rounded border-slate-300 text-cse-accent focus:ring-cse-accent" />
                          <span className="text-sm font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Monitor size={18} className="text-cse-accent" /> IT Support
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                          <input type="checkbox" name="it_desktop" className="w-4 h-4 rounded border-slate-300 text-cse-accent" />
                          <span className="text-sm font-medium">Desktops</span>
                        </label>
                        <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                          <input type="checkbox" name="it_wifi" className="w-4 h-4 rounded border-slate-300 text-cse-accent" />
                          <span className="text-sm font-medium">LAN / WiFi</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Number of Users</label>
                        <input name="it_users" type="number" className="input-field" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food & Guest */}
                <div className="space-y-8">
                  <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Utensils size={18} className="text-cse-accent" /> Food & Refreshments
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                        <input type="checkbox" name="food_available" className="w-4 h-4 rounded border-slate-300 text-cse-accent" />
                        <span className="text-sm font-medium">Refreshments Required</span>
                      </label>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">VIP Menu (Separate)</label>
                        <input name="food_vip" className="input-field text-sm" placeholder="e.g. Executive Lunch" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">General Menu</label>
                        <input name="food_general" className="input-field text-sm" placeholder="e.g. Standard Refreshments" />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Mic2 size={18} className="text-cse-accent" /> AV Support
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'display', label: 'Display/Projector' },
                        { id: 'mic_color', label: 'Color Mic' },
                        { id: 'mic_hand', label: 'Hand Mic' },
                        { id: 'mic_podium', label: 'Podium Mic' }
                      ].map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                          <input type="checkbox" name={`av_${item.id}`} className="w-4 h-4 rounded border-slate-300 text-cse-accent" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users size={18} className="text-cse-accent" /> Guest Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Guest Name</label>
                    <input name="guest_name" className="input-field" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Designation/Details</label>
                    <input name="guest_details" className="input-field" placeholder="e.g. Senior Architect at Microsoft" />
                  </div>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer md:col-span-2">
                    <input type="checkbox" name="guest_accommodation" className="w-4 h-4 rounded border-slate-300 text-cse-accent" />
                    <span className="text-sm font-medium">Accommodation Required</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setView('dashboard')} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-12 flex items-center gap-2">
                  <Send size={18} /> Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Explore Events (General Student View) */}
        {view === 'explore' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events
              .filter(e => e.status === EventStatus.APPROVED || e.status === EventStatus.COMPLETED)
              .map(event => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${event.title}/800/600`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={event.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <StatusBadge status={event.status} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{event.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin size={14} className="text-cse-accent" /> {event.venue}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-cse-accent" /> {event.date}
                      </div>
                    </div>
                    <button className="w-full btn-primary">Register Now</button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* IQAC Submission Form */}
        {view === 'iqac' && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">IQAC Process Submission</h3>
                <p className="text-sm text-slate-500">Post-event documentation for {selectedEvent.title}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Request Letter', 'Brochure', 'Schedule', 'Registration Details',
                  'Attendance Sheet', 'Geo-tagged Photos', 'Resource Person Profile',
                  'Participant Feedback', 'Guest Feedback', 'Final Report'
                ].map(doc => (
                  <div key={doc} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-cse-accent transition-all">
                    <span className="text-sm font-medium text-slate-700">{doc}</span>
                    <button className="text-xs font-bold text-cse-accent hover:underline flex items-center gap-1">
                      <Plus size={14} /> Upload
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setView('dashboard')} className="btn-secondary">Cancel</button>
                <button 
                  onClick={() => {
                    setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status: EventStatus.COMPLETED } : e));
                    setView('dashboard');
                  }}
                  className="btn-primary px-8"
                >
                  Submit Documentation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
