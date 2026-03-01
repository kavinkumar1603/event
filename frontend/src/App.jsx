import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import ExploreEvents from './pages/ExploreEvents';
import IQACSubmission from './pages/IQACSubmission';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/explore" element={<ExploreEvents />} />
          <Route path="/iqac" element={<IQACSubmission />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
