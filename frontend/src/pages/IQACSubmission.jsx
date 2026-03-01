import { useNavigate } from 'react-router-dom';
import { FileCheck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';

const IQACSubmission = () => {
  const { currentUser, selectedEvent, completeEvent } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (!selectedEvent) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = () => {
    completeEvent(selectedEvent.id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">IQAC Process Submission</h2>
            <p className="text-slate-500 mt-1">Post-event documentation submission.</p>
          </div>
          
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

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
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
              <button 
                onClick={handleSubmit}
                className="btn-primary px-8"
              >
                Submit Documentation
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default IQACSubmission;
