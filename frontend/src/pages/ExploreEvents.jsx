import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { EventStatus } from '../types';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const ExploreEvents = () => {
  const { currentUser, events } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Event Explorer</h2>
            <p className="text-slate-500 mt-1">Discover and register for upcoming department events.</p>
          </div>
          
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

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

        {events.filter(e => e.status === EventStatus.APPROVED || e.status === EventStatus.COMPLETED).length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Events Available</h3>
            <p className="text-slate-500">Check back later for upcoming events.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreEvents;
