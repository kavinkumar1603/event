import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Camera, 
  Monitor, 
  Utensils, 
  Mic2, 
  Users, 
  Send 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { EventStatus } from '../types';
import Navbar from '../components/Navbar';

const CreateEvent = () => {
  const { currentUser, createEvent } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title'),
      description: formData.get('description'),
      organizerId: currentUser?.id || '',
      organizerName: currentUser?.name || '',
      date: formData.get('date'),
      venue: formData.get('venue'),
      status: EventStatus.PENDING_FACULTY,
      media: {
        poster: formData.get('media_poster') === 'on',
        brochure: formData.get('media_brochure') === 'on',
        photo: formData.get('media_photo') === 'on',
        certificate: formData.get('media_certificate') === 'on',
      },
      food: {
        available: formData.get('food_available') === 'on',
        vipMenu: formData.get('food_vip'),
        generalMenu: formData.get('food_general'),
      },
      guest: {
        name: formData.get('guest_name'),
        details: formData.get('guest_details'),
        accommodation: formData.get('guest_accommodation') === 'on',
      },
      itSupport: {
        desktop: formData.get('it_desktop') === 'on',
        lanWifi: formData.get('it_wifi') === 'on',
        numUsers: parseInt(formData.get('it_users') || '0'),
      },
      avSupport: {
        display: formData.get('av_display') === 'on',
        micColor: formData.get('av_mic_color') === 'on',
        micHand: formData.get('av_mic_hand') === 'on',
        micPodium: formData.get('av_mic_podium') === 'on',
      },
      createdAt: new Date().toISOString(),
    };
    createEvent(newEvent);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">New Event Request</h2>
            <p className="text-slate-500 mt-1">Fill in the details to request a new event.</p>
          </div>
          
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
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
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary px-12 flex items-center gap-2">
                <Send size={18} /> Submit Request
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateEvent;
