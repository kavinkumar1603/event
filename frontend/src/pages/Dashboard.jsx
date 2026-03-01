import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  ChevronRight, 
  MapPin, 
  ShieldCheck,
  AlertCircle,
  FileCheck,
  FileText,
  Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, EventStatus, ODRequestStatus } from '../types';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import ODRequestDetailModal from '../components/ODRequestDetailModal';

const Dashboard = () => {
  const { 
    currentUser, 
    events, 
    odRequests,
    organizerRequests, 
    loading,
    handleApproval, 
    approveOrganizer,
    setSelectedEvent 
  } = useAppContext();
  const navigate = useNavigate();
  const [selectedODRequest, setSelectedODRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'od'

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-cse-accent mb-4" size={40} />
          <p className="text-slate-500">Loading data from Firebase...</p>
        </div>
      </div>
    );
  }

  // Filter OD requests based on user role
  const getFilteredODRequests = () => {
    if (currentUser.role === UserRole.FACULTY) {
      return odRequests.filter(r => r.status === ODRequestStatus.PENDING_FACULTY);
    }
    if (currentUser.role === UserRole.HOD) {
      return odRequests.filter(r => r.status === ODRequestStatus.PENDING_HOD);
    }
    if (currentUser.role === UserRole.PRINCIPAL) {
      return odRequests.filter(r => r.status === ODRequestStatus.PENDING_PRINCIPAL);
    }
    if (currentUser.role === UserRole.STUDENT_GENERAL || currentUser.role === UserRole.STUDENT_ORGANIZER) {
      return odRequests.filter(r => r.studentId === currentUser.id);
    }
    return [];
  };

  const filteredODRequests = getFilteredODRequests();
  const pendingODCount = filteredODRequests.filter(r => r.status.startsWith('PENDING')).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Department Dashboard</h2>
            <p className="text-slate-500 mt-1">
              Welcome back, {currentUser.name}. Manage your events and approvals.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentUser.role === UserRole.STUDENT_ORGANIZER && currentUser.isApprovedOrganizer && (
              <button onClick={() => navigate('/create-event')} className="btn-primary flex items-center gap-2">
                <Plus size={18} /> Create Event
              </button>
            )}
            {currentUser.role === UserRole.STUDENT_GENERAL && (
              <button onClick={() => navigate('/explore')} className="btn-primary flex items-center gap-2">
                <Calendar size={18} /> Explore Events
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending', value: events.filter(e => e.status?.startsWith('PENDING')).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Approved', value: events.filter(e => e.status === EventStatus.APPROVED).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Completed', value: events.filter(e => e.status === EventStatus.COMPLETED).length, icon: FileCheck, color: 'text-slate-600', bg: 'bg-slate-100' },
                { label: 'OD Requests', value: pendingODCount, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
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

            {/* Tabs for Events and OD Requests */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === 'events' 
                      ? 'bg-cse-accent text-white' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('od')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'od' 
                      ? 'bg-cse-accent text-white' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  OD Requests
                  {pendingODCount > 0 && (
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                      activeTab === 'od' ? 'bg-white text-cse-accent' : 'bg-purple-500 text-white'
                    }`}>
                      {pendingODCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Events Tab Content */}
              {activeTab === 'events' && (
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
                              onClick={() => { setSelectedEvent(event); navigate('/iqac'); }}
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
              )}

              {/* OD Requests Tab Content */}
              {activeTab === 'od' && (
                <div className="divide-y divide-slate-100">
                  {filteredODRequests.map(request => (
                    <div 
                      key={request.id} 
                      onClick={() => setSelectedODRequest(request)}
                      className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{request.studentName}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-slate-500">{request.rollNo}</span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-500">{request.eventName}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{request.eventDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === ODRequestStatus.APPROVED 
                              ? 'bg-emerald-50 text-emerald-600'
                              : request.status === ODRequestStatus.REJECTED
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-600'
                          }`}>
                            {request.status.replace(/_/g, ' ')}
                          </span>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-cse-accent" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredODRequests.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FileText size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No OD requests at the moment.</p>
                    </div>
                  )}
                </div>
              )}
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
      </main>
    </div>
  );
};

export default Dashboard;
